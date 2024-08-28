import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import SKMConstant from "./SKE.Constant";
import SKEController from "./SKE.Controller";
import SKMCmd from "./SKE.Cmd";
import BaseCard from "./SKE.BaseCard";
import SoundController, { SOUNDTYPE } from "./SKE.SoundController";
const { ccclass, property } = cc._decorator;

@ccclass
export default class SKEPlayer extends cc.Component {

    @property(cc.Node)
    public clockThinking: cc.Node = null;

    @property(cc.Node)
    public skeletonAura: cc.Node = null;

    @property(cc.Integer)
    public chairIntable: number = 0;

    @property(cc.Node)
    public pnUserInfo: cc.Node = null;

    @property(cc.Node)
    public spIsBanker: cc.Node = null;

    @property(cc.Node)
    public spMoneyBet: cc.Node = null;

    @property(cc.Label)
    public lbMoneyBet: cc.Label = null;
    

    @property(cc.Node)
    public skeletonThinking: cc.Node = null;

    @property(cc.Label)
    public lblNickname: cc.Label = null;

    @property(cc.Label)
    public lbUserBalance: cc.Label = null;

    @property(cc.Sprite)
    public avatar: cc.Sprite = null;

    @property(cc.Node)
    public avatarBlur: cc.Node = null;

    @property(cc.ProgressBar)
    public thinkingProgressBar: cc.ProgressBar = null;

    @property(cc.Node)
    public pnTripleKing: cc.Node = null;

    @property(cc.Node)
    public pnCards: cc.Node = null;

    @property(cc.Label)
    public lbStatus: cc.Label = null;

    @property(cc.Node)
    public pnBetResult: cc.Node = null;

    @property(cc.Node)
    public nodeSpWiner: cc.Node = null;

    @property(cc.Node)
    public nodeSpLoser: cc.Node = null;

    @property(cc.Label)
    public lbGoldWin: cc.Label = null;

    @property(cc.Label)
    public lbGoldLose: cc.Label = null;

    @property(cc.Label)
    public lblScore: cc.Label = null;

    @property(cc.Node)
    public spScore: cc.Node = null;

    @property(cc.Node)
    public nodeSkeShan: cc.Node = null;

    @property(cc.Node)
    public pnMultipleBet: cc.Node = null;

    @property(cc.Node)
    public pnMessage: cc.Node = null;

    @property(sp.Skeleton)
    public chatEmotion: sp.Skeleton = null;

    @property(cc.Node)
    public chatMsg: cc.Node = null;

    @property(cc.Node)
    public chatSprite: cc.Node = null;

    @property(cc.Node)
    public spLeave: cc.Node = null;

    @property(cc.Node)
    public pnCardScore: cc.Node = null;

    @property(cc.Node)
    public pnStateRutBai: cc.Node = null;

    private readonly arrPosCard2 = [[-15, 10, 10], [15, 5, -10]]; //x,y,rotation 
    private readonly arrPosCard3 = [[-30, 5, 15], [0, 0, 0], [25, -10, -15]]; //x,y,rotation
    private readonly arrPosCardStrip = [[-45, 4, 15], [0, 6, 0], [45, 4, -10]]; //x,y,rotation
    private readonly arrPosSpMoney: cc.Vec2[] = [
        cc.v2(0, 120), // 0
        cc.v2(0, 120),// 8
        cc.v2(200, 50),// 7
        cc.v2(210, -80),// 6
        cc.v2(0, -160),// 5
        cc.v2(0, -160),// 4
        cc.v2(-210, -80), // 3
        cc.v2(-200, 50), // 2
        cc.v2(0, 120), // 1
    ];

    private readonly posCardNodeSmall = [
        cc.v2(80, -10), // 0
        cc.v2(80, -10), // 8
        cc.v2(80, -10), // 7
        cc.v2(80, -10), // 6
        cc.v2(80, -10), // 5
        cc.v2(-80, -10), // 4
        cc.v2(-80, -10), // 3
        cc.v2(-80, -10), // 2
        cc.v2(-80, -10), // 1
    ];

    private readonly scaleCardBig = 0.7;
    private readonly scaleCardSmall = 0.5;
    private readonly posCardNodeBig = cc.v2(0, 0);

    private listCardOfPlayer: BaseCard[] = [];
    private _localListCardValue: Array<number> = [];
    private _localMultiple: number = -1;
    private _localScore: number = -1;
    private _localType: number = -1;
    private _myCardFlip: cc.Node = null;
    private _localNodeMeCardHidden: cc.Node = null;
    private _localNodePointer: cc.Node = null;

    private _localTotalTime: number = 0;
    private _localValClockTimer: number = 0;

    private info: SKMCmd.ImpPlayerInfo = null;
    private timeoutChat = null;
    private accountBalance = 0;
    public isShowCard = false;

    private _oldCardPos = null;
    private flagOpenCard = false;
    private numberCall = 0;
    // onLoad() {
    //     // TODO
    // }

    start() {
        this.offForceCountDown();
        this.hideScore();
        this.pnStateRutBai.active = false;
        this.spMoneyBet.active = false;
        this.thinkingProgressBar.progress = 1;
        this.skeletonThinking.active = false;
        this.numberCall = 0;
        this._resetResultAndReward();
        this.hideAllEffectChat();
    }

    public getInforPlayer(): SKMCmd.ImpPlayerInfo {
        return this.info;
    }

    public getAccountBalance(): number {
        return this.accountBalance;
    }

    public setValueCards(data: SKMCmd.PlayersCard): void {
        this._localListCardValue = data.cards;
        this._localMultiple = data.multiple;
        this._localScore = data.score;
        this._localType = data.type;
    }

    public getValueCards(): Array<number> {
        return this._localListCardValue;
    }

    public addValueCard(res: any): void {
        this._localListCardValue.push(res.card);
        this._localMultiple = res.multiple;
        this._localScore = res.score;
        this._localType = res.type;
    }

    private hideAllEffectChat() {
        clearTimeout(this.timeoutChat);
        this.pnMessage.active = true;
        this.chatEmotion.node.active = false;
        this.chatMsg.active = false;
        this.chatSprite.active = false;
    }

    public offForceCountDown(): void {
        // this.skeletonThinking.active = false;

        this.thinkingProgressBar.progress = 0;
        this._localTotalTime = 0;
        this.thinkingProgressBar.node.active = false;
        this.unschedule(this.updateClockCountDown);
        this.unschedule(this.updateProgressBar);
    }

    public setClockThinking(countDown: number) {
        return;
        if (countDown > 0) {
            this._localValClockTimer = countDown;
            this.schedule(this.updateClockCountDown, 1);
        } else {
            this.offForceCountDown();
        }
    }

    private updateClockCountDown() {
        this._localValClockTimer--
        if (this._localValClockTimer > 0) {
            // this.skeletonThinking.active = true;
        } else {
            this.offForceCountDown();
        }
    }

    public setProgressThinking(countDown): void {
        this._localTotalTime = countDown;
        if (countDown > 0) {
            this.thinkingProgressBar.node.active = true;
            this.thinkingProgressBar.progress = 0;
            this.schedule(this.updateProgressBar, 0.1);
        }
    }

    private updateProgressBar() {
        let progress = this.thinkingProgressBar.progress;
        progress += 1 / (this._localTotalTime * 10);
        if (progress >= 1) {
            this.offForceCountDown();
        } else {
            this.thinkingProgressBar.progress = progress;
        }
    }

    public setPlayerInfo(playerInfo: SKMCmd.ImpPlayerInfo): void {
        this.info = playerInfo;
        var nickNameExt = (playerInfo.displayName.length > 8) ? ".." : "";
        this.lblNickname.string = (playerInfo.displayName) ? playerInfo.displayName.slice(0, 8) + nickNameExt : "";
        // this.lblNickname.string = playerInfo.nickName;
        // if (this.info.isMe) {
        //     this.lblNickname.node.color = cc.color(230, 197, 63, 100)
        // }
        this.setAccountBalance((playerInfo.money) ? playerInfo.money : 0);
        this.setStatus(playerInfo.status);
        this.setNodeActive(playerInfo.active);
        if(this.checkIsActive()) {
            this.activeIsChuong(playerInfo.isChuong);
        } else {
            this.activeIsChuong(false);
        }
        // if (parseInt(playerInfo.avatar) > 0 && parseInt(playerInfo.avatar) <= 14) {
        //     this.avatar.spriteFrame = SKEController.instance.spriteAtlasAvatar.getSpriteFrame("avatar_" + playerInfo.avatar);
        // } else {
        //     this.avatar.spriteFrame = SKEController.instance.spriteAtlasAvatar.getSpriteFrame("avatar_1");
        // }
    }

    public addCard(baseCard: BaseCard) {
        if (baseCard && this.listCardOfPlayer.length < 3) {
            this.listCardOfPlayer.push(baseCard);
        }
    }

    public getStatus(): number {
        if (this.info) {
            return this.info.status;
        } else {
            return SKMConstant.PlayerState.NONE;
        }
    }

    public checkIsChuong(): boolean {
        return ((this.info) && this.info.isChuong)
    }

    public checkIsActive(): boolean {
        let status = this.getStatus() >= SKMConstant.PlayerState.WAITING;
        return ((this.info) && this.info.active) && status;
    }

    public isJoined() {
        let status = this.getStatus() > SKMConstant.PlayerState.WAITING;
        return ((this.info) && this.info.active) && status;
    }

    public isPlaying() {
        let status = this.getStatus() === SKMConstant.PlayerState.PLAYING;
        return ((this.info) && this.info.active) && status;
    }

    public isWaiting() {
        let status = this.getStatus() === SKMConstant.PlayerState.WAITING;
        return ((this.info) && this.info.active) && status;
    }

    public checkIsInTable(): boolean {
        return ((this.info) && this.info.active);
    }

    public checkIsMe(): boolean {
        return ((this.info) && this.info.isMe)
    }

    // Chia bài cho những người chơi
    public dealCardsToPlayers(): void {
        this.pnCards.removeAllChildren();
        this.pnCards.active = true;
        this.flagOpenCard = false;
        for (let i = 0; i < this.listCardOfPlayer.length; i++) {
            let _baseCard: BaseCard = this.listCardOfPlayer[i];
            let baseCardNode = _baseCard.node;
            baseCardNode.setPosition(0, 0);
            baseCardNode.setScale(0.3);
            baseCardNode.opacity = 0;
            baseCardNode.zIndex = i;
            baseCardNode.active = true;
            _baseCard.setTextureCardBack();
            this.pnCards.addChild(baseCardNode);
        }

        if (this.checkIsMe()) {
            this.runEffectCardMeChiaBai();
        } else {
            this.runEffectCardUserChiaBai();
        }
    }

    public roomNodeCard(isZoomIn: boolean, index): void {
        if (this.checkIsMe()) {
            this.pnCards.setScale(1);
            this.pnCards.setPosition(cc.v2(130, 0));
        } else {
            if (isZoomIn) {
                this.pnCards.setScale(this.scaleCardBig);
                this.pnCards.setPosition(this.posCardNodeBig);
            } else {
                if(index) {
                    this.pnCards.setScale(this.scaleCardSmall);
                    this.pnCards.setPosition(this.posCardNodeSmall[index])
                }
            }
        }
    }

    public showCardWhenUpdateInfoGame(data: SKMCmd.PlayersCard): void {
        this.pnCards.removeAllChildren();
        this.pnCards.active = true;
        this.flagOpenCard = false;
        if (data.cards.length >= 2) {
            let arrPos = data.cards.length == 3 ? this.arrPosCard3 : this.arrPosCard2;
            for (let index = 0; index < data.cards.length; index++) {
                let valCard = data.cards[index];
                let prfCard = cc.instantiate(SKEController.instance.prfCard);
                prfCard.zIndex = index;
                prfCard.active = true;
                let _baseCard = prfCard.getComponent(BaseCard);
                _baseCard.setTextureWithCode(valCard);
                this.addCard(_baseCard);

                let baseCardNode = _baseCard.node;
                baseCardNode.setPosition(cc.v2(arrPos[index][0], arrPos[index][1]));
                baseCardNode.setScale(1);
                baseCardNode.opacity = 255;
                baseCardNode.rotation = (720 - arrPos[index][2]);
                baseCardNode.zIndex = index;
                baseCardNode.active = true;
                this.pnCards.addChild(baseCardNode);
            }
        }
    }

    private getArrayPointChiaBai() {
        let convertToWorldSpaceAR = SKEController.instance.nodeChiaBai.convertToWorldSpaceAR(cc.v2(0, 0));
        return convertToWorldSpaceAR;
    }

    // Me
    public runEffectCardMeChiaBai(): void {
        let arrPos = this.listCardOfPlayer.length == 3 ? this.arrPosCard3 : this.arrPosCard2;
        let arPoint = this.getArrayPointChiaBai();
        let possition = this.pnCards.convertToNodeSpaceAR(arPoint);
        this.effectCard1OfMe(arrPos, possition);
        this.effectCard2OfMe(arrPos, possition);
    }

    public runEffectCardUserChiaBai(): void {
        let arrPos = this.listCardOfPlayer.length == 3 ? this.arrPosCard3 : this.arrPosCard2;
        let arPoint1 = this.getArrayPointChiaBai();
        let possition = this.pnCards.convertToNodeSpaceAR(arPoint1);
        this.effectCard1OfUser(arrPos, possition);
        this.effectCard2OfUser(arrPos, possition);
    }

    private effectCard1OfMe(arrPos, possition): void {
        SKEController.instance.soundControler.playMusicByType(SOUNDTYPE.DEALCARDS);
        let cardMe1 = this.pnCards.children[0];
        if (cardMe1) {
            let infoCardValue = this._localListCardValue[0];
            let posCard = cc.v2(arrPos[0][0], arrPos[0][1]);
            let rotateCard = arrPos[0][2];
            cardMe1.active = true;
            cardMe1.scale = 0.3;
            cardMe1.opacity = 100;
            cardMe1.rotation
            cardMe1.setPosition(possition);
            cardMe1.runAction(
                cc.spawn(
                    cc.fadeTo(0.1, 255),
                    cc.rotateBy(0.1, 720 - rotateCard),
                    cc.scaleTo(0.5, 1.2),
                    cc.moveTo(0.5, posCard).easing(cc.easeCubicActionIn()),
                    cc.sequence(
                        cc.scaleTo(0.5, 1),
                        cc.delayTime(0.25),
                        cc.scaleTo(0.25, 0, 1),
                        cc.callFunc(() => {
                            cardMe1.getComponent(BaseCard).setTextureWithCode(infoCardValue);
                        }),
                        cc.scaleTo(0.25, 1, 1),
                        cc.callFunc(() => {
                            cardMe1.stopAllActions();
                        })
                    )
                )
            )
        } else {
            console.error("ERROR: Không có lá bài ME 1")
        }
    }

    private effectCard2OfMe(arrPos, possition): void {
        SKEController.instance.soundControler.playMusicByType(SOUNDTYPE.DEALCARDS);
        let cardMe2 = this.pnCards.children[1];
        if (cardMe2) {
            let infoCardValue = this._localListCardValue[1];
            let posCard = cc.v2(arrPos[1][0], arrPos[1][1]);
            let rotateCard = arrPos[1][2];
            cardMe2.setPosition(possition);
            cardMe2.active = true;
            cardMe2.scale = 0.3;
            cardMe2.opacity = 100;
            cardMe2.runAction(
                cc.sequence(
                    cc.delayTime(0.4),
                    cc.spawn(
                        cc.fadeTo(0.1, 255),
                        cc.rotateBy(0.1, 720 - rotateCard),
                        cc.scaleTo(0.25, 1.2),
                        cc.moveTo(0.5, posCard).easing(cc.easeCubicActionIn()),
                        cc.sequence(
                            cc.delayTime(0.5),
                            cc.scaleTo(0.5, 1),
                            cc.delayTime(0.25),
                            cc.scaleTo(0.25, 0, 1),
                            cc.scaleTo(0.25, 1, 1),
                            cc.callFunc(() => {
                                cardMe2.getComponent(BaseCard).setTextureWithCode(infoCardValue);
                                cardMe2.stopAllActions();
                                this.createNodeVirtualCardForMe(posCard, -rotateCard);
                            })
                        )
                    )
                )
            )
        } else {
            console.error("ERROR: Không có lá bài ME 2")
        }
    }

    private effectCard3OfMe(arrPos): void {
        let infoCard3 = this.listCardOfPlayer[2];
        let arPoint = this.getArrayPointChiaBai();
        let possition = this.pnCards.convertToNodeSpaceAR(arPoint);
        if (infoCard3) {
            SKEController.instance.soundControler.playMusicByType(SOUNDTYPE.DEALCARDS);
            let posCard = cc.v2(arrPos[2][0], arrPos[2][1]);
            let rotateCard = arrPos[2][2];
            let nodeCardValue = infoCard3.node;
            nodeCardValue.setPosition(possition);
            nodeCardValue.scale = 0.3;
            nodeCardValue.opacity = 100;
            nodeCardValue.rotation = 0;
            nodeCardValue.zIndex = 2;
            nodeCardValue.active = true;
            this.pnCards.addChild(nodeCardValue);

            let cardItem = infoCard3.getComponent(BaseCard);
            cardItem.setTextureCardBack();

            nodeCardValue.runAction(
                cc.spawn(
                    cc.fadeTo(0.1, 255),
                    cc.rotateBy(0.1, 720 - rotateCard),
                    cc.scaleTo(0.25, 1.2),
                    cc.moveTo(0.5, posCard).easing(cc.easeCubicActionIn()),
                    cc.sequence(
                        cc.delayTime(0.5),
                        cc.scaleTo(0.5, 1),
                        cc.delayTime(0.25),
                        cc.scaleTo(0.25, 0, 1),
                        cc.scaleTo(0.25, 1, 1),
                        cc.callFunc(() => {
                            nodeCardValue.getComponent(BaseCard).setTextureWithCode(this._localListCardValue[2]);
                            nodeCardValue.stopAllActions();
                            this.createNodeVirtualCardForMe(posCard, -rotateCard);
                        })
                    )
                )
            );
        }
    }

    private effectCard1OfUser(arrPos, possition): void {
        SKEController.instance.soundControler.playMusicByType(SOUNDTYPE.DEALCARDS);
        let card1 = this.pnCards.children[0];
        if (card1) {
            let posCard = cc.v2(arrPos[0][0], arrPos[0][1]);
            let rotateCard = arrPos[0][2];
            let actionFlyingCard = this.actionFlyingOfCardUser(posCard, rotateCard);
            card1.active = true;
            card1.scale = 0.3;
            card1.opacity = 100;
            card1.setPosition(possition);
            card1.getComponent(BaseCard).setTextureCardBack();
            card1.runAction(actionFlyingCard)
        } else {
            console.error("ERROR: Không có lá bài USER 1")
        }
    }

    private effectCard2OfUser(arrPos, possition): void {
        SKEController.instance.soundControler.playMusicByType(SOUNDTYPE.DEALCARDS);
        let card2 = this.pnCards.children[1];
        if (card2) {
            let posCard = cc.v2(arrPos[1][0], arrPos[1][1]);
            let rotateCard = arrPos[1][2];
            let actionFlyingCard = this.actionFlyingOfCardUser(posCard, rotateCard);

            card2.active = true;
            card2.scale = 0.3;
            card2.opacity = 100;
            card2.setPosition(possition);
            card2.getComponent(BaseCard).setTextureCardBack();
            card2.runAction(
                cc.sequence(
                    cc.delayTime(0.4),
                    cc.callFunc(() => {
                        SKEController.instance.soundControler.playMusicByType(SOUNDTYPE.DEALCARDS)
                    }),
                    actionFlyingCard
                )
            )
        } else {
            console.error("ERROR: Không có lá bài USER 2")
        }
    }

    private addCard3OfUserToGame(): void {
        SKEController.instance.soundControler.playMusicByType(SOUNDTYPE.DEALCARDS)
        let arrPos = this.arrPosCard3;
        var _thirdCard = this.listCardOfPlayer[2];
        _thirdCard.node.parent = null;
        // nCard.node.setPosition(40, 0);
        _thirdCard.node.scale = 0.3;
        _thirdCard.node.opacity = 100;
        _thirdCard.node.rotation = 0;
        _thirdCard.node.zIndex = 2;
        _thirdCard.node.active = true;
        this.pnCards.addChild(_thirdCard.node);

        let posCard = cc.v2(arrPos[2][0], arrPos[2][1]);
        let rotateCard = arrPos[2][2];
        let actionFlyingCard = this.actionFlyingOfCardUser(posCard, rotateCard);
        let cardItem = _thirdCard.getComponent(BaseCard);
        cardItem.setTextureCardBack()

        let arPoint3 = this.getArrayPointChiaBai();
        let pos3 = this.pnCards.convertToNodeSpaceAR(arPoint3);
        _thirdCard.node.setPosition(pos3)
        _thirdCard.node.runAction(actionFlyingCard);
    }

    private actionFlyingOfCardUser(posCard, rotateCard) {
        return cc.spawn(
            cc.fadeTo(0.25, 255),
            cc.rotateBy(0.25, 720 - rotateCard),
            cc.scaleTo(0.35, 1.8),
            cc.moveTo(0.5, posCard).easing(cc.easeCubicActionIn()),
            cc.sequence(cc.delayTime(0.5), cc.scaleTo(0.5, 1))
        );
    }

    private createNodeVirtualCardForMe(position, rotation): void {
        let nodeVirtualCard = cc.instantiate(this.listCardOfPlayer[0].node);
        this._localNodeMeCardHidden = nodeVirtualCard;
        nodeVirtualCard.setPosition(position);
        nodeVirtualCard.active = true;
        nodeVirtualCard.rotation = rotation;
        nodeVirtualCard.zIndex = 3;
        nodeVirtualCard.opacity = 255;
        this.pnCards.addChild(nodeVirtualCard);

        let cardItem = nodeVirtualCard.getComponent(BaseCard);
        cardItem.setTextureCardBack();
        this.isShowCard = false;
        this.runEffectPointer();
        this.onEventTouchOfMe();
    }

    public runEffectCardUserRutBai(): void {
        if (this._localNodeMeCardHidden && !this.isShowCard) {
            return;
        }
        let arrPos = this.listCardOfPlayer.length == 3 ? this.arrPosCard3 : this.arrPosCard2;
        let _firstCard = this.pnCards.children[0];
        let _secondCard = this.pnCards.children[1];

        if (_firstCard) {
            _firstCard.runAction(cc.sequence(
                cc.spawn(cc.moveTo(0.2, cc.v2(arrPos[0][0], arrPos[0][1])), cc.rotateTo(0.2, -arrPos[0][2])),
                cc.callFunc(() => {
                    _firstCard.stopAllActions();
                })
            ));
        }

        if (_secondCard) {
            _secondCard.runAction(cc.sequence(
                cc.spawn(cc.moveTo(0.2, cc.v2(arrPos[1][0], arrPos[1][1])), cc.rotateTo(0.2, -arrPos[1][2])),
                cc.callFunc(() => {
                    _secondCard.stopAllActions();
                })
            ));
        }

        if (this.listCardOfPlayer[2]) {
            this.addCard3OfUserToGame();
        }
    }

    // Tự động mở các lá bài đang ẩn
    public autoOpenHiddenCards(): void {
        if (this.info) {
            let posCard  = cc.v2(150, 0);
            this.stopEffectPointer();
            if (this._localNodeMeCardHidden instanceof cc.Node && !this.isShowCard) {
                this._localNodeMeCardHidden.runAction(
                    cc.sequence(
                        cc.fadeIn(0.1),
                        cc.spawn(cc.moveTo(0.1, posCard), cc.fadeOut(0.1)),
                        cc.callFunc(() => {
                            this._localNodeMeCardHidden.active = false;
                            this._localNodeMeCardHidden.stopAllActions();
                            this._localNodeMeCardHidden.removeFromParent();
                            this._localNodeMeCardHidden = null;
                            this.isShowCard = true;
                        })
                    )
                );
                this.offEventTouchOfMe();
            }
        }
    }

    public runEffectPointer(): void {
        if (this.isShowCard == false && this._localNodeMeCardHidden) {
            this._localNodePointer = new cc.Node();
            this._localNodePointer.addComponent(cc.Sprite).spriteFrame = SKEController.instance.sprPointer;
            let spPointer = this._localNodePointer.getComponent(cc.Sprite);
            spPointer.spriteFrame = SKEController.instance.sprPointer;
            this.pnCards.addChild(this._localNodePointer, 9999);
            let fromPos = this._localNodeMeCardHidden.getPosition();
            this._localNodePointer.setPosition(fromPos);
            cc.tween(this._localNodePointer).repeatForever(cc.tween().by(0.5, { position: cc.v3(70, 0, 0) }).then(cc.tween().to(0.5, { position: fromPos }))).start();
        }
    }

    public stopEffectPointer(): void {
        cc.tween(this._localNodePointer).stop();
        if (this._localNodePointer) {
            this._localNodePointer.removeFromParent();
            this._localNodePointer = null;
        }
    }

    public runEffectCardMeRutBai(): void {
        if (this._localNodeMeCardHidden && !this.isShowCard) {
            return;
        }
        if (this.listCardOfPlayer.length >= 3 && this.pnCards.children.length == 2) {
            let card1 = this.pnCards.children[0];
            let card2 = this.pnCards.children[1];

            if (card1) {
                let posCard1 = cc.v2(this.arrPosCard3[0][0], this.arrPosCard3[0][1]);
                let rotateCard1 = -this.arrPosCard3[0][2];
                card1.runAction(cc.sequence(
                    cc.spawn(cc.moveTo(0.2, posCard1), cc.rotateTo(0.2, rotateCard1)),
                    cc.callFunc(() => {
                        card1.stopAllActions();
                    })
                ));
            }

            if (card2) {
                let posCard2 = cc.v2(this.arrPosCard3[1][0], this.arrPosCard3[1][1]);
                let rotateCard2 = -this.arrPosCard3[1][2];
                card2.runAction(cc.sequence(
                    cc.spawn(cc.moveTo(0.2, posCard2), cc.rotateTo(0.2, rotateCard2)),
                    cc.callFunc(() => {
                        card2.stopAllActions();
                    })
                ));
            }

            this.effectCard3OfMe(this.arrPosCard3);
        }

    }

    public throwMoneyToTable(roomBet: number, money: number): void {
        let isActive = (money > 0);
        let strMoney = this.convert2Label(money);
        this.lbMoneyBet.string = strMoney.toString();
        this.spMoneyBet.active = isActive;
        if (isActive) {
            SKEController.instance.soundControler.playMusicByType(SOUNDTYPE.BET);
        }
    }

    public convert2Label(num) {
        if (!num) {
            return 0;
        }

        let data = num;
        let returnKey = '';
        if ((data / 1000) >= 1) {
            data = data / 1000
            returnKey = "K";
            if ((data / 1000) >= 1) {
                data = data / 1000
                returnKey = "M";
                if ((data / 1000) >= 1) {
                    data = data / 1000
                    returnKey = "B";
                    if ((data / 1000) >= 1) {
                        data = data / 1000
                        returnKey = "T";
                    }
                }
            }
        }

        if (!this.isInt(data)) {
            if (data > 100) {
                data = data.toFixed(1)
            } else if (data > 10) {
                data = data.toFixed(2)
            } else {
                data = data.toFixed(2);
            }
        }
        return data + returnKey;
    }

    public isInt(num) {
        return num % 1 === 0;
    }

    public activeIsChuong(isShow: boolean): void {
        this.spIsBanker.active = isShow;
    }

    /// Here
    public effectOpenCard(arrayCardInfo: Array<number>, multiple: number, score: number, type: number) {
        if (this.flagOpenCard || this.checkIsMe()) {
            return;
        }

        this.flagOpenCard = true;
        let arrPos = this.listCardOfPlayer.length == 3 ? this.arrPosCard3 : this.arrPosCard2;
        let infoCardFirst = cc.v2(arrPos[0][0], arrPos[0][1]);
        let rotateCardFirst = arrPos[0][2];
        this.roomNodeCard(true, null);
        let card1 = this.listCardOfPlayer[0];
        let card2 = this.listCardOfPlayer[1];
        let card3 = this.listCardOfPlayer[2];
        if(card1) {
            card1.node.runAction(cc.sequence(
                cc.spawn(cc.rotateTo(0.3, -rotateCardFirst), cc.moveTo(0.3, infoCardFirst), cc.scaleTo(0.2, 0, 1)),
                cc.callFunc(() => {
                    card1.node.getComponent(BaseCard).setTextureWithCode(arrayCardInfo[0]);
                }),
                cc.spawn(cc.rotateTo(0.3, -arrPos[0][2]), cc.scaleTo(0.3, 1), cc.moveTo(0.3, arrPos[0][0], arrPos[0][1])),
                cc.callFunc(() => {
                    this.flagOpenCard = true;
                    card1.node.stopAllActions();
                })
            ));
        }
        if (card2) {
            card2.node.runAction(cc.sequence(
                cc.delayTime(0.05),
                cc.spawn(cc.rotateTo(0.3, -rotateCardFirst), cc.moveTo(0.3, infoCardFirst), cc.scaleTo(0.2, 0, 1)),
                cc.callFunc(() => {
                    card2.node.getComponent(BaseCard).setTextureWithCode(arrayCardInfo[1]);
                }),
                cc.spawn(cc.rotateTo(0.3, -arrPos[1][2]), cc.scaleTo(0.3, 1), cc.moveTo(0.3, arrPos[1][0], arrPos[1][1])),
                cc.callFunc(() => {
                    this.flagOpenCard = true;
                    card2.node.stopAllActions();
                })
            ));
        }
        if (card3) {
            card3.node.runAction(cc.sequence(
                cc.delayTime(0.05),
                cc.spawn(cc.rotateTo(0.3, -rotateCardFirst), cc.moveTo(0.3, infoCardFirst), cc.scaleTo(0.2, 0, 1)),
                cc.callFunc(() => {
                    card3.node.getComponent(BaseCard).setTextureWithCode(arrayCardInfo[2]);
                }),
                cc.spawn(cc.rotateTo(0.3, -arrPos[2][2]), cc.scaleTo(0.3, 1), cc.moveTo(0.3, arrPos[2][0], arrPos[2][1])),
                cc.callFunc(() => {
                    this.flagOpenCard = true;
                    card3.node.stopAllActions();
                    if(type == 3) {
                        this.showThreeSameCards();
                    }
                })
            ));
        }
    }

    public _onTouchBegin(event) {
        // convertTouchToNodeSpaceAR
        let touch_localpos = this.node.convertTouchToNodeSpaceAR(event.touch);//Convert the touch point to the location in the local coordinate system
        let touch_worldpos = this.node.convertToWorldSpaceAR(touch_localpos);//Convert a point to the world space coordinate system
        let touch = event.touch;
        if (cc.sys.isNative && touch.getID() != 0) {
            return false
        }

        if (this.isShowCard) {
            return;
        } else {
            if (this._localNodeMeCardHidden) {
                let card = this._localNodeMeCardHidden;
                let cworldpos = card.convertToWorldSpaceAR(cc.v2(0, 0));
                let disvt = touch_worldpos.sub(cworldpos);
                if (Math.abs(disvt.x) < 70 * 1.5 && Math.abs(disvt.y) < 90 * 1.5) {
                    this._myCardFlip = card;
                    this._oldCardPos = card.getPosition();
                }
            }
        }

        return true;
    }

    public _onTouchMoved(event) {
        let touch = event.touch;
        if (cc.sys.isNative && touch.getID() != 0) {
            return false;
        }

        if (!this._myCardFlip) return;

        this._myCardFlip.zIndex = 10000;
        var touchLocal = this.node.convertToNodeSpaceAR(touch.getLocation())
        if (!this.isShowCard) {
            if (touchLocal.x > this._oldCardPos.x) {
                if ((touchLocal.x - this._oldCardPos.x) > 35) {
                    this._myCardFlip.x = this._oldCardPos.x + 35;
                    this.stopEffectPointer();
                    this._myCardFlip.runAction(cc.sequence(cc.fadeIn(0.1), cc.spawn(cc.moveTo(0.5, 135, 0), cc.fadeOut(0.5)), cc.callFunc(() => {
                        this.isShowCard = true;
                        this._myCardFlip.active = false;
                        this._myCardFlip.removeFromParent();
                        if (this.checkIsMe()) {
                            this.showResultOfCards(this._localMultiple, this._localScore, this._localType);
                        }
                    })));
                    this.offEventTouchOfMe();
                    return;
                }

                if (touchLocal.x - this._oldCardPos.x > 135) {
                    this._myCardFlip.x = this._oldCardPos.x + 135;
                } else {
                    this._myCardFlip.x = touchLocal.x;
                }
            } else {
                this._myCardFlip.x = this._oldCardPos.x;
            }
            return;
        }
        return;
    }

    public autoShowResultCard() {
        this.showResultOfCards(this._localMultiple, this._localScore, this._localType);
    }

    public showResultOfCards(multiplier: number, score: number, type: number) {
        this.hideScore();
        this.pnMultipleBet.y = 60;
        this.showMultipleBet(multiplier);
        if (type == 0) {
            this.pnCardScore.active = true;
            this.spScore.active = true;
            this.lblScore.string = score.toString() + " " + LanguageMgr.getString("shankoemee.skm_card_score");
        } else {
            switch (type) {
                case 1:
                    this.pnMultipleBet.y = 35;
                    SKEController.instance.soundControler.playMusicByType(SOUNDTYPE.SHAN)
                    this.pnCardScore.active = true;
                    this.nodeSkeShan.active = true;
                    this.nodeSkeShan.getComponent(sp.Skeleton).setAnimation(0, "shan8", true);
                    break;

                case 2:
                    this.pnMultipleBet.y = 35;
                    SKEController.instance.soundControler.playMusicByType(SOUNDTYPE.SHAN);
                    this.pnCardScore.active = true;
                    this.nodeSkeShan.active = true;
                    this.nodeSkeShan.getComponent(sp.Skeleton).setAnimation(0, "shan9", true);
                    break;
            }
        }
    }

    private showThreeSameCards() {
        let card1 = this.pnCards.children[0];
        let card2 = this.pnCards.children[1];
        let card3 = this.pnCards.children[2];
        if (card1 && card2 && card3) {
            this.pnTripleKing.active = true;
            let pos1 = cc.v2(this.arrPosCardStrip[0][0], this.arrPosCardStrip[0][1]);
            let rotate1 = this.arrPosCardStrip[0][2];
            card1.setPosition(pos1);
            card1.rotation = 720 - rotate1;
            let pos2 = cc.v2(this.arrPosCardStrip[1][0], this.arrPosCardStrip[1][1]);
            let rotate2 = this.arrPosCardStrip[1][2];
            card2.setPosition(pos2);
            card2.rotation = 720 - rotate2;
            let pos3 = cc.v2(this.arrPosCardStrip[2][0], this.arrPosCardStrip[2][1]);
            let rotate3 = this.arrPosCardStrip[2][2];
            card3.setPosition(pos3);
            card3.rotation = 720 - rotate3;
        }
    }

    public _onTouchEnd(event) {
        let touch = event.touch;
        if (cc.sys.isNative && touch.getID() != 0) {
            return false
        }

        // let _point = event.touch.getLocation();
        // let point = this.node.convertToNodeSpaceAR(_point);

        if (this._myCardFlip && !this.isShowCard) {
            this._myCardFlip.zIndex = 2;
            this._myCardFlip.setPosition(this._oldCardPos);
            this._oldCardPos = null;
            this._myCardFlip = null;
        }
    }

    private showMultipleBet(multiple: number) {
        if (multiple > 1) {
            this.pnMultipleBet.active = true;
            if (multiple == 2) {
                this.pnMultipleBet.getComponent(sp.Skeleton).setAnimation(0, "x2", true)
            }
            if (multiple == 3) {
                this.pnMultipleBet.getComponent(sp.Skeleton).setAnimation(0, "x3", true)
            }
            if (multiple == 4) {
                this.pnMultipleBet.getComponent(sp.Skeleton).setAnimation(0, "x4", true)
            }
            if (multiple == 5) {
                this.pnMultipleBet.getComponent(sp.Skeleton).setAnimation(0, "x5", true)
            }
        }
    }

    public hideScore(): void {
        this.pnCardScore.active = false;
        this.nodeSkeShan.active = false
        this.spScore.active = false
        this.pnMultipleBet.active = false;
    }

    private _resetResultAndReward(): void {
        this.pnBetResult.active = true;
        this.lbGoldLose.node.active = false;
        this.lbGoldWin.node.active = false;
        this.nodeSpWiner.active = false;
        this.nodeSpLoser.active = false;
        this.skeletonAura.active = false;
        this.pnTripleKing.active = false;
    }

    public setBonusAmount(money: number, isLoser: boolean): void {
        if (isLoser) {
            for (let i = 0; i < this.listCardOfPlayer.length; i++) {
                let nodeCard = this.listCardOfPlayer[i];
                nodeCard.node.getChildByName("SpBlur").active = true;
            }
            this.nodeSpLoser.active = true;
            // this.effectMoneyLoser(money);
        } else {
            this.nodeSpWiner.active = true;
            this.skeletonAura.active = true;
            // this.effectMoneyWin(money);
        }
    }

    public effectMoneyLoser(money: number) {
        this.pnBetResult.active = true;
        var scaleText = 0.65;
        let posEnd = cc.v2(0, 75);
        let posStart = cc.v2(0, -10);

        var tempMoney = (money < 0) ? money * -1 : money;
        var strMoney = this.convert2Label(tempMoney);
        this.lbGoldLose.node.setPosition(posStart);
        this.lbGoldLose.node.active = true;
        this.lbGoldLose.node.opacity = 200;
        this.lbGoldLose.string = "-" + strMoney;
        this.lbGoldLose.node.runAction(
            cc.sequence(
                cc.spawn((cc.fadeTo(0.3, 255)), cc.scaleTo(0.1, scaleText).easing(cc.easeBounceOut())),
                cc.moveBy(0.5, posEnd),
                cc.callFunc(() => {
                    this.lbGoldLose.node.stopAllActions();
                })
            )
        );
    }

    public effectMoneyWin(money: number) {
        this.pnBetResult.active = true;
        var scaleText = 0.65;
        let posEnd = cc.v2(0, 75);
        let posStart = cc.v2(0, -10);

        this.lbGoldWin.node.setPosition(posStart);
        var strMoney = this.convert2Label(money);
        this.lbGoldWin.node.active = true;
        this.lbGoldWin.node.opacity = 200;
        this.lbGoldWin.string = "+" + strMoney;
        this.lbGoldWin.node.runAction(
            cc.sequence(
                cc.spawn((cc.fadeTo(0.3, 255)), cc.scaleTo(0.1, scaleText).easing(cc.easeBounceOut())),
                cc.moveBy(0.5, posEnd),
                cc.callFunc(() => {
                    this.lbGoldWin.node.stopAllActions();
                })
            )
        );
    }

    public setNodeActive(isActive: boolean): void {
        this.node.active = isActive;
    }

    public setStatus(status = 0): void {
        this.lbStatus.node.active = false;
        this.avatarBlur.active = false;
        switch (status) {
            case SKMConstant.PlayerState.NONE:
                // TODO
                break;

            case SKMConstant.PlayerState.VIEWING:
                this.avatarBlur.active = true;
                break;

            case SKMConstant.PlayerState.WAITING:
                // TODO
                break;

            case SKMConstant.PlayerState.PLAYING:
                // TODO
                break;
        }
    }

    public setAccountBalance(balance: number): void {
        this.accountBalance = balance;
        this.info.money = balance;
        if (this.checkIsMe()) {
            SKEController.instance.lbMyBalance.string = BGUI.StringUtils.formatNumber(balance);
            BGUI.UserManager.instance.mainUserInfo.vinTotal = balance;
            BGUI.EventDispatch.instance.emit(BGUI.EVENT_GAMECORE.UPDATE_TOTAL_GOLD, BGUI.UserManager.instance.mainUserInfo.vinTotal);
            SKEController.instance.setMyBalance(balance);
        }
        let strMoneyConvert = this.convert2Label(balance).toString();
        this.lbUserBalance.string = strMoneyConvert;
    }

    public addBalance(money: number): void {
        let newMoney = this.info.money + money;
        this.accountBalance = newMoney;
        this.info.money = newMoney;
        if (this.checkIsMe()) {
            SKEController.instance.lbMyBalance.string = BGUI.StringUtils.formatNumber(newMoney);
            BGUI.UserManager.instance.mainUserInfo.vinTotal = newMoney;
            BGUI.EventDispatch.instance.emit(BGUI.EVENT_GAMECORE.UPDATE_TOTAL_GOLD, BGUI.UserManager.instance.mainUserInfo.vinTotal);
        }
        let strMoneyConvert = this.convert2Label(newMoney).toString();
        this.lbUserBalance.string = strMoneyConvert;
    }

    public showSpLeaveRoom(isLeave): void {
        this.spLeave.active = isLeave;
    }

    public getCardById(id: number): cc.Node {
        for (let i = 0; i < this.listCardOfPlayer.length; i++) {
            let card = this.listCardOfPlayer[i];
            if (card.idxCard == id) {
                this.listCardOfPlayer.splice(i, 1)
                this._localListCardValue.splice(i, 1)
                return card.node;
            }
        }
        return null;
    }

    public runEffectDealCards(): void {
        if (this.info && this.checkIsMe()) {
            for (let i = 0; i < this.listCardOfPlayer.length; i++) {
                let cardInfo: BaseCard = this.listCardOfPlayer[i];
                cardInfo.enableTouch();
            }
        }
    }

    public showChatSprite(idEmoi): void {
        this.hideAllEffectChat();
        this.chatSprite.stopAllActions();
        this.pnMessage.active = true;
        this.chatSprite.active = true;
        this.chatSprite.getComponent(cc.Sprite).spriteFrame = SKEController.instance.spriteAtlasEmos.getSpriteFrame("emotion_" + idEmoi);
        let jumpAction = cc.sequence(
            cc.spawn(cc.scaleTo(0.2, 2, 2), cc.moveTo(0.2, 0, 10)),
            cc.spawn(cc.scaleTo(0.2, 1.8, 2.2), cc.moveTo(0.2, -10, 0)),
            cc.spawn(cc.scaleTo(0.2, 2, 2), cc.moveTo(0.2, 0, -10)),
            cc.spawn(cc.scaleTo(0.2, 2.2, 1.8), cc.moveTo(0.2, 10, 0)),
            cc.spawn(cc.scaleTo(0.2, 2, 2), cc.moveTo(0.2, 0, 0))
        ).repeat(4);
        this.chatSprite.runAction(jumpAction);
        this.timeoutChat = setTimeout(() => {
            this.hideAllEffectChat();
            this.chatSprite.stopAllActions();
        }, 4000);
    }

    public showChatEmotion(idEmoi): void {
        this.hideAllEffectChat();
        this.pnMessage.active = true;
        this.chatEmotion.node.active = true;
        this.chatEmotion.setAnimation(0, idEmoi.toString(), true);
        this.timeoutChat = setTimeout(() => {
            this.hideAllEffectChat();
        }, 4000);
    }

    public showChatMsg(content): void {
        this.hideAllEffectChat();
        this.pnMessage.active = true;
        this.chatMsg.active = true;
        var newContent = content.replace(/(\r\n|\n|\r)/gm, " ");
        this.chatMsg.children[0].getComponent(cc.Label).string = newContent;
        this.timeoutChat = setTimeout(() => {
            this.hideAllEffectChat();
        }, 4000);
    }

    public resetAndCleanUp(): void {
        this.pnCards.active = false;
        this.spLeave.active = false;
        this.listCardOfPlayer = [];
        this.setValueCards({ cards: [], multiple: -1, score: -1, type: -1 });
        this._resetResultAndReward();
        this.offEventTouchOfMe();
    }

    private onEventTouchOfMe(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
    }

    private offEventTouchOfMe(): void {
        if (this.checkIsMe()) {
            this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
            this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
            this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        }
    }

    public setStateRutBai(agree: number): void {
        if (agree == -1) {
            this.pnStateRutBai.active = false;
            this.pnStateRutBai.getComponent(cc.Label).string = "";
        }

        if (agree == 0) {
            this.pnStateRutBai.active = false;
            this.pnStateRutBai.color = cc.color(255, 0, 0, 100);
            this.pnStateRutBai.getComponent(cc.Label).string = LanguageMgr.getString("shankoemee.do_not_draw_card");
        }

        if (agree == 1) {
            this.pnStateRutBai.active = false;
            this.pnStateRutBai.color = cc.color(0, 255, 0, 100);
            this.pnStateRutBai.getComponent(cc.Label).string = LanguageMgr.getString("shankoemee.draw_card");
        }
    }
}
