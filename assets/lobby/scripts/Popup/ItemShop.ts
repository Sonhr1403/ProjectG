

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemShop extends cc.Component {
  public static instance: ItemShop = null;

 

  configFirstGame: any = null;
  @property(cc.Label)
  lblPrice: cc.Label = null;
  @property(cc.Label)
  lblPriceDiscount: cc.Label = null;
  @property(cc.Label)
  lblVPrice: cc.Label = null;
  @property(cc.Label)
  lblVipPrice: cc.Label = null;
  @property(cc.Label)
  lblBuyPrice: cc.Label = null;
  
  @property(cc.Node)
  bannerDiscount: cc.Node = null;

  @property(cc.Sprite)
  Icon: cc.Sprite = null;
  @property(cc.SpriteFrame)
  iconList: Array<cc.SpriteFrame> = [];


initItem(idx = 0) {
  
  

  
  this.bannerDiscount.active = true;
  this.Icon.spriteFrame = this.iconList[idx]
}
}
