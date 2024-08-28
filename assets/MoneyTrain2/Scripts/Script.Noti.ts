import { LanguageMgr } from "../../framework/localize/LanguageMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MoneyTrain2Noti extends cc.Component {
  public static instance: MoneyTrain2Noti = null;

  @property(cc.Label)
  private notiContent: cc.Label = null;

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    MoneyTrain2Noti.instance = this;
  }

  public openNoti(num: number) {
    let msg = "";
    switch (num) {
      case 0:
        msg = LanguageMgr.getString("MoneyTrain2.connection_error");
        break;
        
      case 1:
        msg = LanguageMgr.getString("MoneyTrain2.connection_error1");
        break;

      case 2:
        msg = LanguageMgr.getString("MoneyTrain2.connection_end");
        break;

      case 3:
        msg = LanguageMgr.getString("MoneyTrain2.not_enough_money");
        break;

      case 4:
        msg = LanguageMgr.getString("MoneyTrain2.spin_error");
        break;
    }

    if (!this.node.active) {
    // if (false) {
        this.node.active = true;
    }

    this.notiContent.string = msg;
  }
}
