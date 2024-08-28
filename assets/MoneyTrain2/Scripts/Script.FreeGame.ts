import MoneyTrain2Controller from "./Script.Controller";
import MoneyTrain2MusicManager, {
  SLOT_MUSIC_TYPE,
  SLOT_SOUND_TYPE,
} from "./Script.Music";
import MoneyTrain2NumericalHelper from "./Script.UINumericalHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MoneyTrain2FreeGame extends cc.Component {
  @property(sp.Skeleton)
  private spineTransition: sp.Skeleton = null;

  @property(cc.Node)
  private countSpr: cc.Node = null;

  @property(cc.Label)
  private countLbl: cc.Label = null;

  @property(cc.Node)
  private result: cc.Node = null;

  @property(cc.Node)
  private board: cc.Node = null;

  @property(cc.Node)
  private girl: cc.Node = null;

  @property(cc.Node)
  private bubble: cc.Node = null;

  @property(cc.Label)
  private resultLbl: cc.Label = null;

  @property(cc.Label)
  private totalLbl: cc.Label = null;

  private round: number = 0;
  private totalRound: number = 0;

  private isStarted: boolean = false;

  public getIsStarted() {
    return this.isStarted;
  }

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  public onOpen(totalRound: number, currentRound: number) {
    this.isStarted = true;
    this.round = 0;
    this.totalRound = totalRound;

    this.node.active = true;
    this.spineTransition.node.active = true;
    MoneyTrain2MusicManager.instance.playSlotMusic(SLOT_SOUND_TYPE.TRANSITIONTOFREE);
    this.spineTransition.setAnimation(0, "start", false);
    this.scheduleOnce(() => {
      MoneyTrain2Controller.instance.changeBG(1);
      MoneyTrain2MusicManager.instance.playSlotMusic(SLOT_MUSIC_TYPE.FREEGAME_BGM);
      this.spineTransition.node.active = false;
      this.countSpr.active = true;
      this.updateRound(currentRound);
    }, 0.5);
  }

  public updateRound(num: number) {
    this.round = num;
    this.countLbl.string = this.round + "/" + this.totalRound;
  }

  public endFreeGame(winNum: number) {
    MoneyTrain2MusicManager.instance.playSlotMusic(SLOT_SOUND_TYPE.WINSUMMARY_1);
    this.result.active = true;
    this.resultLbl.string = "0";
    this.totalLbl.string = this.totalRound.toString();
    cc.tween(this.board)
      .to(0.5, { position: cc.v3(0, 0, 0) }, { easing: "smooth" })
      .start();
    cc.tween(this.girl)
      .to(0.5, { position: cc.v3(-725, -330, 0) }, { easing: "smooth" })
      .start();
    this.bubble.active = true;
    MoneyTrain2NumericalHelper.scheduleForLabel(this.resultLbl, winNum, 4);
    this.scheduleOnce(() => {
      this.spineTransition.node.active = true;
    MoneyTrain2MusicManager.instance.playSlotMusic(SLOT_SOUND_TYPE.TRANSITIONTOFREE);
      this.spineTransition.setAnimation(0, "start", false);
      this.scheduleOnce(() => {
        this.bubble.active = false;
        this.countSpr.active = false;
        this.board.setPosition(0, 1000);
        this.girl.setPosition(-1500, -330);
        this.spineTransition.node.active = false;
        this.result.active = false;
        this.isStarted = false;
        MoneyTrain2Controller.instance.changeBG(0);
        this.node.active = false;
        MoneyTrain2MusicManager.instance.playSlotMusic(
          SLOT_MUSIC_TYPE.BASEGAME_BGM
        );
      }, 0.5);
    }, 5);
  }
}
