import { SlotCmd } from "./SongKran.Cmd";
import SongKranController from "./SongKran.Controller";
import SongKranMusicManager, {
  SLOT_MUSIC_TYPE,
  SLOT_SOUND_TYPE,
} from "./SongKran.Music";
import SongKranMachine from "./SongKran.SlotMachine";
import SongKranNumericalHelper from "./SongKran.UINumericalHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SongKranFreeGame extends cc.Component {
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
    SongKranMusicManager.instance.playType(
      SLOT_SOUND_TYPE.TRANSITIONTOFREE
    );
    this.spineTransition.node.active = true;
    this.spineTransition.setAnimation(0, "start", false);
    this.spineTransition.setCompleteListener(()=>{
      this.spineTransition.node.active = false;
    })
    this.scheduleOnce(() => {
      SongKranController.instance.changeBG(1);
      SongKranMusicManager.instance.playSlotMusic(SLOT_MUSIC_TYPE.FREEGAME_BGM);
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
    SongKranMusicManager.instance.playType(SLOT_SOUND_TYPE.WINSUMMARY_1);
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
    SongKranNumericalHelper.scheduleForLabel(this.resultLbl, winNum, 4);
    this.scheduleOnce(() => {
      SongKranMusicManager.instance.playType(
        SLOT_SOUND_TYPE.TRANSITIONTOFREE
      );
      this.spineTransition.node.active = true;
      this.spineTransition.setAnimation(0, "start", false);
      this.spineTransition.setCompleteListener(()=>{
        this.spineTransition.node.active = false;
        this.node.active = false;
      })
      this.scheduleOnce(() => {
        this.bubble.active = false;
        this.countSpr.active = false;
        this.board.setPosition(0, 1000);
        this.girl.setPosition(-1500, -330);
        this.result.active = false;
        this.isStarted = false;
        SongKranController.instance.changeBG(0);
        SongKranMusicManager.instance.playSlotMusic(
          SLOT_MUSIC_TYPE.BASEGAME_BGM
        );
        SongKranController.instance.checkAutoSpin();
      }, 0.5);
    }, 5);
  }
}
