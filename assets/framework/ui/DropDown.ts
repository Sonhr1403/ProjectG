import DropDownOptionData from "./DropDownOptionData";
const { ccclass, property } = cc._decorator;

@ccclass()
export default class DropDown extends BGUI.DropDown {
    @property(cc.Node)
    template: cc.Node = undefined;
    @property(cc.Label)
    labelCaption: cc.Label = undefined;
    @property(cc.Sprite)
    spriteCaption: cc.Sprite = undefined;
    @property(cc.Label)
    labelItem: cc.Label = undefined;
    @property(cc.Sprite)
    spriteItem: cc.Sprite = undefined;

    @property([DropDownOptionData])
    optionDatas: DropDownOptionData[] = [];
}
