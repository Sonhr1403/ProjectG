import { PokerConnector } from "../../lobby/scripts/network/wss/PokerConnector";
import ErrorDefine = BGUI.ErrorDefine;

export namespace Poker {
    export class GameRound {
        static ROUND_PRE_FLOP = 1;
        static ROUND_THE_FLOP = 2;
        static ROUND_THE_TURN = 3;
        static ROUND_THE_RIVER = 4;
    }

    export class GameTypeCard {
        static TYPE_HIGH_CARD = 0; // Mậu thầu
        static TYPE_ONE_PAIR = 1; // Một đôi
        static TYPE_TWO_PAIR = 2; // Hai đôi hoặc thú
        static TYPE_THREE_OF_A_KIND = 3; // Sám
        static TYPE_STRAIGHT = 4; // Sảnh
        static TYPE_FLUSH = 5; // Thùng
        static TYPE_FULL_HOUSE = 6; // Cù lũ
        static TYPE_FOUR_OF_A_KIND = 7; // Tứ quý
        static TYPE_STRAIGHT_FLUSH = 8; // Sảnh thùng
        static TYPE_ROYAL_FLUSH = 9; // Thùng phá sảnh
    }

    export class GamePlayerAction {
        static SMALL_BLIND = 1;
        static BIG_BLIND = 2;
        static FOLD = 3;
        static CHECK = 4;
        static CALL = 5;
        static BET = 6;
        static RAISE = 7;
        static ALL_IN = 8;
    }

    export class Config {
        public static CARD_ATLAS = { "0": "a_tep", "1": "a_ro", "2": "a_co", "3": "a_bich", "4": "2_tep", "5": "2_ro", "6": "2_co", "7": "2_bich", "8": "3_tep", "9": "3_ro", "10": "3_co", "11": "3_bich", "12": "4_tep", "13": "4_ro", "14": "4_co", "15": "4_bich", "16": "5_tep", "17": "5_ro", "18": "5_co", "19": "5_bich", "20": "6_tep", "21": "6_ro", "22": "6_co", "23": "6_bich", "24": "7_tep", "25": "7_ro", "26": "7_co", "27": "7_bich", "28": "8_tep", "29": "8_ro", "30": "8_co", "31": "8_bich", "32": "9_tep", "33": "9_ro", "34": "9_co", "35": "9_bich", "36": "10_tep", "37": "10_ro", "38": "10_co", "39": "10_bich", "40": "j_tep", "41": "j_ro", "42": "j_co", "43": "j_bich", "44": "q_tep", "45": "q_ro", "46": "q_co", "47": "q_bich", "48": "k_tep", "49": "k_ro", "50": "k_co", "51": "k_bich", "52": "card_back" }
    }

    export class Cmd {
        static CMD_POKER_LOGIN = 1;

        static CMD_JOIN_ROOM_FAIL = 3004;
        static CMD_LIST_ROOMS = 3020;
        static CMD_JOIN_ROOM = 3021;
        static CMD_NEW_USER_JOIN = 3031;
        static CMD_NOTIFY_REQ_QUIT_ROOM = 3032;
        static CMD_USER_EXIT_ROOM = 3033;

        static CMD_UPDATE_AUTO_START = 3101;
        static CMD_START_GAME = 3102;
        static CMD_START_ROUND_PRE_FLOP = 3103;
        static CMD_START_NEW_ROUND = 3104;
        static CMD_START_ROUND_SHOW_DOWN = 3105;
        static CMD_END_GAME = 3106;

        static CMD_GAME_INFO = 3201;
        static CMD_OPEN_BET = 3202;
        static CMD_PLAYER_ACTION = 3203;
    }

    export class SendGetListRooms extends BGUI.BaseOutPacket {
        public player: number = 0;

        getCmdId(): number {
            return Cmd.CMD_LIST_ROOMS;
        }

        putData(): void {
            this.putInt(0);
        }
    }

    export class SendPokerLogin extends BGUI.BaseOutPacket {
        public nickName: string;
        public accessToken: string;

        public getCmdId(): number {
            return 1;
        }

        public putData(): void {
            this.putString(this.nickName);
            this.putString(this.accessToken);
        }
    }

    export class SendJoinRoom extends BGUI.BaseOutPacket {
        public id: number
        public amountMoney: number
        public autoBuyIn: boolean

        getCmdId(): number {
            return Cmd.CMD_JOIN_ROOM;
        }

        putData(): void {
            this.putInt(this.id);
            this.putInt(this.amountMoney);
            this.putByte(this.autoBuyIn ? 1 : 0);
        }
    }

    export class SendPlayerAction extends BGUI.BaseOutPacket {
        public action = 0;
        public moneyBet = 0;

        getCmdId(): number {
            return Cmd.CMD_PLAYER_ACTION;
        }

        putData(): void {
            this.putByte(this.action);

            /**
             * FOLD     moneyBet = 0
             * CHECK    moneyBet = 0
             * BET      moneyBet > 0
             * CALL     moneyBet = 0 (Server calculate)
             * RAISE    moneyBet > MaxBetInRound - RoundBetMoney
             * ALL_IN   moneyBet = 0 (Server calculate)
             */
            this.putLong(this.moneyBet);
        }
    }

    export class Send {
        public static sendGetListRooms(player: number) {
            let pkg = new SendGetListRooms();
            PokerConnector.instance.sendPacket(pkg);
        }

        public static sendJoinRoom(itemRoom: ImpRoom, amountMoney: number, autoBuyIn: boolean) {
            let pkg = new SendJoinRoom();
            pkg.id = itemRoom.id;
            pkg.amountMoney = amountMoney;
            pkg.autoBuyIn = autoBuyIn;
            PokerConnector.instance.sendPacket(pkg);
        }

        public static sendPlayerAction(action: number, amountMoney: number) {
            let pkg = new SendPlayerAction();
            pkg.action = action;
            pkg.moneyBet = amountMoney;
            PokerConnector.instance.sendPacket(pkg);
        }

        public static sendPokerLogin(nickname: string, accessToken): void {
            let pk = new SendPokerLogin();
            pk.nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
            pk.accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
            PokerConnector.instance.sendPacket(pk);
        }
    }

    ////////////////////
    export interface ImpRoom {
        id: number,
        totalUser: number,
        moneyBet: number,
        minMoney: number,
        maxMoney: number,
        maxUserPerRoom: number,
        rule: number,
    }

    export interface ImpPlayer {
        pl_nick_name: string,
        pl_display_name: string,
        pl_avatar: string,
        pl_balance: number,
        pl_is_me: boolean,
        pl_is_dealer: boolean,
        pl_is_small_blind: boolean,
        pl_is_big_blind: boolean,
        pl_active: boolean,
        pl_chair: number,
        pl_status: number,
        pl_type: number,
        pl_score: number,
        pl_action: number,
        pl_cards: Array<number>,
        pl_list_card_max: Array<number>,
        pl_total_bet_money: number,
        pl_round_bet_money: number,
        pl_win_money: number,
    }

    export class ReceivedGetListRooms extends BGUI.BaseInPacket {
        public list: Array<ImpRoom> = [];

        protected unpack(): void {
            let listSize = this.getShort();
            this.list = [];
            for (var i = 0; i < listSize; i++) {
                let item: ImpRoom = {
                    id: this.getInt(),
                    totalUser: this.getInt(),
                    moneyBet: this.getInt(),
                    minMoney: this.getInt(),
                    maxMoney: this.getInt(),
                    maxUserPerRoom: this.getInt(),
                    rule: this.getInt()
                };
                this.list.push(item)
            }
        }
    }

    export class ReceiveUserJoinRoom extends BGUI.BaseInPacket {
        public player: ImpPlayer = null;
        protected unpack(): void {
            const chair = this.getByte();
            const status = this.getByte();
            const nickName = this.getString();
            const displayName = this.getString();
            const avatar = this.getString();
            const money = this.getLong();
            this.player = {
                pl_nick_name: nickName,
                pl_display_name: displayName,
                pl_avatar: avatar,
                pl_balance: money,
                pl_is_me: false,
                pl_is_dealer: false,
                pl_is_small_blind: false,
                pl_is_big_blind: false,
                pl_active: true,
                pl_chair: chair,
                pl_status: status,
                pl_type: -1,
                pl_score: -1,
                pl_action: -1,
                pl_cards: [],
                pl_list_card_max: [],
                pl_total_bet_money: -1,
                pl_round_bet_money: -1,
                pl_win_money: -1,
            };
        }
    }

    export class ReceiveNewUserJoin extends BGUI.BaseInPacket {
        public player: ImpPlayer = null;
        protected unpack(): void {
            const chair = this.getByte();
            const status = this.getByte();
            const nickname = this.getString();
            const displayName = this.getString();
            const avatar = this.getString();
            const balance = this.getLong();
            this.player = {
                pl_nick_name: nickname,
                pl_display_name: displayName,
                pl_avatar: avatar,
                pl_balance: balance,
                pl_is_me: false,
                pl_is_dealer: false,
                pl_is_small_blind: false,
                pl_is_big_blind: false,
                pl_active: true,
                pl_chair: chair,
                pl_status: status,
                pl_type: -1,
                pl_score: -1,
                pl_action: -1,
                pl_cards: [],
                pl_list_card_max: [],
                pl_total_bet_money: -1,
                pl_round_bet_money: -1,
                pl_win_money: -1,
            }
        }
    }

    export class ReceiveNotifyReqQuitRoom extends BGUI.BaseInPacket {
        public chair: number;
        public isQuitRoom:boolean;

        protected unpack(): void {
            this.chair = this.getByte();
            this.isQuitRoom = this.getBool();
        }
    }

    export class ReceiveUserExitRoom extends BGUI.BaseInPacket {
        public player: ImpPlayer = null;
        protected unpack(): void {
            let chair = this.getByte();
            let nickname = this.getString();
            this.player = {
                pl_nick_name: nickname,
                pl_display_name: "",
                pl_avatar: "",
                pl_balance: -1,
                pl_is_me: false,
                pl_is_dealer: false,
                pl_is_small_blind: false,
                pl_is_big_blind: false,
                pl_active: true,
                pl_chair: chair,
                pl_status: -1,
                pl_type: -1,
                pl_score: -1,
                pl_action: -1,
                pl_cards: [],
                pl_list_card_max: [],
                pl_total_bet_money: -1,
                pl_round_bet_money: -1,
                pl_win_money: -1,
            }
        }
    }

    export class ReceiveUpdateAutoStart extends BGUI.BaseInPacket {
        public isAutoStart = false;
        public autoStartTime = 0;

        protected unpack(): void {
            this.isAutoStart = this.getBool();
            this.autoStartTime = this.getByte();
        }
    }
    //////////////
    export class ReceiveStartGame extends BGUI.BaseInPacket {
        public myChair: number;
        public moneyBet: number;
        public moneyType: number;
        public gameId: number;
        public roomId: number;
        public countDownTime: number;
        public hasInfo = [];
        public players: Array<ImpPlayer> = [];
        public infoMe: ImpPlayer;

        protected unpack(): void {
            this.hasInfo = [];
            this.myChair = this.getByte();
            this.moneyType = this.getByte();
            this.moneyBet = this.getLong();
            this.gameId = this.getInt();
            this.roomId = this.getInt();
            const playerSize1 = this.getShort();
            for (let i = 0; i < playerSize1; i++) {
                this.hasInfo[i] = this.getBool();
            }

            for (let i = 0; i < playerSize1; i++) {
                if (this.hasInfo[i]) {
                    let itemPlayer = {
                        pl_nick_name: this.getString(),
                        pl_display_name: this.getString(),
                        pl_avatar: this.getString(),
                        pl_balance: this.getLong(),
                        pl_is_me: (this.myChair == i),
                        pl_is_dealer: false,
                        pl_is_small_blind: false,
                        pl_is_big_blind: false,
                        pl_active: true,
                        pl_chair: i,
                        pl_status: this.getInt(),
                        pl_type: -1,
                        pl_score: -1,
                        pl_action: -1,
                        pl_cards: [],
                        pl_list_card_max: [],
                        pl_total_bet_money: -1,
                        pl_round_bet_money: -1,
                        pl_win_money: -1,
                    }
                    if (this.myChair == i) {
                        this.infoMe = itemPlayer;
                    }
                    this.players[i] = itemPlayer;
                } else {
                    this.players[i] = {
                        pl_nick_name: "",
                        pl_display_name: "",
                        pl_avatar: "",
                        pl_balance: -1,
                        pl_is_me: false,
                        pl_is_dealer: false,
                        pl_is_small_blind: false,
                        pl_is_big_blind: false,
                        pl_active: false,
                        pl_chair: i,
                        pl_status: -1,
                        pl_type: -1,
                        pl_score: -1,
                        pl_action: -1,
                        pl_cards: [],
                        pl_list_card_max: [],
                        pl_total_bet_money: -1,
                        pl_round_bet_money: -1,
                        pl_win_money: -1,
                    };
                }
            }
            this.countDownTime = this.getByte();
        }
    }

    export class ReceiveStartRoundPreFlop extends BGUI.BaseInPacket {
        public chairDealer: number;
        public chairSmallBlind: number;
        public chairBigBlind: number;
        public myCards: Array<number> = [];
        public countDownTime: number;
        public type: number;
        public listCardMax: Array<number> = [];
        public score: number = 0;
        public totalBetInGame: number = 0;

        protected unpack(): void {
            this.myCards = [];
            this.listCardMax = [];
            this.chairDealer = this.getByte();
            this.chairSmallBlind = this.getByte();
            this.chairBigBlind = this.getByte();

            const cardSize = this.getShort();
            for (let i = 0; i < cardSize; i++) {
                this.myCards[i] = this.getByte();
            }
            this.countDownTime = this.getByte();

            this.type = this.getByte();
            const cardMaxSize = this.getShort();
            for (let i = 0; i < cardMaxSize; i++) {
                this.listCardMax[i] = this.getByte();
            }
            this.score = this.getInt();
            this.totalBetInGame = this.getLong();
        }
    }

    export class ReceiveStartNewRound extends BGUI.BaseInPacket {
        public gameRound: number;
        public countDownTime: number;
        public commonCards: Array<number> = [];
        public type: number;
        public listCardMax: Array<number> = [];
        public score: number = 0;
        public totalBetInGame: number = 0; // Tổng tiền cược ở trên bàn

        protected unpack(): void {
            this.gameRound = this.getByte();

            const cardSize = this.getShort();
            for (let i = 0; i < cardSize; i++) {
                this.commonCards[i] = this.getByte();
            }

            this.countDownTime = this.getByte();
            this.type = this.getByte();

            const cardMaxSize = this.getShort();
            for (let i = 0; i < cardMaxSize; i++) {
                this.listCardMax[i] = this.getByte();
            }
            this.score = this.getInt();
            this.totalBetInGame = this.getLong();
        }
    }

    export class ReceiveStartRoundShowDown extends BGUI.BaseInPacket {
        public countDownTime: number = 0;
        public commonCards: Array<number> = [];
        public chairWinList: Array<number> = [];
        public hasInfo: Array<boolean> = [];
        public playerInfos = [];
        public totalBetInGame: number = 0;

        protected unpack(): void {
            const cardSize = this.getShort();
            for (let i = 0; i < cardSize; i++) {
                this.commonCards[i] = this.getByte();
            }

            const chairWinSize = this.getShort();
            for (let i = 0; i < chairWinSize; i++) {
                this.chairWinList[i] = this.getByte();
            }

            const playerSize = this.getShort();

            for (let i = 0; i < playerSize; i++) {
                this.hasInfo[i] = this.getBool()
            }

            for (let i = 0; i < playerSize; i++) {
                if (this.hasInfo[i]) {
                    const action = this.getByte();
                    const cards = [];
                    cards[0] = this.getByte();
                    cards[1] = this.getByte();
                    const type = this.getByte();
                    const listCardMax = [];
                    const cardMaxSize = this.getShort();
                    for (let i = 0; i < cardMaxSize; i++) {
                        listCardMax[i] = this.getByte();
                    }
                    const score = this.getInt();
                    let itemPlayer = {
                        pl_chair: i,
                        pl_action: action,
                        pl_cards: cards,
                        pl_type: type,
                        pl_list_card_max: listCardMax,
                        pl_score: score,
                    }
                    this.playerInfos[i] = itemPlayer;
                } else {
                    this.playerInfos[i] = {
                        pl_chair: i,
                        pl_action: -1,
                        pl_cards: [],
                        pl_type: -1,
                        pl_list_card_max: [],
                        pl_score: -1,
                    };
                }
            }
            this.countDownTime = this.getByte();
            this.totalBetInGame = this.getLong();
        }
    }

    export class ReceiveEndGame extends BGUI.BaseInPacket {
        public countDownTime:number;
        public hasInfo: Array<boolean>;
        public playerInfos: Array<{
            pl_chair: number,
            pl_balance: number,
            pl_win_money: number,
            pl_total_bet_money: number,
            pl_list_card_max: Array<number>,
        }> = [];

        protected unpack(): void {
            const playerSize = this.getShort();

            for (let i = 0; i < playerSize; i++) {
                this.hasInfo[i] = this.getBool()
            }

            for (let i = 0; i < playerSize; i++) {
                let itemEndGame = { pl_chair: i, pl_balance: -1, pl_win_money: -1, pl_total_bet_money: -1, pl_list_card_max: [], }
                if (this.hasInfo[i]) {
                    const _total_bet_money = this.getLong();
                    const _win_money = this.getLong();
                    const _balance = this.getLong();

                    const _list_card_max = [];
                    const cardMaxSize = this.getShort();
                    for (let i = 0; i < cardMaxSize; i++) {
                        _list_card_max[i] = this.getByte();
                    }
                    itemEndGame = { pl_chair: i, pl_balance: _balance, pl_win_money: _win_money, pl_total_bet_money: _total_bet_money, pl_list_card_max: _list_card_max, }
                    
                }
                this.playerInfos[i] = itemEndGame;
            }
            this.countDownTime = this.getByte();
        }
    }

    export class ReceiveGameInfo extends BGUI.BaseInPacket {
        public myChair: number;
        public chairDealer: number;
        public chairSmallBlind: number;
        public chairBigBlind: number;
        public myCards: Array<number> = [];
        public hasInfo: Array<boolean> = [];
        public commonCards: Array<number> = [];
        public gameRound: number;
        public isAutoStart: boolean = false;
        public gameAction: number;
        public countdownTime: number;
        public moneyType: number;
        public moneyBet: number;
        public gameId: number;
        public roomId: number;
        public players: Array<ImpPlayer> = [];
        public infoMe: ImpPlayer;
        public totalBetInGame: number = 0;

        protected unpack(): void {
            this.myChair = this.getByte();
            this.chairDealer = this.getByte();
            this.chairSmallBlind = this.getByte();
            this.chairBigBlind = this.getByte();

            const cardSize = this.getShort();
            for (let i = 0; i < cardSize; i++) {
                this.myCards.push(this.getByte())
            }

            const cardsSize = this.getShort();
            for (let i = 0; i < cardsSize; i++) {
                this.commonCards.push(this.getByte())
            }

            this.gameRound = this.getByte();
            this.isAutoStart = this.getBool();
            this.gameAction = this.getByte();
            this.countdownTime = this.getByte();
            this.moneyType = this.getByte();
            this.moneyBet = this.getLong();
            this.gameId = this.getInt();
            this.roomId = this.getInt();

            const hasInfoSize = this.getShort();
            for (let i = 0; i < hasInfoSize; i++) {
                this.hasInfo.push(this.getBool())
            }

            for (let i = 0; i < hasInfoSize; i++) {
                const indexChair = i;
                if (this.hasInfo[i]) {
                    const status = this.getByte();
                    const nickName = this.getString();
                    const displayName = this.getString();
                    const avatar = this.getString();
                    const balance = this.getLong();
                    const totalBetMoney = this.getLong();
                    const roundBetMoney = this.getLong();
                    const action = this.getByte();
                    let cards: Array<number> = [];
                    for (let j = 0; j < 2; j++) {
                        cards.push(this.getInt());
                    }

                    let itemPlayer = {
                        pl_nick_name: nickName,
                        pl_display_name: displayName,
                        pl_avatar: avatar,
                        pl_balance: balance,
                        pl_is_me: (this.myChair == indexChair),
                        pl_is_dealer: this.chairDealer == indexChair,
                        pl_is_small_blind: this.chairSmallBlind == indexChair,
                        pl_is_big_blind: this.chairBigBlind == indexChair,
                        pl_active: true,
                        pl_chair: indexChair,
                        pl_status: status,
                        pl_type: -1,
                        pl_score: -1,
                        pl_action: action,
                        pl_cards: cards,
                        pl_list_card_max: [],
                        pl_total_bet_money: totalBetMoney,
                        pl_round_bet_money: roundBetMoney,
                        pl_win_money: -1,
                    }

                    this.players[i] = itemPlayer;
                    if (this.myChair == indexChair) {
                        this.infoMe = itemPlayer;
                    }
                } else {
                    this.players[i] = { 
                        pl_nick_name: "",
                        pl_display_name: "",
                        pl_avatar: "",
                        pl_balance: -1,
                        pl_is_me: false,
                        pl_is_dealer: false,
                        pl_is_small_blind: false,
                        pl_is_big_blind: false,
                        pl_active: false,
                        pl_chair: i,
                        pl_status: -1,
                        pl_type: -1,
                        pl_score: -1,
                        pl_action: -1,
                        pl_cards: [],
                        pl_list_card_max: [],
                        pl_total_bet_money: -1,
                        pl_round_bet_money: -1,
                        pl_win_money: -1,
                    }
                }
            }

            this.totalBetInGame = this.getLong();
        }
    }

    export class ReceiveInviteBet extends BGUI.BaseInPacket {
        public chair: number; // Người được mời bet
        public money: number; // Số dư của người được mời bet
        public roundBetMoney: number; // Tổng tiền đã bet trong round
        public maxBetInRound: number; // số tiền lớn nhất của 1 ai đó bet trong round
        public countDownTime: number;
        public nextAction: Array<number> = [];
        public totalBetInGame: number = 0;

        protected unpack(): void {
            this.chair = this.getByte();
            this.money = this.getLong();
            this.roundBetMoney = this.getLong();
            this.maxBetInRound = this.getLong();
            this.countDownTime = this.getByte();

            if (this.maxBetInRound == 0) {
                this.nextAction = [GamePlayerAction.FOLD, GamePlayerAction.CHECK, GamePlayerAction.BET, GamePlayerAction.ALL_IN,]
            } else if ((this.money + this.roundBetMoney) > this.maxBetInRound) {
                this.nextAction = [GamePlayerAction.FOLD, GamePlayerAction.CALL, GamePlayerAction.RAISE, GamePlayerAction.ALL_IN,]
            } else {
                this.nextAction = [GamePlayerAction.FOLD, GamePlayerAction.ALL_IN,]
            }
            this.totalBetInGame = this.getLong();
        }
    }

    export class ReceivePlayerAction extends BGUI.BaseInPacket {
        public chair: number;
        public action: number;
        public moneyBet: number;
        public maxBetInRound: number;

        protected unpack(): void {
            if (this.getError() == ErrorDefine.SUCCESS) {
                this.chair = this.getByte();
                this.action = this.getByte();
                this.moneyBet = this.getLong();
                this.maxBetInRound = this.getLong();
            }
        }
    }
}