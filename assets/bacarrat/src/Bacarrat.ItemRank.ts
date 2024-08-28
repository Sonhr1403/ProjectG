// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bacarrat_ItemRank extends cc.Component {

    @property(cc.Sprite)
    icRank: cc.Sprite = null

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

        if (this.data.session < 3) {
            this.icRank.node.active = true
            this.lbRank.node.active = false
            this.icRank.spriteFrame = this.sfRank[this.data.session]
        }
        else {
            let r = this.data.session + 1;
            this.icRank.node.active = false
            this.lbRank.node.active = true
            this.lbRank.string = r + ''
        }

        this.lbPlayer.string = this.data.account;
        this.lbWin.string = BGUI.Utils.formatMoneyWithCommaOnly(this.data.win);
    }
}
