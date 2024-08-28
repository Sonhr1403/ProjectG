import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import SlotTTController from "./SlotTT.Controller";
import SlotTTMusicManager, { SLOT_SOUND_TYPE } from "./SlotTT.Music";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotTTInfo extends cc.Component {
  @property(cc.Node)
  private pageNode: cc.Node = null;

  @property(cc.Node)
  private dotNode: cc.Node = null;

  @property(cc.Button)
  private listBtn: cc.Button[] = [];

  @property(cc.SpriteFrame)
  private listSF: cc.SpriteFrame[] = [];

  @property(cc.Label)
  private listLabel: cc.Label[] = [];

  ////////////////////////////////////////////////////

  private page = 0;

  private listX = [-100, 0, 100];

  private currentPage: cc.Node = null;

  private listValue = [23.5, 7.25, 3.5, 2.25, 1, 0.625, 0.375, 0.25];

  // LIFE-CYCLE CALLBACKS:

  public onOpen() {
    this.node.active = true;
    cc.tween(this.node).to(0.25, { opacity: 255 }).start();
    this.page = 0;
    this.currentPage = this.pageNode.getChildByName(this.page.toString());
    this.pageNode
      .getChildByName(this.page.toString())
      .setPosition(cc.v2(this.listX[1], 0));
    this.pageNode.getChildByName(this.page.toString()).opacity = 255;
    this.changeDot(1);
    for (let i = 1; i < this.pageNode.childrenCount; i++) {
      let page = this.pageNode.getChildByName(i.toString());
      page.setPosition(cc.v2(this.listX[2], 0));
      page.opacity = 0;
    }
    this.updateLabel();
  }

  private updateLabel() {
    let bet =
      SlotTTController.instance.listBet[SlotTTController.instance.betOrdi];
    for (let i = 0; i < this.listLabel.length; i++) {
      this.listLabel[i].string = BGUI.Utils.formatMoneyWithCommaOnly(
        this.listValue[i] * bet
      );
    }
  }

  private close() {
    SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    cc.tween(this.node)
      .to(0.25, { opacity: 0 })
      .call(() => {
        this.node.active = false;
      })
      .start();
    this.changeDot(0);
  }

  private onClickLeft() {
    SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.page -= 1;
    // for (let btn of this.listBtn) {
    //   btn.interactable = false;
    // }
    cc.tween(this.pageNode.getChildByName(this.currentPage.name))
      .to(
        0.1,
        { position: cc.v3(this.listX[2], 0, 0), opacity: 0 },
        { easing: "" }
      )
      .start();
    this.changeDot(0);
    if (this.page < 0) {
      this.page = 5;
    }
    this.currentPage = this.pageNode.getChildByName(this.page.toString());
    this.changeDot(1);
    this.pageNode
      .getChildByName(this.currentPage.name)
      .setPosition(cc.v3(this.listX[0], 0, 0));
    this.scheduleOnce(() => {
      cc.tween(this.pageNode.getChildByName(this.currentPage.name))
        .to(
          0.1,
          { position: cc.v3(this.listX[1], 0, 0), opacity: 255 },
          { easing: "" }
        )
        .start();
    }, 0.05);
  }

  private onClickRight() {
    SlotTTMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.page += 1;
    cc.tween(this.pageNode.getChildByName(this.currentPage.name))
      .to(
        0.1,
        { position: cc.v3(this.listX[0], 0, 0), opacity: 0 },
        { easing: "" }
      )
      .start();
    this.changeDot(0);
    if (this.page > 5) {
      this.page = 0;
    }
    this.currentPage = this.pageNode.getChildByName(this.page.toString());
    this.changeDot(1);
    this.pageNode
      .getChildByName(this.currentPage.name)
      .setPosition(cc.v3(this.listX[2], 0, 0));
    this.scheduleOnce(() => {
      cc.tween(this.pageNode.getChildByName(this.currentPage.name))
        .to(
          0.1,
          { position: cc.v3(this.listX[1], 0, 0), opacity: 255 },
          { easing: "" }
        )
        .start();
    }, 0.05);
  }

  private changeDot(i: number) {
    this.dotNode
      .getChildByName(this.currentPage.name)
      .getComponent(cc.Sprite).spriteFrame = this.listSF[i];
  }
}
