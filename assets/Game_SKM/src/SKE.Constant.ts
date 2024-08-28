export namespace SKMConstant {
    export class PlayerState {
        static readonly NONE = 0;
        static readonly VIEWING = 1;
        static readonly WAITING = 2;
        static readonly PLAYING = 3;
    }

    export class ServerGameState {
        static readonly WAITING = 0;
        static readonly IN_GAME = 1;
        static readonly FINISHED = 2;
    }

    export class ActionInGameState {
        static readonly DEALING_CARDS = 1;
        static readonly AUTO_OPEN_CARDS = 2;
        static readonly INVITE_DRAW_CARD = 3;
        static readonly AUTO_DRAW_CARDS = 4;
        static readonly OPEN_CARDS_OF_USER = 5;
        static readonly OPEN_CARD_OF_BANKER = 6;
        static readonly END_GAME = 7;
    }

    export class CardLogic {
        public static getCardAtlas() {
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

        public static getNameCard(idxCard: number) {
            if(idxCard >= 0 && idxCard <= 52) {
                let cardAtlas = CardLogic.getCardAtlas();
                return cardAtlas[idxCard.toString()]
            }
            return "card_back";
        }

        public static getCardScore(cards: Array<number>) {
            let score = 0;
            for (let i = 0; i < cards.length; i++) {
                score += CardLogic.getScoreOfCardSKM(cards[i]);
            }
            score = score % 10;
            return score;
        }

        public static getScoreOfCardSKM(idxCard: number): number {
            let cardValue = this.getCardValue(idxCard);
            return (cardValue < 10) ? cardValue : 0;
        }

        public static getCardValue(idxCard: number): number {
            return Math.floor(idxCard / 4) + 1;
        }

        /* 1: tép, 2: rô, 3: cơ, 4: bích */
        public static getCardSuit(idxCard): number {
            return idxCard % 4 + 1;
        }
    }
}

export default SKMConstant;