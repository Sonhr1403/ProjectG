import WukongCommon from "./Wukong.Common";
import WukongMain from "./Wukong.Controller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WukongGuide extends cc.Component {
  public static instance: WukongGuide = null;

  @property(cc.Node)
  guideContent: cc.Node = null;
  @property(cc.Node)
  payoutSymbolLbl: cc.Node[] = [];
  @property(cc.Label)
  progressLbl: cc.Label = null;
  currentPage: number = 0;
  payoutMultiplier = [
    200, 50, 10, 150, 30, 10, 150, 30, 10, 100, 20, 10, 50, 10, 4, 50, 10, 4,
    50, 10, 4, 50, 10, 4,
  ];

  onEnable(): void {
    this.currentPage = 0;
    for (let i = 0; i < this.guideContent.children.length; i++) {
      this.guideContent.children[i].active = false;
      if (i == 0) {
        this.guideContent.children[i].active = true;
      }
    }

    this.progressLbl.string = "1/12";
    this.renderSymbolPayout();
  }

  onLoad(): void {
    WukongGuide.instance = this;
    this.currentPage = 0;
  }

  changePage(event, idx) {
    this.currentPage += Number(idx);
    if (this.currentPage > 11) {
      this.currentPage = 0;
    } else if (this.currentPage < 0) {
      this.currentPage = 11;
    }
    for (let i = 0; i < this.guideContent.children.length; i++) {
      this.guideContent.children[i].active = false;
      if (i == this.currentPage) {
        this.guideContent.children[i].active = true;
      }
    }
    let updatedPage = this.currentPage + 1;
    this.progressLbl.string = updatedPage.toString() + "/12";
  }

  hideNode() {
    this.node.active = false;
    this.node.parent.active = false;
  }

  renderSymbolPayout() {
    for (let i = 0; i < this.payoutSymbolLbl.length; i++) {
      if (i % 3 == 0) {
        this.payoutSymbolLbl[i].getComponent(cc.Label).string =
          "x5 = x" + this.payoutMultiplier[i].toString();
        // WukongCommon.numberWithCommas(
        //   WukongMain.instance.currentBetLV * this.payoutMultiplier[i]
        // );
      } else if (i % 3 == 1) {
        this.payoutSymbolLbl[i].getComponent(cc.Label).string =
          "x4 = x" + this.payoutMultiplier[i].toString();
        // WukongCommon.numberWithCommas(
        //   WukongMain.instance.currentBetLV * this.payoutMultiplier[i]
        // );
      } else if (i % 3 == 2) {
        this.payoutSymbolLbl[i].getComponent(cc.Label).string =
          "x3 = x" + this.payoutMultiplier[i].toString();
        // WukongCommon.numberWithCommas(
        //   WukongMain.instance.currentBetLV * this.payoutMultiplier[i]
        // );
      }
    }
  }

  // receiveListFriend(cmdId: any, data: Uint8Array) {
  //   let res = new cmdReceive.ReceivedListFriend();
  //   res.unpackData(data);
  //   console.log("HHHHH LIST_FRIEND", res);
  //   switch (res.error) {
  //     case 0:
  //       this.friendListName = res.list
  //       this.createFriend(res.list);
  //       break;
  //     default:
  //       console.error("receiveListFriend ERROR", res.error);
  //       break;
  //   }
  // }
}
