import { SongKranConnector } from "./SongKran.Connector";

export namespace SlotCmd {
  /// DATA_TYPE
  export enum Direction {
    UP = 1,
    DOWN = -1,
  }

  export interface ImpItemCell {
    index: number;
    id: number;
    highlight: boolean;
    off: boolean;
    wildLength: number;
    wildUpper: boolean;
    wildNudge?: boolean;
  }

  export interface ImpData {
    betAmount?: number;
    listCell?: Array<ImpItemCell>;
    type?: number;
    listResult?: Array<ImpResult>;
    totalProfit?: number;
    currentMoney?: number;
    jackPotAmount?: number;
    totalPot?: number;
    totalRound?: number;
    currentRound?: number;
  }

  export interface ImpResult {
    listIndex: Array<number>;
    listRowIndexCols: Array<number>;
  }

  /////////////////////////////////
  export class Cmd {
    static CMD_SLOT_LOGIN = 1;
    static CMD_SLOT_LOGOUT = 2;
    static CMD_SLOT_DISCONNECTED = 37;
    static CMD_SLOT_JOIN_ROOM = 5001;
    static CMD_SLOT_GAME_INFO = 5002;
    static CMD_SLOT_JACKPOT_INFO = 5003;
    static CMD_SLOT_ROUND_RESULT = 5004;
    static CMD_SLOT_BET_FAILED = 5005;
    static CMD_SLOT_OPEN_JACKPOT = 5006;
    static CMD_Slot_SELECT_FREE_GAME = 5007;
    static CMD_SLOT_FREE_GAME_RESULT = 5008;
    static CMD_SLOT_START_MINIGAME = 5011;
    static CMD_SLOT_OPEN_MINIGAME = 5010;
    static CMD_SLOT_KICK_OUT = 5014;
    // static CMD_SLOT_EXITGAME = ; ???
  }

  export class STATE_OF_SPIN {
    static KHOI_DONG = 0;
    static DANG_QUAY = 1;
    static KET_THUC = 2;
  }

  export class STATE_OF_ANIM {
    static IDLE = "idle"; //all
    static DEACTIVE = "deactive"; //all
    static TWO = "2sec"; //all
    static ONE = "1sec"; //Scatter
    static FOUR = "4sec"; //Scatter
    static BEGIN = "begin"; //Wildx2,x3
    static TRANS = "transition"; //Wildx2,x3
  }

  export class DEFINE_CHARACTER {
    static WILDX2 = 0;
    static WILDX3 = 1;
    static SCATTER = 2;
    static GIRL = 3;
    static FLOWER = 4;
    static CAR = 5;
    static GUN = 6;
    static SLIPPER = 7;
    static SHORT = 8;
    static A = 9;
    static K = 10;
    static Q = 11;
    static J = 12;
    static TEN = 13;
    static NINE = 14;
  }

  export class SlotReceiveLogin extends BGUI.BaseInPacket {
    protected unpack(): void {}
  }

  //5002
  export class SlotReceiveGameInfo extends BGUI.BaseInPacket {
    public betAmount: number = 0;
    public currentMoney: number = 0;
    public isJackpot: boolean = false;
    public listJackpot: Array<number> = [];
    public isFreeGame: boolean = false;
    public freeGameResult: ImpData = {
      totalPot: 0,
      totalRound: 0,
      currentRound: 0,
    };

    protected unpack(): void {
      this.betAmount = this.getLong();
      this.currentMoney = this.getLong();
      this.isJackpot = this.getBool();
      if (this.isJackpot) {
        for (let i = 0; i < 3; i++) {
          this.listJackpot.push(this.getLong());
        }
      }
      this.isFreeGame = this.getBool();
      if (this.isFreeGame) {
        (this.freeGameResult.totalRound = this.getInt()),
          (this.freeGameResult.currentRound = this.getInt()),
          (this.freeGameResult.totalPot = this.getLong());
      }
    }
  }

  //5014
  export class SlotReceiveUserOut extends BGUI.BaseInPacket {
    public reason: number = null;
    public isOut: boolean = null;
    protected unpack(): void {
      this.reason = this.getByte();
      this.isOut = this.getBool();
    }
  }

  //5003
  export class SlotReceiveJackpotInfo extends BGUI.BaseInPacket {
    public betAmount: number = 0;
    public listJackpot: Array<number> = [];

    protected unpack(): void {
      this.betAmount = this.getLong();
      for (let i = 0; i < 3; i++) {
        let num = this.getLong();
        this.listJackpot.push(num);
      }
    }
  }

  //5004

  export class SlotReceiveRoundResult extends BGUI.BaseInPacket {
    public data: ImpData = {
      betAmount: -1,
      listCell: [],
      type: -1,
      listResult: [],
      totalProfit: -1,
      currentMoney: -1,
      jackPotAmount: -1,
    };

    public cellSize: number = 0;
    public resultSize: number = 0;

    protected unpack(): void {
      if (this.getError() != 0) {
        return;
      }

      this.data.betAmount = this.getLong();

      this.cellSize = this.getByte();
      for (let i = 0; i < this.cellSize; i++) {
        let itemCell: ImpItemCell = {
          index: i,
          id: this.getByte(),
          highlight: this.getBool(),
          off: false,
          wildLength: -1,
          wildUpper: false,
        };
        this.data.listCell.push(itemCell);
      }

      this.resultSize = this.getByte();
      if (this.resultSize !== 0) {
        for (let j = 0; j < this.resultSize; j++) {
          let result: ImpResult = {
            listIndex: [],
            listRowIndexCols: [],
          };
          let listIndexSize = this.getByte();
          for (let k = 0; k < listIndexSize; k++) {
            result.listIndex.push(this.getByte());
          }
          let listRowIndexColsSize = this.getByte();
          for (let l = 0; l < listRowIndexColsSize; l++) {
            result.listRowIndexCols.push(this.getByte());
          }
          this.data.listResult.push(result);
        }
      }

      /***
       * 1: LINE_WIN
       * 2: JACKPOT => Open jackpot
       * 3: FREE_GAME => Open select free game
       */
      this.data.type = this.getByte();

      this.data.totalProfit = this.getLong();
      this.data.currentMoney = this.getLong();

      if (this.data.type === 2) {
        this.data.jackPotAmount = this.getLong();
      }
    }
  }

  // Error:
  // 1: Không trừ được tiền
  // 2: Đang có freegame
  // 3: Đang có jackpot
  // 4: Đang có minigame (Các game Slot khác sẽ có Satan k có)
  export class SlotReceiveBetFailed extends BGUI.BaseInPacket {
    public error: any = null;
    protected unpack(): void {
      this.error = this.getError();
    }
  }

  export class SlotReceiveJackpotResult extends BGUI.BaseInPacket {
    /**
     * 0: MINOR
     * 1: MAJOR
     */

    // public idJackpot: number = 0;
    // public nameJackpot: string = "";
    public winMoney: number = 0;
    public currentMoney: number = 0;

    protected unpack(): void {
      // this.idJackpot = this.getByte();
      // this.nameJackpot = this.getString();
      this.winMoney = this.getLong();
      this.currentMoney = this.getLong();
    }
  }

  export class SlotReceiveFreeGameResult extends BGUI.BaseInPacket {
    //5010
    public freeGame: ImpData = {
      betAmount: -1,
      totalPot: -1,
      listCell: [],
      totalProfit: -1,
      currentMoney: -1,
      totalRound: -1,
      type: -1,
      listResult: [],
    };
    public listSize: number = -1;
    public resultSize: number = -1;
    public err: number = 0;

    protected unpack(): void {
      this.err = this.getError();
      if (this.err !== 0) {
        return;
      }
      this.freeGame.betAmount = this.getLong();
      this.freeGame.totalPot = this.getLong();

      this.listSize = this.getByte();
      for (let i = 0; i < this.listSize; i++) {
        let item: ImpItemCell = {
          index: i,
          id: this.getByte(),
          highlight: this.getBool(),
          off: false,
          wildLength: -1,
          wildUpper: false,
          wildNudge: this.getBool(),
        };
        this.freeGame.listCell.push(item);
      }

      this.resultSize = this.getByte();
      if (this.resultSize !== 0) {
        for (let j = 0; j < this.resultSize; j++) {
          let result: ImpResult = {
            listIndex: [],
            listRowIndexCols: [],
          };
          let listIndexSize = this.getByte();
          for (let k = 0; k < listIndexSize; k++) {
            result.listIndex.push(this.getByte());
          }
          let listRowIndexColsSize = this.getByte();
          for (let l = 0; l < listRowIndexColsSize; l++) {
            result.listRowIndexCols.push(this.getByte());
          }
          this.freeGame.listResult.push(result);
        }
      }

      this.freeGame.totalProfit = this.getLong();
      this.freeGame.currentMoney = this.getLong();
      this.freeGame.totalRound = this.getByte();
      this.freeGame.type = this.getByte();
      this.freeGame.currentRound = this.getByte();
    }
  }

  export class Send {
    // public static sendSlotExitGame(roomId: number) {
    //   let pk = new SlotSendExitGame();
    //   pk.roomId = roomId;
    //   SongKranConnector.instance.sendPacket(pk);
    // }

    public static sendSlotJoinGame(betAmount = 0) {
      let pk = new SlotSendJoinGame();
      pk.betAmount = betAmount;
      cc.error(pk);
      SongKranConnector.instance.sendPacket(pk);
    }

    public static sendSlotBet(betAmount: number) {
      let pk = new SlotSendBet();
      pk.betAmount = betAmount;
      SongKranConnector.instance.sendPacket(pk);
    }

    public static sendOpenJackpot() {
      let pk = new SlotSendOpenJackpot();
      SongKranConnector.instance.sendPacket(pk);
    }

    // public static sendSlotLogin(nickname, accessToken) {
    //   let pk = new SendSlotLogin();
    //   pk.nickName = nickname;
    //   pk.accessToken = accessToken;
    //   SongKranConnector.instance.sendPacket(pk);
    // }

    // public static sendSlotLoginByUrl(partner, accessToken, lang) {
    //   let pk = new SlotLoginByUrl();
    //   pk.appId = 11;
    //   pk.partner = partner;
    //   pk.accessToken = accessToken;
    //   pk.lang = lang;
    //   SongKranConnector.instance.sendPacket(pk);
    // }

    public static sendStartFreeGame() {
      let pk = new SlotCmd.SlotSendStartFreeGame();
      SongKranConnector.instance.sendPacket(pk);
    }
  }

  export class SlotLoginByUrl extends BGUI.BaseOutPacket {
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

  //5001
  export class SlotSendJoinGame extends BGUI.BaseOutPacket {
    public betAmount: number;
    getCmdId(): number {
      return Cmd.CMD_SLOT_JOIN_ROOM;
    }
    putData(): void {
      this.putInt(this.betAmount);
    }
  }

  //500
  // export class SlotSendExitGame extends BGUI.BaseOutPacket {
  //   public roomId: number;
  //   getCmdId(): number {
  //     return Cmd.CMD_SLOT_EXITGAME;
  //   }
  //   putData(): void {
  //     this.putByte(this.roomId);
  //   }
  // }
  //5004
  export class SlotSendBet extends BGUI.BaseOutPacket {
    public betAmount: number;
    getCmdId(): number {
      return Cmd.CMD_SLOT_ROUND_RESULT;
    }
    putData(): void {
      this.putInt(this.betAmount);
    }
  }

  //5006
  export class SlotSendOpenJackpot extends BGUI.BaseOutPacket {
    getCmdId(): number {
      return Cmd.CMD_SLOT_OPEN_JACKPOT;
    }
    putData(): void {}
  }

  export class SendSlotLogin extends BGUI.BaseOutPacket {
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

  export class SlotSendStartFreeGame extends BGUI.BaseOutPacket {
    getCmdId(): number {
      return Cmd.CMD_SLOT_FREE_GAME_RESULT;
    }
    putData(): void {}
  }

  //////////////////////////////////////////////////////////
}
