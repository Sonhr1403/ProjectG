import MoneyTrain2MusicManager, { SLOT_SOUND_TYPE } from "./Script.Music";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MoneyTrain2PayTable extends cc.Component {
  @property(cc.Node)
  private listPage: cc.Node[] = [];

  @property(cc.Node)
  private btnNode: cc.Node = null;

  // @property(cc.Label)
  // private listLabel: cc.Label[] = [];

  ////////////////////////////////////////////////////

  private page = 0;

  private listX = [-1920, 0, 1920];

  // private listValue = [23.5, 7.25, 3.5, 2.25, 1, 0.625, 0.375, 0.25];

  // LIFE-CYCLE CALLBACKS:

  public onOpenPays() {
    this.node.active = true;
    this.listPage[0].x = this.listX[1];
    this.listPage[0].opacity = 255;
    for (let i = 1; i < 5; i++) {
      this.listPage[i].x = this.listX[2];
      this.listPage[i].opacity = 0;
    }
    this.page = 0;
    this.updateBtn();
    // this.updateLabel();
  }

  // private updateLabel() {
  //   let bet =
  //     MoneyTrain2Controller.instance.listBet[MoneyTrain2Controller.instance.betOrdi];
  //   for (let i = 0; i < this.listLabel.length; i++) {
  //     this.listLabel[i].string = BGUI.Utils.formatMoneyWithCommaOnly(
  //       this.listValue[i] * bet
  //     );
  //   }
  // }

  private onClickBack() {
    MoneyTrain2MusicManager.instance.playType(SLOT_SOUND_TYPE.BUTTON);
    this.node.active = false;
  }

  private onClickLeft() {
    MoneyTrain2MusicManager.instance.playType(SLOT_SOUND_TYPE.BUTTON);
    this.enableBtn(false);

    cc.tween(this.listPage[this.page])
      .to(0.5, { position: cc.v3(this.listX[2], 0, 0) }, { easing: "" })
      .call(()=>{
        this.listPage[this.page + 1].opacity = 0;
      })
      .start();

    this.page -= 1;

    this.listPage[this.page].opacity = 255;
    cc.tween(this.listPage[this.page])
      .to(0.5, { position: cc.v3(this.listX[1], 0, 0) }, { easing: "" })
      .call(() => {
        this.enableBtn(true);
        this.updateBtn();
      })
      .start();
  }

  private onClickRight() {
    MoneyTrain2MusicManager.instance.playType(SLOT_SOUND_TYPE.BUTTON);
    this.enableBtn(false);

    cc.tween(this.listPage[this.page])
      .to(0.5, { position: cc.v3(this.listX[0], 0, 0) }, { easing: "" })
      .call(()=>{
        this.listPage[this.page - 1].opacity = 0;
      })
      .start();

    this.page += 1;

    this.listPage[this.page].opacity = 255;
    cc.tween(this.listPage[this.page])
      .to(0.5, { position: cc.v3(this.listX[1], 0, 0) }, { easing: "" })
      .call(() => {
        this.enableBtn(true);
        this.updateBtn();
      })
      .start();
  }

  private enableBtn(enabled: boolean) {
    this.btnNode.children.forEach((element) => {
      element.getComponent(cc.Button).interactable = enabled;
    });
  }

  private updateBtn() {
    switch (this.page) {
      case 0:
        this.btnNode.children[0].opacity = 0;
        this.btnNode.children[0].getComponent(cc.Button).interactable = false;
        this.btnNode.children[2].opacity = 255;
        this.btnNode.children[2].getComponent(cc.Button).interactable = true;
        break;

      case 4:
        this.btnNode.children[0].opacity = 255;
        this.btnNode.children[0].getComponent(cc.Button).interactable = true;
        this.btnNode.children[2].opacity = 0;
        this.btnNode.children[2].getComponent(cc.Button).interactable = false;
        break;

      default:
        this.btnNode.children[0].opacity = 255;
        this.btnNode.children[0].getComponent(cc.Button).interactable = true;
        this.btnNode.children[2].opacity = 255;
        this.btnNode.children[2].getComponent(cc.Button).interactable = true;
        break;
    }
  }
}
