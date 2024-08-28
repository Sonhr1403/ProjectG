import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import Bacarrat_GameManager from "./Bacarrat.GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bacarrat_ClockCountDown extends cc.Component {

    @property(cc.Label)
    lbTime: cc.Label = null;

    @property(cc.Sprite)
    timer: cc.Sprite = null

    private _dataTime: number = -1;
    isAction = false;

    startCountDown(time: number) {
        // if (!time) return;
        this._dataTime = time;
        this.node.stopAllActions();
        // this.schedule(this._updateTime, 1);
    }

    onLoad(): void {
        this.lbTime.string = "...";
        this.timer.fillRange = 1;
    }

    update(dt) {
        if (this._dataTime < 0)
            return;

        // BGUI.ZLog.log('-> CountDown ', this._dataTime);
        this._dataTime -= dt
        let abc = Math.round(this._dataTime)
        if (this._dataTime >= 0) {
            this.lbTime.string = abc + ''
            this.timer.fillRange = this._dataTime / 20
            if (this._dataTime <= 1 && !this.isAction) {
                this.isAction = true;
                Bacarrat_GameManager.instance.cardManager.setAnimDealer('InviteBet')
                Bacarrat_GameManager.instance.notifyDealer.getChildByName('lb_dealer').getComponent(cc.Label).string = LanguageMgr.getString('bacarrat.noti.stop_bet')
                cc.tween(Bacarrat_GameManager.instance.notifyDealer)
                    .to(0.2, { scaleX: 1, scaleY: 1 })
                    .delay(1.2)
                    .to(0.2, { scaleX: 0, scaleY: 0 })
                    .start();
            }
        }
        else {
            this.actionTime();
        }
    }

    actionTime() {
        this.node.stopAllActions();
        this.isAction = false

        cc.tween(this.node)
            .repeatForever(cc.tween()
                .delay(.5)
                .call(() => {
                    this.lbTime.string = '.'
                })
                .delay(.5)
                .call(() => {
                    this.lbTime.string = '..'
                })
                .delay(.5)
                .call(() => {
                    this.lbTime.string = '...'
                }))
            .start()
    }

    private _updateTime() {
        // BGUI.ZLog.log('-> CountDown ', this._dataTime);
        if (this._dataTime > 0) {
            this.lbTime.string = this._dataTime.toString();
            this.timer.fillRange = this._dataTime / 20
        }
        else {
            // BGUI.ZLog.log('Stop CountDown -----> ',   this._dataTime);
            this.lbTime.string = "..."
            this.unscheduleAllCallbacks();
        }
        this._dataTime--;
    }
}
