import Bacarrat_GameManager from "./Bacarrat.GameManager";

const SUIT = {
    Heart: 0, // cơ
    Diamond: 1, // rô
    Spade: 2, //Bích
    Club: 3,//tép
};

let ConvertCard = [2, 3, 0, 1];
//spade, club , heart, diamond
// let SuitName = 'heart,diamond,spade,club'.split(',');
let SuitName = 'Co,Ro,Bi,Ch'.split(',');
let A2_10JQK = '2,3,4,5,6,7,8,9,10,11,12,13,1'.split(',');
let NUMBER_POINT = '2,3,4,5,6,7,8,9,0,0,0,0,1'.split(',');

const { ccclass, property } = cc._decorator;
@ccclass
export default class Bacarrat_Card extends cc.Component {

    private _idx: number = -1;

    setSpriteCard() {
        this.node.getComponent(cc.Sprite).spriteFrame = Bacarrat_GameManager.instance.cardManager.spfCards[this.nameFile() - 1];
    }

    setId(id: number) {
        this._idx = id;
        BGUI.ZLog.log("Idx----> ", this._idx, " name -> " + this.toString() + " --> url->: " + this.nameFile());
        // BGUI.ZLog.log(" -> point ->" + this.pointNumber());
    }

    point() {
        return this._idx % 13;
    }

    suit() {
        return ConvertCard[Math.floor(this._idx / 13)];
    }

    pointNumber(): number {
        return parseInt(NUMBER_POINT[this.point()]);
    }

    pointName() {
        return A2_10JQK[this.point()];
    }

    suitName() {
        return SuitName[this.suit()];
    }

    nameFile() {
        return parseInt(this.pointName()) + 13 * this.suit();
    }

    toString() {
        return this.pointName() + ' ' + this.suitName();
    };

    pointNameSkin() {

        if (parseInt(this.pointName()) === 13)
            return "K"
        if (parseInt(this.pointName()) === 12)
            return "Q"
        if (parseInt(this.pointName()) === 11)
            return "J"
        if (parseInt(this.pointName()) > 8)
            return "4"
        if (parseInt(this.pointName()) > 5)
            return "3"
        if (parseInt(this.pointName()) > 2)
            return "2"

    }

    animSkeFile() {
        // BGUI.ZLog.log("this.this.point() --------> " + parseInt(this.pointName()))
        if (parseInt(this.pointName()) <= 3) {
            return "123_all"
        } else {
            // BGUI.ZLog.log("this.animSkeFile --------> " + this.suitName() + "_" + this.pointNameSkin())
            return this.suitName() + "_" + this.pointNameSkin();
        }

    }
}
