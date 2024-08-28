import TQSlotMachine from "./TQ.SlotMachine";
import TQCommon from "./TQ.Common";
import TQSoundController from "./TQ.SoundController";

const { ccclass, property } = cc._decorator;
@ccclass
export default class TQCell extends cc.Component {
  @property(dragonBones.ArmatureDisplay)
  private spCharater: dragonBones.ArmatureDisplay = null;
  @property(dragonBones.ArmatureDisplay)
  private winGlow: dragonBones.ArmatureDisplay = null;
  private _index = 0;
  private highlight: boolean = false;
  private winArray = [];
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
  }

  public setResult(result) {
    this.setTexture(result.id);
    this.winArray = result.winArray;
    if (result.id != 0 && result.winArray.length > 0) {
      this.highlight = true;
    }
  }

  public setTexture(index: number): void {
    if (index != 0) {
      this.spCharater.dragonAtlasAsset = null;
      this.spCharater.dragonAsset = null;
      this.spCharater.armatureName = null;
      if (index != 1) {
        let temp = index - 2;
        //////////////////////////////////
        this.spCharater.dragonAtlasAsset =
          TQSlotMachine.instance.spAtlasCharacter[temp];
        this.spCharater.dragonAsset =
          TQSlotMachine.instance.spAtlasCharacterAsset[temp];
        if (temp == 1) {
          this.spCharater.armatureName = "Wild";
          this.spCharater.playAnimation("idle", -1);
        } else if (temp == 0) {
          this.spCharater.armatureName = "Scatter";
          this.spCharater.playAnimation("1sec", -1);
          TQSoundController.instance.playSoundScatter()
        } else {
          this.spCharater.armatureName =
            TQSlotMachine.instance.spAtlasCharacterAsset[temp].name.substring(
              0,
              2
            );
          this.changeAnimToIdle();
        }
      } else {
        this.spCharater.dragonAtlasAsset =
          TQSlotMachine.instance.spAtlasCharacter[1];
        this.spCharater.dragonAsset =
          TQSlotMachine.instance.spAtlasCharacterAsset[1];
        this.spCharater.armatureName = "Wild";
      }
    } else {
      this.setRandom();
    }
  }

  public setRandom(): void {
    let index = TQCommon.getRandomNumber(2, 13);
    this.spCharater.dragonAtlasAsset = null;
    this.spCharater.dragonAsset = null;
    this.spCharater.armatureName = null;
    this.spCharater.dragonAtlasAsset =
      TQSlotMachine.instance.spAtlasCharacter[index];
    this.spCharater.dragonAsset =
      TQSlotMachine.instance.spAtlasCharacterAsset[index];
    if (index == 0) {
      this.spCharater.armatureName = "Scatter";
    } else if (index == 1) {
      this.spCharater.armatureName = "Wild";
    } else {
      this.spCharater.armatureName =
        TQSlotMachine.instance.spAtlasCharacterAsset[index].name.substring(
          0,
          2
        );
    }
    this.changeAnimToIdle();
  }

  public changeAnimToIdle() {
    this.spCharater.playAnimation("idle", -1);
  }

  public changeAnimToIdleWin() {
    if (
      this.highlight == true &&
      this.winArray.indexOf(TQSlotMachine.instance.currentWinIndex) > -1
    ) {
      if (
        TQSlotMachine.instance.type != 3
      ) {
        this.winGlow.node.active = true;
      }
      this.winGlow.playAnimation("loop", 0);
      this.spCharater.playAnimation("2sec", -1);
      this.spCharater.once(
        dragonBones.EventObject.COMPLETE,
        () => {
          this.winGlow.node.active = false;
        },
        this.spCharater
      );
    }
  }

  public changeAnimToWin() {
    if (this.highlight == true) {
      this.spCharater.playAnimation("2sec", -1);
    }
  }
}
