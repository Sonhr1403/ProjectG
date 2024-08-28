// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import RLTCommon from "./Roulette.Common";
import RouletteController from "./Roulette.Controller";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RLTPhinh extends cc.Component {

    @property(cc.Sprite)
    public spChip: cc.Sprite = null;

    @property(cc.Label)
    public lbMoney: cc.Label = null;

    private _money: number = 0;

    private defineSpriteChip  = {
        "1000": { spriteFrame: "rlt_chip_black" },
        "5000": { spriteFrame: "rlt_chip_red" },
        "10000": { spriteFrame: "rlt_chip_purple" },
        "20000": { spriteFrame: "rlt_chip_brown" },
        "50000": { spriteFrame: "rlt_chip_green" },
        "100000": { spriteFrame: "rlt_chip_black" },
        "500000": { spriteFrame: "rlt_chip_red" },
        "1000000": { spriteFrame: "rlt_chip_purple" },
        "2000000": { spriteFrame: "rlt_chip_brown" },
        "10000000": { spriteFrame: "rlt_chip_green" },
        "100000000": { spriteFrame: "rlt_chip_black" },
        "1000000000": { spriteFrame: "rlt_chip_red" },
    }

    public setFaceMoney(money: number) {
        this._money = money;
        let itemDefChip = this.defineSpriteChip[money.toString()];
        let nameSpriteFrame = (itemDefChip)? itemDefChip.spriteFrame: 0;
        let spriteFrame = RouletteController.instance.spriteAtlasChip.getSpriteFrame(nameSpriteFrame);
        if(spriteFrame){
            this.spChip.spriteFrame = spriteFrame;
            this.lbMoney.string = RLTCommon.convert2Label(money);
        } else {
            console.error("Không có face", money)
        }
    }

    public get money(): number {
        return this._money
    }
}
