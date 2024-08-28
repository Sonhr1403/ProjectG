import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import AvatarsCtrl from "../../lobby/scripts/AvatarsCtrl";
import HeaderCtrl from "../../lobby/scripts/HeaderCtrl";
import ArrangeCard from "./SHWESHAN.ArrangeCard";
import BaseCard from "./SHWESHAN.BaseCard";
import { CardLogic } from "./SHWESHAN.CardLogic";
import SHWESHANConstant from "./SHWESHAN.Constant";
import SHWESHANController from "./SHWESHAN.Controller";
import EmosUtils from "./SHWESHAN.EmosUtil";

const { ccclass, property } = cc._decorator;
export enum CHILD_TAG {
  // AVATAR = 0,
  // CARD = 1,
  // INFO = 3,
  ACTION = 4,
  // LEAVE = 6,
  CHAT = 10,
  STATUS = 7,
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
export default class SHWESHANPlayer extends cc.Component {
  public static instance: SHWESHANPlayer = null;

  @property(cc.Node)
  public skeletonAura: cc.Node = null;
  @property(cc.Label)
  lblNickname: cc.Label = null;
  @property(cc.Label)
  lblCoin: cc.Label = null;
  @property(cc.Sprite)
  avatar: cc.Sprite = null;
  @property(cc.Sprite)
  cardShow: cc.Sprite = null;
  @property(cc.Sprite)
  cardOnHand: cc.Sprite = null;
  @property(cc.Sprite)
  public timeRemain: cc.Sprite = null;
  @property(cc.Label)
  lbStatus: cc.Label = null;

  @property(cc.Node)
  iconWatching: cc.Node = null;
  @property([cc.SpriteFrame])
  sprAvatars: cc.SpriteFrame[] = [];
  @property(cc.SpriteFrame)
  defaultAvatars: cc.SpriteFrame = null;

  isMe: boolean = false;
  pos: number = 0;

  @property(cc.Label)
  goldWin: cc.Label = null;

  @property(cc.Node)
  chatEmotion: cc.Node = null;
  @property(cc.Node)
  chatMsg: cc.Node = null;

  @property(cc.Node)
  nLeave: cc.Node = null;

  @property(cc.Node)
  nCardScore: cc.Node = null;

  @property(cc.Label)
  lblScore: cc.Label = null;

  @property(cc.Node)
  nMultipleBet: cc.Node = null;

  @property(cc.Node)
  cardNode: cc.Node[] = [];

  @property(cc.Font)
  fontWin: cc.Font = null;
  @property(cc.Font)
  fonLose: cc.Font = null;
  @property(cc.SpriteFrame)
  scoreLose: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  scoreWin: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  blueThink: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  redThink: cc.SpriteFrame = null;

  @property(cc.Node)
  kissNode: cc.Node = null;

  _cardData: any[];
  current_money: number = 0;
  arrPosCard: cc.Vec2[] = [cc.v2(0, 0), cc.v2(-92, 238)];
  arrPosCard4: cc.Vec2[] = [
    cc.v2(0, 0),
    cc.v2(356, 69),
    cc.v2(-95, 238),
    cc.v2(-557, 69),
  ];
  ingame = false;
  active = false;
  info = null;
  private thinkingAct: cc.Tween = null;
  timeoutChat = null;
  listCardsSlot: BaseCard[] = [];
  dataCards = [];
  _coin = 0;
  _arrIdxBaiChia = [3, 4, 5, 1, 2];
  _arrIdxMoBai = [3, 1, 4, 2, 5];
  _arrIdxMoBai2 = [1, 4, 2, 5, 3];
  _cards = [];
  _cardType = null;
  status = 0;
  // isRunSubmitCard = false;
  isShowScore = false;
  actionHasRun = false;
  private _localTimeTotal = 0;
  private _localTimer: number = -1;
  private posCard = [
    //card on hand
    // [-63.134, -21.784, 16],  //1
    // [-3.506, -15.821, 0], //2
    // [64.256, -26.906, -12], //3
    // [-62.136, 80.332, 14], //4
    // [-11.155, 92.131, 0], //5
    // [61.981, 86.616, -10], //6
    // [-31.681, 179.173, 7.5], //7
    // [31.847, 176.652, -7.5], //8

    [-49.414, -28.75, 10], //1
    [-2.338, -26.25, 0], //2
    [40.755, -34.455, -10], //3
    [-41.954, 53.75, 10], //4
    [-1.25, 55, 0], //5
    [36.192, 45, -10], //6
    [-22.5, 136.25, 7.5], //7
    [20, 129, -7.5], //8
  ];

  private otherposCard = [
    //card on hand not me
    [-39.288, -24.383, 10], //1
    [-2.929, -22.782, 0], //2
    [36.369, -29.438, -10], //3
    [-30.712, 37.3, 10], //4
    [-0.238, 36.433, 0], //5
    [29.178, 28.933, -10], //6
    [-14.262, 96.897, 7.5], //7
    [12.362, 93.147, -7.5], //8
  ];

  private soChiCard = [
    [6, 7],
    [3, 4, 5],
    [0, 1, 2],
  ];

  start() {
    this.skeletonAura.active = false;
  }

  setPlayerInfo(info) {
    this.skeletonAura.active = false;

    // console.log("Sws Player setPlayerInfo", info);
    // console.log("Sws Player setPlayerInfo", info.nickName.substr(0, 7));
    if (info.displayName.length <= 8) {
      this.lblNickname.string = info.displayName;
    } else {
      this.lblNickname.string = info.displayName.substr(0, 8) + "...";
    }
    this.current_money = info.money;
    this.setCoin(info.money);
    let avarId = Math.min(8, parseInt(info.avatar));
    this.avatar.spriteFrame = this.sprAvatars[avarId];
    this.updateAva(info.avatar)
    this.node.active = true;
    this.active = true;
    this.info = info;
  }
  //test
  private updateAva(ava) {
    console.error(":" , ava);
    if (ava !== "0") {
      if (this.isMe) {
        cc.log(
          BGUI.UserManager.instance.mainUserInfo.avatar,
          ava !== BGUI.UserManager.instance.mainUserInfo.avatar
        );
        if (ava !== BGUI.UserManager.instance.mainUserInfo.avatar) {
          cc.assetManager.loadRemote(ava, (err, texture) => {
            if (err) {
              console.error("Failed to load image: ", err);
              this.avatar.spriteFrame = this.defaultAvatars;
              return;
            }

            if (texture instanceof cc.Texture2D) {
              let spTemp = new cc.SpriteFrame(texture);
              this.avatar.spriteFrame = spTemp;
            } else {
              console.error("Loaded asset is not a Texture2D");
              this.avatar.spriteFrame = this.defaultAvatars;
              return;
            }
          });
        } else {
          this.avatar.spriteFrame = this.defaultAvatars;
        }
      } else {
        cc.assetManager.loadRemote(ava, (err, texture) => {
          if (err) {
            console.error("Failed to load image: ", err);
            this.avatar.spriteFrame = this.defaultAvatars;
            return;
          }

          if (texture instanceof cc.Texture2D) {
            let spTemp = new cc.SpriteFrame(texture);
            this.avatar.spriteFrame = spTemp;
          } else {
            console.error("Loaded asset is not a Texture2D");
            this.avatar.spriteFrame = this.defaultAvatars;
            return;
          }
        });
      }
    } else {
      this.avatar.spriteFrame = this.defaultAvatars;
    }
  }

  runEffectChangeCard(idx1, idx2) {
    //
    let card1 = this.cardNode[idx1];
    let card2 = this.cardNode[idx2];
    let oldCardPos1 = card1.getPosition();
    let oldCardRot1 = this.isMe ? this.posCard[idx1] : this.otherposCard[idx1];
    // let oldCardRot1 = this.posCard[idx1];

    let oldCardPos2 = card2.getPosition();
    let oldCardRot2 = this.isMe ? this.posCard[idx2] : this.otherposCard[idx2];
    // let oldCardRot2 = this.posCard[idx2];
    card1.setPosition(oldCardPos2);
    card1.setRotation(oldCardRot2[2]);

    card2.setPosition(oldCardPos1);
    card2.setRotation(oldCardRot1[2]);
    card1.runAction(
      cc.spawn(cc.moveTo(0.3, oldCardPos1), cc.rotateTo(0.3, -oldCardRot1[2]))
    );
    card2.runAction(
      cc.spawn(cc.moveTo(0.3, oldCardPos2), cc.rotateTo(0.3, -oldCardRot2[2]))
    );
  }

  showScore(idxbo, cards, all9 = false) {
    this.isShowScore = true;
    this.nCardScore.children[0].active = !all9 ? true : false;
    this.nCardScore.active = true;
    let tempX = this.nCardScore.x;
    let tempY = this.nCardScore.y;
    this.nCardScore.children[0].getComponent(cc.Sprite).spriteFrame =
      this.scoreWin;
    this.lblScore.node.active = true; //false
    let score = -1;
    if (idxbo == 1) {
      if (this.isMe) {
        this.nMultipleBet.setPosition(-120, 160);
        this.nCardScore.setPosition(tempX, 20);
        // this.nCardScore.setPosition(tempX, 10);
        this.nCardScore.setScale(1, 1);
      } else {
        this.nMultipleBet.setPosition(tempX + 65, 90);
        this.nCardScore.setPosition(tempX, -10);
        this.nCardScore.setScale(0.7, 0.7);
      }
      // this.nCardScore.setPosition(tempX, 4);
      // if(this.isMe){
      //   this.nCardScore.setPosition(tempX - 3, 0);

      // }
      if (all9) {
        this.nCardScore.children[0].active = false;
        this.nCardScore.children[2].setPosition(
          this.isMe ? -120 : this.nCardScore.children[0].x - 93,
          -40.5
          // this.isMe ? tempY - 100 : tempY - 75
        );
        this.nCardScore.children[2].setScale(
          this.isMe ? 1 : 0.8,
          this.isMe ? 1 : 0.8
        );
      }
      score = this.getScore(cards[6], cards[7]);
    } else if (idxbo == 2) {
      if (this.isMe) {
        this.nMultipleBet.setPosition(-105, 90);
        this.nCardScore.setPosition(tempX, -43.905);
        // this.nCardScore.setPosition(tempX  , -50);
        this.nCardScore.setScale(1, 1);
      } else {
        this.nMultipleBet.setPosition(tempX + 80, 55);
        this.nCardScore.setPosition(tempX, -40);
        this.nCardScore.setScale(0.8, 0.8);
      }
      // this.nMultipleBet.setPosition(this.nCardScore.x + 60, 70);
      // this.nCardScore.setPosition(tempX  , -10);
      score = this.getScore(cards[3], cards[4], cards[5]);
    } else {
      if (this.isMe) {
        this.nMultipleBet.setPosition(-95, 20);
        this.nCardScore.setPosition(tempX, -80);
        // this.nCardScore.setPosition(tempX  , -110);
        this.nCardScore.setScale(1, 1);
      } else {
        this.nMultipleBet.setPosition(tempX + 100, -3);
        this.nCardScore.setPosition(tempX, -85);
        this.nCardScore.setScale(0.8, 0.8);
      }

      score = this.getScore(cards[0], cards[1], cards[2]);
    }

    let arr1 = [cards[0], cards[1], cards[2]];
    let arr2 = [cards[3], cards[4], cards[5]];
    let arr3 = [cards[6], cards[7]];
    let multiple = 1;
    if (idxbo == 1) {
      multiple = CardLogic.checkMultipleBet(arr3);
    } else if (idxbo == 2) {
      multiple = CardLogic.checkMultipleBet(arr2);
    } else {
      multiple = CardLogic.checkMultipleBet(arr1);
    }
    this.nCardScore.children[1].active = multiple == 5;
    this.nCardScore.children[2].active = all9;
    if (multiple == 5) {
      // this.nCardScore.getComponent(cc.Sprite).enabled = false;
      this.lblScore.node.active = false; //false
    } else {
      // this.nCardScore.getComponent(cc.Sprite).enabled = true;
      this.lblScore.node.active = true;
      if (score < 0) {
        this.lblScore.string = LanguageMgr.getString("shweshan.value_slot", {
          value: 0,
        });
        // this.lblScore.string = this.getScore(cards[6], cards[7]).toString()
      } else {
        this.lblScore.string = LanguageMgr.getString("shweshan.value_slot", {
          value: score,
        });
        // this.lblScore.string = this.getScore(cards[6], cards[7]).toString()
      }
    }

    //pos 110, 70, 30
    if (multiple > 1) {
      this.nMultipleBet.active = true;
      this.nMultipleBet.children[0].active = multiple == 2;
      this.nMultipleBet.children[1].active = multiple == 3;
      this.nMultipleBet.children[2].active = multiple == 5;
    } else {
      this.nMultipleBet.active = false;
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

  boLuot() {
    this.node.children[CHILD_TAG.STATUS].children[0].active = true;
    this.scheduleOnce(() => {
      this.node.children[CHILD_TAG.STATUS].children[0].active = false;
    }, 2);
  }

  setLeaveRoom() {
    this.node.active = false;
    this.active = false;
    this.info = null;
    this.setStatus();
  }

  hideScore() {
    this.nCardScore.active = false;
    this.nMultipleBet.active = false;
  }

  chiaBaiPlayerUpdate() {
    this.skeletonAura.active = false;
    this.cleanCard();

    this.cardOnHand.node.active = true;
    // this.cardOnHand.node.scaleX = 1
    // this.cardOnHand.node.scaleY = 1
    this.node.stopAllActions();
    for (let i = 0; i < this.cardNode.length; i++) {
      this.cardNode[i].active = true;
      this.isMe
        ? this.cardNode[i].setPosition(this.posCard[i][0], this.posCard[i][1])
        : this.cardNode[i].setPosition(
            this.otherposCard[i][0],
            this.otherposCard[i][1]
          );
      this.isMe
        ? this.cardNode[i].setRotation(-this.posCard[i][2])
        : this.cardNode[i].setRotation(-this.otherposCard[i][2]);
      //   this.cardNode[i].setScale(0.87);
      //   this.cardNode[i].setScale(2);

      if (this.isMe) {
        this.cardNode[i].getComponent(cc.Sprite).spriteFrame =
          SHWESHANController.instance.spriteCards[this.dataCards[i]];
        this.cardNode[i].setScale(1, 1); //1.2
      } else {
        this.cardNode[i].getComponent(cc.Sprite).spriteFrame =
          SHWESHANController.instance.spriteCardBack;
        this.cardNode[i].setScale(0.87, 0.87);
      }
    }
  }

  effectChiaBai() {
    this.skeletonAura.active = false;
    // console.log("Sws Player effectChiaBai");
    let self = this;
    var arPoint = SHWESHANController.instance.nChiaBai.convertToWorldSpaceAR( cc.v2(0, 0) );
    var pos = this.cardOnHand.node.convertToNodeSpaceAR(arPoint);

    let toPos = cc.v2(0, 0);
    let delay = 0;
    for (let i = 0; i < this.cardNode.length; i++) {
      this.cardNode[i].active = true;
      this.cardNode[i].setPosition(pos);
      this.cardNode[i].setRotation(180);
      this.cardNode[i].setScale(0.2);
      this.cardNode[i].getComponent(cc.Sprite).spriteFrame =
        SHWESHANController.instance.spriteCardBack;
      if (this.isMe) {
        this.cardNode[i].runAction(
          cc.sequence(
            cc.delayTime(delay),
            cc.spawn(
              cc.moveTo(
                0.5,
                this.isMe ? this.posCard[i][0] : this.otherposCard[i][0],
                this.isMe ? this.posCard[i][1] : this.otherposCard[i][1]
              ),
              cc.rotateBy( 0.5, 360 - 180 - (this.isMe ? this.posCard[i][2] : this.otherposCard[i][2]) ),
              cc.sequence(
                cc.scaleTo(0.25, 1), //0.25,1.2
                cc.scaleTo(0.125, 0, 1), //0.125,0,1
                cc.callFunc(() => {
                  this.cardNode[i].getComponent(cc.Sprite).spriteFrame =
                    SHWESHANController.instance.spriteCards[self.dataCards[i]];
                }),
                cc.scaleTo(0.125, 1), //0.125,1.2
                cc.callFunc(() => {
                  if (i == this.cardNode.length - 1) {
                  }
                })
              )
            )
          )
        );
      } else {
        this.cardNode[i].runAction(
          cc.sequence(
            cc.delayTime(delay),
            cc.spawn(
              cc.moveTo(
                0.5,
                this.isMe ? this.posCard[i][0] : this.otherposCard[i][0],
                this.isMe ? this.posCard[i][1] : this.otherposCard[i][1]
              ),
              cc.rotateBy(
                0.5,
                360 -
                  180 -
                  (this.isMe ? this.posCard[i][2] : this.otherposCard[i][2])
              ),
              // cc.moveTo(0.5, this.posCard[i][0], this.posCard[i][1]),
              // cc.rotateBy(0.5, 360 - 180 - this.posCard[i][2]),
              cc.scaleTo(0.25, 0.87) //0.875
            )
          )
        );
      }
      delay += 0.06; //0.1
    }
  }
  updateCardOnHand() {
    //gán ảnh cho node bài
    // console.log("Sws Player updateCardOnHand");
    for (let i = 0; i < this.cardNode.length; i++) {
      this.cardNode[i].getComponent(cc.Sprite).spriteFrame =
        SHWESHANController.instance.spriteCards[this.dataCards[i]];
    }
  }

  runEffectSubmitCard() {
    //nộp bài
    this.hidePlayCountdown();
    // console.log("Sws Player runEffectSubmitCard");
    let self = this;
    if (this.isMe) {
      //this.isMe && !this.isRunSubmitCard
      // this.isRunSubmitCard = true;
      this.cardOnHand.node.active = true;
      for (let i = 0; i < this.cardNode.length; i++) {
        this.cardNode[i].stopAllActions();
        let card =
          SHWESHANController.instance.nArrangeCard.getComponent(ArrangeCard)
            .cardNode[i];
        let arPoint = card.convertToWorldSpaceAR(cc.v2(0, 0));
        let pos = this.cardOnHand.node.convertToNodeSpaceAR(arPoint);
        this.cardNode[i].active = true;
        this.cardNode[i].setPosition(pos);
        this.cardNode[i].runAction(
          cc.spawn(
            cc.moveTo(
              0.5,
              this.isMe ? this.posCard[i][0] : this.otherposCard[i][0],
              this.isMe ? this.posCard[i][1] : this.otherposCard[i][1]
            ),
            cc.rotateTo(
              0.5,
              this.isMe ? -this.posCard[i][2] : -this.otherposCard[i][2]
            ),

            // cc.moveTo(0.5, this.posCard[i][0], this.posCard[i][1]),
            // cc.rotateTo(0.5, -this.posCard[i][2]),
            cc.scaleTo(0.25, 1) //1.2
          )
        );
      }
    }
  }
  runEffectOpenArrangeCard() {
    //Mở bài
    this.timeRemain.node.active = true;
    // console.log("Sws Player runEffectOpenArrangeCard");
    this.cardOnHand.node.active = true;
    for (let i = 0; i < this.cardNode.length; i++) {
      this.cardNode[i].stopAllActions();
      let card =
        SHWESHANController.instance.nArrangeCard.getComponent(ArrangeCard)
          .cardNode[i];
      let arPoint = card.convertToWorldSpaceAR(cc.v2(0, 0));
      let pos = this.cardOnHand.node.convertToNodeSpaceAR(arPoint);
      this.cardNode[i].active = true;
      // this.cardNode[i].setPosition(pos);
      this.cardNode[i].runAction(
        cc.sequence(
          cc.spawn(
            cc.moveTo(0.5, pos),
            cc.rotateTo(0.5, 0),
            cc.scaleTo(0.25, 0.8) //0.875
          ),
          cc.callFunc(() => {
            if (i == this.cardNode.length - 1) {
              SHWESHANController.instance.showArrangeCard(this.dataCards);
              this.cardOnHand.node.active = false;
            }
          })
        )
      );
    }
  }

  hideBai(indexBo, cards) {
    this.nCardScore.active = false;
    for (let i = 0; i < this.cardOnHand.node.children.length; i++) {
      if (!this.isMe) {
        this.cardOnHand.node.children[i].color = new cc.Color().fromHEX(
          "#FFFFFF"
        );
      }
      if (this.isMe) {
        if (i > 0 && i < 9) {
          this.cardOnHand.node.children[i].children[0].active = false;
        }
      }
    }
    // console.log("Sws Player hideBai");
    let self = this;
    if (this.isMe) {
      for (let i = 0; i < this.cardNode.length; i++) {
        this.cardNode[i].active = true;
        if (this.isMe) {
          this.cardNode[i].color = cc.color(153, 153, 153);
          // this.cardNode[i].color = cc.color(255, 255, 255);
        } else {
        }
      }
      return;
    }
    for (let i = 0; i < this.soChiCard[indexBo - 1].length; i++) {
      //this.cardNode[this.soChiCard[indexBo-1][i]].active = false;
      this.cardShow.node.children[i + 1].stopAllActions();
      this.cardShow.node.children[i + 1].active = true;
      this.cardShow.node.children[i + 1].setPosition(
        this.isMe
          ? this.posCard[this.soChiCard[indexBo - 1][i]][0]
          : this.otherposCard[this.soChiCard[indexBo - 1][i]][0],
        this.isMe
          ? this.posCard[this.soChiCard[indexBo - 1][i]][1]
          : this.otherposCard[this.soChiCard[indexBo - 1][i]][1]
        // this.posCard[this.soChiCard[indexBo - 1][i]][0],
        // this.posCard[this.soChiCard[indexBo - 1][i]][1]
      );
      this.cardShow.node.children[i + 1].setRotation(
        this.isMe
          ? this.posCard[this.soChiCard[indexBo - 1][i]][2]
          : this.otherposCard[this.soChiCard[indexBo - 1][i]][2]
        // this.posCard[this.soChiCard[indexBo - 1][i]][2]
      );
      this.cardShow.node.children[i + 1].getComponent(cc.Sprite).spriteFrame =
        SHWESHANController.instance.spriteCards[
          cards[this.soChiCard[indexBo - 1][i]]
        ];

      this.cardShow.node.children[i + 1].color = new cc.Color().fromHEX(
        this.isMe ? "#999999" : "#FFFFFF"
      );
      let x = this.isMe
        ? this.posCard[this.soChiCard[indexBo - 1][i]][0]
        : this.otherposCard[this.soChiCard[indexBo - 1][i]][0];
      let y = this.isMe
        ? this.posCard[this.soChiCard[indexBo - 1][i]][1]
        : this.otherposCard[this.soChiCard[indexBo - 1][i]][1];
      // let x = this.posCard[this.soChiCard[indexBo - 1][i]][0];
      // let y = this.posCard[this.soChiCard[indexBo - 1][i]][1];
      let yMid =
        indexBo == 1 ? 100 : this.posCard[this.soChiCard[indexBo - 1][1]][1];
      let rotate = this.isMe
        ? this.posCard[this.soChiCard[indexBo - 1][i]][2]
        : this.otherposCard[this.soChiCard[indexBo - 1][i]][2];
      // let rotate = this.posCard[this.soChiCard[indexBo - 1][i]][2];

      this.cardShow.node.children[i + 1].runAction(
        cc.sequence(
          cc.spawn(cc.rotateTo(0.2, 0), cc.moveTo(0.2, 0, yMid + 20)),
          cc.scaleTo(0.2, 0, 0.87),
          cc.callFunc(() => {
            this.cardShow.node.children[i + 1].getComponent(
              cc.Sprite
            ).spriteFrame = SHWESHANController.instance.spriteCardBack;
            
          }),
          cc.spawn(
            cc.scaleTo(0.2, 0.87),
            cc.moveTo(0.2, x, y),
            cc.rotateTo(0.2, -rotate)
          )
        )
      );
    }
  }
  hideBaiLung(lungx2 = false) {
    // console.log("numberrlung:", this, this.cardNode);
    // console.log("Sws Player hideBaiLung");
    let self = this;
    let delay = 0;
    lungx2 = false;
    // if (this.isMe) {
    //   for (let i = 0; i < this.cardNode.length; i++) {
    //     this.cardNode[i].active = true;
    //     if (this.isMe) {
    //       this.cardNode[i].color = cc.color(153, 153, 153);
    //     } else {
    //     }
    //   }
    //   return;
    // }

    // for (let i = 0; i < this.cardNode.length; i++) {
    //   if (lungx2) {
    //     if (i >= 6) {
    //       this.cardNode[i].runAction(
    //         cc.sequence(
    //           cc.delayTime(delay),
    //           cc.sequence(
    //             cc.delayTime(0.05),
    //             cc.scaleTo(0.075, 0, 0.87),
    //             cc.callFunc(() => {
    //               self.cardNode[i].getComponent(cc.Sprite).spriteFrame =
    //                 SHWESHANController.instance.spriteCardBack;
    //             }),
    //             cc.scaleTo(0.075, 0.87, 0.87)
    //           )
    //         )
    //       );
    //     }
    //   } else {
    //     this.cardNode[i].runAction(
    //       cc.sequence(
    //         cc.delayTime(delay),
    //         cc.sequence(
    //           cc.delayTime(0.05),
    //           cc.scaleTo(0.075, 0, 0.87),
    //           cc.callFunc(() => {
    //             self.cardNode[i].getComponent(cc.Sprite).spriteFrame =
    //               SHWESHANController.instance.spriteCardBack;
    //           }),
    //           cc.scaleTo(0.075, 0.87, 0.87)
    //         )
    //       )
    //     );
    //   }
    // }
  }
  showBaiLung(cards, lungx2 = false) {
    // console.log("Sws Player showBaiLung");
    // console.log("player info:", this.info);
    // for (let i = 0; i < this.cardNode.length; i++) {
    //   console.log(
    //     "info bai ",
    //     i,
    //     ":",
    //     this.cardNode[i].getComponent(cc.Sprite).spriteFrame
    //   );
    // }
    let self = this;
    let delay = 0;
    lungx2 = false;
    this.stateBaiLung();
    for (let i = 0; i < this.cardNode.length; i++) {
      this.cardNode[i].active = true;
      if (this.isMe) {
        this.cardNode[i].runAction(
          cc.sequence(
            cc.delayTime(delay),
            cc.moveBy(0.1, 0, 20),
            cc.moveBy(0.1, 0, -20)
          )
        );
      } else {
        // self.cardNode[i].getComponent(cc.Sprite).spriteFrame =
        //   SHWESHANController.instance.spriteCardBack;
        if (lungx2) {
          if (i >= 6) {
            this.cardNode[i].runAction(
              cc.sequence(
                cc.delayTime(delay),
                cc.spawn(
                  cc.sequence(cc.moveBy(0.1, 0, 20), cc.moveBy(0.1, 0, -20)),
                  cc.sequence(
                    cc.delayTime(0.05),
                    cc.scaleTo(0.075, 0, 0.87),
                    cc.callFunc(() => {
                      self.cardNode[i].getComponent(cc.Sprite).spriteFrame =
                        SHWESHANController.instance.spriteCards[cards[i]];
                    }),
                    cc.scaleTo(0.075, 0.87, 0.87)
                  )
                )
              )
            );
          } else {
            this.cardNode[i].runAction(
              cc.sequence(
                cc.delayTime(delay),
                cc.moveBy(0.1, 0, 20),
                cc.moveBy(0.1, 0, -20)
              )
            );
          }
        } else {
          this.cardNode[i].runAction(
            cc.sequence(
              cc.delayTime(delay),
              cc.spawn(
                cc.sequence(cc.moveBy(0.1, 0, 20), cc.moveBy(0.1, 0, -20)),
                cc.sequence(
                  cc.delayTime(0.05),
                  cc.scaleTo(0.075, 0, 0.87),
                  cc.callFunc(() => {
                    self.cardNode[i].getComponent(cc.Sprite).spriteFrame =
                      SHWESHANController.instance.spriteCards[cards[i]];
                  }),
                  cc.scaleTo(0.075, 0.87, 0.87)
                )
              )
            )
          );
        }
      }

      delay += 0.05;
    }
  }
  soBo(indexBo, cards, all9 = false) {
    this.lbStatus.node.parent.active = false;

    // console.log("Sws Player soBo");
    if (indexBo == 1) {
      this.cardShow.node.active = true;
    }
    for (let i = 0; i < this.cardShow.node.children.length; i++) {
      this.cardShow.node.children[i].active = false;
    }
    for (let i = 0; i < this.cardNode.length; i++) {
      this.cardNode[i].active = true;
      if (this.isMe) {
        this.cardNode[i].color = cc.color(153, 153, 153);
        // this.cardNode[i].color = cc.color(255, 255, 255);
      } else {
      }
    }
    for (let i = 0; i < this.soChiCard[indexBo - 1].length; i++) {
      this.cardNode[this.soChiCard[indexBo - 1][i]].active = false;
      this.cardShow.node.children[i + 1].active = true;
      this.cardShow.node.children[i + 1].setPosition(
        this.isMe
          ? this.posCard[this.soChiCard[indexBo - 1][i]][0]
          : this.otherposCard[this.soChiCard[indexBo - 1][i]][0],
        this.isMe
          ? this.posCard[this.soChiCard[indexBo - 1][i]][1]
          : this.otherposCard[this.soChiCard[indexBo - 1][i]][1]
        // this.posCard[this.soChiCard[indexBo - 1][i]][0],
        // this.posCard[this.soChiCard[indexBo - 1][i]][1]
      );
      this.cardShow.node.children[i + 1].setRotation(
        this.isMe
          ? this.posCard[this.soChiCard[indexBo - 1][i]][2]
          : this.otherposCard[this.soChiCard[indexBo - 1][i]][2]
        // this.posCard[this.soChiCard[indexBo - 1][i]][2]
      );
      this.cardShow.node.children[i + 1].getComponent(cc.Sprite).spriteFrame =
        SHWESHANController.instance.spriteCardBack;
        
      this.cardShow.node.children[i + 1].color = new cc.Color().fromHEX(
        "#FFFFFF"
      );

      let x = this.isMe
        ? this.posCard[this.soChiCard[indexBo - 1][i]][0]
        : this.otherposCard[this.soChiCard[indexBo - 1][i]][0];
      let y = this.isMe
        ? this.posCard[this.soChiCard[indexBo - 1][i]][1]
        : this.otherposCard[this.soChiCard[indexBo - 1][i]][1];
      // let x = this.posCard[this.soChiCard[indexBo - 1][i]][0];
      // let y = this.posCard[this.soChiCard[indexBo - 1][i]][1];
      let yMid =
        indexBo == 1
          ? 100
          : this.isMe
          ? this.posCard[this.soChiCard[indexBo - 1][i]][1]
          : this.otherposCard[this.soChiCard[indexBo - 1][i]][1];
      // indexBo == 1 ? 100 : this.posCard[this.soChiCard[indexBo - 1][1]][1];
      let rotate = this.isMe
        ? this.posCard[this.soChiCard[indexBo - 1][i]][2]
        : this.otherposCard[this.soChiCard[indexBo - 1][i]][2];
      // let rotate = this.posCard[this.soChiCard[indexBo - 1][i]][2];

      this.cardShow.node.stopAllActions();
      if (this.isMe) {
        this.cardShow.node.children[i + 1].runAction(
          cc.sequence(
            cc.spawn(cc.rotateTo(0.2, 0), cc.moveTo(0.2, 0, yMid + 20)),
            cc.scaleTo(0.2, 0.87), //0, 0.87
            cc.callFunc(() => {
              this.cardShow.node.children[i + 1].getComponent(
                cc.Sprite
              ).spriteFrame =
                SHWESHANController.instance.spriteCards[
                  cards[this.soChiCard[indexBo - 1][i]]
                ];

              all9
                ? this.showScore(indexBo, cards, true)
                : this.showScore(indexBo, cards);
            }),
            cc.spawn(
              cc.scaleTo(0.2, 1), //1.2
              cc.moveTo(0.2, x, y),
              cc.rotateTo(0.2, -rotate)
            )
          )
        );
      } else {
        this.cardShow.node.children[i + 1].runAction(
          cc.sequence(
            cc.spawn(cc.rotateTo(0.2, 0), cc.moveTo(0.2, 0, yMid + 20)),
            cc.scaleTo(0.2, 0.87), //0, 0.87
            cc.callFunc(() => {
              this.cardShow.node.children[i + 1].getComponent(
                cc.Sprite
              ).spriteFrame =
                SHWESHANController.instance.spriteCards[
                  cards[this.soChiCard[indexBo - 1][i]]
                ];

              all9
                ? this.showScore(indexBo, cards, true)
                : this.showScore(indexBo, cards);
            }),
            cc.spawn(
              cc.scaleTo(0.2, 0.87), //0.87
              cc.moveTo(0.2, x, y),
              cc.rotateTo(0.2, -rotate)
            )
          )
        );
      }
    }
  }

  chiaBai(delay) {
    // console.log("Sws Player chiaBai");
    this.cleanCard();
    this.cardOnHand.node.active = true;

    this.node.stopAllActions();
    this.effectChiaBai();
  }

  showXepBaiXong() {
    // console.log("Sws Player showXepBaiXong");
    this.iconWatching.active = false;
    this.avatar.node.color = new cc.Color().fromHEX("#FFFFFF");

    // this.lbStatus.node.active = true;
    // this.lbStatus.node.parent.active = true;
    // this.lbStatus.string = LanguageMgr.getString("shweshan.arranage_done");
    this.hidePlayCountdown();
  }
  stateBaiLung() {
    // console.log("Sws Player stateBaiLung");
    this.iconWatching.active = false;
    this.avatar.node.color = new cc.Color().fromHEX("#FFFFFF");
    this.lbStatus.node.active = true;
    this.lbStatus.node.parent.active = true;
    this.lbStatus.node.parent.setPosition(
      this.cardOnHand.node.x,
      this.isMe ? -90 : -100
    );
    this.lbStatus.string = LanguageMgr.getString("shweshan.zero_slot");
    if (this.actionHasRun == false) {
      this.lbStatus.node.runAction(
        cc.sequence(
          cc.callFunc(() => {
            this.lbStatus.node.opacity = 0;
            this.actionHasRun = true;
            this.lbStatus.node.setPosition(0, 0);
          }),
          cc.spawn(
            cc.fadeIn(1),
            cc.scaleTo(0.5, 1.1).easing(cc.easeBounceOut()), 
            cc.moveBy(1, cc.v2(0, 20))
          )
        )
      );
    }
  }

  setResult(result: number, gold: number, endgame = false) {
    this.nCardScore.children[0].getComponent(cc.Sprite).spriteFrame =
      this.scoreWin;
    // this.nCardScore.active = false; //tắt điểm bài sau khi so xong
    // this.nCardScore.active = true
    this.nMultipleBet.active = false;
    // if (!gold || gold == 0) return; //lỗi +0 không hiện tiền
    switch (result) {
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        this.node.children[CHILD_TAG.ACTION].children[0].active = this.isMe;
        break;
      default:
        this.node.children[CHILD_TAG.ACTION].children[1].active = this.isMe;
        break;
    }

    let str = "";
    if (gold < 0) {
      this.nCardScore.children[0].getComponent(cc.Sprite).spriteFrame =
        this.scoreLose;
      this.nMultipleBet.color = new cc.Color().fromHEX("#999999");
      if (this.lbStatus.node.parent.active == false) {
        for (let i = 0; i < this.cardShow.node.children.length; i++) {
          this.cardShow.node.children[i].color = new cc.Color().fromHEX(
            "#999999"
          );
        }
        for (let i = 0; i < this.cardOnHand.node.children.length; i++) {
          if (!this.isMe) {
            this.cardOnHand.node.children[i].color = new cc.Color().fromHEX(
              "#999999"
            );
          }
          if (this.isMe) {
            // if(i > 0 && i < 9){
            // this.cardOnHand.node.children[i].children[0].active = true
            // }
          }
        }
      }

      if (endgame) {
        this.nCardScore.children[0].getComponent(cc.Sprite).spriteFrame =
          this.scoreLose;
        for (let i = 0; i < this.cardOnHand.node.children.length; i++) {
          if (!this.isMe) {
            this.cardOnHand.node.children[i].color = new cc.Color().fromHEX(
              "#999999"
            );
          }
        }
        for (let i = 0; i < this.cardOnHand.node.children.length; i++) {
          if (this.isMe) {
            // this.cardOnHand.node.children[i].color = new cc.Color().fromHEX(
            //   "#999999"
            // );
            if (i > 0 && i < 9) {
              this.cardOnHand.node.children[i].children[0].active = true;
            }
          }
        }
      }
      this.goldWin.font = this.fonLose;
      // this.nCardScore.children[0].getComponent(cc.Sprite).spriteFrame =
      //   this.scoreLose;
    } else {
      for (let i = 0; i < this.cardShow.node.children.length; i++) {
        this.cardShow.node.children[i].color = new cc.Color().fromHEX(
          "#FFFFFF"
        );
        if (this.isMe) {
          // this.cardShow.node.children[i].color = new cc.Color().fromHEX(
          //   "#FFFFFF"
          // );
          if (i > 0) {
            this.cardShow.node.children[i].children[0].active = false;
          }
        }
      }
      if (endgame) {
        if (this.isMe && gold > 0) {
          this.node.parent.parent.getChildByName("WIN").active = true;
          this.node.parent.parent
            .getChildByName("WIN")
            .getComponent(sp.Skeleton)
            .setAnimation(0, "animation", false);

          this.scheduleOnce(() => {
            this.node.parent.parent.getChildByName("WIN").active = false;
          }, 2);
        }
        this.nCardScore.active = false;
        for (let i = 0; i < this.cardOnHand.node.children.length; i++) {
          this.cardOnHand.node.children[i].color = new cc.Color().fromHEX(
            "#FFFFFF"
          );
          this.nCardScore.active = false;
          this.skeletonAura.active = gold > 0 ? true : false;
          this.skeletonAura
            .getComponent(sp.Skeleton)
            .setAnimation(0, "animation", true);
          this.nCardScore.active = false;
        }
      }
      this.goldWin.font = this.fontWin;
      this.nCardScore.children[0].getComponent(cc.Sprite).spriteFrame =
        this.scoreWin;

      str = "+";
    }
    this.node.children[CHILD_TAG.ACTION].active = true;
    if (endgame) {
      this.nCardScore.active = false;

      this.goldWin.node.setPosition(0, 0); //this.cardOnHand.node.x
      if (this.isMe) {
        this.resetBai();
      }
    } else {
      this.goldWin.node.setPosition(0, 0);
    }
    this.goldWin.string = str + this.convert2Label(gold);
    
    if (this.convert2Label(gold) == "0") {
      this.goldWin.string = str + "0";
    }
    this.goldWin.node.stopAllActions();
    this.goldWin.node.runAction(
      cc.sequence(
        cc.callFunc(() => {
          this.goldWin.node.opacity = 0;

          if (!endgame) {
            this.goldWin.node.y = 0;
            this.goldWin.node.x = 0;
          }
        }),
        cc.spawn(
          cc.fadeIn(1),
          cc.scaleTo(0.5, endgame ? 1.4 : 1.2).easing(cc.easeBounceOut()), 
          cc.moveBy(1, cc.v2(0, !endgame ? 115 : 35))
        )
      )
    );

    this.scheduleOnce(
      () => {
        this.nMultipleBet.color = new cc.Color().fromHEX("#D28D29");
        this.node.children[CHILD_TAG.ACTION].active = false;
        this.goldWin.node.y = -10;
        this.goldWin.node.scale = 1;
        this.node.children[CHILD_TAG.ACTION].children[0].active = false;
        this.node.children[CHILD_TAG.ACTION].children[1].active = false;
      },
      endgame ? 5 : gold >= 0 ? 1.16 : 2 //time for gold won/lose to disappear
    );
  }
  resetBai() {
    // console.log("Sws Player resetBai");
    for (let i = 0; i < this.cardShow.node.children.length; i++) {
      this.cardShow.node.children[i].active = false;
    }

    for (let i = 0; i < this.cardNode.length; i++) {
      this.cardNode[i].active = true;
      if (this.isMe) {
        this.cardNode[i].color = cc.color(255, 255, 255);
      }
    }
  }

  setCardRemain(cardSize: number) {
    // console.log("Sws Player setCardRemain");
    if (cardSize == 0) {
      return;
    }
    // if (cardSize == 1)
    //     this.setStatus("BÁO");
  }

  hidePlayCountdown() {
    // console.log("Sws Player hidePlayCountdown");
    if (this.thinkingAct) this.thinkingAct.stop();
    this.timeRemain.node.active = false;
    this.timeRemain.node.stopAllActions();
    this.timeRemain.fillStart = 1;
    this.timeRemain.fillRange = 0;
  }

  setTimeRemain(remain) {
    this.timeRemain.spriteFrame = this.blueThink;
    // console.log("Sws Player setTimeRemain");
    this.timeRemain.node.active = true;
    if (remain == 0) {
      this.hidePlayCountdown();
      return;
    }
    this._localTimeTotal = remain;
    this._localTimer = remain;
    this.timeRemain.fillStart = 1;
    this.timeRemain.fillRange = 1;
    this.timeRemain.node.stopAllActions();

    this.thinkingAct = cc
      .tween(this.timeRemain)
      .to(remain * 0.7, { fillRange: 0.3 })
      .call(() => {
        this.timeRemain.spriteFrame = this.redThink;
      })
      .to(remain * 0.3, { fillRange: 0 })

      .call(() => {
        this.hidePlayCountdown();
      });
    this.thinkingAct.start();
  }

  setStatus(status = 0) {
    // console.log("Sws Player setStatus");
    this.status = status;
    this.lbStatus.node.active = false;
    this.iconWatching.active = false;
    this.avatar.node.color = new cc.Color().fromHEX("#FFFFFF");

    this.lbStatus.node.parent.active = false;
    if (this.status == 1) {
      this.iconWatching.active = true;

      this.avatar.node.color = new cc.Color().fromHEX("#3A3636");

      this.schedule(this.animationWait, 2, cc.macro.REPEAT_FOREVER); //, cc.macro.REPEAT_FOREVER, 2
    } else if (this.status != 0) {
    }
    //0 không có, 1 đang xem, 2 đang ngồi, 3 đang chơi
  }

  animationWait() {
    this.scheduleOnce(() => {
      this.iconWatching.children[0].active = true;
    }, 1);
    this.scheduleOnce(() => {
      this.iconWatching.children[1].active = true;
    }, 1.5);
    this.scheduleOnce(() => {
      this.iconWatching.children[2].active = true;
    }, 2);
    this.scheduleOnce(() => {
      this.iconWatching.children[0].active = false;
      this.iconWatching.children[1].active = false;
      this.iconWatching.children[2].active = false;
    }, 2.5);
  }

  setCoin(coin: number) {
    // console.log("Sws Player setCoin");
    if (this.isMe) {
      this._coin = coin;
      BGUI.UserManager.instance.mainUserInfo.vinTotal = coin;
      SHWESHANController.instance.lbTotalMoney.string =
        BGUI.StringUtils.formatNumber(
          BGUI.UserManager.instance.mainUserInfo.vinTotal
        );
      BGUI.EventDispatch.instance.emit(
        BGUI.EVENT_GAMECORE.UPDATE_TOTAL_GOLD,
        BGUI.UserManager.instance.mainUserInfo.vinTotal
      );
    }
    this.current_money = coin;
    this.lblCoin.string = this.convert2Label(coin);
    SHWESHANController.instance.lbRoomBalance.string =
      BGUI.StringUtils.formatNumber(
        BGUI.UserManager.instance.mainUserInfo.vinTotal
      );
    // SHWESHANController.instance.setMyBalance(coin)
  }

  leaveRoom(isLeave) {
    // console.log("Sws Player leaveRoom");
    this.nLeave.active = isLeave;
  }
  kissAnim() {
    this.kissNode.active = true;
    this.kissNode.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
  }

  showChatEmotion(content) {
    this.chatEmotion.active = false;
    // this.chatEmotion.getComponent(sp.Skeleton).setAnimation(
    //   0, "<None>", false)
    // console.log("Sws Player showChatEmotion", content);
    this.node.children[CHILD_TAG.CHAT].active = true;
    this.chatEmotion.active = true;
    this.chatMsg.active = false;
    this.chatEmotion
      .getComponent(sp.Skeleton)
      .setAnimation(0, content.toString(), false);
    let actionArr = [];
    for (var i = 0; i < 4; i++) {
      actionArr.push(cc.moveBy(0.3, 0, 10));
      actionArr.push(cc.moveBy(0.3, 0, -10));
    }
    actionArr.push(
      cc.callFunc(
        function () {
          this.chatEmotion.active = false;
          this.chatMsg.active = false;
        }.bind(this)
      )
    );

    this.chatEmotion.runAction(cc.sequence(actionArr));
  }

  showChatMsg(content) {
    // console.log("Sws Player showChatMsg");
    this.node.children[CHILD_TAG.CHAT].active = true;
    this.chatEmotion.active = false;
    this.chatMsg.active = true;
    clearTimeout(this.timeoutChat);

    this.chatMsg.children[0].children[0].getComponent(cc.Label).string =
      content;
    this.timeoutChat = setTimeout(() => {
      this.chatEmotion.active = false;
      this.chatMsg.active = false;
    }, 3000);
  }

  removeCardSlot() {
    // console.log("Sws Player removeCardSlot");
    if (!this.isMe)
      this.listCardsSlot.forEach((c) => c.node.removeFromParent(true));
  }

  resetAndCleanUp() {
    // console.log("Sws Player resetAndCleanUp");
    this.node.children[CHILD_TAG.ACTION].active = false;
    this.nLeave.active = false;
    this.listCardsSlot = [];
    this.skeletonAura.active = false;
    this.nCardScore.active = false;

    for (let j = 1; j <= 8; j++) {
      this.cardOnHand.node.children[j].children[0].active = false;
    }

    for (let n = 1; n <= 3; n++) {
      this.cardShow.node.children[n].children[0].active = false;
    }
  }

  convert2Label(num) {
    let data = num;
    let returnKey = " ";
    if (data / 1000 >= 1 || data / 1000 <= -1) {
      data = data / 1000;
      returnKey = "K";
      if (data / 1000 >= 1 || data / 1000 <= -1) {
        data = data / 1000;
        returnKey = "M";

        if (data / 1000 >= 1 || data / 1000 <= -1) {
          data = data / 1000;
          returnKey = "B";

          if (data / 1000 >= 1 || data / 1000 <= -1) {
            data = data / 1000;

            returnKey = "T";
          }
        }
      }
    }
    if (!this.isInt(data)) {
      if (data > 100) {
        data = Number(data.toFixed(1));
      } else if (data > 10) {
        data = Number(data.toFixed(2));
      } else {
        data = Number(data.toFixed(2));
      }
    }
    return data + returnKey;
  }
  isInt(num) {
    return num % 1 === 0;
  }

  cleanCard() {
    // console.log("Sws Player cleanCard");
    // return
    this.node.stopAllActions();
    this.skeletonAura.active = false;
    this.cardShow.node.active = false;
    this.cardOnHand.node.active = false;
    this.cardOnHand.node.children[1].active = false;
    this.cardOnHand.node.children[2].active = false;
    this.cardOnHand.node.children[3].active = false;
    this.cardOnHand.node.children[4].active = false;
    this.cardOnHand.node.children[5].active = false;
    this.cardOnHand.node.children[6].active = false;
    this.cardOnHand.node.children[7].active = false;
    this.cardOnHand.node.children[8].active = false;
    this.cardOnHand.node.children[9].active = false;
    this.cardOnHand.node.stopAllActions();
    this.nCardScore.active = false;
    this.nCardScore.children[0].getComponent(cc.Sprite).spriteFrame =
      this.scoreWin;
    this.nCardScore.children[1].active = false;
    this.nCardScore.children[2].active = false;
    this.lblScore.node.active = false; //false
    this.timeRemain.spriteFrame = this.blueThink;
    // this.isRunSubmitCard = false;
    this.isShowScore = false;
    this.actionHasRun = false;
    this.nCardScore.color = new cc.Color().fromHEX("#FFFFFF");
    this.nMultipleBet.color = new cc.Color().fromHEX("#D28D29");
    this.cardOnHand.node.children[1].color = new cc.Color().fromHEX("#FFFFFF");
    this.cardOnHand.node.children[2].color = new cc.Color().fromHEX("#FFFFFF");
    this.cardOnHand.node.children[3].color = new cc.Color().fromHEX("#FFFFFF");
    this.cardOnHand.node.children[4].color = new cc.Color().fromHEX("#FFFFFF");
    this.cardOnHand.node.children[5].color = new cc.Color().fromHEX("#FFFFFF");
    this.cardOnHand.node.children[6].color = new cc.Color().fromHEX("#FFFFFF");
    this.cardOnHand.node.children[7].color = new cc.Color().fromHEX("#FFFFFF");
    this.cardOnHand.node.children[8].color = new cc.Color().fromHEX("#FFFFFF");
    for (let i = 0; i < this.cardShow.node.children.length; i++) {
      this.cardShow.node.children[i].color = new cc.Color().fromHEX("#FFFFFF");
    }
    for (let j = 0; j < this.cardOnHand.node.children.length; j++) {
      this.cardOnHand.node.children[j].color = new cc.Color().fromHEX(
        "#FFFFFF"
      );
      if (j > 0 && j < 9) {
        this.cardOnHand.node.children[j].children[0].active = false;
      }
    }
    this.node.parent.parent.getChildByName("WIN").active = false;
  }
}
