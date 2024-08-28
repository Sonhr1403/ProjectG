import DragonTiger_GameManager from "./DragonTiger.GameManager";

export class DragonTiger_Const {

    public static readonly CHIP_AMOUNT = [1000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000]

    public static readonly BET_SIDE = {
        DRAGON: 0,
        TIGER: 1,
        SHAN: 2,
        STRAIGHT: 3,
        STRAIGHTFLUSH: 4,
    }

    public static readonly GAME_STATE = {
        START_NEW_ROUND: "START_NEW_ROUND",
        WAITING_EFFECT_DRAGON_TIGER: "WAITING_EFFECT_DRAGON_TIGER",
        BETTING: "BETTING",
        DEAL_CARD_FIRST_ROUND: "DEAL_CARD_FIRST_ROUND",
        DEAL_CARD_SECOND_ROUND: "DEAL_CARD_SECOND_ROUND",
        CALCULATE_PRIZE: "CALCULATE_PRIZE",
    }

    public static formatAlignNumberWithK = function (number: number = 0, separator: string = ",", isFull: boolean = false) {
        number += 0.1;
        var isNegative = number < 0;
        number = Math.abs(Math.floor(number));
        var numString = number.toString();

        if (isFull) {
            var curIndex = numString.length - 3;

            while (curIndex > 0) {
                numString = numString.insertAt(curIndex, separator);
                curIndex -= 3;
            }
        }
        else {
            var prefix = "";
            if (numString.length > 9) {
                numString = (number / 1000000000.0).toFixed(2);

                prefix = "B";
            }
            else if (numString.length > 6) {
                numString = (number / 1000000.0).toFixed(2);

                prefix = "M";
            }
            else if (numString.length >= 4) {
                numString = (number / 1000.0).toFixed(1);

                prefix = "K";
            }
            else if (numString.length > 3) {
                numString = numString.insertAt(1, separator);
            }

            if (numString.indexOf('.') > -1) {
                // delete 0 and . if not need
                while (numString[numString.length - 1] === '0') {
                    numString = numString.slice(0, -1);
                }

                if (numString[numString.length - 1] === '.') {
                    numString = numString.slice(0, -1);
                }
            }

            numString += prefix;
        }

        if (isNegative) {
            numString = "-" + numString;
        }

        //ZLog.debug("num String = %s", numString);
        return numString;
    }

    public static formatMoneyWithK = function (money, unit, separator) {
        if (unit === undefined) unit = "$";

        return unit + DragonTiger_Const.formatAlignNumberWithK(money, separator);
    }

    public static loadImgFromUrl(_sprite: cc.Sprite = null, url: string = '') {
        if (_sprite === null || url === '') return;

        if (url.includes('graph.facebook.com')) {
            cc.loader.load({ url: url, type: "png" }, (err, texture: cc.Texture2D) => {
                if (err != null) {
                    console.log('Error Load Image FB')
                    if (DragonTiger_GameManager.instance)
                        _sprite.spriteFrame = DragonTiger_GameManager.instance.spfAvatar
                }
                else
                    _sprite.spriteFrame = new cc.SpriteFrame(texture);
            });
        } else {
            cc.loader.load(url, (err, texture) => {
                if (err != null) {
                    console.log('Error Load Image')
                    if (DragonTiger_GameManager.instance)
                        _sprite.spriteFrame = DragonTiger_GameManager.instance.spfAvatar
                }
                else
                    _sprite.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    }
}

declare global {
    interface String {
        insertAt(index, subStr);
    }

    interface Array<T> {
        swap(x: number, y: number): void;
        removeObj(obj): void;
        arrCardEqual(arr: any[]);
    }
}

export interface IDataPlayer {
    nickName: string,
    avatar: string,
    currentMoney: number,

}