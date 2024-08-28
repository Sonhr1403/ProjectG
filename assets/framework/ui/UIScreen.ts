const { ccclass, property } = cc._decorator;

@ccclass
export default class UIScreen extends BGUI.UIScreen {
          @property(cc.Boolean)
          hideCurScreenOnShow: boolean = true;

}
