const { ccclass, property } = cc._decorator;

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

@ccclass
export default class RouletteWheel extends cc.Component {
  public static instance: RouletteWheel = null;

  @property(sp.Skeleton)
  public table: sp.Skeleton = null;

  @property(cc.Node)
  private goldAxis: cc.Node = null;

  @property(cc.Node)
  public ball: cc.Node = null;

  @property(cc.SpriteFrame)
  private winBallSprites: cc.SpriteFrame[] = [];

  @property(cc.Node)
  private resultsNode: cc.Node = null;

  @property(cc.Node)
  private winningBall: cc.Node = null;

  @property(cc.Label)
  private winningNumberLabel: cc.Label = null;

  public winNumber: number = null;
  private red_numbers = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
  ];
  protected onLoad() {
    this.ball.active = true;

    RouletteWheel.instance = this;

    var manager = cc.director.getCollisionManager();
    manager.enabled = true;

    this.inactive();
  }

  public reset_roulette() {
    this.stop_spin();
    this.table.node.setRotation(0);
    this.ball.active = true;
    this.ball.setRotation(0);
    this.ball.setPosition(0, 0);
    this.ball.children[0].setPosition(414, 0);
  }

  public start_spin() {
    this.table.node.stopAllActions();
    this.ball.active = true;
    this.ball.stopAllActions();
    this.inactive();

    this.table.node.runAction(cc.repeatForever(cc.rotateBy(1, -70)));

    let t = cc.tween;
    const tween1 = cc.tween(this.ball).by(1.2, { rotation: 360 }).start();
    t(this.goldAxis).by(3, { rotation: 360 }).repeatForever().start();
    this.scheduleOnce(() => {
      const tween2 = t(this.ball).by(1.4, { rotation: 360 }).repeatForever().start();
    }, 1);

    this.scheduleOnce(() => {
      const tween3 = t(this.ball.children[0])
        .to(1.4, { position: cc.v3(330, 0, 0) })

        .start();
    }, 1);

    this.scheduleOnce(() => {
      for (let i = 0; i <= 36; i++) {
        this.table.node.getChildByName(i.toString()).children[1].active = true;
        this.table.node.getChildByName(i.toString()).children[2].active = false;
      }
    }, 2.8);

    this.scheduleOnce(() => {
      const tween4 = t(this.ball)
        .by(1.8, { rotation: 360 })
        .repeatForever()
        .start();
    }, 2.3);
  }

  public bounce_animation() {
    let t = cc.tween;
    const rotateTween = t(this.ball).by(0.2, { rotation: 9.73 }).start();
    const bounceTween = t(this.ball.children[0])
      .by(0.07, { position: cc.v3(10, 0, 0) })
      .by(0.07, { position: cc.v3(-20, 0, 0) })
      .start();
  }

  public stop_spin() {
    this.inactive();

    this.table.node.stopAllActions();
    this.ball.stopAllActions();
    this.goldAxis.stopAllActions();
    this.table.timeScale = 0;

    this.ball.setRotation(0);
    this.ball.setPosition(0, 0);
    this.ball.children[0].setPosition(414, 0);
  }

  public ballfollowRoulette() {
    this.ball.stopAllActions();
    this.ball.active = false;
    this.table.node.getChildByName(
      this.winNumber.toString()
    ).children[0].active = true;
  }

  public show_spin_result() {
    if (this.red_numbers.indexOf(this.winNumber) > -1) {
      this.winningBall.getComponent(cc.Sprite).spriteFrame =
        this.winBallSprites[2];
    } else if (this.winNumber == 0) {
      this.winningBall.getComponent(cc.Sprite).spriteFrame =
        this.winBallSprites[0];
    } else {
      this.winningBall.getComponent(cc.Sprite).spriteFrame =
        this.winBallSprites[1];
    }

    this.winningNumberLabel.string = this.winNumber.toString();

    var actMove = cc.moveTo(0.5, cc.v2(0, 0)).easing(cc.easeElasticIn(1));
    this.resultsNode.runAction(actMove);
  }

  public hide_spin_results() {
    var actMove = cc.moveTo(0.5, cc.v2(0, 1000)).easing(cc.easeElasticOut(1));
    this.resultsNode.runAction(actMove);
  }

  private inactive(){
    for (let i = 0; i <= 36; i++) {
      this.table.node.getChildByName(i.toString()).children[0].active = false;
      this.table.node.getChildByName(i.toString()).children[1].active = false;
      this.table.node.getChildByName(i.toString()).children[2].active = false;
    }
  }
}
