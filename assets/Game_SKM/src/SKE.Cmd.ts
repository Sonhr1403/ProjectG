const { ccclass } = cc._decorator;

export namespace SKMCmd {
    export class Code {
        static LOGIN = 1;
        static NOTIFY_DISCONNECT = 37;
        static PING_PONG = 50;
        static JOIN_ROOM = 3001;
        static QUICK_ROOM_SUCCEED = 3006;
        static MO_BAI = 3101;
        static START_GAME = 3102;
        static END_GAME = 3103;
        static CHIA_BAI = 3105;
        static BO_LUOT = 3106;
        static AUTO_START = 3107;
        static FIRST_TURN = 3108;
        static UPDATE_GAME_INFO = 3110;
        static REQUEST_LEAVE_ROOM = 3111;
        static CHANGE_TURN = 3112;
        static DOI_CHUONG = 3113;
        static MOI_DAT_CUOC = 3114;
        static MOI_USER_RUT_BAI = 3115;
        static MOI_CHUONG_RUT_BAI = 3116;
        static MOI_RUT_BAI = 3117;
        static JOIN_ROOM_SUCCESS = 3118;
        static USER_LEAVE_ROOM = 3119;
        static NOTIFY_KICK_OFF = 3120;
        static USER_JOIN_ROOM = 3121;
        static UPDATE_MATCH = 3123;
        static BANK_MONEY = 3124
        static BANK_TURN = 3130
        static RUT_BAI = 3128
        static RUT_TIEN_CHUONG = 3129
        static REQUEST_INFO_MOI_CHOI = 3010
        static MOI_CHOI = 3011
        static ACCEPT_MOI_CHOI = 3012
        static RECONNECT_GAME_ROOM: 3002;
        static JOIN_ROOM_FAIL = 3004;
        static CHAT_ROOM = 3008;
        static CREATE_ROOM = 3013;
        static CREATE_ROOM_FAIL = 3018;
        static GET_LIST_ROOM = 3014;
        static JOIN_GAME_ROOM_BY_ID = 3015;
        static GET_LIST_ROOM_TYPE = 3020;
        static JOIN_ROOM_TYPE = 3021;

        static AUTO_RECONNECT_GAME_ROOM_FAIL = 3023;

        static AUTO_RECONNECT_GAME_ROOM = 3022;
        static MONEY_BET_CONFIG = 3003;
        static TESTSEND = 3109;
        static DAT_CUOC = 3109;
        static DOUBLE_BANKER = 3125;
        static SKM_TIP_TO_BANKER = 3024;

        static TESTRECEIVE = 3151;
    }

    export interface PlayersCard {
        cards: Array<number>,
        multiple: number,
        type: number,
        score: number
    }

    export interface ImpRoomInfo {
        id: number,
        userCount: number,
        limitPlayer: number,
        maxUserPerRoom: number,
        moneyType: number,
        moneyBet: number,
        requiredMoney: number,
        rule: number,
        nameRoom: string,
        key: boolean,
        quyban: number,
        maxJoin: Array<number>
    }

    export interface ImpRoomTypeInfo {
        id: number,
        totalUser: number,
        moneyBet: number,
        minMoney: number,
        maxMoney: number,
        maxUserPerRoom: number,
    }

    export interface ImpPlayerInfo {
        status: any,
        nickName: any,
        displayName: any,
        avatar: any,
        money: any,
        cuocChuong: any,
        isMe: boolean,
        isChuong: boolean,
        active: boolean,
        indexChair: any,
        cardSize: number,
        cards: Array<number>,
        multiple: number,
        type: number,
        score: number
    }

    export class TESTRECEIVE extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.test = this.getInt();
        }
        test = null;

    }

    export class TESTSEND extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.TESTSEND;
        }
        putData(): void {
            this.putInt(1);
        }

    }
    export class ReceiveDoubleBanker extends BGUI.BaseInPacket {
        public countDownTime = 0;
        protected unpack(): void {
            this.countDownTime = this.getByte();
        }
    }

    export class ReceiveRutTienChuong extends BGUI.BaseInPacket {
        public moneyChuongWin: number = 0;
        public chairChuong: number = 0;

        protected unpack(): void {
            this.chairChuong = this.getByte();
            this.moneyChuongWin = this.getLong();
        }
    }

    export class ReceiveMoiRutBai extends BGUI.BaseInPacket {
        public dongy: number;
        public chair: number;

        protected unpack(): void {
            this.chair = this.getInt();
            this.dongy = this.getInt();
        }
    }

    export class ReceiveMoiChuongRutBai extends BGUI.BaseInPacket {
        public countDownTime: number = 0;

        protected unpack(): void {
            this.countDownTime = this.getByte();
        }
    }

    export class ReceiveMoiUserRutBai extends BGUI.BaseInPacket {
        public countDownTime: number = 0;

        protected unpack(): void {
            this.countDownTime = this.getByte();
        }
    }

    export class SendDoubleBanker extends BGUI.BaseOutPacket {
        public confirm: number

        getCmdId(): number {
            return Code.DOUBLE_BANKER;
        }
        putData(): void {
            this.putByte(this.confirm);
        }
    }

    export class SendRutBai extends BGUI.BaseOutPacket {
        public rutbai: number;

        getCmdId(): number {
            return Code.RUT_BAI;
        }
        putData(): void {
            this.putInt(this.rutbai);
        }
    }

    export class SendCreateRoom extends BGUI.BaseOutPacket {
        public moneyBet: number;
        public limitPlayer: number;
        public password: string;
        public roomName: string;

        getCmdId(): number {
            return Code.CREATE_ROOM;
        }
        putData(): void {
            this.putInt(1)
            this.putInt(2)
            this.putLong(this.moneyBet)
            this.putInt(0)
            this.putInt(this.limitPlayer)
            this.putString(this.password)
            this.putString(this.roomName)
            this.putLong(0)
        }
    }

    export class ReceiveInfoMoiChoi extends BGUI.BaseInPacket {
        public listName = [];
        public listMoney = [];
        protected unpack(): void {
            var size = this.getShort()
            for (var i = 0; i < size; i++) {
                this.listName.push(this.getString())
            }

            size = this.getShort()
            for (var i = 0; i < size; i++) {
                this.listMoney.push(this.getLong())
            }
        }
    }

    export class ReceivedJoinRoomFail extends BGUI.BaseInPacket {
        protected unpack(): void {

        }
    }

    export class ReceivedMoiChoi extends BGUI.BaseInPacket {
        public id: number = 0;
        public maxUserPerRoom: number = 0;
        public moneyBet: number = 0;
        public inviter: string = "";
        public rule: number = 0;

        protected unpack(): void {
            this.id = this.getInt();
            this.maxUserPerRoom = this.getByte();
            this.moneyBet = this.getLong();
            this.inviter = this.getString();
            this.rule = this.getInt();
        }
    }

    // new
    export class ReceivedChatRoom extends BGUI.BaseInPacket {
        public chair: number;
        public isIcon: boolean;
        public content: string;
        public nickname: string;
        protected unpack(): void {
            this.chair = this.getByte();
            this.isIcon = this.getBool();
            this.content = decodeURI(this.getString());
            this.nickname = this.getString()
        }
    }

    export class ReceivedGetListRoom extends BGUI.BaseInPacket {
        public list: Array<ImpRoomInfo> = [];
        protected unpack(): void {
            let listSize = this.getShort();
            this.list = [];
            for (var i = 0; i < listSize; i++) {
                let item: ImpRoomInfo = {
                    id: this.getInt(),
                    userCount: this.getByte(),
                    limitPlayer: this.getByte(),
                    maxUserPerRoom: this.getInt(),
                    moneyType: this.getByte(),
                    moneyBet: this.getInt(),
                    requiredMoney: this.getInt(),
                    rule: this.getByte(),
                    nameRoom: this.getString(),
                    key: this.getBool(),
                    quyban: this.getLong(),
                    maxJoin: []
                };
                this.list.push(item)
            }
        }
    }

    export class ReceivedGetListRoomType extends BGUI.BaseInPacket {
        public list: Array<ImpRoomTypeInfo> = [];
        protected unpack(): void {
            let listSize = this.getShort();
            this.list = [];
            for (var i = 0; i < listSize; i++) {
                let item: ImpRoomTypeInfo = {
                    id: this.getInt(),
                    totalUser: this.getInt(),
                    moneyBet: this.getInt(),
                    minMoney: this.getInt(),
                    maxMoney: this.getInt(),
                    maxUserPerRoom: this.getInt()
                };
                this.list.push(item)
            }
        }
    }

    export class SendGetListRoom extends BGUI.BaseOutPacket {
        public player: number = 0
        getCmdId(): number {
            return Code.GET_LIST_ROOM;
        }

        putData(): void {
            this.putInt(1);//money type
            this.putInt(this.player);//maxplayer
            this.putLong(-1);//moneybet
            this.putInt(0);//rule
            this.putInt(0);//CARD_FROM
            this.putInt(50);//CARD_TO
        }
    }

    export class SendGetListRoomType extends BGUI.BaseOutPacket {
        public player: number = 0

        getCmdId(): number {
            return Code.GET_LIST_ROOM_TYPE;
        }

        putData(): void {
            this.putInt(0);
        }
    }

    export class SendJoinRoomById extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.JOIN_GAME_ROOM_BY_ID;
        }
        putData(): void {
            this.putInt(this.id);
            this.putString(this.pass);//mat khau
        }
        id: number
        pass: string = ""
    }

    export class SendJoinRoom extends BGUI.BaseOutPacket {
        public moneyType: number
        public maxUserPerRoom: number
        public moneyBet: number
        public rule: number
        public pass: string = ""

        getCmdId(): number {
            return Code.JOIN_ROOM;
        }
        putData(): void {
            this.putInt(this.moneyType);
            this.putInt(this.maxUserPerRoom);//mat khau
            this.putLong(this.moneyBet);//mat khau
            this.putInt(this.rule);//mat khau
        }
    }

    export class SendJoinRoomType extends BGUI.BaseOutPacket {
        public id: number
        public moneyBet: number
        public minMoney: number
        public maxMoney: number
        public maxUserPerRoom: number

        getCmdId(): number {
            return Code.JOIN_ROOM_TYPE;
        }

        putData(): void {
            this.putInt(this.id);
            this.putInt(this.moneyBet);
            this.putLong(this.minMoney);
            this.putInt(this.maxMoney);
            this.putInt(this.maxUserPerRoom);
        }
    }

    export class SendAutoReconnect extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.AUTO_RECONNECT_GAME_ROOM;
        }

        putData(): void {
        }
    }

    export class SendChatRoom extends BGUI.BaseOutPacket {
        public a: number
        public b: string

        getCmdId(): number {
            return Code.CHAT_ROOM;
        }
        putData(): void {
            this.putByte(this.a ? 1 : 0);
            this.putString(encodeURI(this.b));
        }
    }

    export class SendMoiChoi extends BGUI.BaseOutPacket {
        public listName: string[]

        getCmdId(): number {
            return Code.MOI_CHOI;
        }
        putData(): void {
            this.putShort(this.listName.length)
            for (var i = 0; i < this.listName.length; i++) {
                this.putString(this.listName[i])
            }
        }
    }

    export class SendRequestInfoMoiChoi extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.REQUEST_INFO_MOI_CHOI;
        }
        putData(): void {
            // TODO
        }
    }

    export class SendDatCuoc extends BGUI.BaseOutPacket {
        public moneyBet = 0;

        getCmdId(): number {
            return Code.DAT_CUOC
        }
        putData(): void {
            this.putLong(this.moneyBet);
        }

    }

    export class SendRequestLeaveGame extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.REQUEST_LEAVE_ROOM;
        }
        putData(): void {
            // TODO
        }
    }

    export class SendTipToBanker extends  BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.SKM_TIP_TO_BANKER;
        }
        putData(): void {
            // TODO
        }
    }

    export class ReceivedJoinRoomSuccess extends BGUI.BaseInPacket {
        public myChair: number = 0;
        public chuongChair: number = 0;
        public moneyBet: number = 0;
        public rule: number = 0;
        public roomId: number = 0;
        public gameId: number = 0;
        public moneyType: number = 0;
        public playerSize1: number = 0;
        public playerSize2: number = 0;
        public playerStatus = [];
        public playerInfos = [];
        public gameAction: number = 0;
        public countDownTime: number = 0;
        public bankMoney: number = 0;
        public bankTurn: number = 0;
        public gameServerState: number = 0;
        public cardsOfMe: Array<number>;
        public cardSizeOfMe: number = 0;

        protected unpack(): void {
            this.playerStatus = [];
            this.playerInfos = [];
            this.cardsOfMe = [];

            this.myChair = this.getByte();
            this.chuongChair = this.getByte();
            this.moneyBet = this.getLong();
            this.roomId = this.getInt();

            this.gameId = this.getInt();
            this.moneyType = this.getByte();
            this.rule = this.getByte();
            this.playerSize1 = this.getShort();

            for (let i = 0; i < this.playerSize1; i++) {
                this.playerStatus.push(this.getByte());
            }

            this.playerSize2 = this.getShort();
            for (let i = 0; i < this.playerSize2; i++) {
                let itemPlayer: ImpPlayerInfo = {
                    nickName: this.getString(),
                    displayName: this.getString(),
                    avatar: this.getString(),
                    money: this.getLong(),
                    cuocChuong: this.getLong(),
                    status: (this.playerStatus[i]) ? this.playerStatus[i] : 0,
                    isMe: (this.myChair == i),
                    isChuong: (this.chuongChair == i),
                    active: this.playerStatus[i] > 0,
                    indexChair: null,
                    cardSize: 0,
                    cards: [],
                    type: -1,
                    multiple: -1,
                    score: -1,
                }
                let cardsize = this.getInt();
                for (let j = 0; j < cardsize; j++) {
                    itemPlayer.cards.push(this.getInt());
                }
                itemPlayer.type = this.getInt();
                itemPlayer.multiple = this.getInt();
                itemPlayer.score  = this.getInt();
                this.playerInfos.push(itemPlayer)
            }
            this.cardSizeOfMe = this.getShort()

            for (let k = 0; k < this.cardSizeOfMe; k++) {
                this.cardsOfMe.push(this.getByte())
            }
            this.gameServerState = this.getByte()
            this.gameAction = this.getByte();
            this.countDownTime = this.getByte();
            this.bankMoney = this.getLong();
            this.bankTurn = this.getInt();
        }
    }

    export class ReceivedUpdateGameInfo extends BGUI.BaseInPacket {
        public chuongChair: number = 0;
        public myChair: number = 0;
        public cards = [];
        public gameServerState: number = 0;
        public gameAction: number = 0;
        public moneyType: number = 0;
        public moneyBet: number = 0;
        public gameId: number = 0;
        public roomId: number = 0;
        public hasInfo = [];
        public playerInfos = Array<ImpPlayerInfo>;
        public countDownTime: number = 0;
        public isAutoStart = false;
        public cardSize = null;
        public playerSize = null;
        public bankMoney: number = 0;
        public bankturn: number = 0;

        protected unpack(): void {
            this.cards = [];
            this.hasInfo = [];
            this.playerInfos = Array<ImpPlayerInfo>;

            this.myChair = this.getByte()
            this.chuongChair = this.getByte()
            this.cardSize = this.getShort();

            for (let i = 0; i < this.cardSize; i++) {
                this.cards.push(this.getByte())
            }

            this.gameServerState = this.getByte();
            this.isAutoStart = this.getBool();
            this.gameAction = this.getByte();
            this.countDownTime = this.getByte();

            this.moneyType = this.getByte();
            this.moneyBet = this.getLong();
            this.gameId = this.getInt();
            this.roomId = this.getInt();

            this.playerSize = this.getShort();

            for (let i = 0; i < this.playerSize; i++) {
                this.hasInfo[i] = this.getBool()
            }

            for (var i = 0; i < 9; i++) {
                if (this.hasInfo[i]) {
                    let itemPlayer = {
                        status: this.getByte(),
                        money: this.getLong(),
                        cuocChuong: this.getLong(),
                        avatar: this.getString(),
                        nickName: this.getString(),
                        displayName: this.getString(),
                        isMe: (this.myChair == i),
                        isChuong: (this.chuongChair == i),
                        active: true,
                        indexChair: null,
                        cardSize: 0,
                        cards: [],
                        type: -1,
                        multiple: -1,
                        score: -1,
                    }
                    let size = this.getInt();
                    itemPlayer.cardSize = size;
                    for (let sz = 0; sz < size; sz++) {
                        itemPlayer.cards.push(this.getInt());
                    }
                    if (itemPlayer.isMe) {
                        itemPlayer.cards = this.cards;
                    }
                    itemPlayer.type = this.getInt();
                    itemPlayer.multiple = this.getInt();
                    itemPlayer.score = this.getInt();
                    this.playerInfos[i] = itemPlayer;
                } else {
                    this.playerInfos[i] = { status: 0, money: 0, cuocChuong: null, avatar: null, nickName: "",  displayName: "", isMe: false, isChuong: false, active: false, indexChair: null, cardSize: 0, cards: [], type: -1, multiple: -1, score: -1, }
                }
            }
            this.bankturn = this.getInt();
            this.bankMoney = this.getLong();
        }
    }

    export class ReceivedAutoStart extends BGUI.BaseInPacket {
        public isAutoStart: boolean = false;
        public autoStartTime: number = 0;

        protected unpack(): void {
            this.isAutoStart = this.getBool();
            this.autoStartTime = this.getByte();
        }
    }

    export class ReceivedChiaBai extends BGUI.BaseInPacket {
        public cardSize = 0;
        public cards = [];
        public timeChiaBai = 0;
        public gameId = 0;
        public type = 0;
        public multiple = 0;
        public score = 0;

        protected unpack(): void {
            this.cardSize = this.getShort();
            this.cards = []
            for (let i = 0; i < this.cardSize; i++) {
                var card = this.getByte();
                this.cards.push(card);
            }
            this.gameId = this.getInt()
            this.timeChiaBai = this.getByte();
            this.type = this.getInt();
            this.multiple = this.getInt();
            this.score = this.getInt();
        }
    }

    export class ReceivedMoBai extends BGUI.BaseInPacket {
        public chair = 0;
        public cards = [];
        public numberCard = 0;
        public type = 0; // 0 normal, 1 shan 8, 2 shan 9, 3 trip
        public multiple = 0;
        public score = 0;

        protected unpack(): void {
            this.chair = this.getByte();
            this.numberCard = this.getShort();
            this.cards = [];
            for (let i = 0; i < this.numberCard; i++) {
                this.cards.push(this.getByte());
            }
            // this.bo = this.getInt();
            this.type = this.getInt();
            this.multiple = this.getInt();
            this.score = this.getInt();
        }
    }

    export class ReceivedChangeTurn extends BGUI.BaseInPacket {
        public newRound = false;
        public chair = 0;
        public lastChair = 0;
        public time = 0;

        
        protected unpack(): void {
            this.newRound = this.getBool();
            this.chair = this.getByte();
            this.lastChair = this.getByte()
            this.time = this.getByte()
        }
    }

    export class ReceivedBankMoney extends BGUI.BaseInPacket {
        public money = 0;
        public isThrow: boolean = false;
        protected unpack(): void {
            this.money = this.getLong();
            this.isThrow = this.getBool()
        }
    }

    export class ReceivedBankTurn extends BGUI.BaseInPacket {
        public bankTurn = 0;
        public countDownTime = 0;
        protected unpack(): void {
            this.bankTurn = this.getInt();
            this.countDownTime = this.getInt();
        }
    }

    export class ReceivedEndGame extends BGUI.BaseInPacket {
        public statusList: number[] = [];
        public tienThangChuong = 0;
        public tongTienCuoiVan = 0;
        public tongTienCuocList = [];
        public listPlayerPayout = [];
        public listPlayerBalance = [];
        public cardList = [];
        public countDownEndGame = 0;
        public bankMoney = 0;
        public playerSize1 = 0;
        public playerSize2 = 0;
        public playerSize3 = 0;
        public playerStatusSize = 0;

        protected unpack(): void {
            this.statusList = [];
            this.tongTienCuocList = [];
            this.listPlayerPayout = [];
            this.listPlayerBalance = [];

            this.playerStatusSize = this.getShort();

            for (let i = 0; i < this.playerStatusSize; i++) {
                this.statusList.push(this.getByte());
            }

            for (let i = 0; i < this.statusList.length; i++) {
                let cards = [];
                if (this.statusList[i] == 3) {
                    let cardSize = this.getShort()
                    for (let j = 0; j < cardSize; j++) {
                        cards.push(this.getByte())
                    }
                }

                this.cardList.push(cards);
            }

            this.tienThangChuong = this.getLong();
            this.tongTienCuoiVan = this.getLong();
            this.playerSize1 = this.getShort();

            for (let i = 0; i < this.playerSize1; i++) {
                let tien = 0;
                if (this.statusList[i] == 3) {
                    tien = this.getLong();
                }
                this.tongTienCuocList.push(tien)
            }

            this.playerSize2 = this.getShort();
            for (let i = 0; i < this.playerSize2; i++) {
                var tien = 0
                if (this.statusList[i] == 3) {
                    tien = this.getLong()
                }
                this.listPlayerPayout.push(tien)
            }

            this.playerSize3 = this.getShort();
            for (let i = 0; i < this.playerSize3; i++) {
                var tien = 0
                if (this.statusList[i] == 3) {
                    tien = this.getLong()
                }
                this.listPlayerBalance.push(tien);
            }

            this.countDownEndGame = this.getByte();
            this.bankMoney = this.getLong();
        }
    }

    export class ReceivedFirstTurnDecision extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.isRandom = this.getBool();
            this.chair = this.getByte();
            this.cardSize = this.getShort();
            this.cards = [];
            for (var a = 0; a < this.cardSize; a++) {
                var b = this.getByte();
                this.cards.push(b);
            }
        }
        public isRandom = false;
        public chair = 0;
        public cardSize = 0;
        public cards = [];
    }

    export class ReceivedDoiChuong extends BGUI.BaseInPacket {
        public chuongChair = 0;
        public bankMoney = 0;
        public bankTurn = 0;

        protected unpack(): void {
            this.chuongChair = this.getByte();
            this.bankMoney = this.getLong();
            this.bankTurn = this.getInt();
        }
    }

    export class ReceivedUserLeaveRoom extends BGUI.BaseInPacket {
        public chair = 0;
        public nickName = "";

        protected unpack(): void {
            this.chair = this.getByte();
            this.nickName = this.getString();
        }
    }

    export class ReceiveUserJoinRoom extends BGUI.BaseInPacket {
        public playerInfo: ImpPlayerInfo = null;
        public indexChair = 0;;
        public uStatus = 0;
        // type: this.getInt(),
        // multiple: this.getInt(),
        // score: this.getInt(),
        protected unpack(): void {
            this.playerInfo = {
                status: null,
                nickName: this.getString(),
                displayName: this.getString(),
                avatar: this.getString(),
                money: this.getLong(),
                cuocChuong: null,
                isMe: false,
                isChuong: false,
                active: true,
                indexChair: null,
                cardSize: 0,
                cards: [],
                type: -1,
                multiple: -1,
                score: -1,
            };
            this.indexChair = this.getByte();
            this.uStatus = this.getByte();
            this.playerInfo.indexChair = this.indexChair;
            this.playerInfo.status = this.uStatus;
        }
    }

    export class ReceivedUpdateMatch extends BGUI.BaseInPacket {
        public myChair = 0;
        public playerSize = 0;
        public listPlayerActive = [];
        public playerInfos = Array<ImpPlayerInfo>;

        protected unpack(): void {
            this.listPlayerActive = [];
            this.playerInfos = Array<ImpPlayerInfo>;

            this.myChair = this.getByte();
            this.playerSize = this.getShort();


            for (let i = 0; i < this.playerSize; i++) {
                this.listPlayerActive.push(this.getBool())
            }

            for (let i = 0; i < this.playerSize; i++) {
                let itemPlayer = {
                    status: 0,
                    money: 0,
                    cuocChuong: null,
                    avatar: null,
                    nickName: "",
                    displayName: "",
                    isMe: false,
                    isChuong: false,
                    active: false,
                    indexChair: null,
                    cardSize: 0,
                    cards: [],
                    type: -1,
                    multiple: -1,
                    score: -1,
                }
                if (this.listPlayerActive[i]) {
                    itemPlayer = {
                        cuocChuong: null,
                        nickName: this.getString(),
                        displayName: this.getString(),
                        avatar: this.getString(),
                        money: this.getLong(),
                        status: this.getInt(),
                        isMe: (i == this.myChair),
                        isChuong: false,
                        active: true,
                        indexChair: null,
                        cardSize: 0,
                        cards: [],
                        type: -1,
                        multiple: -1,
                        score: -1,
                    }
                }

                this.playerInfos[i] = itemPlayer;
            }
        }
    }

    export class ReceiveNotifyRegOutRoom extends BGUI.BaseInPacket {
        public outChair = 0;
        public isOutRoom = false;

        protected unpack(): void {
            this.outChair = this.getByte();
            this.isOutRoom = this.getBool()
        }
    }

    export class ResMoneyBetConfig extends BGUI.BaseInPacket {
        public list = [];
        public rules = [];

        protected unpack(): void {
            let listSize = this.getShort();
            for (var a = 0; a < listSize; a++) {
                var b = {
                    maxUserPerRoom: this.getInt(),
                    moneyType: this.getByte(),
                    moneyBet: this.getLong(),
                    moneyRequire: this.getLong(),
                    nPersion: this.getInt(),
                };
                this.list.push(b);
            }
            for (a = 0; a < listSize; a++) this.rules.push(this.getByte());
        }
    }

    export class ReceivedMoiDatCuoc extends BGUI.BaseInPacket {
        public timeDatCuoc = 0;
        protected unpack(): void {
            this.timeDatCuoc = this.getByte();
        }
    }

    export class ReceivedDatCuoc extends BGUI.BaseInPacket {
        public chair = 0;
        public moneyBet = 0;
        protected unpack(): void {
            this.chair = this.getByte();
            this.moneyBet = this.getLong();
        }
    }

    export class ReceivedRutBai extends BGUI.BaseInPacket {
        public chair = 0;
        public card = 0;
        public type = 0;
        public multiple = 0;
        public score = 0;

        protected unpack(): void {
            this.chair = this.getByte();
            this.card = this.getByte();
            this.type = this.getInt();
            this.multiple = this.getInt();
            this.score = this.getInt();
        }
    }

    export class ReceivedTipToBanker extends BGUI.BaseInPacket {
        public chair = 0;
        public amount = 0;
        protected unpack(): void {
            this.chair = this.getInt();
            this.amount = this.getInt();
        }
    }
}
export default SKMCmd;