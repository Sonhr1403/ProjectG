export default class BCCommon {
    public static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static convert2Label(num) {
        if (!num) {
            return "0";
        }

        let data = num;
        let returnKey = '';
        if ((data / 1000) >= 1) {
            data = data / 1000
            returnKey = "K";
            if ((data / 1000) >= 1) {
                data = data / 1000
                returnKey = "M";
                if ((data / 1000) >= 1) {
                    data = data / 1000
                    returnKey = "B";
                    if ((data / 1000) >= 1) {
                        data = data / 1000
                        returnKey = "T";
                    }
                }
            }
        }

        if (!BCCommon.isInt(data)) {
            if (data > 100) {
                data = data.toFixed(1)
            } else if (data > 10) {
                data = data.toFixed(2)
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
}
