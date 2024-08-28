
const {ccclass, property} = cc._decorator;
@ccclass
export default class UIJoystick extends BGUI.UIJoystick {

    @property(cc.Node)
    analog: cc.Node = null;

    @property(cc.Node)
    background: cc.Node = null;

    @property
    radius: number = 60;

    @property
    touchAnyWhereToStart: boolean = true;

    @property
    followFinger: boolean = true;


}
