import { SlotCmd } from "./Script.Cmd";
import MoneyTrain2Common from "./Script.Common";
import MoneyTrain2Machine from "./Script.SlotMachine";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MoneyTrain2Cell extends cc.Component {
  @property(cc.Sprite)
  private spr: cc.Sprite = null;

  @property(cc.Node)
  private highLight: cc.Node = null;

  @property(sp.Skeleton)
  private ske: sp.Skeleton = null;

  @property(cc.Prefab)
  private multiple: cc.Prefab = null;

  private itemCell: SlotCmd.ImpItemCell = null;

  public getItemCell() {
    return this.itemCell;
  }

  public setItemCell(item: SlotCmd.ImpItemCell) {
    this.itemCell = item;
  }

  private picSize = [];

  public setSpriteNormal() {
    this.spr.spriteFrame =
      MoneyTrain2Machine.instance.listSymSprNormal[this.itemCell.id];
    this.setSize();
    this.ske.node.active = true;
    this.ske.skeletonData =
      MoneyTrain2Machine.instance.listSymSkeNormal[this.itemCell.id];
    this.ske.node.active = false;
  }

  public setSpriteBlur() {
    this.spr.spriteFrame =
      MoneyTrain2Machine.instance.listSymSprBlur[this.itemCell.id];
  }

  public setRandom() {
    let ran = MoneyTrain2Common.getRandomNumber(2, 9);
    this.itemCell = {
      index: -1,
      id: ran,
      highlight: false,
    };

    this.spr.spriteFrame = MoneyTrain2Machine.instance.listSymSprBlur[ran];
  }

  public runAnim() {
    this.spr.node.active = false;
    this.ske.node.active = true;
    this.ske.skeletonData =
      MoneyTrain2Machine.instance.listSymSkeNormal[this.itemCell.id];
    if (this.itemCell.id !== 0 && this.itemCell.id !== 1) {
      this.ske.setAnimation(0, SlotCmd.STATE_OF_ANIM.ANIMATION, false);
    } else {
      if (this.itemCell.id === 0) {
        this.ske.setAnimation(0, SlotCmd.STATE_OF_ANIM.BASE, false);
      }
      if (this.itemCell.id === 1) {
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
    switch (this.itemCell.id) {
      case 0: //WILD
        this.spr.node.x = 0;
        this.spr.node.y = 2;
        this.spr.node.width = 135;
        this.spr.node.height = 148;
        this.ske.node.x = 0.25;
        this.ske.node.y = -0.5;
        this.ske.node.scaleX = 0.605;
        this.ske.node.scaleY = 0.6428;
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

      case 6: //SPADES
        this.spr.node.x = 1;
        this.spr.node.y = -4;
        this.spr.node.width = 100;
        this.spr.node.height = 104;
        this.ske.node.x = 0.75;
        this.ske.node.y = -3.5;
        this.ske.node.scaleX = 0.478;
        this.ske.node.scaleY = 0.478;
        break;

      case 7: //HEARTS
        this.spr.node.x = -1;
        this.spr.node.y = -4;
        this.spr.node.width = 113;
        this.spr.node.height = 100;
        this.ske.node.x = 0.85;
        this.ske.node.y = -4.5;
        this.ske.node.scaleX = 0.525;
        this.ske.node.scaleY = 0.525;
        break;

      case 8: //CLUBS
        this.spr.node.x = -1;
        this.spr.node.y = -2;
        this.spr.node.width = 100;
        this.spr.node.height = 102;
        this.ske.node.x = 0.85;
        this.ske.node.y = -1.5;
        this.ske.node.scaleX = 0.54;
        this.ske.node.scaleY = 0.54;
        break;

      case 9: //DIAMONDS
        this.spr.node.x = -1;
        this.spr.node.y = -2;
        this.spr.node.width = 100;
        this.spr.node.height = 110;
        this.ske.node.x = 0.85;
        this.ske.node.y = -1.5;
        this.ske.node.scaleX = 0.54;
        this.ske.node.scaleY = 0.54;
        break;

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

  public checkBlock() {
    this.highLight.active = !this.itemCell.highlight;
    if (this.itemCell.highlight) {
      this.ske.node.active = true;
      this.spr.node.active = false;
      if (this.itemCell.id !== 0 && this.itemCell.id !== 1) {
        this.ske.setAnimation(0, SlotCmd.STATE_OF_ANIM.ANIMATION, false);
      } else {
        if (this.itemCell.id === 0) {
          this.ske.setAnimation(0, SlotCmd.STATE_OF_ANIM.BASE, false);
        }
        if (this.itemCell.id === 1) {
          this.ske.setAnimation(0, SlotCmd.STATE_OF_ANIM.WIN, false);
        }
      }
      this.ske.setCompleteListener(() => {
        this.spr.node.active = true;
        this.ske.node.active = false;
        this.highLight.active = false;
      });
    }
  }

  public block(is: boolean) {
    this.highLight.active = is;
  }

  public noSprite() {
    this.spr.spriteFrame = null;
  }

  public getFreeGame() {
    this.ske.setAnimation(0, SlotCmd.STATE_OF_ANIM.ALT_WIN, false);
    this.ske.setCompleteListener(() => {
      this.ske.setAnimation(0, SlotCmd.STATE_OF_ANIM.ALT_WIN_CLOSE, false);
      this.ske.setCompleteListener(() => {
        let multiple: cc.Node = cc.instantiate(this.multiple);
        multiple.getComponent(cc.Label).string = this.itemCell.value.toString();
        this.node.addChild(multiple);
        MoneyTrain2Machine.instance.animCounterDay(true);
        this.scheduleOnce(() => {
          cc.tween(multiple)
            .to(1, { position: cc.v3(500, 305, 0) }, { easing: "smooth" })
            .call(()=>{
              MoneyTrain2Machine.instance.updateCounterDay(this.itemCell.value);
              multiple.removeFromParent(true);
            })
            .start();
        }, 2);
      });
    });
  }

  public anticipation() {
    this.ske.setAnimation(0, SlotCmd.STATE_OF_ANIM.ANTICIPATION, true);
  }
}
