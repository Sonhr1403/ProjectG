import ThanhGiongCommon from "./ThanhGiong.Common";
import ThanhGiongController from "./ThanhGiong.Controller";
import ThanhGiongSlotMachine from "./ThanhGiong.SlotMachine";
import ThanhGiongSoundController, {
  SLOT_SOUND_TYPE,
} from "./ThanhGiong.SoundController";
const { ccclass, property } = cc._decorator;

@ccclass
export default class ThanhGiongCell extends cc.Component {
  @property(sp.Skeleton)
  private spCharacter: sp.Skeleton = null;
  @property(sp.Skeleton)
  private spCharacterWild: sp.Skeleton = null;
  @property(sp.Skeleton)
  private spCharacterScatter: sp.Skeleton = null;
  @property(cc.Sprite)
  private sprCharacter: cc.Sprite = null;
  @property(cc.Sprite)
  private valueCharacter: cc.Sprite = null;
  @property(sp.Skeleton)
  private boosterRing: sp.Skeleton = null;
  @property(cc.Node)
  private viewMask: cc.Node = null;
  private winArray = [];
  private id: number = -1;
  private boosterId: number = -1;
  private animationWin = [
    "wild_win",
    "scatter_win",
    "hp-footprint-win",
    "hp-helmet-win",
    "hp-feast-win",
    "hp-bamboo-win",
    "lp-k-win",
    "lp-q-win",
    "lp-j-win",
    "lp-10-win",
  ];

  private scaleX = [
    1.5, // WILD
    1.7, // SCATTER
    1.3, // bamboo
    1.3, // Feast
    1.3, // footprint
    1.3, // helmet
    0.9, // K
    0.8, // Q
    0.6, // J
    0.9, // 10
    1.45, //Booster
  ];
  private scaleY = [
    1.8, // WILD
    1.9, // SCATTER
    1.4, // bamboo
    1.4, // Feast
    1.4, // footprint
    1.4, // helmet
    1, // K
    1.1, // Q
    0.9, // J
    1, // 10
    1.45, //Booster
  ];
  private numberSize = [
    { width: 52, height: 41 }, //25
    { width: 52, height: 41 }, //50
    { width: 52, height: 41 }, //75
    { width: 67, height: 41 }, //100
    { width: 67, height: 41 }, //125
    { width: 70, height: 41 }, //250
    { width: 69, height: 41 }, //375
    { width: 70, height: 41 }, //750
    { width: 98, height: 41 }, //2000
    { width: 98, height: 41 }, //2500
    { width: 98, height: 41 }, //3750
    { width: 96, height: 41 }, //6250
    { width: 67, height: 35 }, //Mini
    { width: 90, height: 35 }, //Minor
    { width: 96, height: 35 }, //Major
    { width: 81, height: 35 }, //Mega
  ];

  async onLoad(): Promise<void> {}

  async resetInEditor(): Promise<void> {
    return null;
  }

  async loadTextures(): Promise<boolean> {
    return null;
  }
  public resetCell() {
    this.spCharacter.unscheduleAllCallbacks();
    this.spCharacter.node.active = false;

    if (!ThanhGiongController.instance.getBoosterState()) {
      this.node.opacity = 255;
    }
    this.sprCharacter.node.active = true;
    this.id = -1;
    this.boosterId = -1;
    this.boosterRing.node.active = false;
    this.spCharacter.node.color = cc.color(255, 255, 255);
    this.sprCharacter.node.color = cc.color(255, 255, 255);
    this.spCharacterWild.node.color = cc.color(255, 255, 255);
    this.spCharacterScatter.node.color = cc.color(255, 255, 255);
  }

  public setResult(result) {
    this.id = result.id;
    if (!ThanhGiongController.instance.getBoosterState()) {
      this.winArray = result.arrayWin;
    }
    this.sprCharacter.node.active = true;
    this.sprCharacter.node.setPosition(-6.265, -6.887);
    this.spCharacter.unscheduleAllCallbacks();
    this.sprCharacter.node.setScale(
      this.scaleX[result.id],
      this.scaleY[result.id]
    );
    this.spCharacter.node.setScale(1.4, 1.4);
    this.boosterId = result.booster;
    this.setTexture(result.id);
  }

  public setTexture(index: number): void {
    if (index > 1) {
      this.spCharacter.node.active = false;
    }
    this.sprCharacter.spriteFrame =
      ThanhGiongSlotMachine.instance.spCharacter[index];
    if (index < 10) {
      this.spCharacter.node.active = true;
      this.spCharacter.animation = this.animationWin[this.id];
      this.spCharacter.node.active = false;
    }
    this.spCharacter.node.active = false;
    if (index === 0) {
      this.node.zIndex = 5;
      this.sprCharacter.node.setPosition(-2.783, 13.135);
      this.sprCharacter.node.active = false;
      this.spCharacterWild.node.active = true;
      this.spCharacterScatter.node.active = false;
      this.spCharacterWild.animation = "wild_drop";
      this.spCharacterWild.node.setScale(1.4, 1.3);
      this.spCharacterWild.setCompleteListener(() => {
        this.spCharacterWild.setAnimation(0, "wild_idle", true);
      });
    } else if (this.id === 1) {
      ThanhGiongSoundController.instance.playSoundScatter();
      this.node.zIndex = 5;
      this.spCharacterWild.node.active = false;
      this.spCharacterScatter.node.active = true;
      this.sprCharacter.node.active = false;
      this.spCharacterScatter.animation = "scatter_drop";
      this.spCharacterScatter.setCompleteListener(() => {
        this.spCharacterScatter.setAnimation(0, "scatter_idle", true);
      });
    } else if (this.id === 10) {
      ThanhGiongSoundController.instance.playType(
        SLOT_SOUND_TYPE.RESPIN_APPEAR
      );
      this.spCharacterWild.node.active = false;
      this.spCharacterScatter.node.active = false;
      this.sprCharacter.node.active = true;
      this.sprCharacter.node.setPosition(0, 0);
      this.valueCharacter.node.active = true;
      if (this.boosterId > -1) {
        this.valueCharacter.spriteFrame =
          ThanhGiongSlotMachine.instance.spCharacterValue[this.boosterId];
        this.valueCharacter.node.height =
          this.numberSize[this.boosterId].height;
        this.valueCharacter.node.width = this.numberSize[this.boosterId].width;
        if (this.boosterId > 11) {
          this.sprCharacter.spriteFrame =
            ThanhGiongSlotMachine.instance.spCharacter[11];
        }
      } else {
        this.setRandom();
        this.node.opacity = 0;
      }
    } else {
      this.spCharacter.node.active = false;
      this.spCharacterWild.node.active = false;
      this.spCharacterScatter.node.active = false;
    }
  }

  public setRandom(): void {
    let index: number = -1;

    if (ThanhGiongController.instance.getBoosterState()) {
      index = 10;
      this.node.opacity = 255;
      let idNum = ThanhGiongCommon.getRandomNumber(0, 15);
      this.boosterId = idNum;
      this.sprCharacter.node.active = true;
      this.sprCharacter.node.setPosition(0, 0);
      this.valueCharacter.node.active = true;
      this.valueCharacter.spriteFrame =
        ThanhGiongSlotMachine.instance.spCharacterValue[this.boosterId];
      this.valueCharacter.node.height = this.numberSize[this.boosterId].height;
      this.valueCharacter.node.width = this.numberSize[this.boosterId].width;
    } else {
      this.valueCharacter.node.active = false;
      index = ThanhGiongCommon.getRandomNumber(0, 9);
      this.sprCharacter.node.setPosition(-6.265, -6.887);
      switch (index) {
        case 1:
          this.node.zIndex = 5;
          this.spCharacter.node.active = false;
          this.sprCharacter.node.active = false;
          this.spCharacterWild.node.active = false;
          this.spCharacterScatter.node.active = true;
          this.spCharacterScatter.setAnimation(0, "scatter_idle", true);
          break;
        case 0:
          this.node.zIndex = 5;
          this.sprCharacter.node.setPosition(-2.783, 13.135);
          this.sprCharacter.node.active = false;
          this.node.zIndex = 4;
          this.spCharacterWild.node.active = true;
          this.spCharacterWild.node.setScale(1.34, 1.34);
          this.spCharacterWild.setAnimation(0, "wild_idle", true);
          break;
        default:
          this.spCharacterWild.node.active = false;
          this.spCharacterScatter.node.active = false;
          this.spCharacterScatter.node.active = false;
          this.spCharacterWild.node.active = false;
          this.spCharacter.node.active = false;
          this.sprCharacter.node.active = true;
          break;
      }
    }
    this.sprCharacter.node.scaleX = this.scaleX[index];
    this.sprCharacter.node.scaleY = this.scaleY[index];
    this.sprCharacter.spriteFrame =
      ThanhGiongSlotMachine.instance.spCharacter[index];
  }

  

  public changeAnimToIdleWin() {
    let arr = ThanhGiongSlotMachine.instance.getLineWins();
    if (
      this.winArray.length > 0 &&
      this.winArray.indexOf(
        arr[ThanhGiongSlotMachine.instance.currentWinIndex]
      ) > -1
    ) {
      if (ThanhGiongSlotMachine.instance.type != 3) {
        this.changeAnimToWin();
      }
    } else {
      this.spCharacter.node.color = cc.color(142, 143, 145);
      this.sprCharacter.node.color = cc.color(142, 143, 145);
      this.spCharacterWild.node.color = cc.color(142, 143, 145);
      this.spCharacterScatter.node.color = cc.color(142, 143, 145);
    }
  }

  public changeAnimToWin() {
    this.spCharacter.unscheduleAllCallbacks();
    this.spCharacterWild.unscheduleAllCallbacks();
    if (this.winArray.length > 0) {
      this.spCharacter.node.color = cc.color(255, 255, 255);
      this.sprCharacter.node.color = cc.color(255, 255, 255);
      this.spCharacterWild.node.color = cc.color(255, 255, 255);
      this.spCharacterScatter.node.color = cc.color(255, 255, 255);
      if (this.id === 0) {
        this.spCharacter.node.active = false;
        this.spCharacterWild.node.active = true;
        this.spCharacterWild.animation = this.animationWin[0];
        this.spCharacterWild.scheduleOnce(() => {
          if (this.id === 0) {
            this.spCharacter.node.active = false;
            this.spCharacterWild.node.active = true;
            this.spCharacterWild.setAnimation(0, "wild_idle", true);
          }
        }, 1.5);
      } else {
        this.spCharacter.node.active = true;
        this.spCharacter.animation = this.animationWin[this.id];
        this.spCharacter.scheduleOnce(() => {
          this.spCharacterWild.node.active = false;
          this.spCharacterScatter.node.active = false;
          this.spCharacter.animation = this.animationWin[this.id];
          this.spCharacter.node.active = false;
        }, 1.5);
      }
    }
  }

  public changeAnimToScatter() {
    if (this.id == 1) {
      this.node.zIndex = 5;
      this.spCharacterScatter.setAnimation(0, "scatter_win", false);
    }
  }

  public activateRing() {
    if (this.boosterRing.node.active == false && this.id == 10) {
      if (this.boosterId > 11) {
        ThanhGiongSoundController.instance.playType(
          SLOT_SOUND_TYPE.RESPIN_COIN_RED
        );
      } else {
        ThanhGiongSoundController.instance.playType(
          SLOT_SOUND_TYPE.RESPIN_COIN_GREEN
        );
      }
      this.boosterRing.node.active = true;
      this.boosterRing.animation = "cloudcircle_intro";
      this.boosterRing.setCompleteListener(() => {
        this.boosterRing.animation = "cloudcircle_spin";
      });
    }
  }

  public deactivateRing() {
    if (this.boosterRing.node.active == true) {
      this.boosterRing.animation = "cloudcircle_outro";
      this.boosterRing.setCompleteListener(() => {
        this.boosterRing.node.active = false;
      });
    }
  }

  public deactivateSpecial() {
    this.spCharacterScatter.node.active = false;
    this.spCharacterWild.node.active = false;
  }

  public getBoosterId() {
    return this.boosterId;
  }

  protected update(dt: number): void {
    if (this.node.position.y >= 447.5 || this.node.position.y <= -447.5) {
      this.viewMask.width = 30;
      this.viewMask.height = 30;
    } else {
      this.viewMask.width = 500;
      this.viewMask.height = 500;
    }
  }
}
