import TQMain from "./TQ.Controller";
import TQSoundController, { SLOT_SOUND_TYPE } from "./TQ.SoundController";

const { ccclass, property } = cc._decorator;
@ccclass
export default class TQCellWild extends cc.Component {
  @property(dragonBones.ArmatureDisplay)
  private enabledEffect: dragonBones.ArmatureDisplay = null;
  @property({ type: dragonBones.DragonBonesAtlasAsset })
  private effectWildCharacter: dragonBones.DragonBonesAtlasAsset[] = [];
  @property({ type: dragonBones.DragonBonesAsset })
  private effectWildCharacterAsset: dragonBones.DragonBonesAsset[] = [];
  async onLoad(): Promise<void> {}

  protected onEnable(): void {
    let index = TQMain.instance.slotOrientation - 1;
    this.enabledEffect.dragonAsset = null;
    this.enabledEffect.dragonAtlasAsset = null;
    this.enabledEffect.armatureName = null;
    if (this.node.active == true) {
      if (TQSoundController.instance.getSystemVolume() > 0) {
        TQSoundController.instance.playType(
          SLOT_SOUND_TYPE.SPECIAL_WILD_APPEAR
        );
      }
    }
    this.enabledEffect.dragonAsset =
      this.effectWildCharacterAsset[TQMain.instance.slotOrientation - 1];
    this.enabledEffect.dragonAtlasAsset =
      this.effectWildCharacter[TQMain.instance.slotOrientation - 1];
    switch (Number(TQMain.instance.slotOrientation)) {
      case 1:
        this.enabledEffect.armatureName = "frw_wild_effect";
        this.enabledEffect.playAnimation("ani", -1);
        break;
      case 2:
        this.enabledEffect.armatureName = "bomb_wild";
        this.enabledEffect.playAnimation("ani", -1);

        break;
      case 3:
        this.enabledEffect.armatureName = "random_wild_effect";
        this.enabledEffect.playAnimation("ani", -1);
        break;
    }
  }
}
