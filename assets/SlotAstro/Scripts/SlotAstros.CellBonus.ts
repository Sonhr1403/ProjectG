import SlotAstrosCommon from "./SlotAstros.Common";
import SlotAstrosController from "./SlotAstros.Controller";
import SlotAstrosMachine from "./SlotAstros.SlotMachine";
import SlotAstrosMachineBonus from "./SlotAstros.SlotMachineBonus";

const { ccclass, property } = cc._decorator;
@ccclass
export default class SlotAstrosCellBonus extends cc.Component {
  @property(cc.Sprite)
  private sprites: cc.Sprite[] = [];

  @property(cc.Label)
  private label: cc.Label = null;

  private itemCell: number = null;

  public getItemCell() {
    return this.itemCell;
  }

  public setItemCell(item: number) {
    this.itemCell = item;
  }

  public setSprite() {
    this.sprites.forEach((sprite) => {
      sprite.spriteFrame =
        SlotAstrosMachine.instance.listSymsSF[this.itemCell - 1];
    });
    this.showLabel();
  }

  public clearCell() {
    this.sprites.forEach((sprite) => {
      sprite.spriteFrame = null;
    });
    this.label.string = "";
  }

  public setRandom() {
    this.itemCell = SlotAstrosCommon.getRandomNumber(4, 13);
    this.sprites.forEach((sprite) => {
      sprite.spriteFrame =
        SlotAstrosMachine.instance.listSymsSF[this.itemCell - 1];
    });
    this.showLabel();
    this.label.node.opacity = 150;
  }

  public showLabel() {
    this.getFont();
    this.label.fontSize = 55;
    this.label.lineHeight = 55;
    this.label.string = SlotAstrosCommon.convert2Label(this.getNum());
  }

  public lblAnim() {
    this.label.node.opacity = 255;
    cc.tween(this.label.node)
      .to(0.25, { scale: 1.2 })
      .call(() => {
        cc.tween(this.label.node)
          .to(0.25, { scale: 1 })
          .call(() => {
            SlotAstrosMachineBonus.instance.currentMoney += this.getNum();
            SlotAstrosMachineBonus.instance.updateWinLbl();
          })
          .start();
      })
      .start();
  }

  private getNum() {
    let num = 0;
    let betAmount = SlotAstrosController.instance.getTotalBet();
    switch (this.itemCell) {
      case 13:
        num = 0.1 * betAmount;
        break;

      case 12:
        num = 0.2 * betAmount;
        break;

      case 11:
        num = 0.3 * betAmount;
        break;

      case 10:
        num = 0.5 * betAmount;
        break;

      case 9:
        num = 1 * betAmount;
        break;

      case 8:
        num = 2 * betAmount;
        break;

      case 7:
        num = 5 * betAmount;
        break;

      case 6:
        num = 10 * betAmount;
        break;

      case 5:
        num = 20 * betAmount;
        break;

      case 4:
        num = 100 * betAmount;
        break;
    }
    return num;
  }

  private getFont(){
    switch (this.itemCell) {
      case 13:
      case 12:
      case 11:
      case 10:
        this.label.font = SlotAstrosMachine.instance.listFont[0];
        break;

      case 9:
      case 8:
      case 7:
        this.label.font = SlotAstrosMachine.instance.listFont[1];
        break;

      case 6:
      case 5:
      case 4:
        this.label.font = SlotAstrosMachine.instance.listFont[2];
        break;
    }
  }
}
