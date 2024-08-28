<<<<<<< HEAD
import BCConnector from "./BC.Connector"
=======
import BCConnector from "./BC.Connector";
>>>>>>> SLOT_50

export namespace cmd {
    export interface User { isMe: boolean, userName: string, displayName: string, avatar: string, balance: number, moneyWin: number, listBet: string, listWin: string }

    export class Code { static CMD_BC_LOGIN = 1; static CMD_BC_LOGOUT = 2; static CMD_BC_DISCONNECTED = 37; static CMD_BC_SCRIBE = 5001; static CMD_BC_UNSCRIBE = 5002; static CMD_BC_RQ_USER_EXIT_GAME = 5002; static CMD_BC_CHANGE_ROOM = 5003; static CMD_BC_BET = 5004; static CMD_BC_SUBSCRIBE = 5005; static CMD_BC_UPDATE_PER_SECOND = 5006; static CMD_BC_START_NEW_GAME = 5007; static CMD_BC_RESULT = 5008; static CMD_BC_PRIZE = 5009; static CMD_BC_HISTORY = 5010; static CMD_BC_USER_JOIN_ROOM = 5011; static CMD_BC_USER_EXIT_ROOM = 5012; static CMD_BC_USER_OUT_ROOM = 5013; static CMD_BC_USER_KICK_OUT = 5014; static CMD_BC_BET_SUCCESS = 5015; static CMD_BC_CHAT = 5021; static CMD_BC_SHAKE_BOWL = 5022; static CMD_BC_LIST_EXTERNAL_USERS = 5023; static CMD_BC_PING_PONG = 5026; static CMD_BC_TIP_5027 = 5027; static CMD_BC_TRANSACTION_5028 = 5028; }

    export class Config {
        static TOM = 0;
        static CA = 1;
        static GA = 2;
        static HO = 3;
        static VOI = 4;
        static RUA = 5;
        static TOM_GA = 6;
        static TOM_VOI = 7;
        static TOM_CA = 8;
        static HO_RUA = 9;
        static HO_CA = 10;
        static GA_HO = 11;
        static GA_RUA = 12;
        static CA_VOI = 13;
        static HO_TOM = 14;
        static TOM_RUA = 15;
        static RUA_CA = 16;
        static CA_GA = 17;
        static GA_VOI = 18;
        static VOI_HO = 19;
        static VOI_RUA = 20;
        static FACE_TOM = 0;
        static FACE_CA = 1;
        static FACE_GA = 2;
        static FACE_HO = 3;
        static FACE_VOI = 4;
        static FACE_RUA = 5;
        static faceName = { 0: "minibaucua.bc_shirmp", 1: "minibaucua.bc_fish", 2: "minibaucua.bc_chicken", 3: "minibaucua.bc_tiger", 4: "minibaucua.bc_elephent", 5: "minibaucua.bc_turtle" };
        static doorName = { 0: "minibaucua.bc_shirmp", 1: "minibaucua.bc_fish", 2: "minibaucua.bc_chicken", 3: "minibaucua.bc_tiger", 4: "minibaucua.bc_elephent", 5: "minibaucua.bc_turtle", 6: "minibaucua.bc_door_6", 7: "minibaucua.bc_door_7", 8: "minibaucua.bc_door_8", 9: "minibaucua.bc_door_9", 10: "minibaucua.bc_door_10", 11: "minibaucua.bc_door_11", 12: "minibaucua.bc_door_12", 13: "minibaucua.bc_door_13", 14: "minibaucua.bc_door_14", 15: "minibaucua.bc_door_15", 16: "minibaucua.bc_door_16", 17: "minibaucua.bc_door_17", 18: "minibaucua.bc_door_18", 19: "minibaucua.bc_door_19", 20: "minibaucua.bc_door_20", };
        static listFace: Array<number> = [Config.FACE_TOM, Config.FACE_CA, Config.FACE_GA, Config.FACE_HO, Config.FACE_VOI, Config.FACE_RUA,];
        static listDoor: Array<number> = [Config.TOM, Config.CA, Config.GA, Config.HO, Config.VOI, Config.RUA, Config.TOM_GA, Config.TOM_VOI, Config.TOM_CA, Config.HO_RUA, Config.HO_CA, Config.GA_HO, Config.GA_RUA, Config.CA_VOI, Config.HO_TOM, Config.TOM_RUA, Config.RUA_CA, Config.CA_GA, Config.GA_VOI, Config.VOI_HO, Config.VOI_RUA,];
    }

    export class BauCuaLogin extends BGUI.BaseOutPacket {
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

    export class BauCuaSendTip extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.CMD_BC_TIP_5027;
        }
        putData(): void {
            // TODO
        }
    }

    export class BauCuaSendTransaction extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.CMD_BC_TRANSACTION_5028
        }
        putData(): void {
            // TODO
        }
    }

    export class BauCuaSendSubscribe extends BGUI.BaseOutPacket {
        public betIdx: number;

        getCmdId(): number {
            return Code.CMD_BC_SCRIBE;
        }
        putData(): void {
            this.putByte(this.betIdx);
        }
    }

    export class BauCuaSendUnScribe extends BGUI.BaseOutPacket {
        public betIdx: number

        getCmdId(): number {
            return Code.CMD_BC_UNSCRIBE;
        }
        putData(): void {
            this.putByte(this.betIdx);
        }
    }

    export class BauCuaSendChangeRoom extends BGUI.BaseOutPacket {
        public oldBetIdx: number
        public newBetIdx: number

        getCmdId(): number {
            return Code.CMD_BC_CHANGE_ROOM;
        }
        putData(): void {
            this.putByte(this.oldBetIdx);
            this.putByte(this.newBetIdx);
        }
    }

    export class BauCuaSendUserExitRoom extends BGUI.BaseOutPacket {
        public roomId: number
        getCmdId(): number {
            return Code.CMD_BC_RQ_USER_EXIT_GAME;
        }
        putData(): void {
            this.putByte(this.roomId);
        }
    }

    export class BauCuaSendBet extends BGUI.BaseOutPacket {
        public typePot: number;
        public money: number;
        getCmdId(): number {
            return Code.CMD_BC_BET;
        }
        putData(): void {
            this.putInt(this.typePot);
            this.putLong(this.money);
        }
    }

    export class BauCuaSendChat extends BGUI.BaseOutPacket {
        public message: string;
        public isIcon: boolean = false;
        getCmdId(): number {
            return Code.CMD_BC_CHAT;
        }
        putData(): void {
            this.putByte(this.isIcon ? 1 : 0);
            this.putString(this.message);
        }
    }

    export class BauCuaSendListExternalUsers extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.CMD_BC_LIST_EXTERNAL_USERS;
        }
        putData(): void {
            // TODO
        }
    }

    export class BauCuaSendPingPong extends BGUI.BaseOutPacket {
        getCmdId(): number {
            return Code.CMD_BC_PING_PONG;
        }
        putData(): void {
            // TODO
        }
    }

    
    export class BauCuaLogin extends BGUI.BaseOutPacket {
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

    class BauCuaSendLoginByUrl extends BGUI.BaseOutPacket {
        public partner: string;
        public accessToken: string;
        public appId: number;
        public lang: string;

        public getCmdId(): number {
            return 1;
        }

        public putData(): void {
            this.putString(this.partner);
            this.putString(this.accessToken);
            this.putInt(this.appId);
            this.putString(this.lang);
        }
    }

    export class Send {
<<<<<<< HEAD
        public static sendBauCuaLoginByUrl(partner, accessToken, lang) {
            let pk = new BauCuaSendLoginByUrl();
            pk.partner = partner;
            pk.accessToken = accessToken;
            pk.appId = 11;
            pk.lang = lang;
            BCConnector.instance.sendPacket(pk);
        }
        public static sendBauCuaLogin(nickName, accessToken) {
            let pk = new BauCuaLogin();
            pk.nickName = nickName;
            pk.accessToken = accessToken;
=======
        public static  sendBauCuaLogin(nickname, accessToken) {
            let pk = new BauCuaLogin();
            pk.nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
            pk.accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
>>>>>>> SLOT_50
            BCConnector.instance.sendPacket(pk);
        }

        public static sendTransaction() {
            let pkg = new cmd.BauCuaSendTransaction();
            BCConnector.instance.sendPacket(pkg);
        }

        public static sendTipToBanker() {
            let pkg = new cmd.BauCuaSendTip();
            BCConnector.instance.sendPacket(pkg);
        }

        public static sendListExternalUser() {
            let pkg = new cmd.BauCuaSendListExternalUsers();
            BCConnector.instance.sendPacket(pkg);
        }

        public static sendBauCuaSubscribe(roomId) {
            let pkg = new cmd.BauCuaSendSubscribe();
            pkg.betIdx = roomId;
            BCConnector.instance.sendPacket(pkg);
        }

        public static sendBauCuaUnSubcribe(roomId) {
            let pkg = new cmd.BauCuaSendUnScribe();
            pkg.betIdx = roomId;
            BCConnector.instance.sendPacket(pkg);
        }

        public static sendBauCuaBet(typePot: number, money: number) {
            let pkg = new cmd.BauCuaSendBet();
            pkg.typePot = typePot;
            pkg.money = money;
            BCConnector.instance.sendPacket(pkg);
        }

        public static sendBauCuaChangeRoom(oldRoomId, newRoomId) {
            let pkg = new cmd.BauCuaSendChangeRoom();
            pkg.oldBetIdx = oldRoomId;
            pkg.newBetIdx = newRoomId;
            BCConnector.instance.sendPacket(pkg);
        }

        public static sendBauCuaUserExitRoom(roomId: number) {
            let pkg = new cmd.BauCuaSendUserExitRoom();
            pkg.roomId = roomId;
            BCConnector.instance.sendPacket(pkg);
        }

        public static sendBauCuaChat(isIcon: boolean, message: string) {
            let pkg = new cmd.BauCuaSendChat();
            pkg.isIcon = isIcon;
            pkg.message = message;
            BCConnector.instance.sendPacket(pkg);
        }

        public static sendBauCuaPingPong(){
            let pkg = new cmd.BauCuaSendPingPong();
            BCConnector.instance.sendPacket(pkg);
        }
    }

    // 5027
    export class BauCuaRecevieTipToBanker extends BGUI.BaseInPacket {
        public money: number = 0;
        public nickName: string = null;
        public displayName: string = null;
        protected unpack(): void {
            this.money = this.getInt();
            this.nickName = this.getString();
            this.displayName = this.getString();
        }
    }

    export class BauCuaRecevieTransaction extends BGUI.BaseInPacket {
        public size: number = 0;
        public histories: Array<any> = [];

        protected unpack(): void {
            this.size = this.getShort();
            for (let i = 0; i < this.size; i++) {
                let item = {
                    sessionId: this.getLong(),
                    time: this.getString(),
                    totalBet: this.getLong(),
                    totalWin: this.getLong(),
                    dices:   this.getString(),
                    details: []
                }
                let size = this.getShort();
                for (let k = 0; k < size; k++) {
                    let temp = {
                        door: this.getByte(),
                        doorBet: this.getLong(),
                        doorWin: this.getLong(),
                    }
                    item.details.push(temp);
                }
                this.histories.push(item);
            }
        }
    }
    // 5015
    export class BauCuaRecevieBetSuccess extends BGUI.BaseInPacket {
        public userBet: any = null;
        public money: number = 0;
        public typePot: number = null;
        public currentMoney: number = 0;

        protected unpack(): void {
            this.userBet = this.getString();
            this.money = this.getLong();
            this.typePot = this.getByte();
            this.currentMoney = this.getLong();
        }
    }

    // 5005
    export class BauCuaReceiveSubScribe extends BGUI.BaseInPacket {
        public referenceId: number = 0;
        public remainTime: number = 0;
        public bettingState: boolean = false;
        public sessionHistory: string = null;
        public roomId: number = 0;
        public dices: Array<number> = [];
        public winTypes: Array<number> = [];
        public diceSize: number = 0;
        public winTypeSize: number = 0;
        public playerSize: number = 0;
        public infoMe: User = null;
        public listUserInTable: Array<User> = [];
        public numberUserOutTable: number = 0;
        public listBetOfUserOutTable: string = "";

        protected unpack(): void {
            this.referenceId = this.getLong();
            this.remainTime = this.getByte();
            this.bettingState = this.getBool();
            this.roomId = this.getByte();
            this.diceSize = this.getShort();
            for (let i = 0; i < this.diceSize; i++) {
                this.dices.push(this.getByte());
            }

            this.winTypeSize = this.getShort();
            for (let i = 0; i < this.winTypeSize; i++) {
                this.winTypes.push(this.getByte());
            }

            this.sessionHistory = this.getString();

            this.infoMe = {
                userName: this.getString(),
                displayName: this.getString(),
                avatar: this.getString(),
                balance: this.getLong(),
                listBet: this.getString(),
                listWin: "",
                moneyWin: 0,
                isMe: true,
            }

            this.playerSize = this.getShort();
            for (let i = 0; i < this.playerSize; i++) {
                let itemUser: User = {
                    userName: this.getString(),
                    displayName: this.getString(),
                    avatar: this.getString(),
                    moneyWin: 0,
                    balance: this.getLong(),
                    listBet: this.getString(),
                    listWin: "",
                    isMe: false,
                }
                this.listUserInTable.push(itemUser);
            }
            this.numberUserOutTable = this.getShort();
            this.listBetOfUserOutTable = this.getString();

        }
    }

    // 5007
    export class BauCuaReceiveNewGame extends BGUI.BaseInPacket {
        public referenceId = 0;
        public time = 0
        protected unpack(): void {
            this.referenceId = this.getLong();
            this.time = this.getShort();
        }
    }

    // 5022
    export class BauCuaReceiveShakeBowl extends BGUI.BaseInPacket {
        public referenceId = 0;
        public time: number = 0
        public userName: string = "";
        public currentMoney: number = 0;
        public playerSize: number;
        public infoMe: User = null;
        public listUserInTable: Array<User> = [];
        public numberUserOutTable: number = 0;

        protected unpack(): void {
            this.referenceId = this.getLong();
            this.time = this.getShort();
            this.infoMe = {
                userName: this.getString(),
                displayName:this.getString(),
                avatar: this.getString(),
                balance: this.getLong(),
                moneyWin: 0,
                isMe: true,
                listBet: "",
                listWin: "",
            }
            this.playerSize = this.getShort();

            for (let i = 0; i < this.playerSize; i++) {
                let itemUser: User = {
                    userName: this.getString(),
                    displayName:this.getString(),
                    avatar: this.getString(),
                    balance: this.getLong(),
                    isMe: false,
                    moneyWin: 0,
                    listBet: "",
                    listWin: "",
                }
                this.listUserInTable.push(itemUser);
            }
            this.numberUserOutTable = this.getShort();
        }
    }

    // 5008
    export class BauCuaReceiveResult extends BGUI.BaseInPacket {
        public diceSize: number = 0;
        public winTypeSize: number = 0;
        public playerSize: number = 0;
        public infoMe: User = null;
        public listUserInTable: Array<User> = [];
        public dices: Array<number> = [];
        public winTypes: Array<number> = [];
        public numberUserOutTable: number = 0;
        public listWinUserOutTable: string = "";

        protected unpack(): void {
            this.dices = [];
            this.winTypes = [];
            this.listUserInTable = [];

            this.diceSize = this.getShort();
            for (let i = 0; i < this.diceSize; i++) {
                this.dices.push(this.getByte());
            }

            this.winTypeSize = this.getShort();
            for (let i = 0; i < this.winTypeSize; i++) {
                this.winTypes.push(this.getByte());
            }

            this.infoMe = {
                userName: this.getString(),
                displayName: this.getString(),
                avatar: this.getString(),
                moneyWin: this.getLong(),
                balance: this.getLong(),
                listBet: "",
                listWin: this.getString(),
                isMe: true,
            }

            this.playerSize = this.getShort();
            for (let i = 0; i < this.playerSize; i++) {
                let itemUser: User = {
                    userName: this.getString(),
                    displayName: this.getString(),
                    avatar: this.getString(),
                    moneyWin: this.getLong(),
                    balance: this.getLong(),
                    listBet: "",
                    listWin: this.getString(),
                    isMe: false,
                }
                this.listUserInTable.push(itemUser);
            }
            this.numberUserOutTable = this.getShort();
            this.listWinUserOutTable = this.getString();
        }
    }

    export class BauCuaReceivePrize extends BGUI.BaseInPacket {
        public prize = 0;
        public currentMoney = 0;
        public room = 0;
        protected unpack(): void {
            this.prize = this.getLong();
            this.currentMoney = this.getLong();
            this.room = this.getByte();
        }
    }

    export class BauCuaReceiveUserJoinRoom extends BGUI.BaseInPacket {
        public infoMe: User = null;
        public listUserInTable: Array<User> = [];
        public playerInTableSize: number = 0;
        public numberUserOutTable: number = 0;
        protected unpack(): void {
            this.infoMe = {
                userName: this.getString(),
                displayName:this.getString(),
                avatar: this.getString(),
                balance: this.getLong(),
                moneyWin: 0,
                listBet: "",
                listWin: "",
                isMe: true,
            }
            this.playerInTableSize = this.getShort();
            for (let i = 0; i < this.playerInTableSize; i++) {
                this.listUserInTable.push({
                    userName: this.getString(),
                    displayName:this.getString(),
                    avatar: this.getString(),
                    balance: this.getLong(),
                    moneyWin: 0,
                    listBet: "",
                    listWin: "",
                    isMe: false,
                });
            }
            this.numberUserOutTable = this.getShort();
        }
    }

    /// 5012
    export class BauCuaReceiveUserExitRoom extends BGUI.BaseInPacket {
        public infoMe: User = null;
        public listUserInTable: Array<User> = [];
        public playerInTableSize: number = 0;
        public numberUserOutTable: number = 0;
        protected unpack(): void {
            this.infoMe = {
                userName: this.getString(),
                displayName: this.getString(),
                avatar: this.getString(),
                balance: this.getLong(),
                moneyWin: 0,
                listBet: "",
                listWin: "",
                isMe: true,
            }
            this.playerInTableSize = this.getShort();
            for (let i = 0; i < this.playerInTableSize; i++) {
                this.listUserInTable.push({
                    userName: this.getString(),
                    displayName: this.getString(),
                    avatar: this.getString(),
                    balance: this.getLong(),
                    moneyWin: 0,
                    listBet: "",
                    listWin: "",
                    isMe: false,
                });
            }
            this.numberUserOutTable = this.getShort();
        }
    }

    export class BauCuaReceiveUserOutRoom extends BGUI.BaseInPacket {
        public userName: string = null;
        public isOut: boolean = null;
        protected unpack(): void {
            this.userName = this.getString();
            this.isOut = this.getBool();
        }
    }

    export class BauCuaReceiveMeKichOutRoom extends BGUI.BaseInPacket {
        public reason: number = null;
        public isOut: boolean = null;
        protected unpack(): void {
            this.reason = this.getByte();
        }
    }

    export class BauCuaReceiveUserKickOut extends BGUI.BaseInPacket {
        public userName: string = null;
        public isOut: boolean = null;
        protected unpack(): void {
            this.userName = this.getString();
            this.isOut = this.getBool();
        }
    }

    export class BauCuaReceiveHistory extends BGUI.BaseInPacket {
        public sessionHistory: string = null;
        protected unpack(): void {
            this.sessionHistory = this.getString();
        }
    }

    // 5021
    export class BauCuaReceiveChat extends BGUI.BaseInPacket {
        public isIcon: boolean = false;
        public strData: string = null;
        public userName: string = null;
        public displayName: string = null;
        protected unpack(): void {
            this.isIcon = this.getBool();
            this.strData = this.getString();
            this.userName = this.getString();
            this.displayName = this.getString();
        }
    }

    // 5023
    export class BauCuaReceiveListExternalUsers extends BGUI.BaseInPacket {
        public playerSize: number = 0;
        public listExternalUsers: Array<User> = [];
        protected unpack(): void {
            this.playerSize = this.getShort();
            for (let i = 0; i < this.playerSize; i++) {
                this.listExternalUsers.push({
                    userName: this.getString(),
                    displayName: this.getString(),
                    avatar: this.getString(),
                    balance: this.getLong(),
                    moneyWin: 0,
                    listBet: "",
                    listWin: "",
                    isMe: false,
                })
            }
        }
    }
}

export default cmd;
