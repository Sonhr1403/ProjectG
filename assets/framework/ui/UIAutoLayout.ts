
const { ccclass, property } = cc._decorator;

@ccclass
export default class UIAutoLayout extends BGUI.UIAutoLayout {
          @property(cc.Enum({
                    type: cc.Enum(BGUI.eAutoLayoutType)
          }))
          type: BGUI.eAutoLayoutType = BGUI.eAutoLayoutType.Raw
}
