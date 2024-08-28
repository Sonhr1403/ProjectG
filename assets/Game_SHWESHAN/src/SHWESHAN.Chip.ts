// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Chip extends cc.Component {
  @property(cc.Label)
  label: cc.Label = null;

  @property(cc.Sprite)
  sprChip: cc.Sprite = null;

  @property(cc.SpriteFrame)
  sprChips: cc.SpriteFrame[] = [];

  num: number = null
  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start() {}

  init(spr, num) {
    
    this.label.string = this.convert2Label(num);
    this.sprChip.spriteFrame = spr;
    this.spriteChip()   
}

  convert2Label(num) {
    let data = num;
    let returnKey = "";
    if (data / 1000 >= 1) {
      data = data / 1000;
      // this.sprChip.spriteFrame = this.sprChips[0]
      returnKey = "K";
      if (data / 1000 >= 1) {
        data = data / 1000;
        // this.sprChip.spriteFrame = this.sprChips[1]
        returnKey = "M";
        if (data / 1000 >= 1) {
          data = data / 1000;
          // this.sprChip.spriteFrame = this.sprChips[2]
          returnKey = "B";
          if (data / 1000 >= 1) {
            data = data / 1000;
            // this.sprChip.spriteFrame = this.sprChips[3]
            returnKey = "T";
          }
        }
      }
    }
    if (!this.isInt(data)) {
      if (data > 100) {
        data = data.toFixed(1);
      } else if (data > 10) {
        data = data.toFixed(2);
      } else {
        data = data.toFixed(2);
      }
    }
    return data + returnKey;
  }

  spriteChip(){
    if((this.label.string) == "1K"){
        this.sprChip.spriteFrame = this.sprChips[0];
    }
    else if((this.label.string)  == "5K"){
        this.sprChip.spriteFrame = this.sprChips[1];
    }
    else if((this.label.string)  == "10K"){
        this.sprChip.spriteFrame = this.sprChips[2];
    }
    else if((this.label.string)  == "500K"){
        this.sprChip.spriteFrame = this.sprChips[3];
    }
    else {
        this.sprChip.spriteFrame = this.sprChips[4];
    }

  }

  isInt(num) {
    return num % 1 === 0;
  }
  // update (dt) {}
}
