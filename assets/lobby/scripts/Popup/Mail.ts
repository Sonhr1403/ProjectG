import mailItem from "./mailItem ";
import { LobbyCmdId } from "../../LobbyConst";
import { LobbySend } from "../network/LobbySend";
import { cmdReceive } from "../network/LobbyReceive";
import LobbyCtrl from "../LobbyCtrl";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Mail extends BGUI.UIPopup {
  public static instance: Mail = null;

  configFirstGame: any = null;
  @property(cc.Prefab)
  mailItemsPrefab: cc.Prefab = null;
  @property(cc.Node)
  contentListItemMail: cc.Node = null;
  @property(cc.Node)
  adminMail: cc.Node = null;
  @property(cc.LabelOutline)
  adminMailLabel: cc.LabelOutline = null;
  @property(cc.Node)
  friendMail: cc.Node = null;
  @property(cc.LabelOutline)
  friendMailLabel: cc.LabelOutline = null;
  @property(cc.SpriteFrame)
  statusBtn: cc.SpriteFrame[] = [];

  @property(cc.Prefab)
  confirmDelete: cc.Prefab = null;
  @property(cc.Node)
  mailList: cc.Node = null;
  @property(cc.Node)
  contentMail: cc.Node = null;
  @property(cc.Label)
  content: cc.Label = null;
  @property(cc.Label)
  author: cc.Label = null;
  refreshMail = null
  // dataMail = [];
  // deleteMailIds: Array<number> = [];
  onLoad(): void {
    Mail.instance = this;
  }

  onEnable(): void {
    // BGUI.NetworkPortal.instance.addCmdListener(
    //   LobbyCmdId.RECEIVE_MAIL,
    //   this.receiveMail,
    //   this
    // );
    BGUI.NetworkPortal.instance.addCmdListener(
      LobbyCmdId.READ_MAIL,
      this.viewMail,
      this
    );
    BGUI.NetworkPortal.instance.addCmdListener(
      LobbyCmdId.DELETE_MAIL,
      this.resDeleteMail,
      this
    );

    // this.getMail();
    this.mailList.active = true;
    this.contentMail.active = false;
    this.createItem(LobbyCtrl.instance.dataMail)
    this.filterMailAdmin()

  }
  
  onDisable() {
    BGUI.NetworkPortal.instance.removeCmdListener(
      this,
      LobbyCmdId.DELETE_MAIL
    );
  }
  viewMail(cmdId: any, data: Uint8Array) {
    let res = new cmdReceive.ReceivedReadMails();
    res.unpackData(data);
    console.error("HHHHH ReadMail", res);
  }

  deleteMail(ids: Array<number>) {
    try {      
      let pk = new LobbySend.deleteMail();
      pk.ids = ids;
      BGUI.NetworkPortal.instance.sendPacket(pk);
      cc.error("pkdel", pk);
    } catch (error) {
      console.error("Send delete mail Error: ", error);
    }
  }
  deleteConfirm() {
    BGUI.UIPopupManager.instance.showPopupFromPrefab(this.confirmDelete);
  }
  resDeleteMail(cmdId: any, data: Uint8Array){
    for (let i = 0; i < LobbyCtrl.instance.dataMail.length; i++) {
      let mailInfo = LobbyCtrl.instance.dataMail[i];
      if (LobbyCtrl.instance.deleteMailIds.indexOf(mailInfo["id"]) > -1) {
        LobbyCtrl.instance.dataMail.splice(i, 1);
      }
    }
    this.createItem(LobbyCtrl.instance.dataMail);
  }

  // receiveMail(cmdId: any, data: Uint8Array) {
  //   let res = new cmdReceive.ReceivedMail();
  //   res.unpackData(data);
  //   console.log("HHHHH MAIL", res);
  //   this.dataMail = res.list;
  //   cc.error(this.dataMail);
  //   this.createItem(res.list);
  //   for (let i = 0; i < res.list.length; i++) {
  //     let mailInfo = res.list[i];
  //     if (mailInfo["isClaimed"] == true || mailInfo["gold"] == 0) {
  //       if (this.deleteMailIds.indexOf(mailInfo["id"]) < 0) {
  //         this.deleteMailIds.push(mailInfo["id"]);
  //       }
  //     }
  //   }
  // }

  createItem(data) {
    this.contentListItemMail.removeAllChildren(true);
    let idx = 0;
    for (let i = 0; i < data.length; i++) {
      let item = cc.instantiate(this.mailItemsPrefab);
      let mailInfo = data[i];
      item.getComponent(mailItem).initItem(mailInfo, idx);
      this.contentListItemMail.addChild(item);
      idx++;

    }
  }

  filterMailAdmin() {
    this.adminMail.getComponent(cc.Sprite).spriteFrame = this.statusBtn[0];
    this.friendMail.getComponent(cc.Sprite).spriteFrame = this.statusBtn[1];
    this.friendMailLabel.color = new cc.Color().fromHEX('#6F5C32')
    this.adminMailLabel.color = new cc.Color().fromHEX('#DE8E1F')
    let mailAdmin = [];
    for (let i = 0; i < LobbyCtrl.instance.dataMail.length; i++) {
      if (LobbyCtrl.instance.dataMail[i]["sysMail"] == 1) {
        mailAdmin.push(LobbyCtrl.instance.dataMail[i]);
      }
    }
    this.createItem(mailAdmin);
  }
  filterMailFriend() {
    this.adminMail.getComponent(cc.Sprite).spriteFrame = this.statusBtn[1];
    this.friendMail.getComponent(cc.Sprite).spriteFrame = this.statusBtn[0];
    this.adminMailLabel.color = new cc.Color().fromHEX('#6F5C32')
    this.friendMailLabel.color = new cc.Color().fromHEX('#DE8E1F')

    let mailFriend = [];
    for (let i = 0; i < LobbyCtrl.instance.dataMail.length; i++) {
      if (LobbyCtrl.instance.dataMail[i]["sysMail"] != 1) {
        mailFriend.push(LobbyCtrl.instance.dataMail[i]);
      }
    }
    this.createItem(mailFriend);
  }
 
  closeContent() {
    this.mailList.active = true;
    this.contentMail.active = false;
  }

  loadContent(id) {
    this.mailList.active = false;
    this.contentMail.active = true;
    for (let i = 0; i < LobbyCtrl.instance.dataMail.length; i++) {
      if (LobbyCtrl.instance.dataMail[i]["id"] == id) {
        this.content.string = LobbyCtrl.instance.dataMail[i]["content"];
        this.author.string = LobbyCtrl.instance.dataMail[i]["author"];
      }
    }
  }

  hide(){
    LobbyCtrl.instance.getMail()
    this.node.active = false;
  }
}
