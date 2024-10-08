const { ccclass, property } = cc._decorator;

@ccclass
export default class TQCommon extends cc.Component {
  public static getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public static convert2Label(num) {
    if (!num || num === 0) {
      return "0";
    }

    let data = num;
    let returnKey = "";
    if (data / 1000 >= 1) {
      data = data / 1000;
      returnKey = "K";
      if (data / 1000 >= 1) {
        data = data / 1000;
        returnKey = "M";
        if (data / 1000 >= 1) {
          data = data / 1000;
          returnKey = "B";
          if (data / 1000 >= 1) {
            data = data / 1000;
            returnKey = "T";
          }
        }
      }
    }

    if (!TQCommon.isInt(data)) {
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

  public static isInt(num) {
    return num % 1 === 0;
  }

  public static numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }



  public static randomDifferentConsecutiveNumber(current) {
    let random = current;
    let last_random = Math.floor(Math.random() * 4);
    if (random != last_random && last_random != 0) {
      return last_random;
    } else {
      this.randomDifferentConsecutiveNumber(random);
    }
  }

  public static convert2Number(lbl: string) {
    let unit = lbl.slice(-1);
    let num = Number(lbl.slice(0, -1));
    let money = -1;
    switch (unit) {
      case "K":
        money = num * 1000;
        break;

      case "M":
        money = num * 1000000;
        break;

      case "B":
        money = num * 1000000000;
        break;

      case "T":
        money = num * 1000000000000;
        break;

      default:
        break;
    }
    return money;
  }
}
