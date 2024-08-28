import OPSlotMachine from "./OP.SlotMachine";
import OPCommon from "./OP.Common";
import OPSoundController, { SLOT_SOUND_TYPE } from "./OP.SoundController";
import OPController from "./OP.Controller";
import OPColumn from "./OP.Column";

export enum SLOT_CELL_TYPE {
  WILD = 0,
  TRIGGER_1 = 1,
  TRIGGER_2 = 2,
  SCATTER = 3,
  H1 = 4,
  H2 = 5,
  H3 = 6,
  H4 = 7,
  H5 = 8,
  H6 = 9,
  L1 = 10,
  L2 = 11,
  L3 = 12,
  L4 = 13,
  L5 = 14,
  L6 = 15,
}

const { ccclass, property } = cc._decorator;
@ccclass
export default class OPCell extends cc.Component {
  @property(sp.Skeleton)
  private spCharater: sp.Skeleton = null;
  // @property(sp.Skeleton)
  // private spCharaterWild: sp.Skeleton = null;
  @property(sp.Skeleton)
  private spFist: sp.Skeleton = null;
  @property(cc.Label)
  private fistNumber: cc.Label = null;
  // @property(cc.Sprite)
  // private sprCharater: cc.Sprite = null;
  @property(sp.Skeleton)
  private winGlow: sp.Skeleton = null;
  // @property(cc.Node)
  // private cellSkeleton: cc.Node = null;
  @property(cc.Node)
  private viewMask: cc.Node = null;
  private highlight: boolean = false;
  private winArray = [];
  private id: number = -1;
  private bingoNum: number = -1;
  private bingoActive: boolean = false;

  async onLoad(): Promise<void> {}

  async resetInEditor(): Promise<void> {
    return null;
  }

  async loadTextures(): Promise<boolean> {
    return null;
  }
  public resetCell() {
    this.changeAnimToIdle();
    this.spCharater.unscheduleAllCallbacks();
    this.winGlow.node.active = false;
    this.highlight = false;
    this.id = -1;
    this.bingoNum = -1;
    this.bingoActive = false;
    this.spCharater.setCompleteListener(() => {
      // cc.log("Done");
    });
  }

  public setResult(result) {
    let tempID = result.id - 1;
    this.id = result.id;
    this.highlight = result.highlight;
    this.winArray = result.arrayWin;
    if (result.id == 14) {
      this.bingoNum = result.bingoNum;
      if (result.bingoIndex != -1) {
        this.bingoActive = true;
      }
    }
    this.setTexture(tempID);
  }

  public hideTexture() {
    this.spCharater.node.active = false;
  }

  public setTexture(index: number): void {
    this.spFist.node.active = false;
    this.id = index;
    this.spCharater.node.active = true;
    this.spCharater.node.setScale(0.42, 0.42);
    if (index == 13) {
      this.spCharater.skeletonData = OPSlotMachine.instance.spCharacter[index];
      this.spCharater.node.active = false;
      this.spFist.node.active = true;
      this.fistNumber.node.active = true;
      this.fistNumber.string = OPCommon.minTwoDigits(this.bingoNum).toString();
    } else {
      if (index >= 8 && index < 13) {
        this.spCharater.skeletonData = OPSlotMachine.instance.spCharacter[8];
        let skinIndex = index - 7;
        this.spCharater.setSkin(skinIndex.toString());
      } else {
        this.spCharater.skeletonData =
          OPSlotMachine.instance.spCharacter[index];
        if (index == 0) {
          this.spCharater.node.setScale(0.5, 0.5);
        }
      }
    }
    this.changeAnimToIdle();
  }

  public setRandom(): void {
    let index = OPCommon.getRandomNumber(0, 12);
    // this.spCharaterWild.node.active = false;
    // let index = 0;
    this.id = index;
    this.spFist.node.active = false;
    // this.sprCharater.spriteFrame = OPSlotMachine.instance.sprCharacter[index];
    this.spCharater.node.active = true;

    this.spCharater.node.active = true;
    this.spCharater.node.setScale(0.42, 0.42);
    // this.spCharater.defaultSkin = "default";
    // if (index == 0) {
    // this.spCharater.node.active = true;
    // this.spCharaterWild.node.active = true;
    // this.spCharaterWild.setAnimation(1, "wild_short_default", true);
    // this.spCharater.animation = "Default"
    // } else
    if (index == 2) {
      this.spCharater.skeletonData = OPSlotMachine.instance.spCharacter[index];
      this.spCharater.node.active = false;
      // this.sprCharater.node.active = false;
      this.spFist.node.active = true;
      this.fistNumber.node.active = true;
      let tempNum = OPCommon.getRandomNumber(1, 99);
      this.fistNumber.string = OPCommon.minTwoDigits(tempNum).toString();
    } else {
      if (index > 7) {
        this.spCharater.skeletonData = OPSlotMachine.instance.spCharacter[8];
        let skinIndex = index - 7;
        this.spCharater.setSkin(skinIndex.toString());
      } else {
        this.spCharater.skeletonData =
          OPSlotMachine.instance.spCharacter[index];
        if (index == 0) {
          this.spCharater.node.setScale(0.5, 0.5);
        }
      }
    }
    this.changeAnimToIdle();
  }

  public setRandomWild(): void {
    let index = 0;
    this.spCharater.node.active = true;
    this.spFist.node.active = false;
    this.spCharater.skeletonData = OPSlotMachine.instance.spCharacter[index];
    this.spCharater.setAnimation(0, "default", true);
  }

  public changeAnimToIdle() {
    if (this.id == 14) {
      this.spFist.setAnimation(0, "default", true);
    } else if (this.id == 0) {
      this.spCharater.animation = "end_spin";
      this.spCharater.setCompleteListener(() => {
        if (this.spCharater.animation != "default") {
          this.spCharater.setAnimation(0, "default", true);
          this.spCharater.unscheduleAllCallbacks();
        }
      });
    } else {
      this.spCharater.setAnimation(0, "default", true);
    }
    this.winGlow.node.active = false;
  }

  public changeAnimToIdleWin() {
    let arr = OPSlotMachine.instance.getLineWins();
    cc.log(this.highlight, this.winArray)
    if (
      this.highlight == true &&
      this.winArray.indexOf(OPSlotMachine.instance.currentWinIndex) > -1
    ) {
      if (OPSlotMachine.instance.type != 3) {
        let node = this.node.parent.parent.parent.getComponent(OPColumn);
        if (node.getLongWildActive()) {
          node.getLongWildActive();
        } else {
          this.winGlow.node.active = true;
          this.winGlow.animation = "default";
          this.spCharater.setAnimation(0, "active", true);
        }
      } else {
      }
    } else {
      this.changeAnimToIdle();
    }
  }

  public changeAnimToWin() {
    if (this.highlight == true) {
      let node = this.node.parent.parent.parent.getComponent(OPColumn);
      if (node.getLongWildActive()) {
        node.getLongWildActive();
      } else {
        this.spCharater.setAnimation(0, "active", true);
        this.winGlow.node.active = true;
        this.winGlow.animation = "default";
      }
    }
  }

  public changeAnimToScatter() {
    if (this.id == 1) {
      this.spCharater.setAnimation(0, "active", false);
      this.node.zIndex = 4;
    }
  }

  public toggleWinEffects() {
    if (this.highlight == true) {
      this.spCharater.setAnimation(0, "active", false);
      this.winGlow.node.active = true;
      this.winGlow.animation = "default";
    }
  }

  public punchCell() {
    if (this.id == 14 && this.bingoActive == true) {
      this.scheduleOnce(() => {
        cc.tween(this.fistNumber.node).to(0.1, { opacity: 0 }).start();
      }, 0.65);
      this.spFist.setAnimation(0, "active", false);
      this.spFist.setCompleteListener(() => {
        this.spFist.node.active = false;
      });
    }
  }

  protected update(dt: number): void {
    if (this.node.position.y >= 385 || this.node.position.y <= -385) {
      this.viewMask.width = 0;
      this.viewMask.height = 0;
    } else {
      this.viewMask.width = 500;
      this.viewMask.height = 500;
    }
  }
}
