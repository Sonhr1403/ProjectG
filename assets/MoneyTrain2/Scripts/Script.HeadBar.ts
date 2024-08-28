
import MoneyTrain2Common from "./Script.Common";
import MoneyTrain2Controller from "./Script.Controller";
import MoneyTrain2MusicManager, { SLOT_SOUND_TYPE } from "./Script.Music";
import MoneyTrain2PayTable from "./Script.PayTable";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MoneyTrain2HeadBar extends cc.Component {
  public static instance: MoneyTrain2HeadBar = null;

  @property(cc.Label)
  private lblBalance: cc.Label = null;

  @property(cc.Node)
  private menu: cc.Node = null;

  @property(cc.Button)
  private btnMenu: cc.Button = null;

  private currentBalance: number = 0;

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    MoneyTrain2HeadBar.instance = this;
  }

  private onClickMenu() {
    MoneyTrain2MusicManager.instance.playType(SLOT_SOUND_TYPE.BUTTON);
    this.menu.active = !this.menu.active;
  }

  private onClickPayTable() {
    MoneyTrain2MusicManager.instance.playType(SLOT_SOUND_TYPE.BUTTON);
    MoneyTrain2Controller.instance.pnPayTable
      .getComponent(MoneyTrain2PayTable)
      .onOpenPays();
    this.menu.active = false;
  }

  private onClickSetting() {
    MoneyTrain2MusicManager.instance.playType(SLOT_SOUND_TYPE.BUTTON);
    MoneyTrain2Controller.instance.pnSetting.active = true;
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
    this.lblBalance.string = MoneyTrain2Common.numberWithCommas(
      this.currentBalance
    );
  }

  public decreaseBalance() {
    this.currentBalance -= MoneyTrain2Controller.instance.getTotalBet();
    this.updateBalance();
  }

  public increaseBalance(num: number) {
    this.currentBalance += num;
    this.updateBalance();
  }

  public setMenuInteractive(bool: boolean){
    this.btnMenu.interactable = bool;
  }
}
