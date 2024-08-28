export namespace SHWESHANConstant {
    export class GameState {
        static NONE = -1;
        static AUTOSTART = 0;
        static JOINROOM = 4;
        static FIRSTTURN = 1;
        static CHIABAI = 2;
        static CHANGETURN = 3;
        static USERJOIN = 5;
        static DANHBAI = 6;
        static BOLUOT = 7;
        static QUIT = 8;
        static USERLEAVE = 12;
        static ENDGAME = 13;
        static UPDATEMATH = 14;
        static UPDATEOWNERROOM = 15;
        static PLAYCONTINUE = 16;
        static CHATCHONG = 17;
        static JACKPOT = 18;
        static REASONQUIT = 19;
        static NOTIFYOUTROOM = 20;
        static WAITBONDOITHONG = 21;
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
    export class CardsType{
        static LUNG = 0;
        static NORMAL = 1;
        static ALL9 = 5;
    }
}
export default SHWESHANConstant;