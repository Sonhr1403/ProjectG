import SlotAstrosController from "./SlotAstros.Controller";
import SlotAstrosMusicManager, { SLOT_SOUND_TYPE } from "./SlotAstros.Music";
import SlotAstrosMachine from "./SlotAstros.SlotMachine";
import SlotAstrosMachineBonus from "./SlotAstros.SlotMachineBonus";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotAstrosBonus extends cc.Component {
  public static instance: SlotAstrosBonus = null;
  @property(cc.Node)
  private xBonus: cc.Node = null;

  @property(cc.Node)
  private frame: cc.Node = null;

  @property(cc.Node)
  private slotMachine: cc.Node = null;

  @property(cc.Node)
  private sandAnim: cc.Node = null;

  @property(cc.Node)
  private btnStart: cc.Node = null;

  @property(cc.Node)
  private ray: cc.Node = null;

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    SlotAstrosBonus.instance = this;
  }

  public onOpen() {
    cc.tween(this.node).to(0.5, { opacity: 255 }).start();
    this.sandAnim.active = true;
    this.btnStart.active = true;
    this.ray.width = 0;
    this.ray.active = false;
    this.xBonus.active = false;
    this.frame.height = 0;
    this.frame.active = false;
    this.slotMachine.active = false;
    SlotAstrosMusicManager.instance.playLoop(SLOT_SOUND_TYPE.FSLOOP);
  }

  public onClickStart() {
    SlotAstrosMusicManager.instance.stopLoop();
    SlotAstrosMusicManager.instance.playType(SLOT_SOUND_TYPE.FSSTARTX2, 2);

    this.btnStart.active = false;
    this.xBonus.active = true;
    this.xBonus.getChildByName("Lbl").getComponent(cc.Label).string = "";
    this.xBonus.setPosition(cc.v2(0, 125));
    this.ray.active = true;
    cc.tween(this.ray).to(0.5 , {width: 1300}).start();
    SlotAstrosMachine.instance.bonusAnim();
    this.scheduleOnce(() => {
      cc.tween(this.xBonus)
        .to(0.5, { position: cc.v3(0, -70, 0), scale: 1.8 })
        .call(() => {
          this.scheduleOnce(() => {
            this.xBonus.active = false;
            this.scheduleOnce(() => {
              this.xBonus.active = true;
              this.xBonus.setPosition(420, 280);
              this.xBonus.scale = 1.2;
              this.frame.active = true;
              cc.tween(this.frame).to(0.5, {height: 260}).call(()=>{
                this.slotMachine.active = true;
              }).start();
              this.scheduleOnce(() => {
                this.slotMachine
                  .getComponent(SlotAstrosMachineBonus)
                  .startSpinVirtual();
                this.scheduleOnce(() => {
                  SlotAstrosMachineBonus.instance.letGo(
                    SlotAstrosController.instance.localRes5004.freeGame
                  );
                }, 0);
              }, 2);
            }, 0.5);
          }, 1);
        })
        .start();
    }, 2);
  }

  public xBonusAnim() {
    this.increaseMulti();
    cc.tween(this.xBonus)
      .to(0.25, { scale: 1.2 })
      .call(() => {
        cc.tween(this.xBonus).to(0.25, { scale: 1 }).start();
      })
      .start();
  }

  private increaseMulti() {
    let str = "";
    switch (this.xBonus.getChildByName("Lbl").getComponent(cc.Label).string) {
      case "":
        str = "1x";
        break;

      case "1x":
        str = "2x";
        break;

      case "2x":
        str = "3x";
        break;

      case "3x":
        str = "4x";
        break;

      case "4x":
        str = "5x";
        break;

      default:
        break;
    }
    this.xBonus.getChildByName("Lbl").getComponent(cc.Label).string = str;
  }

  public onClose() {
    cc.tween(this.node)
      .to(0.5, { opacity: 0 })
      .call(() => {
        this.xBonus.getChildByName("Lbl").getComponent(cc.Label).string = "";
        SlotAstrosMachineBonus.instance.reset();
        this.node.active = false;
        SlotAstrosMachine.instance.openWin();
      })
      .start();
  }

  // update (dt) {}
}
