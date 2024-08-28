import BCCommon from "./BC.Common";
import BCController from "./BC.Controller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BCPhinh extends cc.Component {

    @property(cc.SpriteAtlas)
    public spriteAtlasChip: cc.SpriteAtlas = null;

    @property(cc.Sprite)
    public spChip: cc.Sprite = null;

    @property(cc.Label)
    public lbMoney: cc.Label = null;

    private _money: number = 0;

    private defineSpriteChip  = {
        "100": { color: cc.color().fromHEX("#c91c1c"), spriteFrame: "bc_chip_100" },
        "500": { color: cc.color().fromHEX("#333333"), spriteFrame: "bc_chip_500" },
        "1000": { color: cc.color().fromHEX("#333333"), spriteFrame: "bc_chip_1k" },
        "5000": { color: cc.color().fromHEX("#ffffff"), spriteFrame: "bc_chip_5k" },
        "10000": { color: cc.color().fromHEX("#e3c310"), spriteFrame: "bc_chip_10k" },
        "50000": { color: cc.color().fromHEX("#ffffff"), spriteFrame: "bc_chip_50k" },
        "100000": { color: cc.color().fromHEX("#ffffff"), spriteFrame: "bc_chip_100k" },
        "500000": { color: cc.color().fromHEX("#333333"), spriteFrame: "bc_chip_500k" },
        "1000000": { color: cc.color().fromHEX("#333333"), spriteFrame: "bc_chip_1m" },
        "5000000": { color: cc.color().fromHEX("#ffffff"), spriteFrame: "bc_chip_5m" },
        "10000000": { color: cc.color().fromHEX("#333333"), spriteFrame: "bc_chip_10m" },
        "50000000": { color: cc.color().fromHEX("#ffffff"), spriteFrame: "bc_chip_50m" },
    }

    start() {
        // TODO
    }

    public setFaceMoney(money: number) {
        this._money = money;
        let itemDefChip = this.defineSpriteChip[money.toString()];
        let nameSpriteFrame = (itemDefChip)? itemDefChip.spriteFrame: 0;
        let spriteFrame = BCController.instance.spriteAtlasChip.getSpriteFrame(nameSpriteFrame);
        if(spriteFrame){
            this.spChip.spriteFrame = spriteFrame;
            this.lbMoney.node.color = this.defineSpriteChip[money.toString()].color;
        } else {
            this.spChip.spriteFrame = BCController.instance.spriteAtlasChip.getSpriteFrame("bc_chip_100k");
            this.lbMoney.node.color = cc.color().fromHEX("#333333");
        }
        this.lbMoney.string = BCCommon.convert2Label(money);
    }

    public get money(): number {
        return this._money
    }
    // update (dt) {}
}
