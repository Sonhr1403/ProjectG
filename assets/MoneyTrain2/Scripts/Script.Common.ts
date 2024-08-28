export default class MoneyTrain2Common {
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

  public static isInt(num) {
    return num % 1 === 0;
  }

  public static numberWithCommas(num: number, digits: number = 0) {
    if (num == 0) return "0";
    if (digits != 0) {
      return num.toFixed(digits).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    }
    return num.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  public static numberWithOutCommas(str: string) {
    return parseInt(str.replace(/\,/g, ""));
  }

  public static convertStrToArray(str: string) {
    var elements = str.split("-");
    return elements.map((element) => {
      var values = element.split(";").map(Number);
      return values;
    });
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

  public static isTest: boolean =
    !window.location.host.includes(".globalboss.club");

  public static runLog(...content: any[]) {
    if (this.isTest) {
      BGUI.ZLog.log(...content);
    }
  }

  public static runError(...content: any[]) {
    if (this.isTest) {
      BGUI.ZLog.error(...content);
    }
  }

  
  public static compareArrays(arr1: Array<number>, arr2: Array<number>) {
    // Check if lengths are equal
    if (arr1.length !== arr2.length) {
      return false;
    }

    // Iterate over each element and compare
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    // If all elements are equal, return true
    return true;
  }
}
