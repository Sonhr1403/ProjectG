import { DragonTiger_Const } from "./DragonTiger.Const";
import DragonTiger_GameManager from "./DragonTiger.GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonTiger_ItemMorePlayer extends cc.Component {

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

        this.lbPlayerName.string = this.displayName(data.displayName, 10);
        this.lbMoney.string = DragonTiger_Const.formatAlignNumberWithK(this._data.currentMoney)

        if (this._data.avatar.includes('http')) {
            DragonTiger_Const.loadImgFromUrl(this.avt, this._data.avatar)
        }
        else {
            this.avt.spriteFrame = DragonTiger_GameManager.instance.spfAvatar;
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
