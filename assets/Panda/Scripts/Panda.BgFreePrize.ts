import PandaJackpotMoney from "./Panda.JackpotMoney";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PandaBgFreePrize extends cc.Component {
    @property(cc.Node)
    private nAddRotate: cc.Label = null;

    @property(cc.Node)
    private nMoneyPrize: cc.Label = null;

    
    @property(cc.Node)
    private lbMoney: cc.Label = null;

    @property(cc.Label)
    private lbNumberRotate: cc.Label = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        // TODO
    }

    // update (dt) {}

    protected onClickCollect() {
        this.hide();
    }

    private offAllNode() {
        this.nAddRotate.active = false;
        this.nMoneyPrize.active = false;
    }

    public show(val: number, type: number): number {
        this.offAllNode();
        this.node.active = true
        switch (type) {
            case 1:
                this.nAddRotate.active = true;
                this.lbNumberRotate.string = val.toString();
                break;

            case 2:
                this.nMoneyPrize.active = true;
                this.lbMoney.getComponent(PandaJackpotMoney).showMoney(val);
                break;
        }
        this.scheduleOnce(() => {
            this.node.active = false;
        }, 4);

        return 4;
    }

    public hide() {
        this.node.active = false;
    }
}
