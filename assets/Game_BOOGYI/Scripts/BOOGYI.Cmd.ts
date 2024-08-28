const { ccclass } = cc._decorator;

export namespace BOOGYICmd {
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
        static UPDATE_GAME_INFO = 3110;
        static REQUEST_LEAVE_ROOM = 3111;
        static XEP_BAI = 3112;
        static DOI_CHUONG = 3113;
        static MOI_DAT_CUOC = 3114;
        static MOI_DAT_BID = 3115;
        static HOLD = 3116;
        static JOIN_ROOM_SUCCESS = 3118;
        static USER_LEAVE_ROOM = 3119;
        static NOTIFY_KICK_OFF = 3120;
        static USER_JOIN_ROOM = 3121;
        static UPDATE_MATCH = 3123;
        static BANK_MONEY = 3124
        static RUT_BAI = 3128
        static DANH_BAI = -1;
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
        static MONEY_BET_CONFIG = 3003;
        static TESTSEND = 3109;
        static DAT_CUOC = 3109;
        static DAT_BID = 3108;
        static DOUBLE_BANKER = 3125;
        static TESTRECEIVE = 3151;
        static GET_LIST_ROOM_TYPE = 3020;
        static JOIN_ROOM_TYPE = 3021;
        static AUTO_RECONNECT_GAME_ROOM_FAIL = 3023;
        static AUTO_RECONNECT_GAME_ROOM = 3022;
        static TIP = 3024;
        static MINI_GET_BALANCE = 20051;
    }

    
    // export interface ImpRoomInfo {
    //     id: number,
    //     userCount: number,
    //     limitPlayer: number,
    //     maxUserPerRoom: number,
    //     moneyType: number,
    //     moneyBet: number,
    //     requiredMoney: number,
    //     rule: number,
    //     nameRoom: string,
    //     key: boolean,
    //     quyban: number,
    //     maxJoin: Array<number>
    // }

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
        userName?: any,
        displayName: any,
        // nickName?: any,
        avatar: any,
        money: any,
        cuocChuong: any,
        bid: number,
        isMe: boolean,
        isChuong: boolean,
        active: boolean,
        chairInTable: any,
        cardSize: number,
        cards: any
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

    export class ReceivedXepBai extends BGUI.BaseInPacket {
        public chair: number = -1;
        public playerSize: number = 0;
        public cards = [];

        protected unpack(): void {
            this.chair = this.getInt();
            this.playerSize = this.getShort()
            for (let i = 0; i < this.playerSize; i++) {
                this.cards.push(this.getByte())
            }
        }
    }

    export class SendXepBai extends BGUI.BaseOutPacket {
        public cards: Array<number>

        getCmdId(): number {
            return Code.XEP_BAI;
        }
        putData(): void {
            this.putShort(this.cards.length)
            for (var i = 0; i < this.cards.length; i++) {
                this.putInt(this.cards[i])
            }
        }
    }

    export class SendBid extends BGUI.BaseOutPacket {
        public bid = 0;

        getCmdId(): number {
            return Code.DAT_BID;
        }
        putData(): void {
            this.putInt(this.bid);
        }
    }

    export class ReceiveDoubleBanker extends BGUI.BaseInPacket {
        protected unpack(): void {
            // this.test = this.getInt();
        }
        // test = null;

    }

    export class SendRutBai extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.RUT_BAI;
        }
        putData(): void {
            // this.putInt(1);
        }
    }

    export class SendCreateRoom extends BGUI.BaseOutPacket {
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
        moneyBet: number;
        limitPlayer: number;
        password: string;
        roomName: string;

    }

    export class ReceiveInfoMoiChoi extends BGUI.BaseInPacket {
        public listName = [];
        public listMoney = [];
        public size1 = 0;
        public size2 = 0;

        protected unpack(): void {
            this.size1 = this.getShort()
            for (var i = 0; i < this.size1; i++) {
                this.listName.push(this.getString())
            }
            this.size2 = this.getShort()
            for (var i = 0; i < this.size2; i++) {
                this.listMoney.push(this.getLong())
            }
        }
    }

    export class ReceivedJoinRoomFail extends BGUI.BaseInPacket {
        protected unpack(): void {
            // TODO
        }
    }

    export class ReceivedMoiChoi extends BGUI.BaseInPacket {
        public id: number;
        public maxUserPerRoom: number;
        public moneyBet: number;
        public inviter: string;
        public rule: number;

        protected unpack(): void {
            this.id = this.getInt();
            this.maxUserPerRoom = this.getByte();
            this.moneyBet = this.getLong();
            this.inviter = this.getString();
            this.rule = this.getInt();
        }
    }

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

    export class SendGetListRoomType extends BGUI.BaseOutPacket {
        public player: number = 0;
        getCmdId(): number {
            return Code.GET_LIST_ROOM_TYPE;
        }
        putData(): void {
            this.putInt(0);
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
        public listName: string[];

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
        }
    }

    export class SendDatCuoc extends BGUI.BaseOutPacket {
        public range: number;

        getCmdId(): number {
            return Code.DAT_CUOC
        }
        putData(): void {
            this.putByte(this.range);
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
        public playerSize3: number = 0;
        public playerStatus = [];
        public playerInfos = [];
        public cards = [];
        public gameServerState: number = 0;
        public gameAction: number = 0;
        public countDownTime: number = 0;
        public bid: number = 0;

        protected unpack(): void {
            this.playerStatus = [];
            this.playerInfos = [];
            this.cards = [];

            this.myChair = this.getByte();
            this.chuongChair = this.getByte();
            this.moneyBet = this.getLong();
            this.roomId = this.getInt();
            this.gameId = this.getInt();
            this.moneyType = this.getByte();
            this.rule = this.getByte();

            this.playerSize1 = this.getShort();

            for (let i = 0; i < this.playerSize1; i++) {
                this.playerStatus.push(this.getByte())
            }

            this.playerSize2 = this.getShort();
            for (let i = 0; i < this.playerSize2; i++) {
                let itemPlayer: ImpPlayerInfo = {
                    status: (this.playerStatus[i]) ? this.playerStatus[i] : 0,
                    userName: this.getString(),
                    displayName: this.getString(),
                    // nickName: this.getString(),
                    avatar: this.getString(),
                    money: this.getLong(),
                    cuocChuong: this.getInt(),
                    bid: this.getInt(),
                    isMe: (this.myChair == i),
                    isChuong: (this.chuongChair == i),
                    active: this.playerStatus[i] > 0,
                    chairInTable: null,
                    cardSize: 0,
                    cards: [],
                };

                let cardsize = this.getInt();
                for (let j = 0; j < cardsize; j++) {
                    itemPlayer.cards.push(this.getInt());
                }
                if(this.chuongChair == i) {
                    this.bid = itemPlayer.bid;
                }
                this.playerInfos.push(itemPlayer)
            }

            let cardSize = this.getShort();

            for (let k = 0; k < cardSize; k++) {
                this.cards.push(this.getByte())
            }

            this.gameServerState = this.getByte();
            this.gameAction = this.getByte();
            this.countDownTime = this.getByte();
        }
    }

    export class ReceivedUpdateGameInfo extends BGUI.BaseInPacket {
        public chuongChair: number = 0;
        public myChair: number = 0;
        public cardSize: number = 0;
        public cards = [];
        public gameServerState: number = 0;
        public gameAction: number = 0;
        public moneyType: number = 0;
        public moneyBet: number = 0;
        public gameId: number = 0;
        public roomId: number = 0;
        public playerSize: number = 0;
        public playerStatus = [];
        public playerInfos = [];
        public countDownTime: number = 0;
        public isAutoStart: boolean = false;
        public bid: number = -1;

        protected unpack(): void {
            this.cards = [];
            this.playerStatus = [];
            this.playerInfos = [];
            this.myChair = this.getByte();
            this.chuongChair = this.getByte();
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

            for (var i = 0; i < this.playerSize; i++) {
                this.playerStatus[i] = this.getBool()
            }

            for (var i = 0; i < 7; i++) {
                if (this.playerStatus[i]) {
                    let itemPlayer: ImpPlayerInfo = {
                        status: this.getByte(),
                        money: this.getLong(),
                        cuocChuong: this.getInt(),
                        avatar: this.getString(),
                        // nickName: this.getString(),
                        userName: this.getString(),
                        displayName: this.getString(),
                        bid: this.getInt(),
                        isMe: (this.myChair == i),
                        isChuong: (this.chuongChair == i),
                        active: true,
                        chairInTable: null,
                        cardSize: 0,
                        cards: []
                    }
                    let sizebai = this.getInt();
                    for (var j = 0; j < sizebai; j++) {
                        itemPlayer.cards.push(this.getInt());
                    }
                    this.playerInfos[i] = itemPlayer
                } else {
                    this.playerInfos[i] = {
                        status: 0,
                        money: 0,
                        cuocChuong: null,
                        avatar: null,
                        // nickName: "",
                        userName: "",
                        displayName: "",
                        bid: -1,
                        isMe: false,
                        isChuong: false,
                        active: false,
                        chairInTable: null,
                        cardSize: 0,
                        cards: []
                    }
                }
            }
            this.bid = this.getInt();
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
        public cardSize: number = 0;
        public cards:Array<number> = [];
        public countDownTime: number = 0;
        public gameId: number = 0;

        protected unpack(): void {
            this.cardSize = this.getShort()
            this.cards = []
            for (let i = 0; i < this.cardSize; i++) {
                this.cards.push(this.getByte())
            }
            this.gameId = this.getInt()
            this.countDownTime = this.getByte()
        }
    }

    export class ReceivedBankMoney extends BGUI.BaseInPacket {
        public money: number = 0;
        public bankTurn: number = 0;

        protected unpack(): void {
            this.money = this.getLong()
            this.bankTurn = this.getInt();
        }
    }

    export class ReceivedEndGame extends BGUI.BaseInPacket {
        public listStatus = [];
        public tienThangChuong: number = 0;
        public tongTienCuoiVan: number = 0;

        public tongTienCuocList = [];
        public tongCuoiVanList = [];
        public listPlayerBalance = []
        public cardList = [];
        public countDownTime: number = 0;
        public playerSize1: number = 0;
        public playerSize2: number = 0;
        public playerSize3: number = 0;
        public playerSize4: number = 0;

        protected unpack(): void {
            this.tongTienCuocList = [];
            this.tongCuoiVanList = [];
            this.listPlayerBalance = [];
            this.playerSize1 = this.getShort();

            for (let i = 0; i < this.playerSize1; i++) {
                this.listStatus.push(this.getByte())
            }

            for (let i = 0; i < this.listStatus.length; i++) {
                let cards = []
                if (this.listStatus[i] == 3) {
                    let cardSize = this.getShort();
                    for (let j = 0; j < cardSize; j++) {
                        cards.push(this.getByte())
                    }
                }
                this.cardList.push(cards)
            }

            this.tienThangChuong = this.getLong();
            this.tongTienCuoiVan = this.getLong();

            this.playerSize2 = this.getShort(); // ko dùng
            for (let i = 0; i < this.playerSize1; i++) {
                let money2 = 0
                if (this.listStatus[i] == 3) {
                    money2 = this.getLong()
                }
                this.tongTienCuocList.push(money2)
            }

            this.playerSize3 = this.getShort(); // ko dùng

            for (let i = 0; i < this.playerSize1; i++) {
                let money3 = 0
                if (this.listStatus[i] == 3) {
                    money3 = this.getLong()
                }
                this.tongCuoiVanList.push(money3)
            }

            this.playerSize4 = this.getShort(); // ko dùng

            for (let i = 0; i < this.playerSize1; i++) {
                let balance = 0
                if (this.listStatus[i] == 3) {
                    balance = this.getLong();
                }
                this.listPlayerBalance.push(balance);
            }
            this.countDownTime = this.getByte()
        }
    }

    export class ReceivedDatBid extends BGUI.BaseInPacket {
        public chair: number = 0;
        public bid: number = 0;

        protected unpack(): void {
            this.chair = this.getInt();
            this.bid = this.getInt();
        }
    }

    export class ReceivedDoiChuong extends BGUI.BaseInPacket {
        public chuongChair: number = 0;

        protected unpack(): void {
            this.chuongChair = this.getByte();
        }
    }

    export class ReceivedPingPong2 extends BGUI.BaseInPacket {
        public id = 0;
        protected unpack(): void {
            this.id = this.getLong()
        }
    }

    export class UserLeaveRoom extends BGUI.BaseInPacket {
        public chair: number = 0;
        public nickName: string = "";
        protected unpack(): void {
            this.chair = this.getByte();
            this.nickName = this.getString()
        }
    }

    export class ReceiveUserJoinRoom extends BGUI.BaseInPacket {
        // public nickName: string = "";
        public userName: string = "";
        public avatar: string = "";
        public money: number = 0;
        public chairOfUser: number = 0;
        public status: number = 0;
        public displayName: string = "";
        public playerInfo: BOOGYICmd.ImpPlayerInfo;
        protected unpack(): void {
            // this.nickName = this.getString();
            this.userName = this.getString();
            this.avatar = this.getString();
            this.money = this.getLong();
            this.chairOfUser = this.getByte();
            this.status = this.getByte();
            this.displayName= this.getString();
            this.playerInfo = {
                // nickName: this.nickName,
                userName: this.userName,
                avatar: this.avatar,
                money: this.money,
                cuocChuong: 0,
                bid: -1,
                isMe: false,
                isChuong: false,
                active: true,
                chairInTable: null,
                cardSize: 0,
                cards: [],
                status: this.status,
                displayName: this.displayName
            };
        }
    }

    export class ReceivedUpdateMatch extends BGUI.BaseInPacket {
        public myChair = 0;
        public playerSize = 0;
        public playerStatus = [];
        public playerInfos = [];
        protected unpack(): void {
            this.playerInfos = [];
            this.playerStatus = [];
            this.myChair = this.getByte()
            this.playerSize = this.getShort()
            for (let i = 0; i < this.playerSize; i++) {
                this.playerStatus.push(this.getBool());
            }

            for (var i = 0; i < this.playerSize; i++) {
                let itemPlayer: ImpPlayerInfo = {
                    status: 0,
                    money: 0,
                    cuocChuong: null,
                    avatar: null,
                    userName: "",
                    displayName: "",
                    bid: -1,
                    isMe: false,
                    // nickName: "",
                    isChuong: false,
                    active: false,
                    chairInTable: null,
                    cardSize: 0,
                    cards: []
                }
                if (this.playerStatus[i]) {
                    itemPlayer = {
                        userName: this.getString(),
                        displayName: this.getString(),
                        avatar: this.getString(),
                        money: this.getLong(),
                        status: this.getInt(),
                        isMe: (i == this.myChair),
                        cuocChuong: null,
                        bid: -1,
                        isChuong: false,
                        active: true,
                        chairInTable: null,
                        cardSize: 0,
                        cards: []
                        // nickName: this.getString(),
                    }
                }
                this.playerInfos.push(itemPlayer)
            }
        }
    }

    export class ReceiveNotifyRegOutRoom extends BGUI.BaseInPacket {
        public outChair: number = 0;
        public isOutRoom: boolean = false;

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
        public timeDatCuoc: number = 0;

        protected unpack(): void {
            this.timeDatCuoc = this.getByte();
        }
    }

    export class ReceivedMoiDatBid extends BGUI.BaseInPacket {
        public timeDatCuoc: number = 0;
        public bidMax: number = 0;
        protected unpack(): void {
            this.timeDatCuoc = this.getByte();
            this.bidMax = this.getByte();
        }
    }

    export class ReceivedDatCuoc extends BGUI.BaseInPacket {
        public chair: number = 0;
        public rate: number = 0;

        protected unpack(): void {
            this.chair = this.getByte();
            this.rate = this.getByte();
        }
    }

    export class ReceivedRutBai extends BGUI.BaseInPacket {
        public chair: number = 0;
        public card: number = 0;
        public countDownTime: number = 0;

        protected unpack(): void {
            this.chair = this.getByte();
            this.card = this.getByte();
            this.countDownTime = this.getByte();
        }
    }

    export class SendTip extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.TIP;
        }
        putData(): void {
        }
    }

    export class ReceivedTip extends BGUI.BaseInPacket {
        public chair: number = 0;
        public amount: number = 0;

        protected unpack(): void {
            this.chair = this.getInt();
            this.amount = this.getInt();
        }
    }

    // export class SendUpdateRoomBalance extends BGUI.BaseOutPacket {
    //     getCmdId(): number {
    //         return Code.MINI_GET_BALANCE;
    //     }
    //     putData(): void {
    //     }
    // }

    // export class ReceivedUpdateRoomBalance extends BGUI.BaseInPacket {
    //     public balance: number = 0;

    //     protected unpack(): void {
    //         this.balance = this.getByte();
    //     }
    // }
}

export default BOOGYICmd;