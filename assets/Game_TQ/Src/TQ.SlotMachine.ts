const { ccclass, property } = cc._decorator;
import TQMain from "./TQ.Controller";
import TQColumn, { Direction } from "./TQ.Column";
import TQCommon from "./TQ.Common";
import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import TQSoundController, { SLOT_SOUND_TYPE } from "./TQ.SoundController";

@ccclass
export default class TQSlotMachine extends cc.Component {
  public static instance: TQSlotMachine = null;
  @property({ type: cc.Node })
  public slotMachineNode = null;
  @property({ type: dragonBones.DragonBonesAtlasAsset })
  public spAtlasCharacter: dragonBones.DragonBonesAtlasAsset[] = [];
  @property({ type: dragonBones.DragonBonesAsset })
  public spAtlasCharacterAsset: dragonBones.DragonBonesAsset[] = [];
  @property({ type: cc.Prefab })
  public _columnPrefab = null;
  @property(cc.SpriteFrame)
  private iconFrames: cc.SpriteFrame[] = [];
  @property({ type: cc.Prefab })
  public imgIconPrefab = null;
  @property({ type: cc.Prefab })
  get columnPrefab(): cc.Prefab {
    return this._columnPrefab;
  }

  set columnPrefab(newPrefab: cc.Prefab) {
    this._columnPrefab = newPrefab;
    // this.node.removeAllChildren();

    if (newPrefab !== null) {
      this.createMachine();
    }
  }

  @property({ type: cc.Integer })
  public _numberColumn = 5;

  @property({ type: cc.Integer, range: [1, 5], slide: true })
  get numberColumn(): number {
    return this._numberColumn;
  }

  set numberColumn(newNumber: number) {
    this._numberColumn = newNumber;
    if (this.columnPrefab !== null) {
      this.createMachine();
    }
  }

  public results = [];
  public isFree: boolean = false;
  public stayStill: boolean = false;
  public scatterCount: number = 0;
  public jackpotCount: number = 0;
  public columnFinishSpinning: number = 0;
  public isGlowing: boolean = false;
  public almostEndFreeSpin: boolean = false;
  public columnFinish: number = 0;
  public isBombWild: boolean = false;
  public currentWinIndex: number = 0;
  public longWin: boolean = false;
  private winIconsArray = [];
  private arrayWinIndex = [];
  private columns = [];
  public type: number = 0;
  public bombWillAppear: boolean = false;
  private profitAmount: number = 0; //1000000
  private isSpinning: boolean = false;
  private resultColumn;
  private tweenWin = cc.tween();
  onLoad() {
    TQSlotMachine.instance = this;
  }

  protected onEnable(): void {
    this.createMachine();
  }

  public createMachine(): void {
    if (this.columns.length <= 0) {
      this.slotMachineNode.removeAllChildren();
      this.columns = [];
      for (let i = 0; i < this.numberColumn; i++) {
        let newColumn: cc.Node = cc.instantiate(this.columnPrefab);
        this.columns[i] = newColumn;
        this.slotMachineNode.addChild(newColumn);
      }
    }
    for (let i = 0; i < this.numberColumn; i++) {
      let newColumn: cc.Node = this.columns[i];
      const objColumn = newColumn.getComponent(TQColumn);
      objColumn.isLongColumn = false;
      if (TQMain.instance.slotOrientation == 3) {
        if (i == 2) {
          objColumn.isLongColumn = true;
        } else {
        }
      } else if (TQMain.instance.slotOrientation == 2) {
        if (i == 0 || i == 4) {
          objColumn.isLongColumn = true;
        } else {
        }
      } else if (TQMain.instance.slotOrientation == 1) {
        if (i == 1 || i == 2 || i == 3) {
          objColumn.isLongColumn = true;
        } else {
        }
      }
      objColumn.createColumn();
      objColumn.columnNum = i;
      objColumn.index = i;
    }
  }

  public letGo(res): void {
    this.columnFinish = 0;
    this.longWin = false;
    this.bombWillAppear = false;
    let wildCounter: number = 0;
    this.profitAmount = res.amountProfit;
    this.isFree = false;
    let result = res.item;
    let wins = res.result;
    for (let i = 0; i < wins.length; i++) {
      let temp = [];
      let limit = wins[i].length;
      for (let x = 0; x < limit; x++) {
        temp.push(result[wins[i][x]].id - 2);
      }
      if (temp.length >= 5) {
        this.longWin = true;
      }
      this.arrayWinIndex.push(i);
      this.winIconsArray.push(temp);
    }
    this.type = res.type;
    this.isGlowing = false;
    this.stayStill = false;
    // TQMain.instance.profitAmount = res.amountProfit;
    let data = { 0: [], 1: [], 2: [], 3: [], 4: [] };
    for (let idx = 0; idx < this.numberColumn; idx++) {
      data[idx] = [];
    }
    let scatterNumber = 0;
    for (let i = 0; i < (TQMain.instance.freeSpin ? 25 : 20); i++) {
      let winArray = [];
      for (let a = 0; a < wins.length; a++) {
        if (wins[a].includes(i) == true) {
          winArray.push(a);
        }
      }
      result[i].winArray = winArray;
      if (result[i].id == 3 || result[i].id == 1) {
        wildCounter += 1;
      }
      if (result[i].id == 2) {
        scatterNumber += 1;
      }
      data[i % 5].push(result[i]);
    }
    if (wildCounter > 3) {
      this.bombWillAppear = true;
    }
    this.resultColumn = data;
    var delay = 5;
    var isFree = false;
    let scatterCheck = 0;
    if (this.bombWillAppear == true) {
      switch (TQMain.instance.slotOrientation) {
        case 3: //Quan Vu (WAVE)
          if (TQSoundController.instance.getSystemVolume() > 0) {
            TQSoundController.instance.playType(
              SLOT_SOUND_TYPE.SPECIAL_WILD_ACTIVE
            );
          }
          let wave = TQMain.instance.wildWaveEffect;
          wave.node.active = true;
          wave.playAnimation("ani", -1);
          wave.once(
            dragonBones.EventObject.COMPLETE,
            () => {
              wave.node.active = false;
            },
            wave
          );
          // if (TQMain.instance.turboState == false) {
            let current = 0;
            cc.tween(this.node)
              .repeat(
                5,
                cc
                  .tween()
                  .delay(TQMain.instance.getTurboState() ? 0 : 0.3)
                  .call(() => {
                    let objColumn =
                      this.columns[current].getComponent(TQColumn);
                    objColumn.generateWildSpecial();
                    current += 1;
                  })
              )
              .start();
          // } else {
          //   for (let i = 0; i < this.numberColumn; i++) {
          //     let objColumn = this.columns[i].getComponent(TQColumn);
          //     objColumn.generateWildSpecial();
          //   }
          // }
          break;
        case 2: //Truong Phi (BOMB)
          this.isBombWild = true;
          break;
        case 1: //Gia Cat Luong (FIRE)
          if (TQMain.instance.slotOrientation === 1) {
            for (let i = 0; i < this.numberColumn; i++) {
              let objColumn = this.columns[i].getComponent(TQColumn);
              let wildCount = 0;
              for (let j = 0; j < data[i].length; j++) {
                if (data[i][j].id === 1 || data[i][j].id === 3) {
                  wildCount += 1;
                }
              }
              if (wildCount === data[i].length) {
                objColumn.toggleFire();
              }
            }
          }
          break;
      }
    }
    this.isSpinning = true;
    for (let i = 0; i < this.numberColumn; i++) {
      // cc.log("Column ", i, data[i]);
      let scatterState = 0;
      let objColumn = this.columns[i].getComponent(TQColumn);
      objColumn.spinDirection = Direction.Down;
      objColumn.stopFakeSpin();

      for (let j = 0; j < data[i].length; j++) {
        if (data[i][j].id === 2) {
          scatterState += 1;
        }
      }
      if (scatterCheck < 2) {
        objColumn.startSpin(delay + i * 4, data[i], isFree, false);
        if (scatterState > 0) {
          scatterCheck += scatterState;
        }
      } else if (scatterCheck >= 2) {
        objColumn.startSpin(
          delay + i * 4 + Math.round((delay + (i - 1) * 4) / 2),
          data[i],
          isFree,
          true
        );
      }
      if (this.type == 3 && TQMain.instance.freeSpin == false) {
        switch (scatterNumber) {
          case 3:
            TQMain.instance.freeSpinNumber = 8;
            break;
          case 4:
            TQMain.instance.freeSpinNumber = 15;
            break;
          case 5:
            TQMain.instance.freeSpinNumber = 20;
            break;
        }
      }
    }
  }

  public generateWild() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(TQColumn);
      objColumn.generateWildSpecial();
    }
  }

  public stopSpin() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(TQColumn);
      objColumn.stopFakeSpin();
    }
  }

  finishSpin() {
    this.columnFinishSpinning += 1;
    if (this.columnFinishSpinning < 5) {
      let objColumn =
        this.columns[this.columnFinishSpinning].getComponent(TQColumn);
      objColumn.showLightFx();
    }

    if (this.columnFinishSpinning === 5) {
      this.columnFinishSpinning = 0;
      this.isSpinning = false;
      setTimeout(() => {
        this.finalLetGo();
      }, 100);
    }
  }

  public letgoFake(): void {
    this.stopIdleWin();
    // this.node.stopAllActions();
    this.columnFinish = 0;
    this.columnFinishSpinning = 0;
    this.scatterCount = 0;
    this.isGlowing = false;
    this.arrayWinIndex = [];
    this.winIconsArray = [];
    this.currentWinIndex = 0;
    var delay = 2;
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(TQColumn);
      objColumn.spinDirection = Direction.Down;
      if (TQMain.instance.getTurboState()  != false) {
        objColumn.hideWildEffect();
      }
      objColumn.startSpinFake();
    }
  }

  resetColumns() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(TQColumn);
      objColumn.resetCells();
    }
  }

  public finalLetGo(): void {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(TQColumn);
      objColumn.changeFinalCellState();
    }
    if (this.profitAmount > 0) {
      if (TQSoundController.instance.getSystemVolume() > 0) {
        TQSoundController.instance.playType(SLOT_SOUND_TYPE.SMALL_WIN);
      }
    }

    this.scheduleOnce(
      () => {
        TQMain.instance.isSpinning = false;
        // cc.log(TQMain.instance.freeSpin, this.type);
        if (this.type == 3 && TQMain.instance.freeSpin == false) {
          // TQMain.instance.stopAutoSpin();
          TQMain.instance.addChangeSceneCounter();
          TQMain.instance.toggleWinNode();
          if (TQMain.instance.autoState == false) {
            TQMain.instance.freespinBtn.active = true;
          } else {
            TQMain.instance.activateFreeSpinWindow();
          }
        } else {
          if (this.profitAmount > 0) {
            TQMain.instance.toggleWinNode();
          } else if (this.profitAmount == 0) {
            TQMain.instance.iconContainer.active = false;
            TQMain.instance.msgLbl.getComponent(cc.Label).string =
              LanguageMgr.getString("threekingdom.game_msg_spin_over");
            TQMain.instance.reactivateSpinBtn();
          }
        }
      },
      // this.isFree == true ? 1 : 0.3
      this.profitAmount > 0 ? 0.8 : 0.5
    );
    // }, 2);
  }

  testFire() {
    let wave = TQMain.instance.wildWaveEffect;
    wave.node.active = true;
    wave.playAnimation("ani", -1);
    if (TQMain.instance.getTurboState() != false) {
      let current = 0;
      cc.tween(this.node)
        .repeat(
          5,
          cc
            .tween()
            .delay(0.3)
            .call(() => {
              let objColumn = this.columns[current].getComponent(TQColumn);
              objColumn.generateWildSpecial();
              current += 1;
            })
        )
        .start();
    } else {
      this.generateWild();
    }
    wave.once(
      dragonBones.EventObject.COMPLETE,
      () => {
        wave.node.active = false;
      },
      wave
    );
  }

  testBomb() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(TQColumn);
      objColumn.testBomb();
    }
  }

  stopColumnSpin() {
    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columns[i].getComponent(TQColumn);
      objColumn.stopSpin();
    }
  }

  stopIdleWin() {
    this.arrayWinIndex = [];
    this.winIconsArray = [];
    this.tweenWin.stop();
    cc.Tween.stopAllByTarget(this.tweenWin);
    cc.Tween.stopAllByTag(1);

    TQMain.instance.iconContainer.removeAllChildren();
  }

  setColumnsIdleWin() {
    let arrayWin = this.arrayWinIndex;
    let arrayIcon = this.winIconsArray;
    var limit = arrayWin.length;
    // let container = TQMain.instance.iconContainer;
    // container.removeAllChildren();
    if (TQMain.instance.autoState == false) {
      TQMain.instance.reactivateSpinBtn();
      this.tweenWin = cc
        .tween(this)
        .tag(1)
        .repeatForever(
          cc
            .tween(this)
            .call(() => {
              // cc.log(this.currentWinIndex, arrayIcon, "4EVER");
              // let container = TQMain.instance.iconContainer;
              // container.removeAllChildren();
              if (this.currentWinIndex >= limit) {
                this.currentWinIndex = 0;
              }
              for (let i = 0; i < this.numberColumn; i++) {
                let objColumn = this.columns[i].getComponent(TQColumn);
                objColumn.changeCellIdleWin();
              }

              // for (let x = 0; x < arrayIcon[this.currentWinIndex].length; x++) {
              //   let icon = cc.instantiate(this.imgIconPrefab);
              //   container.active = true;
              //   container.addChild(icon);
              //   icon.getComponent(cc.Sprite).spriteFrame =
              //     this.iconFrames[arrayIcon[this.currentWinIndex][x]];
              // }
              // TQMain.instance.msgLbl.getComponent(cc.Label).string =
              //   LanguageMgr.getString("threekingdom.game_msg_win_idle") +
              //   TQCommon.numberWithCommas(this.profitAmount);
              this.currentWinIndex += 1;
            })
            .delay(2.1)
        )
        .start();
    } else {
      this.tweenWin = cc
        .tween(this)
        .tag(1)
        .repeat(
          limit,
          cc
            .tween(this)
            .call(() => {
              // let container = TQMain.instance.iconContainer;
              // container.removeAllChildren();
              if (this.currentWinIndex >= limit) {
                this.currentWinIndex = 0;
              }
              for (let i = 0; i < this.numberColumn; i++) {
                let objColumn = this.columns[i].getComponent(TQColumn);
                objColumn.changeCellIdleWin();
              }
              // for (let x = 0; x < arrayIcon[this.currentWinIndex].length; x++) {
              //   let icon = cc.instantiate(this.imgIconPrefab);
              //   container.active = true;
              //   container.addChild(icon);
              //   icon.getComponent(cc.Sprite).spriteFrame =
              //     this.iconFrames[arrayIcon[this.currentWinIndex][x]];
              // }
              // TQMain.instance.msgLbl.getComponent(cc.Label).string =
              //   LanguageMgr.getString("threekingdom.game_msg_win_idle") +
              //   TQCommon.numberWithCommas(this.profitAmount);
              this.currentWinIndex += 1;
            })
            .delay(2.1)
        )
        .then(
          cc.tween(this).call(() => {
            TQMain.instance.reactivateSpinBtn();
          })
        )
        .start();
    }
  }
}
