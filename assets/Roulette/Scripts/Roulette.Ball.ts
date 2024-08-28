const { ccclass, property } = cc._decorator;
import RouletteWheel from "./Roulette.RouletteWheel";
import RouletteController from "./Roulette.Controller";

@ccclass
export default class RouletteBall extends cc.Component {
  public static instance: RouletteBall = null;

  private wheelnumbersAC = [
    0, 26, 3, 35, 12, 28, 7, 29, 18, 22, 9, 31, 14, 20, 1, 33, 16, 24, 5, 10,
    23, 8, 30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32,
  ];

  private bounce_enabled: boolean = false;
  // LIFE-CYCLE CALLBACKS:

  protected onEnable() {
    var manager = cc.director.getCollisionManager();
    manager.enabled = true;
  }

  private getSecondLayerDropNumber(num) {
    let i = this.wheelnumbersAC.indexOf(num) + 9;
    if (i > 36) {
      i = i - 36;
    } else {
    }
    return this.wheelnumbersAC[i].toString() + "a";
  }

  private onCollisionEnter(selfCollider, otherCollider) {
    let t = cc.tween;
    if (
      selfCollider.node.name == RouletteWheel.instance.winNumber.toString() &&
      otherCollider.node.name == "rlt_spinnerball_red"
    ) {
      this.bounce_enabled = false;
      this.node.stopAllActions();
      RouletteWheel.instance.ballfollowRoulette();
      this.scheduleOnce(() => {
        RouletteWheel.instance.show_spin_result();
      }, 1.4);

      this.scheduleOnce(() => {
        RouletteController.instance.toggleRltWheel()
      }, 3.7);
    } else if (
      selfCollider.node.name ==
      this.getSecondLayerDropNumber(RouletteWheel.instance.winNumber)
    ) {
      for (let i = 0; i <= 36; i++) {
        RouletteWheel.instance.table.node.getChildByName(
          i.toString()
        ).children[1].active = false;
        RouletteWheel.instance.table.node.getChildByName(
          i.toString()
        ).children[2].active = false;
      }
      const tween3 = t(RouletteWheel.instance.ball.children[0])
        .to(1.4, { position: cc.v3(250, 0, 0) })
        .start();
      this.scheduleOnce(() => (this.bounce_enabled = true), 0.8);
    } else {
      if (this.bounce_enabled == true) {
        RouletteWheel.instance.bounce_animation();
      } else {
      }
    }
  }
}
