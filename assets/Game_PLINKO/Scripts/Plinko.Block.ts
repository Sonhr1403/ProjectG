import PlinkoGoal from "./Plinko.Goal";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlinkoBlock extends cc.Component {
  public static instance: PlinkoBlock = null;
 
  @property(cc.Prefab)
  blockPrefab: cc.Prefab = null;
  @property(cc.SpriteFrame)
  goalSprites8: cc.SpriteFrame[] = [];
  @property(cc.SpriteFrame)
  goalSprites9: cc.SpriteFrame[] = [];
  @property(cc.SpriteFrame)
  goalSprites10: cc.SpriteFrame[] = [];
  @property(cc.SpriteFrame)
  goalSprites11: cc.SpriteFrame[] = [];
  @property(cc.SpriteFrame)
  goalSprites12: cc.SpriteFrame[] = [];
  @property(cc.SpriteFrame)
  goalSprites13: cc.SpriteFrame[] = [];
  @property(cc.SpriteFrame)
  goalSprites14: cc.SpriteFrame[] = [];
  @property(cc.SpriteFrame)
  goalSprites15: cc.SpriteFrame[] = [];
  @property(cc.SpriteFrame)
  goalSprites16: cc.SpriteFrame[] = [];
  lastColumn: boolean = false;
  spacingX: number;
  arrayColorGoal = [];
 

  // LIFE-CYCLE CALLBACKS:
  onLoad() {
    PlinkoBlock.instance = this;
  }

  initItem(idx, spacing) {
    this.spacingX = spacing;
    this.node.removeAllChildren(true);
    let ballLimit = idx + 3;
    let updateSpacing = this.spacingX;
    let arr = [];
    if (idx % 2 == 0) {
      for (let i = 0; i < ballLimit / 2; i++) {
        if (i == 0) {
          arr.push(i);
        } else {
          arr.unshift(-i);
          arr.push(i);
        }
      }
      for (let i = 0; i < ballLimit; i++) {
        const element = ballLimit;
        let item = cc.instantiate(this.blockPrefab);
        item.name = "block" + i.toString();
        this.node.addChild(item);
        item.children[0].setPosition(this.spacingX / 2, 0);
        item.children[1].setPosition(0 - this.spacingX / 2, 0);
        item.setPosition(updateSpacing * arr[i], 0);
      }
    } else {
      updateSpacing = updateSpacing / 2;
      for (let i = 1; i <= ballLimit; i += 2) {
        arr.unshift(-i);
        arr.push(i);
      }
      for (let i = 0; i < ballLimit; i++) {
        const element = ballLimit;
        let item = cc.instantiate(this.blockPrefab);
        item.name = "block" + i.toString();
        this.node.addChild(item);
        item.children[0].setPosition(this.spacingX / 2, 0);
        item.children[1].setPosition(0 - this.spacingX / 2, 0);
        item.setPosition(updateSpacing * arr[i], 0);
      }
    }
  }

  initLastLineItem(idx, rowNum, array, spacing, chanceArray, scale) {
  
    this.spacingX = spacing;
    this.node.removeAllChildren(true);
    let ballLimit = idx + 3;
    let arr = [];
    let arrGoal = [];
   
    let updateSpacing = this.spacingX;
    switch (Number(rowNum)) {
      case 8:
        arrGoal = this.goalSprites8;
        break;
      case 9:
        arrGoal = this.goalSprites9;
        break;
      case 10:
        arrGoal = this.goalSprites10;
        break;
      case 11:
        arrGoal = this.goalSprites11;
        break;
      case 12:
        arrGoal = this.goalSprites12;
        break;
      case 13:
        arrGoal = this.goalSprites13;
        break;
      case 14:
        arrGoal = this.goalSprites14;
        break;
      case 15:
        arrGoal = this.goalSprites15;
        break;
      case 16:
        arrGoal = this.goalSprites16;
        break;
    }

    if (idx % 2 == 0) {
      for (let i = 0; i < ballLimit / 2; i++) {
        if (i == 0) {
          arr.push(i);
        } else {
          arr.unshift(-i);
          arr.push(i);
        }
      }
      for (let i = 0; i < ballLimit; i++) {
        const element = ballLimit;
        let item = cc.instantiate(this.blockPrefab);
        item.name = "block" + i.toString();
        this.node.addChild(item);
        item.children[0].setPosition(this.spacingX / 2, 0);
        item.children[1].setPosition(0 - this.spacingX / 2, 0);
        item.setPosition(updateSpacing * arr[i], 0);
        if (i == ballLimit - 1) {
        } else {
          item.getComponent(PlinkoGoal).initWinBoard(array[i], chanceArray[i], scale)
          item.children[2].active = true;
          item.children[2].getComponent(cc.Sprite).spriteFrame = arrGoal[i];
          item.children[2].children[0].getComponent(cc.Label).string =
            array[i].toString();
        }
      }
    } else {
      updateSpacing = updateSpacing / 2;
      for (let i = 1; i <= ballLimit; i += 2) {
        arr.unshift(-i);
        arr.push(i);
      }

      for (let i = 0; i < ballLimit; i++) {
        const element = ballLimit;
        let item = cc.instantiate(this.blockPrefab);
        item.name = "block" + i.toString();
        this.node.addChild(item);
        item.children[0].setPosition(this.spacingX / 2, 0);
        item.children[1].setPosition(0 - this.spacingX / 2, 0);
        item.setPosition(updateSpacing * arr[i], 0);

        if (i == ballLimit - 1) {
        } else {
          item.getComponent(PlinkoGoal).initWinBoard(array[i], chanceArray[i], scale)
          item.children[2].active = true;
          item.children[2].getComponent(cc.Sprite).spriteFrame = arrGoal[i];
          item.children[2].children[0].getComponent(cc.Label).string =
            array[i].toString();

        }
      }
    }
  }
}
