import SlotKKCommon from "./SlotKK.Common";
import SlotKKController from "./SlotKK.Controller";
import SlotKKMusicManager, { SLOT_SOUND_TYPE } from "./SlotKK.Music";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotKKAutoSpin extends cc.Component {
  public static instance: SlotKKAutoSpin = null;

  @property(cc.Node)
  private toggleContainer: cc.Node = null;

  @property(cc.Node)
  private blockInputEvent: cc.Node = null;

  @property(cc.Button)
  private btnStart: cc.Button = null;

  @property(cc.Toggle)
  public listStopToggle: cc.Toggle[] = [];

  @property(cc.Label)
  public listNumLbl: cc.Label[] = [];

  @property(cc.Slider)
  public listSlider: cc.Slider[] = [];

  @property(cc.Sprite)
  public listProgressBar: cc.Sprite[] = [];

  private currentAutoNumber: string = "";

  /////////////////////////////////////////////////////////////////

  protected onLoad(): void {
    SlotKKAutoSpin.instance = this;
    this.toggleContainer.children.forEach((element) => {
      if (!SlotKKController.instance.isMobile) {
        element.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        element.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
      }
    });
  }

  protected onDestroy(): void {
    this.toggleContainer.children.forEach((element) => {
      if (!SlotKKController.instance.isMobile) {
        element.off(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        element.off(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
      }
    });
  }

  private onMouseEnter(event) {
    if (!event.currentTarget.getComponent(cc.Toggle).isChecked) {
      event.currentTarget.getChildByName("check_mark").active = true;
    }
  }

  private onMouseLeave(event) {
    if (!event.currentTarget.getComponent(cc.Toggle).isChecked) {
      event.currentTarget.getChildByName("check_mark").active = false;
    }
  }

  public onCheck(toggle) {
    SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.currentAutoNumber = toggle.node.name;
    this.btnStart.interactable = true;
  }

  public onCancel() {
    SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.node.active = false;
    // this.currentAutoNumber = "";
    this.btnStart.interactable = false;
    SlotKKController.instance.isAutoSpinOn = false;
    // this.toggleContainer.children.forEach((element) => {
    //   if (element.getComponent(cc.Toggle).isChecked) {
    //     element.getComponent(cc.Toggle).isChecked = false;
    //   }
    // });
    this.clearData();
  }

  private onStart() {
    let runForever = false;
    switch (this.currentAutoNumber) {
      case "∞":
        runForever = true;
        break;

      default:
        break;
    }
    if (this.listStopToggle[0].isChecked) {
      SlotKKController.instance.onWin = true;
    }
    if (this.listStopToggle[1].isChecked) {
      SlotKKController.instance.onFreeSpinWin = true;
    }
    if (this.listStopToggle[2].isChecked) {
      SlotKKController.instance.onSingleWinExceeds = true;
      SlotKKController.instance.exceedsNumber = SlotKKCommon.numberWithOutDot(
        this.listNumLbl[0].string
      );
    }
    if (this.listStopToggle[3].isChecked) {
      SlotKKController.instance.onBalanceIncrease = true;
      SlotKKController.instance.increaseNumber = SlotKKCommon.numberWithOutDot(
        this.listNumLbl[1].string
      );
    }
    if (this.listStopToggle[4].isChecked) {
      SlotKKController.instance.onBalanceDecrease = true;
      SlotKKController.instance.decreaseNumber = SlotKKCommon.numberWithOutDot(
        this.listNumLbl[2].string
      );
    }

    SlotKKController.instance.getBalanceCheck();

    SlotKKController.instance.runAutoSpin(
      runForever,
      parseInt(this.currentAutoNumber) - 1
    );
    this.onCancel();
    SlotKKController.instance.autoSpinBtn[0].active = false;
    SlotKKController.instance.autoSpinBtn[1].active = true;
  }

  private onToggleClick(event, id) {
    SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    switch (id) {
      case "0":
        break;

      case "1":
        break;

      case "2":
        if (this.listStopToggle[2].isChecked) {
          this.listNumLbl[0].string = BGUI.Utils.formatMoneyWithCommaOnly(
            parseInt(
              (
                this.listSlider[0].progress *
                SlotKKCommon.numberWithOutDot(
                  SlotKKController.instance.totalBetNum.string
                ) *
                10
              ).toFixed()
            )
          );
        } else {
          this.listNumLbl[0].string = "None";
          this.listSlider[0].progress = 0;
          this.listProgressBar[0].fillRange = 0;
        }
        break;

      case "3":
        if (this.listStopToggle[3].isChecked) {
          this.listNumLbl[1].string = BGUI.Utils.formatMoneyWithCommaOnly(
            parseInt(
              (
                this.listSlider[1].progress *
                SlotKKCommon.numberWithOutDot(
                  SlotKKController.instance.totalBetNum.string
                ) *
                100
              ).toFixed()
            )
          );
        } else {
          this.listNumLbl[1].string = "None";
          this.listSlider[1].progress = 0;
          this.listProgressBar[1].fillRange = 0;
        }
        break;

      case "4":
        if (this.listStopToggle[4].isChecked) {
          this.listNumLbl[2].string = BGUI.Utils.formatMoneyWithCommaOnly(
            parseInt(
              (
                this.listSlider[2].progress *
                SlotKKCommon.numberWithOutDot(
                  SlotKKController.instance.totalBetNum.string
                ) *
                5
              ).toFixed()
            )
          );
        } else {
          this.listNumLbl[2].string = "None";
          this.listSlider[2].progress = 0;
          this.listProgressBar[2].fillRange = 0;
        }
        break;
    }
  }

  private onSliderEvent(sender, id) {
    let progress = sender.progress.toFixed(3);
    this.listStopToggle[parseInt(id) + 2].isChecked = true;
    this.listProgressBar[parseInt(id)].fillRange = progress;
    let num = 0;
    switch (id) {
      case "0":
        num = 10;
        break;

      case "1":
        num = 100;
        break;

      case "2":
        num = 5;
        break;
    }
    this.listNumLbl[parseInt(id)].string = BGUI.Utils.formatMoneyWithCommaOnly(
      parseInt(
        (
          this.listSlider[parseInt(id)].progress *
          SlotKKCommon.numberWithOutDot(
            SlotKKController.instance.totalBetNum.string
          ) *
          num
        ).toFixed()
      )
    );
  }

  private clearData() {
    this.currentAutoNumber = "";
    this.toggleContainer.children.forEach((element) => {
      if (element.getComponent(cc.Toggle).isChecked) {
        element.getComponent(cc.Toggle).isChecked = false;
      }
    });
    this.listStopToggle.forEach((element) => {
      element.isChecked = false;
    });
    this.listNumLbl.forEach((element) => {
      element.string = "None";
    });
    this.listSlider.forEach((element) => {
      element.progress = 0;
    });
    this.listProgressBar.forEach((element) => {
      element.fillRange = 0;
    });
  }
}
