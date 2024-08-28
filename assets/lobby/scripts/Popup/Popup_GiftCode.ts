// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { LanguageMgr } from "../../../framework/localize/LanguageMgr";
import { LobbyCmdId } from "../../LobbyConst";
import HeaderCtrl from "../HeaderCtrl";
import { cmdReceive } from "../network/LobbyReceive";
import { LobbySend } from "../network/LobbySend";

const { ccclass, property } = cc._decorator;

@ccclass
export default class popUp_GiftCode extends cc.Component {
  @property(cc.EditBox)
  editBox: cc.EditBox = null;

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    BGUI.NetworkPortal.instance.addCmdListener(
      LobbyCmdId.GIFT_CODE,
      this.receiveGiftCode,
      this
    );
  }

  protected onDestroy(): void {
    BGUI.NetworkPortal.instance.removeCmdListener(this, LobbyCmdId.GIFT_CODE);
  }

  // start () {}

  // update (dt) {}

  onClickSendGiftCode() {
    try {
      let pk = new LobbySend.SendGiftCode();
      pk.giftCode = this.editBox.string;
      BGUI.NetworkPortal.instance.sendPacket(pk);
      console.log("sended gift code", pk);
    } catch (error) {
      console.error("Send Gift Code Error: ", error);
    }
  }

  receiveGiftCode(cmdId: any, data: Uint8Array) {
    let res = new cmdReceive.ReceivedGiftCode();
    res.unpackData(data);
    console.error("HHHHH GIFT_CODE", res);

    let error = res.error;
    let currentMoneyVin = res.currentMoneyVin;
    let currentMoneyXu = res.currentMoneyXu;
    let moneyGiftCodeVin = res.moneyGiftCodeVin;
    let moneyGiftCodeXu = res.moneyGiftCodeXu;

    let msg = "";

    switch (error) {
      case 0:
        BGUI.UserManager.instance.mainUserInfo.vinTotal = currentMoneyVin;
        HeaderCtrl.instance.lbCurGold.string =
          BGUI.Utils.formatMoneyWithCommaOnly(currentMoneyVin);
        HeaderCtrl.instance.popUp_FreeChips
          .getComponent("Popup_FreeChips")
          .updateMoneyGet(moneyGiftCodeVin);
        HeaderCtrl.instance.popUp_FreeChips.active = true;
        break;

      case 2:
        cc.log("RECEIVE GIFT CODE ERROR: 2");
        BGUI.UserManager.instance.mainUserInfo.vinTotal = currentMoneyVin;
        HeaderCtrl.instance.lbCurGold.string =
          BGUI.Utils.formatMoneyWithCommaOnly(currentMoneyVin);

        HeaderCtrl.instance.popUp_FreeChips
          .getComponent("Popup_FreeChips")
          .updateMoneyGet(moneyGiftCodeVin);
        HeaderCtrl.instance.popUp_FreeChips.active = true;
        break;

      case 1:
        msg = LanguageMgr.getString("looby.warning.gift_code_is_used");
        break;

      case 8:
        msg = LanguageMgr.getString("looby.warning.over_exp_giftcode");
        break;

      default:
        console.error("RECEIVE GIFT CODE ERROR: ", error);
        break;
    }
  }

  hide() {
    this.node.active = false;
  }
}
