import OPSoundController, { SLOT_SOUND_TYPE } from "./OP.SoundController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class OPGuide extends cc.Component {
  public static instance: OPGuide = null;

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
  //   @property(cc.Label)
  //   testLbl: cc.Label = null;

  currentPage: number = 0;

  onEnable(): void {
    this.currentPage = 0;
    this.pageView.setCurrentPageIndex(this.currentPage);
    this.leftBtn.active = false;
    this.leftBtn.getComponent(cc.Button).interactable = false;
  }

  onLoad(): void {
    OPGuide.instance = this;
    this.currentPage = 0;
    this.pageView.setCurrentPageIndex(this.currentPage);
    // this.testLbl.string = this.pageView.getCurrentPageIndex().toString();
  }

  changePage(event, idx) {
    //   OPSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.rightBtn.active = true;
    this.leftBtn.active = true;
    this.rightBtn.getComponent(cc.Button).interactable = false;
    this.leftBtn.getComponent(cc.Button).interactable = false;
    this.currentPage += Number(idx);
    this.pageView.setCurrentPageIndex(this.currentPage);
    if (this.currentPage == 8) {
      this.rightBtn.active = false;
      this.rightBtn.getComponent(cc.Button).interactable = false;
    } else if (this.currentPage == 0) {
      this.leftBtn.active = false;
      this.leftBtn.getComponent(cc.Button).interactable = false;
    }

    cc.tween(this.guideContent)
      //   .by(0.3, {
      //     position: cc.v3(
      //       Number(idx) == 1
      //         ? -this.guideContent.children[1].width
      //         : this.guideContent.children[1].width,
      //       0,
      //       0
      //     ),
      //   })
      .delay(0.3)
      .call(() => {
        this.rightBtn.getComponent(cc.Button).interactable = true;
        this.leftBtn.getComponent(cc.Button).interactable = true;
      })
      .start();
  }

  backToGame() {
    OPSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    cc.tween(this.node)
      .to(0.4, { opacity: 0 })
      .call(() => {
        this.node.active = false;
      })
      .start();
  }

  callbackTurn() {
    this.currentPage = this.pageView.getCurrentPageIndex();
    this.rightBtn.active = true;
    this.leftBtn.active = true;
    if (this.currentPage == 8) {
      this.rightBtn.active = false;
      // this.rightBtn.getComponent(cc.Button).interactable = false;
    } else if (this.currentPage == 0) {
      this.leftBtn.active = false;
      // this.leftBtn.getComponent(cc.Button).interactable = false;
    }
  }
}
