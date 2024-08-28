const { ccclass, property } = cc._decorator;
import PlinkoCommon from "./Plinko.Common";
import PlinkoMusicCtrler, { PLINKO_SOUND_TYPE } from "./Plinko.MusicCtrller";

@ccclass
export default class PlinkoDetailedHistory extends cc.Component {
  public static instance: PlinkoDetailedHistory = null;
  @property(cc.Node)
  public payOut: cc.Node = null;
  @property(cc.Node)
  public moneyBet: cc.Node = null;
  @property(cc.Node)
  public goal: cc.Node = null;

  @property(cc.Node)
  public dateTime: cc.Node = null;
  @property(cc.Sprite)
  public profitHistory: cc.Sprite = null;
  @property(cc.SpriteFrame)
  public winLoss: cc.SpriteFrame[] = [];
  // LIFE-CYCLE CALLBACKS:
  onLoad() {
    PlinkoDetailedHistory.instance = this;
  }

  public initHistoryDetails(obj) {
    this.dateTime.getComponent(cc.Label).string = obj.time.toString();
    this.payOut.getComponent(cc.Label).string = obj.payout.toString();
    if (obj.payout < 0) {
      PlinkoMusicCtrler.instance.playType(PLINKO_SOUND_TYPE.LOSE)
      this.profitHistory.spriteFrame = this.winLoss[1];
      this.payOut.getComponent(cc.Label).string = PlinkoCommon.numberWithCommas(obj.payout).toString();
    } else {
      PlinkoMusicCtrler.instance.playType(PLINKO_SOUND_TYPE.WIN)
      this.profitHistory.spriteFrame = this.winLoss[0];
      this.payOut.getComponent(cc.Label).string = "+" + PlinkoCommon.numberWithCommas(obj.payout).toString();
    }
    this.goal.getComponent(cc.Label).string = obj.goal.toString() + "x";
    this.moneyBet.getComponent(cc.Label).string = PlinkoCommon.numberWithCommas(obj.moneyBet).toString();
  }

  closeWindow() {
    this.node.removeFromParent();
  }
}
