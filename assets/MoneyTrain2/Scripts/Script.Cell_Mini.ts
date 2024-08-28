import { SlotCmd } from "./Script.Cmd";
import MoneyTrain2Common from "./Script.Common";
import MoneyTrain2Machine from "./Script.SlotMachine";
import MoneyTrain2MachineMini from "./Script.SlotMachine_Mini";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MoneyTrain2CellMini extends cc.Component {
  @property(cc.Sprite)
  private spr: cc.Sprite = null;

  @property(sp.Skeleton)
  private ske: sp.Skeleton = null;

  @property(cc.Label)
  private multiNum: cc.Label = null;

  private itemBooster: SlotCmd.ImpBooster = {
    index: -1,
    id: -1,
    value: -1,
  };
  public getItemBooster() {
    return this.itemBooster;
  }
  public setItemBooster(item: SlotCmd.ImpBooster) {
    this.itemBooster = item;
  }

  public setCellMini() {
    // cc.log(this.itemBooster)
    // if (this.itemBooster) {
    this.ske.node.active = true;
    this.setSprite();
    this.ske.node.active = false;
    this.setSize();
    // }
  }


  private setSprite() {
    switch (this.itemBooster.id) {
      case -1:
        this.spr.spriteFrame =
          MoneyTrain2MachineMini.instance.listSymSprNormal[0];
        break;

      case 1:
        if (this.itemBooster.value < 50) {
          this.spr.spriteFrame =
            MoneyTrain2MachineMini.instance.listSymSprNormal[1];
          this.ske.skeletonData =
            MoneyTrain2Machine.instance.listSymSkeOther[1];
        } else {
          this.spr.spriteFrame =
            MoneyTrain2MachineMini.instance.listSymSprNormal[2];
          this.ske.skeletonData =
            MoneyTrain2MachineMini.instance.listSymSkeOther[5];
        }
        break;

      case 2:
        this.spr.spriteFrame =
          MoneyTrain2MachineMini.instance.listSymSprNormal[3];
        this.ske.skeletonData =
          MoneyTrain2MachineMini.instance.listSymSkeOther[0];
        break;

      case 3:
        this.spr.spriteFrame =
          MoneyTrain2MachineMini.instance.listSymSprNormal[4];
        this.ske.skeletonData =
          MoneyTrain2MachineMini.instance.listSymSkeOther[1];
        break;

      case 4:
        this.spr.spriteFrame =
          MoneyTrain2MachineMini.instance.listSymSprNormal[5];
        this.ske.skeletonData =
          MoneyTrain2MachineMini.instance.listSymSkeOther[2];
        break;

      case 5:
        this.spr.spriteFrame =
          MoneyTrain2MachineMini.instance.listSymSprNormal[6];
        this.ske.skeletonData =
          MoneyTrain2MachineMini.instance.listSymSkeOther[3];
        break;

      case 10:
        this.spr.spriteFrame = MoneyTrain2Machine.instance.listSymSprNormal[10];
        this.ske.skeletonData = MoneyTrain2Machine.instance.listSymSkeOther[10];
        break;

      case 11:
        this.spr.spriteFrame = MoneyTrain2Machine.instance.listSymSprNormal[11];
        this.ske.skeletonData = MoneyTrain2Machine.instance.listSymSkeOther[11];
        break;

      case 12:
        this.spr.spriteFrame = MoneyTrain2Machine.instance.listSymSprNormal[12];
        this.ske.skeletonData = MoneyTrain2Machine.instance.listSymSkeOther[12];
        break;

      case 13:
        this.spr.spriteFrame = MoneyTrain2Machine.instance.listSymSprNormal[13];
        this.ske.skeletonData = MoneyTrain2Machine.instance.listSymSkeOther[13];
        break;
    }
  }

  public setRandom() {
    let ran = MoneyTrain2Common.getRandomNumber(2, 9);
    this.itemBooster = {
      index: -1,
      id: ran,
      value: 0,
    };

    switch (this.itemBooster.id) {
      case -1:
        this.spr.spriteFrame =
          MoneyTrain2MachineMini.instance.listSymSprBlur[0];
        break;

      case 1:
        if (this.itemBooster.value < 50) {
          this.spr.spriteFrame =
            MoneyTrain2MachineMini.instance.listSymSprBlur[1];
        } else {
          this.spr.spriteFrame =
            MoneyTrain2MachineMini.instance.listSymSprBlur[2];
        }
        break;

      case 2:
        this.spr.spriteFrame =
          MoneyTrain2MachineMini.instance.listSymSprBlur[3];
        break;

      case 3:
        this.spr.spriteFrame =
          MoneyTrain2MachineMini.instance.listSymSprBlur[4];
        break;

      case 4:
        this.spr.spriteFrame =
          MoneyTrain2MachineMini.instance.listSymSprBlur[5];
        break;

      case 5:
        this.spr.spriteFrame =
          MoneyTrain2MachineMini.instance.listSymSprBlur[6];
        break;

      case 10:
        this.spr.spriteFrame = MoneyTrain2Machine.instance.listSymSprBlur[10];
        break;

      case 11:
        this.spr.spriteFrame = MoneyTrain2Machine.instance.listSymSprBlur[11];
        break;

      case 12:
        this.spr.spriteFrame = MoneyTrain2Machine.instance.listSymSprBlur[12];
        break;

      case 13:
        this.spr.spriteFrame = MoneyTrain2Machine.instance.listSymSprBlur[13];
        break;
    }
  }

  public runAnim() {
    this.spr.node.active = false;
    this.ske.node.active = true;
    this.ske.skeletonData =
      MoneyTrain2Machine.instance.listSymSkeNormal[this.itemBooster.id];
    if (this.itemBooster.id !== 0 && this.itemBooster.id !== 1) {
      this.ske.setAnimation(0, SlotCmd.STATE_OF_ANIM.ANIMATION, false);
    } else {
      if (this.itemBooster.id === 0) {
        this.ske.setAnimation(0, SlotCmd.STATE_OF_ANIM.BASE, false);
      }
      if (this.itemBooster.id === 1) {
        this.ske.setAnimation(0, SlotCmd.STATE_OF_ANIM.WIN, false);
      }
    }
    this.ske.setCompleteListener(() => {
      this.spr.node.active = true;
      this.ske.node.active = false;
    });
  }

  public offAnim() {
    this.ske.node.active = false;
  }

  private setSize() {
    this.ske.node.active = true;
    switch (this.itemBooster.id) {
      // case 0: //WILD
      //   this.spr.node.x = 0;
      //   this.spr.node.y = 2;
      //   this.spr.node.width = 135;
      //   this.spr.node.height = 148;
      //   this.ske.node.x = 0.25;
      //   this.ske.node.y = -0.5;
      //   this.ske.node.scaleX = 0.605;
      //   this.ske.node.scaleY = 0.6428;
      //   break;

      case -1: //empty
        this.spr.node.x = 0;
        this.spr.node.y = -3;
        this.spr.node.width = 135;
        this.spr.node.height = 122;
        this.ske.node.x = -0.25;
        this.ske.node.y = -1.75;
        this.ske.node.scaleX = 0.585;
        this.ske.node.scaleY = 0.5825;
        break;

      case 1: //BONUS
        this.spr.node.x = 0;
        this.spr.node.y = -3;
        this.spr.node.width = 135;
        this.spr.node.height = 132;
        this.ske.node.x = -0.25;
        this.ske.node.y = -1.75;
        this.ske.node.scaleX = 0.585;
        this.ske.node.scaleY = 0.5825;
        break;

      case 2: //NECROMANCER
        this.spr.node.x = 3;
        this.spr.node.y = 5;
        this.spr.node.width = 141;
        this.spr.node.height = 155;
        this.ske.node.x = 0;
        this.ske.node.y = -1.75;
        this.ske.node.scaleX = 0.61;
        this.ske.node.scaleY = 0.635;
        break;

      case 3: //COLLECTOR
        this.spr.node.x = 0;
        this.spr.node.y = 0;
        this.spr.node.width = 135;
        this.spr.node.height = 145;
        this.ske.node.x = -0.25;
        this.ske.node.y = -1.75;
        this.ske.node.scaleX = 0.604;
        this.ske.node.scaleY = 0.64;
        break;

      case 4: //SNIPER
        this.spr.node.x = 0;
        this.spr.node.y = -1;
        this.spr.node.width = 135;
        this.spr.node.height = 142;
        this.ske.node.x = -0.25;
        this.ske.node.y = -1.75;
        this.ske.node.scaleX = 0.612;
        this.ske.node.scaleY = 0.6425;
        break;

      case 5: //PAYER
        this.spr.node.x = 0;
        this.spr.node.y = -1;
        this.spr.node.width = 135;
        this.spr.node.height = 142;
        this.ske.node.x = 0;
        this.ske.node.y = -1.75;
        this.ske.node.scaleX = 0.608;
        this.ske.node.scaleY = 0.6425;
        break;

      // case 6: //SPADES
      //   this.spr.node.x = 1;
      //   this.spr.node.y = -4;
      //   this.spr.node.width = 100;
      //   this.spr.node.height = 104;
      //   this.ske.node.x = 0.75;
      //   this.ske.node.y = -3.5;
      //   this.ske.node.scaleX = 0.478;
      //   this.ske.node.scaleY = 0.478;
      //   break;

      // case 7: //HEARTS
      //   this.spr.node.x = -1;
      //   this.spr.node.y = -4;
      //   this.spr.node.width = 113;
      //   this.spr.node.height = 100;
      //   this.ske.node.x = 0.85;
      //   this.ske.node.y = -4.5;
      //   this.ske.node.scaleX = 0.525;
      //   this.ske.node.scaleY = 0.525;
      //   break;

      // case 8: //CLUBS
      //   this.spr.node.x = -1;
      //   this.spr.node.y = -2;
      //   this.spr.node.width = 100;
      //   this.spr.node.height = 102;
      //   this.ske.node.x = 0.85;
      //   this.ske.node.y = -1.5;
      //   this.ske.node.scaleX = 0.54;
      //   this.ske.node.scaleY = 0.54;
      //   break;

      // case 9: //DIAMONDS
      //   this.spr.node.x = -1;
      //   this.spr.node.y = -2;
      //   this.spr.node.width = 100;
      //   this.spr.node.height = 110;
      //   this.ske.node.x = 0.85;
      //   this.ske.node.y = -1.5;
      //   this.ske.node.scaleX = 0.54;
      //   this.ske.node.scaleY = 0.54;
      //   break;

      case 10: //PERSISTENT_PAYER
        this.spr.node.x = -1;
        this.spr.node.y = -1.5;
        this.spr.node.width = 150;
        this.spr.node.height = 155;
        this.ske.node.x = -1;
        this.ske.node.y = -1.5;
        this.ske.node.scaleX = 0.63;
        this.ske.node.scaleY = 0.646;
        break;

      case 11: //PERSISTENT_SNIPPER
        this.spr.node.x = -1;
        this.spr.node.y = -1.5;
        this.spr.node.width = 150;
        this.spr.node.height = 155;
        this.ske.node.x = -1;
        this.ske.node.y = -1.5;
        this.ske.node.scaleX = 0.63;
        this.ske.node.scaleY = 0.646;
        break;

      case 12: //PERSISTENT_COLLECTOR
        this.spr.node.x = -1;
        this.spr.node.y = -1.5;
        this.spr.node.width = 150;
        this.spr.node.height = 155;
        this.ske.node.x = -1;
        this.ske.node.y = -1.5;
        this.ske.node.scaleX = 0.63;
        this.ske.node.scaleY = 0.646;
        break;

      case 13: //RESET_PLUS
        this.spr.node.x = -1;
        this.spr.node.y = -1.5;
        this.spr.node.width = 137;
        this.spr.node.height = 142;
        this.ske.node.x = -2;
        this.ske.node.y = -1.5;
        this.ske.node.scaleX = 0.6225;
        this.ske.node.scaleY = 0.642;
        break;
    }
    this.ske.node.active = false;
  }

  public noSprite() {
    this.spr.spriteFrame = null;
  }

  public anticipation() {
    this.ske.setAnimation(0, SlotCmd.STATE_OF_ANIM.ANTICIPATION, true);
  }

  public setMulti(num: number) {
    if (num <= 0) {
      this.multiNum.string = "";
      this.multiNum.node.active = false;
    } else {
      this.multiNum.string = "x" + num;
      this.multiNum.node.active = true;
    }

    switch (this.itemBooster.id) {
      case 1:
        this.multiNum.node.y = -5;
        break;

      default:
        this.multiNum.node.y = -30;
        break;
    }
  }

  private setValue() {
    switch (this.itemBooster.id) {
      case -1:
        this.setMulti(0);
        break;

      default:
        this.setMulti(this.itemBooster.value);
        break;
    }
  }

  public land() {
    switch (this.itemBooster.id) {
      case 1:
        this.ske.setAnimation(0, SlotCmd.STATE_OF_ANIM.LAND, false);
        break;

      case 2:
      case 3:
      case 4:
      case 5:
        this.ske.setAnimation(0, SlotCmd.STATE_OF_ANIM.RANDOM_GLOW, false);
        break;
    }
    this.setValue();
  }
}
