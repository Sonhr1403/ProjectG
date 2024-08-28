import { IDataPlayer } from "../Bacarrat.Const";

const { ccclass } = cc._decorator;

export namespace Bacarrat_CMD {
    export class Code {
        static INFO_PLAYER_BET = 3000;
        static DEAL_CARD = 3001;
        static USER_EXIT = 3002;
        static NOTIFY_QUIT_ROOM = 3003;
        static KICK_ROOM = 3004;
        static GET_GAME_INFO = 3005;
        static NEW_USER_JOIN_ROOM = 3006;
        static CHAT_ROOM = 3008;
        static START_GAME = 3009;
        static END_GAME = 3010;
        static CONTINUE_DEALCARD = 3011;
        static STATITICS = 3019;
        static HISTORY_PLAYER = 3020;
        static JOIN_ROOM = 3021;
        static SEND_STATITICS = 3080;
        static PLAYER_BET = 3081;
        static LEAVE_ROOM = 3082;
        static SEND_HISTORY_PLAYER = 3083;
        static BACARRAT_LOGIN = 1;
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

    // ReceivedEndGame 3010
    export class ReceivedEndGame extends BGUI.BaseInPacket {
        currentTime: number = 0;
        winTypes: any[]
        listPlayers: any[]
        history = {}

        protected unpack(): void {
            this.currentTime = this.getShort();
            this.winTypes = [];
            let wS = this.getShort();
            for (let k = 0; k < wS; k++) {
                this.winTypes.push(this.getByte())
            }

            let pS = this.getShort()
            this.listPlayers = []
            for (let g = 0; g < pS; g++) {
                var itemPlayer = {
                    nickName: this.getString(),
                    displayName: this.getString(),
                    moneyExchange: this.getLong(),
                    moneyPotWin: this.getString(),
                    currentMoney: this.getLong(),
                };
                this.listPlayers.push(itemPlayer)
            }
            let itemHistory = {
                currrentTime: this.getString(),
                roomId: this.getLong(),
                playerResult: this.getString(),
                bankerResult: this.getString(),
                betValue: this.getString(),
                prize: this.getString(),
                listWinType: [],
                listPlayer: [],
                listBanker: [],
                bankerPoint: 0,
                playerPoint: 0
            };
            let winTypeSize = this.getShort();
            for (let q = 0; q < winTypeSize; q++) {
                itemHistory.listWinType.push(this.getInt());
            }

            let playerSize = this.getShort();
            for (let w = 0; w < playerSize; w++) {
                itemHistory.listPlayer.push(this.getInt());
            }

            let bankerSize = this.getShort();
            for (let e = 0; e < bankerSize; e++) {
                itemHistory.listBanker.push(this.getInt());
            }
            itemHistory.bankerPoint = this.getInt();
            itemHistory.playerPoint = this.getInt();
            this.history = itemHistory;
        }
    }

    // CONTINUE_DEAL_CARD 3011
    export class ReceivedContinueDealCard extends BGUI.BaseInPacket {
        currentTime: number = 0;
        cardId: number;
        state: number;

        protected unpack(): void {
            this.currentTime = this.getShort();
            this.state = this.getByte();
            this.cardId = this.getByte();
        }
    }

    //3009
    export class ReceivedStartGame extends BGUI.BaseInPacket {
        currentTime: number = 0;
        seasionId: number = 0;

        protected unpack(): void {
            this.currentTime = this.getShort();
            this.seasionId = this.getLong()
        }
    }


    //3000
    export class ReceivedInfoPlayerBet extends BGUI.BaseInPacket {
        nickName: string
        betChip: number
        typePot: number
        currentMoney: number


        protected unpack(): void {
            this.typePot = this.getInt()
            this.betChip = this.getLong()
            this.nickName = this.getString()
            this.currentMoney = this.getLong()
        }
    }
    //3001
    export class ReceivedDealCard extends BGUI.BaseInPacket {
        currentTime: number;
        cardPlayers: any[]
        cardBankers: any[]

        protected unpack(): void {
            this.currentTime = this.getShort()


            this.cardBankers = []
            let bS = this.getShort();
            for (let j = 0; j < bS; j++) {
                this.cardBankers.push(this.getByte())
            }


            this.cardPlayers = [];
            let cS = this.getShort();
            for (let i = 0; i < cS; i++) {
                this.cardPlayers.push(this.getByte())
            }

        }
    }

    //3002
    export class ReceivedLeaveRoom extends BGUI.BaseInPacket {
        nickName: string

        protected unpack(): void {
            this.nickName = this.getString()
        }
    }

    //3003
    export class ReceivedNotifyQuitRoom extends BGUI.BaseInPacket {
        nickName: string
        reqQuitRoom: boolean

        protected unpack(): void {
            this.nickName = this.getString()
            this.reqQuitRoom = this.getBool()
        }
    }

    //3004
    export class ReceivedKickRoom extends BGUI.BaseInPacket {
        reason: number

        protected unpack(): void {
            this.reason = this.getByte()
        }
    }

    //3005
    export class ReceivedGetInfoGame extends BGUI.BaseInPacket {
        currentTime: number
        stateGame: number
        seasionId: number
        cardPlayerSize: number
        cardBankerSize: number
        chipPotSize: number

        listChipPot: any[]
        cardPlayers: any[]
        cardBankers: any[]

        winPotSize: number
        listWinPot: any[]

        listHistory: any[]

        playerSize: number;
        listPlayers: Array<IDataPlayer>;

        protected unpack(): void {
            this.currentTime = this.getShort()
            this.stateGame = this.getByte()


            this.cardPlayers = [];
            this.cardPlayerSize = this.getShort();
            for (let i = 0; i < this.cardPlayerSize; i++) {
                // BGUI.ZLog.log(this.getByte());
                this.cardPlayers.push(this.getByte())
            }

            this.cardBankers = []
            this.cardBankerSize = this.getShort();
            for (let j = 0; j < this.cardBankerSize; j++) {
                // BGUI.ZLog.log(this.getByte());
                this.cardBankers.push(this.getByte())
            }

            this.listWinPot = [];
            this.winPotSize = this.getShort();
            // BGUI.ZLog.log("wSz ---------> ", this.winPotSize);
            for (let k = 0; k < this.winPotSize; k++) {
                // BGUI.ZLog.log(this.getByte());
                this.listWinPot.push(this.getByte())
            }

            this.playerSize = this.getShort()
            this.listPlayers = []
            for (let g = 0; g < this.playerSize; g++) {
                let itemPlayer = {
                    nickName: this.getString(),
                    displayName: this.getString(),
                    avatar: this.getString(),
                    currentMoney: this.getLong(),
                    stringChip: this.getString(),
                    listChipPot: []
                };
                const chipPerPotArr = itemPlayer.stringChip.split("/");
                const listPot = [];
                chipPerPotArr.forEach(item => {
                    const chipInPot: number[] = [];
                    if (item) {
                        const chipInPotArr = item.split(";");
                        chipInPotArr.forEach(item2 => {
                            if (item2) {
                                const chip = item2.split(":");
                                for (let i = 0; i < Number(chip[1]); i++) {
                                    chipInPot.push(Number(chip[0]))
                                }
                            }
                        })
                    }
                    listPot.push(chipInPot)
                })
                itemPlayer.listChipPot.push(listPot);
                this.listPlayers.push(itemPlayer)
            }

            this.seasionId = this.getLong()
            // get history
            let historySize = this.getShort()
            this.listHistory = []
            for (var i = 0; i < historySize; i++) {
                let itemHistory = {
                    currrentTime: this.getString(),
                    roomId: this.getLong(),
                    playerResult: this.getString(),
                    bankerResult: this.getString(),
                    betValue: this.getString(),
                    prize: this.getString(),
                    listWinType: [],
                    listPlayer: [],
                    listBanker: [],
                    bankerPoint: 0,
                    playerPoint: 0
                };
                let winTypeSize = this.getShort();
                for (let q = 0; q < winTypeSize; q++) {
                    itemHistory.listWinType.push(this.getInt());
                }

                let playerSize = this.getShort();
                for (let w = 0; w < playerSize; w++) {
                    itemHistory.listPlayer.push(this.getInt());
                }

                let bankerSize = this.getShort();
                for (let e = 0; e < bankerSize; e++) {
                    itemHistory.listBanker.push(this.getInt());
                }
                itemHistory.bankerPoint = this.getInt();
                itemHistory.playerPoint = this.getInt();
                this.listHistory.push(itemHistory);
            }

        }
    }

    //3006
    export class ReceivedNewUserJoin extends BGUI.BaseInPacket {

        nickName: string
        displayName: string
        avatar: string
        currentMoney: number
        playerStatus: number

        protected unpack(): void {
            this.nickName = this.getString()
            this.displayName = this.getString()
            this.avatar = this.getString()
            this.currentMoney = this.getLong()
            this.playerStatus = this.getByte()
        }
    }

    //3019
    export class ReceivedStatiticsHistory extends BGUI.BaseInPacket {

        listHistory = []

        protected unpack(): void {
            let historySize = this.getShort()
            for (var i = 0; i < historySize; i++) {
                let itemHistory = {
                    // currrentTime: this.getString(),
                    // roomId: this.getLong(),
                    // playerResult: this.getString(),
                    // bankerResult: this.getString(),
                    // betValue: this.getString(),
                    // prize: this.getString(),
                    listWinType: [],
                    // listPlayer: [],
                    // listBanker: [],
                    bankerPoint: 0,
                    playerPoint: 0
                };
                let winTypeSize = this.getShort();
                for (let q = 0; q < winTypeSize; q++) {
                    itemHistory.listWinType.push(this.getInt());
                }

                // let playerSize = this.getShort();
                // for (let w = 0; w < playerSize; w++) {
                //     itemHistory.listPlayer.push(this.getInt());
                // }

                // let bankerSize = this.getShort();
                // for (let e = 0; e < bankerSize; e++) {
                //     itemHistory.listBanker.push(this.getInt());
                // }
                
                itemHistory.bankerPoint = this.getInt();
                itemHistory.playerPoint = this.getInt();

                this.listHistory.push(itemHistory)
            }
        }
    }

    //3020 History player bet
    export class ReceivedHistoryPlayer extends BGUI.BaseInPacket {
        listHistory = []

        protected unpack(): void {
            let historySize = this.getShort()
            for (var i = 0; i < historySize; i++) {
                let itemHistory = {
                    sessionId: this.getLong(),
                    currrentTime: this.getString(),

                    betValue: [],
                    winPot: [],
                    cardsPlayer: [],
                    cardsBanker: [],
                    bankerPoint: 0,
                    playerPoint: 0
                };

                let bankerSize = this.getShort();
                for (let e = 0; e < bankerSize; e++) {
                    itemHistory.cardsBanker.push(this.getByte());
                }

                let playerSize = this.getShort();
                for (let w = 0; w < playerSize; w++) {
                    itemHistory.cardsPlayer.push(this.getByte());
                }

                for (let p = 0; p < 6; p++) {
                    itemHistory.betValue.push(this.getLong());
                    itemHistory.winPot.push(this.getLong())
                }
                // itemHistory.bankerPoint = this.getInt();
                // itemHistory.playerPoint = this.getInt();

                this.listHistory.push(itemHistory)
            }
        }
    }

    //3008 Chat
    export class ReceivedChatRoom extends BGUI.BaseInPacket {
        chair: number;
        isIcon: boolean;
        content: string;
        nickname: string;

        protected unpack(): void {
            this.chair = this.getByte();
            this.isIcon = this.getBool();
            this.content = decodeURI(this.getString());
            this.nickname = this.getString()
        }
    }

    // export class ReceivedGetListRoomType extends BGUI.BaseInPacket {
    //     public list = [];
    //     protected unpack(): void {
    //         let listSize = this.getShort();
    //         this.list = [];
    //         for (var i = 0; i < listSize; i++) {
    //             let item = {
    //                 id: this.getInt(),
    //                 totalUser: this.getInt(),
    //                 moneyBet: this.getInt(),
    //                 minMoney: this.getInt(),
    //                 maxMoney: this.getInt(),
    //                 maxUserPerRoom: this.getInt()
    //             };
    //             this.list.push(item)
    //         }
    //     }
    // }

    // export class ReceivedGetListRoom extends BGUI.BaseInPacket {
    //     public list = [];
    //     protected unpack(): void {
    //         let listSize = this.getShort();
    //         this.list = [];
    //         for (var i = 0; i < listSize; i++) {
    //             let item = {
    //                 id: this.getInt(),
    //                 userCount: this.getByte(),
    //                 limitPlayer: this.getByte(),
    //                 maxUserPerRoom: this.getInt(),
    //                 moneyType: this.getByte(),
    //                 moneyBet: this.getInt(),
    //                 requiredMoney: this.getInt(),
    //                 rule: this.getByte(),
    //                 nameRoom: this.getString(),
    //                 key: this.getBool(),
    //                 quyban: this.getLong(),
    //                 maxJoin: []
    //             };
    //             this.list.push(item)
    //         }
    //     }
    // }



    /*
     * SEND--------->
     */


    export class SendJoinRoomType extends BGUI.BaseOutPacket {
        public id: number
        public moneyBet: number
        public minMoney: number
        public maxMoney: number
        public maxUserPerRoom: number

        getCmdId(): number {
            return 3021;
        }

        putData(): void {
            this.putInt(this.id);
            this.putInt(this.moneyBet);
            this.putLong(this.minMoney);
            this.putInt(this.maxMoney);
            this.putInt(this.maxUserPerRoom);
        }
    }

    export class SendChatRoom extends BGUI.BaseOutPacket {
        public isIcon: number
        public content: string

        getCmdId(): number {
            return 3008;
        }
        putData(): void {
            this.putByte(this.isIcon ? 1 : 0);
            this.putString(encodeURI(this.content));
        }
    }

    // BET 3081
    export class SendRequestPlayerBet extends BGUI.BaseOutPacket {
        public typePot: number
        public betChip: number


        getCmdId(): number {
            return Code.PLAYER_BET;
        }

        putData(): void {
            this.putInt(this.typePot)
            this.putLong(this.betChip)

        }
    }

    // STATITICS_HISTORY 3080
    export class SendRequestHistoryStatitics extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.SEND_STATITICS;
        }

        putData(): void {
        }
    }

    // LEAVE_ROOM 3082
    export class SendRequestLeaveRoom extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.LEAVE_ROOM;
        }

        putData(): void {
        }
    }


    // SEND_HISTORY_PLAYER 3083
    export class SendRequestHistoryPlayer extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.SEND_HISTORY_PLAYER;
        }

        putData(): void {
        }
    }



}
export default Bacarrat_CMD;