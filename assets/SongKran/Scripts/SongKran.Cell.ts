import { SlotCmd } from "./SongKran.Cmd";
import SongKranCommon from "./SongKran.Common";
import SongKranMachine from "./SongKran.SlotMachine";

const { ccclass, property } = cc._decorator;
@ccclass
export default class SongKranCell extends cc.Component {
  @property(cc.Sprite)
  private spr: cc.Sprite = null;

  private itemCell: SlotCmd.ImpItemCell = null;

  public getItemCell() {
    return this.itemCell;
  }

  public setItemCell(item: SlotCmd.ImpItemCell) {
    this.itemCell = item;
  }

  private picSize = [
    [226, 751],
    [280, 751],
    [294, 211],
    [249, 181],
    [209, 170],
    [187, 170],
    [195, 151],
    [189, 167],
    [170, 166],
    [128, 122],
    [128, 120],
    [127, 121],
    [97, 121],
    [144, 121],
    [92, 121],
    [227, 751]
  ]

  public setSprite() {
    this.spr.spriteFrame =
      SongKranMachine.instance.listSymsSpr[this.itemCell.id];
    if (this.itemCell.id === 0 || this.itemCell.id === 1 ) {
      if (this.itemCell.off) {
        this.spr.spriteFrame = null;
      } else {
        this.spr.spriteFrame =
          SongKranMachine.instance.listSymsSpr[15];
        
          if(this.itemCell.wildLength !== -1) {
            switch (this.itemCell.wildLength) {
              case 2:
                if (this.itemCell.wildUpper) {
                  if (this.itemCell.index < 5) {
                    this.spr.node.y = 85;
                  } else if (this.itemCell.index < 10) {
                    this.spr.node.y = 255;
                  }
                } else {
                  if (this.itemCell.index < 15) {
                    this.spr.node.y = -255;
                  } else if (this.itemCell.index < 20) {
                    this.spr.node.y = -85;
                  }
                }
                break;
            
              case 3:
                if (this.itemCell.wildUpper) {
                  if (this.itemCell.index < 5) {
                    this.spr.node.y = -85;
                  } else if (this.itemCell.index < 10) {
                    this.spr.node.y = 85;
                  } else if (this.itemCell.index < 15) {
                    this.spr.node.y = 255;
                  }
                } else {
                  if (this.itemCell.index < 10) {
                    this.spr.node.y = -255;
                  } else if (this.itemCell.index < 15) {
                    this.spr.node.y = -85;
                  } else if (this.itemCell.index < 20) {
                    this.spr.node.y = 85;
                  }
                }
                break;
            
              case 4:
                if (this.itemCell.index < 5) {
                  this.spr.node.y = -255;
                } else if (this.itemCell.index < 10) {
                  this.spr.node.y = -85;
                } else if (this.itemCell.index < 15) {
                  this.spr.node.y = 85;
                } else if (this.itemCell.index < 20) {
                  this.spr.node.y = 255;
                }
                break;
            
              default:
                break;
            }
          } else {
            if (this.itemCell.index < 5) {
              this.spr.node.y = 255;
            } else {
              this.spr.node.y = -255;
            }
          }
      }
      this.setSize(15);
    } else {
      this.spr.node.y = 0;
      this.setSize(this.itemCell.id);
    }

    if (this.itemCell.id === 2) {
      this.spr.node.x = -25;
    } else {
      this.spr.node.x = 0;
    }
  }

  public setRandom() {
    let ran = SongKranCommon.getRandomNumber(2, 13);
    this.itemCell = {
      index: -1,
      id: ran,
      highlight: false,
      off: false,
      wildLength: -1,
      wildUpper: false
    };

    this.spr.spriteFrame = SongKranMachine.instance.listSymsSpr[ran];
    this.spr.node.y = 0;
    this.setSize(ran);
  }

  private setSize(id){
    this.spr.node.width = this.picSize[id][0] * 0.9;
    this.spr.node.height = this.picSize[id][1] * 0.85;
  }

  public noSprite(){
    this.spr.spriteFrame = null;
  }
}
