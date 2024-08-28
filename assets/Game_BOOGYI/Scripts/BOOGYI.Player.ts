import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import AvatarsCtrl from "../../lobby/scripts/AvatarsCtrl";
import HeaderCtrl from "../../lobby/scripts/HeaderCtrl";
import BOOGYIArrangeCard from "./BOOGYI.ArrangeCard";
import { CardLogic } from "./BOOGYI.CardLogic";
import BOOGYICmd from "./BOOGYI.Cmd";
import BOOGYIConstant from "./BOOGYI.Constant";
import BOOGYIController from "./BOOGYI.Controller";
import { SOUNDTYPE } from "./BOOGYI.SoundController";

const { ccclass, property } = cc._decorator;

export enum CHILD_TAG {
  STATUS = 8,
}

export enum WIN_TYPE {
  WIN_NORMAL = 2,
  BAO_SAM = 3,
  CHAN_SAM = 4,
  SAM_DINH = 6,
  TU_HEO = 7,
  NAM_DOI = 8,
  DONG_MAU = 9,
  DEN_BAO = 11,
  HOA = 12,
  THUA_NORMAL = 13,
  CONG = 14,
  THUA_TRANG = 15,
  THUA_CHAN_SAM = 16,
}

@ccclass
export default class BOOGYIPlayer extends cc.Component {
  @property(cc.Node)
  public skeletonAuraWin: cc.Node = null;

  @property(cc.Node)
  public thinkingProgressBar: cc.Node = null;

  @property(cc.Node)
  public spMoneyBet: cc.Node = null;

  @property(cc.Label)
  public lbMoneyBet: cc.Label = null;

  @property(cc.Node)
  public spLeave: cc.Node = null;

  @property(cc.Node)
  public spIsBanker: cc.Node = null;

  @property(cc.Label)
  public lblNickname: cc.Label = null;

  @property(cc.Label)
  public lbBalance: cc.Label = null;

  @property(cc.Sprite)
  public avatar: cc.Sprite = null;

  @property(cc.Node)
  public cardOnHand: cc.Node = null;

  @property(cc.Node)
  public listNodeCards: Array<cc.Node> = [];

  @property(cc.Sprite)
  public timeRemain: cc.Sprite = null;

  @property(cc.Node)
  public waitingSprite: cc.Node = null;

  @property(cc.Node)
  public bidNode: cc.Node = null;

  @property(cc.SpriteFrame)
  public bidFrameArray: cc.SpriteFrame[] = [];

  @property(cc.Node)
  public pnBetResult: cc.Node = null;

  @property(cc.Label)
  public lbGoldWin: cc.Label = null;

  @property(cc.Label)
  public lbGoldLose: cc.Label = null;

  @property(cc.Node)
  public pnMessage: cc.Node = null;

  @property(cc.Node)
  public spriteChat: cc.Node = null;

  @property(cc.Node)
  public quickChat: cc.Node = null;

  @property(cc.Node)
  public pnCardScore: cc.Node = null;

  @property(cc.Node)
  public nodeBoogyi: cc.Node = null;

  @property(cc.Node)
  public nodeBooLay: cc.Node = null;

  @property(cc.Node)
  public nodeScore: cc.Node = null;

  @property(cc.Node)
  public lblScoreNode: cc.Node[] = [];

  @property(cc.SpriteFrame)
  public listFramePoint: Array<cc.SpriteFrame> = [];

  @property(cc.Node)
  public nodeMultipleBet: cc.Node = null;

  @property(sp.Skeleton)
  public SkeletonMultipleBet: sp.Skeleton = null;

  @property(cc.SpriteFrame)
  public listMultipleFrame: Array<cc.SpriteFrame> = [];

  @property(cc.Node)
  public spChip: cc.Node = null;

  @property(sp.Skeleton)
  public kissSkl: sp.Skeleton = null;

  @property(cc.Node)
  public spark: cc.Node = null;

  private startPoint: number = 0;
  private angleNow: number = 0;
  private rad: number = 0;

  private timeoutChat = null;
  // lá 1, lá 2, lá 3, lá 4, lá 5
  private arrayThuTuChiaBai: Array<number> = [2, 3, 4, 0, 1]; // Thứ tự chia bài
  private arrayThuTuMoBai: Array<number> = [2, 0, 3, 1, 4]; // Thứ tự lá bài được mở
  private arrayThuTuMoBai2: Array<number> = [0, 3, 1, 4, 2]; // Thứ tự giá trị của lá bài trong mảng
  private isRunSubmitCard: boolean = false;
  private isShowScore: boolean = false;
  private arrayPosCard: Array<cc.Vec2> = [];
  private thinkingAct: cc.Tween = null;
  private _timeRemain: number = -1;
  private playerInfo: BOOGYICmd.ImpPlayerInfo = null;

  public currentMoney: number = -1;

  private isLung: boolean = false;

  public isBankerWait: boolean = false;

  private readonly arrayPosSpMoney: Array<cc.Vec2> = [
    cc.v2(200, 142), //0
    cc.v2(-170, 110), // 1
    cc.v2(-336, -38), // 2
    cc.v2(-160, -160), // 3
    cc.v2(160, -160), // 4
    cc.v2(336, -25), // 5
    cc.v2(170, 110), // 6
  ];

  private readonly arrayPosSpIsBanker: Array<cc.Vec2> = [
    cc.v2(-255, -210), //0
    cc.v2(850, -125), // 1
    cc.v2(910, 192), // 2
    cc.v2(540, 400), // 3
    cc.v2(-540, 400), // 4
    cc.v2(-910, 185), // 5
    cc.v2(-850, -125), // 6
  ];

  private readonly listPosCardOfPlayer: Array<cc.Vec2> = [
    cc.v2(-8, -72), //0
    cc.v2(28, -68), // 1
    cc.v2(62, -80), // 2
    cc.v2(10, 18), // 3
    cc.v2(40, 17), // 4
  ];

  private readonly listPosCardMove: Array<cc.Vec2> = [
    cc.v2(-250, 170),
    cc.v2(-95, 170),
    cc.v2(55, 170),
    cc.v2(-250, 495),
    cc.v2(-95, 495),
  ];

  onLoad() {
    this.node.active = true;
    this.resetNewGame();
  }

  // start() {}

  public resetNewGame(): void {
    this.isRunSubmitCard = false;
    this.playerInfo.cards = [52, 52, 52, 52, 52];
    this.setSpriteFrameOfAllCards([52, 52, 52, 52, 52]);
    this.isRunSubmitCard = false;
    this.isShowScore = false;
    this.bidNode.active = false;
    this.spLeave.active = false;
    this.spMoneyBet.active = false;
    this.cardOnHand.active = false;
    this.pnBetResult.active = false;
    this.nodeMultipleBet.active = false;
    this.spChip.active = false;
    this.resetAllNodeOfScrore();
    this.resetPnResult();
    this.activeCardOnHand(false);
  }

  get listCard(): Array<number> {
    return this.playerInfo.cards;
  }

  set listCard(cards: Array<number>) {
    this.playerInfo.cards = cards;
  }

  get info(): BOOGYICmd.ImpPlayerInfo {
    return this.playerInfo;
  }

  public addCard(card: number): void {
    this.playerInfo.cards.push(card);
  }

  setTimeRemain(remain = 0) {
    this._timeRemain = remain;
    if (remain == 0) {
      this.hidePlayCountdown();
      // this.hideSpark();
      return;
    }
    this.thinkingProgressBar.stopAllActions();
    this.thinkingProgressBar.active = true;
    this.timeRemain.fillStart = 1;
    this.timeRemain.fillRange = 1;
    this.thinkingAct?.stop();
    this.thinkingAct = cc
      .tween(this.timeRemain)
      .to(remain, { fillRange: 0 })
      .call(() => {
        this.hidePlayCountdown();
        // this.hideSpark();
      });
    this.thinkingAct.start();
    // this.runRound(remain);
  }

  public hidePlayCountdown() {
    this.thinkingProgressBar.active = false;
  }

  public initPlayerInfo(
    playerInfo: BOOGYICmd.ImpPlayerInfo,
    isUpdateAva: boolean
  ): void {
    try {
      this.playerInfo = playerInfo;
      if (playerInfo.displayName.length <= 8) {
        this.lblNickname.string = playerInfo.displayName
          ? playerInfo.displayName
          : "";
      } else {
        this.lblNickname.string = playerInfo.displayName
          ? playerInfo.displayName.substr(0, 8) + "..."
          : "";
      }

      this.setAccountBalance(playerInfo.money);
      this.setStatusOfPlayer(playerInfo.status);
      this.setActiveIsChuong(playerInfo.isChuong);
      this.setActiveNode(playerInfo.active);

      for (let i = 0; i < 6; i++) {
        this.arrayPosCard.push(this.listNodeCards[i].getPosition());
      }

      if (isUpdateAva) {
        this.updateAva(playerInfo.avatar);
      }
    } catch (error) {
      console.error("initPlayerInfo ERROR:", error);
    }
  }

  private updateAva(ava) {
    console.log(ava);
    let defaultAva = AvatarsCtrl.instance.defaultAvatars;
    if (ava !== "0") {
      if (this.checkIsMe()) {
        cc.log(
          BGUI.UserManager.instance.mainUserInfo.avatar,
          ava !== BGUI.UserManager.instance.mainUserInfo.avatar
        );
        if (ava !== BGUI.UserManager.instance.mainUserInfo.avatar) {
          cc.assetManager.loadRemote(ava, (err, texture) => {
            if (err) {
              console.error("Failed to load image: ", err);
              this.avatar.spriteFrame = defaultAva;
              return;
            }

            if (texture instanceof cc.Texture2D) {
              let spTemp = new cc.SpriteFrame(texture);
              this.avatar.spriteFrame = spTemp;
            } else {
              console.error("Loaded asset is not a Texture2D");
              this.avatar.spriteFrame = defaultAva;
              return;
            }
          });
        } else {
          this.avatar.spriteFrame = defaultAva;
        }
      } else {
        cc.assetManager.loadRemote(ava, (err, texture) => {
          if (err) {
            console.error("Failed to load image: ", err);
            this.avatar.spriteFrame = defaultAva;
            return;
          }

          if (texture instanceof cc.Texture2D) {
            let spTemp = new cc.SpriteFrame(texture);
            this.avatar.spriteFrame = spTemp;
          } else {
            console.error("Loaded asset is not a Texture2D");
            this.avatar.spriteFrame = defaultAva;
            return;
          }
        });
      }
    } else {
      this.avatar.spriteFrame = defaultAva;
    }
  }

  private setActiveNode(isActive: boolean): void {
    this.node.active = isActive;
  }

  private setActiveIsChuong(isShow: boolean): void {
    this.spIsBanker.active = isShow;
    this.spIsBanker
      .getComponent(sp.Skeleton)
      .setAnimation(0, "animation", true);
  }

  public setAccountBalance(balance: number) {
    this.playerInfo.money = balance;
    this.currentMoney = balance;
    if (this.checkIsMe()) {
      BOOGYIController.instance.lbMyBalance.string =
        BGUI.StringUtils.formatNumber(balance);
      BGUI.UserManager.instance.mainUserInfo.vinTotal = balance;
      BGUI.EventDispatch.instance.emit(
        BGUI.EVENT_GAMECORE.UPDATE_TOTAL_GOLD,
        BGUI.UserManager.instance.mainUserInfo.vinTotal
      );
    }
    let strBalance = this.convert2Label(balance).toString();
    this.lbBalance.string = "" + strBalance;
  }

  public convert2Label(num) {
    if (!num) {
      return 0;
    }

    let data = num;
    let returnKey = "";
    if (data / 1000 >= 1) {
      data = data / 1000;
      returnKey = "K";
      if (data / 1000 >= 1) {
        data = data / 1000;
        returnKey = "M";
        if (data / 1000 >= 1) {
          data = data / 1000;
          returnKey = "B";
          if (data / 1000 >= 1) {
            data = data / 1000;
            returnKey = "T";
          }
        }
      }
    }

    if (!this.isInt(data)) {
      if (data > 100) {
        data = data.toFixed(1);
      } else if (data > 10) {
        data = data.toFixed(2);
      } else {
        data = data.toFixed(2);
      }
    }
    return data + returnKey;
  }

  public isInt(num) {
    return num % 1 === 0;
  }

  public getAccountBalance(): number {
    if (this.playerInfo) {
      return this.playerInfo.money;
    } else {
      return 0;
    }
  }

  public getInforPlayer(): BOOGYICmd.ImpPlayerInfo {
    return this.playerInfo;
  }

  public getStatus(): number {
    if (this.playerInfo) {
      return this.playerInfo.status;
    } else {
      return 0;
    }
  }

  public checkIsChuong(): boolean {
    return this.playerInfo && this.playerInfo.isChuong;
  }

  public checkIsActive(): boolean {
    let isActive = this.playerInfo && this.playerInfo.active;
    let isStatus = this.getStatus() >= BOOGYIConstant.PlayerState.WAITING;
    return isActive && isStatus;
  }

  public checkIsInTable(): boolean {
    return this.playerInfo && this.playerInfo.active;
  }

  public checkIsMe(): boolean {
    return this.playerInfo && this.playerInfo.isMe;
  }

  private getNodeHiddenCard(posCardDeal): cc.Node {
    this.listNodeCards[5].opacity = 0;
    this.listNodeCards[5].active = true;
    this.listNodeCards[5].setPosition(posCardDeal);
    this.listNodeCards[5].setScale(1);
    this.listNodeCards[5].getComponent(cc.Sprite).spriteFrame =
      this.getSpriteFrameHideCard();
    return this.listNodeCards[5];
  }

  public effectChiaBai(index: number): void {
    let arPoint = BOOGYIController.instance.nChiaBai.convertToWorldSpaceAR(
      cc.v2(0, 0)
    );
    let posCardDeal = this.cardOnHand.convertToNodeSpaceAR(arPoint);
    let nodeHiddenCard = this.getNodeHiddenCard(posCardDeal);
    let posOfPlayer = cc.v2(0, 0);

    let indexLaBaiDcChia = this.arrayThuTuChiaBai[index];
    let cardProcessed = this.listNodeCards[indexLaBaiDcChia];
    if (index == 4) {
      cardProcessed.setScale(0);
      cardProcessed.active = true;
      cardProcessed.getComponent(cc.Sprite).spriteFrame =
        this.getSpriteFrameHideCard();
      cardProcessed.children[1].active = true;
      cardProcessed.runAction(
        cc.sequence(
          cc.delayTime(0),
          cc.callFunc(() => {
            if (this.checkIsMe() && index < 5) {
              cardProcessed.runAction(
                cc.sequence(cc.scaleTo(0.2, 0, 0), cc.scaleTo(0.2, 1, 1))
              );
              let cards = this.playerInfo.cards;
              cardProcessed.getComponent(cc.Sprite).spriteFrame =
                BOOGYIConstant.CardLogic.getTextureWithCode(cards[index]);
              cardProcessed.children[0].getComponent(cc.Label).string =
                cards[index];
            } else {
              cardProcessed.runAction(
                cc.sequence(cc.scaleTo(0.2, 0, 0), cc.scaleTo(0.2, 0.7, 0.7))
              );
            }
          })
        )
      );
    } else {
      BOOGYIController.instance.soundControler.playMusicByType(
        SOUNDTYPE.DEALCARDS
      );
      nodeHiddenCard.setScale(0.25);
      nodeHiddenCard.runAction(
        cc.sequence(
          cc.fadeIn(0.2),
          cc.spawn(cc.moveTo(0.5, posOfPlayer), cc.scaleTo(0.5, 0.7)),
          cc.callFunc(() => {
            nodeHiddenCard.active = false;
            nodeHiddenCard.opacity = 0;
            cardProcessed.active = true;
            cardProcessed.getComponent(cc.Sprite).spriteFrame =
              this.getSpriteFrameHideCard();
            // bay
            cardProcessed.runAction(
              cc.sequence(
                cc.delayTime(0),
                cc.callFunc(() => {
                  if (this.checkIsMe() && index < 5) {
                    cardProcessed.runAction(
                      cc.sequence(cc.scaleTo(0.2, 0, 1), cc.scaleTo(0.2, 1, 1))
                    );
                    let cards = this.playerInfo.cards;
                    cardProcessed.getComponent(cc.Sprite).spriteFrame =
                      BOOGYIConstant.CardLogic.getTextureWithCode(cards[index]);
                    cardProcessed.children[0].getComponent(cc.Label).string =
                      cards[index];
                  }
                  index++;
                  if (index < 5) {
                    this.effectChiaBai(index);
                  }
                })
              )
            );
          })
        )
      );
    }
  }

  public runOpenCardOfMe(cards: Array<number>) {
    // if (this.isRunSubmitCard) {
    //   console.log("ERROR: XEP_BAI", "Bài đã được xếp");
    // }
    // if (!(cards && cards.length == 5)) {
    //   console.log("ERROR: XEP_BAI", "Lá bài không đủ 5");
    // }
    // if (!this.checkIsMe()) {
    //   console.log("ERROR: XEP_BAI", "Không phải là tôi");
    // }
    if ( this.checkIsMe() && cards && cards.length == 5 && !this.isRunSubmitCard ) {
      this.isRunSubmitCard = true;
      this.cardOnHand.active = true;
      for (let i = 0; i < 5; i++) {
        let idx = this.arrayThuTuChiaBai[i];
        // Lấy vị trí lá bài, do sắp xếp ngu lên, lần lượt lá là [2, 3, 4, 0, 1];
        let nodeCardInHand = this.listNodeCards[idx];
        let spriteCard = BOOGYIConstant.CardLogic.getTextureWithCode(cards[i]);
        nodeCardInHand.getComponent(cc.Sprite).spriteFrame = spriteCard;
        if (i == 4) {
          nodeCardInHand.children[1].active = false;
        }
        nodeCardInHand.setPosition(this.listPosCardMove[i]);
        nodeCardInHand.active = true;
        let posOfCardOnHand = this.listPosCardOfPlayer[i];
        if (i == 4) {
          nodeCardInHand.runAction(
            cc.sequence(
              cc.moveTo(0.5, posOfCardOnHand),
              cc.callFunc(() => {
                nodeCardInHand.setPosition(posOfCardOnHand);
                this.displayCardResults(cards, true);
              })
            )
          );
        } else {
          nodeCardInHand.runAction(
            cc.sequence(
              cc.moveTo(0.5, posOfCardOnHand),
              cc.callFunc(() => {
                nodeCardInHand.setPosition(posOfCardOnHand);
              })
            )
          );
        }
      }
    }
  }

  public effectChiaLaBaiCuoi(delay: number): void {
    let index = 4;
    let arPoint = BOOGYIController.instance.nChiaBai.convertToWorldSpaceAR(
      cc.v2(0, 0)
    );
    let posCardDeal = this.cardOnHand.convertToNodeSpaceAR(arPoint);
    let nodeHiddenCard = this.getNodeHiddenCard(posCardDeal);
    let nodeCard2 = this.listNodeCards[1];
    let toPos = cc.v2(0, 0);

    nodeHiddenCard.stopAllActions();
    nodeHiddenCard.setScale(0.2);
    nodeHiddenCard.runAction(
      cc.sequence(
        cc.delayTime(0.1 * delay),
        cc.fadeIn(0.1),
        cc.spawn(cc.scaleTo(0.3, 0.7), cc.moveTo(0.3, toPos)),
        cc.callFunc(() => {
          BOOGYIController.instance.soundControler.playMusicByType(
            SOUNDTYPE.DEALCARDS
          );
          nodeHiddenCard.opacity = 0;
          if (index == 4) {
            nodeCard2.active = true;
            nodeCard2.getComponent(cc.Sprite).spriteFrame =
              this.getSpriteFrameHideCard();
            nodeCard2.children[1].active = false;
          }
          nodeCard2.runAction(
            cc.sequence(
              cc.delayTime(1),
              cc.callFunc(() => {
                if (this.checkIsMe() && this.checkIsActive()) {
                  let cards = this.playerInfo.cards;
                  BOOGYIArrangeCard.instance.initInfoArrangeCard(this, cards);
                }
              })
            )
          );
        })
      )
    );
  }

  public off4FirstCard(delay: number): void {
    this.cardOnHand.active = true;
    this.node.runAction(
      cc.sequence(
        cc.delayTime(delay * 0.2),
        cc.callFunc(() => {
          this.effectChiaBai(0);
          this.node.stopAllActions();
        })
      )
    );
  }

  public on4FirstCard(): void {
    this.activeCardOnHand(true);
    if (this.checkIsMe()) {
      let cards = this.playerInfo.cards;
      if (cards.length >= 4) {
        this.setSpriteFrameOfAllCards(cards);
      }
    } else {
      this.setSpriteFrameOfAllCards([52, 52, 52, 52, 52]);
    }
  }

  private getSpriteFrameHideCard(): cc.SpriteFrame {
    return BOOGYIConstant.CardLogic.getTextureWithCode(52);
  }

  private stopAllCardsActions(): void {
    for (let i = 0; i < 6; i++) {
      this.listNodeCards[i].stopAllActions();
    }
  }

  private activeCardOnHand(isActive: boolean) {
    this.cardOnHand.active = isActive;
    for (let i = 0; i < 5; i++) {
      this.listNodeCards[i].active = isActive;
      if (!this.checkIsMe()) {
        this.listNodeCards[i].setScale(0.7);
      } else {
        this.listNodeCards[i].setScale(1);
      }
    }
    this.listNodeCards[5].active = false;
  }

  private activeCardOnHand1(isActive: boolean) {
    this.cardOnHand.active = isActive;
    for (let i = 0; i < 5; i++) {
      this.listNodeCards[i].active = isActive;
      if (!this.checkIsMe()) {
        this.listNodeCards[i].setScale(0.7);
      } else {
        this.listNodeCards[i].setScale(1);
      }
    }
    this.listNodeCards[1].children[1].active = true;
  }

  private setSpriteFrameOfAllCards(data: Array<number>): void {
    let spriteFrame1 = BOOGYIConstant.CardLogic.getTextureWithCode(data[3]);
    let spriteFrame2 = BOOGYIConstant.CardLogic.getTextureWithCode(data[4]);
    let spriteFrame3 = BOOGYIConstant.CardLogic.getTextureWithCode(data[0]);
    let spriteFrame4 = BOOGYIConstant.CardLogic.getTextureWithCode(data[1]);
    let spriteFrame5 = BOOGYIConstant.CardLogic.getTextureWithCode(data[2]);

    this.listNodeCards[0].getComponent(cc.Sprite).spriteFrame = spriteFrame1;
    this.listNodeCards[1].getComponent(cc.Sprite).spriteFrame = spriteFrame2;
    this.listNodeCards[2].getComponent(cc.Sprite).spriteFrame = spriteFrame3;
    this.listNodeCards[3].getComponent(cc.Sprite).spriteFrame = spriteFrame4;
    this.listNodeCards[4].getComponent(cc.Sprite).spriteFrame = spriteFrame5;
  }

  /// Đã chia lá bài thứ 5 thì mở arrangecard ko thì đặt úp bài hết
  public on5FirstCard() {
    if (this.checkIsMe()) {
      if (this.playerInfo.cards.length >= 5) {
        BOOGYIArrangeCard.instance.initInfoArrangeCard(
          this,
          this.playerInfo.cards
        );
      }
    } else {
      this.activeCardOnHand(true);
      this.setSpriteFrameOfAllCards([52, 52, 52, 52, 52]);
    }
  }

  public setBid(bid = null) {
    this.bidNode.active = true;
    if (bid === null) {
      this.bidNode.active = false;
    } else if (bid == 1) {
      this.bidNode.getComponent(cc.Sprite).spriteFrame = this.bidFrameArray[0];
    } else if (bid == 2) {
      this.bidNode.getComponent(cc.Sprite).spriteFrame = this.bidFrameArray[1];
    } else if (bid == 3) {
      this.bidNode.getComponent(cc.Sprite).spriteFrame = this.bidFrameArray[2];
    } else if (bid == 4) {
      this.bidNode.getComponent(cc.Sprite).spriteFrame = this.bidFrameArray[3];
    } else if (bid == 5) {
      this.bidNode.getComponent(cc.Sprite).spriteFrame = this.bidFrameArray[4];
    }
  }

  public openAllCardOfPlayer(cards: Array<number>): void {
    if (this.checkIsMe()) {
      return;
    }
    this.stopAllCardsActions();
    this.activeCardOnHand(true);
    this.setSpriteFrameOfAllCards([52, 52, 52, 52, 52]);
    for (let index = 0; index < 5; index++) {
      let indexLaBaiMo = this.arrayThuTuMoBai[index];
      let cardTemp = this.listNodeCards[indexLaBaiMo];
      cardTemp.setScale(0.7);
      cardTemp.runAction(
        cc.sequence(
          cc.delayTime(0.1 * index),
          cc.scaleTo(0.2, 0.1, 0.7),
          cc.scaleTo(0.2, 0.7, 0.7),
          cc.callFunc(() => {
            let giaTriLaBaiDuocMo = this.arrayThuTuMoBai2[index];
            let spriteFrameCard = BOOGYIConstant.CardLogic.getTextureWithCode(
              cards[giaTriLaBaiDuocMo]
            );
            cardTemp.getComponent(cc.Sprite).spriteFrame = spriteFrameCard;
            // Đến lá bài cuối cùng.
            if (index == 4) {
              let cards = this.playerInfo.cards;
              this.displayCardResults(cards, false);
            }
          })
        )
      );
    }
  }

  public logicCalcMultiple(
    cardScore: number,
    isboolay: boolean,
    isboogyi: boolean
  ) {
    if (isboolay) {
      return 6;
    } else if (isboogyi) {
      return 5;
    } else if (cardScore == 9) {
      return 4;
    } else if (cardScore == 8) {
      return 3;
    } else if (cardScore >= 1) {
      return 2;
    } else {
      return 1;
    }
  }

  public cardsOnHand(cards) {
    if ((cards.length == 0 || cards.length == 4) && this.checkIsActive()) {
      this.activeCardOnHand1(true);
      this.setSpriteFrameOfAllCards([52, 52, 52, 52, 52]);
    }
  }

  public openCardNow(cards: Array<number>, isReset: boolean): void {
    if (cards && cards.length == 5 && this.checkIsActive()) {
      this.activeCardOnHand(true);
      if (isReset) {
        this.setSpriteFrameOfAllCards([52, 52, 52, 52, 52]);
      }
      if (this.checkIsMe()) {
        this.setSpriteFrameOfAllCards(cards);
      } else {
        this.stopAllCardsActions();
        for (let index = 0; index < 5; index++) {
          let indexLaBaiMo = this.arrayThuTuMoBai[index];
          let giaTriLaBaiDuocMo = this.arrayThuTuMoBai2[index];
          this.listNodeCards[indexLaBaiMo].active = true;
          let spriteFrameOfCard = BOOGYIConstant.CardLogic.getTextureWithCode(
            cards[giaTriLaBaiDuocMo]
          );
          this.listNodeCards[indexLaBaiMo].getComponent(cc.Sprite).spriteFrame =
            spriteFrameOfCard;
          // this.listNodeCards[indexLaBaiMo].children[0].getComponent(cc.Label).string = cards[giaTriLaBaiDuocMo];
          if (index == 4 && cards[giaTriLaBaiDuocMo] < 52) {
            this.displayCardResults(cards, false);
          }
        }
      }
    }
  }

  public throwMoneyToTable(roomBet: number, rate: number, chair: number): void {
    this.hidePlayCountdown();
    this.hideSpark();
    let toPos = cc.v2(0, 0);
    if (chair >= 1 && chair <= 3) {
      toPos = cc.v2(
        this.arrayPosSpMoney[chair].x + 57,
        this.arrayPosSpMoney[chair].y
      );
    } else {
      toPos = cc.v2(
        this.arrayPosSpMoney[chair].x - 57,
        this.arrayPosSpMoney[chair].y
      );
    }
    this.spChip.position = cc.v3(0, 0, 0);
    this.spChip.active = true;
    this.spChip.runAction(
      cc.sequence(
        cc.fadeIn(0.2),
        cc.spawn(cc.scaleTo(0.5, 1), cc.moveTo(0.5, toPos))
      )
    );

    let posSpMoney = this.arrayPosSpMoney[this.playerInfo.chairInTable];
    this.spMoneyBet.setPosition(posSpMoney);
    let money = roomBet * rate;
    let isActive = money > 0;

    this.scheduleOnce(() => {
      this.spMoneyBet.active = isActive;

      if (isActive) {
        BOOGYIController.instance.soundControler.playMusicByType(SOUNDTYPE.BET);
        if (this.checkIsActive()) {
          let strConvertMoney = this.convert2Label(money);
          this.lbMoneyBet.string = strConvertMoney.toString();
        }
      }
    }, 0.8);
  }

  private resetAllNodeOfScrore(): void {
    this.pnCardScore.active = false;
    this.nodeBoogyi.active = false;
    this.nodeBooLay.active = false;
    this.nodeScore.active = false;
  }

  public displayCardResults(cards: Array<number>, isplayer: boolean) {
    if (this.isShowScore) {
      return;
    }
    this.isShowScore = true;
    let score = CardLogic.getCardScore(cards);
    let isBoolay = CardLogic.checkBoolay(cards);
    let isBoogyi = CardLogic.checkBoogyi(cards);
    let multiple = this.logicCalcMultiple(score, isBoolay, isBoogyi);
    this.resetAllNodeOfScrore();
    this.pnCardScore.active = true;
    this.showMultipleBet(multiple, isplayer);

    if (isBoogyi) {
      this.nodeBoogyi.active = true;
    } else if (isBoolay) {
      this.nodeBooLay.active = true;
    } else if (score <= 0) {
      this.nodeScore.active = true;
      this.nodeScore.getComponent(cc.Sprite).spriteFrame = null;
      this.lblScoreNode[0].active = true;
      this.lblScoreNode[1].active = true;
      this.lblScoreNode[2].active = false;
      this.isLung = true;
    } else if (score > 0) {
      this.nodeScore.active = true;
      this.nodeScore.getComponent(cc.Sprite).spriteFrame =
        this.listFramePoint[2];
      this.lblScoreNode[0].active = false;
      this.lblScoreNode[1].active = false;
      this.lblScoreNode[2].getComponent(cc.Label).string =
        LanguageMgr.getString("boogyi.value_slot", {
          value: score,
        });
      this.lblScoreNode[2].color = cc.color(4, 34, 103, 255);
      this.lblScoreNode[2].getComponent(cc.LabelOutline).width = 0;
      this.lblScoreNode[2].active = true;
      this.isLung = false;
    }
  }

  changeWinFramePoint() {
    this.nodeScore.getComponent(cc.Sprite).spriteFrame = this.listFramePoint[1];
    this.lblScoreNode[2].color = cc.color(129, 49, 0, 255);
  }

  changeLoseFramePoint() {
    this.nodeScore.getComponent(cc.Sprite).spriteFrame = this.listFramePoint[0];
    this.lblScoreNode[2].color = cc.color(57, 57, 57, 255);
  }

  private showMultipleBet(multiple, isplayer: boolean): void {
    if (multiple >= 1) {
      this.nodeMultipleBet.active = true;
      if (isplayer) {
        switch (multiple) {
          case 1:
            this.SkeletonMultipleBet.node.active = true;
            this.SkeletonMultipleBet.setAnimation(0, "x1 off", true);
            break;
          case 2:
            this.SkeletonMultipleBet.node.active = true;
            this.SkeletonMultipleBet.setAnimation(0, "x1", true);
            break;
          case 3:
            this.SkeletonMultipleBet.node.active = true;
            this.SkeletonMultipleBet.setAnimation(0, "x3", true);
            break;
          case 4:
            this.SkeletonMultipleBet.node.active = true;
            this.SkeletonMultipleBet.setAnimation(0, "x4", true);
            break;
          case 5:
            this.SkeletonMultipleBet.node.active = true;
            this.SkeletonMultipleBet.setAnimation(0, "x5", true);
            break;
          case 6:
            this.SkeletonMultipleBet.node.active = true;
            this.SkeletonMultipleBet.setAnimation(0, "x8", true);
            break;
        }
      } else {
        for (let i = 0; i < this.listMultipleFrame.length; i++) {
          if (i == multiple - 1) {
            this.nodeMultipleBet.getComponent("cc.Sprite").spriteFrame =
              this.listMultipleFrame[i];
          }
        }
      }
    } else {
      this.nodeMultipleBet.active = false;
    }
  }

  public hideScore(): void {
    this.pnCardScore.active = false;
    this.nodeMultipleBet.active = false;
  }

  private resetPnResult(): void {
    this.pnBetResult.active = false;
    this.lbGoldWin.node.active = false;
    this.lbGoldLose.node.active = false;
    this.lbGoldWin.node.setPosition(cc.v2(0, 0));
    this.lbGoldLose.node.setPosition(cc.v2(0, 0));
    this.setActiveBgBlurOfCard(false);
    this.skeletonAuraWin.active = false;
  }

  private setActiveBgBlurOfCard(isActive: boolean): void {
    for (let ind = 0; ind < this.listNodeCards.length; ind++) {
      this.listNodeCards[ind].getChildByName("BgCardBlur").active = isActive;
    }
  }

  public effectReward(money: number, isWin: boolean): void {
    if (money == 0) return;
    this.resetPnResult();
    this.pnBetResult.active = true;
    if (money < 0) {
      this.setActiveBgBlurOfCard(true);
      this.lbGoldLose.node.setPosition(-2, -22);
      this.lbGoldLose.node.active = true;
      this.lbGoldLose.node.opacity = 120;
      this.lbGoldLose.string = "-" + this.convert2Label(money * -1);
      this.lbGoldLose.node.runAction(
        cc.sequence(
          // cc.delayTime(0),
          cc.spawn(
            cc.fadeIn(0.5),
            cc.scaleTo(0.5, 1).easing(cc.easeBounceOut())
          ),
          // cc.delayTime(0),
          cc.spawn(cc.fadeTo(1, 255), cc.moveBy(1, cc.v2(-2, 50)))
        )
      );
    } else {
      this.skeletonAuraWin.active = true;
      this.skeletonAuraWin
        .getComponent(sp.Skeleton)
        .setAnimation(0, "animation", true);
      this.scheduleOnce(() => {
        this.lbGoldWin.node.setPosition(-2, -22);
        this.lbGoldWin.node.active = true;
        this.lbGoldWin.node.opacity = 120;
        this.lbGoldWin.string = "+" + this.convert2Label(money);
        this.lbGoldWin.node.runAction(
          cc.sequence(
            // cc.delayTime(0),
            cc.spawn(
              cc.fadeIn(0.5),
              cc.scaleTo(0.5, 1).easing(cc.easeBounceOut())
            ),
            // cc.delayTime(0),
            cc.spawn(cc.fadeTo(1, 255), cc.moveBy(1, cc.v2(-2, 50)))
          )
        );
      }, 1);
    }

    if (!this.isLung) {
      if (isWin) {
        this.changeWinFramePoint();
      } else {
        this.changeLoseFramePoint();
      }
    }

    this.scheduleOnce(() => {
      this.resetPnResult();
    }, 6);
  }

  private setStatusOfPlayer(status: number): void {
    this.waitingSprite.active = false;
    this.unschedule(this.animationWait);

    switch (status) {
      case BOOGYIConstant.PlayerState.VIEWING:
        this.waitingSprite.active = true;
        this.schedule(this.animationWait, 2, cc.macro.REPEAT_FOREVER);
        break;
    }
  }

  animationWait() {
    this.scheduleOnce(() => {
      this.waitingSprite.children[0].active = true;
    }, 0);
    this.scheduleOnce(() => {
      this.waitingSprite.children[1].active = true;
    }, 0.5);
    this.scheduleOnce(() => {
      this.waitingSprite.children[2].active = true;
    }, 1);
    this.scheduleOnce(() => {
      this.waitingSprite.children[0].active = false;
      this.waitingSprite.children[1].active = false;
      this.waitingSprite.children[2].active = false;
    }, 1.5);
  }

  public activeLeaveRoom(isLeave: boolean): void {
    this.spLeave.active = isLeave;
  }

  private hideAllEffectChat(): void {
    clearTimeout(this.timeoutChat);
    this.pnMessage.active = false;
    this.quickChat.active = false;
    this.spriteChat.active = false;
  }

  public showChatSprite(idEmoi: any): void {
    this.hideAllEffectChat();
    this.spriteChat.stopAllActions();
    this.pnMessage.active = true;
    this.spriteChat.active = true;
    this.spriteChat
      .getComponent(sp.Skeleton)
      .setAnimation(0, idEmoi.toString(), true);
    this.timeoutChat = setTimeout(() => {
      this.hideAllEffectChat();
      this.spriteChat.stopAllActions();
    }, 4000);
  }

  public showChatEmotion(content): void {
    this.hideAllEffectChat();
    this.pnMessage.active = true;
    this.timeoutChat = setTimeout(() => {
      this.hideAllEffectChat();
    }, 4000);
  }

  public showChatMsg(content) {
    this.hideAllEffectChat();
    this.pnMessage.active = true;
    this.quickChat.active = true;
    this.quickChat.children[0].getComponent(cc.Label).string = content;
    this.timeoutChat = setTimeout(() => {
      this.hideAllEffectChat();
    }, 4000);
  }

  public runRound(time: number) {
    let timeT = time * 20;
    this.startPoint = Math.PI / 2;
    this.rad = ((360 / timeT) * Math.PI) / 180;
    this.unschedule(this.updateSparkRun);
    this.spark.active = true;
    this.schedule(this.updateSparkRun, 0.0485, timeT);
  }

  public updateSparkRun() {
    this.angleNow = this.startPoint;
    this.startPoint -= this.rad;
    let x = 72 * Math.cos(this.angleNow);
    let y = 72 * Math.sin(this.angleNow);
    this.spark.setPosition(cc.v2(x, y));
  }

  public hideSpark() {
    this.spark.active = false;
  }
}
