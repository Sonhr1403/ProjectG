import { SlotTTConnector } from "./SlotTT.Connector";

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
  }

  export interface ImpResult {
    id: number;
    moneyWin: number;
  }

  export interface ImpData {
    betAmount: number;
    itemList: Array<ImpItemCell>;
    resultList: Array<ImpResult>;
    amountProfit: number;
    currentMoney: number;
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
    // static CMD_Slot_SELECT_FREE_GAME = 5007;
    // static CMD_Slot_FREE_GAME_RESULT = 5008;
    static CMD_SLOT_EXITGAME = 500;
    static CMD_SLOT_KICK_OUT = 5014;
  }

  export class STATE_OF_SPIN {
    static KHOI_DONG = 0;
    static DANG_QUAY = 1;
    static KET_THUC = 2;
  }

  export class STATE_OF_ANIM {
    static ACTIVE = "active";
    static DEFAULT = "default";
    static SPIN = "spin";
    static IDLE = "idle";
    static SPIN_STOP = "spin_stop";
  }

  export class DEFINE_CHARACTER {
    static JACKPOT = 1;
    static SCATTER = 2;
    static WILD = 3;
    static PEACH = 4;
    static EMERALD = 5;
    static GOLD = 6;
    static YELLOW = 7;
    static RED = 8;
    static GREEN = 9;
    static ANY = 10;

    static ANIM_CHARACTER = {
      [DEFINE_CHARACTER.SCATTER]: {
        name: "SCATTER",
        active: "active",
        default: "default",
        spin: "spin",
      },
      [DEFINE_CHARACTER.WILD]: {
        name: "WILD",
        active: "active",
        default: "default",
        idle: "idle",
        spin: "spin",
      },
      [DEFINE_CHARACTER.PEACH]: {
        name: "PEACH",
        active: "active",
        default: "default",
        spin: "spin",
      },
      [DEFINE_CHARACTER.EMERALD]: {
        name: "EMERALD",
        active: "active",
        default: "default",
        spin: "spin",
      },
      [DEFINE_CHARACTER.GOLD]: {
        name: "GOLD",
        active: "active",
        default: "default",
        spin: "spin",
      },
      [DEFINE_CHARACTER.YELLOW]: {
        name: "YELLOW",
        active: "active",
        default: "default",
        spin: "spin",
      },
      [DEFINE_CHARACTER.RED]: {
        name: "RED",
        active: "active",
        default: "default",
        spin: "spin",
      },
      [DEFINE_CHARACTER.GREEN]: {
        name: "GREEN",
        active: "active",
        default: "default",
        spin: "spin",
      },
    };
  }

  export class SlotReceiveLogin extends BGUI.BaseInPacket {
    protected unpack(): void {}
  }

  //5002
  export class SlotReceiveGameInfo extends BGUI.BaseInPacket {
    public betAmount: number = 0;
    public currentMoney: number = 0;
    public isJackpot: boolean = false;
    public isFreeGame: boolean = false;

    protected unpack(): void {
      this.betAmount = this.getLong();
      this.currentMoney = this.getLong();
      this.isJackpot = this.getBool();
      this.isFreeGame = this.getBool();
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
      for (let i = 0; i < 2; i++) {
        let num = this.getLong();
        this.listJackpot.push(num);
      }
    }
  }

  //5004
  export class SlotReceiveRoundResult extends BGUI.BaseInPacket {
    public listSize: number = 0;
    public resultSize: number = 0;
    public type: number = 0;
    public data: ImpData = {
      betAmount: -1,
      itemList: [],
      resultList: [],
      amountProfit: -1,
      currentMoney: -1
    };

    protected unpack(): void {
      // cc.log("error", this.getError());
      if (this.getError() != 0) {
        return;
      }
      this.data.betAmount = this.getLong();

      this.listSize = this.getByte();
      for (let i = 0; i < this.listSize; i++) {
        let itemCell: ImpItemCell = {
          index: i,
          id: this.getByte(),
          highlight: this.getBool()
        }
        this.data.itemList.push(itemCell);
      }

      this.resultSize = this.getByte();
      for (let j = 0; j < this.resultSize; j++) {
        let result: ImpResult = {
          id: this.getByte(),
          moneyWin: this.getLong()
        }
        this.data.resultList.push(result);
      }
      this.type = this.getByte();
      this.data.amountProfit = this.getLong();
      this.data.currentMoney = this.getLong();
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

  public idJackpot: number = 0;
  public nameJackpot: string = '';
  public winMoney: number = 0;
  public currentMoney: number = 0;

  protected unpack(): void {
    this.idJackpot = this.getByte();
    this.nameJackpot = this.getString();
    this.winMoney = this.getLong();
    this.currentMoney = this.getLong();
  }
}

  export class Send {
    // public static sendSlotExitGame(roomId: number) {
    //   let pk = new SlotSendExitGame();
    //   pk.roomId = roomId;
    //   SlotTTConnector.instance.sendPacket(pk);
    // }

    public static sendSlotJoinGame(betAmount = 0) {
      let pk = new SlotSendJoinGame();
      pk.betAmount = betAmount;
      SlotTTConnector.instance.sendPacket(pk);
    }

    public static sendSlotBet(betAmount: number) {
      let pk = new SlotSendBet();
      pk.betAmount = betAmount;
      SlotTTConnector.instance.sendPacket(pk);
    }

    public static sendOpenJackpot() {
      let pk = new SlotSendOpenJackpot();
      SlotTTConnector.instance.sendPacket(pk);
    }

    public static sendSlotLogin(nickname, accessToken) {
      let pk = new SendSlotLogin();
      pk.nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
      pk.accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
      SlotTTConnector.instance.sendPacket(pk);
    }

    public static sendSlotLoginByUrl(partner, accessToken, lang) {
      let pk = new SlotLoginByUrl();
      pk.appId = 11;
      pk.partner = partner;
      pk.accessToken = accessToken;
      pk.lang = lang;
      SlotTTConnector.instance.sendPacket(pk);
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
    //5028
    getCmdId(): number {
      return Cmd.CMD_SLOT_OPEN_JACKPOT;
    }
    putData(): void {
    }
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
  //////////////////////////////////////////////////////////
}
