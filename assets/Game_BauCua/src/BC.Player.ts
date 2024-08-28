const { ccclass, property } = cc._decorator;
import { cmd } from "./BauCua.Cmd";
import BCListUser from "./BC.ListUser";
import BCCommon from "./BC.Common"
import { BCLanguageMgr } from "./BC.LanguageMgr";
import BCController from "./BC.Controller";
const BC_PLAYER_CONFIG = cc.Enum({ ME: 0, GUEST: 1, OTHER: 2 });

@ccclass
export default class BCPlayer extends cc.Component {
    @property({ type: BC_PLAYER_CONFIG })
    public userType: number = BC_PLAYER_CONFIG.GUEST;

    @property(cc.Node)
    public spAvatar: cc.Node = null;

    @property(cc.Node)
    public nAura: cc.Node = null;

    @property(cc.Node)
    public nChips: cc.Node = null;

    @property(cc.Node)
    public lbNickName: cc.Node = null;

    @property(cc.Node)
    public lbBalance: cc.Node = null;

    @property(cc.Node)
    public pnMessage: cc.Node = null;

    @property(cc.Label)
    public lbNumberUser: cc.Label = null;

    @property(cc.Node)
    public pnPrize: cc.Node = null;

    @property(cc.Label)
    public lbGold: cc.Label = null;

    @property(cc.Font)
    public fontPlayer: Array<cc.Font> = [];

    @property(cc.Node)
    public nKiss: cc.Node = null;

    ////////////////
    private index: number = 0;
    private isTheFirst:boolean = false;
    private infoUser: cmd.User = null;

    private listUserPosition: Array<cc.Vec3> = [
        cc.v3(-740, 380, 0),
        cc.v3(-790, 200, 0),
        cc.v3(-850, 30, 0),
        cc.v3(-890, -150, 0),
        cc.v3(740, 380, 0),
        cc.v3(790, 200, 0),
        cc.v3(850, 30, 0)
    ];

    protected onLoad(): void {
        this.hidePlayer();
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    start() {
        // TODO
        this.activePnPrize(false);
        this.activePnMessage(false);
        this.activeAura(false);
        this.activeKiss(false);
    }

    public resetNewGame(): void {
        this.activePnPrize(false);
        this.activePnMessage(false);
        this.activeAura(false);
    }

    public onClick(event) {
        if (this.userType === BC_PLAYER_CONFIG.OTHER && BCListUser.instance) {
            cmd.Send.sendListExternalUser();
        }
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    public init(index: number) {

        this.index = index;
        this.node.position = this.listUserPosition[index];
    }

    public addChip(nChip: cc.Node) {
        nChip.setPosition(cc.v3(0, 0, 0))
        this.nChips.addChild(nChip);
    }

    public updateInfo(user: cmd.User) {
        this.infoUser = user;
        this.setNickName(user.displayName);
        this.setBalance(user.balance);
        if (!this.isTheFirst) {
            this.loadAvatar();
        }
        this.isTheFirst = true;
    }

    private loadAvatar() {
        this.spAvatar.getComponent(cc.Sprite).spriteFrame = BCController.instance.spFrameAvtDefault;
        if (this.infoUser.avatar) {
            cc.loader.load(this.infoUser.avatar, (err, texture) => {
                if (!err) {
                    const spriteFrame = new cc.SpriteFrame(texture);
                    this.spAvatar.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
            });
        }
    }

    public setNickName(nickName: string) {
        this.lbNickName.getComponent(cc.Label).string = nickName.toString();
    }

    public setBalance(balance: number) {
        this.infoUser.balance = balance;
        this.lbBalance.getComponent(cc.Label).string = BCCommon.convert2Label(balance);
    }

    public getBalance() {
        let infoUser = this.getInfoUser();
        return (infoUser) ? infoUser.balance : 0
    }

    public getInfoUser() {
        return (this.infoUser) ? this.infoUser : null;
    }

    public get nickName() {
        return (this.infoUser) ? this.infoUser.userName : null;
    }

    public get isMe() {
        return (this.infoUser) ? this.infoUser.isMe : false;
    }

    public getArrayWin(): Array<any> {
        var temp = this.infoUser.listWin;
        if (temp) {
            return temp.split(";");
        }
        return [];
    }

    public hidePlayer() {
        if (this.userType == BC_PLAYER_CONFIG.GUEST) {
            this.node.active = false;
            this.isTheFirst = false;
        } else {
            this.node.active = true;
        }
    }

    public showPlayer() {
        this.node.active = true;
    }

    private showChatMsg(content): void {
        this.activePnMessage(true);
        let nMessage = this.pnMessage.getChildByName("MESSAGE");
        nMessage.active = true;
        var newContent = content.replace(/(\r\n|\n|\r)/gm, " ");
        nMessage.getChildByName("Label").getComponent(cc.Label).string = newContent
        this.scheduleOnce(() => {
            nMessage.getChildByName("Label").getComponent(cc.Label).string = "";
            nMessage.active = false
        }, 4);
    }

    private showChatEmotion(idEmoi): void {
        this.activePnMessage(true);
        let nEmoij = this.pnMessage.getChildByName("EMOIJ");
        nEmoij.active = true;
        nEmoij.getComponent(sp.Skeleton).setAnimation(0, idEmoi.toString(), true);
        this.scheduleOnce(() => {
            nEmoij.active = false;
        }, 4);
    }

    public renderNumberPlayer(numberUser: number) {
        if (this.lbNumberUser) {
            this.lbNumberUser.string = BCCommon.convert2Label(numberUser);
        }
    }

    public responseChat(res: cmd.BauCuaReceiveChat) {
        let isIcon = res.isIcon;
        let message = res.strData;
        let userName = res.userName;
        if (this.userType == BC_PLAYER_CONFIG.GUEST || this.userType == BC_PLAYER_CONFIG.ME) {
            if (isIcon) {
                this.showChatEmotion(message)
            } else {
                let content = BCLanguageMgr.getString(message)
                this.showChatMsg(content)
            }
        }
    }

    public showPrize(money: number) {
        let isWin = (money > 0);
        // let ccFont = (isWin) ? this.fontPlayer[0] : this.fontPlayer[1];
        // let str = (isWin) ? "+" : "-";
        this.activePnPrize(isWin);
        this.activeAura(isWin);
        this.statusOfPlayer(isWin);
        if (isWin && this.lbGold) {
            // this.lbGold.font = this.fontPlayer[0];
            this.lbGold.string = "+" + BCCommon.convert2Label(money);
            this.lbGold.node.setPosition(cc.v2(0, 50));
            this.lbGold.node.runAction(
                cc.sequence(
                    cc.spawn((cc.fadeTo(0.3, 255)), cc.scaleTo(0.1, 1).easing(cc.easeBounceOut())),
                    cc.moveBy(4, cc.v2(0, 100)),
                    cc.callFunc(() => {
                        this.lbGold.node.stopAllActions();
                        this.activePnPrize(false);
                    })
                )
            );
        }
    }

    private statusOfPlayer(isWin: boolean) {
        if (this.spAvatar) {
            this.spAvatar.color = (isWin) ? new cc.Color().fromHEX("#999999") : new cc.Color().fromHEX("#ffffff");
        }
    }

    private activeAura(isActive: boolean) {
        if (this.nAura instanceof cc.Node) {
            this.nAura.active = isActive;
        }
    }

    private activePnPrize(isActive: boolean) {
        if (this.pnPrize instanceof cc.Node) {
            this.pnPrize.active = isActive;
        }
    }

    private activePnMessage(isActive: boolean) {
        if (this.pnMessage instanceof cc.Node) {
            this.pnMessage.active = isActive;
            if (!isActive) {
                let nMessage = this.pnMessage.getChildByName("MESSAGE");
                nMessage.active = isActive;
                let nEmoij = this.pnMessage.getChildByName("EMOIJ");
                nEmoij.active = isActive;
            }
        }
    }

    public kiss() {
        this.activeKiss(true);
        this.scheduleOnce(() => {
            this.activeKiss(false);
        }, 1.3);
    }

    private activeKiss(isActive: boolean) {
        if (this.nKiss) {
            this.nKiss.active = isActive;
        }
    }
}
