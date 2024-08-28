import ThanhGiongCommon from "./ThanhGiong.Common";
import ThanhGiongSlotMachine from "./ThanhGiong.SlotMachine";
const { ccclass, property } = cc._decorator;

@ccclass
export default class ThanhGiongCellSpecial extends cc.Component {
  @property(cc.Sprite)
  private sprCharater: cc.Sprite = null;
  @property(sp.Skeleton)
  private boosterRing: sp.Skeleton = null;
  @property(cc.Node)
  private viewMask: cc.Node = null;
  private highlight: boolean = false;
  private winArray = [];
  private id: number = -1;
  
}
