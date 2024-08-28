// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { LanguageMgr } from "../../framework/localize/LanguageMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class songkranNoti extends cc.Component {
  public static instance: songkranNoti = null;

  @property(cc.Label)
  private notiContent: cc.Label = null;

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    songkranNoti.instance = this;
  }

  public openNoti(num: number) {
    let msg = "";
    switch (num) {
      case 0:
        msg = LanguageMgr.getString("songkran.connection_error");
        break;
        
      case 1:
        msg = LanguageMgr.getString("songkran.connection_error1");
        break;

      case 2:
        msg = LanguageMgr.getString("songkran.connection_end");
        break;

      case 3:
        msg = LanguageMgr.getString("songkran.not_enough_money");
        break;

      case 4:
        msg = LanguageMgr.getString("songkran.spin_error");
        break;
    }

    if (!this.node.active) {
    // if (false) {
        this.node.active = true;
    }

    this.notiContent.string = msg;
  }
}
