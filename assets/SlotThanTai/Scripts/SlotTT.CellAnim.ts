import { SlotCmd } from "./SlotTT.Cmd";
import SlotTTCommon from "./SlotTT.Common";
import SlotTTMusicManager, { SLOT_SOUND_TYPE } from "./SlotTT.Music";
import SlotTTMachine from "./SlotTT.SlotMachine";

const { ccclass, property } = cc._decorator;
@ccclass
export default class SlotTTCell extends cc.Component {
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

  public setAnim(animName: string) {
    if (this.itemCell.id === 0) {
      this.skeletonCharacter.skeletonData =
      SlotTTMachine.instance.listSyms[this.itemCell.id];
    } else {
      this.skeletonCharacter.skeletonData =
      SlotTTMachine.instance.listSyms[this.itemCell.id - 3];
    }

    this.skeletonCharacter.defaultSkin = "default";
    this.skeletonCharacter.loop = true;
    this.skeletonCharacter.defaultAnimation = animName;
    this.skeletonCharacter.setAnimation(0, animName, true);
  }

  public setRandom(animName: string) {
    let ran = SlotTTCommon.getRandomNumber(4, 9);
    this.skeletonCharacter.skeletonData = SlotTTMachine.instance.listSyms[ran - 3];
    this.skeletonCharacter.defaultSkin = "default";
    this.skeletonCharacter.loop = true;
    this.skeletonCharacter.defaultAnimation = animName;
    this.skeletonCharacter.setAnimation(0, animName, true);
  }
}
