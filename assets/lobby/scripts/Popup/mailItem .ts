const { ccclass, property } = cc._decorator;
import Mail from "./Mail";
import { LobbyCmdId } from "../../LobbyConst";
import { LobbySend } from "../network/LobbySend";
import { cmdReceive } from "../network/LobbyReceive";
import HeaderCtrl from "../HeaderCtrl";
import { LanguageMgr } from "../../../framework/localize/LanguageMgr";
import LobbyCtrl from "../LobbyCtrl";
@ccclass
export default class mailItem extends cc.Component {
  public static instance: mailItem = null;
  configFirstGame: any = null;

  // @property(cc.Node)
  // statusNotChoose: cc.Node = null;
  // @property(cc.Node)
  // statusChoose: cc.Node = null;

  @property(cc.Label)
  title: cc.Label = null;
  @property(cc.Label)
  previewContent: cc.Label = null;
  @property(cc.Label)
  date: cc.Label = null;
  @property(cc.Label)
  time: cc.Label = null;
  @property(cc.Node)
  gold: cc.Node = null;
  @property(cc.Node)
  goldClaimed: cc.Node = null;
  id: number;
  initItem(info, idx = 0) {
    if (info["status"] == 1) {
      this.node.getChildByName("read").active = true;
    }
    if (info["status"] == 2) {
      this.node.active = false;
    } else {
    }
    this.id = info["id"];
    this.title.string = info["title"];
    this.date.string = info["createTime"].substring(0, 10);
    this.time.string = info["createTime"].substring(10);
    let contentMail = info["content"];
    if (contentMail.length < 36) {
      this.previewContent.string = contentMail;
    } else {
      this.previewContent.string = info["content"].substring(0, 35) + "...";
    }
    if (info["gold"] > 0) {
      this.gold.active = true;
      if (info["isClaimed"] == true) {
        this.gold.active = false;
        this.goldClaimed.active = true;
      }
    }
  }
  protected onLoad(): void {
    mailItem.instance = this;
    BGUI.NetworkPortal.instance.addCmdListener(
      LobbyCmdId.READ_MAIL,
      this.viewContent,
      this
    );

    BGUI.NetworkPortal.instance.addCmdListener(
      LobbyCmdId.CLAIM_GOLD,
      this.receivedClaimedGold,
      this
    );

    BGUI.NetworkPortal.instance.addCmdListener(
      LobbyCmdId.READ_MAIL,
      this.receivedViewMail,
      this
    );
  }

  onDisable() {
    BGUI.NetworkPortal.instance.removeCmdListener(this, LobbyCmdId.CLAIM_GOLD);
    BGUI.NetworkPortal.instance.removeCmdListener(this, LobbyCmdId.READ_MAIL);
  }

  viewContent() {
    try {
      let pk = new LobbySend.readMail();
      pk.id = this.id;
      BGUI.NetworkPortal.instance.sendPacket(pk);
      cc.error("pk", pk);
    } catch (error) {
      console.error("Send read Error: ", error);
    }
  }

  receivedViewMail(cmdId: any, data: Uint8Array) {
    let res = new cmdReceive.ReceivedReadMails();
    res.unpackData(data);
    console.error("HHHHH ReadMail", res);
    this.node.getChildByName("read").active = true;
    Mail.instance.loadContent(this.id);
    LobbyCtrl.instance.getMail();
    
  }

  claimAttachedGold() {
    try {
      let pk = new LobbySend.claimGold();
      pk.id = this.id;
      BGUI.NetworkPortal.instance.sendPacket(pk);
      cc.error("pk", pk);
    } catch (error) {
      console.error("Send claimgold Error: ", error);
    }
  }

  receivedClaimedGold(cmdId: any, data: Uint8Array) {
    let res = new cmdReceive.ReceivedClaimedGold();
    res.unpackData(data);
    console.log("HHHHH CLAIM_GOLD", res);
    let error = res.error;
    let currentMoneyVin = res.currentMoneyVin;
    let msg = LanguageMgr.getString("boogyi.error_not_defined", {
      id: res.getError(),
    });
    // error:
    //      * 1: Not existed inbox mail or mail is deleted
    //      * 2: Mail claimed
    //      * 3: Server error
    //      * 4: user not found
    switch (error) {
      case 0:
        BGUI.UserManager.instance.mainUserInfo.vinTotal = currentMoneyVin;
        HeaderCtrl.instance.lbCurGold.string =
          BGUI.Utils.formatMoneyWithCommaOnly(
            BGUI.UserManager.instance.mainUserInfo.vinTotal
          ).toString();
        this.gold.active = false;
        this.goldClaimed.active = true;
        // LobbyCtrl.instance.getMail();
        if (LobbyCtrl.instance.deleteMailIds.indexOf(this.id) < 0) {
          LobbyCtrl.instance.deleteMailIds.push(this.id);
        }
        break;

      case 1:
        // msg = LanguageMgr.getString("looby.warning.gift_code_is_used");
        cc.error("Not existed inbox mail or mail is deleted");
        if (LobbyCtrl.instance.deleteMailIds.indexOf(this.id) < 0) {
          LobbyCtrl.instance.deleteMailIds.push(this.id);
        }
        Mail.instance.deleteMail([this.id]);
        this.node.active = false
        break;

      case 2:
        // msg = LanguageMgr.getString("looby.warning.server_terminate_interupt");
        cc.error("Mail claimed");
        this.gold.active = false;
        this.goldClaimed.active = true;
        if (LobbyCtrl.instance.deleteMailIds.indexOf(this.id) < 0) {
          LobbyCtrl.instance.deleteMailIds.push(this.id);
        }
        break;

      case 3:
        msg = LanguageMgr.getString("looby.warning.server_terminate_interupt");
        break;

      case 4:
        msg = LanguageMgr.getString("alert.error.account_undefined");
        break;

      default:
        console.error("RECEIVE GOLD ERROR: ", error);
        break;
    }
  }
}
