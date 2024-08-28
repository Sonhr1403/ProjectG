import UITabbarItem from "./UITabbarItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UITabbarController extends BGUI.UITabbarController {

    @property([UITabbarItem])
    items: UITabbarItem[] = [];


    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Label)
    titleLabel: cc.Label = null;

    @property(cc.Integer)
    startIndex: number = 0;


   
}
