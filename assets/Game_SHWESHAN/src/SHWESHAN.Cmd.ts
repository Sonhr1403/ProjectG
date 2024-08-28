const { ccclass } = cc._decorator;

export namespace SHWESHANCmd {
    export class Code {
        static LOGIN = 1;
        static NOTIFY_DISCONNECT = 37;
        static PING_PONG = 50;
        static JOIN_ROOM = 3001;
        static QUICK_ROOM_SUCCEED = 3006;
        static  XEP_BAI_LAI = 3100; //test xep lai

        static MO_BAI = 3101;
        static START_GAME = 3102;
        static END_GAME = 3103;
        static CHIA_BAI = 3105;
        static BO_LUOT = 3106;
        static AUTO_START = 3107;
        static UPDATE_GAME_INFO = 3110; 
        static REQUEST_LEAVE_ROOM = 3111;
        static XEP_BAI = 3112;
        static XEP_BAI_XONG = 3113;
        static MOI_DAT_CUOC = 3114;
        static MOI_XEP_BAI = 3115;
        static HOLD = 3116;
        static JOIN_ROOM_SUCCESS = 3118; 
        static USER_LEAVE_ROOM = 3119;
        static NOTIFY_KICK_OFF = 3120;
        static USER_JOIN_ROOM = 3121; 
        static UPDATE_MATCH = 3123;
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
        static GET_LIST_ROOM_TYPE = 3020; 
        static JOIN_ROOM_TYPE = 3021;
        static AUTO_RECONNECT_GAME_ROOM_FAIL = 3023;
        static AUTO_RECONNECT_GAME_ROOM = 3022;
        
        static TESTRECEIVE = 3151;
        static TIP = 3024;
        //new
        static END_GAME_NOTIFY = 3025;

    }

    export class TESTRECEIVE extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.test = this.getInt();
        }
        test = null;

    }
    export interface ImpRoomTypeInfo {
        id: number,
        totalUser: number,
        moneyBet: number,
        minMoney: number,
        maxMoney: number,
        maxUserPerRoom: number,
    }

    export class TESTSEND extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.TESTSEND;
        }
        putData(): void {
            this.putInt(1);
        }

    }
    export class SendAutoReconnect extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.AUTO_RECONNECT_GAME_ROOM;
        }

        putData(): void {
        }
    }
    export class TIP extends BGUI.BaseOutPacket {
        
        getCmdId(): number {
            return Code.TIP;
        }

        putData(): void {
        }

        
    }

    export class ReceivedTIP extends BGUI.BaseInPacket{
        chair: number
        amount: number
        protected unpack(): void {
            this.chair = this.getInt()
            this.amount = this.getInt()
        }

    }

    export class ReceivedXepBai extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.chair = this.getInt();
            this.card1 = this.getInt();
            this.card2 = this.getInt();
        }
        chair;
        card1;
        card2;

    }
    export class sendXepBaiXong extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.XEP_BAI_XONG;
        }
        putData(): void {
        }

    }

    export class ReceivedXepBaiXong extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.chair = this.getInt();
        }
        chair;

    }

    export class SendXepBai extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.XEP_BAI;
        }
        putData(): void {
            this.putInt(this.card1)
            this.putInt(this.card2)
            
        }
        card1
        card2
    }

    export class ReceiveDoubleBanker extends BGUI.BaseInPacket {
        protected unpack(): void {
            // this.test = this.getInt();
        }
        // test = null;

    }

    export class SendDoubleBanker extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.DOUBLE_BANKER;
        }
        putData(): void {
            this.putByte(this.confirm);
        }
        confirm:boolean
    }


    export class ReceiveRutBai extends BGUI.BaseInPacket {
        protected unpack(): void {
        }
    }

    export class ReceiveCreateRoom extends BGUI.BaseInPacket {
        protected unpack(): void {
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

    export class SendGetGameConfig extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.MONEY_BET_CONFIG;
        }
        putData(): void {

        }
    }

    export class ReceiveInfoMoiChoi extends BGUI.BaseInPacket {
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

        listName = [];
        listMoney = [];
    }
    export class ReceivedJoinRoomFail extends BGUI.BaseInPacket {
        protected unpack(): void {

        }
    }
    export class ReceivedMoiChoi extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.id = this.getInt();
            this.maxUserPerRoom = this.getByte();
            this.moneyBet = this.getLong();
            this.inviter = this.getString();
            this.rule = this.getInt();
        }
        id;
        maxUserPerRoom;
        moneyBet;
        inviter;
        rule;
    }
    // new
    export class ReceivedChatRoom extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.chair = this.getByte();
            this.isIcon = this.getBool();
            this.content = decodeURI(this.getString());
            this.nickname = this.getString()
        }
        chair: number;
        isIcon: boolean;
        content: string;
        nickname: string;
    }


    // export class ReceivedGetListRoom extends BGUI.BaseInPacket {
        
    //     protected unpack(): void {
    //         let listSize = this.getShort();
    //         this.list = [];
    //         for (var i = 0; i < listSize; i++) {
    //             let item: any = {};
    //             item["id"] = this.getInt();
    //             item["userCount"] = this.getByte();
    //             item["limitPlayer"] = this.getByte();
    //             item["maxUserPerRoom"] = this.getInt();
    //             item["moneyType"] = this.getByte();
    //             item["moneyBet"] = this.getInt();
    //             item["requiredMoney"] = this.getInt();
    //             item["rule"] = this.getByte();
    //             item["nameRoom"] = this.getString();
    //             item["key"] = this.getBool();
    //             item["quyban"] = this.getLong();
    //             this.list.push(item)
    //         }
    //     }
    //     list: any[] = [];

    // }

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

    //test
    export class SendGetListRoom extends BGUI.BaseOutPacket {

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

        player: number = 0
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
    //new
    export class SendEndGameNotify extends BGUI.BaseOutPacket {
        public player: number = 0

        getCmdId(): number {
            return Code.END_GAME_NOTIFY;
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
        getCmdId(): number {
            return Code.JOIN_ROOM;
        }
        putData(): void {
            this.putInt(this.moneyType);
            this.putInt(this.maxUserPerRoom);//mat khau
            this.putLong(this.moneyBet);//mat khau
            this.putInt(this.rule);//mat khau
        }
        moneyType: number
        maxUserPerRoom: number
        moneyBet: number
        rule: number
        pass: string = ""
    }
    export class SendChatRoom extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.CHAT_ROOM;
        }
        putData(): void {
            this.putByte(this.a ? 1 : 0);
            this.putString(encodeURI(this.b));
        }
        a: number
        b: string

    }

    export class SendMoiChoi extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.MOI_CHOI;
        }
        putData(): void {
            this.putShort(this.listName.length)
            for (var i = 0; i < this.listName.length; i++) {
                this.putString(this.listName[i])
            }
        }
        listName: string[]
    }

    export class SendRequestInfoMoiChoi extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.REQUEST_INFO_MOI_CHOI;
        }
        putData(): void {
        }

    }

    export class SendLogin extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.LOGIN;
        }
        putData(): void {
            this.putString(this.a);
            this.putString(this.b);
        }
        a: string
        b: string
    }

    export class SendReconnectRoom extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.RECONNECT_GAME_ROOM;
        }
        putData(): void {

        }

    }

    export class SendStartGame extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.START_GAME;
        }
        putData(): void {
            
        }
    }
    export class SendXepBaiLai extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.XEP_BAI_LAI
        }
        putData(): void {
        }
        
    }
    export class SendMoBai extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.MO_BAI
        }
        putData(): void {
            
        }

    }

    export class SendDatCuoc extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.DAT_CUOC
        }
        putData(): void {
            this.putByte(this.range);
        }
        range

    }

    export class SendBoLuot extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.BO_LUOT
        }
        putData(): void {
            // this.putByte(1);
        }
        
    }

    export class SendRequestLeaveGame extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.REQUEST_LEAVE_ROOM;
        }
        putData(): void {

        }
    }


    export class ReceivedJoinRoomSuccess extends BGUI.BaseInPacket {
        protected unpack(): void {
            var i
            // gia cua toi tren server
            this.myChair = this.getByte();
            this.chuongChair = this.getByte();
            this.moneyBet = this.getLong()
            this.roomId = this.getInt()
            this.gameId = this.getInt()

            this.moneyType = this.getByte()
            this.rule = this.getByte()
            this.playerSize = this.getShort()
            this.playerStatus = []
            for (i = 0; i < this.playerSize; i++) {
                this.playerStatus.push(this.getByte())
            }

            this.playerSize = this.getShort()
            this.playerInfos = []
            for (i = 0; i < this.playerSize; i++) {
                var player = {}
                player['userName'] = this.getString()
                player['displayName'] = this.getString()
                player['avatar'] = this.getString()
                player['money'] = this.getLong()
                player['status'] = this.playerStatus[i];
                this.playerInfos.push(player)
            }
            this.gameServerState = this.getByte();
            this.gameAction = this.getByte()
            this.countDownTime = this.getByte();
        }
        myChair = 0;
        chuongChair = 0;
        moneyBet = 0;
        rule = 0;
        roomId = 0;
        gameId = 0;
        moneyType = 0;
        playerSize = 0;
        playerStatus = [];
        playerInfos = [];
        gameAction = 0;
        countDownTime = 0;
        gameServerState = 0;

    }

    export class ReceivedDisconnect extends BGUI.BaseInPacket {
        protected unpack(): void {
        }
    }

    export class ReceivedUpdateGameInfo extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.myChair = this.getByte()
            this.chuongChair = this.getByte()

            // bo Bai
            var cardSize = this.getShort()
            this.cards = []
            for (var i = 0; i < cardSize; i++) {
                this.cards.push(this.getByte())
            }

            this.gameServerState = this.getByte()
            this.isAutoStart = this.getBool()
            this.gameAction = this.getByte()
            this.countDownTime = this.getByte()

            this.moneyType = this.getByte()
            this.moneyBet = this.getLong()
            this.gameId = this.getInt()
            this.roomId = this.getInt()

            this.hasInfo = []
            let size = this.getShort()
            for (var i = 0; i < size; i++) {
                this.hasInfo[i] = this.getBool()
            }

            for (var i = 0; i < 6; i++) {
                if (this.hasInfo[i]) {
                    this.playerInfos[i] = []
                    this.playerInfos[i].status = this.getByte()
                    this.playerInfos[i].money = this.getLong()
                    this.playerInfos[i].avatar = this.getString()
                    this.playerInfos[i].userName = this.getString()
                    this.playerInfos[i].displayName = this.getString()
                }else {
                    this.playerInfos[i] = []
                    this.playerInfos[i].status = 0
                }
            }
        }
        chuongChair = 0;
        myChair = 0;
        cards = [];
        gameServerState = 0;
        gameAction = 0;
        moneyType = 0;
        moneyBet = 0;
        gameId = 0;
        roomId = 0;
        hasInfo = [];
        playerInfos = [];
        countDownTime
        isAutoStart
    }

    export class ReceivedAutoStart extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.isAutoStart = this.getBool();
            this.autoStartTime = this.getByte();
        }
        isAutoStart = false;
        autoStartTime = 0;

    }

    export class ReceivedChiaBai extends BGUI.BaseInPacket {
        protected unpack(): void {
            var i = 0
            this.cardSize = this.getShort()
            this.cards = []
            for (i = 0; i < this.cardSize; i++) {
                this.cards.push(this.getByte())
            }
            this.gameId = this.getInt()
            this.timeChiaBai = this.getByte()
        }
        cardSize = 0;
        cards = [];
        timeChiaBai = 0;
        gameId = 0;

    }

    export class ReceivedMoBai extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.chair = this.getByte();
            var b = this.getShort();
            this.cards = [];
            for (var a = 0; a < b; a++) this.cards.push(this.getByte());
            this.bo = this.getInt();
        }
        chair = 0;
        cards = [];
        bo = 0;
    }

    export class ReceivedBoluot extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.chair = this.getByte()
        }
        chair = 0;
    }

    export class ReceivedChangeTurn extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.newRound = this.getBool();
            this.chair = this.getByte();
            this.lastChair = this.getByte()
            this.time = this.getByte()
        }
        newRound = false;
        chair = 0;
        lastChair = 0;
        time = 0;
    }

    export class ReceivedBankMoney extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.money = this.getLong()
            this.bankTurn = this.getInt();
        }
        money = 0;
        bankTurn = 0;
    }

    export class ReceivedEndGame extends BGUI.BaseInPacket {
        protected unpack(): void {
            var i = 0
            
            let playerStatusSize = this.getShort()
            for (i = 0; i < playerStatusSize; i++) {
                this.statusList.push(this.getByte())
            }
            for (i = 0; i < this.statusList.length; i++) {
                var cards = []
                if (this.statusList[i] == 3) {
                  var cardSize = this.getShort()
                  for (var j = 0; j < cardSize; j++) {
                    cards.push(this.getByte())
                  }
                }
          
                this.cardList.push(cards)
            }
            let resultInfoSize = this.getShort();
            

            for(i = 0; i < resultInfoSize; i++){
                this.resultInfos[i] = {};
                this.resultInfos[i].chair = this.getInt();
                let roundThangSize = this.getShort();
                this.resultInfos[i].roundThang = [];
                for(let idx1 = 0; idx1 < roundThangSize; idx1++){
                    this.resultInfos[i].roundThang.push(this.getInt());
                }
                let boSize = this.getShort();
                this.resultInfos[i].bo = [];
                for(let idx1 = 0; idx1 < boSize; idx1++){
                    this.resultInfos[i].bo.push(this.getInt());
                    console.log("lung logic", this.resultInfos[i].bo)
                }
                this.resultInfos[i].tienThang = this.getLong();
                this.resultInfos[i].tongTienCuoiVan = this.getLong();
                
                let moneyNeedToPayPerRoundSize = this.getShort();
                this.resultInfos[i].moneyNeedToPayPerRound = [];
                for(let idx1 = 0; idx1 < moneyNeedToPayPerRoundSize; idx1++){
                    this.resultInfos[i].moneyNeedToPayPerRound.push(this.getLong());
                }
            }
            let roundThangSize = this.getShort();
            for(let idx1 = 0; idx1 < roundThangSize; idx1++){
                this.roundThang.push(this.getInt());
            }
            let boSize = this.getShort();
            for(let idx1 = 0; idx1 < boSize; idx1++){
                this.bo.push(this.getInt());
            }
            this.tienThang = this.getLong();
            this.tongTienCuoiVan = this.getLong();

            let moneyNeedToPayPerRoundSize = this.getShort();
            for(let index = 0; index < moneyNeedToPayPerRoundSize; index++){
                this.moneyNeedToPayPerRound.push(this.getLong());
            }

            this.tongTienCuocList = []
            this.tongCuoiVanList = []
            this.currentMoneyList = []
            
            var playerSize = this.getShort()

            for (i = 0; i < playerStatusSize; i++) {
                var tien = 0
                if (this.statusList[i] == 3) {
                    tien = this.getLong()
                }
                this.tongTienCuocList.push(tien)
            }

            playerSize = this.getShort()
            for (i = 0; i < playerStatusSize; i++) {
                var tien = 0
                if (this.statusList[i] == 3) {
                    tien = this.getLong()
                }
                this.tongCuoiVanList.push(tien)
            }

            playerSize = this.getShort()
            for (i = 0; i < playerStatusSize; i++) {
                var tien = 0
                if (this.statusList[i] == 3) {
                    tien = this.getLong()
                }
                this.currentMoneyList.push(tien)
            }
            this.countDown = this.getByte()
        }
        statusList: number[] = [];
        tienThang = 0;
        tienThangGa = 0;
        keCuaMoneyList = [];
        danhBienMoneyList = [];
        tongTienCuoiVan = 0;
        moneyNeedToPayPerRound = [];
        tongTienCuocList = []
        tongDanhBienList = []
        tongKeCuaList = []
        tongCuocGaList = []
        tongCuoiVanList = []
        currentMoneyList = []
        cardList = []
        countDown = 0;
        resultInfos = [];
        roundThang = [];
        bo = [];
    }

    export class ReceivedPingPong2 extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.id = this.getLong()

        }
        id = 0;
    }

    export class UserLeaveRoom extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.chair = this.getByte();
            this.nickName = this.getString()
        }
        chair = 0;
        nickName = "";


    }

    export class ReceiveUserJoinRoom extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.info = {
                nickname: this.getString(),
                displayName: this.getString(),
                avatar: this.getString(),
                money: this.getLong(),

            };
            this.uChair = this.getByte();
            this.uStatus = this.getByte()
        }
        info = {};
        uChair = 0;;
        uStatus = 0;

    }

    export class ReceivedUpdateMatch extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.myChair = this.getByte()

            var size = this.getShort()
            this.hasInfo = []
            for (var i = 0; i < size; i++) {
                this.hasInfo.push(this.getBool())
            }

            this.infos = []
            for (var i = 0; i < size; i++) {
                var info = {}
                if (this.hasInfo[i]) {
                    // info['nickName'] = this.getString()
                    info['username'] = this.getString()
                    info['displayName'] = this.getString()
                    info['avatar'] = this.getString()
                    info['money'] = this.getLong()
                    info['status'] = this.getInt()

                }
                this.infos.push(info)
            }
        }
        myChair = 0;
        hasInfo = [];
        infos = [];
    }

    export class ReceiveSamConfig extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.listSize = this.getShort();
            this.list = [];
            for (var a = 0; a < this.listSize; a++) {
                var b = {
                    maxUserPerRoom: this.getByte(),
                    moneyType: this.getByte(),
                    moneyBet: this.getLong(),
                    moneyRequire: this.getLong(),
                    nPersion: this.getInt()
                };
                this.list.push(b)
            }
        }
        listSize = 0;
        list = [];
    }

    export class ReceiveNotifyRegOutRoom extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.outChair = this.getByte();
            this.isOutRoom = this.getBool()
        }
        outChair = 0;
        isOutRoom = false;
    }

    export class ReceivedKickOff extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.reason = this.getByte()
        }
        reason = 0;
    }


    export class ReceiveBaoSam extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.chair = this.getByte()
        }
        chair = 0;
    }

    export class ReceiveHuyBaoSam extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.chair = this.getByte()
        }
        chair = 0;
    }

    export class ReceivedQuyetDinhSam extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.chair = this.getByte();
            this.isSam = this.getBool();
        }
        chair = 0;
        isSam = false;
    };



    export class ResMoneyBetConfig extends BGUI.BaseInPacket {
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
        list = [];
        rules = [];

    }
    export class ReceivedMoiXepBai extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.time = this.getByte();
        }
        time = 0;

    }
    export class ReceivedMoiDatCuoc extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.timeDatCuoc = this.getByte();
        }
        timeDatCuoc = 0;

    }
    export class ReceivedDatCuoc extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.chair = this.getByte();
            this.rate = this.getByte();
        }
        chair;
        rate = 0;
    }
    export class ReceivedRutBai extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.chair = this.getByte();
            this.card = this.getByte();
            this.countDownTime = this.getByte();
        }
        chair;
        card = 0;
        countDownTime = 0;

    }
}
export default SHWESHANCmd;