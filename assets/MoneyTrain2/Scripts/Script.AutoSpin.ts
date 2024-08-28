import MoneyTrain2Controller from "./Script.Controller";
import MoneyTrain2FootBar from "./Script.FootBar";
import MoneyTrain2MusicManager, { SLOT_SOUND_TYPE } from "./Script.Music";


const { ccclass, property } = cc._decorator;

@ccclass
export default class MoneyTrain2AutoSpin extends cc.Component {
  public static instance: MoneyTrain2AutoSpin = null;

  @property(cc.Node)
  private toggleContainer: cc.Node = null;

  @property(cc.Node)
  private btnStart: cc.Node = null;

  @property(cc.EditBox)
  private listEditBox: cc.EditBox[] = [];

  @property(cc.Node)
  private listLbl: cc.Node[] = [];

  private currentAutoNumber: string = "";

  /////////////////////////////////////////////////////////////////

  protected onLoad(): void {
    MoneyTrain2AutoSpin.instance = this;
    if (!MoneyTrain2Controller.instance.isMobile) {
      this.toggleContainer.children.forEach((element) => {
        element.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        element.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
      });
      this.btnStart.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
      this.btnStart.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
      this.listEditBox.forEach((element) => {
        element.node.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        element.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
      });
    }

    this.currentAutoNumber = this.toggleContainer.children[3].name;
  }

  protected onDestroy(): void {
    if (!MoneyTrain2Controller.instance.isMobile) {
      this.toggleContainer.children.forEach((element) => {
        element.off(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        element.off(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
      });
      this.btnStart.off(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
      this.btnStart.off(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
      this.listEditBox.forEach((element) => {
        element.node.off(
          cc.Node.EventType.MOUSE_ENTER,
          this.onMouseEnter,
          this
        );
        element.node.off(
          cc.Node.EventType.MOUSE_LEAVE,
          this.onMouseLeave,
          this
        );
      });
    }
  }

  private onMouseEnter(event) {
    event.currentTarget.getChildByName("frame").active = true;
  }

  private onMouseLeave(event) {
    event.currentTarget.getChildByName("frame").active = false;
  }

  public onCheck(toggle) {
    // MoneyTrain2MusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.currentAutoNumber = toggle.node.name;
    toggle.node.getChildByName("check_mark").active = true;
  }

  public onCancel() {
    // MoneyTrain2MusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.node.active = false;
    // this.clearData();
  }

  private onStart() {
    MoneyTrain2FootBar.instance.runAutoSpin(parseInt(this.currentAutoNumber));
    this.onCancel();
  }

  private clearData() {
    this.currentAutoNumber = "";
    this.toggleContainer.children.forEach((element) => {
      if (element.getComponent(cc.Toggle).isChecked) {
        element.getComponent(cc.Toggle).isChecked = false;
      }
    });
  }

}
