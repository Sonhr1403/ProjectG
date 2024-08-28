import { Slot50Cmd } from "./Slot50.Cmd";
import Slot50BgPumpkin from "./Slot50.BgPumpkin";
import { Slot50LanguageMgr } from "./Slot50.LanguageMgr";

const { ccclass, property } = cc._decorator;
@ccclass
export default class Slot50Frame extends cc.Component {

  @property(cc.Node)
  public nHighLight: cc.Node = null;

  @property(sp.Skeleton)
  public skeletonCharactor: sp.Skeleton = null;

  onLoad() {
    this.activeHighLight(false);
  }

  private typeFree: number = 0;
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

  private activeHighLight(isActive: boolean) {
    this.nHighLight.active = isActive;
  }

  public showFrame(result: Slot50Cmd.ImpItemCell, itemFrame: Slot50Cmd.ImpFrame) {
    this.typeFree = itemFrame.typeFree;
    this.scheduleOnce(() => {
      if (result.highlight) {
        this.activeHighLight(result.highlight);
        this.setSkeletionForHighLight(result.id);
      } else {
        this.setSkeletionForDefault(result.id);
      }
    }, 0.1);

    this.scheduleOnce(() => {
      if (itemFrame.totalScratter > 1 && result.id == Slot50Cmd.DEFINE_CHARACTOR.SCATTER) {
        this.setSkeletonScatter(itemFrame.totalScratter);
        this.throwCoinToPumpkin(result, itemFrame);
      }
    }, 0.5)

    /// Chạy Free Game
    if (this.typeFree == 1) {
      this.scheduleOnce(() => {
        this.swapSkeletionForFree(result.oldId);
      }, 1.5);
    } else {
      this.scheduleOnce(() => {
        if (itemFrame.listWild && result.id == Slot50Cmd.DEFINE_CHARACTOR.WILD) {
          this.setSkeletonGoldWild();
        }
        if (itemFrame.listWild && [Slot50Cmd.DEFINE_CHARACTOR.BLUE_SATAN, Slot50Cmd.DEFINE_CHARACTOR.GREEN_SATAN, Slot50Cmd.DEFINE_CHARACTOR.RED_SATAN].indexOf(result.id) > -1) {
          
          this.changeSkeletonGoldCell(result.id);
        }
      }, 1.5);
    }
  }

  private throwCoinToPumpkin(result: Slot50Cmd.ImpItemCell, itemFrame: Slot50Cmd.ImpFrame) {
    // Slot50BgPumpkin.instance.collectionCoin(itemFrame.column, this.index);
  }

  private swapSkeletionForFree(index: number) {
    const defineAnim = Slot50Cmd.DEFINE_CHARACTOR.ANIM_CHARACTOR[index];
    if (defineAnim) {
      this.skeletonCharactor.setSkin(defineAnim.skin);
      this.skeletonCharactor.setAnimation(0, defineAnim.anim_free, true);
    }
  }

  private setSkeletonGoldWild() {
    const defineAnim = Slot50Cmd.DEFINE_CHARACTOR.ANIM_CHARACTOR[Slot50Cmd.DEFINE_CHARACTOR.WILD];
    if(defineAnim) {
      this.skeletonCharactor.node.index = defineAnim.z_index;
      this.skeletonCharactor.setSkin(defineAnim.skin_change);
      this.skeletonCharactor.setAnimation(0, defineAnim.anim_change, true);
    }
  }

  private setSkeletonScatter(totalScratter: number) {
    this.skeletonCharactor.node.index = 1;
    this.skeletonCharactor.setSkin(Slot50Cmd.DEFINE_CHARACTOR.ANIM_SCATTER.skin);
    if(totalScratter < 3) {
      this.skeletonCharactor.setAnimation(0, Slot50Cmd.DEFINE_CHARACTOR.ANIM_SCATTER.anim_2_end, true);
    } else {
      this.skeletonCharactor.setAnimation(0, Slot50Cmd.DEFINE_CHARACTOR.ANIM_SCATTER.anim_3, true);
    }
  }

  private changeSkeletonGoldCell(index: number) {
    const defineAnim = Slot50Cmd.DEFINE_CHARACTOR.ANIM_CHARACTOR[index];
    if (defineAnim) {
      this.skeletonCharactor.node.index = defineAnim.z_index;
      this.skeletonCharactor.setSkin(defineAnim.skin_change);
      this.skeletonCharactor.setAnimation(0, defineAnim.anim_change, true);
    }
  }

  private setSkeletionForHighLight(index: number) {
    const defineAnim = Slot50Cmd.DEFINE_CHARACTOR.ANIM_CHARACTOR[index];
    if (defineAnim) {
      this.skeletonCharactor.node.index = defineAnim.z_index;
      this.skeletonCharactor.setSkin(defineAnim.skin);
      this.skeletonCharactor.setAnimation(0, defineAnim.anim_highlight, true);
    }
  }

  private setSkeletionForDefault(index: number) {
    const defineAnim = Slot50Cmd.DEFINE_CHARACTOR.ANIM_CHARACTOR[index];
    if (defineAnim) {
      this.skeletonCharactor.node.index = defineAnim.z_index;
      this.skeletonCharactor.setSkin(defineAnim.skin);
      this.skeletonCharactor.setAnimation(0, defineAnim.anim_stop, true);
    }
  }

  private setSpriteForCell(index: number) {
    // const spriteFrame = Slot50Cmd.DEFINE_CHARACTOR.SPRITE_CHARACTOR[index].sprite;
    // this.spCharacter.spriteFrame = Slot50Machine.instance.spAtlasCharacter.getSpriteFrame(spriteFrame);
  }
}
