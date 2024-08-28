const { ccclass, property } = cc._decorator;
import { RouletteConnector } from "./Network/RouletteConnector";

import { RouletteNetwork } from "./Roulette.Cmd";
import RouletteController from "./Roulette.Controller";
import RLTUSERDETAIL from "./Roulette.UserDetails";
import RLTUSERHISTORYITEM from "./Roulette.UserHistoryItem";

@ccclass
export default class RLTUSERHISTORY extends cc.Component {
  public static instance: RLTUSERHISTORY = null;

  @property(cc.Prefab)
  private itemTransaction: cc.Prefab = null;

  @property(cc.Prefab)
  private prfDetail: cc.Prefab = null;

  @property(cc.Node)
  private content: cc.Node = null;

  private _histories = [];
  private UI_Detail: cc.Node = null;

  onLoad() {
    RLTUSERHISTORY.instance = this;
    this.initDetail();
    this.activeTrans(false);
    RouletteConnector.instance.addCmdListener(
      RouletteNetwork.Cmd.CMD_ROULETTE_USER_HISTORY,
      this.responseUserHistory,
      this
    );
  }

  onDestroy() {
    RouletteConnector.instance.removeCmdListener(
      this,
      RouletteNetwork.Cmd.CMD_ROULETTE_USER_HISTORY
    );
  }

  private initDetail() {
    this.UI_Detail = cc.instantiate(this.prfDetail);
    this.UI_Detail.setPosition(cc.v2(0, 0));
    this.UI_Detail.zIndex = 999;
    this.node.addChild(this.UI_Detail);
    this.UI_Detail.active = false;
  }

  protected responseUserHistory(cmdId: any, data: Uint8Array) {
    let res = new RouletteNetwork.RouletteRecevieUserHistory();
    res.unpackData(data);
    // console.error(
    //   new Date().toLocaleString(),
    //   new Date().getMilliseconds(),
    //   "ROULETTE USER HISTORY: ",
    //   cmdId,
    //   res
    // );
    /////////////////////
    this._histories = res.histories;
    this.content.removeAllChildren();
    for (let history of this._histories) {
      let _itemTrans = cc.instantiate(this.itemTransaction);
      _itemTrans.getComponent(RLTUSERHISTORYITEM).setId(history.sessionId);
      _itemTrans.getChildByName("LbPhien").getComponent(cc.Label).string =
        "#" + history.sessionId;
      let localTime = null;
      let time = null;
      try {
        localTime = new Date(history.time);
        time = localTime.toLocaleString();
      } catch (error) {
        time = this.convertTime(history.time);
      }
      time = time.replace(/( ){1}/g, `\n`);
      _itemTrans.getChildByName("LbThoiGian").getComponent(cc.Label).string =
        time;
      _itemTrans.getChildByName("LbTongCuoc").getComponent(cc.Label).string =
        BGUI.Utils.formatMoneyWithCommaOnly(history.totalBet);
      _itemTrans.getChildByName("LbTienThang").getComponent(cc.Label).string =
        BGUI.Utils.formatMoneyWithCommaOnly(history.totalWin);
      _itemTrans.getChildByName("LbCuaThang").getComponent(cc.Label).string =
        history.dices;
      this.content.addChild(_itemTrans);
    }
  }

  public showDetail(id: number) {
    RouletteController.instance.checkClick();
    this.UI_Detail.active = true;
    for (let history of this._histories) {
      if (history.sessionId === id) {
        this.UI_Detail.getComponent(RLTUSERDETAIL).createItem(history.details);
      }
    }
  }

  public show() {
    this.activeTrans(true);
  }

  protected onClickClose() {
    this.activeTrans(false);
    RouletteController.instance.checkClick();
  }

  private activeTrans(isActive: boolean) {
    this.node.active = isActive;
  }

  private convertTime(t: string) {
    let t1 = t.slice(0, 10);
    let t2 = t.slice(12, 20);
    let t3 = t.slice(21, 23);
    if (t3 == "PM") {
      let t2_1 = parseInt(t2.slice(0,3));
      t2 = t2.slice(2, 9);
      t2 = (t2_1 + 12).toString() + t2;
    }
    return t2 + `\n` + t1;
  }
}
