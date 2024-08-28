import DragonTiger_GameManager from "./DragonTiger.GameManager";

const SUIT = {
    Heart: 0, // cơ
    Diamond: 1, // rô
    Spade: 2, //Bích
    Club: 3,//tép
};

let ConvertCard = [2, 3, 0, 1];
//spade, club , heart, diamond
// let SuitName = 'heart,diamond,spade,club'.split(',');
let SuitName = 'tep,ro,co,bich'.split(',');
let A2_10JQK = '2,3,4,5,6,7,8,9,10,11,12,13,1'.split(',');
let NUMBER_POINT = '0,1,2,3,4,5,6,7,8,9,0,0,0,0'.split(',');

const { ccclass, property } = cc._decorator;
@ccclass
export default class DragonTiger_Card extends cc.Component {

    private _idx: number = -1;

    getCardAtlas() {
        return {
            "0": "card_a_tep", "1": "card_a_ro", "2": "card_a_co", "3": "card_a_bich",
            "4": "card_2_tep", "5": "card_2_ro", "6": "card_2_co", "7": "card_2_bich",
            "8": "card_3_tep", "9": "card_3_ro", "10": "card_3_co", "11": "card_3_bich",
            "12": "card_4_tep", "13": "card_4_ro", "14": "card_4_co", "15": "card_4_bich",
            "16": "card_5_tep", "17": "card_5_ro", "18": "card_5_co", "19": "card_5_bich",
            "20": "card_6_tep", "21": "card_6_ro", "22": "card_6_co", "23": "card_6_bich",
            "24": "card_7_tep", "25": "card_7_ro", "26": "card_7_co", "27": "card_7_bich",
            "28": "card_8_tep", "29": "card_8_ro", "30": "card_8_co", "31": "card_8_bich",
            "32": "card_9_tep", "33": "card_9_ro", "34": "card_9_co", "35": "card_9_bich",
            "36": "card_10_tep", "37": "card_10_ro", "38": "card_10_co", "39": "card_10_bich",
            "40": "card_j_tep", "41": "card_j_ro", "42": "card_j_co", "43": "card_j_bich",
            "44": "card_q_tep", "45": "card_q_ro", "46": "card_q_co", "47": "card_q_bich",
            "48": "card_k_tep", "49": "card_k_ro", "50": "card_k_co", "51": "card_k_bich",
            "52": "card_back"
        }
    }

    getNameCard() {
        if (this._idx >= 0 && this._idx <= 52) {
            let cardAtlas = this.getCardAtlas();
            return cardAtlas[this._idx.toString()]
        }
        return "card_back";
    }

    setSpriteCard() {
        this.node.getComponent(cc.Sprite).spriteFrame = DragonTiger_GameManager.instance.cardManager.spfCards.getSpriteFrame(this.getNameCard());
    }

    setCardBack() {
        this.node.getComponent(cc.Sprite).spriteFrame = DragonTiger_GameManager.instance.cardManager.spfCards.getSpriteFrame("card_back");
    }

    setId(id: number) {
        this._idx = id;
        BGUI.ZLog.log("Idx----> ", this._idx, " name -> " + this.getCardValue() + " " + SuitName[this.getCardSuit()]);
    }

    getCardValue() {
        return Math.floor(this._idx / 4) + 1;
    }

    /* 0: tép, 1: rô, 2: cơ, 3: bích */
    getCardSuit() {
        return this._idx % 4;
    }

    pointNumber() {
        return parseInt(NUMBER_POINT[this.getCardValue()]);
    }
}
