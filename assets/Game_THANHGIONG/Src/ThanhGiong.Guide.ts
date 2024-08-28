import ThanhGiongSoundController, {
  SLOT_SOUND_TYPE,
} from "./ThanhGiong.SoundController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ThanhGiongGuide extends cc.Component {
  public static instance: ThanhGiongGuide = null;

  @property(cc.Node)
  guideContent: cc.Node = null;
  @property(cc.PageView)
  pageView: cc.PageView = null;
  @property(cc.Node)
  rightBtn: cc.Node = null;
  @property(cc.Node)
  leftBtn: cc.Node = null;
  @property(cc.Node)
  backBtn: cc.Node = null;
  @property(cc.Label)
  testLbl: cc.Label = null;

  currentPage: number = 0;

  onEnable(): void {
    this.currentPage = 0;
    //   this.leftBtn.active = false;
    //   this.rightBtn.active = true;
  }

  onLoad(): void {
    ThanhGiongGuide.instance = this;
    this.currentPage = 0;
    cc.log(this.pageView.getCurrentPageIndex());
    this.testLbl.string = this.pageView.getCurrentPageIndex().toString();
  }

  changePage(event, idx) {
      ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.rightBtn.active = true;
    this.leftBtn.active = true;
    this.rightBtn.getComponent(cc.Button).interactable = false;
    this.leftBtn.getComponent(cc.Button).interactable = false;
    this.currentPage += Number(idx);
    this.pageView.setCurrentPageIndex(this.currentPage);
    if (this.currentPage == 2) {
      this.rightBtn.active = false;
      this.rightBtn.getComponent(cc.Button).interactable = false;
    } else if (this.currentPage == 0) {
      this.leftBtn.active = false;
      this.leftBtn.getComponent(cc.Button).interactable = false;
    }
  }

  backToGame() {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    cc.tween(this.node)
      .to(0.5, { opacity: 0 })
      .call(() => {
        this.node.active = false;
      })
      .start();
  }

  callbackTurn() {
    this.currentPage = this.pageView.getCurrentPageIndex();
    cc.log(this.currentPage);
    this.rightBtn.active = true;
    this.leftBtn.active = true;
    if (this.currentPage == 2) {
      this.rightBtn.active = false;
      // this.rightBtn.getComponent(cc.Button).interactable = false;
    } else if (this.currentPage == 0) {
      this.leftBtn.active = false;
      // this.leftBtn.getComponent(cc.Button).interactable = false;
    }
  }
}
