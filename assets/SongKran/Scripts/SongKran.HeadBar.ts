
import SongKranCommon from "./SongKran.Common";
import SongKranController from "./SongKran.Controller";
import SongKranMusicManager, { SLOT_SOUND_TYPE } from "./SongKran.Music";
import SongKranPayTable from "./SongKran.PayTable";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SongKranHeadBar extends cc.Component {
  public static instance: SongKranHeadBar = null;

  @property(cc.Label)
  private lblBalance: cc.Label = null;

  @property(cc.Node)
  private menu: cc.Node = null;

  @property(cc.Button)
  private btnMenu: cc.Button = null;

  private currentBalance: number = 0;

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    SongKranHeadBar.instance = this;
  }

  private onClickMenu() {
    SongKranMusicManager.instance.playType(SLOT_SOUND_TYPE.BUTTON);
    this.menu.active = !this.menu.active;
  }

  private onClickPayTable() {
    SongKranMusicManager.instance.playType(SLOT_SOUND_TYPE.BUTTON);
    SongKranController.instance.pnPayTable
      .getComponent(SongKranPayTable)
      .onOpenPays();
    this.menu.active = false;
  }

  private onClickSetting() {
    SongKranMusicManager.instance.playType(SLOT_SOUND_TYPE.BUTTON);
    SongKranController.instance.pnSetting.active = true;
    this.menu.active = false;
  }

  public setCurrentBalance(num: number) {
    this.currentBalance = num;
    this.updateBalance();
  }

  public getCurrentBalance(): number {
    return this.currentBalance;
  }

  private updateBalance() {
    this.lblBalance.string = SongKranCommon.numberWithCommas(
      this.currentBalance
    );
  }

  public decreaseBalance() {
    this.currentBalance -= SongKranController.instance.getTotalBet();
    this.updateBalance();
  }

  public increaseBalance(num: number) {
    this.currentBalance += num;
    this.updateBalance();
  }

  public setMenuInteractable(bool: boolean){
    this.btnMenu.interactable = bool;
  }

  public closeMenu(){
    this.menu.active = false;
  }
}
