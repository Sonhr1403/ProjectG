// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class SlotKKFreeGameLbl extends cc.Component {
    public static instance: SlotKKFreeGameLbl = null;

    @property(cc.Label)
    public featureWinNum: cc.Label = null;

    @property(cc.Label)
    public freeSpinNum: cc.Label = null;

    @property(cc.Label)
    public multiplierNum: cc.Label = null;

    @property(cc.Node)
    public freeSpinNode: cc.Node = null;

    /////////////////////////////////////////////////////////////////

    public tempFWNum: number = 0;

    // LIFE-CYCLE CALLBACKS:

    protected onLoad(): void {
        SlotKKFreeGameLbl.instance = this;
    }

    public updateFWNum(num: number): void {
        this.featureWinNum.string = BGUI.Utils.formatMoneyWithCommaOnly(parseInt(this.featureWinNum.string) + num);
    }

    public updateFSNum(num: number): void {
        this.freeSpinNum.string = num.toString();
    }

    public updateMultiNum(num: number): void {
        this.multiplierNum.string = "x" + num;
    }

    public increaseMultiNum(): void {
        let num = this.multiplierNum.string.charAt(this.multiplierNum.string.length - 2) == "x" ? parseInt(this.multiplierNum.string.charAt(this.multiplierNum.string.length - 1)) : parseInt(this.multiplierNum.string.charAt(this.multiplierNum.string.length - 2) + this.multiplierNum.string.charAt(this.multiplierNum.string.length - 1));
        this.multiplierNum.string = "x" + (num + 1);
        this.zoomEffect();
    }

    private zoomEffect(){
        cc.tween(this.freeSpinNode).to(0.25, {scale: 1.2}, {easing: ""}).call(()=>{
            cc.tween(this.freeSpinNode).to(0.25, {scale: 1}, {easing: ""}).start();
        }).start();
    }
}
