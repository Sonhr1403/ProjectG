import { SlotCmd } from "./SlotKK.Cmd";
import SlotKKController from "./SlotKK.Controller";
import SlotKKMusicManager, {
  SLOT_MUSIC_TYPE,
  SLOT_SOUND_TYPE,
} from "./SlotKK.Music";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotKKFreeGame extends cc.Component {
  @property(cc.Node)
  public container: cc.Node = null;

  @property(cc.SpriteFrame)
  public freeSpinNums: cc.SpriteFrame[] = [];

  @property(cc.SpriteFrame)
  public btnBG: cc.SpriteFrame[] = [];

  @property(cc.Sprite)
  public sfNumFreeSpin: cc.Sprite[] = [];

  @property(cc.Sprite)
  public sfNumMulti: cc.Sprite[] = [];

  private currentPick: cc.Node = null;
  public idPick: string = "";
  ////////////////////////////////////////////////////////

  public onClick(event, id) {
    SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.FREE_GAME_SELECTION);
    this.idPick = id;
    if (id !== "0") {
      this.currentPick = this.container.children[parseInt(id) - 1];
      this.currentPick.getComponent(cc.Sprite).spriteFrame = this.btnBG[1];
      this.onClose();
    } else {
      this.currentPick = this.container.children[3];
    }
    SlotKKController.instance.getFreeGame = false;
    SlotCmd.Send.sendSelectFreeGame(parseInt(id));
  }

  public onOpen() {
    SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.TRIGGER_DROP);
    cc.tween(this.node)
      .to(1, { position: cc.v3(0, 0, 0) }, { easing: "backOut" })
      .start();
    switch (SlotKKController.instance.scatterCount) {
      case 4:
        this.sfNumFreeSpin[0].spriteFrame = this.freeSpinNums[6];
        this.sfNumFreeSpin[1].spriteFrame = this.freeSpinNums[3];
        this.sfNumFreeSpin[2].spriteFrame = this.freeSpinNums[0];
        break;

      case 5:
        this.sfNumFreeSpin[0].spriteFrame = this.freeSpinNums[7];
        this.sfNumFreeSpin[1].spriteFrame = this.freeSpinNums[4];
        this.sfNumFreeSpin[2].spriteFrame = this.freeSpinNums[1];
        break;

      case 6:
        this.sfNumFreeSpin[0].spriteFrame = this.freeSpinNums[8];
        this.sfNumFreeSpin[1].spriteFrame = this.freeSpinNums[5];
        this.sfNumFreeSpin[2].spriteFrame = this.freeSpinNums[2];
        break;
    }
  }

  public changeRandom(opt: number) {
    this.currentPick.getChildByName("sprite").active = false;
    this.currentPick.getChildByName("skeleton").active = true;
    this.currentPick
      .getChildByName("skeleton")
      .getComponent(sp.Skeleton)
      .setAnimation(0, "enter", false);
    this.scheduleOnce(() => {
      this.sfNumFreeSpin[3].node.active = true;
      this.sfNumMulti[3].node.active = true;
      switch (opt) {
        case 1:
          this.sfNumFreeSpin[3].spriteFrame = this.sfNumFreeSpin[0].spriteFrame;
          this.sfNumMulti[3].spriteFrame = this.sfNumMulti[0].spriteFrame;
          break;

        case 2:
          this.sfNumFreeSpin[3].spriteFrame = this.sfNumFreeSpin[1].spriteFrame;
          this.sfNumMulti[3].spriteFrame = this.sfNumMulti[1].spriteFrame;
          break;

        case 3:
          this.sfNumFreeSpin[3].spriteFrame = this.sfNumFreeSpin[2].spriteFrame;
          this.sfNumMulti[3].spriteFrame = this.sfNumMulti[2].spriteFrame;
          break;
      }
    }, 0.5);
  }

  public onClose() {
    cc.tween(this.node)
      .to(1, { position: cc.v3(0, 3000, 0) }, { easing: "backIn" })
      .start();
    SlotKKController.instance.openFreeGameLbl();
    SlotKKMusicManager.instance.playSlotMusic(SLOT_MUSIC_TYPE.FREEGAME_MUSIC);
    this.scheduleOnce(() => {
      if (this.idPick !== "0") {
        this.currentPick.getComponent(cc.Sprite).spriteFrame = this.btnBG[0];
      } else {
        this.currentPick.getChildByName("sprite").active = true;
        this.currentPick.getChildByName("skeleton").active = false;
        this.sfNumFreeSpin[3].node.active = false;
        this.sfNumMulti[3].node.active = false;
      }
    }, 0.8);
  }
}
