import GenZMain from "./GZ.Controller";
import Bet from "./GZ.BetOptions";
import GenZCommon from "./GZ.Common";
import { GenZCmd } from "./GZ.Cmd";


const { ccclass, property } = cc._decorator;

@ccclass
export default class BetOptions extends cc.Component {
  public static instance: BetOptions = null;

  @property(cc.Label)
  balanceValue: cc.Label = null;
  private value: number = 0


  onLoad() {
    BetOptions.instance = this;
  }
  initItem(info, chosen = false) {
    this.balanceValue.string = GenZCommon.numberWithCommas(info).toString();
    this.value = info
    if (chosen == false) {
      this.node.children[0].active = false;
    } else {
      this.node.children[1].active = false;
    }
  }

  changeBet() {
    GenZMain.instance.betValue.string = GenZCommon.numberWithCommas( 
      this.balanceValue.string
    );
    GenZMain.instance.currentBetLV = this.value

    Bet.instance.deactivatebetOptions();  
    GenZCmd.Send.sendSlotJoinGame(this.value);
  }

}
