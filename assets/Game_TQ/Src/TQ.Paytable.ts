import TQMain from "./TQ.Controller";
import TQSoundController, { SLOT_SOUND_TYPE } from "./TQ.SoundController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TQGuide extends cc.Component {
  public static instance: TQGuide = null;

  @property(cc.Node)
  private guideContent: cc.Node = null;
  @property(cc.Node)
  private rightBtn: cc.Node = null;
  @property(cc.Node)
  private leftBtn: cc.Node = null;
  @property(cc.Node)
  private backBtn: cc.Node = null;

  private currentPage: number = 0;
  private framePosArrayX = [0, 1920, 3840, 5760, 7680, 9600];

  onEnable(): void {
    this.guideContent.getComponent(cc.Layout).enabled = true;
    this.currentPage = 0;
    this.framePosArrayX = [];
    this.leftBtn.active = false;
    this.rightBtn.active = true;
    let width = this.guideContent.children[1].width;
    for (let i = 0; i < this.guideContent.children.length; i++) {
      let posX = width * i;
      this.framePosArrayX.push(posX);
      this.guideContent.children[i].setPosition(this.framePosArrayX[i], 0);
    }
  }

  onLoad(): void {
    TQGuide.instance = this;
    this.currentPage = 0;
  }

  changePage(event, idx) {
    this.guideContent.getComponent(cc.Layout).enabled = false;
    if (TQSoundController.instance.getSystemVolume() > 0) {
      TQSoundController.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    }
    this.rightBtn.active = true;
    this.leftBtn.active = true;
    this.rightBtn.getComponent(cc.Button).interactable = false;
    this.leftBtn.getComponent(cc.Button).interactable = false;
    this.currentPage += Number(idx);
    if (this.currentPage == 5) {
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
    this.guideContent.getComponent(cc.Layout).enabled = true;
    this.node.active = false;
  }
}
