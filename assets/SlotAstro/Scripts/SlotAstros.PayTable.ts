
import SlotAstrosController from "./SlotAstros.Controller";
import SlotAstrosMusicManager, { SLOT_SOUND_TYPE } from "./SlotAstros.Music";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotAstrosPayTable extends cc.Component {
  @property(cc.Node)
  private listPage: cc.Node[] = [];

  @property(cc.Node)
  private dotNode: cc.Node = null;

  @property(cc.Node)
  private logo: cc.Node = null;

  @property(cc.Node)
  private plate: cc.Node = null;

  @property(cc.Sprite)
  private titleS: cc.Sprite = null;

  @property(cc.SpriteAtlas)
  private titleSF: cc.SpriteAtlas = null;

  @property(cc.SpriteFrame)
  private listDotSF: cc.SpriteFrame[] = [];

  @property(cc.Button)
  private listButton: cc.Button[] = [];

  // @property(cc.Label)
  // private listLabel: cc.Label[] = [];

  ////////////////////////////////////////////////////

  private page = 0;

  private listX = [-1052, 0, 1052];

  private title = {
    "1": "paytable2Title",
    "2": "paytable3Title",
    "3": "paytable4Title",
    "4": "paytable5Title",
    "5": "paytable6Title"
  }

  // private listValue = [23.5, 7.25, 3.5, 2.25, 1, 0.625, 0.375, 0.25];

  // LIFE-CYCLE CALLBACKS:

  public onOpenPays() {
    this.node.active = true;
    cc.tween(this.node).to(0.25, { opacity: 255 }).start();
    this.changeDot(0);
    cc.tween(this.listPage[0]).to(0.25, { opacity: 255 }).start();
    cc.tween(this.plate).to(0.25, { opacity: 0 }).start();
    for (let i = 1; i < 7; i++) {
        this.listPage[i].setPosition(cc.v2(this.listX[2], 0));
      this.page = 0;
      this.changeDot(1);
    }
    // this.updateLabel();
  }

  // private updateLabel() {
  //   let bet =
  //     SlotAstrosController.instance.listBet[SlotAstrosController.instance.betOrdi];
  //   for (let i = 0; i < this.listLabel.length; i++) {
  //     this.listLabel[i].string = BGUI.Utils.formatMoneyWithCommaOnly(
  //       this.listValue[i] * bet
  //     );
  //   }
  // }

  private onClickPlay() {
    // SlotAstrosMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    cc.tween(this.node)
      .to(0.25, { opacity: 0 })
      .call(() => {
        this.node.active = false;
        SlotAstrosController.instance.startGame();
      })
      .start();
  }

  private onClickLeft() {
    // SlotAstrosMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.enableBtn(false);
    this.changeDot(0);
    if (this.page === 0) {
      cc.tween(this.listPage[this.page])
        .to(0.25, { opacity: 0 }, { easing: "" })
        .start();
    } else {
      cc.tween(this.listPage[this.page])
        .to(0.25, { position: cc.v3(this.listX[2],0, 0) }, { easing: "" })
        .start();
    }

    this.scheduleOnce(() => {
      this.page -= 1;
      if (this.page < 0) {
        this.page = 6;
        cc.tween(this.plate).to(0.25, { opacity: 255 }).start();
        cc.tween(this.listPage[0]).to(0.25, { opacity: 0 }).start();
        let delay = 0;
        for (let i = 1; i < 7; i++) {
          if (i !== 6) {
            cc.tween(this.listPage[i])
              .delay(delay)
              .to(0.05, { position: cc.v3(this.listX[0],0, 0) })
              .start();
            delay += 0.05;
          } else {
            this.listPage[i].setPosition(cc.v2(this.listX[2],0));
            cc.tween(this.listPage[i])
              .delay(delay)
              .to(0.05, { position: cc.v3(this.listX[1],0, 0) })
              .start();
          }
        }
      } else if (this.page > 0) {
        cc.tween(this.listPage[this.page])
          .to(0.25, { position: cc.v3(this.listX[1],0, 0) }, { easing: "" })
          .start();
      } else if (this.page === 0) {
        cc.tween(this.plate).to(0.25, { opacity: 0 }).start();
        cc.tween(this.listPage[this.page])
          .to(0.25, { opacity: 255 })
          .call(() => {
            this.logo
              .getComponent(sp.Skeleton)
              .setAnimation(0, "appear", false);
            this.scheduleOnce(() => {
              this.logo
                .getComponent(sp.Skeleton)
                .setAnimation(0, "default", true);
            }, 1.5);
          })
          .start();
      }
      this.updateTitle();
      this.changeDot(1);
      this.scheduleOnce(()=>{
        this.enableBtn(true);
      }, 0.25)
    }, 0.25);
  }

  private onClickRight() {
    // SlotAstrosMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.enableBtn(false);
    this.changeDot(0);
    if (this.page === 0) {
      cc.tween(this.listPage[this.page])
        .to(0.25, { opacity: 0 }, { easing: "" })
        .start();
    } else {
      cc.tween(this.listPage[this.page])
        .to(0.25, { position: cc.v3(this.listX[0],0, 0) }, { easing: "" })
        .start();
    }

    this.scheduleOnce(() => {
      this.page += 1;
      this.updateTitle();
      if (this.page > 6) {
        this.page = 0;
        let delay = 0;
        for (let i = 6; i > 0; i--) {
          cc.tween(this.listPage[i])
            .delay(delay)
            .to(0.05, { position: cc.v3(this.listX[2],0, 0) })
            .start();
          delay += 0.05;
        }
        this.scheduleOnce(() => {
          cc.tween(this.plate).to(0.25, { opacity: 0 }).start();
          cc.tween(this.listPage[0])
            .to(0.25, { opacity: 255 })
            .call(() => {
              this.logo
                .getComponent(sp.Skeleton)
                .setAnimation(0, "appear", false);
              this.scheduleOnce(() => {
                this.logo
                  .getComponent(sp.Skeleton)
                  .setAnimation(0, "default", true);
              }, 1.5);
            })
            .start();
        }, delay);
      } else if (this.page <= 6) {
        if (this.page === 1) {
          cc.tween(this.plate).to(0.25, { opacity: 255 }).start();
        }
        cc.tween(this.listPage[this.page])
          .to(0.25, { position: cc.v3(this.listX[1],0, 0) }, { easing: "" })
          .start();
      }
      this.updateTitle();
      this.changeDot(1);
      this.scheduleOnce(()=>{
        this.enableBtn(true);
      }, 0.25)
    }, 0.25);
  }

  private changeDot(i: number) {
    this.dotNode
      .getChildByName(this.page.toString())
      .getComponent(cc.Sprite).spriteFrame = this.listDotSF[i];
  }

  private enableBtn(enabled: boolean){
    this.listButton.forEach(element => {
      element.interactable = enabled;
    });
  }

  private updateTitle(){
    switch (this.page) {
      case 6:
        this.titleS.spriteFrame = this.titleSF.getSpriteFrame(this.title["5"]);
        break;
    
      default:
        this.titleS.spriteFrame = this.titleSF.getSpriteFrame(this.title[this.page.toString()]);
        break;
    
    }
  }

  private enableDot(){ 
    cc.tween(this.dotNode).by(0.25, {position: cc.v3(0, 20, 0), opacity: 255}).call(()=>{
      this.scheduleOnce(()=>{
        cc.tween(this.dotNode).by(0.25, {position: cc.v3(0, -20, 0), opacity: 0}).start();
      })
    }).start();
  }
}
