import BOOGYIController from "./BOOGYI.Controller";

export namespace BOOGYIConstant {
    export class CardLogic {
        public static getCardAtlas() {
            return {
                "0": "card_a_tep",
                "1": "card_a_ro",
                "2": "card_a_co",
                "3": "card_a_bich",
                "4": "card_2_tep",
                "5": "card_2_ro",
                "6": "card_2_co",
                "7": "card_2_bich",
                "8": "card_3_tep",
                "9": "card_3_ro",
                "10": "card_3_co",
                "11": "card_3_bich",
                "12": "card_4_tep",
                "13": "card_4_ro",
                "14": "card_4_co",
                "15": "card_4_bich",
                "16": "card_5_tep",
                "17": "card_5_ro",
                "18": "card_5_co",
                "19": "card_5_bich",
                "20": "card_6_tep",
                "21": "card_6_ro",
                "22": "card_6_co",
                "23": "card_6_bich",
                "24": "card_7_tep",
                "25": "card_7_ro",
                "26": "card_7_co",
                "27": "card_7_bich",
                "28": "card_8_tep",
                "29": "card_8_ro",
                "30": "card_8_co",
                "31": "card_8_bich",
                "32": "card_9_tep",
                "33": "card_9_ro",
                "34": "card_9_co",
                "35": "card_9_bich",
                "36": "card_10_tep",
                "37": "card_10_ro",
                "38": "card_10_co",
                "39": "card_10_bich",
                "40": "card_j_tep",
                "41": "card_j_ro",
                "42": "card_j_co",
                "43": "card_j_bich",
                "44": "card_q_tep",
                "45": "card_q_ro",
                "46": "card_q_co",
                "47": "card_q_bich",
                "48": "card_k_tep",
                "49": "card_k_ro",
                "50": "card_k_co",
                "51": "card_k_bich",
                "52": "card_back"
            }
        }

        public static getTextureWithCode(indexCard) {
            let arrayFrameName = this.getCardAtlas();
            if (indexCard >= 0 && indexCard < 52) {
                return BOOGYIController.instance.spriteAtlasCards.getSpriteFrame(arrayFrameName[indexCard]);
            } else {
                return BOOGYIController.instance.spriteFrameCardsBack;
            }
        }
    }

    export class GameState {
        static START_GAME = 1;
        static DEAL_4_CARD = 2;
        static SELECT_BID = 3;
        static INVITE_BET = 4;
        static DEAL_5_CARD = 5;
        static OPEN_CARD = 6;
        static END_GAME = 7;
    }

    export class Config {
        static MAX_PLAYER = 5;
        static MAX_CARDS = 10;
        static START_POS_CARD = cc.v2(50, -228)
        static PosCardWhenClick = -270 //Vị trí posY  START_POS_CARD.y
        static DivForDealCard = 3
        static Distance_Card_Sort = 70 // Khoảng cách 2 con bài
        static kDistributeCardsDelay = 0.04
        static kDistributeCardsTime = 0.4
        static SCALE_CARD_DEAL_MY = 1
        static SCALE_CARD_DEAL_OTHER = 0.5
    }

    export class SortType {
        static kSortTangDan = 0;
        static kSortGroup = 1;
        static kSortUnkown = 2;
    }

    export class PlayerType {
        static MY = 0;
        static ENEMY = 1;
        static STATENONE = 0;
        static STATEVIEWING = 1;
        static STATEBAOSAM = 2;
    }
    export class PlayerState {
        static NONE = 0;
        static VIEWING = 1;
        static WAITING = 2;
        static PLAYING = 3;
    }
}
export default BOOGYIConstant;