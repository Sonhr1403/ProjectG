// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import { LanguageMgr } from "../../framework/localize/LanguageMgr";
const { ccclass, property } = cc._decorator;
import BaseCard, { TYPE_CARD } from "./SHWESHAN.BaseCard";
import { CardLogic } from "./SHWESHAN.CardLogic";
import SHWESHANController from "./SHWESHAN.Controller";
import SHWESHANCmd from "./SHWESHAN.Cmd";
import SHWESHANPlayer from "./SHWESHAN.Player";
@ccclass
export default class ArrangeCard extends cc.Component {
  public static instance: ArrangeCard = null;

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}
  players: SHWESHANPlayer[] = [];
  @property(cc.Node)
  public cardNode: cc.Node[] = [];

  @property(cc.Label)
  cooldown_lbl: cc.Label = null;

  @property(cc.Node)
  nDiemHang1: cc.Node = null;

  @property(cc.Label)
  lblDiemHang1: cc.Label = null;

  @property(cc.Node)
  nDiemHang2: cc.Node = null;

  @property(cc.Label)
  lblDiemHang2: cc.Label = null;

  @property(cc.Node)
  nDiemHang3: cc.Node = null;

  @property(cc.Label)
  lblDiemHang3: cc.Label = null;

  @property(cc.SpriteFrame)
  spFrameRowShortGreen: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  spFrameRowLongGreen: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  spFrameRowShortRed: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  spFrameRowLongRed: cc.SpriteFrame = null;

  // @property(cc.SpriteFrame)
  // spFrameRowScoreRed:cc.SpriteFrame = null
  // @property(cc.SpriteFrame)
  // spFrameRowScoreGreen:cc.SpriteFrame = null

  @property(cc.Node)
  nMultiple1: cc.Node = null;
  @property(cc.Node)
  nMultiple2: cc.Node = null;
  @property(cc.Node)
  nMultiple3: cc.Node = null;

  public _cardData: any[];

  _cardRow1: [];
  _cardRow2: [];
  _firstCard = null;
  _seccondCard = null;
  _firstCardIdx = null;
  _seccondCardIdx = null;
  _targetpos: cc.Vec2;
  _oldCardPos: cc.Vec2;
  _dataEndGame: SHWESHANCmd.ReceivedEndGame = null;
  private readonly _cardPos = [
    cc.v2(-330, -320), //la bai so 1
    cc.v2(-120, -320), //2
    cc.v2(90, -320), //3
    cc.v2(-330, -5), //4
    cc.v2(-120, -5), //5
    cc.v2(90, -5), //6
    cc.v2(-330, 330), //7
    cc.v2(-120, 330), //8
  ];
  _debugNode: cc.Node;
  private thinkingAct: cc.Tween = null;
  @property(cc.Sprite)
  timeRemain: cc.Sprite = null;
  _timeRemain = 0;

  @property(cc.SpriteFrame)
  tichxanh: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  xdo: cc.SpriteFrame = null;

  @property(cc.Button)
  nutXdo: cc.Button = null;
  @property(cc.Node)
  nutXxam: cc.Node = null;


  @property(cc.SpriteFrame)
  nutXdoGrey: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  nutXdoRed: cc.SpriteFrame = null;

  @property(cc.Button)
  sbmtBtn: cc.Button = null;
  @property(cc.SpriteFrame)
  goldBtn: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  greyBtn: cc.SpriteFrame = null;
  start() {
    // this.node.active = true;

    this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
  }

  enableTouch() {
    this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
  }

  disableTouch() {
    this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
  }
  resetData() {
    for (let i = 0; i < this._cardPos.length; i++) {
      this.cardNode[i].setPosition(this._cardPos[i]);
      this.cardNode[i].opacity = 255;
    }
  }
  setCardData(data) {
    this.node.active = true;

    this.node.setScale(1);
    // this.node.runAction(cc.scaleTo(0.7,0.5));
    // this.node.children[1].color = cc.color(255,0,0)
    // this.node.children[2].color = cc.color(255,0,0)
    // this.node.children[3].color = cc.color(255,0,0)
    this.node.children[1].getComponent(cc.Sprite).spriteFrame =
      this.spFrameRowLongRed;
    this.node.children[2].getComponent(cc.Sprite).spriteFrame =
      this.spFrameRowLongRed;
    this.node.children[3].getComponent(cc.Sprite).spriteFrame =
      this.spFrameRowShortRed;
    this.sbmtBtn.interactable = false;
    //diem do

    this.nDiemHang1.children[0].color = cc.color(231, 45, 24, 255);

    //diem do

    this.nDiemHang2.children[0].color = cc.color(231, 45, 24, 255);

    //diem do

    this.nDiemHang3.children[0].color = cc.color(231, 45, 24, 255);
    // console.log("databai", data);
    this._cardData = data;
    this.nDiemHang1.active = false;
    this.nDiemHang2.active = false;
    this.nDiemHang3.active = false;
    for (let i = 0; i < this.cardNode.length; i++) {
      var card = this.cardNode[i];
      card.getComponent(BaseCard).setTextureWithCode(this._cardData[i]);
      card.setScale(1.4);
    }
    for (let i = 0; i < this._cardPos.length; i++) {
      this.cardNode[i].setPosition(this._cardPos[i]);
      this.cardNode[i].opacity = 255;
    }
    this.showScore();
  }
  hidePlayCountdown() {
    if (this.thinkingAct) this.thinkingAct.stop();
    this.timeRemain.node.active = false;
    this.timeRemain.node.stopAllActions();
    this.timeRemain.fillStart = 1;
    this.timeRemain.fillRange = 1;
    this.cooldown_lbl.string = "";
    if (this.node.active) {
      this.node.active = false;
      SHWESHANController.instance.submitCard(this._cardData, false);
      // SHWESHANController.instance.hideArrangeCard()
    }
  }
  setTimeRemain(remain = 0) {
    this.timeRemain.node.active = true;

    this._timeRemain = remain;
    if (remain == 0) {
      this.hidePlayCountdown();
      return;
    }
    this.timeRemain.node.stopAllActions();
    this.timeRemain.fillStart = 1;
    this.timeRemain.fillRange = 1;
    this.thinkingAct = cc
      .tween(this.timeRemain)
      .to(remain, { fillRange: 0 })
      .call(() => {
        this.hidePlayCountdown();
      });
    this.thinkingAct.start();
  }
  _onTouchBegin(event) {
    if (SHWESHANController.instance.isPlayerInteract == false) {
      SHWESHANController.instance.isPlayerInteract = true;
    }
    var touch_localpos = this.node.convertTouchToNodeSpaceAR(event.touch); //Convert the touch point to the location in the local coordinate system
    var touch_worldpos = this.node.convertToWorldSpaceAR(touch_localpos); //Convert a point to the world space coordinate system
    let touch = event.touch;
    if (cc.sys.isNative && touch.getID() != 0) return false;

    // this._debugNode = new cc.Node()
    // let graphics = this._debugNode.addComponent(cc.Graphics);
    // graphics.strokeColor = new cc.Color().fromHEX('#0000ff');
    // this.node.addChild(this._debugNode);
    // graphics.lineWidth = 2;
    // graphics.rect(touch_localpos.x-140/2,touch_localpos.y-180/2, 140, 180);

    // graphics.stroke();
    let self = this;
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, self);
    for (let i = 0; i < this.cardNode.length; i++) {
      var card = this.cardNode[i];
      var cworldpos = card.convertToWorldSpaceAR(cc.v2(0, 0));
      var disvt = touch_worldpos.sub(cworldpos);
      if (Math.abs(disvt.x) < 70 && Math.abs(disvt.y) < 90) {
        this._firstCard = card;
        this._firstCardIdx = i;
        // cc.log("có first card", this.cardNode[i]);
        this._oldCardPos = card.getPosition();
      }
    }
    // cc.log("co first card", this._firstCard);
    return true;
  }

  _onTouchMoved(event) {
    let self = this;
    let touch = event.touch;
    if (cc.sys.isNative && touch.getID() != 0) return false;
    if (!this._firstCard) return;
    this._firstCard.zIndex = 1000;
    this._seccondCard = null;
    var touchLocal = this.node.convertToNodeSpaceAR(touch.getLocation());
    this._firstCard.setPosition(touchLocal);

    var touch_localpos = this.node.convertTouchToNodeSpaceAR(event.touch); //Convert the touch point to the location in the local coordinate system
    var touch_worldpos = this.node.convertToWorldSpaceAR(touch_localpos); //Convert a point to the world space coordinate system
    for (let i = 0; i < this.cardNode.length; i++) {
      var card = this.cardNode[i];
      if (card != this._firstCard) {
        var cworldpos = card.convertToWorldSpaceAR(cc.v2(0, 0));
        var disvt = touch_worldpos.sub(cworldpos);
        if (Math.abs(disvt.x) < 70 && Math.abs(disvt.y) < 90) {
          if (this._seccondCard) {
            this._seccondCard.opacity = 255;
          }
          this._seccondCard = card;
          this._seccondCard.opacity = 150;
          this._seccondCardIdx = i;
          // this._seccondCard.active = false;
          // cc.log("co card 2", i);
          // cc.log("co card 2", this.cardNode[i]);
        } else {
          card.opacity = 255;
        }
      }
    }
  }

  _onTouchEnd(event) {
    // cc.log("_onTouchEnd");
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
        this._seccondCard = null;
      }
      this._oldCardPos = null;
      this._firstCard = null;
      this._firstCardIdx = null;
      this._seccondCardIdx = null;
    }
    // this._debugNode.removeFromParent();
  }

  swapRow2and3() {
    if (SHWESHANController.instance.isPlayerInteract == false) {
      SHWESHANController.instance.isPlayerInteract = true;
    }
    for (let i = 0; i <= 2; i++) {
      var card1 = this.cardNode[i];
      var card2 = this.cardNode[i + 3];
      this._firstCard = card1;
      this._firstCardIdx = i;
      this._seccondCard = card2;
      this._seccondCardIdx = i + 3;
      this.swapCard();
      this._seccondCard = null;
      this._firstCard = null;
      this._firstCardIdx = null;
      this._seccondCardIdx = null;
    }
  }

  showScore() {
    this.nutXxam.active = false
    this.nutXdo.interactable = true
    this.nutXdo.normalSprite = this.nutXdoRed;
    this.nutXdo.hoverSprite = this.nutXdoRed;
    this.nutXdo.node.children[0].getComponent(cc.Sprite).spriteFrame = this.nutXdoRed;
    let lungChecker = 0;
    for (let i = 0; i <= 7; i++) {
      for (let j = 0; j <= 7; j++) {
        if (j != i) {
          let lungCheck = this.getScore(this._cardData[i], this._cardData[j]);
          if (lungCheck == 8 || lungCheck == 9) {
            lungChecker += 1;
          }
        }
      }
    }

    let slot1 = this.getScore(
      this._cardData[0],
      this._cardData[1],
      this._cardData[2]
    );
    let slot2 = this.getScore(
      this._cardData[3],
      this._cardData[4],
      this._cardData[5]
    );
    let slot3 = this.getScore(this._cardData[6], this._cardData[7]);
    let arr1 = [this._cardData[0], this._cardData[1], this._cardData[2]];
    let arr2 = [this._cardData[3], this._cardData[4], this._cardData[5]];
    let arr3 = [this._cardData[6], this._cardData[7]];
    let mul1 = CardLogic.checkMultipleBet(arr1);
    let mul2 = CardLogic.checkMultipleBet(arr2);
    let mul3 = CardLogic.checkMultipleBet(arr3);
    if (lungChecker > 0) {
      this.sbmtBtn.interactable = true;
      this.sbmtBtn.normalSprite = this.goldBtn;
      this.sbmtBtn.hoverSprite = this.goldBtn;
      // this.nutXdo.interactable = false;
    }

    if (slot3 < 8) {
      this.node.children[3].getComponent(cc.Sprite).spriteFrame =
        this.spFrameRowShortRed;
      // this.node.children[3].color = cc.color(255,0,0)
      this.node.children[3].children[0].getComponent(cc.Sprite).spriteFrame =
        this.xdo;
      this.sbmtBtn.interactable = false;
      this.sbmtBtn.normalSprite = this.greyBtn;
      this.sbmtBtn.hoverSprite = this.greyBtn;

      //diem do
      this.nDiemHang3.children[0].color = cc.color(231, 45, 24, 255);
    } else {
      this.node.children[3].children[0].getComponent(cc.Sprite).spriteFrame =
        this.tichxanh;
      this.node.children[3].getComponent(cc.Sprite).spriteFrame =
        this.spFrameRowShortGreen;
      this.nDiemHang3.children[0].color = cc.color(81, 251, 81, 255);
    }

    // this.node.children[1].color = cc.color(0,255,0)
    // this.node.children[2].color = cc.color(0,255,0)

    this.node.children[1].children[0].getComponent(cc.Sprite).spriteFrame =
      this.tichxanh;
    this.node.children[2].children[0].getComponent(cc.Sprite).spriteFrame =
      this.tichxanh;
    this.node.children[1].getComponent(cc.Sprite).spriteFrame =
      this.spFrameRowLongGreen;
    this.node.children[2].getComponent(cc.Sprite).spriteFrame =
      this.spFrameRowLongGreen;

    this.nDiemHang1.children[0].color = cc.color(81, 251, 81, 255);
    this.nDiemHang2.children[0].color = cc.color(81, 251, 81, 255);

    if (mul1 == 5 && mul2 == 5) {
      if (this.lung3La2HangCuoi()) {
        // this.node.children[1].color = cc.color(255,0,0)
        // this.node.children[2].color = cc.color(255,0,0)
        this.node.children[1].children[0].getComponent(cc.Sprite).spriteFrame =
          this.xdo;
        this.node.children[2].children[0].getComponent(cc.Sprite).spriteFrame =
          this.xdo;
        this.node.children[1].getComponent(cc.Sprite).spriteFrame =
          this.spFrameRowLongRed;
        this.node.children[2].getComponent(cc.Sprite).spriteFrame =
          this.spFrameRowLongRed;
        this.nDiemHang1.children[0].color = cc.color(231, 45, 24, 255);
        this.nDiemHang2.children[0].color = cc.color(231, 45, 24, 255);
        this.sbmtBtn.interactable = false;
        this.sbmtBtn.normalSprite = this.greyBtn;
        this.sbmtBtn.hoverSprite = this.greyBtn;
      }
    } else if (mul2 == 5) {
      this.node.children[1].children[0].getComponent(cc.Sprite).spriteFrame =
        this.xdo;
      this.node.children[2].children[0].getComponent(cc.Sprite).spriteFrame =
        this.xdo;
      this.node.children[1].getComponent(cc.Sprite).spriteFrame =
        this.spFrameRowLongRed;
      this.node.children[2].getComponent(cc.Sprite).spriteFrame =
        this.spFrameRowLongRed;
      this.sbmtBtn.interactable = false;
      this.sbmtBtn.normalSprite = this.greyBtn;
      this.sbmtBtn.hoverSprite = this.greyBtn;
      this.nDiemHang1.children[0].color = cc.color(231, 45, 24, 255);
      this.nDiemHang2.children[0].color = cc.color(231, 45, 24, 255);
    } else if (mul1 == 5) {
    } else if (slot1 < slot2) {
      // this.node.children[1].color = cc.color(255,0,0)
      // this.node.children[2].color = cc.color(255,0,0)
      this.node.children[1].children[0].getComponent(cc.Sprite).spriteFrame =
        this.xdo;
      this.node.children[2].children[0].getComponent(cc.Sprite).spriteFrame =
        this.xdo;
      this.node.children[1].getComponent(cc.Sprite).spriteFrame =
        this.spFrameRowLongRed;
      this.node.children[2].getComponent(cc.Sprite).spriteFrame =
        this.spFrameRowLongRed;
      this.sbmtBtn.interactable = false;
      this.nDiemHang1.children[0].color = cc.color(231, 45, 24, 255);
      this.nDiemHang2.children[0].color = cc.color(231, 45, 24, 255);
    } else {
      if (slot2 == slot1 && this.lung2HangCuoi()) {
        this.node.children[1].children[0].getComponent(cc.Sprite).spriteFrame =
          this.xdo;
        this.node.children[2].children[0].getComponent(cc.Sprite).spriteFrame =
          this.xdo;
        this.node.children[1].getComponent(cc.Sprite).spriteFrame =
          this.spFrameRowLongRed;
        this.node.children[2].getComponent(cc.Sprite).spriteFrame =
          this.spFrameRowLongRed;
        // this.node.children[1].color = cc.color(255,0,0)
        // this.node.children[2].color = cc.color(255,0,0)

        this.nDiemHang1.children[0].color = cc.color(231, 45, 24, 255);
        this.nDiemHang2.children[0].color = cc.color(231, 45, 24, 255);
        this.sbmtBtn.interactable = false;
        this.sbmtBtn.normalSprite = this.greyBtn;
        this.sbmtBtn.hoverSprite = this.greyBtn;
      }
    }
    if (
      this.node.children[3].getComponent(cc.Sprite).spriteFrame ==
        this.spFrameRowShortGreen &&
      this.node.children[1].getComponent(cc.Sprite).spriteFrame ==
        this.spFrameRowLongGreen &&
      this.node.children[2].getComponent(cc.Sprite).spriteFrame ==
        this.spFrameRowLongGreen
    ) {
      this.sbmtBtn.interactable = true;
      this.sbmtBtn.normalSprite = this.goldBtn;
      this.sbmtBtn.hoverSprite = this.goldBtn;
    }
    
    if (lungChecker == 0) {
      this.sbmtBtn.interactable = true;
      this.sbmtBtn.normalSprite = this.goldBtn;
      this.sbmtBtn.hoverSprite = this.goldBtn;
      this.nutXdo.node.children[0].getComponent(cc.Sprite).spriteFrame = this.nutXdoGrey
      this.nutXdo.normalSprite = this.nutXdoGrey;
      this.nutXdo.hoverSprite = this.nutXdoGrey;
      this.nutXdo.interactable = false;
      this.nutXxam.active = true

    }

    this.nMultiple1.active = false;
    this.nMultiple2.active = false;
    this.nMultiple3.active = false;

    if (mul1 > 1) {
      this.nMultiple1.active = true;
      this.nMultiple1.children[0].active = mul1 == 2;
      this.nMultiple1.children[1].active = mul1 == 3;
      this.nMultiple1.children[2].active = mul1 == 5;
    }
    if (mul2 > 1) {
      this.nMultiple2.active = true;
      this.nMultiple2.children[0].active = mul2 == 2;
      this.nMultiple2.children[1].active = mul2 == 3;
      this.nMultiple2.children[2].active = mul2 == 5;
    }
    if (mul3 > 1) {
      this.nMultiple3.active = true;
      this.nMultiple3.children[0].active = mul3 == 2;
      this.nMultiple3.children[1].active = mul3 == 3;
      this.nMultiple3.children[2].active = mul3 == 5;
    }
    this.nDiemHang1.active = mul1 != 5;
    this.nDiemHang2.active = mul2 != 5;
    this.nDiemHang3.active = true;
    this.lblDiemHang1.string = LanguageMgr.getString("shweshan.value_slot", {
      value: slot1,
    });
    this.lblDiemHang2.string = LanguageMgr.getString("shweshan.value_slot", {
      value: slot2,
    });
    this.lblDiemHang3.string = LanguageMgr.getString("shweshan.value_slot", {
      value: slot3,
    });
  }
  lung2HangCuoi() {
    let cardHang2 = this.soSanh2Card(
      this.soSanh2Card(this._cardData[3], this._cardData[4]),
      this._cardData[5]
    );
    let cardHang3 = this.soSanh2Card(
      this.soSanh2Card(this._cardData[0], this._cardData[1]),
      this._cardData[2]
    );
    let resultCard = this.soSanh2Card(cardHang2, cardHang3);
    if (resultCard == cardHang2) {
      return true;
    }
    return false;
  }
  lung3La2HangCuoi() {
    if (
      CardLogic.getSingleRank(this._cardData[3]) >
      CardLogic.getSingleRank(this._cardData[0])
    ) {
      return true;
    } else if (
      CardLogic.getSingleRank(this._cardData[3]) <
      CardLogic.getSingleRank(this._cardData[0])
    ) {
      return false;
    }
    return false;
  }
  soSanh2Card(card1, card2) {
    if (CardLogic.getSingleRank(card1) > CardLogic.getSingleRank(card2)) {
      return card1;
    } else if (
      CardLogic.getSingleRank(card2) > CardLogic.getSingleRank(card1)
    ) {
      return card2;
    } else {
      if (CardLogic.getSingleSuit(card1) > CardLogic.getSingleSuit(card2)) {
        return card1;
      } else if (
        CardLogic.getSingleSuit(card1) < CardLogic.getSingleSuit(card2)
      ) {
        return card2;
      }
    }
  }
  getScore(card1 = 0, card2 = 0, card3 = -4) {
    let score = 0;
    score =
      (CardLogic.getSingleScore(card1) +
        CardLogic.getSingleScore(card2) +
        CardLogic.getSingleScore(card3)) %
      10;
    return score;
  }
  swapCard() {
    var tempId = this._firstCard.getComponent(BaseCard).serverId;
    this._firstCard
      .getComponent(BaseCard)
      .setTextureWithCode(this._seccondCard.getComponent(BaseCard).serverId);
    this._seccondCard.getComponent(BaseCard).setTextureWithCode(tempId);
    let data = [];
    for (let i = 0; i < this.cardNode.length; i++) {
      data.push(this.cardNode[i].getComponent(BaseCard).serverId);
    }
    this._cardData = data;
    SHWESHANController.instance.changeCard(
      this._firstCardIdx,
      this._seccondCardIdx,
      data
    );
    // cc.log("swapCard", data);
    this.showScore();
  }

  rearrange() {
    if (Number(this.cooldown_lbl.string) > 0) {
      SHWESHANController.instance.XEP_BAI_LAI(this._cardData);
    }
  }

  show() {
    //register event drag drop and button
  }

  hide() {}
  submitCard() {
    if (SHWESHANController.instance.isPlayerInteract == false) {
      SHWESHANController.instance.isPlayerInteract = true;
    }
    this.node.active = false;
    SHWESHANController.instance.submitCard(this._cardData);
  }
  boLuot() {
    if (SHWESHANController.instance.isPlayerInteract == false) {
      SHWESHANController.instance.isPlayerInteract = true;
    }
    this.node.active = false;

    SHWESHANController.instance.submitBoLuot(this._cardData);
  }



  update(dt) {
    if (this.timeRemain.fillRange > 0) {
      this.cooldown_lbl.string = parseInt(
        (this._timeRemain * this.timeRemain.fillRange).toString()
      ).toString();
      SHWESHANController.instance.timexepbai = parseInt(this.cooldown_lbl.string);
    }
  }
}
