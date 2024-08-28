import VanessaSlotMachine from "./Vanessa.SlotMachine";
import VanessaCommon from "./Vanessa.Common";
import VanessaSoundController, {
  SLOT_SOUND_TYPE,
} from "./Vanessa.SoundController";
import VanessaMain from "./Vanessa.Controller";

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
export default class VanessaCell extends cc.Component {
  @property(dragonBones.ArmatureDisplay)
  public spCharater: dragonBones.ArmatureDisplay = null;
  @property(dragonBones.ArmatureDisplay)
  public winGlow: dragonBones.ArmatureDisplay = null;
  @property(cc.Node)
  private cellMask: cc.Node = null; //450 / 50

  private highlight: boolean = false;
  private winArray = [];
  private id: number = -1;
  private cellIdToName: Array<string> = [
    "Wild",
    "Trigger2",
    "Trigger1",
    "Scatter",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "L1",
    "L2",
    "L3",
    "L4",
    "L5",
    "L6",
  ];

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
    this.cellMask.width = 450;
    this.cellMask.height = 450;
  }

  public setResult(result) {
    this.setTexture(result.id);
    this.highlight = result.highlight;
  }

  public setTexture(index: number): void {
    this.spCharater.dragonAtlasAsset = null;
    this.spCharater.dragonAsset = null;
    this.spCharater.armatureName = null;
    this.id = index;
    this.spCharater.dragonAtlasAsset =
      VanessaSlotMachine.instance.spAtlasCharacter[index];
    this.spCharater.dragonAsset =
      VanessaSlotMachine.instance.spAtlasCharacterAsset[index];
    this.spCharater.armatureName = this.cellIdToName[index];
    if (index == 3) {
      this.spCharater.playAnimation("1sec", -1);
      VanessaSoundController.instance.playSoundScatter();
    } else {
      this.changeAnimToIdle();
    }
  }

  public setRandom(): void {
    let index = VanessaCommon.getRandomNumber(4, 13);
    this.spCharater.dragonAtlasAsset = null;
    this.spCharater.dragonAsset = null;
    this.spCharater.armatureName = null;
    this.spCharater.dragonAtlasAsset =
      VanessaSlotMachine.instance.spAtlasCharacter[index];
    this.spCharater.dragonAsset =
      VanessaSlotMachine.instance.spAtlasCharacterAsset[index];
    this.spCharater.armatureName = this.cellIdToName[index];
    this.changeAnimToIdle();
    if (this.node.position.y == 450 || this.node.position.y == -450) {
      this.cellMask.width = 50;
      this.cellMask.height = 50;
    }
  }

  public setRandomWild(): void {
    let index = 0;
    this.spCharater.dragonAtlasAsset = null;
    this.spCharater.dragonAsset = null;
    this.spCharater.armatureName = null;
    this.spCharater.dragonAtlasAsset =
      VanessaSlotMachine.instance.spAtlasCharacter[index];
    this.spCharater.dragonAsset =
      VanessaSlotMachine.instance.spAtlasCharacterAsset[index];
    this.spCharater.armatureName = this.cellIdToName[index];
    this.changeAnimToIdle();
  }

  public changeAnimToIdle() {
    this.spCharater.playAnimation("idle", -1);
  }

  public changeAnimToIdleWin() {
    if (
      this.highlight == true &&
      this.winArray.indexOf(VanessaSlotMachine.instance.currentWinIndex) > -1
    ) {
      if (VanessaSlotMachine.instance.type != 3) {
        this.winGlow.node.active = true;
      }
      this.winGlow.playAnimation("loop", -1);
      this.spCharater.playAnimation("2sec", -1);
      this.spCharater.once(
        dragonBones.EventObject.COMPLETE,
        () => {
          this.winGlow.node.active = false;
        },
        this.spCharater
      );
    } else {
      this.changeAnimToIdle();
    }

    if (this.id == 2) {
      //Sword
      this.winGlow.node.active = true;
      this.spCharater.playAnimation("2sec", -1);
      this.winGlow.playAnimation("trigger1_loop", -1);
    } else if (this.id == 1) {
      //Whip
      this.winGlow.node.active = true;
      this.spCharater.playAnimation("2sec", -1);
      this.winGlow.playAnimation("trigger2_loop", -1);
    }
  }

  public cellAttack() {
    let leader = VanessaMain.instance.slotScreenFreeModel.getComponent(
      dragonBones.ArmatureDisplay
    );
    let animationName: string;
    switch (this.id) {
      case 1:
        this.spCharater.playAnimation("2sec", -1);
        this.winGlow.node.active = true;
        this.winGlow.playAnimation("trigger2_loop", 0);

        VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.WHIP_ATTACK);

        let p1HP = VanessaMain.instance.getPlayerHP();
        animationName = "p1_hp" + p1HP.toString();
        VanessaMain.instance.freespinMeter[0]
          .getComponent(dragonBones.ArmatureDisplay)
          .playAnimation(animationName, -1);
        leader.once(
          dragonBones.EventObject.COMPLETE,
          () => {
            leader.playAnimation("idle", 0);
          },
          leader
        );
        break;

      case 2:
        this.spCharater.playAnimation("2sec", -1);
        this.winGlow.node.active = true;
        this.winGlow.playAnimation("trigger1_loop", 0);

        VanessaSoundController.instance.playType(SLOT_SOUND_TYPE.SWORD_ATTACK);

        leader.playAnimation("hurt", -1);
        let p2HP = VanessaMain.instance.getSystemHP();
        animationName = "p2_hp" + p2HP.toString();
        VanessaMain.instance.freespinMeter[1]
          .getComponent(dragonBones.ArmatureDisplay)
          .playAnimation(animationName, -1);
        leader.once(
          dragonBones.EventObject.COMPLETE,
          () => {
            leader.playAnimation("idle", 0);
          },
          leader
        );
        break;
    }
  }

  public changeAnimToWin() {
    if (this.highlight == true) {
      this.spCharater.playAnimation("2sec", -1);
    }
    if (this.id == 2) {
      this.spCharater.playAnimation("2sec", -1);
      this.winGlow.node.active = true;
      this.winGlow.playAnimation("trigger1_loop", -1);
    } else if (this.id == 1) {
      this.spCharater.playAnimation("2sec", -1);
      this.winGlow.node.active = true;
      this.winGlow.playAnimation("trigger2_loop", -1);
    }
  }

  public changeAnimToScatter() {
    if (this.id == 3) {
      this.spCharater.playAnimation("4sec", -1);
      this.node.zIndex = 4;
    }
  }

  public toggleWinEffects() {
    if (this.highlight == true) {
      this.spCharater.playAnimation("2sec", -1);
      this.winGlow.node.active = true;
      this.winGlow.playAnimation("loop", -1);
    }
  }
}
