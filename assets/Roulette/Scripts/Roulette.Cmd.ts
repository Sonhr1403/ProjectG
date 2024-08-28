
import { RouletteConnector } from "./Network/RouletteConnector";

export namespace RouletteNetwork {
  export class Cmd {
    static CMD_ROULETTE_LOGIN = 1;
    static CMD_ROULETTE_LOGOUT = 2;
    static CMD_ROULETTE_DISCONNECTED = 37;
    static CMD_ROULETTE_JOINGAME = 5001;
    static CMD_ROULETTE_EXITGAME = 5002;
    static CMD_ROULETTE_BET = 5004;
    static CMD_ROULETTE_RECEIVEINFO = 5005;
    static CMD_ROULETTE_ENDGAME = 5008;
    static CMD_ROULETTE_MATCH_HISTORY = 5031;
    static CMD_ROULETTE_USER_JOIN_ROOM = 5011;
    static CMD_ROULETTE_USER_EXIT_ROOM = 5012;
    static CMD_ROULETTE_USER_OUT_ROOM = 5013;
    static CMD_ROULETTE_KICK_OUT = 5014;
    static CMD_ROULETTE_BET_SUCCESS = 5015;
    static CMD_ROULETTE_CHAT = 5021;
    static CMD_ROULETTE_START_NEW_GAME = 5022;
    static CMD_ROULETTE_LIST_OTHER_USERS = 5023;
    static CMD_ROULETTE_TIP = 5027;
    static CMD_ROULETTE_CLEAR_BET = 5028;
    static CMD_ROULETTE_SPIN_RESULT = 5029;
    static CMD_ROULETTE_USER_HISTORY = 5030;
  }

  export interface User {
    userName: string;
    displayName: string;
    avatar: string;
    balance: number;
    moneyWin: number;
    listBet: string;
    listWin: string;
    isMe: boolean;
  }

  export class Config {
    static T_0 = 0;
    static T_1 = 1;
    static T_2 = 2;
    static T_3 = 3;
    static T_4 = 4;
    static T_5 = 5;
    static T_6 = 6;
    static T_7 = 7;
    static T_8 = 8;
    static T_9 = 9;
    static T_10 = 10;
    static T_11 = 11;
    static T_12 = 12;
    static T_13 = 13;
    static T_14 = 14;
    static T_15 = 15;
    static T_16 = 16;
    static T_17 = 17;
    static T_18 = 18;
    static T_19 = 19;
    static T_20 = 20;
    static T_21 = 21;
    static T_22 = 22;
    static T_23 = 23;
    static T_24 = 24;
    static T_25 = 25;
    static T_26 = 26;
    static T_27 = 27;
    static T_28 = 28;
    static T_29 = 29;
    static T_30 = 30;
    static T_31 = 31;
    static T_32 = 32;
    static T_33 = 33;
    static T_34 = 34;
    static T_35 = 35;
    static T_36 = 36;
    static EVEN = 37;
    static ODD = 38;
    static RED = 39;
    static BLACK = 40;
    static T_1_TO_18 = 41;
    static T_19_TO_36 = 42;
    static T_1_TO_12 = 43;
    static T_13_TO_24 = 44;
    static T_25_TO_36 = 45;
    static T_ROW_1 = 157;
    static T_ROW_2 = 158;
    static T_ROW_3 = 159;
    static T0_1 = 49;
    static T0_2 = 50;
    static T0_3 = 156;
    static T1_2 = 51;
    static T1_4 = 52;
    static T2_3 = 53;
    static T2_5 = 54;
    static T3_6 = 55;
    static T4_5 = 56;
    static T4_7 = 57;
    static T5_6 = 58;
    static T5_8 = 59;
    static T6_9 = 60;
    static T7_8 = 61;
    static T7_10 = 62;
    static T8_9 = 63;
    static T8_11 = 64;
    static T9_12 = 65;
    static T10_11 = 66;
    static T10_13 = 67;
    static T11_12 = 68;
    static T11_14 = 69;
    static T12_15 = 70;
    static T13_14 = 71;
    static T13_16 = 72;
    static T14_15 = 73;
    static T14_17 = 74;
    static T15_18 = 75;
    static T16_17 = 76;
    static T16_19 = 77;
    static T17_18 = 78;
    static T17_20 = 79;
    static T18_21 = 80;
    static T19_20 = 81;
    static T19_22 = 82;
    static T20_21 = 83;
    static T20_23 = 84;
    static T21_24 = 85;
    static T22_23 = 86;
    static T22_25 = 87;
    static T23_24 = 88;
    static T23_26 = 89;
    static T24_27 = 90;
    static T25_26 = 91;
    static T25_28 = 92;
    static T26_27 = 93;
    static T26_29 = 94;
    static T27_30 = 95;
    static T28_29 = 96;
    static T28_31 = 97;
    static T29_30 = 98;
    static T29_32 = 99;
    static T30_33 = 100;
    static T31_32 = 101;
    static T31_34 = 102;
    static T32_33 = 103;
    static T32_35 = 104;
    static T33_36 = 105;
    static T34_35 = 106;
    static T35_36 = 107;
    static T0_1_2 = 108;
    static T0_2_3 = 109;
    static T1_2_3 = 110;
    static T4_5_6 = 111;
    static T7_8_9 = 112;
    static T10_11_12 = 113;
    static T13_14_15 = 114;
    static T16_17_18 = 115;
    static T19_20_21 = 116;
    static T22_23_24 = 117;
    static T25_26_27 = 118;
    static T28_29_30 = 119;
    static T31_32_33 = 120;
    static T34_35_36 = 121;
    static T0_1_2_3 = 122;
    static T1_2_4_5 = 123;
    static T2_3_5_6 = 124;
    static T4_5_7_8 = 125;
    static T5_6_8_9 = 126;
    static T7_8_10_11 = 127;
    static T8_9_11_12 = 128;
    static T10_11_13_14 = 129;
    static T11_12_14_15 = 130;
    static T13_14_16_17 = 131;
    static T14_15_17_18 = 132;
    static T16_17_19_20 = 133;
    static T17_18_20_21 = 134;
    static T19_20_22_23 = 135;
    static T20_21_23_24 = 136;
    static T22_23_25_26 = 137;
    static T23_24_26_27 = 138;
    static T25_26_28_29 = 139;
    static T26_27_29_30 = 140;
    static T28_29_31_32 = 141;
    static T29_30_32_33 = 142;
    static T31_32_34_35 = 143;
    static T32_33_35_36 = 144;
    static T1_2_3_4_5_6 = 145;
    static T4_5_6_7_8_9 = 146;
    static T7_8_9_10_11_12 = 147;
    static T10_11_12_13_14_15 = 148;
    static T13_14_15_16_17_18 = 149;
    static T16_17_18_19_20_21 = 150;
    static T19_20_21_22_23_24 = 151;
    static T22_23_24_25_26_27 = 152;
    static T25_26_27_28_29_30 = 153;
    static T28_29_30_31_32_33 = 154;
    static T31_32_33_34_35_36 = 155;
    static List = {
      0: [0],
      1: [1],
      2: [2],
      3: [3],
      4: [4],
      5: [5],
      6: [6],
      7: [7],
      8: [8],
      9: [9],
      10: [10],
      11: [11],
      12: [12],
      13: [13],
      14: [14],
      15: [15],
      16: [16],
      17: [17],
      18: [18],
      19: [19],
      20: [20],
      21: [21],
      22: [22],
      23: [23],
      24: [24],
      25: [25],
      26: [26],
      27: [27],
      28: [28],
      29: [29],
      30: [30],
      31: [31],
      32: [32],
      33: [33],
      34: [34],
      35: [35],
      36: [36],
      37: [37],
      38: [38],
      39: [39],
      40: [40],
      41: [41],
      42: [42],
      43: [43],
      44: [44],
      45: [45],
      157: [1,34],
      158: [2,35],
      159: [3,36],
      49: [0, 1],
      50: [0, 2],
      51: [1,2],
      52: [1,4],
      53: [2,3],
      54: [2,5],
      55: [3,6],
      56: [4,5],
      57: [4,7],
      58: [5,6],
      59: [5,8],
      60: [6,9],
      61: [7,8],
      62: [7,10],
      63: [8,9],
      64: [8,11],
      65: [9,12],
      66: [10,11],
      67: [10,13],
      68: [11,12],
      69: [11,14],
      70: [12,15],
      71: [13,14],
      72: [13,16],
      73: [14,15],
      74: [14,17],
      75: [15,18],
      76: [16,17],
      77: [16,19],
      78: [17,18],
      79: [17,20],
      80: [18,21],
      81: [19,20],
      82: [19,22],
      83: [20,21],
      84: [20,23],
      85: [21, 24],
      86: [22,23],
      87: [22,25],
      88: [23,24],
      89: [23,26],
      90: [24,27],
      91: [25,26],
      92: [25,28],
      93: [26,27],
      94: [26,29],
      95: [27,30],
      96: [28,29],
      97: [28,31],
      98: [29,30],
      99: [29,32],
      100: [30,33],
      101: [31,32],
      102: [31,34],
      103: [32,33],
      104: [32,35],
      105: [33,36],
      106: [34,35],
      107: [35,36],
      108: [0,1,2],
      109: [0,2,3],
      110: [1,2,3],
      111: [4,5,6],
      112: [7,8,9],
      113: [10,11,12],
      114: [13,14,15],
      115: [16,17,18],
      116: [19,20,21],
      117: [22,23,24],
      118: [25,26,27],
      119: [28,29,30],
      120: [31,32,33],
      121: [34,35,36],
      122: [0,1,2,3],
      123: [2,5,1,4],
      124: [3,6,2,5],
      125: [5,8,4,7],
      126: [6,9,5,8],
      127: [8,11,7,10],
      128: [9,12,8,11],
      129: [11,14,10,13],
      130: [12,15,11,14],
      131: [14,17,13,16],
      132: [15,18,14,17],
      133: [17,20,16,19],
      134: [18,21,17,20],
      135: [20,23,19,22],
      136: [21,24,20,23],
      137: [23,26,22,25],
      138: [24,27,23,26],
      139: [26,29,25,28],
      140: [27,30,26,29],
      141: [29,32,28,31],
      142: [30,33,29,32],
      143: [32,35,31,34],
      144: [33,36,32,35],
      145: [3,6,2,5,1,4],
      146: [6,9,5,8,4,7],
      147: [9,12,8,11,7,10],
      148: [12,15,11,14,10,13],
      149: [15,18,14,17,13,16],
      150: [18,21,17,20,16,19],
      151: [21,24,20,23,19,22],
      152: [24,27,23,26,22,25],
      153: [27,30,26,29,25,28],
      154: [30,33,29,32,28,31],
      155: [33,36,32,35,31,34],
      156: [0, 3],
    };
  }

  export class CHIP_VALUE {
    static C1B = 1000000000;
    static C100M = 100000000;
    static C10M = 10000000;
    static C2M = 2000000;
    static C1M = 1000000;
    static C500K = 500000;
    static C100K = 100000;
    static C50K = 50000;
    static C20K = 20000;
    static C10K = 10000;
    static C5K = 5000;
    static C1K = 1000;
  }

  export class Send {
    public static sendRouletteExitGame(roomId: number) {
      let pk = new RouletteNetwork.RouletteSendExitGame();
      pk.roomId = roomId;
      RouletteConnector.instance.sendPacket(pk);
    }

    public static sendRouletteJoinGame(roomId: number) {
      let pk = new RouletteNetwork.RouletteSendJoinGame();
      pk.roomId = roomId;
      RouletteConnector.instance.sendPacket(pk);
      // console.error("send join game", pk);
    }

    public static sendRouletteBet(typePot: number, chip: number) {
      let pk = new RouletteNetwork.RouletteSendBet();
      pk.typePot = typePot;
      pk.betChip = chip;
      RouletteConnector.instance.sendPacket(pk);
      // console.error("Send Bet", pk);
    }

    public static sendRouletteChat(isIcon: boolean, message: string) {
      let pkg = new RouletteNetwork.RouletteSendChat();
      pkg.isIcon = isIcon;
      pkg.message = message;
      RouletteConnector.instance.sendPacket(pkg);
    }

    public static sendTipToBanker() {
      let pkg = new RouletteNetwork.RouletteSendTip();
      RouletteConnector.instance.sendPacket(pkg);
    }

    public static sendClearBet() {
      //5028
      let pkg = new RouletteNetwork.RouletteSendClearBet();
      RouletteConnector.instance.sendPacket(pkg);
    }

    public static sendListExternalUser() {
      let pkg = new RouletteNetwork.RouletteSendListOtherUsers();
      RouletteConnector.instance.sendPacket(pkg);
    }

    public static sendMatchHistory() {
      let pkg = new RouletteNetwork.RouletteSendMatchHistory();
      RouletteConnector.instance.sendPacket(pkg);
    }

    public static sendUserHistory() {
      let pkg = new RouletteNetwork.RouletteSendUserHistory();
      RouletteConnector.instance.sendPacket(pkg);
    }
  }
  //Send start

  export class RouletteSendJoinGame extends BGUI.BaseOutPacket {
    //5001
    public roomId: number;

    getCmdId(): number {
      return Cmd.CMD_ROULETTE_JOINGAME;
    }
    putData(): void {
      this.putByte(this.roomId);
    }
  }

  export class RouletteSendChat extends BGUI.BaseOutPacket {
    public message: string;
    public isIcon: boolean = false;
    getCmdId(): number {
      return Cmd.CMD_ROULETTE_CHAT;
    }
    putData(): void {
      this.putByte(this.isIcon ? 1 : 0);
      this.putString(this.message);
    }
  }

  export class RouletteSendExitGame extends BGUI.BaseOutPacket {
    //5002
    public roomId: number;

    getCmdId(): number {
      return Cmd.CMD_ROULETTE_EXITGAME;
    }
    putData(): void {
      this.putByte(this.roomId);
    }
  }

  export class RouletteSendTip extends BGUI.BaseOutPacket {
    getCmdId(): number {
      return Cmd.CMD_ROULETTE_TIP;
    }
    putData(): void {
      // TODO
    }
  }

  export class RouletteSendBet extends BGUI.BaseOutPacket {
    //5004
    public typePot: number;
    public betChip: number;

    getCmdId(): number {
      return Cmd.CMD_ROULETTE_BET;
    }
    putData(): void {
      this.putInt(this.typePot);
      this.putLong(this.betChip);
    }
  }

  export class RouletteSendClearBet extends BGUI.BaseOutPacket {
    //5028
    getCmdId(): number {
      return Cmd.CMD_ROULETTE_CLEAR_BET;
    }
    putData(): void {}
  }

  export class RouletteSendListOtherUsers extends BGUI.BaseOutPacket {
    getCmdId(): number {
      return Cmd.CMD_ROULETTE_LIST_OTHER_USERS;
    }
    putData(): void {}
  }

  //5010
  export class RouletteSendMatchHistory extends BGUI.BaseOutPacket {
    getCmdId(): number {
      return Cmd.CMD_ROULETTE_MATCH_HISTORY;
    }
    putData(): void {}
  }

  //
  export class RouletteSendUserHistory extends BGUI.BaseOutPacket {
    getCmdId(): number {
      return Cmd.CMD_ROULETTE_USER_HISTORY;
    }
    putData(): void {}
  }
  //Send End

  //Receive Start
  export class RouletteReceiveLogin extends BGUI.BaseInPacket {
    public err: number = -1;

    protected unpack(): void {
        this.err = this.getError();
    }
  }

  export class RouletteReceiveGameInfo extends BGUI.BaseInPacket {
    //5005
    public referenceId: number = 0;
    public remainTime: number = 0;
    public bettingState: boolean = false;
    public state: number = 0;
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
      this.dices = [];
      this.winTypes = [];
      this.listUserInTable = [];

      this.referenceId = this.getLong();
      this.remainTime = this.getByte();
      this.bettingState = this.getBool();
      this.state = this.getByte();
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
      };

      this.playerSize = this.getShort();
      for (let i = 0; i < this.playerSize; i++) {
        let itemUser: User = {
          userName: this.getString(),
          displayName: this.getString(),
          avatar: this.getString(),
          balance: this.getLong(),
          listBet: this.getString(),
          isMe: false,
          moneyWin: 0,
          listWin: "",
        };
        this.listUserInTable.push(itemUser);
      }
      this.numberUserOutTable = this.getShort();
      this.listBetOfUserOutTable = this.getString();
    }
  }

  export class RouletteReceiveUserOut extends BGUI.BaseInPacket {
    //5014
    public reason: number = null;
    // public isOut: boolean = null;
    protected unpack(): void {
      this.reason = this.getByte();
      // this.isOut = this.getBool();
    }
  }

  export class RouletteRecevieBetSuccess extends BGUI.BaseInPacket {
    //5015
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

  export class RouletteReceiveNewGame extends BGUI.BaseInPacket {
    //5022
    public referenceId = 0;
    public time: number = 0;
    public userName: string = "";
    public currentMoney: number = 0;
    public playerSize: number;
    public infoMe: User = null;
    public listUserInTable: Array<User> = [];
    public numberUserOutTable: number = 0;

    protected unpack(): void {
      this.listUserInTable = [];
      this.referenceId = this.getLong();
      this.time = this.getShort();
      this.infoMe = {
        userName: this.getString(),
        displayName: this.getString(),
        avatar: this.getString(),
        balance: this.getLong(),
        moneyWin: 0,
        isMe: true,
        listBet: "",
        listWin: "",
      };
      this.playerSize = this.getShort();

      for (let i = 0; i < this.playerSize; i++) {
        let itemUser: User = {
          userName: this.getString(),
          displayName: this.getString(),
          avatar: this.getString(),
          balance: this.getLong(),
          isMe: false,
          moneyWin: 0,
          listBet: "",
          listWin: "",
        };
        this.listUserInTable.push(itemUser);
      }
      this.numberUserOutTable = this.getShort();
    }
  }

  export class RouletteRecevieTipToBanker extends BGUI.BaseInPacket {
    public money: number = 0;
    public nickName: string = null;
    public displayName: string = null;

    protected unpack(): void {
      this.money = this.getInt();
      this.nickName = this.getString();
      this.displayName = this.getString();
    }
  }

  export class RouletteReceiveUserExitRoom extends BGUI.BaseInPacket {
    //5012
    public infoMe: User = null;
    public listUserInTable: Array<User> = [];
    public playerInTableSize: number = 0;
    public numberUserOutTable: number = 0;
    protected unpack(): void {
      this.listUserInTable = [];
      this.infoMe = {
        userName: this.getString(),
        displayName: this.getString(),
        avatar: this.getString(),
        balance: this.getLong(),
        moneyWin: 0,
        listBet: "",
        listWin: "",
        isMe: true,
      };
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

  export class RouletteReceiveSpinResult extends BGUI.BaseInPacket {
    //5029
    public door: number;
    public doorList: Array<number> = [];
    protected unpack(): void {
      for (let index = 0; index < 3; index++) {
        this.doorList.push(this.getByte());
      }
    }
  }

  export class RouletteReceiveEndGame extends BGUI.BaseInPacket {
    //5008
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
        listWin: this.getString(),
        listBet: "",
        isMe: true,
      };

      this.playerSize = this.getShort();
      for (let i = 0; i < this.playerSize; i++) {
        let itemUser: User = {
          userName: this.getString(),
          displayName: this.getString(),
          avatar: this.getString(),
          moneyWin: this.getLong(),
          balance: this.getLong(),
          listWin: this.getString(),
          listBet: "",
          isMe: false,
        };
        this.listUserInTable.push(itemUser);
      }
      this.numberUserOutTable = this.getShort();
      this.listWinUserOutTable = this.getString();
    }
  }

  export class RouletteReceiveUserJoinRoom extends BGUI.BaseInPacket {
    //5011
    public infoMe: User = null;
    public listUserInTable: Array<User> = [];
    public playerInTableSize: number = 0;
    public numberUserOutTable: number = 0;
    protected unpack(): void {
      this.listUserInTable = [];
      this.infoMe = {
        userName: this.getString(),
        displayName: this.getString(),
        avatar: this.getString(),
        balance: this.getLong(),
        moneyWin: 0,
        listBet: "",
        listWin: "",
        isMe: true,
      };
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

  export class RouletteReceiveUserOutRoom extends BGUI.BaseInPacket {
    //5013
    public userName: string = null;
    public isOut: boolean = null;
    protected unpack(): void {
      this.userName = this.getString();
      this.isOut = this.getBool();
    }
  }

  export class RouletteReceiveChat extends BGUI.BaseInPacket {
    //5021
    public isIcon: boolean = false;
    public strData: string = null;
    public userName: string = null;
    public displayName: string = null;
    protected unpack(): void {
      this.isIcon = this.getBool();
      this.strData = this.getString();
      this.userName = this.getString();
    }
  }

  export class RouletteReceiveClearBet extends BGUI.BaseInPacket {
    //5028
    public err = null;
    public userName = null;
    public currentMoney = null;
    public listBet = null;
    protected unpack(): void {
      this.err = this.getError();
      this.userName = this.getString();
      this.currentMoney = this.getLong();
      this.listBet = this.getString();
    }
  }

  export class RouletteReceiveListOtherUsers extends BGUI.BaseInPacket {
    //5023
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
        });
      }
    }
  }

  //5010
  export class RouletteReceiveMatchHistory extends BGUI.BaseInPacket {
    public sessionHistory: string = null;
    protected unpack(): void {
      this.sessionHistory = this.getString();
    }
  }

  //50
  export class RouletteRecevieUserHistory extends BGUI.BaseInPacket {
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
          dices: this.getString(),
          details: [],
        };
        let size = this.getShort();
        for (let k = 0; k < size; k++) {
          let temp = {
            door: this.getByte(),
            doorBet: this.getLong(),
            doorWin: this.getLong(),
          };
          item.details.push(temp);
        }
        this.histories.push(item);
      }
    }
  }

  //Receive End
}
