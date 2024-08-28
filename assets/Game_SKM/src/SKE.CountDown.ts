const { ccclass, property } = cc._decorator;

@ccclass
export default class SKECountDown extends cc.Component {

    @property(cc.ProgressBar)
    private progressBar: cc.ProgressBar = null;

    @property(cc.Label)
    private lbCountDown: cc.Label = null;

    @property(cc.Sprite)
    private spCountdown: cc.Sprite = null;

    @property(cc.SpriteFrame)
    private spBarSprite1: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    private spBarSprite2: cc.SpriteFrame = null;

    private _localTimeTotal = 0;
    private _localTimer: number = -1;

    start() {
        this.hideCountDown();
    }

    public setCountDown(time: number) {
        this.resetCountDown();
        this.hideCountDown();
        this._localTimeTotal = time
        this._localTimer = time;
        this.progressBar.progress = 0;
        if (time > 0) {
            this.showCountDown();
            this.lbCountDown.string = time.toString();
            this.schedule(this.countDown, 1);
            this.schedule(this.updateProgressBar, 0.1);
        }
    }

    private countDown(): void {
        this._localTimer--;
        this.progressBar.node.getComponent(cc.Sprite).spriteFrame = this.spBarSprite1;
        if (this._localTimer > 0) {
            if (this._localTimer <= 3) {
                this.progressBar.node.getComponent(cc.Sprite).spriteFrame = this.spBarSprite2;
            } else {
                this.progressBar.node.getComponent(cc.Sprite).spriteFrame = this.spBarSprite1;
            }
            this.lbCountDown.string = this._localTimer.toString()
        } else {
            this.resetCountDown();
            this.hideCountDown();
        }
    }

    private updateProgressBar() {
        let progress = this.progressBar.progress;
        progress += 1 / (this._localTimeTotal * 10);
        if(progress<= 1) {
            this.progressBar.progress = progress;
        }else {
            this.resetCountDown();
            this.hideCountDown();
        }
    }

    private resetCountDown(): void {
        this.unschedule(this.countDown);
        this.unschedule(this.updateProgressBar);
    }

    private showCountDown(): void {
        this.node.active = true;
    }

    private hideCountDown(): void {
        this.node.active = false;
    }
}
