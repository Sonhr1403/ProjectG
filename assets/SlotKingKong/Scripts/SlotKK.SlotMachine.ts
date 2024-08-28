import SlotKKColumn from "./SlotKK.Column";
import { SlotCmd } from "./SlotKK.Cmd";
import SlotKKController from "./SlotKK.Controller";
import SlotKKRow, { Direction } from "./SlotKK.Row";
import SlotKKMusicManager, { SLOT_SOUND_TYPE } from "./SlotKK.Music";
import SlotKKCellAnim from "./SlotKK.CellAnim";
import SlotKKCellSpr from "./SlotKK.CellSpr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotKKMachine extends cc.Component {
  public static instance: SlotKKMachine = null;

  @property({ type: sp.SkeletonData })
  public listSyms: sp.SkeletonData[] = [];

  @property(cc.SpriteAtlas)
  public listSprSym: cc.SpriteAtlas[] = [];

  @property(cc.Prefab)
  public columnPrefab: cc.Prefab = null;

  @property(cc.Prefab)
  public rowPrefab: cc.Prefab = null;

  public numberColumn = 6;

  @property(cc.Node)
  public rowContainer: cc.Node[] = [];

  @property(cc.Node)
  public columnContainer: cc.Node[] = [];

  @property(cc.Node)
  private lblGain: cc.Node = null;

  ///////////////////
  private rowSpr = null;
  private columnsSpr = [];
  private rowAnim = null;
  private columnsAnim = [];
  private columnResult: Array<Array<SlotCmd.ImpItemCell>> = [];
  private rowResult: Array<SlotCmd.ImpItemCell> = [];

  public cellsAnim: Array<cc.Node> = [];
  public cellsSpr: Array<cc.Node> = [];

  public isExplode: boolean = false;

  private thisRoundResult: Array<SlotCmd.Data> = [];
  private currentRound: number = 0;
  public totalRound: number = 0;

  public totalWinMoney: number = 0;

  public currentBalance: number = 0;

  private listRowTake = {
    2: [[2, 0]],
    3: [
      [2, 0, 1],
      [1, 2, 0],
      [3, 0, 0],
    ],
    4: [
      [3, 0, 0, 1],
      [1, 3, 0, 0],
      [4, 0, 0, 0],
    ],
    5: [
      [3, 0, 0, 2, 0],
      [2, 0, 3, 0, 0],
      [4, 0, 0, 0, 1],
      [1, 4, 0, 0, 0],
      [5, 0, 0, 0, 0],
    ],
    6: [
      [3, 0, 0, 3, 0, 0],
      [4, 0, 0, 0, 2, 0],
      [2, 0, 4, 0, 0, 0],
      [1, 5, 0, 0, 0, 0],
      [5, 0, 0, 0, 0, 1],
      [6, 0, 0, 0, 0, 0],
    ],
    7: [
      [3, 0, 0, 4, 0, 0, 0],
      [4, 0, 0, 0, 3, 0, 0],
      [2, 0, 5, 0, 0, 0, 0],
      [5, 0, 0, 0, 0, 2, 0],
    ],
  };

  onLoad() {
    SlotKKMachine.instance = this;
    // this.createMachine();
  }

  public forceStop() {
    // this.createMachine();
  }

  public createMachine(Data: SlotCmd.Data): void {
    this.rowContainer[0].removeAllChildren();
    this.rowContainer[1].removeAllChildren();
    this.rowSpr = null;
    this.rowAnim = null;
    this.columnContainer[0].removeAllChildren();
    this.columnContainer[1].removeAllChildren();
    this.columnsSpr = [];
    this.columnsAnim = [];

    this.getResult(Data);

    let newRowSpr = cc.instantiate(this.rowPrefab);
    let newRowAnim = cc.instantiate(this.rowPrefab);
    this.rowSpr = newRowSpr;
    this.rowAnim = newRowAnim;
    this.rowContainer[0].addChild(newRowSpr);
    this.rowContainer[1].addChild(newRowAnim);
    let objRowSpr = newRowSpr.getComponent(SlotKKRow);
    let objRowAnim = newRowAnim.getComponent(SlotKKRow);
    objRowSpr.createRowSpr(this.rowResult);
    objRowAnim.createRowAnim(this.rowResult);

    for (let i = 0; i < 6; i++) {
      let newColumnSpr: cc.Node = cc.instantiate(this.columnPrefab);
      this.columnsSpr[i] = newColumnSpr;
      newColumnSpr.name = i.toString();
      this.columnContainer[0].addChild(newColumnSpr);
      const objColumnSpr = newColumnSpr.getComponent(SlotKKColumn);
      objColumnSpr.createColumnSpr(this.columnResult[i]);
      objColumnSpr.index = i;
      let newColumnAnim: cc.Node = cc.instantiate(this.columnPrefab);
      this.columnsAnim[i] = newColumnAnim;
      newColumnAnim.name = i.toString();
      this.columnContainer[1].addChild(newColumnAnim);
      const objColumnAnim = newColumnAnim.getComponent(SlotKKColumn);
      objColumnAnim.createColumnAnim(this.columnResult[i]);
      objColumnAnim.index = i;
    }
  }

  public startSpinVirtual() {
    let delay = 0.02;
    if (SlotKKController.instance.isTurbo) {
      delay = 0;
    }

    let objRow = this.rowSpr.getComponent(SlotKKRow);
    objRow.spinDirection = Direction.Down;
    objRow.spinVirtual(0);

    for (let i = 0; i < 6; i++) {
      let objColumn = this.columnsSpr[i].getComponent(SlotKKColumn);
      objColumn.spinDirection = Direction.Down;
      objColumn.spinVirtual(delay * i);
    }
  }

  public calcResultAnim() {
    let objRowSpr = this.rowSpr.getComponent(SlotKKRow);
    let objRowAnim = this.rowAnim.getComponent(SlotKKRow);
    objRowAnim.resultOfRow = objRowSpr.resultOfRow;
    objRowAnim.setCellResultAnim();

    for (let i = 0; i < 6; i++) {
      let objColumnSpr = this.columnsSpr[i].getComponent(SlotKKColumn);
      let objColumnAnim = this.columnsAnim[i].getComponent(SlotKKColumn);
      objColumnAnim.resultOfCol = objColumnSpr.resultOfCol;
      objColumnAnim.setCellResultAnim();
    }
  }

  public letGo(
    list: Array<SlotCmd.Data>,
    winMoney: number,
    balance: number
  ): void {
    this.currentRound = 0;

    this.totalWinMoney = winMoney;

    this.currentBalance = balance;

    this.thisRoundResult = list;
    this.totalRound = list.length;

    this.getResult(this.thisRoundResult[this.currentRound]);

    let objRow = this.rowSpr.getComponent(SlotKKRow);
    objRow.spinDirection = Direction.Down;
    objRow.pushData(this.rowResult);

    for (let i = 0; i < this.numberColumn; i++) {
      let objColumn = this.columnsSpr[i].getComponent(SlotKKColumn);
      objColumn.spinDirection = Direction.Down;
      objColumn.pushData(this.columnResult[i], i);
    }
  }

  private mergeAdjacentDuplicates(arr: Array<number>, num: number) {
    if (arr.length <= 1) {
      return arr;
    }

    const resultArray = [];
    let currentElement = arr[0];
    let currentArr = [arr[0]];

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] === currentElement) {
        if (
          !this.columnResult[num][i].highlight &&
          !this.columnResult[num][i - 1].highlight
        ) {
          currentArr.push(arr[i]);
        } else if (
          this.columnResult[num][i].highlight &&
          this.columnResult[num][i - 1].highlight
        ) {
          currentArr.push(arr[i]);
        } else {
          resultArray.push(currentArr);
          currentElement = arr[i];
          currentArr = [arr[i]];
        }
      } else {
        resultArray.push(currentArr);
        currentElement = arr[i];
        currentArr = [arr[i]];
      }
    }
    resultArray.push(currentArr);

    return resultArray;
  }

  // private breakDownNumber(originalNumber) {
  //   let result = [];
  //   let remain = originalNumber;

  //   for (let i = 0; i < originalNumber; i++) {
  //     let randomPart = Math.floor(Math.random() * remain) + 1;
  //     if (randomPart === 7) {
  //       randomPart = 6;
  //     }
  //     let dif = remain - randomPart;
  //     if (dif >= 0) {
  //       result.push(randomPart);
  //       remain -= randomPart;
  //       for (let j = 0; j < randomPart - 1; j++) {
  //         result.push(0);
  //         ++i;
  //       }
  //     } else {
  //       --i;
  //       continue;
  //     }
  //   }

  //   return result;
  // }

  private breakDownNumber(originalNumber) {
    let list = this.listRowTake[originalNumber];
    let ran = Math.floor(Math.random() * list.length);
    return list[ran];
  }

  public getResult(data: SlotCmd.Data) {
    // BGUI.ZLog.log("list data", data);
    SlotKKController.instance.scatterCount = 0;
    this.currentRound++;
    this.rowResult = [];
    this.columnResult = [[], [], [], [], [], []];
    for (let i = 0; i < data.indexList.length; i++) {
      let itemCell: SlotCmd.ImpItemCell = {
        index: i,
        id: data.indexList[i],
        highlight: false,
        isExplode: false,
        rowTake: 1,
        isActive: true,
      };

      if (data.indexList[i] === SlotCmd.DEFINE_CHARACTER.COIN) {
        SlotKKController.instance.isCoin = true;
      }

      if (data.indexList[i] === SlotCmd.DEFINE_CHARACTER.SCATTER) {
        SlotKKController.instance.scatterCount += 1;
      }

      if (i <= 5) {
        switch (i) {
          case 1:
          case 2:
          case 3:
          case 4:
            this.rowResult.push(itemCell);
            break;

          default:
            break;
        }
      } else {
        if (i % 6 === 0) {
          this.columnResult[0].push(itemCell);
        } else if (i % 6 === 1) {
          this.columnResult[1].push(itemCell);
        } else if (i % 6 === 2) {
          this.columnResult[2].push(itemCell);
        } else if (i % 6 === 3) {
          this.columnResult[3].push(itemCell);
        } else if (i % 6 === 4) {
          this.columnResult[4].push(itemCell);
        } else if (i % 6 === 5) {
          this.columnResult[5].push(itemCell);
        }
      }
    }

    if (data.hlGoldArray.length != 0) {
      for (let hl of data.hlGoldArray) {
        let i = hl % 6;
        let j = Math.floor((hl - 6) / 6);
        if (hl <= 5) {
          this.rowResult[hl - 1].highlight = true;
        } else {
          this.columnResult[i][j].highlight = true;
        }
      }
    }

    if (data.hlArray.length != 0) {
      this.isExplode = true;
      for (let hl of data.hlArray) {
        let i = hl % 6;
        let j = Math.floor((hl - 6) / 6);
        if (hl <= 5) {
          this.rowResult[hl - 1].isExplode = true;
        } else {
          this.columnResult[i][j].isExplode = true;
        }
      }
    }

    for (let i = 0; i < 6; i++) {
      let arr = [];
      for (let res of this.columnResult[i]) {
        arr.push(res.id);
      }
      let arrTemp = this.mergeAdjacentDuplicates(arr, i);
      if (arrTemp.length < 7) {
        let count = 0;
        for (let j = 0; j < arrTemp.length; j++) {
          if (arrTemp[j].length !== 1) {
            let rp = this.breakDownNumber(arrTemp[j].length);
            for (let k = 0; k < rp.length; k++) {
              this.columnResult[i][j + k + count].rowTake = rp[k];
              if (rp[k] == 0) {
                this.columnResult[i][j + k + count].isActive = false;
              }
            }
            count += rp.length - 1;
          }
        }
      }
    }
    // BGUI.ZLog.log(
    //   "finish row take and active",
    //   this.rowResult,
    //   this.columnResult
    // );
    // this.rowResult = [...tempRowResult];
    // this.columnResult = [...tempColumnResult];
  }

  public explode() {
    let coinCount = 0;
    let moneyRoundWin = this.thisRoundResult[this.currentRound - 1].moneyWin;
    // cc.log("moneyRoundWin", moneyRoundWin);
    if (moneyRoundWin > 0 || SlotKKController.instance.isCoin) {
      this.calcResultAnim();
      let coinTime = 0;
      if (SlotKKController.instance.isCoin) {
        for (let coinPos of SlotKKController.instance.coinPos) {
          SlotKKController.instance.flyCoin(coinPos);
        }
        coinTime = 0.85;
        coinCount += 1;
      }
      this.scheduleOnce(() => {
        this.scheduleOnce(() => {
          SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.SYMBOL_EXPLODE);
        }, 1.2);
        for (let cellAnim of this.cellsAnim) {
          cellAnim.getComponent(SlotKKCellAnim).explode();
        }
        for (let cellSpr of this.cellsSpr) {
          cellSpr.getComponent(SlotKKCellSpr).explode();
        }

        if (moneyRoundWin > 0) {
          this.lblGain.getComponent(cc.Label).string =
            BGUI.Utils.formatMoneyWithCommaOnly(moneyRoundWin);
          SlotKKController.instance.setBigLbl(false, moneyRoundWin);
          cc.tween(this.lblGain)
            .to(0.5, { scale: 1 }, { easing: "smooth" })
            .call(() => {
              this.scheduleOnce(() => {
                cc.tween(this.lblGain)
                  .to(0.5, { scale: 0 }, { easing: "smooth" })
                  .call(() => {})
                  .start();
              }, 0.5);
            })
            .start();
        }
        this.scheduleOnce(() => {
          this.isExplode = false;
          if (this.thisRoundResult[this.currentRound]) {
            SlotKKController.instance.isCoin = false;
            SlotKKController.instance.coinPos = [];
            this.getResult(this.thisRoundResult[this.currentRound]);
          }
          this.scheduleOnce(() => {
            this.rowSpr.getComponent(SlotKKRow).rearrangeCell(this.rowResult);
            for (let i = 0; i < 6; i++) {
              this.columnsSpr[i]
                .getComponent(SlotKKColumn)
                .rearrangeCell(this.columnResult[i]);
            }
          }, 0.1);
        }, 1.5);
      }, coinTime);
    }

    this.schedule(
      () => {
        let moneyRoundWin =
          this.thisRoundResult[this.currentRound - 1].moneyWin;
        // cc.log("moneyRoundWin", moneyRoundWin);
        if (moneyRoundWin > 0 || SlotKKController.instance.isCoin) {
          this.calcResultAnim();
          let coinTime = 0;
          if (SlotKKController.instance.isCoin) {
            for (let coinPos of SlotKKController.instance.coinPos) {
              SlotKKController.instance.flyCoin(coinPos);
            }
            coinTime = 0.85;
            coinCount += 1;
          }
          this.scheduleOnce(() => {
            this.scheduleOnce(() => {
              SlotKKMusicManager.instance.playType(
                SLOT_SOUND_TYPE.SYMBOL_EXPLODE
              );
            }, 1.2);
            for (let cellAnim of this.cellsAnim) {
              cellAnim.getComponent(SlotKKCellAnim).explode();
            }
            for (let cellSpr of this.cellsSpr) {
              cellSpr.getComponent(SlotKKCellSpr).explode();
            }

            if (moneyRoundWin > 0) {
              this.lblGain.getComponent(cc.Label).string =
                BGUI.Utils.formatMoneyWithCommaOnly(moneyRoundWin);
              SlotKKController.instance.setBigLbl(false, moneyRoundWin);
              cc.tween(this.lblGain)
                .to(0.5, { scale: 1 }, { easing: "smooth" })
                .call(() => {
                  this.scheduleOnce(() => {
                    cc.tween(this.lblGain)
                      .to(0.5, { scale: 0 }, { easing: "smooth" })
                      .call(() => {})
                      .start();
                  }, 0.5);
                })
                .start();
            }
            this.scheduleOnce(() => {
              this.isExplode = false;
              if (this.thisRoundResult[this.currentRound]) {
                SlotKKController.instance.isCoin = false;
                SlotKKController.instance.coinPos = [];
                this.getResult(this.thisRoundResult[this.currentRound]);
              }
              this.scheduleOnce(() => {
                this.rowSpr
                  .getComponent(SlotKKRow)
                  .rearrangeCell(this.rowResult);
                for (let i = 0; i < 6; i++) {
                  this.columnsSpr[i]
                    .getComponent(SlotKKColumn)
                    .rearrangeCell(this.columnResult[i]);
                }
              }, 0.1);
            }, 1.5);
          }, coinTime);
        }
      },
      2.75,
      this.totalRound - 3,
      0
    );

    this.scheduleOnce(() => {
      SlotKKController.instance.reward();
    }, 2.75 * (this.totalRound - 1) + coinCount * 0.85);
  }
}
