


const { ccclass, property } = cc._decorator;

@ccclass
export default class UITouchHandler extends BGUI.UITouchHandler {

    @property(cc.Component.EventHandler)
    touchEvent: cc.Component.EventHandler = new cc.Component.EventHandler();

    @property
    longClickEnabled: boolean = false;
}