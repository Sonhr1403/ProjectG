const { ccclass } = cc._decorator;

export namespace DragonTiger_CMD {
    export class Code {
        static DRAGON_TIGER_LOGIN = 1
        static DRAGON_TIGER_ID = 33
        static SUBCRIBE = 2000
        static BACK_GAME = 2001

        static DRAGON_TIGER_BET = 2110
        static DRAGON_TIGER_INFO = 2111
        static DRAGON_TIGER_DEAL_CARDS = 2113
        static DRAGON_TIGER_NEW_GAME = 2115
        static DRAGON_TIGER_LICH_SU_PHIEN = 2116
        static DRAGON_TIGER_TOP_PLAYER = 2118

        static DRAGON_TIGER_SEND_CHAT = 2119
        static DRAGON_TIGER_RECEIVE_CHAT = 2120
        static DRAGON_TIGER_SOI_CAU = 2121
        static DRAGON_TIGER_MORE_PLAYER = 2122
        static DRAGON_TIGER_UNBET = 2123
        static DRAGON_TIGER_HISTORY_BET = 2126

        static DRAGON_TIGER_END_GAME = 2204
        static DRAGON_TIGER_RATE_REWARD = 2205
        static DRAGON_TIGER_SOICAU = 2206
        static DRAGON_TIGER_USER_OUT_ROOM = 2207
        static DRAGON_TIGER_USER_JOIN_ROOM = 2208
        static DRAGON_TIGER_THONG_KE = 2209
        static DRAGON_TIGER_SOI_CAU_HISTORY = 2210
        static DRAGON_TIGER_STATE_GAME = 2211

    }


    export class ReceivedLogin extends BGUI.BaseInPacket {
        public userId: number = 0;
        public username: string = "";
        public displayName: string = "";
        public avatar: string = "";
        public currentMoney: number = 0;
        protected unpack(): void {
            if (this.getError() == BGUI.ErrorDefine.SUCCESS) {
                this.userId = this.getInt();
                this.username = this.getString();
                this.displayName = this.getString();
                this.avatar = this.getString();
                this.currentMoney = this.getLong();
            }
        }
    }

    //2001
    export class ReceivedBackGame extends BGUI.BaseInPacket {
        str: string

        protected unpack(): void {
            this.str = this.getString()
        }
    }

    //2110
    export class ReceivedResponseBet extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.currentMoney = this.getLong()
            this.betSide = this.getShort()
            this.betValue = this.getLong()
            this.nickName = this.getString();
        }

        nickName
        currentMoney
        betSide
        betValue
    }

    //2111
    export class ReceivedGameInfo extends BGUI.BaseInPacket {

        protected unpack(): void {
            this.gameId = this.getShort()
            this.moneyType = this.getShort()
            this.referenceId = this.getLong()
            this.remainTime = this.getShort()
            this.bettingState = this.getBool()
            this.currentMoney = this.getLong()

            this.result = this.getShort()

            let cardDragonSize = this.getShort();
            for (let j = 0; j < cardDragonSize; j++) {
                this.listCardDragon.push(this.getInt())
            }

            let cardTigerSize = this.getShort();
            for (let j = 0; j < cardTigerSize; j++) {
                this.listCardTiger.push(this.getInt())
            }

            for (let i = 0; i < 5; i++) {
                this.bets.push(this.getLong())
            }

            for (let i = 0; i < 5; i++) {
                this.myBets.push(this.getLong())
            }

            this.playerSize = this.getShort()
            this.listPlayers = []
            for (let g = 0; g < this.playerSize; g++) {
                let itemPlayer = {
                    uid: this.getInt(),
                    nickName: this.getString(),
                    currentMoney: this.getLong(),
                    isBot: this.getByte(),
                    avatar: this.getString(),
                    displayName: this.getString()
                };
                this.listPlayers.push(itemPlayer)
            }

            this.currentState = this.getString()
            this.userOutTable = this.getInt()
        }

        myBets: number[] = []
        bets: number[] = []
        gameId
        moneyType
        referenceId
        remainTime
        bettingState
        currentMoney
        result
        listCardDragon = []
        listCardTiger = []
        playerSize
        listPlayers
        currentState
        userOutTable
        displayName
    }

    //2113
    export class ReceivedDealCard extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.result = this.getShort()

            let cardDragonSize = this.getShort();
            this.listCardDragon = []
            for (let j = 0; j < cardDragonSize; j++) {
                this.listCardDragon.push(this.getInt())
            }

            let cardTigerSize = this.getShort();
            this.listCardTiger = []
            for (let j = 0; j < cardTigerSize; j++) {
                this.listCardTiger.push(this.getInt())
            }
        }

        result
        listCardDragon = []
        listCardTiger = []
    }

    //2115
    export class ReceivedStartNewGame extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.referenceId = this.getLong()
        }
        referenceId
    }

    //2116
    export class ReceivedChiTietPhienHienTai extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.results = this.getString()
        }
        results
    }

    //2118
    export class ReceivedTopPlayer extends BGUI.BaseInPacket {
        protected unpack(): void {
            let topSize = this.getShort()
            this.listTopPlayer = []
            for (let g = 0; g < topSize; g++) {
                let itemPlayer = {
                    nickName: this.getString(),
                    currentMoney: this.getLong(),
                    avatar: this.getString(),
                    interest: this.getLong(),
                };
                this.listTopPlayer.push(itemPlayer)
            }
        }

        listTopPlayer
    }

    //2120 Chat
    export class ReceivedChatRoom extends BGUI.BaseInPacket {
        isIcon: boolean;
        content: string;
        nickname: string;

        protected unpack(): void {
            this.isIcon = this.getBool();
            this.content = decodeURI(this.getString());
            this.nickname = this.getString()
        }
    }

    //2121 SoiCauThongKe
    export class ReceivedSoiCau extends BGUI.BaseInPacket {
        dishRoad: any = []
        bigRoad: string;

        protected unpack(): void {
            this.dishRoad = []
            let sz = this.getShort()
            for (let i = 0; i < sz; i++) {
                this.dishRoad.push(this.getByte())
            }
            this.bigRoad = this.getString()
        }
    }

    //2122 
    export class ReceivedUserOutTable extends BGUI.BaseInPacket {
        listMorePlayer

        protected unpack(): void {
            let sizeP = this.getShort()
            this.listMorePlayer = []

            for (let g = 0; g < sizeP; g++) {
                let itemPlayer = {
                    nickName: this.getString(),
                    avatar: this.getString(),
                    currentMoney: this.getLong(),
                    displayName: this.getString()
                };
                this.listMorePlayer.push(itemPlayer)
            }
        }
    }

    //2122 
    export class ReceivedUnBet extends BGUI.BaseInPacket {
        arrUnBet

        protected unpack(): void {
            let sizeP = this.getShort()
            this.arrUnBet = []

            for (let g = 0; g < sizeP; g++) {
                this.arrUnBet.push(this.getLong())
            }
        }
    }

    //2204
    export class ReceivedEndGame extends BGUI.BaseInPacket {

        listPlayers
        arrMoneyReturn
        winPot

        protected unpack(): void {
            let size = this.getShort()
            this.listPlayers = []
            for (let i = 0; i < size; i++) {
                let itemPlayer = {
                    nickName: this.getString(),
                    currentMoney: this.getLong(),
                    arrPrize: []
                };
                let arrW = this.getShort();
                for (let j = 0; j < arrW; j++) {
                    itemPlayer.arrPrize.push(this.getLong());
                }
                this.listPlayers.push(itemPlayer)
            }

            let arrM = this.getShort();
            this.arrMoneyReturn = []
            for (let j = 0; j < arrM; j++) {
                this.arrMoneyReturn.push(this.getLong());
            }

            let winSize = this.getShort();
            this.winPot = []
            for (let j = 0; j < winSize; j++) {
                this.winPot.push(this.getInt());
            }
        }
    }

    //2205
    export class ReceivedRateReward extends BGUI.BaseInPacket {
        protected unpack(): void {
            for (let i = 0; i < 5; i++) {
                this.rateReward.push(this.getString())
            }
        }

        rateReward = []
    }

    //2207
    export class ReceivedUserLeave extends BGUI.BaseInPacket {
        listPlayers
        userOutTable
        myData

        protected unpack(): void {
            let sizeP = this.getShort();
            this.listPlayers = []
            for (let i = 0; i < sizeP; i++) {
                let itemP = {
                    uid: this.getInt(),
                    nickName: this.getString(),
                    currentMoney: this.getLong(),
                    avatar: this.getString(),
                    displayName: this.getString()
                }
                this.listPlayers.push(itemP)
            }

            this.userOutTable = this.getInt()

            this.myData = {
                uid: this.getInt(),
                nickName: this.getString(),
                currentMoney: this.getLong(),
                avatar: this.getString()
            }
        }
    }

    //2208
    export class ReceivedUserJoin extends BGUI.BaseInPacket {
        listPlayers
        myData
        userOutTable

        protected unpack(): void {
            let sizeP = this.getShort();
            this.listPlayers = []
            for (let i = 0; i < sizeP; i++) {
                let itemP = {
                    uid: this.getInt(),
                    nickName: this.getString(),
                    currentMoney: this.getLong(),
                    avatar: this.getString(),
                    displayName: this.getString()
                }
                this.listPlayers.push(itemP)
            }

            this.userOutTable = this.getInt()

            this.myData = {
                uid: this.getInt(),
                nickName: this.getString(),
                currentMoney: this.getLong(),
                avatar: this.getString()
            }
        }
    }

    //2209
    export class ReceivedThongKe extends BGUI.BaseInPacket {

        perDragon: string
        perTiger: string
        numDragon: number
        numTiger: number
        numShan: number
        numStraight: number
        numStraightFlush: number
        total: number

        protected unpack(): void {
            this.perDragon = this.getString()
            this.perTiger = this.getString()
            this.numDragon = this.getInt()
            this.numTiger = this.getInt()
            this.numShan = this.getInt()
            this.numStraight = this.getInt()
            this.numStraightFlush = this.getInt()
            this.total = this.getInt()
        }
    }

    //2210
    export class ReceivedSoiCauHistory extends BGUI.BaseInPacket {
        protected unpack(): void {
            let size = this.getShort()
            this.data = []
            for (let i = 0; i < size; i++)
                this.data.push(this.getByte())
        }

        data = []
    }

    //2211
    export class ReceivedStateGame extends BGUI.BaseInPacket {
        protected unpack(): void {
            this.time = this.getInt()
            this.state = this.getString();
        }
        time
        state
    }

    export class ReceivedHistoryBet extends BGUI.BaseInPacket {
        // bf.putShort((short) this.userBetDetails.size());
        // userBetDetails.forEach(userBetDetail -> {
        //     this.putLong(bf, userBetDetail.sessionID);
        //     this.putStr(bf, userBetDetail.time);
        //     this.putLongArray(bf, userBetDetail.betValue);
        //     this.putIntArray(bf, userBetDetail.winPot);
        //     this.putLong(bf, userBetDetail.money);
        // });
        // bf.putInt(this.totalPage);
        protected unpack(): void {
            let sizeH = this.getShort();
            this.listHistory = []
            for (let i = 0; i < sizeH; i++) {
                let itemH = {
                    sessionID: this.getLong(),
                    time: this.getString(),
                    betValue: [],
                    winPot: [],
                    money: 0
                }

                let sizeB = this.getShort()
                for (let i = 0; i < sizeB; i++)
                    itemH.betValue.push(this.getLong())

                let sizeW = this.getShort()
                for (let i = 0; i < sizeW; i++)
                    itemH.winPot.push(this.getInt())

                itemH.money = this.getLong();

                this.listHistory.push(itemH)
            }
            this.totalPage = this.getInt();
        }
        listHistory
        totalPage
    }



    //->>>>>>>>>>>>> SEND <<<<<<<<<<<<<<
    export class SendSubcribe extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.SUBCRIBE;
        }
        putData(): void {
            this.putShort(Code.SUBCRIBE)
            this.putShort(1)
        }

    }

    export class SendBackGame extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.BACK_GAME;
        }
        putData(): void {
        }
    }

    export class SendLichSu extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.DRAGON_TIGER_LICH_SU_PHIEN;
        }
        putData(): void {
        }
    }

    export class SendBet extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.DRAGON_TIGER_BET;
        }
        putData(): void {
            this.putLong(this.betValue)
            this.putShort(1)
            this.putShort(this.betSide)
        }

        betValue
        betSide
    }

    export class SendUnBet extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.DRAGON_TIGER_UNBET;
        }
        putData(): void {
        }
    }

    export class SendSoiCau extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.DRAGON_TIGER_SOI_CAU;
        }
        putData(): void {
        }
    }

    export class SendThongKe extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.DRAGON_TIGER_THONG_KE;
        }
        putData(): void {
        }
    }

    export class SendTopPlayer extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.DRAGON_TIGER_TOP_PLAYER;
        }

        putData(): void {
        }
    }

    export class SendHistoryBet extends BGUI.BaseOutPacket {
        public page: number

        getCmdId(): number {
            return Code.DRAGON_TIGER_HISTORY_BET;
        }

        putData(): void {
            this.putShort(this.page)
        }
    }

    export class SendChatRoom extends BGUI.BaseOutPacket {
        public isIcon: number
        public content: string

        getCmdId(): number {
            return Code.DRAGON_TIGER_SEND_CHAT;
        }
        putData(): void {
            this.putByte(this.isIcon ? 1 : 0);
            this.putString(encodeURI(this.content));
        }
    }

    export class SendMorePlayer extends BGUI.BaseOutPacket {

        public offset: number

        getCmdId(): number {
            return Code.DRAGON_TIGER_MORE_PLAYER;
        }
        putData(): void {
            this.putShort(this.offset)
        }
    }

}
export default DragonTiger_CMD;