import { SlotCmd } from "./SlotKK.Cmd";
import SlotKKCommon from "./SlotKK.Common";
import SlotKKController from "./SlotKK.Controller";
import SlotKKMusicManager, { SLOT_SOUND_TYPE } from "./SlotKK.Music";
import SlotKKMachine from "./SlotKK.SlotMachine";

const { ccclass, property } = cc._decorator;
@ccclass
export default class SlotKKCellSpr extends cc.Component {
  @property(cc.Sprite)
  public spriteCharacter: cc.Sprite = null;

  @property(cc.Sprite)
  public frame: cc.Sprite = null;

  @property(cc.Node)
  public block: cc.Node = null;

  private _index: number = 0;

  public set index(index: number) {
    this._index = index;
  }

  public get index() {
    return this._index;
  }

  private itemCell: SlotCmd.ImpItemCell = null;

  public getItemCell() {
    return this.itemCell;
  }

  public setItemCell(item: SlotCmd.ImpItemCell) {
    this.itemCell = item;
  }

  private listSymsName = {
    0: ["Wild1", "Wild2", "Wild3", "Wild4", "Wild5", "Wild6"],
    1: ["scatter1", "scatter2", "scatter3", "scatter4", "Scatter5", "Scatter6"],
    2: ["Bat1", "Bat2", "Bat3", "Bat4", "Bat5", "Bat6"],
    3: ["Girl1", "Girl2", "Girl3", "Girl4", "Girl5", "Girl6"],
    4: ["Tank1", "Tank2", "Tank3", "Tank4", "Tank5", "Tank6"],
    5: ["Plane1", "Plane2", "Plane3", "Plane4", "Plane5", "Plane6"],
    6: ["Boat1", "Boat2", "Boat3", "Boat4", "Boat5", "Boat6"],
    7: ["Car1", "Car2", "Car3", "Car4", "Car5", "Car6"],
    8: ["10", "10-2", "10-3", "10-4", "10-5", "10-6"],
    9: ["j", "j2", "j3", "j4", "j5", "j6"],
    10: ["q", "q2", "q3", "q4", "q5", "q6"],
    11: ["k", "k2", "k3", "k4", "k5", "k6"],
    12: ["a", "a2", "a3", "a4", "a5", "a6"],
    13: ["coin"],
    14: [
      "symbols_rect_1",
      "symbols_rect_2",
      "symbols_rect_3",
      "symbols_rect_4",
      "symbols_rect_5",
      "symbols_rect_6",
    ],
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////

  public setResultForCell(result: SlotCmd.ImpItemCell) {
    this.itemCell = result;
    let id = result.id;
    let rowTake = result.rowTake;
    // if (result.id === SlotCmd.DEFINE_CHARACTER.COIN) {
    //   SlotKKController.instance.coinPos = cc.v2(this.node.position.x, this.node.position.y);
    // }

    if (result.isActive) {
      this.spriteCharacter.spriteFrame = this.getSpriteFrame(id, rowTake - 1);
      this.setSpriteCharacter(id, rowTake);
    } else {
      this.spriteCharacter.spriteFrame = null;
    }

    if (result.highlight && id !== 1 && id !== 0) {
      this.frame.spriteFrame = this.getSpriteFrame(14, rowTake);
      this.setFrame(rowTake);
    } else {
      this.frame.spriteFrame = null;
    }
  }

  public setSprRandom() {
    let ran = SlotKKCommon.getRandomNumber(2, 12);
    this.spriteCharacter.spriteFrame = this.getSpriteFrame(ran, 0);
  }

  private getSpriteFrame(id: number, rowTake: number) {
    let temp = null;
    switch (id) {
      case 0:
      case 1:
      case 2:
      case 3:
        temp = SlotKKMachine.instance.listSprSym[0].getSpriteFrame(
          this.listSymsName[id][rowTake]
        );
        break;

      case 4:
      case 5:
      case 6:
      case 7:
        temp = SlotKKMachine.instance.listSprSym[1].getSpriteFrame(
          this.listSymsName[id][rowTake]
        );
        break;

      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
        temp = SlotKKMachine.instance.listSprSym[2].getSpriteFrame(
          this.listSymsName[id][rowTake]
        );
        break;

      case 13:
        temp = SlotKKMachine.instance.listSprSym[3].getSpriteFrame(
          this.listSymsName[id][0]
        );
        break;

      case 14:
        temp = SlotKKMachine.instance.listSprSym[3].getSpriteFrame(
          this.listSymsName[id][rowTake]
        );
        break;
    }

    return temp;
  }

  private setSpriteCharacter(id: number, rowTake: number) {
    if (id === 13) {
      this.spriteCharacter.node.width = 100;
      this.spriteCharacter.node.height = 100;
      this.spriteCharacter.node.y = 100 - 50*rowTake;
    } else {
      this.spriteCharacter.node.width = 155.5;
      if (id == 0 && rowTake == 1) {
        this.spriteCharacter.node.height = 144;
        this.spriteCharacter.node.y = 94;
      } else if (id == 1 && rowTake == 1) {
        this.spriteCharacter.node.height = 108;
        this.spriteCharacter.node.y = 58;
      } else if (id == 4 && rowTake == 1) {
        this.spriteCharacter.node.height = 120.5;
        this.spriteCharacter.node.y = 70.5;
      } else if (id == 4 && rowTake == 2) {
        this.spriteCharacter.node.height = 220.5;
        this.spriteCharacter.node.y = 70.5;
      } else {
        this.spriteCharacter.node.height = 100 * rowTake;
        this.spriteCharacter.node.y = 50;
      }
    }

  }

  private setFrame(rowTake: number) {
    this.frame.node.width = 155.5;
    this.frame.node.height = 100 * rowTake;
  }

  public explode() {
    if (this.itemCell) {
      if (this.itemCell.isExplode) {
        if (!this.itemCell.highlight || this.itemCell.id === 0) {
          if (this.itemCell.index <= 5) {
            this.node.x += 650;
          } else {
            this.node.y += 750;
          }
        } else {
          this.scheduleOnce(() => {
            this.itemCell.id = 0;
            this.setResultForCell(this.itemCell);
          }, 1.4);
        }
      } else {
        this.block.active = true;
        this.scheduleOnce(() => {
          this.scheduleOnce(() => {
            this.block.active = false;
          }, 0.8);
        }, 0.8);
      }
    } else {
      // cc.log("item cell null");
      // cc.log(this.node.name);
    }
  }
}
