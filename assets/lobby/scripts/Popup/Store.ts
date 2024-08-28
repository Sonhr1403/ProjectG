import { LANGUAGE, LanguageMgr } from "../../framework/localize/LanguageMgr";
import LoginFeature from "../../framework/ui/LoginFeature";
import { LobbyCmdId, LobbyConst } from "../LobbyConst";
import { LobbySend } from "../scripts/network/LobbySend";
import CanvasAlwaysShow from "./CanvasAlwaysShow";
import ItemShop from "./ItemShop";
import BundleMiniGame from "./gameicon/BundleMiniGame";
import GetInforFirstGame from "./network/GetInformationFirstGame";
import { cmd } from "./network/LobbyReceive";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Store extends BGUI.UIPopup {
  public static instance: Store = null;

  configFirstGame: any = null;

  @property(cc.Prefab)
  prefabShopItems: cc.Prefab = null;
  @property(cc.Node)
  contentListItemShop: cc.Node = null;

  //   onEnable(): void {
  //     this.node.runAction(cc.sequence(cc.moveTo(0.1, cc.v2(0, 0))));
  //   }
  //   onDestroy(): void {
  //     this.node.runAction(cc.sequence(cc.moveTo(0.1, cc.v2(450, 0))));
  //   }

  //   toggleSupportOn() {
  //     this.popupSupport.runAction(
  //       cc.sequence(
  //         cc.moveTo(0.1, cc.v2(0, 0)),
  //         cc.callFunc(() => {
  //           this.popupSupport.children[0].active = true;
  //         })
  //       )
  //     );
  //   }

  //   toggleSupportOff() {
  //     this.popupSupport.runAction(
  //       cc.sequence(
  //         cc.callFunc(() => {
  //           this.popupSupport.children[0].active = false;
  //         }),
  //         cc.moveTo(0.1, cc.v2(450, 0))
  //       )
  //     );
  //   }
  onLoad(): void {
    this.createItem();
  }
  createItem() {
    this.contentListItemShop.removeAllChildren(true);
    // let idx = 0;
    for (let idx = 4; idx >= 0; idx--) {
      let item = cc.instantiate(this.prefabShopItems);
      item.getComponent(ItemShop).initItem(idx);
      item.setRotation(270);
      if (idx != 1) {
        item.getComponent(ItemShop).lblPrice.node.setPosition(3.35, 229.566);
        item
          .getComponent(ItemShop)
          .lblPriceDiscount.node.setPosition(-52.808, 189.46);
        item.getComponent(ItemShop).bannerDiscount.active = false;
      }
      this.contentListItemShop.addChild(item);
      
    }
  }
  hide(){
    this.node.active = false;
  }
}
