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

  private currentPage: number = 0;

  onEnable(): void {
    this.currentPage = 0;
    this.pageView.setCurrentPageIndex(this.currentPage);
    this.leftBtn.active = false;
    this.rightBtn.active = true;
  }

  onLoad(): void {
    ThanhGiongGuide.instance = this;
    this.currentPage = 0;
    this.pageView.setCurrentPageIndex(0);
    this.guideContent.setPosition(-960, 0, 0);
  }

  changePage(event, idx) {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.rightBtn.active = true;
    this.leftBtn.active = true;
    this.rightBtn.getComponent(cc.Button).interactable = true;
    this.leftBtn.getComponent(cc.Button).interactable = true;
    this.currentPage += Number(idx);
    this.pageView.setCurrentPageIndex(this.currentPage);
    if (this.currentPage == 4) {
      this.rightBtn.active = false;
      this.rightBtn.getComponent(cc.Button).interactable = false;
    } else if (this.currentPage == 0) {
      this.leftBtn.active = false;
      this.leftBtn.getComponent(cc.Button).interactable = false;
    }
  }

  backToGame() {
    ThanhGiongSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.node.active = false;
  }

  callbackTurn() {
    this.currentPage = this.pageView.getCurrentPageIndex();
    this.rightBtn.active = true;
    this.leftBtn.active = true;
    this.rightBtn.getComponent(cc.Button).interactable = true;
    this.leftBtn.getComponent(cc.Button).interactable = true;
    if (this.currentPage == 4) {
      this.rightBtn.active = false;
      this.rightBtn.getComponent(cc.Button).interactable = false;
    } else if (this.currentPage == 0) {
      this.leftBtn.active = false;
      this.leftBtn.getComponent(cc.Button).interactable = false;
    }
  }
}
