import SlotTTCellAnim from "./SlotTT.CellAnim";
import { SlotCmd } from "./SlotTT.Cmd";
import SlotTTColumn, { Direction } from "./SlotTT.Column";
import SlotTTCommon from "./SlotTT.Common";
import SlotTTController from "./SlotTT.Controller";
import SlotTTMusicManager, {
  SLOT_MUSIC_TYPE,
  SLOT_SOUND_TYPE,
} from "./SlotTT.Music";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotTTMachine extends cc.Component {
  public static instance: SlotTTMachine = null;

  @property({ type: sp.SkeletonData })
  public listSyms: sp.SkeletonData[] = [];

  @property(cc.Prefab)
  private columnPrefab: cc.Prefab = null;

  @property(cc.Prefab)
  private flyingLbl: cc.Prefab = null;

  @property(cc.Node)
  private columnContainer: cc.Node = null;

  @property(cc.Node)
  private pnHighLight: cc.Node = null;

  @property(cc.Node)
  private lblWin: cc.Node = null;

  @property(cc.Node)
  private hlLbl: cc.Node[] = [];

  @property(cc.Node)
  private bigWin: cc.Node = null;

  @property(cc.Node)
  private block: cc.Node = null;

  @property(cc.Node)
  private btnSkip: cc.Node = null;

  @property(cc.Node)
  private skipNode: cc.Node = null;

  @property(cc.Label)
  private totalWin: cc.Label = null;

  ///////////////////

  private numberColumn = 3;

  private columnsAnim: Array<cc.Node> = [];
  private columnResult: Array<Array<SlotCmd.ImpItemCell>> = [[], [], []];

  public cellsAnim: Array<cc.Node> = [];

  private thisRoundResult: SlotCmd.ImpData = null;

  public totalWinMoney: number = 0;

  public currentBalance: number = 0;

  private winType: boolean = false;

  public profit: number = 0;
  public profitStep: number = 0;
  public totalProfit: number = 0;

  private isSkip: boolean = false;

  private isWild: boolean = false;
  private listWild: Array<number> = [];

  private listPosLW = [
    [cc.v3(-442, 210, 0), cc.v3(0, 210, 0), cc.v3(444, 210, 0)],
    [cc.v3(-442, 10, 0), cc.v3(0, 10, 0), cc.v3(445, 10, 0)],
    [cc.v3(-442, -190, 0), cc.v3(0, -200, 0), cc.v3(445, -190, 0)],
    [cc.v3(-442, 210, 0), cc.v3(0, 10, 0), cc.v3(445, -190, 0)],
    [cc.v3(-442, -190, 0), cc.v3(0, 10, 0), cc.v3(445, 210, 0)],
    [cc.v3(-442, 210, 0), cc.v3(0, -190, 0), cc.v3(445, 210, 0)],
    [cc.v3(-442, -190, 0), cc.v3(0, 210, 0), cc.v3(445, -190, 0)],
    [cc.v3(-442, 10, 0), cc.v3(0, -190, 0), cc.v3(445, 10, 0)],
  ];

  private listIndexLW = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 2, 7],
    [1, 6, 8],
    [3, 5, 7],
  ];

  private currentHL: number = -1;
  private currentHLWin: number = -1;

  onLoad() {
    SlotTTMachine.instance = this;
  }

  public forceStop() {
    // this.createMachine();
  }

  public createMachine(data: SlotCmd.ImpData): void {
    this.columnContainer.removeAllChildren();
    this.columnsAnim = [];

    this.processData(data);

    for (let i = 0; i < this.numberColumn; i++) {
      let newColumnAnim: cc.Node = cc.instantiate(this.columnPrefab);
      this.columnsAnim[i] = newColumnAnim;
      newColumnAnim.name = i.toString();
      this.columnContainer.addChild(newColumnAnim);
      const objColumnAnim = newColumnAnim.getComponent(SlotTTColumn);
      objColumnAnim.index = i;
      let animName = "";
      switch (i) {
        case 0:
          animName = "spin_left";
          break;

        case 1:
          animName = "spin_mid";
          break;

        case 2:
          animName = "spin_right";
          break;
      }
      objColumnAnim.ske.setAnimation(0, animName, true);
      objColumnAnim.ske.node.active = false;
      objColumnAnim.createColumnAnim(this.columnResult[i]);
    }
  }

  public startSpinVirtual() {
    this.totalWin.string = "";
    this.columnsAnim.forEach((element) => {
      element.children[0].active = true;
    });

    this.listWild.forEach((element) => {
      let thanTai = this.pnHighLight.getChildByName("ThanTai" + element);
      cc.tween(thanTai)
        .to(
          0.1,
          { position: cc.v3(thanTai.x, -500, 0), scaleY: 0.2 },
          { easing: "" }
        )
        .call(() => {
          thanTai.scaleY = 0.72;
          thanTai.active = false;
          thanTai.y = -300;
        })
        .start();
    });

    this.isWild = false;
    this.listWild = [];

    let delay = 0.05;
    if (SlotTTController.instance.isTurbo) {
      delay = 0;
    }

    SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.REEL_START);
    SlotTTMusicManager.instance.playLoop(SLOT_SOUND_TYPE.REEL_SPIN);

    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columnsAnim[i].getComponent(SlotTTColumn);
      objColumn.spinDirection = Direction.Down;
      objColumn.spinVirtual(delay * i);
    }
  }

  public letGo(data: SlotCmd.ImpData): void {
    this.totalWinMoney = data.amountProfit;
    this.currentBalance = data.currentMoney;

    this.processData(data);

    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columnsAnim[i].getComponent(SlotTTColumn);
      objColumn.spinDirection = Direction.Down;
      objColumn.pushData(this.columnResult[i], i);
    }
  }

  private processData(data: SlotCmd.ImpData) {
    this.thisRoundResult = data;
    this.columnResult = [[], [], []];
    for (let i = 0; i < data.itemList.length; i++) {
      let j = i % 3;
      this.columnResult[j].push(data.itemList[i]);
      if (data.itemList[i].id === 3) {
        this.isWild = true;
        this.listWild.push(j);
      }
    }

    this.checkWinType(data.betAmount, data.amountProfit);
  }

  public reward() {
    if (this.thisRoundResult.resultList.length > 0) {
      let wildTime = 0;
      if (this.isWild) {
        wildTime = 1;
        this.runWild();
      }
      this.runFlyingNum();

      this.scheduleOnce(() => {
        this.setActive();

        this.runAnimLbl();
      }, wildTime + 0.3 * (this.thisRoundResult.resultList.length - 1) + 0.6);
    } else {
      this.scheduleOnce(() => {
        if (SlotTTController.instance.isJackPot) {
          SlotCmd.Send.sendOpenJackpot();
          if (SlotTTController.instance.isAutoSpinning) {
            SlotTTController.instance.onClickStopAutoSpin();
          }
        } 
        if (SlotTTController.instance.isAutoSpinning) {
          SlotTTController.instance.checkAutoSpin();
        } else {
          this.scheduleOnce(()=>{
            SlotTTController.instance.disableBtn(true);
          }, 1)
        }
      }, 0.5);
    }
  }

  private runWild() {
    this.listWild.forEach((element) => {
      this.columnsAnim[element].children[0].active = false;
      let thanTai = this.pnHighLight.getChildByName("ThanTai" + element);
      thanTai.active = true;
      thanTai.getComponent(sp.Skeleton).setAnimation(0, "active", false);
      SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.EXPAND_WILD_PREMOVE);
      this.scheduleOnce(() => {
        thanTai.getComponent(sp.Skeleton).setAnimation(0, "idle", true);
        SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.EXPAND_WILD);
      }, 1);
    });
    this.scheduleOnce(() => {
      let ran = SlotTTCommon.getRandomNumber(6, 8);
      SlotTTMusicManager.instance.playType(ran);
    });
  }

  private runFlyingNum() {
    let delay = 0;
    if (this.thisRoundResult.resultList.length > 1) {
      SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.LINEWIN_LOOP);
    }
    for (let result of this.thisRoundResult.resultList) {
      this.scheduleOnce(() => {
        let lbl = cc.instantiate(this.flyingLbl);
        lbl.getComponent(cc.Label).string = BGUI.Utils.formatMoneyWithCommaOnly(
          result.moneyWin
        );
        lbl.angle = this.getRandomAngle();
        lbl.setPosition(this.listPosLW[result.id - 1][0]);
        this.pnHighLight.addChild(lbl);
        let ran = SlotTTCommon.getRandomNumber(21, 23);
        SlotTTMusicManager.instance.playType(ran);
        cc.tween(lbl)
          .parallel(
            cc
              .tween(lbl)
              .to(
                0.25,
                { position: this.listPosLW[result.id - 1][1] },
                { easing: "" }
              ),
            cc
              .tween(lbl)
              .by(0.25, { angle: this.getRandomAngle() }, { easing: "" })
          )
          .call(() => {
            cc.tween(lbl)
              .parallel(
                cc
                  .tween(lbl)
                  .to(
                    0.35,
                    { position: this.listPosLW[result.id - 1][2] },
                    { easing: "easeOut" }
                  ),
                cc
                  .tween(lbl)
                  .by(
                    0.35,
                    { angle: this.getRandomAngle() },
                    { easing: "easeOut" }
                  )
              )
              .call(() => {
                this.scheduleOnce(() => {
                  lbl.removeFromParent();
                }, 0.25);
              })
              .start();
          })
          .start();
      }, delay);
      delay += 0.3;
    }
  }

  private setActive() {
    for (let cell of this.cellsAnim) {
      let comp = cell.getComponent(SlotTTCellAnim);
      let itemCell = comp.getItemCell();
      if (itemCell.highlight && itemCell.id !== 3) {
        comp.setAnim("active");
      }
    }
  }

  private runAnimLbl() {
    let time = 2;
    this.lblWin.active = true;
    this.isSkip = false;
    if (this.winType) {
      SlotTTMusicManager.instance.stopAll();
      SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.BW_START);
      this.scheduleOnce(() => {
        SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.BW_LOOP);
      }, 0.5);
      time = 21;
      this.block.active = true;
      this.bigWin.active = true;
      this.bigWin
        .getComponent(sp.Skeleton)
        .setAnimation(0, "animation2", false);
      this.scheduleOnce(() => {
        this.bigWin
          .getComponent(sp.Skeleton)
          .setAnimation(0, "animation", true);
      }, 4);
      cc.error(this.isSkip, time);
      this.scheduleForLbl(this.thisRoundResult.amountProfit, time - 1);
      this.btnSkip.active = true;
      this.activateSkipNode(true);
      this.scheduleOnce(() => {
        if (this.bigWin.active) {
          SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.BW_END);
          this.scheduleOnce(() => {
            SlotTTMusicManager.instance.playSlotMusic(
              SLOT_MUSIC_TYPE.MAIN_MUSIC
            );
          }, 11);
          this.bigWin.active = false;
          this.block.active = false;
          this.btnSkip.active = false;
          this.activateSkipNode(false);
          this.lblUp();
          this.scheduleOnce(() => {
            if (!this.isSkip) {
              this.finishSpin();
            }
          }, 2);
        }
      }, time - 1);
    } else {
      this.scheduleForLbl(this.thisRoundResult.amountProfit, time - 1);
      let num = this.thisRoundResult.resultList.length;
      if (this.isWild) {
        switch (this.listWild.length) {
          case 0:
          case 1:
            if (num === 1) {
              SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.SCORE_2A);
            } else if (num === 2) {
              SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.SCORE_2B);
            } else if (num >= 3) {
              SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.SCORE_2C);
            }
            this.scheduleOnce(() => {
              SlotTTMusicManager.instance.playType(
                SLOT_SOUND_TYPE.WIN_ROLLUP_END
              );
            }, 0.5);
            break;

          case 2:
            SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.SCORE_3);
            this.scheduleOnce(() => {
              SlotTTMusicManager.instance.playType(
                SLOT_SOUND_TYPE.WIN_ROLLUP_END
              );
            }, 1);
            break;

          case 3:
            SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.SCORE_4);
            this.scheduleOnce(() => {
              SlotTTMusicManager.instance.playType(
                SLOT_SOUND_TYPE.WIN_ROLLUP_END
              );
            }, 1.5);
            break;
        }
      } else {
        if (num === 1) {
          SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.SCORE_1A);
        } else if (num === 2) {
          SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.SCORE_1B);
        } else if (num >= 3) {
          SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.SCORE_1C);
        }
        this.scheduleOnce(() => {
          SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.WIN_ROLLUP_END);
        }, 0.5);
      }

      // this.btnSkip.active = true;
      this.activateSkipNode(true);
      this.lblUp();
      this.scheduleOnce(() => {
        if (!this.isSkip) {
          this.finishSpin();
        }
      }, 3);
    }


  }

  private finishSpin() {
    SlotTTController.instance.increaseBalance(
      this.thisRoundResult.amountProfit
    );
    this.lblWin.active = false;
    this.lblWin.setPosition(cc.v2(0, -150));
    if (SlotTTController.instance.isJackPot) {
      SlotCmd.Send.sendOpenJackpot();
      if (SlotTTController.instance.isAutoSpinning) {
        SlotTTController.instance.onClickStopAutoSpin();
      }
    } else {
      if (SlotTTController.instance.isAutoSpinning) {
        SlotTTController.instance.checkAutoSpin();
      } else {
        this.highlight();
        this.schedule(this.highlight, 1.2, cc.macro.REPEAT_FOREVER, 1.2);
        if (!SlotTTController.instance.isAutoSpinning) {
          SlotTTController.instance.disableBtn(true);
        }
      }
    }
  }

  private highlight() {
    this.unHighLight();
    this.getCurrentHL();
    this.getHighlight();
  }

  private getCurrentHL() {
    if (this.currentHL >= 0) {
      for (let i = 0; i < this.thisRoundResult.resultList.length; i++) {
        if (
          this.currentHL ===
          this.thisRoundResult.resultList[
            this.thisRoundResult.resultList.length - 1
          ].id
        ) {
          this.currentHL = this.thisRoundResult.resultList[0].id;
          this.currentHLWin = this.thisRoundResult.resultList[0].moneyWin;
          SlotTTController.instance.disableBtn(true);
          break;
        }
        if (this.currentHL === this.thisRoundResult.resultList[i].id) {
          this.currentHL = this.thisRoundResult.resultList[i + 1].id;
          this.currentHLWin = this.thisRoundResult.resultList[i + 1].moneyWin;
          break;
        }
      }
    } else {
      try {
        this.currentHL = this.thisRoundResult.resultList[0].id;
        this.currentHLWin = this.thisRoundResult.resultList[0].moneyWin;
      } catch (error) {
        cc.error(error);
      }
    }
  }

  private getHighlight() {
    if (this.listIndexLW[this.currentHL - 1]) {
      for (let hl of this.listIndexLW[this.currentHL - 1]) {
        let a = this.pnHighLight.getChildByName(hl.toString());
        a.active = true;
        a.getComponent(sp.Skeleton).setAnimation(0, "avtive", false);
      }
      this.getHLLbl(this.currentHL, this.currentHLWin);
    }
  }

  private unHighLight() {
    for (let i = 0; i < 9; i++) {
      this.pnHighLight.getChildByName(i.toString()).active = false;
    }
    for (let lbl of this.hlLbl) {
      lbl.active = false;
    }
  }

  private resetCurrentHL() {
    this.currentHL = -1;
  }

  private getHLLbl(hl: number, num: number) {
    switch (hl - 1) {
      case 0:
      case 6:
        this.hlLbl[0].active = true;
        this.hlLbl[0].getComponent(cc.Label).string =
          BGUI.Utils.formatMoneyWithCommaOnly(num);
        break;

      case 1:
      case 3:
      case 4:
        this.hlLbl[1].active = true;
        this.hlLbl[1].getComponent(cc.Label).string =
          BGUI.Utils.formatMoneyWithCommaOnly(num);
        break;

      case 2:
      case 5:
      case 7:
        this.hlLbl[2].active = true;
        this.hlLbl[2].getComponent(cc.Label).string =
          BGUI.Utils.formatMoneyWithCommaOnly(num);
        break;
    }
  }

  private getRandomAngle(): number {
    let ang = 0;
    let ran = SlotTTCommon.getRandomNumber(0, 2);
    switch (ran) {
      case 0:
        ang = -7.5;
        break;

      case 1:
        ang = 0;
        break;

      case 2:
        ang = 7.5;
        break;
    }
    return ang;
  }

  public checkWinType(betAmount: number, totalProfit: number) {
    let time = Math.floor(totalProfit / betAmount);
    if (time >= 10) {
      this.winType = true;
    } else {
      this.winType = false;
    }
  }

  public scheduleForLbl(winMoney: number, time: number) {
    this.profit = 0;
    this.totalProfit = winMoney;
    this.profitStep = winMoney / (time * 100);

    this.schedule(this.increaseWinLbl, 0.001);
  }

  private increaseWinLbl() {
    this.profit += this.profitStep;
    if (this.profit >= this.totalProfit || this.isSkip) {
      this.unschedule(this.increaseWinLbl);
      this.lblWin.getComponent(cc.Label).string =
        BGUI.Utils.formatMoneyWithCommaOnly(this.totalProfit);
      this.btnSkip.active = false;
      this.activateSkipNode(false);
    } else {
      this.lblWin.getComponent(cc.Label).string =
        BGUI.Utils.formatMoneyWithCommaOnly(this.profit);
    }
  }

  private lblUp() {
    cc.tween(this.lblWin)
      .to(0.5, { position: cc.v3(0, 0, 0) }, { easing: "" })
      .call(() => {
        this.scheduleOnce(() => {
          this.updateTotalWin();
        }, 0.5);
      })
      .start();
  }

  private updateTotalWin() {
    this.totalWin.string = BGUI.Utils.formatMoneyWithCommaOnly(
      this.thisRoundResult.amountProfit
    );
  }

  public onClickSpin() {
    this.unschedule(this.highlight);
    this.unHighLight();
    this.resetCurrentHL();
  }

  private onClickSkip() {
    this.isSkip = true;
    if (this.bigWin.active) { // && !SlotTTController.instance.isJackPot
      this.bigWin.active = false;
      this.block.active = false;
      this.lblUp();
      SlotTTMusicManager.instance.stopAll();
      SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.BW_END);
      this.scheduleOnce(() => {
        SlotTTMusicManager.instance.playSlotMusic(SLOT_MUSIC_TYPE.MAIN_MUSIC);
      }, 10);
    }
    if (!this.bigWin.active && SlotTTController.instance.isJackPot) {
      SlotTTMusicManager.instance.stopAll();
      SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.JP_END);
      this.scheduleOnce(() => {
        SlotTTController.instance.jackpot.active = false;
        this.block.active = false;
        this.lblWin.active = false;
        SlotTTController.instance.isJackPot = false;
        SlotTTMusicManager.instance.playSlotMusic(SLOT_MUSIC_TYPE.MAIN_MUSIC);
      }, 3);
    }
    this.btnSkip.active = false;
    this.activateSkipNode(false);
    this.unschedule(this.increaseWinLbl);
    this.lblWin.getComponent(cc.Label).string =
      BGUI.Utils.formatMoneyWithCommaOnly(this.totalProfit);
    this.scheduleOnce(() => {
      this.finishSpin();
    }, 2);
  }

  public openJackPot(winMoney: number) {
    this.block.active = true;
    this.lblWin.active = true;
    this.scheduleForLbl(winMoney, 12);
    this.btnSkip.active = true;
    this.activateSkipNode(true);
    SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.JP_START);
    this.scheduleOnce(() => {
      SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.JP_LOOP);
    }, 1.5);
    this.scheduleOnce(() => {
      SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.JP_END);
      this.btnSkip.active = false;
      this.activateSkipNode(false);
      this.scheduleOnce(() => {
        SlotTTController.instance.jackpot.active = false;
        this.block.active = false;
        this.lblWin.active = false;
        SlotTTController.instance.isJackPot = false;
      }, 3);
    }, 12.5);
  }

  private activateSkipNode(active: boolean) {
    if (active) {
      this.skipNode.active = true;
      this.skipNode.on(cc.Node.EventType.TOUCH_END, this.onClickSkip, this);
    } else {
      this.skipNode.off(cc.Node.EventType.TOUCH_END, this.onClickSkip, this);
      this.skipNode.active = false;
    }
  }
}
