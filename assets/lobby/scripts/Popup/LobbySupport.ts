import LobbyCtrl from "../LobbyCtrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Support extends cc.Component {
  public static instance: Support = null;

  configFirstGame: any = null;

  @property(cc.Node)
  bgSupport: cc.Node = null;

  //   onEnable(): void {
  //     this.node.runAction(cc.sequence(cc.moveTo(0.1, cc.v2(0, 0))));
  //   }
  //   onDestroy(): void {
  //     this.node.runAction(cc.sequence(cc.moveTo(0.1, cc.v2(450, 0))));
  //   }

  //   toggleSupportOn() {
  //     this.popupSupport.runAction(
  //       cc.sequence(
  //         cc.moveTo(0.1, cc.v2(0, 0)),
  //         cc.callFunc(() => {
  //           this.popupSupport.children[0].active = true;
  //         })
  //       )
  //     );
  //   }

  //   toggleSupportOff() {
  //     this.popupSupport.runAction(
  //       cc.sequence(
  //         cc.callFunc(() => {
  //           this.popupSupport.children[0].active = false;
  //         }),
  //         cc.moveTo(0.1, cc.v2(450, 0))
  //       )
  //     );
  //   }

  onClickFanpage() {
    cc.sys.openURL(this.configFirstGame && this.configFirstGame.facebook);
  }
  onClickZalo() {
    cc.sys.openURL(
      this.configFirstGame &&
        this.configFirstGame.cskh &&
        this.configFirstGame.cskh.zalo
    );
  }
  onClickMessenger() {
    cc.sys.openURL(
      this.configFirstGame &&
        this.configFirstGame.cskh &&
        this.configFirstGame.cskh.messenger
    );
  }
  onClickTele() {
    cc.sys.openURL(
      this.configFirstGame &&
        this.configFirstGame.cskh &&
        this.configFirstGame.cskh.telegram
    );
  }

  onClickLine() {
    cc.sys.openURL(
      this.configFirstGame &&
        this.configFirstGame.cskh &&
        this.configFirstGame.cskh.line
    );
  }

  onClickTalk() {
    cc.sys.openURL(
      this.configFirstGame &&
        this.configFirstGame.cskh &&
        this.configFirstGame.cskh.ka_kao_talk
    );
  }

  // unHide() {
  //   this.node.active = true;
  //   this.bgSupport.runAction(cc.moveTo(0.4, cc.v2(0, 0)));
  //   this.scheduleOnce(
  //     () =>
  //       (LobbyCtrl.instance.btnSupport.getComponent(cc.Button).interactable =
  //         true),
  //     0.5
  //   );
  // }

  hide() {
    //525.5,0

    LobbyCtrl.instance.btnSupport.getComponent(cc.Button).interactable = false;

    this.node.runAction(
      cc.sequence(
        cc.moveBy(0.3, 450, 0),
        cc.callFunc(
          () => (
            (LobbyCtrl.instance.btnSupport.getComponent(
              cc.Button
            ).interactable = true),
            (this.node.active = false),
            (LobbyCtrl.instance.supportBlock.active = false)
          ),
        )
      )
    );
    // this.scheduleOnce(() => (this.node.active = false), 0.33);
  }
}
