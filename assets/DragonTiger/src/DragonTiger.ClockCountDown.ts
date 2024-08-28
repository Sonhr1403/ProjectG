import DragonTiger_GameManager from "./DragonTiger.GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonTiger_ClockCountDown extends cc.Component {

    @property(cc.Label)
    lbTime: cc.Label = null;

    @property(cc.Node)
    spClock: cc.Node = null;

    private _dataTime: number = -1;
    isAction = false;

    startCountDown(time: number) {
        this.unscheduleAllCallbacks();

        this._dataTime = time;
        this.node.stopAllActions();
        this.lbTime.string = this._dataTime + '';

        if (this._dataTime <= 5) {
            this.lbTime.node.color = cc.Color.RED;
        } else {
            this.lbTime.node.color = cc.Color.BLUE;
        }

        this.schedule(this._updateTime, 1);
    }

    onLoad(): void {
        this.lbTime.string = "...";
    }

    updateTime(time) {
        this.lbTime.string = time

        cc.tween(this.spClock)
            .by(.4, { angle: 90 })
            .start();

        if (time <= 5) {
            this.lbTime.node.color = cc.Color.RED;
        } else {
            this.lbTime.node.color = cc.Color.BLUE;
        }
    }

    // actionTime() {
    //     this.node.stopAllActions();
    //     this.isAction = false

    //     cc.tween(this.node)
    //         .repeatForever(cc.tween()
    //             .delay(.5)
    //             .call(() => {
    //                 this.lbTime.string = '.'
    //             })
    //             .delay(.5)
    //             .call(() => {
    //                 this.lbTime.string = '..'
    //             })
    //             .delay(.5)
    //             .call(() => {
    //                 this.lbTime.string = '...'
    //             }))
    //         .start()
    // }

    private _updateTime() {
        this._dataTime--;
        DragonTiger_GameManager.instance.timeRemain--;
        BGUI.ZLog.log(' DragonTiger_GameManager.instance.timeRemain = ', DragonTiger_GameManager.instance.timeRemain)

        if (this._dataTime > 0) {
            this.lbTime.string = this._dataTime + '';

            if (this._dataTime <= 5) {
                this.lbTime.node.color = cc.Color.RED;
            } else {
                this.lbTime.node.color = cc.Color.BLUE;
            }

            cc.tween(this.spClock)
                .to(.4, { angle: this.spClock.angle + 90 })
                .start();

        }
        else {
            this.lbTime.string = "..."
            this.unscheduleAllCallbacks();
        }
    }
}
