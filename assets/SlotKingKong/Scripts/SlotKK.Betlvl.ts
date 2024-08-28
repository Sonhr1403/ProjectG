import SlotKKController from "./SlotKK.Controller";
import SlotKKMusicManager, { SLOT_SOUND_TYPE } from "./SlotKK.Music";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotKKBetLvl extends cc.Component {
  @property(cc.Button)
  public btnIncBet: cc.Button[] = [];

  @property(cc.Button)
  public btnDecBet: cc.Button[] = [];

  @property(cc.Slider)
  private betSlider: cc.Slider[] = [];

  @property(cc.Sprite)
  private progressBar: cc.Sprite[] = [];

  @property(cc.Label)
  private nums: cc.Label[] = [];

  @property(cc.Node)
  private container: cc.Node = null;

  /////////////////////////////////////////////////////

  private amountValue: number = -1;
  private amountLvl: number = -1;

  // LIFE-CYCLE CALLBACKS:

  public onOpen() {
    cc.tween(this.container)
      .to(0.3, { position: cc.v3(0, 0, 0) })
      .start();
    this.checkBet();
  }

  public checkBet() {
    let betAmount = SlotKKController.instance.betAmount;
    switch (betAmount) {
      case 0:
        this.amountValue = 0;
        this.amountLvl = 0;
        break;

      case 1:
        this.amountValue = 1;
        this.amountLvl = 0;
        break;

      case 2:
        this.amountValue = 2;
        this.amountLvl = 0;
        break;

      case 3:
        this.amountValue = 0;
        this.amountLvl = 1;
        break;

      case 4:
        this.amountValue = 1;
        this.amountLvl = 1;
        break;

      case 5:
        this.amountValue = 2;
        this.amountLvl = 1;
        break;

      case 6:
        this.amountValue = 0;
        this.amountLvl = 2;
        break;

      case 7:
        this.amountValue = 1;
        this.amountLvl = 2;
        break;

      case 8:
        this.amountValue = 2;
        this.amountLvl = 2;
        break;
    }

    this.setProgress(0);
    this.setProgress(1);
    this.updateBet(0);
    this.updateBet(1);
  }

  private setAmountBet() {
    let amount = -1;
    switch (this.amountLvl) {
      case 0:
        switch (this.amountValue) {
          case 0:
            amount = 0;
            break;

          case 1:
            amount = 1;
            break;

          case 2:
            amount = 2;
            break;
        }
        break;

      case 1:
        switch (this.amountValue) {
          case 0:
            amount = 3;
            break;

          case 1:
            amount = 4;
            break;

          case 2:
            amount = 5;
            break;
        }
        break;

      case 2:
        switch (this.amountValue) {
          case 0:
            amount = 6;
            break;

          case 1:
            amount = 7;
            break;

          case 2:
            amount = 8;
            break;
        }
        break;
    }

    SlotKKController.instance.betAmount = amount;
    SlotKKController.instance.updateAllBet();
  }

  private onClickIncBet(event, id) {
    SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    if (id === "0") {
      this.amountValue += 1;
    } else {
      this.amountLvl += 1;
    }
    this.setAmountBet();
  }

  private onClickDecBet(event, id) {
    SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    if (id === "0") {
      this.amountValue -= 1;
    } else {
      this.amountLvl -= 1;
    }
    this.setAmountBet();
  }

  private updateBet(id) {
    let amount = id === 0 ? this.amountValue : this.amountLvl;
    switch (amount) {
      case 0:
        this.btnDecBet[id].interactable = false;
        this.btnIncBet[id].interactable = true;
        break;

      case 2:
        this.btnIncBet[id].interactable = false;
        this.btnDecBet[id].interactable = true;
        break;

      default:
        this.btnDecBet[id].interactable = true;
        this.btnIncBet[id].interactable = true;
        break;
    }

    this.nums[id].string = amount.toString();
  }

  private onSliderEvent(sender, id) {
    let progress = sender.progress.toFixed(3);
    let pro = -1;
    let amo = -1;
    if (progress <= 0.333) {
      pro = 0.333;
      amo = 0;
    } else if (progress <= 0.666) {
      pro = 0.666;
      amo = 1;
    } else if (progress <= 1) {
      pro = 1;
      amo = 2;
    }
    this.updateSlider(pro, id);
    if (id === "0") {
      this.amountValue = amo;
    } else {
      this.amountLvl = amo;
    }
    this.setAmountBet();
  }

  private setProgress(id: number) {
    let pro = -1;
    let amount = id === 0 ? this.amountValue : this.amountLvl;
    switch (amount) {
      case 0:
        pro = 0.333;
        break;

      case 1:
        pro = 0.666;
        break;

      case 2:
        pro = 1;
        break;
    }
    this.updateSlider(pro, id);
  }

  private updateSlider(progress: number, i: number) {
    this.betSlider[i].progress = progress;
    this.progressBar[i].fillRange = progress;
  }

  public onClose() {
    cc.tween(this.container)
      .to(0.3, { position: cc.v3(0, - 205, 0) })
      .start();
  }
}
