const { ccclass, property } = cc._decorator;
import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import BOOGYIConnector from "../../lobby/scripts/network/wss/BOOGYIConnector";
import BaseCard, { TYPE_CARD } from "./BOOGYI.BaseCard";
import BOOGYICmd from "./BOOGYI.Cmd";
import BOOGYIController from "./BOOGYI.Controller";
import BOOGYIPlayer from "./BOOGYI.Player";


@ccclass
export default class BOOGYIArrangeCard extends cc.Component {
  public static instance: BOOGYIArrangeCard = null;

  @property(cc.SpriteFrame)
  public spLabelGreen: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  public spLabelRed: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  public spLabelYellow: cc.SpriteFrame = null;

  @property(cc.Node)
  public spRow1: cc.Node = null;

  @property(cc.Node)
  public spRow2: cc.Node = null;

  @property(cc.Node)
  public cardNode: cc.Node[] = [];

  @property(cc.Node)
  public spClock: cc.Node = null;

  @property(cc.Label)
  public lbCountdown: cc.Label = null;

  fullTimeCountDownRutBai: number = 0;

  @property(cc.Node)
  public cardHideNode: cc.Node = null;

  @property(cc.Node)
  public scoreRow1: cc.Node = null;

  @property(cc.Label)
  public lbScoreRow1: cc.Label = null;

  @property(cc.Node)
  public scoreRow2: cc.Node = null;

  @property(cc.Label)
  public lbScoreRow2: cc.Label = null;

  @property(cc.SpriteFrame)
  public xmark: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  public vmark: cc.SpriteFrame = null;

  @property(sp.Skeleton)
  public pointer: sp.Skeleton = null;

  @property(cc.Node)
  public btnConfirm: cc.Node = null;

  @property(cc.SpriteFrame)
  public buttonFrame: cc.SpriteFrame[] = [];

  @property(cc.Node)
  public blockInputEvent: cc.Node = null;

  @property(cc.Node)
  public spark: cc.Node = null;

  private startPoint: number = 0;
  private angleNow: number = 0;
  private rad: number = 0;

  private objMe: BOOGYIPlayer = null;
  private _localArrayCardsOrigin: Array<number>;
  private isSendToServer: boolean = false;
  private _localArrayCards: Array<number>;

  private _firstCard = null;
  private _seccondCard = null;
  private _oldCardPos: cc.Vec2;
  private readonly _cardPos = [
    cc.v2(-265, -122),
    cc.v2(16, -122),
    cc.v2(297, -122),
    cc.v2(-265, 265),
    cc.v2(17, 265),
  ];
  private isShowLastCard = false;

  private nodeSpPointer: cc.Node = null;

  private _timeRemain: number = -1;
  private thinkingAct: cc.Tween = null;

  onLoad() {
    BOOGYIArrangeCard.instance = this;
    this.showAllCard(true);
    this.spRow1.active = true;
    this.spRow2.active = true;
    this._onTouch();
    this.showAllCard(false);
    this.node.scale = 1.25;
  }

  // start() {}

  enableTouch() {
    this._onTouch();
  }

  disableTouch() {
    this._offTouch();
  }

  private showAllCard(isActive: boolean) {
    this.cardHideNode.active = isActive;
    this.scoreRow1.active = isActive;
    this.scoreRow2.active = isActive;
    for (let i = 0; i < 5; i++) {
      let card = this.cardNode[i];
      card.active = isActive;
    }
  }

  private _offTouch() {
    this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
  }

  private _onTouch() {
    this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
  }

  public initInfoArrangeCard(objPlayer: BOOGYIPlayer, cards: Array<number>) {
    this.isSendToServer = false;
    this.show();
    this.node.scale = 1;
    this.node.opacity = 255;
    this.showAllCard(true);
    this.objMe = objPlayer;
    this._localArrayCardsOrigin = cards;
    this._localArrayCards = cards;
    this.isShowLastCard = false;
    this.cardHideNode.opacity = 255;
    this.cardHideNode.setPosition(this._cardPos[4]);
    this.cardHideNode.zIndex = 9999;
    this.showScoreOfRow(cards);
    this.lbScoreRow1.string = "???";
    this.blockInputEvent.active = true;

    for (let i = 0; i < 5; i++) {
      var card = this.cardNode[i];
      card.getComponent(BaseCard).setTextureWithCode(this._localArrayCards[i]);
      card.setScale(1.9);
      this.cardNode[i].setPosition(this._cardPos[i]);
      this.cardNode[i].opacity = 255;
    }

    this.enableTouch();
    setTimeout(() => {
      this.createPointerNanBai();
    }, 1000);
  }

  private hidePlayCountdown(isNew: boolean) {
    if (!isNew && this.objMe instanceof BOOGYIPlayer) {
      BOOGYIController.instance.runCtrOpenCardOfMe(
        this.objMe,
        this._localArrayCardsOrigin
      );
      setTimeout(() => {
        this.objMe = null;
      }, 1000);
    }
  }

  public getArrayCards(): Array<number> {
    if (this.isSendToServer) {
      return this._localArrayCards;
    } else {
      return this._localArrayCardsOrigin;
    }
  }

  public setStrCountdown(remain: number) {
    if (remain <= 0) {
      this.hidePlayCountdown(false);
    } else {
      this.lbCountdown.string = remain.toString();
    }
  }

  setTimeRemain(remain = 0) {
    this._timeRemain = remain;
    this.spClock.stopAllActions();
    this.spClock.active = true;
    this.spClock.getComponent(cc.Sprite).fillStart = 0.25;
    this.spClock.getComponent(cc.Sprite).fillRange = 1;
    this.thinkingAct?.stop();
    this.thinkingAct = cc
      .tween(this.spClock.getComponent(cc.Sprite))
      .to(remain, { fillRange: 0 })
      .call(() => {
        this.onClickSubmitCard();
        // this.hideSpark();
      });
    this.thinkingAct.start();
    // this.runRound(remain);
  }

  private _onTouchBegin(event) {
    let touch_localpos = this.node.convertTouchToNodeSpaceAR(event.touch);
    let touch_worldpos = this.node.convertToWorldSpaceAR(touch_localpos);
    let touch = event.touch;
    if (cc.sys.isNative && touch.getID() != 0) return false;

    if (this.isShowLastCard) {
      this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
      for (let i = 0; i < this.cardNode.length; i++) {
        let card = this.cardNode[i];
        let cworldpos = card.convertToWorldSpaceAR(cc.v2(0, 0));
        let disvt = touch_worldpos.sub(cworldpos);
        if (Math.abs(disvt.x) < 70 && Math.abs(disvt.y) < 90) {
          this._firstCard = card;
          this._oldCardPos = card.getPosition(); // vị trí lá bài  cũ
        }
      }
    } else {
      let card = this.cardHideNode;
      let cworldpos = card.convertToWorldSpaceAR(cc.v2(0, 0));
      let disvt = touch_worldpos.sub(cworldpos);
      if (Math.abs(disvt.x) < 70 && Math.abs(disvt.y) < 90) {
        this._firstCard = card;
        this._oldCardPos = card.getPosition();
      }
    }

    return true;
  }

  private _onTouchMoved(event) {
    let touch = event.touch;
    if (cc.sys.isNative && touch.getID() != 0) return false;

    if (!this._firstCard) return;
    this._firstCard.zIndex = 1000;
    this._seccondCard = null;
    let touchLocal = this.node.convertToNodeSpaceAR(touch.getLocation());
    // Hiển thị lá bài cuối cùng chưa
    if (!this.isShowLastCard) {
      if (touchLocal.x > this._oldCardPos.x) {
        if (touchLocal.x - this._oldCardPos.x > 35) {
          this.cardHideNode.x = this._oldCardPos.x + 35;
          this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
          this.cardHideNode.runAction(
            cc.sequence(
              cc.fadeIn(0.1),
              cc.spawn(cc.moveBy(0.5, 100, 0), cc.fadeOut(0.5)),
              cc.callFunc(() => {
                if (this.cardHideNode) {
                  this.cardHideNode.active = false;
                  this.cardHideNode.setPosition(cc.v2(9999, 9999));
                }
                this.isShowLastCard = true;
                this.stopEffectNanBai();
                this.showScoreOfRow(this._localArrayCards);
                this.btnConfirm.getComponent(cc.Button).interactable = true;
                this.btnConfirm.getComponentInChildren(cc.Sprite).spriteFrame =
                  this.buttonFrame[1];

                if (!BOOGYIController.instance.isPlayerInteract) {
                  BOOGYIController.instance.isPlayerInteract = true;
                }
              })
            )
          );
          return;
        }
        if (touchLocal.x - this._oldCardPos.x > 135) {
          this._firstCard.x = this._oldCardPos.x + 135;
        } else {
          this._firstCard.x = touchLocal.x;
        }
      } else {
        this._firstCard.x = this._oldCardPos.x;
      }
      return;
    } else {
      this._firstCard.setPosition(touchLocal);
    }

    let touch_localpos = this.node.convertTouchToNodeSpaceAR(event.touch);
    let touch_worldpos = this.node.convertToWorldSpaceAR(touch_localpos);
    for (let i = 0; i < this.cardNode.length; i++) {
      let card = this.cardNode[i];
      if (card != this._firstCard) {
        let cworldpos = card.convertToWorldSpaceAR(cc.v2(0, 0));
        let disvt = touch_worldpos.sub(cworldpos);
        if (Math.abs(disvt.x) < 70 && Math.abs(disvt.y) < 90) {
          if (this._seccondCard) {
            this._seccondCard.opacity = 255;
          }

          this._seccondCard = card;
          this._seccondCard.opacity = 150;
        } else {
          card.opacity = 255;
        }
      }
    }
  }

  private _onTouchEnd(event) {
    let touch = event.touch;
    if (cc.sys.isNative && touch.getID() != 0) return false;
    var point = event.touch.getLocation();
    point = this.node.convertToNodeSpaceAR(point);
    if (this._firstCard) {
      this._firstCard.zIndex = 0;
      for (let i = 0; i < this._cardPos.length; i++) {
        this.cardNode[i].setPosition(this._cardPos[i]);
      }
      if (this._seccondCard) {
        this._seccondCard.opacity = 255;
        this.swapCard();
      } else {
        console.error("ERROR", "Không tìm thấy lá bái số 2");
      }
      this._oldCardPos = null;
      this._firstCard = null;
      this._seccondCard = null;
    } else {
      console.error("ERROR", "Không tìm thấy lá bái số 1");
    }
  }

  private createPointerNanBai() {
    if (!this.nodeSpPointer && !this.isShowLastCard) {
      this.cardHideNode.addChild(this.pointer.node);
      this.pointer.node.setPosition(cc.v2(50, -50));
      this.pointer.node.active = true;
    }
  }

  private stopEffectNanBai() {
    this.pointer.node.removeFromParent();
    this.pointer.node.active = false;
  }

  private showScoreOfRow(cards: Array<number>): void {
    let scoreRowAbove = this.calcScore(cards[3], cards[4]);
    let scoreRowBelow = this.calcScore(cards[0], cards[1], cards[2]);

    this.lbScoreRow1.string = LanguageMgr.getString("boogyi.value_slot", {
      value: scoreRowAbove,
    });
    this.lbScoreRow2.string = LanguageMgr.getString("boogyi.value_slot", {
      value: scoreRowBelow,
    });

    let isBoolay = this.checkBoolay(cards);
    let isBoogyi = this.checkBoogyi(cards);

    if (!this.isShowLastCard) {
      this.scoreRow1.children[0].color = cc.color(255, 116, 84, 255);
      this.scoreRow2.children[0].color = cc.color(255, 116, 84, 255);

      this.spRow1.color = cc.color(255, 0, 0, 255);
      this.spRow2.color = cc.color(255, 0, 0, 255);

      this.node
        .getChildByName("Tick Row Below")
        .getComponent(cc.Sprite).spriteFrame = this.xmark;
      this.node
        .getChildByName("Tick Row Above")
        .getComponent(cc.Sprite).spriteFrame = this.xmark;
    } else {
      if ((isBoolay || isBoogyi) && this.isShowLastCard) {
        this.spRow1.color = cc.color(255, 255, 255, 255);
        this.spRow2.color = cc.color(255, 255, 255, 255);

        this.scoreRow1.children[0].color = cc.color(160, 155, 0, 255);
        this.scoreRow2.children[0].color = cc.color(160, 155, 0, 255);

        this.node
          .getChildByName("Tick Row Below")
          .getComponent(cc.Sprite).spriteFrame = this.vmark;
        this.node
          .getChildByName("Tick Row Above")
          .getComponent(cc.Sprite).spriteFrame = this.vmark;
        return;
      }
      if (scoreRowBelow != 10) {
        this.scoreRow1.children[0].color = cc.color(255, 116, 84, 255);
        this.scoreRow2.children[0].color = cc.color(255, 116, 84, 255);

        this.spRow1.color = cc.color(255, 0, 0, 255);
        this.spRow2.color = cc.color(255, 0, 0, 255);

        this.node
          .getChildByName("Tick Row Below")
          .getComponent(cc.Sprite).spriteFrame = this.xmark;
        this.node
          .getChildByName("Tick Row Above")
          .getComponent(cc.Sprite).spriteFrame = this.xmark;
      } else {
        this.scoreRow1.children[0].color = cc.color(100, 255, 100, 255);
        this.scoreRow2.children[0].color = cc.color(100, 255, 100, 255);

        this.spRow1.color = cc.color(60, 255, 0, 255);
        this.spRow2.color = cc.color(60, 255, 0, 255);

        this.node
          .getChildByName("Tick Row Below")
          .getComponent(cc.Sprite).spriteFrame = this.vmark;
        this.node
          .getChildByName("Tick Row Above")
          .getComponent(cc.Sprite).spriteFrame = this.vmark;
      }
    }
  }

  private calcScore(card1: number, card2: number, card3 = -4) {
    let score = 0;
    score =
      (Math.floor(card1 / 4) +
        1 +
        Math.floor(card2 / 4) +
        1 +
        Math.floor(card3 / 4) +
        1) %
      10;
    if (score == 0) {
      score = 10;
    }
    return score;
  }

  private checkBoolay(cards: Array<number>) {
    let score = 0;
    let card1 = cards[0];
    let card2 = cards[1];
    let card3 = cards[2];
    let card4 = cards[3];
    let card5 = cards[4];
    score =
      Math.floor(card1 / 4) +
      1 +
      Math.floor(card2 / 4) +
      1 +
      Math.floor(card3 / 4) +
      1 +
      Math.floor(card4 / 4) +
      1 +
      Math.floor(card5 / 4) +
      1;
    if (score == 10) {
      return true;
    }
    return false;
  }

  private checkBoogyi(cards: Array<number>) {
    let score1 = 0;
    let score2 = 0;
    let card1 = cards[0];
    let card2 = cards[1];
    let card3 = cards[2];
    let card4 = cards[3];
    let card5 = cards[4];
    score1 =
      Math.floor(card1 / 4) +
      1 +
      Math.floor(card2 / 4) +
      1 +
      Math.floor(card3 / 4) +
      1;

    score2 = Math.floor(card4 / 4) + 1 + Math.floor(card5 / 4) + 1;

    let score = score1 + score2;
    if (score == 20 || (score1 == 20 && score2 == 10)) {
      return true;
    }
    return false;
  }

  private swapCard(): void {
    let tempIdCardFirst = this._firstCard.getComponent(BaseCard).idxCard;
    let tempIdCardSecond = this._seccondCard.getComponent(BaseCard).idxCard;
    this._firstCard.getComponent(BaseCard).setTextureWithCode(tempIdCardSecond);
    this._seccondCard
      .getComponent(BaseCard)
      .setTextureWithCode(tempIdCardFirst);
    let data = [];
    for (let i = 0; i < this.cardNode.length; i++) {
      let idCardSorted = this.cardNode[i].getComponent(BaseCard).idxCard;
      data.push(idCardSorted);
    }
    this._localArrayCards = data;
    this.showScoreOfRow(this._localArrayCards);
  }

  private show() {
    this.lbCountdown.string = "0";
    this.node.active = true;
  }

  hidden() {
    this.stopEffectNanBai();
    this.lbCountdown.string = "0";
    this.node.active = false;
    this.node.stopAllActions();
    this._localArrayCards = [];
    this._localArrayCardsOrigin = [];
    this.btnConfirm.getComponent(cc.Button).interactable = false;
    this.btnConfirm.getComponentInChildren(cc.Sprite).spriteFrame =
      this.buttonFrame[0];
    this.blockInputEvent.active = false;
  }

  public onClickSubmitCard() {
    this.sendXepBai(this._localArrayCards);
    this.objMe.listCard = this._localArrayCards;
    this.hidePlayCountdown(true);
    this.hideSpark();
    this.isSendToServer = true;
    if (BOOGYIController.instance.isPopUpOutRoom) {
      BOOGYIController.instance.Popup_ConfirmLeave.active = true;
    }
    if (BOOGYIController.instance.isPopUpGuide) {
      BOOGYIController.instance.Popup_Guide.active = true;
    }
    if (BOOGYIController.instance.isPopUpSetting) {
      BOOGYIController.instance.Popup_Setting.active = true;
    }
  }

  private sendXepBai(cards: Array<number>) {
    try {
      let pk = new BOOGYICmd.SendXepBai();
      pk.cards = cards;
      BOOGYIConnector.instance.sendPacket(pk);
    } catch (error) {
      console.error("Send Xep Bai ERROR", error);
    }
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
    let x = 110 * Math.cos(this.angleNow);
    let y = 110 * Math.sin(this.angleNow);
    this.spark.setPosition(cc.v2(x, y));
  }

  public hideSpark() {
    this.spark.active = false;
  }
}
