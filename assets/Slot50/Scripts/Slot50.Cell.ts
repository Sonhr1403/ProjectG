import Slot50Common from "./Slot50.Common";
import Slot50Controller from "./Slot50.Controller";
import Slot50Machine from "./Slot50.Machine";
import { Slot50Cmd } from "./Slot50.Cmd";
import Slot50BgPumpkin from "./Slot50.BgPumpkin";
import Slot50Bullet from "./Slot50.Bullet";
import { Slot50LanguageMgr } from "./Slot50.LanguageMgr";
import Slot50SoundControler, { SLOT_SOUND_TYPE } from "./Slot50.SoundControler";
import SoundController from "../../Game_BOOGYI/Scripts/BOOGYI.SoundController";

const { ccclass, property } = cc._decorator;
@ccclass
export default class Slot50Cell extends cc.Component {

  @property(cc.Node)
  public nHighLight: cc.Node = null;

  @property(sp.Skeleton)
  public skeletonCharactor: sp.Skeleton = null;

  private _index: number = 0;

  public set index(index: number) {
    this._index = index;
  }

  public get index() {
    return this._index;
  }

  start() {
    // TODO
  }

  private itemFrame: Slot50Cmd.ImpFrame = null;
  public itemCell: Slot50Cmd.ImpItemCell = null;
  public setResultForCell(result: Slot50Cmd.ImpItemCell, itemFrame: Slot50Cmd.ImpFrame) {
    this.setSkeletonStopSpin(result.id);
    this.activeHighLight(false);
    this.itemFrame = itemFrame;
    this.itemCell = result;
    let timerThrowCoin = 0.5;
    // Giai đoạn 2
    if (itemFrame.totalScratter > 1 && result.id == Slot50Cmd.DEFINE_CHARACTOR.SCATTER) {
      this.scheduleOnce(() => {
        this.setSkeletonScatter(itemFrame.totalScratter);
      }, timerThrowCoin);
    }
  }

  public shootSata() {
    if ([Slot50Cmd.DEFINE_CHARACTOR.BLUE_SATAN, Slot50Cmd.DEFINE_CHARACTOR.GREEN_SATAN, Slot50Cmd.DEFINE_CHARACTOR.RED_SATAN].indexOf(this.itemCell.id) > -1) {
      Slot50Bullet.instance.shoot({ x: 4, y: this.itemFrame.listWild[0] }, { x: this.itemFrame.column, y: this.index });
      this.scheduleOnce(() => {
        this.changeSkeletonGoldCell(this.itemCell.id);
      }, 1);
    }
  }

  public setSkeletonDefaultRandom(): number {
    let index = Slot50Common.getRandomNumber(2, 13);
    this.activeHighLight(false);
    this.setSkeletonDefault(index);
    return index;
  }

  public setSkeletonSpinRandom(): number {
    let index = Slot50Common.getRandomNumber(2, 13);
    this.activeHighLight(false);
    this.setSkeletonSpin(index);
    return index;
  }

  public setSkeletonDefault(index: number) {
    if (index > 1 && index < 14) {
      const defineAnim = Slot50Cmd.DEFINE_CHARACTOR.ANIM_CHARACTOR[index];
      if (defineAnim) {
        this.skeletonCharactor.setSkin(defineAnim.skin);
        this.skeletonCharactor.setAnimation(0, defineAnim.anim_default, true);
      }
    }
  }

  private setSkeletonSpin(index: number) {
    if (index > 1 && index < 14) {
      const defineAnim = Slot50Cmd.DEFINE_CHARACTOR.ANIM_CHARACTOR[index];
      if (defineAnim) {
        this.skeletonCharactor.setSkin(defineAnim.skin);
        this.skeletonCharactor.setAnimation(0, defineAnim.anim_default, true);
      }
    }
  }

  private setSkeletonStopSpin(index: number) {
    if (index > 1 && index < 14) {
      const defineAnim = Slot50Cmd.DEFINE_CHARACTOR.ANIM_CHARACTOR[index];
      if (defineAnim) {
        this.skeletonCharactor.setSkin(defineAnim.skin);
        this.skeletonCharactor.setAnimation(0, defineAnim.anim_stop_spin, false);
      }
    }
  }

  public swapSkeletionForFree(index: number) {
    if (this.itemCell.oldId > 1 && this.itemCell.oldId < 14) {
      const defineAnim = Slot50Cmd.DEFINE_CHARACTOR.ANIM_CHARACTOR[this.itemCell.oldId];
      if (defineAnim) {
        this.skeletonCharactor.setSkin(defineAnim.skin);
        this.skeletonCharactor.setAnimation(0, defineAnim.anim_free, true);
      }
    }
  }

  public setSkeletonWildJumping() {
    if(this.itemCell.id == Slot50Cmd.DEFINE_CHARACTOR.WILD) {
      const defineAnim = Slot50Cmd.DEFINE_CHARACTOR.ANIM_CHARACTOR[Slot50Cmd.DEFINE_CHARACTOR.WILD];
      // Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_SHOW_FREE_GAME);
      if (defineAnim) {
        this.skeletonCharactor.node.zIndex = defineAnim.z_index;
        this.skeletonCharactor.setSkin(defineAnim.skin_change);
        this.skeletonCharactor.setAnimation(0, defineAnim.anim_change, true);
      }
    }
  }

  private setSkeletonScatter(totalScratter: number) {
    try {
      this.skeletonCharactor.node.zIndex = 1;
      this.skeletonCharactor.setSkin(Slot50Cmd.DEFINE_CHARACTOR.ANIM_SCATTER.skin);
      if (totalScratter > 1) {
        var index = 1;
        switch (index) {
          case 1:
            Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_APEAR_JACKPOT_1);
            break;

          case 2:
            Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_APEAR_JACKPOT_2);
            break;

          case 3:
            Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_APEAR_JACKPOT_3);
            break;
        }
     
        this.skeletonCharactor.setAnimation(0, Slot50Cmd.DEFINE_CHARACTOR.ANIM_SCATTER.anim_2_end, true);
        // this.scheduleOnce(() => {
        //   this.skeletonCharactor.setAnimation(0, Slot50Cmd.DEFINE_CHARACTOR.ANIM_SCATTER.anim_default, true);
        // }, 1);
      }
    } catch (error) {
      console.error("ERROR 2 SCATTER", 2);
    }
  }

  public setSkeleton3Scatter() {
    if (this.itemCell.id == Slot50Cmd.DEFINE_CHARACTOR.SCATTER) {
      this.skeletonCharactor.setSkin(Slot50Cmd.DEFINE_CHARACTOR.ANIM_SCATTER.skin);
      this.skeletonCharactor.setAnimation(0, Slot50Cmd.DEFINE_CHARACTOR.ANIM_SCATTER.anim_3, false);
    }
  }

  private changeSkeletonGoldCell(index: number) {
    if (index > 1 && index < 14) {
      const defineAnim = Slot50Cmd.DEFINE_CHARACTOR.ANIM_CHARACTOR[index];
      if (defineAnim) {
        this.skeletonCharactor.node.zIndex = defineAnim.z_index;
        this.skeletonCharactor.setSkin(defineAnim.skin_change);
        this.skeletonCharactor.setAnimation(0, defineAnim.anim_change, false);
        this.scheduleOnce(() => {
          this.skeletonCharactor.setAnimation(0, defineAnim.anim_change_1, true);
        }, 1.667);
      }
    }
  }

  public setSkeletionHighLight() {
    if (this.itemCell.id > 1 && this.itemCell.id < 14 && this.itemCell.highlight) {
      this.activeHighLight(true);
      const defineAnim = Slot50Cmd.DEFINE_CHARACTOR.ANIM_CHARACTOR[this.itemCell.id];
      if (defineAnim) {
        this.skeletonCharactor.node.zIndex = defineAnim.z_index;
        this.skeletonCharactor.setSkin(defineAnim.skin);
        this.skeletonCharactor.setAnimation(0, defineAnim.anim_highlight, true);
      }
    }
  }

  public throwCoinToPumpkin() {
    if (this.itemCell.id == Slot50Cmd.DEFINE_CHARACTOR.SCATTER) {
      Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_FLY_COIN);
      Slot50BgPumpkin.instance.collectionCoin(this.itemFrame.column, this.index);
    }
  }

  public activeHighLight(isActive: boolean) {
    this.nHighLight.active = isActive;
  }

  public activeCell(isActive: boolean) {
    this.node.active = isActive
  }

  public showHighlight(index: number) {
    if (this.itemCell.id > 1 && this.itemCell.id < 14 && this.itemCell.highlight) {
      this.activeHighLight(true);
    }
  }
}
