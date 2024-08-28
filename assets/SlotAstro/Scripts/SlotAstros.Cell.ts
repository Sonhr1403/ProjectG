import { SlotCmd } from "./SlotAstros.Cmd";
import SlotAstrosCommon from "./SlotAstros.Common";
import SlotAstrosController from "./SlotAstros.Controller";
import SlotAstrosMachine from "./SlotAstros.SlotMachine";

const { ccclass, property } = cc._decorator;
@ccclass
export default class SlotAstrosCell extends cc.Component {
  @property(cc.Sprite)
  private sprite: cc.Sprite = null;

  @property(cc.Node)
  private block: cc.Node = null;

  @property(cc.Label)
  private label: cc.Label = null;

  private _index: number = 0;

  public set index(index: number) {
    this._index = index;
  }

  public get index() {
    return this._index;
  }

  private itemCell: SlotCmd.ImpItemCell = null;

  public getItemCell() {
    return this.itemCell;
  }

  public setItemCell(item: SlotCmd.ImpItemCell) {
    this.itemCell = item;
  }

  public setSprite() {
    this.sprite.spriteFrame =
      SlotAstrosMachine.instance.listSymsSF[this.itemCell.id - 1];
      switch (this.itemCell.id) {
        case 3:
          this.sprite.node.width = 150;
          this.sprite.node.height = 145;

          break;
      
        case 2:
          this.sprite.node.width = 155;
          this.sprite.node.height = 130;

          break;
      
        case 1:
          this.sprite.node.width = 200;
          this.sprite.node.height = 160;

          break;
      
        default:
          this.sprite.node.width = 128;
          this.sprite.node.height = 115;

          break;
      }

    this.showLabel();
  }

  public clearCell() {
    this.sprite.spriteFrame = null;
    this.label.string = "";
    this.block.active = false;
  }

  public setRandom() {
    let ran = SlotAstrosCommon.getRandomNumber(2, 13);
    this.itemCell = {
      index: -1,
      id: ran,
      highlight: false,
      appearTime: 0,
    };
    this.sprite.spriteFrame = SlotAstrosMachine.instance.listSymsSF[ran];
    this.showLabel();
    this.label.node.opacity = 150;
    // this.skeletonCharacter.skeletonData =
    //   SlotAstrosMachine.instance.listSyms[ran];
    // this.skeletonCharacter.defaultSkin = "default";
    // this.skeletonCharacter.loop = true;
    // this.skeletonCharacter.defaultAnimation = animName;
    // this.skeletonCharacter.setAnimation(0, animName, true);
  }

  public showLabel() {
    let num = 0;
    let betAmount =
      SlotAstrosController.instance.getTotalBet();

    if (
      this.itemCell.id === 1 ||
      this.itemCell.id === 2 ||
      this.itemCell.id === 3
    ) {
      this.label.node.active = false;
    } else {
      this.label.node.active = true;
    }

    switch (this.itemCell.id) {
      case 13:
        this.label.font = SlotAstrosMachine.instance.listFont[0];
        num = 0.1 * betAmount;
        this.label.fontSize = 55;
        this.label.lineHeight = 55;
        break;

      case 12:
        this.label.font = SlotAstrosMachine.instance.listFont[0];
        num = 0.2 * betAmount;
        this.label.fontSize = 55;
        this.label.lineHeight = 55;
        break;

      case 11:
        this.label.font = SlotAstrosMachine.instance.listFont[0];
        num = 0.3 * betAmount;
        this.label.fontSize = 55;
        this.label.lineHeight = 55;
        break;

      case 10:
        this.label.font = SlotAstrosMachine.instance.listFont[0];
        num = 0.5 * betAmount;
        this.label.fontSize = 55;
        this.label.lineHeight = 55;
        break;

      case 9:
        this.label.font = SlotAstrosMachine.instance.listFont[1];
        num = 1 * betAmount;
        this.label.fontSize = 60;
        this.label.lineHeight = 60;
        break;

      case 8:
        this.label.font = SlotAstrosMachine.instance.listFont[1];
        num = 2 * betAmount;
        this.label.fontSize = 60;
        this.label.lineHeight = 60;
        break;

      case 7:
        this.label.font = SlotAstrosMachine.instance.listFont[1];
        num = 5 * betAmount;
        this.label.fontSize = 60;
        this.label.lineHeight = 60;
        break;

      case 6:
        this.label.font = SlotAstrosMachine.instance.listFont[2];
        num = 10 * betAmount;
        this.label.fontSize = 65;
        this.label.lineHeight = 65;
        break;

      case 5:
        this.label.font = SlotAstrosMachine.instance.listFont[2];
        num = 20 * betAmount;
        this.label.fontSize = 65;
        this.label.lineHeight = 65;
        break;

      case 4:
        this.label.font = SlotAstrosMachine.instance.listFont[2];
        num = 100 * betAmount;
        this.label.fontSize = 65;
        this.label.lineHeight = 65;
        break;
    }
    this.label.string = SlotAstrosCommon.convert2Label(num); //BGUI.Utils.formatMoneyWithCommaOnly(num)
  }

  public checkHL() {
    this.activateBlock(!this.itemCell.highlight);
  }

  public activateBlock(enabled: boolean) {
    this.block.active = enabled;
  }

  public lblAnim() {
    if (this.itemCell.index < 7) {
      this.label.node.opacity = 255;
      cc.tween(this.label.node)
        .to(0.25, { scale: 1.2 })
        .call(() => {
          cc.tween(this.label.node)
            .to(0.25, { scale: 1 })
            .call(() => {
              if (this.itemCell.appearTime > 2) {
                this.label.node.opacity = 255;
              } else {
                this.label.node.opacity = 155;
              }
            })
            .start();
        })
        .start();
    } else {
      if (this.itemCell.appearTime > 2) {
        this.label.node.opacity = 255;
      } else {
        if (this.itemCell.highlight) {
          this.label.node.opacity = 255;
        } else {
          this.label.node.opacity = 155;
        }
      }
    }
  }
}
