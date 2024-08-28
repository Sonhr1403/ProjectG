import UIScrollView from "./UIScrollView";

const { ccclass, property } = cc._decorator;

export enum UIScrollBarDirection {
    HORIZONTAL = 0,
    VERTICAL = 1,
}

var GETTINGSHORTERFACTOR = 20;

@ccclass
export default class UIScrollBar extends BGUI.UIScrollBar {

    @property(cc.Sprite)
    handle: cc.Sprite = null;


    @property({
        type: cc.Enum(UIScrollBarDirection)
    })
    direction: UIScrollBarDirection = UIScrollBarDirection.VERTICAL;

    @property(cc.Boolean)
    enableAutoHide: boolean = true;

    @property(cc.Float)
    autoHideTime: number = 1.0;

}
