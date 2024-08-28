const { ccclass, property } = cc._decorator;

@ccclass
export default class PlinkoCommon extends cc.Component {
  public static random = (min, max) => {
    return Math.random() * (max - min) + min;
  };
  public static randomExcluded(min, max, excluded) {
    var n = Math.floor(Math.random() * (max - min) + min);
    if (n >= excluded) n++;
    return n;
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

    if (!PlinkoCommon.isInt(data)) {
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

  public static convertStrHisrotyToArray(str: string) {
    var elements = str.split("/");
    return elements.map((element) => {
      var values = element.split(";").map(Number);
      return values;
    });
  }

  public static between(x, min, max) {
    return x >= min && x <= max;
  }

  public static numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
 
   public static randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }



   public static diff(num1, num2) {
    if (num1 > num2) {
      return num1 - num2;
    } else {
      return num2 - num1;
    }
  }
}
