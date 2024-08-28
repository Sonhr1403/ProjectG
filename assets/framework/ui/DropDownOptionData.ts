const {ccclass, property} = cc._decorator;

@ccclass("DropDownOptionData")
export default class DropDownOptionData extends BGUI.DropDownOptionData{
    @property()
    optionString: string = "";

    @property(cc.SpriteFrame)
    optionSf: cc.SpriteFrame = undefined;
}
