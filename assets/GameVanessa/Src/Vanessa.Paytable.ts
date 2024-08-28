// import VanessaSoundController, { SLOT_SOUND_TYPE } from "./Vanessa.SoundController";

import VanessaSoundController, {
  SLOT_SOUND_TYPE,
} from "./Vanessa.SoundController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VanessaGuide extends cc.Component {
  public static instance: VanessaGuide = null;

  @property(cc.Node)
  guideContent: cc.Node = null;
  @property(cc.Node)
  rightBtn: cc.Node = null;
  @property(cc.Node)
  leftBtn: cc.Node = null;
  @property(cc.Node)
  backBtn: cc.Node = null;

  currentPage: number = 0;
  framePosArrayX = [0, 1920, 3840, 5760, 7680];

  onEnable(): void {
    this.guideContent.getComponent(cc.Layout).enabled = true;
    this.currentPage = 0;
    for (let i = 0; i < this.guideContent.children.length; i++) {
      this.guideContent.children[i].setPosition(this.framePosArrayX[i], 0);
    }
    this.leftBtn.active = false;
    this.rightBtn.active = true;
  }

  onLoad(): void {
    VanessaGuide.instance = this;
    this.currentPage = 0;
  }

  changePage(event, idx) {
    this.guideContent.getComponent(cc.Layout).enabled = false;

    VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);

    this.rightBtn.active = true;
    this.leftBtn.active = true;
    this.rightBtn.getComponent(cc.Button).interactable = false;
    this.leftBtn.getComponent(cc.Button).interactable = false;
    this.currentPage += Number(idx);
    if (this.currentPage == 4) {
      this.rightBtn.active = false;
      this.rightBtn.getComponent(cc.Button).interactable = false;
    } else if (this.currentPage == 0) {
      this.leftBtn.active = false;
      this.leftBtn.getComponent(cc.Button).interactable = false;
    }

    var moveDistance;
    if (Number(idx) == 1) {
      moveDistance = cc.v3(-1920, 0, 0);
    } else if (Number(idx) == -1) {
      moveDistance = cc.v3(1920, 0, 0);
    }

    for (let i = 0; i < this.guideContent.children.length; i++) {
      cc.tween(this.guideContent.children[i])
        .by(0.4, {
          position: cc.v3(
            Number(idx) == 1
              ? -this.guideContent.children[i].width
              : this.guideContent.children[i].width,
            0,
            0
          ),
        })
        .call(() => {
          this.rightBtn.getComponent(cc.Button).interactable = true;
          this.leftBtn.getComponent(cc.Button).interactable = true;
        })
        .start();
    }
  }

  backToGame() {
    VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.guideContent.getComponent(cc.Layout).enabled = true;
    this.node.active = false;
  }
}
