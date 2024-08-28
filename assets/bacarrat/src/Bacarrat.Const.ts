import Bacarrat_GameManager from "./Bacarrat.GameManager";

export class Bacarrat_Const {

    public static readonly CHIP_AMOUNT = [1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000, 50000000]
    public static readonly RESULT_PATERN = [[0], [1], [2], [3], [4], [5], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5], [3, 4], [3, 5], [4, 5]];

    public static readonly TAG_POT = {
        PLAYER: 0,
        BANKER: 1,
        TIE: 2, //draw
        PLAYER_PAIR: 3,
        BANKER_PAIR: 4,
        SUPER_6: 5,

    }

    public static readonly MaxActionsToReconnect = 20;
    public static readonly SLOT_STATUS = {
        NONE: -1,
        SPECTATOR: 0,
        PLAYER: 1
    }

    public static readonly DEALER_STATUS = {
        TAKE_CARD_1: "TakeCard1",
        TAKE_CARD_2: "TakeCard2",
        STOP_BET: "dung_cuoc",
        NORMAL: "normal",
        MERGE_CARD: "gombai",
        BETTING: "moi_cuoc",
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

        return unit + Bacarrat_Const.formatAlignNumberWithK(money, separator);
    }

    public static loadImgFromUrl(_sprite: cc.Sprite = null, url: string = '') {
        if (_sprite === null || url === '') return;

        if (url.includes('graph.facebook.com')) {
            cc.loader.load({ url: url, type: "png" }, (err, texture: cc.Texture2D) => {
                if (err != null) {
                    console.log('Error Load Image FB')
                    _sprite.spriteFrame = Bacarrat_GameManager.instance.spfAvatar
                }
                else
                    _sprite.spriteFrame = new cc.SpriteFrame(texture);
            });
        } else {
            cc.loader.load(url, (err, texture) => {
                if (err != null) {
                    console.log('Error Load Image')
                    _sprite.spriteFrame = Bacarrat_GameManager.instance.spfAvatar
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
    displayName: string,
    avatar: string,
    currentMoney: number,

}