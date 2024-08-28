// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { DragonTiger_Const } from "./DragonTiger.Const";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonTiger_ItemRank extends cc.Component {

    @property(cc.Sprite)
    icRank: cc.Sprite = null

    @property(cc.Sprite)
    avt: cc.Sprite = null

    @property(cc.SpriteFrame)
    sfRank: cc.SpriteFrame[] = []

    @property(cc.Label)
    lbRank: cc.Label = null

    @property(cc.Label)
    lbPlayer: cc.Label = null

    @property(cc.Label)
    lbWin: cc.Label = null

    data = null

    setData(_data: any) {
        if (!_data) return;
        this.data = _data;

        if (this.data.index < 3) {
            this.icRank.node.active = true
            this.lbRank.node.active = false
            this.icRank.spriteFrame = this.sfRank[this.data.index]
        }
        else {
            let vt = this.data.index + 1;
            this.icRank.node.active = false
            this.lbRank.node.active = true
            this.lbRank.string = vt + ''
        }

        // {"nickName":"test1","currentMoney":1000,"avatar":"avatar","interest":5000
        if (this.data.avatar.includes('http')) {
            DragonTiger_Const.loadImgFromUrl(this.avt, this.data.avatar)
        }
        this.lbPlayer.string = this.data.nickName;
        this.lbWin.string = DragonTiger_Const.formatAlignNumberWithK(this.data.interest)
    }
}
