import { LobbyCmdId } from "../../LobbyConst";
import friendItem from "./friendItem";
import LobbyCtrl from "../LobbyCtrl";
import { cmdReceive } from "../network/LobbyReceive";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Friend extends BGUI.UIPopup {
  public static instance: Friend = null;

  configFirstGame: any = null;

  @property(cc.Prefab)
  prefabFriendItems: cc.Prefab = null;
  @property(cc.Node)
  contentFriendList: cc.Node = null;

  onEnable(): void {
    // this.createFriend(LobbyCtrl.instance.friendList);
  }

  onLoad(): void {
    Friend.instance = this;
  }

  onDisable() {
    BGUI.NetworkPortal.instance.removeCmdListener(this, LobbyCmdId.LIST_FRIEND);
  }

  createFriend(data: cmdReceive.ReceivedListFriend) {
    if(data.listSize > 0){
    this.contentFriendList.removeAllChildren(true);
    for (let idx = 0; idx < data.listSize; idx++) {
      let item = cc.instantiate(this.prefabFriendItems);
      let friendInfo = data.list[idx];
      item.getComponent(friendItem).initItem(friendInfo, idx);
      this.contentFriendList.addChild(item);
      item.active = true;
    }}
    else{}
  }

  hide() {
    this.node.active = false;
  }
  // getListFriend() {
  //   try {
  //     let pk = new LobbySend.SendListFriend();
  //     BGUI.NetworkPortal.instance.sendPacket(pk);
  //   } catch (error) {
  //     cc.error("Send ListFriend Error: ", error);
  //   }
  // }

  // receiveListFriend(cmdId: any, data: Uint8Array) {
  //   let res = new cmdReceive.ReceivedListFriend();
  //   res.unpackData(data);
  //   console.log("HHHHH LIST_FRIEND", res);
  //   switch (res.error) {
  //     case 0:
  //       this.friendListName = res.list
  //       this.createFriend(res.list);
  //       break;
  //     default:
  //       console.error("receiveListFriend ERROR", res.error);
  //       break;
  //   }
  // }
}
