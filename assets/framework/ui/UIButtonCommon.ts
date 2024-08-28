import { LanguageMgr } from "../localize/LanguageMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIButtonCommon extends BGUI.UIButtonCommon {
    @property(cc.SpriteFrame)
    listSprite: Array<cc.SpriteFrame> = [];

    @property(cc.Label)
    lbAction: cc.Label = null;

    onLoad() {
        var str = this.lbAction.string;
        if(str === '') return;
        if (str.toUpperCase() == LanguageMgr.getString("alert.ok").toUpperCase()) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.listSprite[0];
        } else if (str.toUpperCase() == LanguageMgr.getString("alert.no").toUpperCase() || str == LanguageMgr.getString("alert.close").toUpperCase()) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.listSprite[1];
        }

    }

   
}
