import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import BOOGYIController from "./BOOGYI.Controller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BOOGYIPopUpGuide extends cc.Component {
  @property(cc.Node)
  public btnBoiSo: cc.Node = null;

  @property(cc.Node)
  public btnHuongDan: cc.Node = null;

  @property(cc.ScrollView)
  public sv: cc.ScrollView = null;

  @property(cc.Node)
  public cHuongDan: cc.Node = null;

  @property(cc.Node)
  public cBoiSo: cc.Node = null;

  @property(cc.SpriteFrame)
  public btnSpriteFrame: cc.SpriteFrame[] = [];

  @property(cc.SpriteFrame)
  public arrowSpriteFrame: cc.SpriteFrame[] = [];

  @property(cc.Node)
  public QDTT: cc.Node = null;

  @property(cc.Node)
  public CCC: cc.Node = null;

  @property(cc.Node)
  public LC: cc.Node = null;

  page = 1;

  statusQDTT: number = 1;
  statusCCC: number = 1;
  statusLC: number = 1;

  addHeight1: number = 0;
  addHeight2: number = 0;
  addHeight3: number = 0;
  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  // start() {}

  show() {
    if (this.page == 1) {
      this.btnBoiSo.getComponent(cc.Button).interactable = false;
      this.btnBoiSo.getComponent(cc.Sprite).spriteFrame =
        this.btnSpriteFrame[1];
      this.btnBoiSo.children[0].getComponent(cc.LabelOutline).color = cc.color(
        159,
        75,
        7,
        255
      );
      this.btnHuongDan.getComponent(cc.Button).interactable = true;
      this.btnHuongDan.getComponent(cc.Sprite).spriteFrame =
        this.btnSpriteFrame[0];
      this.btnHuongDan.children[0].getComponent(cc.LabelOutline).color =
        cc.color(161, 141, 100, 255);
      this.cBoiSo.active = true;
      this.cHuongDan.active = false;
      this.sv.content = this.cBoiSo;
    } else {
      this.btnBoiSo.getComponent(cc.Button).interactable = true;
      this.btnBoiSo.getComponent(cc.Sprite).spriteFrame =
        this.btnSpriteFrame[0];
      this.btnBoiSo.children[0].getComponent(cc.LabelOutline).color = cc.color(
        161,
        141,
        100,
        255
      );
      this.btnHuongDan.getComponent(cc.Button).interactable = false;
      this.btnHuongDan.getComponent(cc.Sprite).spriteFrame =
        this.btnSpriteFrame[1];
      this.btnHuongDan.children[0].getComponent(cc.LabelOutline).color =
        cc.color(159, 75, 7, 255);
      this.cBoiSo.active = false;
      this.cHuongDan.active = true;
      this.sv.content = this.cHuongDan;
    }
  }

  boiSoOnClick() {
    this.page = 1;
    this.show();
  }

  quyDinhOnClick() {
    this.page = 2;
    this.show();
  }

  public onClickClose() {
    this.node.active = false;
    BOOGYIController.instance.isPopUpGuide = false;
  }

  public popDown(CustomEvent: CustomEvent, index: number) {
    switch (Number(index)) {
      case 1:
        if (this.statusQDTT == 1) {
          this.statusQDTT = 2;
          this.QDTT.children[3].getComponent(cc.Sprite).spriteFrame =
            this.arrowSpriteFrame[1];
          this.addHeight1 =
            this.QDTT.children[0].children[0].height -
            this.QDTT.children[0].height;
          this.addHeight(this.QDTT, this.addHeight1);
          this.spriteGoDown(this.QDTT);
        } else {
          this.statusQDTT = 1;
          this.QDTT.children[3].getComponent(cc.Sprite).spriteFrame =
            this.arrowSpriteFrame[0];
          this.spriteGoUp(this.QDTT);
          this.reduceHeight(this.QDTT, this.addHeight1);
        }
        this.noSpam(this.QDTT.getComponent(cc.Button));
        break;

      case 2:
        if (this.statusCCC == 1) {
          this.statusCCC = 2;
          this.CCC.children[3].getComponent(cc.Sprite).spriteFrame =
            this.arrowSpriteFrame[1];
          this.addHeight2 =
            this.CCC.children[0].children[0].height -
            this.CCC.children[0].height;
          this.addHeight(this.CCC, this.addHeight2);
          this.spriteGoDown(this.CCC);
        } else {
          this.statusCCC = 1;
          this.CCC.children[3].getComponent(cc.Sprite).spriteFrame =
            this.arrowSpriteFrame[0];
          this.spriteGoUp(this.CCC);
          this.reduceHeight(this.CCC, this.addHeight2);
        }
        this.scrollTo(0.75);
        this.noSpam(this.CCC.getComponent(cc.Button));
        break;

      case 3:
        if (this.statusLC == 1) {
          this.statusLC = 2;
          this.LC.children[3].getComponent(cc.Sprite).spriteFrame =
            this.arrowSpriteFrame[1];
          this.addHeight3 =
            this.LC.children[0].children[0].height - this.LC.children[0].height;
          this.addHeight(this.LC, this.addHeight3);
          this.spriteGoDown(this.LC);
        } else {
          this.statusLC = 1;
          this.LC.children[3].getComponent(cc.Sprite).spriteFrame =
            this.arrowSpriteFrame[0];
          this.spriteGoUp(this.LC);
          this.reduceHeight(this.LC, this.addHeight3);
        }
        this.scrollTo(0);
        this.noSpam(this.LC.getComponent(cc.Button));
        break;
    }
  }

  addHeight(node: cc.Node, addHeight: number) {
    this.schedule(
      () => {
        node.children[0].height += addHeight / 20;
        node.children[0].setPosition(
          node.children[0].position.x,
          node.children[0].position.y - addHeight / 45
        );
        node.height += addHeight / 20;
      },
      0.001,
      25
    );
  }

  reduceHeight(node: cc.Node, addHeight: number) {
    this.schedule(
      () => {
        node.children[0].height -= addHeight / 20;
        node.children[0].setPosition(
          node.children[0].position.x,
          node.children[0].position.y + addHeight / 45
        );
        node.height -= addHeight / 20;
      },
      0.001,
      25
    );
  }

  spriteGoDown(node: cc.Node) {
    this.scheduleOnce(() => {
      let toPos = cc.v2(
        node.children[0].children[0].x,
        node.children[0].children[0].y - 50
      );
      node.children[0].children[0].runAction(
        cc.sequence(cc.fadeIn(0.1), cc.moveTo(0.2, toPos))
      );
    }, 0.3);
  }

  spriteGoUp(node: cc.Node) {
    let toPos = cc.v2(
      node.children[0].children[0].x,
      node.children[0].children[0].y + 50
    );
    node.children[0].children[0].runAction(
      cc.sequence(cc.fadeOut(0.1), cc.moveTo(0.1, toPos))
    );
  }

  scrollTo(percent: number){
    this.scheduleOnce(()=> {
      this.sv.scrollToPercentVertical(percent);
    }, 0.5)
  }

  noSpam(node: cc.Button){
    node.interactable = false;
    this.scheduleOnce(()=>{
      node.interactable = true;
    },0.5)
  }
}
