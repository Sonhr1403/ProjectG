// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
export enum SLOT_CELL_TYPE {
  // JACKPOT = 1,
  // SCATTER = 2,
  // WILD = 3,
  // BAND = 4,
  // GLOVE = 5,
  // GOLDEN_BANDED_STAFF = 6,
  // MAGICAL_CIRCLET = 7,
  // A = 8,
  // K = 9,
  // Q = 10,
  // J = 11,

  WUKONG_LOCK_1 = 11,
  WUKONG_LOCK_2 = 12,
  WUKONG_WILD_X1 = 13,
  WUKONG_WILD_X2 = 14,
  WUKONG_WILD_X3 = 15,
}
import WukongSlotMachine from "./Wukong.SlotMachine";
import WukongCommon from "./Wukong.Common";
import WukongMain from "./Wukong.Controller";

const { ccclass, property } = cc._decorator;
@ccclass
export default class WukongCell extends cc.Component {
  @property(sp.Skeleton)
  public spCharater: sp.Skeleton = null;

  @property(cc.Label)
  public lbIndex: cc.Label = null;
  @property(cc.Node)
  public effect: cc.Node = null;

  @property(cc.Label)
  public lbResult: cc.Label = null;

  // @property(cc.Label)
  // public lbDirection: cc.Label = null;

  private _index = 0;
  private highLight: boolean = false;
  private prisonState: boolean = false;
  private halfPrisonState: boolean = false;
  private unleashState: boolean = false;
  private multiId: number;
  private columNum: number;
  private unlockLastRound: boolean = false;
  private notUnlocked: boolean = false;
  public set index(index: number) {
    this._index = index;
  }

  public get index() {
    return this._index;
  }

  async onLoad(): Promise<void> {}

  async resetInEditor(): Promise<void> {
    return null;
  }

  async loadTextures(): Promise<boolean> {
    return null;
  }
  public resetCell() {
    this.effect.active = false;
    this.highLight = false;
    this.prisonState = false;
    this.halfPrisonState = false;
    this.unleashState = false;
    this.notUnlocked = false;
  }
  public setDirection(lbDirection) {
    // this.lbDirection.string = (lbDirection == 1) ? "U" : "D";
  }

  public setIndex(index) {
    this.lbIndex.string = index.toString();
  }

  public setResult(result, lastRound) {
    this.setTexture(result.id, result.highlight);
    // cc.log(lastRound)
    this.unlockLastRound = lastRound;
  }

  public setTexture(index: number, highlight): void {
    let atlasIndex = index - 1;
    this.highLight = highlight;
    let animData = this.spCharater.skeletonData;
    if (
      animData.name === WukongSlotMachine.instance.spAtlasCharacter[11].name ||
      animData.name === WukongSlotMachine.instance.spAtlasCharacter[12].name
    ) {
      cc.log(animData);
      this.notUnlocked = true;
    }

    if (atlasIndex >= 79) {
      if (WukongSlotMachine.instance.stayStill == false) {
        this.spCharater.skeletonData =
          WukongSlotMachine.instance.spAtlasCharacter[11];
        this.spCharater.animation = "Default";
      } else if (WukongSlotMachine.instance.stayStill == true) {
        this.spCharater.animation = "Idle";
      }
      this.prisonState = true;

      if (atlasIndex >= 80) {
        if (WukongSlotMachine.instance.stayStill == false) {
          this.spCharater.animation = "Default";
        } else if (WukongSlotMachine.instance.stayStill == true) {
          this.spCharater.animation = "Idle";
        }
        this.halfPrisonState = true;
        if (atlasIndex == 89 || atlasIndex == 90 || atlasIndex == 91) {
          this.prisonState = true;
          if (WukongSlotMachine.instance.stayStill == false) {
            this.spCharater.animation = "Default";
          } else if (WukongSlotMachine.instance.stayStill == true) {
            this.spCharater.animation = "Idle";
          }
          this.unleashState = true;
          this.halfPrisonState = false;
          switch (Number(atlasIndex)) {
            case 89:
              this.multiId = SLOT_CELL_TYPE.WUKONG_WILD_X1;
              break;
            case 90:
              this.multiId = SLOT_CELL_TYPE.WUKONG_WILD_X2;
              break;
            case 91:
              this.multiId = SLOT_CELL_TYPE.WUKONG_WILD_X3;
              break;
          }
        }
      }
    } else {
      this.spCharater.skeletonData =
        WukongSlotMachine.instance.spAtlasCharacter[atlasIndex];
    }
  }

  public setRandom(): void {
    this.lbResult.string = "";
    let index = WukongCommon.getRandomNumber(2, 10);
    this.spCharater.skeletonData =
      WukongSlotMachine.instance.spAtlasCharacter[index];
    this.spCharater.animation = "Idle";
  }
  public setRandomFreeSpin(): void {
    this.lbResult.string = "";
    let index = WukongCommon.getRandomNumber(3, 6);
    this.spCharater.skeletonData =
      WukongSlotMachine.instance.spAtlasCharacter[index];
    this.spCharater.animation = "Idle";
  }

  public changeAnimToSpin() {
    this.spCharater.animation = "Spin";
  }
  public changeAnimToIdle() {
    if (this.prisonState == true) {
      this.spCharater.skeletonData =
        WukongSlotMachine.instance.spAtlasCharacterEffect[0];
      this.spCharater.animation = "Default";
      this.scheduleOnce(() => {
        this.spCharater.skeletonData =
          WukongSlotMachine.instance.spAtlasCharacter[11];
        this.spCharater.animation = "Idle";
      }, 1.1);
    } else {
      this.spCharater.animation = "Idle";
    }
  }

  public changeAnimToWin(isFree = false, columNum) {
    if (this.highLight == true) {
      // if (isFree && WukongSlotMachine.instance.unlockAll == false) {
      if (isFree && WukongSlotMachine.instance.unlockAll == false) {
        WukongMain.instance.shakeScreen()
        if (columNum == 3) {
          this.chargePrisonFromRight();
        } else if (columNum == 1) {
          this.chargePrisonFromLeft();
        } else if (columNum == 2) {
          if (this.halfPrisonState == true) {
            this.changeAnimToHalfPrison();
          } else if (this.unleashState == true) {
            this.changeAnimToUnleashed(this.multiId);
          }
        }
      } else {
        this.spCharater.animation = "Win";
      }
      // }
    }
    // cc.log(this.unlockLastRound)
    // if  (WukongSlotMachine.instance.almostEndFreeSpin === true && this.notUnlocked === true) {
    if (
      WukongSlotMachine.instance.unlockAll == true &&
      this.notUnlocked === true
    ) {
      cc.error("ALMOST LAST ROUND!");
      if (this.halfPrisonState == true) {
        this.changeAnimToHalfPrison();
      } else if (this.unleashState == true) {
        this.changeAnimToUnleashed(this.multiId);
      }
    }
    // if (columNum == 2) {
    //   if (this.halfPrisonState == true) {
    //     this.changeAnimToHalfPrison();
    //   } else if (this.unleashState == true) {
    //     this.changeAnimToUnleashed(this.multiId);
    //   }
    // }
  }
  public changeAnimToPrison() {
    this.effect.active = true;
    this.effect.getComponent(sp.Skeleton).skeletonData =
      WukongSlotMachine.instance.spAtlasCharacterEffect[0];
    this.effect.getComponent(sp.Skeleton).animation = "Default";
    this.spCharater.animation = "ChangeReady";
    this.scheduleOnce(() => {
      this.spCharater.skeletonData =
        WukongSlotMachine.instance.spAtlasCharacter[11];
      this.spCharater.animation = "Default";
      this.scheduleOnce(() => {
        this.spCharater.animation = "Idle";
      }, 0.6);
    }, 2.1);
  }

  public chargePrisonFromLeft() {
    if (
      this.spCharater.skeletonData ==
        WukongSlotMachine.instance.spAtlasCharacter[3] ||
      this.spCharater.skeletonData ==
        WukongSlotMachine.instance.spAtlasCharacter[4]
    )
      this.spCharater.animation = "Active_x_01";
    this.scheduleOnce(() => {
      this.spCharater.animation = "Idle";
    }, 1.1);
  }
  public chargePrisonFromRight() {
    if (
      this.spCharater.skeletonData ==
        WukongSlotMachine.instance.spAtlasCharacter[3] ||
      this.spCharater.skeletonData ==
        WukongSlotMachine.instance.spAtlasCharacter[4]
    )
      this.spCharater.animation = "Active_x_03";
    this.scheduleOnce(() => {
      this.spCharater.animation = "Idle";
    }, 1.1);
  }

  public changeAnimToHalfPrison() {
    
    this.spCharater.animation = "ChangeReady";
    this.scheduleOnce(() => {
      this.spCharater.skeletonData =
        WukongSlotMachine.instance.spAtlasCharacter[12];
      this.spCharater.animation = "CreateAfterChange";
      this.scheduleOnce(() => {
        this.spCharater.animation = "Idle";
      }, 0.8);
      WukongMain.instance.stopShakeScreen()
    }, 1.3);
    this.halfPrisonState = false;
  }
  public changeAnimToUnleashed(id) {
    if (WukongSlotMachine.instance.freeSpinType == 1) {
      let effectId = 0;
      switch (Number(id)) {
        case 13:
          effectId = 1;
          break;
        case 14:
          effectId = 2;
          break;
        case 15:
          effectId = 3;
          break;
      }
      this.spCharater.animation = "ChangeReady";
      this.effect.active = true;
      this.effect.getComponent(sp.Skeleton).skeletonData =
        WukongSlotMachine.instance.spAtlasCharacterEffect[effectId];
      this.scheduleOnce(() => {
        this.spCharater.skeletonData =
          WukongSlotMachine.instance.spAtlasCharacter[id];
        this.effect.getComponent(sp.Skeleton).animation = "CreateAfterChange";
        this.spCharater.animation = "CreateAfterChange";
        this.scheduleOnce(() => {
          this.effect.active = false;
          this.spCharater.animation = "Idle";
          WukongMain.instance.stopShakeScreen()
        }, 1);
      }, 1.4);
    }
  }
}
