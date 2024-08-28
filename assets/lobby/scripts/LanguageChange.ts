// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { LANGUAGE, LanguageMgr } from "../../framework/localize/LanguageMgr";
import LobbyCtrl from "./LobbyCtrl";
const { ccclass, property } = cc._decorator;

@ccclass
export default class LanguageChanger extends cc.Component {
  public static instance: LanguageChanger = null;

  @property(cc.Node)
  lbLanguage: cc.Node = null;
  @property(cc.Node)
  lbCurrentLanguage: cc.Node = null;
  @property(cc.Node)
  languageOptionContainer: cc.Node = null
  @property(cc.Node)
  arrowDropDown: cc.Node = null

  statusQDTT: number = 1;
  addHeight1: number = 170;

  protected onLoad(): void {
      LanguageChanger.instance = this;
  }

  toggleLanguageOptions(){
    if (this.statusQDTT == 1) {
      this.statusQDTT = 2;
      this.arrowDropDown.setRotation(180)
      this.addHeight(this.languageOptionContainer, this.addHeight1);
      this.spriteGoDown(this.languageOptionContainer);

      this.lbCurrentLanguage.active = true
      this.lbLanguage.active = false
      cc.log(this.node.parent.parent)
      this.node.parent.parent.on(cc.Node.EventType.TOUCH_START, () => {cc.log('w')}, this);

    } else {
      this.statusQDTT = 1;
      this.arrowDropDown.setRotation(0)
      this.spriteGoUp(this.languageOptionContainer);
      this.reduceHeight(this.languageOptionContainer, this.addHeight1);

      this.lbCurrentLanguage.active = false
      this.lbLanguage.active = true 
      cc.log(this.node.parent.parent)

      this.node.parent.parent.off(cc.Node.EventType.TOUCH_START, () => {cc.log('w')}, this);

    }
}

addHeight(node: cc.Node, addHeight: number) {
this.schedule(
  () => {
    node.height += addHeight / 20;
  },
  0.001,
  25
);
}

reduceHeight(node: cc.Node, addHeight: number) {
this.schedule(
  () => {
    node.height -= addHeight / 20;
  },
  0.001,
  25
);
}

spriteGoDown(node: cc.Node) {
this.scheduleOnce(() => {
  let toPos = cc.v2(
    node.children[0].x,
    node.children[0].y - 50
  );
  node.children[0].runAction(
    cc.sequence(cc.fadeIn(0.1), cc.moveTo(0.2, toPos))
  );
 

}, 0.2);
}

spriteGoUp(node: cc.Node) {
let toPos = cc.v2(
  node.children[0].x,
  node.children[0].y + 50
);
node.children[0].runAction(
  cc.sequence(cc.fadeOut(0.1), cc.moveTo(0.1, toPos))
);


}

updateLanguage(event: Event, idx){
switch (idx) {
  case "1":
    BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, "vn")
    LanguageMgr.updateLang("vn")
    LobbyCtrl.instance.emitLogicChoose("vn")
    break;
  case "2":
    BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, "en")
    LanguageMgr.updateLang("en")
    LobbyCtrl.instance.emitLogicChoose("en")

    break;
  case "3":
    BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, "mm")
    LanguageMgr.updateLang("mm")
    LobbyCtrl.instance.emitLogicChoose("mm")

    break;
  default:
    break;
}
this.toggleLanguageOptions()
}



}
