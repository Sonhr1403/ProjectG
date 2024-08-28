import GenZSlotMachine from "./GZ.SlotMachine";
import GenZCommon from "./GZ.Common";
import GenZMain from "./GZ.Controller";
import GenZMusicManager, { SLOT_SOUND_TYPE } from "./GZ.MusicCtrller";
const { ccclass, property } = cc._decorator;
@ccclass
export default class GenZCell extends cc.Component {
  @property(sp.Skeleton)
  public spCharater: sp.Skeleton = null;
  @property(sp.Skeleton)
  public effect: sp.Skeleton = null;
  @property(sp.Skeleton)
  public flexMark: sp.Skeleton = null;
  @property(sp.Skeleton)
  public spCharaterEffect: sp.Skeleton = null;
  @property(sp.SkeletonData)
  public effectSkeletons: sp.SkeletonData[] = [];

  public jumpLoop = 0;
  public indexPos: number = 0;
  public indexInit: number = 0;
  public columnIndex: number = 0;
  public highLight: boolean = false;
  private winState: boolean = false;
  public newCellsArray = [];
  public wildIndex: number = -1;
  private _index = 0;
  private multiNum: number = 0;
  public instantiated: boolean = false;
  public scatterState: boolean = false;
  public wildState: number = 0;
  public set index(index: number) {
    this._index = index;
  }

  public get index() {
    return this._index;
  }

  async onLoad(): Promise<void> {
    this.flexMark.node.active = false;
    this.spCharater.animation = "Idle";
    this.spCharaterEffect.node.active = false;
  }

  async resetInEditor(): Promise<void> {
    return null;
  }

  async loadTextures(): Promise<boolean> {
    return null;
  }
  public resetCell() {
    this.effect.node.active = false;
    this.flexMark.node.active = false;
    this.changeAnimToIdle();
    this.wildState = 0;
    this.scatterState = false;
    this.spCharaterEffect.loop = false;
    this.multiNum = 0;
    this.jumpLoop = 0;
    this.indexPos = 0;
    this.newCellsArray = [];
    this.columnIndex = 0;

    if (GenZMain.instance.freeSpin == false) {
      this.wildIndex = -1;
    }
  }

  changeAnimSpeed() {
    if (GenZMain.instance.turboState == false) {
      this.flexMark.timeScale = 1;
      this.effect.timeScale = 1;
    } else {
      this.flexMark.timeScale = 1;
      this.effect.timeScale = 1;
    }
  }

  public setResult(result) {
    this.winState = result.win;
    this.newCellsArray = result.extraCells;
    this.indexPos = result.updatePos;
    this.multiNum = result.extraCellNum;
    this.columnIndex = result.lightColumnIndex;
    this.setTexture(result.id, result.highlight, result.jumpStep);
    this.changeAnimSpeed();
  }

  public setTexture(index: number, highlight = false, loop = 0): void {
    this.highLight = highlight;
    this.spCharater.skeletonData =
      GenZSlotMachine.instance.spAtlasCharacter[index];
    this.changeAnimToIdle();
    this.jumpLoop = loop;
    if (this.highLight == true) {
      this.showFlexEffect();
    }
    if (index == 0) {
      this.scatterState = true;
      if (GenZMusicManager.instance.getSystemVolume() > 0) {
        GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.SCATTER);
      }
    }
    if (index == 1) {
      this.wildState = 1;
      if (
        GenZMain.instance.freeSpin == false &&
        GenZMain.instance.turboState == false
      ) {
        this.spCharater.animation = "Default";
      }
      if (GenZMusicManager.instance.getSystemVolume() > 0) {
        GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.WILD_X2);
      }
    } else if (index == 2) {
      this.wildState = 2;
      if (
        GenZMain.instance.freeSpin == false &&
        GenZMain.instance.turboState == false
      ) {
        this.spCharater.animation = "Default";
      }
      if (GenZMusicManager.instance.getSystemVolume() > 0) {
        GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.WILD_X3);
      }
    }
    // } else {
    //   this.spCharater.skeletonData =
    //     GenZSlotMachine.instance.spAtlasCharacter[index];
    //   this.changeAnimToIdle();
    // }
  }

  public animAfterColumnFall() {
    if (this.wildState >= 1 && GenZMain.instance.freeSpin == false) {
      // cc.log(this.wildState);
      this.spCharaterEffect.node.active = true;
      this.spCharaterEffect.skeletonData = this.effectSkeletons[this.wildState];
      this.spCharaterEffect.animation = "Default";
      this.scheduleOnce(
        () => {
          this.changeAnimToIdle();
        },
        GenZMain.instance.turboState ? 0 : 0.8
      );
    }

    if (this.scatterState == true) {
      this.spCharaterEffect.node.active = true;
      this.spCharaterEffect.skeletonData = this.effectSkeletons[0];
      this.spCharaterEffect.animation = "Default";
      this.scheduleOnce(
        () => {
          this.changeAnimToIdle();
        },
        GenZMain.instance.turboState ? 0 : 0.4
      );
    }
  }

  public setRandom(): void {
    let index = GenZCommon.getRandomNumber(1, 13);
    this.spCharater.skeletonData =
      GenZSlotMachine.instance.spAtlasCharacter[index];
    this.changeAnimToIdle();
  }

  public changeAnimToIdle() {
    this.spCharater.animation = "Idle";
    this.spCharaterEffect.node.active = false;
  }

  public changeAnimToWin() {
    //TODO: UPDATE THIS FUNCTION
    if (this.winState == true) {
      if (
        this.spCharater.skeletonData ==
          GenZSlotMachine.instance.spAtlasCharacter[1] ||
        this.spCharater.skeletonData ==
          GenZSlotMachine.instance.spAtlasCharacter[2]
      ) {
        this.spCharater.animation = "Win";
        this.spCharaterEffect.node.active = true;
        if (
          this.spCharater.skeletonData ==
          GenZSlotMachine.instance.spAtlasCharacter[2]
        ) {
          this.spCharaterEffect.skeletonData = this.effectSkeletons[2];
        } else if (
          this.spCharater.skeletonData ==
          GenZSlotMachine.instance.spAtlasCharacter[1]
        ) {
          this.spCharaterEffect.skeletonData = this.effectSkeletons[1];
        }
        this.spCharaterEffect.animation = "Win";
        this.spCharaterEffect.loop = true;
      } else {
        this.spCharater.animation = "Win";
      }
    } else {
      this.spCharater.animation = "Deactive";
    }
  }

  public changeAnimToSprout() {
    if (
      this.spCharater.skeletonData ==
        GenZSlotMachine.instance.spAtlasCharacter[0] ||
      this.spCharater.skeletonData ==
        GenZSlotMachine.instance.spAtlasCharacter[1] ||
      this.spCharater.skeletonData ==
        GenZSlotMachine.instance.spAtlasCharacter[2]
    ) {
      this.spCharater.animation = "Idle";
    } else {
      this.spCharater.animation = "Idle";

      // this.spCharater.animation = "Appear";
      // this.spCharater.setEndListener(()=> this.changeAnimToIdle())
    }
    // this.scheduleOnce(() => this.changeAnimToIdle(), 0.5);
  }

  public showFlexEffect() {
    
    if (GenZMusicManager.instance.getSystemVolume() > 0) {
      GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.FLEX_MARK_APPEAR);
    }
    let activeEffect = "Appear_" + this.multiNum.toString();
    let idleEffect = "Idle_" + this.multiNum.toString();
    this.flexMark.node.active = true;
    this.flexMark.animation = "Appear";
    this.scheduleOnce(() => {
      this.flexMark.animation = "Disappear";
      this.scheduleOnce(
        () => {
          this.flexMark.node.active = false;
        },
        GenZMain.instance.turboState ? 0.1 : 0.5
      );
      this.effect.node.active = true;
      this.effect.animation = activeEffect;
      this.scheduleOnce(
        () => {
          this.effect.animation = idleEffect;
        },
        GenZMain.instance.turboState ? 0.01 : 0.3
      );
    }, GenZMain.instance.turboState ? 0.33 : 1);
  }

  public hideFlexEffect() {
    if (GenZMusicManager.instance.getSystemVolume() > 0) {
      GenZMusicManager.instance.playType(SLOT_SOUND_TYPE.FLEX_MARK_END);
    }
    this.unscheduleAllCallbacks();
    this.flexMark.node.active = false;
    let deactivateEffect = "Disappear_" + this.multiNum.toString();
    this.effect.animation = deactivateEffect;
    this.scheduleOnce(() => {
      this.effect.node.active = false;
      }, GenZMain.instance.turboState ? 0.2 : 0.32);
    // }, 0.32);
  }
}
