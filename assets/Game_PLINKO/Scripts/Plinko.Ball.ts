import PlinkoMain from "./Plinko.Controller";
import PlinkoCommon from "./Plinko.Common";
import PlinkoMusicCtrler, { PLINKO_SOUND_TYPE } from "./Plinko.MusicCtrller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlinkoBall extends cc.Component {
  public static instance: PlinkoBall = null;

  private score: boolean = true;
  private goalPos: cc.Vec2;
  public goalIndex: number;
  public goalIndexArray = [];
  public positionFinal: cc.Vec2;
  public count: number = 0;
  private t = cc.tween(this.node);
  private oCPN = null;
  public betInfo;
  public moneyEarned: number = 0;
  public protoPos = [];
  public currentPos: cc.Vec3 = new cc.Vec3(0, 0, 0);
  private tempStartLocation: cc.Vec3 = new cc.Vec3(0, 0, 0);
  private tempStartLocation2: cc.Vec3 = new cc.Vec3(0, 0, 0);
  private positionShift: cc.Vec2 = new cc.Vec2(0, 0);
  private randomIndex: number;
  private runActionTime;
  private inactiveIntervalCheck;
  private dropSpeed = {
    8: [3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6],
    9: [2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.4],
    10: [2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.4],
    11: [2.7, 2.8, 2.9, 3.0, 3.1, 3.2, 3.3],
    12: [2.6, 2.7, 2.8, 2.9, 3.0, 3.1, 3.2],
    13: [2.5, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1],
    14: [2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0],
    15: [2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9],
    16: [2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8],
  };

  private actionTime = {
    8: 0.3,
    9: 0.21,
    10: 0.25,
    11: 0.25,
    12: 0.23,
    13: 0.22,
    14: 0.2,
    15: 0.19,
    16: 0.17,
  };
  private elasticityLv = {
    8: 0.35,
    9: 0.35,
    10: 0.35,
    11: 0.35,
    12: 0.35,
    13: 0.28,
    14: 0.18,
    15: 0.15,
    16: 0.11,
  };
  // LIFE-CYCLE CALLBACKS:
  onLoad() {
    PlinkoBall.instance = this;
    // this.inactiveIntervalCheck = setInterval(this.checkInactive, 15000)
  }
  protected onDestroy(): void {
    this.unschedule(this.checkInactive);
    // clearInterval(this.inactiveIntervalCheck)
  }
  checkInactive() {
    this.currentPos.x = Math.floor(this.node.position.x);
    if (this.tempStartLocation2.x != this.currentPos.x) {
      this.tempStartLocation2.x = this.currentPos.x;
    } else {
      if (this.node.position.x > this.positionFinal.x) {
        this.node.runAction(
          cc
            .moveTo(this.runActionTime, this.positionShift)
            .easing(cc.easeOut(1.0))
        );
      } else if (this.node.position.x < this.positionFinal.x) {
        this.node.runAction(
          cc
            .moveTo(this.runActionTime, this.positionShift)
            .easing(cc.easeOut(1.0))
        );
      }
    }
  }
  public initBall(pos, idx, arrayIndexes, posX) {
    this.randomIndex = PlinkoCommon.randomIntFromInterval(0, 6);

    this.protoPos = pos;
    this.moneyEarned = idx.curentMoney;
    this.betInfo = idx;
    this.goalIndexArray = arrayIndexes;
    if (this.protoPos[0].length == 2) {
      if (posX < 0) {
        this.goalIndex = this.goalIndexArray[1];
        this.positionFinal = this.node.parent.convertToNodeSpaceAR(
          this.protoPos[0][1]
        );
      } else if (posX > 0) {
        this.goalIndex = this.goalIndexArray[0];
        this.positionFinal = this.node.parent.convertToNodeSpaceAR(
          this.protoPos[0][0]
        );
      } else {
        let randInt = PlinkoCommon.randomIntFromInterval(1, 10);
        if (randInt % 2 == 0) {
          this.goalIndex = this.goalIndexArray[0];
          this.positionFinal = this.node.parent.convertToNodeSpaceAR(
            this.protoPos[0][0]
          );
        } else {
          this.goalIndex = this.goalIndexArray[1];
          this.positionFinal = this.node.parent.convertToNodeSpaceAR(
            this.protoPos[0][1]
          );
        }
      }
    } else if (this.protoPos[0].length == 1) {
      this.goalIndex = this.goalIndexArray[0];
      this.positionFinal = this.node.parent.convertToNodeSpaceAR(
        this.protoPos[0][0]
      );
    } else {
      let randInt = PlinkoCommon.randomIntFromInterval(
        0,
        this.protoPos[0].length - 1
      );
      this.goalIndex = this.goalIndexArray[randInt];
      this.positionFinal = this.node.parent.convertToNodeSpaceAR(
        this.protoPos[0][randInt]
      );
    }
    if (PlinkoMain.instance.quickDrop == true) {
      this.node.setPosition(this.positionFinal.x, this.positionFinal.y + 5);
    }
  }

  updateMoney() {
    PlinkoMain.instance.goldAmount = this.moneyEarned;
    PlinkoMain.instance.updateLabelMoney();
    PlinkoMain.instance.betHistory.unshift(this.betInfo);
    if (PlinkoMain.instance.betHistory.length > PlinkoMain.instance.rowNum) {
      PlinkoMain.instance.betHistory.splice(
        PlinkoMain.instance.betHistory.length - 1,
        1
      );
    }
    PlinkoMain.instance.renderPlinkoHistoryNumber();
  }

  private onBeginContact(contact, selfCollider, otherCollider) {
    this.runActionTime = this.actionTime[PlinkoMain.instance.rowNum];
    if (
      selfCollider.node.name == this.node.name &&
      otherCollider.node.name == "Goal"
    ) {
      if (this.score == true) {
        this.score = false;
        this.updateMoney();
        if (PlinkoMain.instance.ballPool.children.length <= 1) {
          PlinkoMain.instance.enableToggleBtns();
        }
        this.node.removeFromParent();
      }
    } else if (
      selfCollider.node.name == this.node.name &&
      otherCollider.node.parent.parent.name.includes("Row")
    ) {
      if (
        !(this.oCPN == otherCollider.node.parent.parent.name) ||
        this.oCPN == null
      ) {
        this.oCPN = otherCollider.node.parent.parent.name;
        this.node.stopAllActions();
        PlinkoMusicCtrler.instance.playType(PLINKO_SOUND_TYPE.COLLIDE_PIN);
        let rowLeft =
          PlinkoMain.instance.rowNum -
          parseInt(otherCollider.node.parent.parent.name.slice(3)) -
          1;
        if (rowLeft === 0) {
          this.unschedule(this.checkInactive);
          this.schedule(this.checkInactive, 1);
          this.currentPos = this.node.position;
          this.node.stopAllActions();
          if (
            this.goalIndex <= parseInt(otherCollider.node.parent.name.slice(5))
          ) {
            if (
              this.goalIndex == 0 &&
              parseInt(otherCollider.node.parent.name.slice(5)) == 1
            ) {
              var tempPlaceholder = otherCollider.node.parent
                .getChildByName("Left")
                .convertToWorldSpaceAR(new cc.Vec2(0, 0));
              var tempMovement =
                this.node.parent.convertToNodeSpaceAR(tempPlaceholder);
              var ballMoveBy = PlinkoCommon.diff(
                this.node.position.x,
                tempMovement.x
              );
              this.positionShift = tempMovement;

              this.actionBallMove(tempMovement);
            } else {
              var tempPlaceholder = otherCollider.node.parent
                .getChildByName("Right")
                .convertToWorldSpaceAR(new cc.Vec2(0, 0));
              var tempMovement =
                this.node.parent.convertToNodeSpaceAR(tempPlaceholder);
              var ballMoveBy = PlinkoCommon.diff(
                this.node.position.x,
                tempMovement.x
              );
              this.positionShift = tempMovement;

              this.actionBallMove(tempMovement);
            }
          } else {
            var tempPlaceholder = otherCollider.node.parent
              .getChildByName("Left")
              .convertToWorldSpaceAR(new cc.Vec2(0, 0));
            var tempMovement =
              this.node.parent.convertToNodeSpaceAR(tempPlaceholder);
            var ballMoveBy = PlinkoCommon.diff(
              this.node.position.x,
              tempMovement.x
            );
            this.positionShift = tempMovement;

            this.actionBallMove(tempMovement);
          }
        } else {
          this.unschedule(this.checkInactive);
          this.schedule(this.checkInactive, 1);

          if (
            this.goalIndex <= parseInt(otherCollider.node.parent.name.slice(5))
          ) {
            var tempPlaceholder = otherCollider.node.parent
              .getChildByName("Left")
              .convertToWorldSpaceAR(new cc.Vec2(0, 0));
            var tempMovement =
              this.node.parent.convertToNodeSpaceAR(tempPlaceholder);
            var ballMoveBy = PlinkoCommon.diff(
              this.node.position.x,
              tempMovement.x
            );
            this.positionShift = tempMovement;

            this.actionBallMove(tempMovement);
          }
          if (
            parseInt(otherCollider.node.parent.name.slice(5)) <
              this.goalIndex &&
            this.goalIndex <
              parseInt(otherCollider.node.parent.name.slice(5)) + rowLeft
          ) {
            let randomInt = PlinkoCommon.randomIntFromInterval(0, 1);
            if (randomInt == 0) {
              var tempPlaceholder = otherCollider.node.parent
                .getChildByName("Left")
                .convertToWorldSpaceAR(new cc.Vec2(0, 0));
              var tempMovement =
                this.node.parent.convertToNodeSpaceAR(tempPlaceholder);
              var ballMoveBy = PlinkoCommon.diff(
                this.node.position.x,
                tempMovement.x
              );
              this.positionShift = tempMovement;

              this.actionBallMove(tempMovement);
            } else {
              var tempPlaceholder = otherCollider.node.parent
                .getChildByName("Right")
                .convertToWorldSpaceAR(new cc.Vec2(0, 0));
              var tempMovement =
                this.node.parent.convertToNodeSpaceAR(tempPlaceholder);
              var ballMoveBy = PlinkoCommon.diff(
                this.node.position.x,
                tempMovement.x
              );
              this.positionShift = tempMovement;

              this.actionBallMove(tempMovement);
            }
          } else if (
            // } else {
            this.goalIndex >=
            parseInt(otherCollider.node.parent.name.slice(5)) + rowLeft
          ) {
            var tempPlaceholder = otherCollider.node.parent
              .getChildByName("Right")
              .convertToWorldSpaceAR(new cc.Vec2(0, 0));
            var tempMovement =
              this.node.parent.convertToNodeSpaceAR(tempPlaceholder);
            var ballMoveBy = PlinkoCommon.diff(
              this.node.position.x,
              tempMovement.x
            );
            this.positionShift = tempMovement;

            this.actionBallMove(tempMovement);
          }
        }

        if (this.oCPN == null) {
          this.oCPN = otherCollider.node.parent.parent.name;
        }
      }
    } else {
    }
  }

  private actionBallJumpLeft(ballMoveBy) {
    this.node.runAction(
      cc
        .moveBy(this.runActionTime, new cc.Vec2(0 - ballMoveBy, 0))
        .easing(cc.easeOut(1.0))
    );
  }

  private actionBallJumpRight(ballMoveBy) {
    this.node.runAction(
      cc
        .moveBy(this.runActionTime, new cc.Vec2(ballMoveBy, 0))
        .easing(cc.easeOut(1.0))
    );
  }
  private actionBallMove(pos) {
    this.node.runAction(
      // cc.spawn(
      // cc.moveBy(this.runActionTime, new cc.Vec2(0,this.node.height)).easing(cc.easeElasticOut(60)),
      cc.moveTo(this.runActionTime, pos).easing(cc.easeOut(1.0))
      // )
    );
  }

  protected update(dt: number): void {
    this.tempStartLocation = this.node.position;
    this.tempStartLocation.y -= Math.abs(
      this.dropSpeed[PlinkoMain.instance.rowNum][this.randomIndex] * 1.2
    );
    this.node.setPosition(this.tempStartLocation);

    if (this.node.position.y <= -2000) {
      this.updateMoney();
      this.node.removeFromParent();
    }
  }
}
