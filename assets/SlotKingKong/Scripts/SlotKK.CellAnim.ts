import { SlotCmd } from "./SlotKK.Cmd";
import SlotKKCommon from "./SlotKK.Common";
import SlotKKController from "./SlotKK.Controller";
import SlotKKMusicManager, { SLOT_SOUND_TYPE } from "./SlotKK.Music";
import SlotKKMachine from "./SlotKK.SlotMachine";

const { ccclass, property } = cc._decorator;
@ccclass
export default class SlotKKCellAnim extends cc.Component {
  @property(sp.Skeleton)
  public skeletonCharacter: sp.Skeleton = null;

  private _index: number = 0;

  public set index(index: number) {
    this._index = index;
  }

  public get index() {
    return this._index;
  }

  private itemCell: SlotCmd.ImpItemCell = null;

  public getItemCell() {
    return this.itemCell;
  }

  public setItemCell(item: SlotCmd.ImpItemCell) {
    this.itemCell = item;
  }

  public setResultForCell(result: SlotCmd.ImpItemCell) {
    this.itemCell = result;
    if (result.id === SlotCmd.DEFINE_CHARACTER.COIN) {
      let pos = cc.v2(this.node.parent.parent.parent.x, this.node.y);
      SlotKKController.instance.coinPos.push(pos); 
    }
    this.skeletonCharacter.skeletonData =
      SlotKKMachine.instance.listSyms[Math.abs(result.id)];
    this.skeletonCharacter.defaultSkin = "default";
    this.skeletonCharacter.loop = false;

    if (result.isActive) {
      let animName = this.getAnimNameDefault(
        result.highlight,
        result.rowTake,
        Math.abs(result.id)
      );

      if (animName === "") {
        // cc.log(this.node.name, this.node.parent.parent.parent.name);
      } else {
        this.skeletonCharacter.defaultAnimation = animName;
        this.skeletonCharacter.setAnimation(0, animName, false);
      }
    }
  }

  public setSkeRandom() {
    let ran = SlotKKCommon.getRandomNumber(2, 12);
    this.skeletonCharacter.skeletonData = SlotKKMachine.instance.listSyms[ran];
    this.skeletonCharacter.defaultSkin = "default";
    this.skeletonCharacter.defaultAnimation =
      SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[ran].anim_default_01;
    this.skeletonCharacter.setAnimation(
      0,
      SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[ran].anim_default_01,
      false
    );
    this.skeletonCharacter.loop = false;
  }

  public explode() {
    if (this.itemCell) {
      if (this.itemCell.isExplode) {
        this.node.children[0].active = true;
        let animName = this.getAnimNameDefault(
          this.itemCell.highlight,
          this.itemCell.rowTake,
          this.itemCell.id
        );

        if (animName !== "") {
          this.skeletonCharacter.setAnimation(0, animName, false);
        }

        this.scheduleOnce(() => {
          let animName2 = this.getAnimNameExplode(
            this.itemCell.highlight,
            this.itemCell.rowTake,
            this.itemCell.id
          );

          if (animName2 !== "") {
            this.skeletonCharacter.setAnimation(0, animName2, false);
          }

          this.scheduleOnce(() => {
            this.node.children[0].active = false;
          }, 0.8);
        }, 0.8);
      }
    } else {
      // cc.log("item cell null");
      // cc.log(this.node.name);
    }
  }

  private getAnimNameDefault(highlight: boolean, rowTake: number, id: number) {
    let animName = "";
    switch (id) {
      case SlotCmd.DEFINE_CHARACTER.SCATTER:
        animName = this.getAnimDefaultByRowTake(rowTake, id);
        SlotKKMusicManager.instance.playType(
          SLOT_SOUND_TYPE.SYMBOL_SCATTERTRIGGER
        );
        break;

      case SlotCmd.DEFINE_CHARACTER.COIN:
        animName = this.getAnimDefaultByRowTake(rowTake, id);
        SlotKKMusicManager.instance.playType(
          SLOT_SOUND_TYPE.FREE_GAME_COIN_HIT
        );
        break;

      case SlotCmd.DEFINE_CHARACTER.WILD:
        animName = this.getAnimDefaultByRowTake(rowTake, id);
        SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.KINGKONG_POPOUT);
        break;

      default:
        if (!highlight) {
          animName = this.getAnimDefaultByRowTake(rowTake, id);
        } else {
          animName = this.getAnimGoldenByRowTake(rowTake, id);
          SlotKKMusicManager.instance.playType(
            SLOT_SOUND_TYPE.SYMBOL_WILDTRANSFORM
          );
        }
        break;
    }
    return animName;
  }

  private getAnimNameExplode(highlight: boolean, rowTake: number, id: number) {
    let animName = "";
    switch (id) {
      case SlotCmd.DEFINE_CHARACTER.SCATTER:
        animName = this.getAnimHitByRowTake(rowTake, id);
        break;

      case SlotCmd.DEFINE_CHARACTER.COIN:
        animName = this.getAnimBoomByRowTake(rowTake, id);
        break;

      case SlotCmd.DEFINE_CHARACTER.WILD:
        animName = this.getAnimBoomByRowTake(rowTake, id);
        break;

      default:
        if (highlight) {
          animName = this.getAnimGoldenBoomByRowTake(rowTake, id);
        } else {
          animName = this.getAnimBoomByRowTake(rowTake, id);
        }
        break;
    }

    return animName;
  }

  private getAnimDefaultByRowTake(rowTake: number, id: number) {
    let animName = "";
    switch (rowTake) {
      case 1:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_default_01;
        break;

      case 2:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_default_02;
        break;

      case 3:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_default_03;
        break;

      case 4:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_default_04;
        break;

      case 5:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_default_05;
        break;

      case 6:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_default_06;
        break;
    }
    return animName;
  }

  private getAnimGoldenByRowTake(rowTake: number, id: number) {
    let animName = "";
    switch (rowTake) {
      case 1:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_golden_01;
        break;

      case 2:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_golden_02;
        break;

      case 3:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_golden_03;
        break;

      case 4:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_golden_04;
        break;

      case 5:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_golden_05;
        break;

      case 6:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_golden_06;
        break;
    }
    return animName;
  }

  private getAnimGoldenBoomByRowTake(rowTake: number, id: number) {
    let animName = "";
    switch (rowTake) {
      case 1:
        animName =
          SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_goldenboom_01;
        break;

      case 2:
        animName =
          SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_goldenboom_02;
        break;

      case 3:
        animName =
          SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_goldenboom_03;
        break;

      case 4:
        animName =
          SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_goldenboom_04;
        break;

      case 5:
        animName =
          SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_goldenboom_05;
        break;

      case 6:
        animName =
          SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_goldenboom_06;
        break;
    }
    return animName;
  }

  private getAnimBoomByRowTake(rowTake: number, id: number) {
    let animName = "";
    switch (rowTake) {
      case 1:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_boom_01;
        break;

      case 2:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_boom_02;
        break;

      case 3:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_boom_03;
        break;

      case 4:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_boom_04;
        break;

      case 5:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_boom_05;
        break;

      case 6:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_boom_06;
        break;
    }
    return animName;
  }

  private getAnimHitByRowTake(rowTake: number, id: number) {
    let animName = "";
    switch (rowTake) {
      case 1:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_hit_01;
        break;

      case 2:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_hit_02;
        break;

      case 3:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_hit_03;
        break;

      case 4:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_hit_04;
        break;

      case 5:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_hit_05;
        break;

      case 6:
        animName = SlotCmd.DEFINE_CHARACTER.ANIM_CHARACTER[id].anim_hit_06;
        break;
    }
    return animName;
  }
}
