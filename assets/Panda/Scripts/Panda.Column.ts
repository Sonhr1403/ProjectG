const { ccclass, property } = cc._decorator;
import PandaCell from "./Panda.Cell";
import { PandaCmd } from "./Panda.Cmd";
import PandaController from "./Panda.Controller";
export enum Direction { Up, Down }
import { PandaLanguageMgr } from "./Panda.LanguageMgr";
import PandaSoundControler, { SLOT_SOUND_TYPE } from "./Panda.SoundControler";
import PandaMachine from "./Panda.Machine";

@ccclass
export default class PandaColumn extends cc.Component {

  @property(cc.Node)
  public nRotate: cc.Node = null;

  @property(cc.Node)
  public nContainer: cc.Node = null;

  @property(cc.Mask)
  public nMask: cc.Mask = null;

  @property(cc.Node)
  public nSpeedUp: cc.Node = null;

  @property({ type: cc.Prefab })
  public prfCell: cc.Prefab = null;

  ///////////////////////////
  private _index: number = 0;
  private _spinDirection: number = Direction.Down;
  public cells: Array<cc.Node> = [];
  public stopSpinning: boolean = false;
  private resultOfCol: PandaCmd.ImpColumn = null;
  private heightCell = 225;
  private listYPosOfCell = [450, 225, 0, -225, -450];
  private arrayPosOfCell: Array<cc.Vec3> = [cc.v3(0, this.listYPosOfCell[0], 0), cc.v3(0, this.listYPosOfCell[1], 0), cc.v3(0, this.listYPosOfCell[2], 0), cc.v3(0, this.listYPosOfCell[3], 0), cc.v3(0, this.listYPosOfCell[4], 0)];

  public set spinDirection(index: number) {
    this._spinDirection = index;
  }

  public get spinDirection() {
    return this._spinDirection;
  }

  public set index(index: number) {
    this._index = index;
  }

  public get index() {
    return this._index;
  }

  onLoad() {
    this.nContainer.removeAllChildren();
  }

  start() {
    // TODO
  }

  onEnable() {
    // TODO
  }

  public enableMask(isEnable: boolean) {
    this.nMask.enabled = isEnable;
  }

  private numberRotation: number = 25; // Số vòng quay của cột
  private numberRepeatFinish: number = 11;
  // Tạo cột
  public createColumn(data: Array<PandaCmd.ImpItemCell>): Array<PandaCmd.ImpItemCell> {
    let newData: Array<PandaCmd.ImpItemCell> = [...data];
    this.nContainer.removeAllChildren();
    this.cells = [];
    this.runAnimSpeedUp(false);
    for (let i = 0; i < 5; i++) {
      let nCell: cc.Node = cc.instantiate(this.prfCell);
      nCell.position = this.arrayPosOfCell[i];
      this.cells[i] = nCell;
      this.nContainer.addChild(nCell);
      ////// XỬ LÝ /////
      let objCell = nCell.getComponent(PandaCell);
      objCell.activeCell(true);
      objCell.activeHighLight(false);

      switch (i) {
        case 1:
          if (data.length == 3 && data[0].id) {
            objCell.setSkeletonDefault(data[0].id);
          } else {
            let id = objCell.setSkeletonDefaultRandom();
            let tempItem: PandaCmd.ImpItemCell = { index: 0, id: id, oldId: -1, highlight: false, isChange: false }
            newData.push(tempItem);
          }
          break;

        case 2:
          if (data.length == 3 && data[1].id) {
            objCell.setSkeletonDefault(data[1].id);
          } else {
            let id = objCell.setSkeletonDefaultRandom();
            let tempItem: PandaCmd.ImpItemCell = { index: 0, id: id, oldId: -1, highlight: false, isChange: false };
            newData.push(tempItem);
          }
          break;

        case 3:
          if (data.length == 3 && data[2].id) {
            objCell.setSkeletonDefault(data[2].id);
          } else {
            let id = objCell.setSkeletonDefaultRandom();
            let tempItem: PandaCmd.ImpItemCell = { index: 0, id: id, oldId: -1, highlight: false, isChange: false };
            newData.push(tempItem);
          }
          break;

        default:
          let id = objCell.setSkeletonDefaultRandom();
          break;
      }
    }
    return newData;
  }

  //////////////////////////
  public spinVirtual(timeDelay: number) {
    this.numberRotation = 60;
    this.status = PandaCmd.STATE_OF_SPIN.KHOI_DONG;
    this.doSpin(timeDelay);
  }

  private status: number = PandaCmd.STATE_OF_SPIN.KHOI_DONG;

  public pushData(data: PandaCmd.ImpColumn): void {
    this.status = PandaCmd.STATE_OF_SPIN.DANG_QUAY;
    this.numberRotation = 60;
    this.resultOfCol = data;
    if (this.resultOfCol.itemFrame.speedUp >= 1) {
      if (this.resultOfCol.itemFrame.speedUp == 1) {
        this.numberRotation += 60;
      } else {
        this.numberRotation = this.numberRotation + 120 * this.resultOfCol.itemFrame.speedUp;
      }
    }
  }

  //////////////////////////////////////
  private doSpin(timeDelay: number) {
    this.nContainer.children.forEach((nCell) => {
      const dirOfColumn = this.getDirection();
      var posMoved = cc.v3(0, this.heightCell * dirOfColumn, 0);
      var timeFirstMove = 0.05;
      cc.tween(nCell).delay(timeDelay).by(timeFirstMove, { position: posMoved }, { easing: 'backIn' })
        .then(cc.tween(nCell).call(() => {
          this.changeCallBack(nCell)
        })).then(cc.tween(nCell).call(() => {
          this.checkEndCallback(nCell);
        })).start();
    });
  }

  private checkEndCallback(nCell: cc.Node) {
    if (PandaController.instance.isForceStop || this.numberRotation <= 0) {
      this.brakeSuddenly(nCell);
    } else {
      this.loopSpin(nCell);
    }
  }

  private loopSpin(nCell: cc.Node) {
    const dirOfColumn = this.getDirection();
    var posMoved = cc.v3(0, this.heightCell * dirOfColumn, 0);
    let timeStable = 0.03;
    if(this.status == PandaCmd.STATE_OF_SPIN.DANG_QUAY) {
      this.numberRotation -= 1;
    }
    cc.tween(nCell).repeat(1, cc.tween().by(timeStable, { position: posMoved }).call(() => {
      this.changeCallBack(nCell);
    })).call(() => {
      this.checkEndCallback(nCell);
    }).start();
  }

  // Phanh dừng
  private brakeSuddenly(nCell: cc.Node) {
    const dirOfColumn = this.getDirection();
    const posMoved = cc.v3(0, this.heightCell * dirOfColumn, 0);
    const timeDecrease = 0.06;
    const timeFinishMove = 0.08;
    cc.tween(nCell).repeat(this.numberRepeatFinish, cc.tween().by(timeDecrease, { position: posMoved }).call(() => {
      this.changeCallBack(nCell);
    })).by(timeFinishMove, { position: posMoved }, { easing: "bounceOut" }).call(() => {
      this.changeCallBack(nCell, true);
    }).start();
  }

  private changeCallBack(nCell: cc.Node, isFinish: boolean = false) {
    const objCell = nCell.getComponent(PandaCell);
    const dirOfColumn = this.getDirection();
    var posReset = cc.v3(0, -(this.heightCell * 2 * dirOfColumn), 0);
    if (Math.abs(nCell.position.y * dirOfColumn) > (this.heightCell * 2)) {
      objCell.setSkeletonSpinRandom();
      nCell.position = posReset;
    }
    if (isFinish) {
      this.runAnimSpeedUp(false);
      let isFinishReal = this.calcTheResults(nCell);
      // Nếu là cột thứ 5 và ô 3 thì bắt đầu tính toán trả thưởng
      if (this.index == 4 && isFinishReal) {
        // this.status = PandaCmd.STATE_OF_SPIN.KET_THUC;
        PandaController.instance.isInRotation = false;
        this.processAfterFinishRotation();
      }
    }
  }

  private getDirection() {
    return this.spinDirection === Direction.Down ? -1 : 1;
  }

  public runAnimSpeedUp(isActive: boolean) {
    this.nSpeedUp.active = isActive;
  }

  private processAfterFinishRotation() {
    PandaMachine.instance.handleAfterStopRotate();
    if (this.resultOfCol.itemFrame.typeFree == 0) {
      PandaController.instance.showBtnRotationManual(true);
    }
  }

  private calcTheResults(nCell: cc.Node): boolean {
    let isFinish: boolean = false;
    if (this.status == PandaCmd.STATE_OF_SPIN.DANG_QUAY) {
      const objCell = nCell.getComponent(PandaCell);
      const posY = nCell.position.y;
      let list = this.resultOfCol.list;
      let itemFrame = this.resultOfCol.itemFrame;
      switch (posY) {
        case this.listYPosOfCell[0]:
          objCell.setSkeletonDefaultRandom();
          objCell.index = 99;
          objCell.activeCell(false);
          break;
        case this.listYPosOfCell[1]:
          objCell.activeCell(true);
          objCell.index = 0;
          nCell.zIndex = 1;
          objCell.setResultForCell(list[0], itemFrame);
          break;
        case this.listYPosOfCell[2]:
          objCell.activeCell(true);
          objCell.index = 1;
          nCell.zIndex = 2;
          objCell.setResultForCell(list[1], itemFrame);
          break;
        case this.listYPosOfCell[3]:
          objCell.activeCell(true);
          objCell.index = 2;
          nCell.zIndex = 3;
          objCell.setResultForCell(list[2], itemFrame);
          isFinish = true;
          break;
        case this.listYPosOfCell[4]:
          objCell.setSkeletonDefaultRandom();
          objCell.index = 99;
          objCell.activeCell(false);
          break;
      }
      this.enableMask(false);
    }

    return isFinish;
  }
}
