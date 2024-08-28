const { ccclass, property } = cc._decorator;

import { RouletteNetwork } from "./Roulette.Cmd";
import RouletteController from "./Roulette.Controller";

@ccclass
export default class RLTUSERDETAIL extends cc.Component {
  @property(cc.Prefab)
  private itemDetail: cc.Prefab = null;

  @property(cc.Prefab)
  private cell: cc.Prefab = null;

  @property(cc.Node)
  private content: cc.Node = null;

  @property(cc.SpriteFrame)
  private sfdetail: cc.SpriteFrame[] = [];

  @property(cc.ScrollView)
  private detailScrollView: cc.ScrollView = null;

  private stepScroll = 1 / 10;
  private currentScroll = 0;

  /////////////////////////////////////////////////////////////

  public createItem(details) {
    cc.log(details);
    this.content.removeAllChildren();
    this.stepScroll = 1 / (details.length + (details.length * 10) / 287);
    for (let detail of details) {
      if (detail.doorBet > 0) {
        let _itemDetail = cc.instantiate(this.itemDetail);
        this.setPicDetail(_itemDetail.getChildByName("pic"), detail.door);
        _itemDetail.getChildByName("LbAmount").getComponent(cc.Label).string =
          detail.doorBet;
        this.content.addChild(_itemDetail);
      }
    }
  }

  protected onClickClose() {
    this.activeTrans(false);
    this.content.removeAllChildren();
    RouletteController.instance.checkClick();
  }

  private activeTrans(isActive: boolean) {
    this.node.active = isActive;
  }

  private setPicDetail(pic: cc.Node, door: number) {
    let listCell = RouletteNetwork.Config.List[door];
    cc.log("listCell", listCell);
    let _cell1 = cc.instantiate(this.cell);
    let _cell2 = cc.instantiate(this.cell);
    let _cell3 = cc.instantiate(this.cell);
    let _cell4 = cc.instantiate(this.cell);
    let _cell5 = cc.instantiate(this.cell);
    let _cell6 = cc.instantiate(this.cell);

    switch (door) {
      case 0:
        pic.getComponent(cc.Layout).enabled = false;
        pic.getComponent(cc.Sprite).spriteFrame = this.sfdetail[3];
        pic.width = 121;
        pic.height = 241;
        break;

      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
      case 16:
      case 17:
      case 18:
      case 19:
      case 20:
      case 21:
      case 22:
      case 23:
      case 24:
      case 25:
      case 26:
      case 27:
      case 28:
      case 29:
      case 30:
      case 31:
      case 32:
      case 33:
      case 34:
      case 35:
      case 36:
        pic.getComponent(cc.Layout).enabled = false;
        pic.getComponent(cc.Sprite).spriteFrame = this.sfdetail[0];
        pic.width = 101;
        pic.height = 129;
        let x = this.checkCell(door);
        _cell1.getComponent(cc.Sprite).spriteFrame = this.sfdetail[x];
        _cell1.children[0].getComponent(cc.Label).string = door.toString();
        pic.addChild(_cell1);
        break;

      case 37:
        pic.getComponent(cc.Layout).enabled = false;
        pic.getComponent(cc.Sprite).spriteFrame = this.sfdetail[11];
        pic.width = 158;
        pic.height = 113;
        break;

      case 38:
        pic.getComponent(cc.Layout).enabled = false;
        pic.getComponent(cc.Sprite).spriteFrame = this.sfdetail[12];
        pic.width = 158;
        pic.height = 113;
        break;

      case 39:
        pic.getComponent(cc.Layout).enabled = false;
        pic.getComponent(cc.Sprite).spriteFrame = this.sfdetail[14];
        pic.width = 158;
        pic.height = 113;
        break;

      case 40:
        pic.getComponent(cc.Layout).enabled = false;
        pic.getComponent(cc.Sprite).spriteFrame = this.sfdetail[13];
        pic.width = 158;
        pic.height = 113;
        break;

      case 41:
        pic.getComponent(cc.Layout).enabled = false;
        pic.getComponent(cc.Sprite).spriteFrame = this.sfdetail[15];
        pic.width = 158;
        pic.height = 113;
        break;

      case 42:
        pic.getComponent(cc.Layout).enabled = false;
        pic.getComponent(cc.Sprite).spriteFrame = this.sfdetail[16];
        pic.width = 158;
        pic.height = 113;
        break;

      case 43:
        pic.getComponent(cc.Layout).enabled = false;
        pic.getComponent(cc.Sprite).spriteFrame = this.sfdetail[17];
        pic.width = 217;
        pic.height = 85;
        break;

      case 44:
        pic.getComponent(cc.Layout).enabled = false;
        pic.getComponent(cc.Sprite).spriteFrame = this.sfdetail[18];
        pic.width = 217;
        pic.height = 85;
        break;

      case 45:
        pic.getComponent(cc.Layout).enabled = false;
        pic.getComponent(cc.Sprite).spriteFrame = this.sfdetail[19];
        pic.width = 217;
        pic.height = 85;
        break;

      case 49:
        pic.getComponent(cc.Layout).enabled = false;
        pic.getComponent(cc.Sprite).spriteFrame = this.sfdetail[4];
        pic.width = 175;
        pic.height = 241;
        break;

      case 50:
        pic.getComponent(cc.Layout).enabled = false;
        pic.getComponent(cc.Sprite).spriteFrame = this.sfdetail[5];
        pic.width = 175;
        pic.height = 241;
        break;

      case 156:
        pic.getComponent(cc.Layout).enabled = false;
        pic.getComponent(cc.Sprite).spriteFrame = this.sfdetail[7];
        pic.width = 175;
        pic.height = 241;
        break;

      case 51:
      case 53:
      case 56:
      case 58:
      case 61:
      case 63:
      case 66:
      case 68:
      case 71:
      case 73:
      case 76:
      case 78:
      case 81:
      case 83:
      case 86:
      case 88:
      case 91:
      case 93:
      case 96:
      case 98:
      case 101:
      case 103:
      case 106:
      case 107:
        pic.width = 101;
        pic.scaleX = 0.8;
        pic.scaleY = 0.8;
        pic.getComponent(cc.Layout).enabled = true;
        pic.getComponent(cc.Layout).type = cc.Layout.Type.VERTICAL;
        pic.getComponent(cc.Layout).verticalDirection =
          cc.Layout.VerticalDirection.BOTTOM_TO_TOP;
        pic.getComponent(cc.Layout).paddingTop = 12.75;
        pic.getComponent(cc.Layout).paddingBottom = 12.75;
        pic.getComponent(cc.Sprite).spriteFrame = this.sfdetail[0];

        _cell1.getComponent(cc.Sprite).spriteFrame =
          this.sfdetail[this.checkCell(listCell[0])];
        _cell1.children[0].getComponent(cc.Label).string =
          listCell[0].toString();
        _cell2.getComponent(cc.Sprite).spriteFrame =
          this.sfdetail[this.checkCell(listCell[1])];
        _cell2.children[0].getComponent(cc.Label).string =
          listCell[1].toString();

        pic.addChild(_cell1);
        pic.addChild(_cell2);

        break;

      case 52:
      case 54:
      case 55:
      case 57:
      case 59:
      case 60:
      case 62:
      case 64:
      case 65:
      case 67:
      case 69:
      case 70:
      case 72:
      case 74:
      case 75:
      case 77:
      case 79:
      case 80:
      case 82:
      case 84:
      case 85:
      case 87:
      case 89:
      case 90:
      case 92:
      case 94:
      case 95:
      case 97:
      case 99:
      case 100:
      case 102:
      case 104:
      case 105:
        pic.height = 132;
        pic.scaleX = 0.8;
        pic.scaleY = 0.8;
        pic.getComponent(cc.Layout).enabled = true;
        pic.getComponent(cc.Layout).type = cc.Layout.Type.HORIZONTAL;
        pic.getComponent(cc.Layout).paddingLeft = 12.75;
        pic.getComponent(cc.Layout).paddingRight = 12.75;
        pic.getComponent(cc.Sprite).spriteFrame = this.sfdetail[0];

        _cell1.getComponent(cc.Sprite).spriteFrame =
          this.sfdetail[this.checkCell(listCell[0])];
        _cell1.children[0].getComponent(cc.Label).string =
          listCell[0].toString();
        _cell2.getComponent(cc.Sprite).spriteFrame =
          this.sfdetail[this.checkCell(listCell[1])];
        _cell2.children[0].getComponent(cc.Label).string =
          listCell[1].toString();

        pic.addChild(_cell1);
        pic.addChild(_cell2);

        break;

      case 108:
        pic.getComponent(cc.Layout).enabled = false;
        pic.getComponent(cc.Sprite).spriteFrame = this.sfdetail[6];
        pic.width = 175;
        pic.height = 241;
        break;

      case 109:
        pic.getComponent(cc.Layout).enabled = false;
        pic.getComponent(cc.Sprite).spriteFrame = this.sfdetail[8];
        pic.width = 175;
        pic.height = 241;
        break;

      case 110:
      case 111:
      case 112:
      case 113:
      case 114:
      case 115:
      case 116:
      case 117:
      case 118:
      case 119:
      case 120:
      case 121:
        pic.width = 101;
        pic.scaleX = 0.65;
        pic.scaleY = 0.65;
        pic.getComponent(cc.Layout).enabled = true;
        pic.getComponent(cc.Layout).type = cc.Layout.Type.VERTICAL;
        pic.getComponent(cc.Layout).verticalDirection =
          cc.Layout.VerticalDirection.BOTTOM_TO_TOP;
        pic.getComponent(cc.Layout).paddingBottom = 16.5;
        pic.getComponent(cc.Layout).paddingTop = 16.5;
        pic.getComponent(cc.Sprite).spriteFrame = this.sfdetail[0];

        _cell1.getComponent(cc.Sprite).spriteFrame =
          this.sfdetail[this.checkCell(listCell[0])];
        _cell1.children[0].getComponent(cc.Label).string =
          listCell[0].toString();
        _cell2.getComponent(cc.Sprite).spriteFrame =
          this.sfdetail[this.checkCell(listCell[1])];
        _cell2.children[0].getComponent(cc.Label).string =
          listCell[1].toString();
        _cell3.getComponent(cc.Sprite).spriteFrame =
          this.sfdetail[this.checkCell(listCell[2])];
        _cell3.children[0].getComponent(cc.Label).string =
          listCell[2].toString();

        pic.addChild(_cell1);
        pic.addChild(_cell2);
        pic.addChild(_cell3);

        break;

      case 122:
        pic.getComponent(cc.Layout).enabled = false;
        pic.getComponent(cc.Sprite).spriteFrame = this.sfdetail[9];
        pic.width = 175;
        pic.height = 241;
        break;

      case 123:
      case 124:
      case 125:
      case 126:
      case 127:
      case 128:
      case 129:
      case 130:
      case 131:
      case 130:
      case 131:
      case 132:
      case 133:
      case 134:
      case 135:
      case 136:
      case 137:
      case 138:
      case 139:
      case 140:
      case 141:
      case 140:
      case 141:
      case 142:
      case 143:
      case 144:
        pic.width = 195;
        pic.scaleX = 0.65;
        pic.scaleY = 0.65;
        pic.getComponent(cc.Layout).enabled = true;
        pic.getComponent(cc.Layout).type = cc.Layout.Type.GRID;
        pic.getComponent(cc.Layout).verticalDirection =
          cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
        pic.getComponent(cc.Layout).horizontalDirection =
          cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
        pic.getComponent(cc.Layout).paddingLeft = 12.75;
        pic.getComponent(cc.Layout).paddingRight = 12.75;
        pic.getComponent(cc.Layout).paddingTop = 12.75;
        pic.getComponent(cc.Layout).paddingBottom = 12.75;
        pic.getComponent(cc.Sprite).spriteFrame = this.sfdetail[0];

        _cell1.getComponent(cc.Sprite).spriteFrame =
          this.sfdetail[this.checkCell(listCell[0])];
        _cell1.children[0].getComponent(cc.Label).string =
          listCell[0].toString();
        _cell2.getComponent(cc.Sprite).spriteFrame =
          this.sfdetail[this.checkCell(listCell[1])];
        _cell2.children[0].getComponent(cc.Label).string =
          listCell[1].toString();
        _cell3.getComponent(cc.Sprite).spriteFrame =
          this.sfdetail[this.checkCell(listCell[2])];
        _cell3.children[0].getComponent(cc.Label).string =
          listCell[2].toString();
        _cell4.getComponent(cc.Sprite).spriteFrame =
          this.sfdetail[this.checkCell(listCell[3])];
        _cell4.children[0].getComponent(cc.Label).string =
          listCell[3].toString();

        pic.addChild(_cell1);
        pic.addChild(_cell2);
        pic.addChild(_cell3);
        pic.addChild(_cell4);

        break;

      case 145:
      case 146:
      case 147:
      case 148:
      case 149:
      case 150:
      case 151:
      case 150:
      case 151:
      case 152:
      case 153:
      case 154:
      case 155:
      case 156:
        pic.width = 195;
        pic.scaleX = 0.65;
        pic.scaleY = 0.65;
        pic.getComponent(cc.Layout).enabled = true;
        pic.getComponent(cc.Layout).type = cc.Layout.Type.GRID;
        pic.getComponent(cc.Layout).verticalDirection =
          cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
        pic.getComponent(cc.Layout).horizontalDirection =
          cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
        pic.getComponent(cc.Layout).paddingLeft = 12.75;
        pic.getComponent(cc.Layout).paddingRight = 12.75;
        pic.getComponent(cc.Layout).paddingTop = 16.5;
        pic.getComponent(cc.Layout).paddingBottom = 16.5;
        pic.getComponent(cc.Sprite).spriteFrame = this.sfdetail[0];

        _cell1.getComponent(cc.Sprite).spriteFrame =
          this.sfdetail[this.checkCell(listCell[0])];
        _cell1.children[0].getComponent(cc.Label).string =
          listCell[0].toString();
        _cell2.getComponent(cc.Sprite).spriteFrame =
          this.sfdetail[this.checkCell(listCell[1])];
        _cell2.children[0].getComponent(cc.Label).string =
          listCell[1].toString();
        _cell3.getComponent(cc.Sprite).spriteFrame =
          this.sfdetail[this.checkCell(listCell[2])];
        _cell3.children[0].getComponent(cc.Label).string =
          listCell[2].toString();
        _cell4.getComponent(cc.Sprite).spriteFrame =
          this.sfdetail[this.checkCell(listCell[3])];
        _cell4.children[0].getComponent(cc.Label).string =
          listCell[3].toString();
        _cell5.getComponent(cc.Sprite).spriteFrame =
          this.sfdetail[this.checkCell(listCell[4])];
        _cell5.children[0].getComponent(cc.Label).string =
          listCell[4].toString();
        _cell6.getComponent(cc.Sprite).spriteFrame =
          this.sfdetail[this.checkCell(listCell[5])];
        _cell6.children[0].getComponent(cc.Label).string =
          listCell[5].toString();

        pic.addChild(_cell1);
        pic.addChild(_cell2);
        pic.addChild(_cell3);
        pic.addChild(_cell4);
        pic.addChild(_cell5);
        pic.addChild(_cell6);

        break;

      case 157:
      case 158:
      case 159:
        let picTemp = cc.instantiate(pic);
        picTemp.width = 163;
        picTemp.height = 112;
        pic.width = 195;
        pic.getComponent(cc.Layout).enabled = true;
        pic.getComponent(cc.Layout).type = cc.Layout.Type.GRID;
        pic.getComponent(cc.Layout).verticalDirection =
          cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
        pic.getComponent(cc.Layout).horizontalDirection =
          cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
        pic.getComponent(cc.Layout).paddingLeft = 12.75;
        pic.getComponent(cc.Layout).paddingRight = 12.75;
        pic.getComponent(cc.Layout).paddingTop = 12.75;
        pic.getComponent(cc.Layout).paddingBottom = 12.75;
        picTemp.getComponent(cc.Sprite).spriteFrame = this.sfdetail[10];

        _cell1.getComponent(cc.Sprite).spriteFrame =
          this.sfdetail[this.checkCell(listCell[0])];
        _cell1.children[0].getComponent(cc.Label).string =
          listCell[0].toString();
        _cell2.getComponent(cc.Sprite).spriteFrame =
          this.sfdetail[this.checkCell(listCell[1])];
        _cell2.children[0].getComponent(cc.Label).string =
          listCell[1].toString();

        _cell1.scale = 0.9;
        _cell2.scale = 0.9;

        pic.addChild(picTemp);
        pic.addChild(_cell1);
        pic.addChild(_cell2);
        break;
    }
  }

  private checkCell(cell: number) {
    for (let i of RouletteController.instance.red_numbers) {
      if (i === cell) {
        return 2;
      }
    }
    return 1;
  }

  public scrollBetLeft() {
    this.currentScroll -= this.stepScroll;
    if (this.currentScroll < 0) this.currentScroll = 0;
    this.detailScrollView.scrollToPercentHorizontal(this.currentScroll, 0.3);
  }

  public scrollBetRight() {
    this.currentScroll += this.stepScroll;
    if (this.currentScroll > 1) this.currentScroll = 1;
    this.detailScrollView.scrollToPercentHorizontal(this.currentScroll, 0.3);
  }
}
