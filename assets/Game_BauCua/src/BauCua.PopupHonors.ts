import { LobbyConst } from "./BC.Config";
const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupHonors extends BGUI.UIPopup {
    @property(cc.Node)
    itemTemplate: cc.Node = null;

    private items = new Array<cc.Node>();

    onLoad() {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }
        if (this.itemTemplate != null) this.itemTemplate.active = false;
        this.loadData();

    }

    onDestroy() {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].active = false;
        }

    }

    private loadData() {
        BGUI.Https.get(LobbyConst.BASE_URL + "c=120&mt=1", (res) => {
            if (res["success"]) {
                if (this.items.length == 0) {
                    for (var i = 0; i < 10; i++) {
                        let item = cc.instantiate(this.itemTemplate);
                        item.parent = this.itemTemplate.parent;
                        this.items.push(item);
                    }
                    this.itemTemplate.destroy();
                    this.itemTemplate = null;
                }

                for (let i = 0; i < this.items.length; i++) {
                    let item = this.items[i];
                    if (i < res["topBC"].length) {
                        let itemData = res["topBC"][i];
                        item.getChildByName("Rank").getComponent(cc.Label).string = (i + 1).toString();
                        item.getChildByName("Rank").color = i % 2 == 0 ? cc.Color.WHITE : cc.Color.YELLOW;

                        item.getChildByName("Account").getComponent(cc.Label).string = itemData["username"];
                        item.getChildByName("Account").color = i % 2 == 0 ? cc.Color.WHITE : cc.Color.YELLOW;

                        item.getChildByName("Win").getComponent(cc.Label).string = BGUI.Utils.formatMoneyWithCommaOnly(itemData["money"]);
                        item.getChildByName("Win").color = i % 2 == 0 ? cc.Color.WHITE : cc.Color.YELLOW;
                        item.active = true;
                    } else {
                        item.active = false;
                    }
                }
            }
        });
    }
}
