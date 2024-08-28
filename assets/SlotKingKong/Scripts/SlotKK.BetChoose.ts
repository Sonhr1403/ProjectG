import SlotKKController from "./SlotKK.Controller";
import SlotKKMusicManager, { SLOT_SOUND_TYPE } from "./SlotKK.Music";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotKKBetChoose extends cc.Component {
  @property(cc.Prefab)
  public item: cc.Prefab = null;

  @property(cc.Node)
  public container: cc.Node = null;

  private currentItem: cc.Node = null;

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.container.removeAllChildren();
    for (let i = 0; i < SlotKKController.instance.listBet.length; i++) {
      let item = cc.instantiate(this.item);
      item
        .getChildByName("Background")
        .getChildByName("Label")
        .getComponent(cc.Label).string = BGUI.Utils.formatMoneyWithCommaOnly(
        SlotKKController.instance.listBet[i]
      );
      item
        .getChildByName("Background")
        .getChildByName("index")
        .getComponent(cc.Label).string = i.toString();
      this.container.addChild(item);
      item.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }
  }

  public onOpen() {
    this.checkCurrentItem();
    for (let i = 0; i < this.container.childrenCount; i++) {
      this.container.children[i].on(
        cc.Node.EventType.TOUCH_END,
        this.onClick,
        this
      );
    }
    cc.tween(this.container)
      .to(0.3, { position: cc.v3(0, 0, 0) })
      .start();
  }

  public checkCurrentItem() {
    if (this.currentItem) {
      this.currentItem.getComponent(cc.Button).normalColor = cc.color(
        0,
        0,
        0,
        210
      );
      this.currentItem.getComponent(cc.Button).pressedColor = cc.color(
        0,
        0,
        0,
        210
      );
      this.currentItem.getComponent(cc.Button).hoverColor = cc.color(
        80,
        80,
        80,
        200
      );
      this.currentItem.getComponent(cc.Button).disabledColor = cc.color(
        0,
        0,
        0,
        210
      );
      this.currentItem.getChildByName("frame").active = false;
    }
    let i = SlotKKController.instance.betAmount;
    this.currentItem = this.container.children[i];
    this.currentItem.getComponent(cc.Button).normalColor = cc.color(
      145,
      145,
      145,
      200
    );
    this.currentItem.getComponent(cc.Button).pressedColor = cc.color(
      145,
      145,
      145,
      200
    );
    this.currentItem.getComponent(cc.Button).hoverColor = cc.color(
      145,
      145,
      145,
      200
    );
    this.currentItem.getComponent(cc.Button).disabledColor = cc.color(
      145,
      145,
      145,
      200
    );
    this.currentItem.getChildByName("frame").active = true;
  }

  private onClick(event) {
    SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    if (event.currentTarget) {
      SlotKKController.instance.betAmount = parseInt(
        event.currentTarget
          .getChildByName("Background")
          .getChildByName("index")
          .getComponent(cc.Label).string
      );
      SlotKKController.instance.updateAllBet();
      this.checkCurrentItem();
      for (let i = 0; i < this.container.childrenCount; i++) {
        this.container.children[i].off(
          cc.Node.EventType.TOUCH_END,
          this.onClick,
          this
        );
      }

      this.scheduleOnce(() => {
        SlotKKController.instance.onClickBetChoose();
      }, 0.5);
    }
  }

  public onClose() {
    cc.tween(this.container)
      .to(0.3, { position: cc.v3(0, -260, 0) })
      .start();
  }
}
