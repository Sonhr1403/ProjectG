import PlinkoMain from "./Plinko.Controller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlinkoGoal extends cc.Component {
  public static instance: PlinkoGoal = null;

  @property(cc.Node)
  winBoard: cc.Node = null;
  @property(cc.Node)
  goal: cc.Node = null;
  @property(cc.Label)
  winLbl: cc.Label = null;
  @property(cc.Label)
  chanceLbl: cc.Label = null;
  @property(cc.Node)
  effectDropRight: cc.Node = null;
  @property(cc.Node)
  effectDropLeft: cc.Node = null;
  onLoad() {
    PlinkoGoal.instance = this;
  }
  onEnable() {
    if (!PlinkoMain.instance.isMobile) {
      this.goal.on(cc.Node.EventType.MOUSE_ENTER, this.enableWinBoard, this);
      this.goal.on(cc.Node.EventType.MOUSE_LEAVE, this.disableWinBoard, this);
    }else{
      this.goal.on(cc.Node.EventType.TOUCH_START, this.enableWinBoard, this);
      this.goal.on(cc.Node.EventType.TOUCH_END, this.disableWinBoard, this);
      this.goal.on(cc.Node.EventType.TOUCH_CANCEL, this.disableWinBoard, this);
    }
  }

  protected onDisable(): void {
    if (!PlinkoMain.instance.isMobile) {
      this.goal.off(cc.Node.EventType.MOUSE_ENTER, this.enableWinBoard, this);
      this.goal.off(cc.Node.EventType.MOUSE_LEAVE, this.disableWinBoard, this);
    }
    else{
      this.goal.off(cc.Node.EventType.TOUCH_START, this.enableWinBoard, this);
      this.goal.off(cc.Node.EventType.TOUCH_END, this.disableWinBoard, this);
      this.goal.off(cc.Node.EventType.TOUCH_CANCEL, this.disableWinBoard, this);
    }
  }

  initWinBoard(winNum, chanceNum, scale) {
    let updateScale = 1.3 + (1 - Number(scale))
    this.winBoard.setScale(updateScale, updateScale)
    this.winLbl.string = winNum.toString();
    this.chanceLbl.string = chanceNum.toString();
  }
  enableWinBoard() {
    this.winBoard.active = true;
  }
  disableWinBoard() {
    this.winBoard.active = false;
  }


}
