import { SlotCmd } from "./SongKran.Cmd";
import SongKranCommon from "./SongKran.Common";
import SongKranController from "./SongKran.Controller";
import SongKranMusicManager, { SLOT_SOUND_TYPE } from "./SongKran.Music";
import SongKranNumericalHelper from "./SongKran.UINumericalHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SongKranFootBar extends cc.Component {
  public static instance: SongKranFootBar = null;

  @property(cc.Node)
  private btnTurbo: cc.Node[] = []; // 0: off, 1: on

  @property(cc.Button)
  private btnBet: cc.Button[] = []; // 0: decrease, 1: increase

  @property(cc.Label)
  private totalBet: cc.Label = null;

  @property(cc.Node)
  private pnAutoSpin: cc.Node = null;

  @property(cc.Button)
  private btnAutoSpin: cc.Button = null;

  @property(cc.SpriteFrame)
  private autoSpinSF: cc.SpriteFrame[] = []; // 0: off, 1: on

  @property(cc.Node)
  private listSpinBtn: cc.Node[] = []; // 0: spin, 1: autoSpin

  @property(cc.Label)
  private lblAutoSpin: cc.Label = null;

  @property(cc.Button)
  private btnMaxBet: cc.Button = null;

  @property(cc.Label)
  private lblTotalWin: cc.Label = null;

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    SongKranFootBar.instance = this;
  }

  private onClickSpin() {
    SongKranMusicManager.instance.playType(SLOT_SOUND_TYPE.SPINNINGSOUND);
    SongKranController.instance.reallySpin();
  }

  private onClickTurbo() {
    SongKranMusicManager.instance.playType(SLOT_SOUND_TYPE.BUTTON);
    SongKranController.instance.setIsTurbo(
      !SongKranController.instance.getIsTurbo()
    );
    this.updateTurbo();
  }

  public updateTurbo() {
    if (SongKranController.instance.getIsTurbo()) {
      this.btnTurbo[1].active = true;
      this.btnTurbo[0].getComponent(cc.Button).interactable = false;
      this.btnTurbo[1].getComponent(cc.Button).interactable = false;

      this.btnTurbo[0].getComponent(cc.Button).interactable = true;
      this.btnTurbo[1].getComponent(cc.Button).interactable = true;
      this.btnTurbo[0].active = false;
    } else {
      this.btnTurbo[0].active = true;
      this.btnTurbo[0].getComponent(cc.Button).interactable = false;
      this.btnTurbo[1].getComponent(cc.Button).interactable = false;

      this.btnTurbo[0].getComponent(cc.Button).interactable = true;
      this.btnTurbo[1].getComponent(cc.Button).interactable = true;
      this.btnTurbo[1].active = false;
    }
  }

  private onClickIncBet() {
    SongKranMusicManager.instance.playType(SLOT_SOUND_TYPE.BUTTON);
    SongKranController.instance.increaseBetOrdi();
    this.updateBet();
  }

  private onClickDecBet() {
    SongKranMusicManager.instance.playType(SLOT_SOUND_TYPE.BUTTON);
    SongKranController.instance.decreaseBetOrdi();
    this.updateBet();
  }

  public updateBet() {
    switch (SongKranController.instance.getBetOrdi()) {
      case 0:
        this.btnBet[0].interactable = false;
        this.btnBet[1].interactable = true;
        break;

      case 4:
        this.btnBet[0].interactable = true;
        this.btnBet[1].interactable = false;
        break;

      default:
        this.btnBet[0].interactable = true;
        this.btnBet[1].interactable = true;
        break;
    }
    let num = SongKranController.instance.getTotalBet();
    this.totalBet.string = SongKranCommon.numberWithCommas(num);

    if (num !== SongKranController.instance.getLocalBetAmount()) {
      SlotCmd.Send.sendSlotJoinGame(num);
    }
  }

  private onClickMaxBet() {
    SongKranMusicManager.instance.playType(SLOT_SOUND_TYPE.BUTTON);
    if (SongKranController.instance.getBetOrdi() < 4) {
      SongKranController.instance.setBetOrdi(4);
      this.updateBet();
    }
  }

  public onClickAutoSpin() {
    SongKranMusicManager.instance.playType(SLOT_SOUND_TYPE.BUTTON);
    this.pnAutoSpin.active = !this.pnAutoSpin.active;
  }

  public onClickChooseAutoSpin(event, id) {
    SongKranMusicManager.instance.playType(SLOT_SOUND_TYPE.BUTTON);
    this.runAutoSpin(parseInt(id));
    this.pnAutoSpin.active = false;
  }

  public runAutoSpin(num: number) {
    SongKranController.instance.setIAS(true);
    this.btnAutoSpin.node.children[0].getComponent(cc.Sprite).spriteFrame =
      this.autoSpinSF[1];

    this.listSpinBtn[0].active = false;
    this.listSpinBtn[1].active = true;

    this.lblAutoSpin.string = num.toString();
    SongKranController.instance.reallySpin();
  }

  public onClickStopAutoSpin() {
    SongKranMusicManager.instance.playType(SLOT_SOUND_TYPE.BUTTON);
    this.btnAutoSpin.node.children[0].getComponent(cc.Sprite).spriteFrame =
      this.autoSpinSF[0];

    this.listSpinBtn[1].active = false;
    this.listSpinBtn[0].active = true;

    SongKranController.instance.setIAS(false);
    this.lblAutoSpin.string = "";
  }

  public setBtnInteractable(bool: boolean) {
    this.setBetInteractable(bool);
    this.btnMaxBet.interactable = bool;
    this.btnAutoSpin.interactable = bool;
    this.listSpinBtn[0].getComponent(cc.Button).interactable = bool;
    this.pnAutoSpin.active = false;
  }

  private setBetInteractable(bool: boolean) {
    if (bool) {
      switch (SongKranController.instance.getBetOrdi()) {
        case 0:
          this.btnBet[0].interactable = false;
          this.btnBet[1].interactable = true;
          break;
        case 5:
          this.btnBet[0].interactable = true;
          this.btnBet[1].interactable = false;
          break;
        default:
          this.btnBet[0].interactable = true;
          this.btnBet[1].interactable = true;
          break;
      }
    } else {
      this.btnBet[0].interactable = false;
      this.btnBet[1].interactable = false;
    }
  }

  public getLblAutoSpin() {
    return parseInt(this.lblAutoSpin.string);
  }

  public decLblAutoSpin() {
    this.lblAutoSpin.string = (
      parseInt(this.lblAutoSpin.string) - 1
    ).toString();
  }

  public scheduleForLbl(winMoney: number, time: number) {
    SongKranNumericalHelper.scheduleForLabel(this.lblTotalWin, winMoney, time);
    SongKranMusicManager.instance.playLoop(SLOT_SOUND_TYPE.BOOKING_LOOG1);
    this.scheduleOnce(() => {
      SongKranMusicManager.instance.stopPlayLoop();
    }, time);
  }

  public openWinLbl() {
    cc.tween(this.lblTotalWin.node).stop();
    cc.tween(this.lblTotalWin.node).to(0.2, { opacity: 255 }).start();
  }

  public closeWinLbl() {
    cc.tween(this.lblTotalWin.node).stop();
    this.lblTotalWin.string = "";
    cc.tween(this.lblTotalWin.node).to(0.2, { opacity: 0 }).start();
  }

  public setWinLblTurbo(num) {
    this.lblTotalWin.node.opacity = 255;
    this.lblTotalWin.string = SongKranCommon.numberWithCommas(num);
  }
}
