// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class RLTDealer extends cc.Component {
    public static instance: RLTDealer = null;

    @property(sp.Skeleton)
    dealerSke: sp.Skeleton = null;

    @property(cc.Node)
    public nChips: cc.Node = null;

    @property(cc.Button)
    public btnTip: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        RLTDealer.instance = this;
    }

    public addChip(nChip: cc.Node) {
        nChip.setPosition(cc.v3(0, 0, 0));
        this.nChips.addChild(nChip);
    }


    public idle() {
        this.dealerSke.setAnimation(0, "idle", true);
    }

    public win() {
        this.dealerSke.setAnimation(0, "win", false);
        this.idleBack(2);
    }

    public lose() {
        this.dealerSke.setAnimation(0, "lose", false);
        this.idleBack(2);
    }

    public startGame() {
        this.dealerSke.setAnimation(0, "start", false);
        this.idleBack(1.6);
    }

    public collectChip() {
        this.dealerSke.setAnimation(0, "thu_tien", false);
        this.idleBack(1.6);
    }

    public tips() {
        this.dealerSke.setAnimation(0, "tips", false);
        this.idleBack(1.4);
    }

    private idleBack(time: number){
        this.scheduleOnce(() => {
            this.idle();
            this.btnTip.interactable = true;
        }, time);
    }

}
