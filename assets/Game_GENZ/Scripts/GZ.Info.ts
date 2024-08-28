import GenZCommon from "./GZ.Common";
import GenZMain from "./GZ.Controller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GenZGuide extends cc.Component {
  public static instance: GenZGuide = null;

  @property(cc.Node)
  guideContent: cc.Node = null;
  @property(cc.Node)
  payoutSymbolLbl: cc.Node[] = [];
  @property(cc.Label)
  progressLbl: cc.Label = null;
  @property(cc.Node)
  public versionInfoNode: cc.Node = null;
  @property(cc.Node)
  public versionToggle: cc.Node = null;
  currentPage: number = 0;
  payoutMultiplier = [
    1.5, 0.75, 0.3, 0.2, 0.075,  //Rose
    0.6, 0.3, 0.15, 0.1, 0.05,   //Lisa
    0.4, 0.2, 0.1,  0.075, 0.035, //Jisso
    0.3, 0.15, 0.075,  0.05, 0.02, //Jennie
    0.3, 0.15, 0.05,  0.04, 0.015, //Balloon
    0.3, 0.15, 0.05,  0.04, 0.015, //Stick
    0.4, 0.1, 0.03,  0.02, 0.01, //Common
  ];

  onEnable(): void {
    this.currentPage = 0;
    for (let i = 0; i < this.guideContent.children.length; i++) {
      this.guideContent.children[i].active = false;
      if (i == 0) {
        this.guideContent.children[i].active = true;
      }
    }

    if (!GenZMain.instance.isMobile) {
      this.versionToggle.on(cc.Node.EventType.MOUSE_ENTER, this.showVersionLabel, this);
      this.versionToggle.on(cc.Node.EventType.MOUSE_LEAVE, this.hideVersionLabel, this);
    }else{
      this.versionToggle.on(cc.Node.EventType.TOUCH_START, this.showVersionLabel, this);
      this.versionToggle.on(cc.Node.EventType.TOUCH_END, this.hideVersionLabel, this);
      this.versionToggle.on(cc.Node.EventType.TOUCH_CANCEL, this.hideVersionLabel, this);
    }

    this.progressLbl.string = "1/9";
    this.renderSymbolPayout();
  }

  onLoad(): void {
    GenZGuide.instance = this;
    this.currentPage = 0;
  }

  showVersionLabel(){
    this.versionInfoNode.opacity = 150
  }

  hideVersionLabel(){
    this.versionInfoNode.opacity = 0
  }

  changePage(event, idx) {
    this.currentPage += Number(idx);
    if (this.currentPage > 8) {
      this.currentPage = 0;
    } else if (this.currentPage < 0) {
      this.currentPage = 8;
    }
    for (let i = 0; i < this.guideContent.children.length; i++) {
      this.guideContent.children[i].active = false;
      if (i == this.currentPage) {
        this.guideContent.children[i].active = true;
      }
    }
    let updatedPage = this.currentPage + 1;
    this.progressLbl.string = updatedPage.toString() + "/9";
  }

  hideNode() {
    this.node.active = false;
   
  }

  renderSymbolPayout() {
    for (let i = 0; i < this.payoutSymbolLbl.length; i++) {
      switch (i % 5) {
        case 0:
          this.payoutSymbolLbl[i].getComponent(cc.Label).string =
          "x7 = " + GenZCommon.numberWithCommas(Math.round(this.payoutMultiplier[i]*GenZMain.instance.currentBetLV)).toString();
          break;
        case 1:
          this.payoutSymbolLbl[i].getComponent(cc.Label).string =
          "x6 = " + GenZCommon.numberWithCommas(Math.round(this.payoutMultiplier[i]*GenZMain.instance.currentBetLV)).toString();
          break;
        case 2:
          this.payoutSymbolLbl[i].getComponent(cc.Label).string =
          "x5 = " + GenZCommon.numberWithCommas(Math.round(this.payoutMultiplier[i]*GenZMain.instance.currentBetLV)).toString();
          break;
        case 3:
          this.payoutSymbolLbl[i].getComponent(cc.Label).string =
          "x4 = " + GenZCommon.numberWithCommas(Math.round(this.payoutMultiplier[i]*GenZMain.instance.currentBetLV)).toString();
          break;
        case 4:
          this.payoutSymbolLbl[i].getComponent(cc.Label).string =
          "x3 = " + GenZCommon.numberWithCommas(Math.round(this.payoutMultiplier[i]*GenZMain.instance.currentBetLV)).toString();
          break;
      }





      // if (i % 3 == 0) {
      //   this.payoutSymbolLbl[i].getComponent(cc.Label).string =
      //     "x5 = x" + this.payoutMultiplier[i].toString();
      // } else if (i % 3 == 1) {
      //   this.payoutSymbolLbl[i].getComponent(cc.Label).string =
      //     "x4 = x" + this.payoutMultiplier[i].toString();
      // } else if (i % 3 == 2) {
      //   this.payoutSymbolLbl[i].getComponent(cc.Label).string =
      //     "x3 = x" + this.payoutMultiplier[i].toString();
      // }
    }
  }
}
