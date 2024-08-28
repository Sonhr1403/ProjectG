// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Bacarrat_Const } from "./Bacarrat.Const";
import Bacarrat_GameManager from "./Bacarrat.GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bacarrat_ItemMorePlayer extends cc.Component {

    @property(cc.Sprite)
    avt: cc.Sprite = null

    @property(cc.Label)
    lbPlayerName: cc.Label = null

    @property(cc.Label)
    lbMoney: cc.Label = null

    _data = null

    setData(data: any) {
        if (!data) return;
        this._data = data;

        this.lbPlayerName.string = data.displayName
        // this.lbMoney.string = BGUI.Utils.formatMoneyWithCommaOnly(this._data.currentMoney);
        this.lbMoney.string = Bacarrat_Const.formatAlignNumberWithK(this._data.currentMoney)

        if (this._data.avatar.includes('http')) {
            Bacarrat_Const.loadImgFromUrl(this.avt, this._data.avatar)
        }
        else {
            this.avt.spriteFrame = Bacarrat_GameManager.instance.spfAvatar;
        }
    }

    displayName(name, maxLength) {
        if (name === undefined)
            return "";
        if (maxLength === undefined)
            maxLength = 18;
        name = name.trim();
        if (name.length > maxLength) {
            var newName = name.substr(0, maxLength);
            newName += "...";
        }
        else {
            newName = name;
        }
        return newName;
    }
}
