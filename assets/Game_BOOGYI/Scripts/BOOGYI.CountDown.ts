

const { ccclass, property } = cc._decorator;

@ccclass
export default class BOOGYICountDown extends cc.Component {
  @property(cc.Node)
  private progressBar: cc.Node = null;

  @property(cc.Label)
  private lbCountDown: cc.Label = null;

  @property(cc.SpriteFrame)
  private spBarSprite1: cc.SpriteFrame = null;

  @property(cc.SpriteFrame)
  private spBarSprite2: cc.SpriteFrame = null;

  @property(cc.Sprite)
  public timeRemain: cc.Sprite = null;

  @property(cc.Node)
  public spark: cc.Node = null;

  private startPoint: number = 0;
  private angleNow: number = 0;
  private rad: number = 0;

  private _localTimeTotal = 0;
  private _localTimer: number = -1;

  private thinkingAct: cc.Tween = null;
  private _timeRemain: number = -1;

  start() {
    this.hideCountDown();
  }

  public setCountDown(time: number) {
    this.hideCountDown();
    this.resetCountDown();
    this._localTimeTotal = time;
    this._localTimer = time;
    if (time > 0) {
      this.progressBar.getComponent(cc.Sprite).spriteFrame = this.spBarSprite1;
      this.showCountDown();
      this.lbCountDown.string = time.toString();
      this.schedule(this.countDown, 1);
      this.setTimeRemain(time);
      this.runRound(time);
    }
  }

  private countDown(): void {
    this._localTimer--;
    if (this._localTimer > 0) {
      this.lbCountDown.string = this._localTimer.toString();
      if (this._localTimer <= 2) {
        this.progressBar.getComponent(cc.Sprite).spriteFrame =
          this.spBarSprite2;
      }
    } else {
      this.hideCountDown();
      this.resetCountDown();
      this.hideSpark();
    }
  }

  private resetCountDown(): void {
    this.unschedule(this.countDown);
  }

  private showCountDown(): void {
    this.node.active = true;
  }

  private hideCountDown(): void {
    this.node.active = false;
  }

  setTimeRemain(remain = 0) {
    this._timeRemain = remain;
    if (remain == 0) {
      this.hidePlayCountdown();
      return;
    }
    this.progressBar.stopAllActions();
    this.timeRemain.fillStart = 0.25;
    this.timeRemain.fillRange = 1;
    this.progressBar.active = true;
    this.thinkingAct?.stop();
    this.thinkingAct = cc
      .tween(this.timeRemain)
      .to(remain, { fillRange: 0 })
      .call(() => {
        this.hidePlayCountdown();
      });
    this.thinkingAct.start();
  }

  public hidePlayCountdown() {
    this.progressBar.active = false;
  }

  public runRound(time: number) {
    let timeT = time * 20;
    this.startPoint = Math.PI / 2;
    this.rad = ((360 / timeT) * Math.PI) / 180;
    this.unschedule(this.updateSparkRun);
    this.spark.active = true;
    this.schedule(this.updateSparkRun, 0.048, timeT);
  }

  public updateSparkRun() {
    this.angleNow = this.startPoint;
    this.startPoint -= this.rad;
    let x = 50 * Math.cos(this.angleNow);
    let y = 50 * Math.sin(this.angleNow);
    this.spark.setPosition(cc.v2(x, y));
  }

  public hideSpark() {
    this.spark.active = false;
  }
}
