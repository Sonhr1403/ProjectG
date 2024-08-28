
import { WukongConnector } from "./connector/Wukong.Connector";
export namespace WukongCmd {
  export interface ImpItemCell { id: number, oldId: number, highlight: boolean }

  export class Cmd {
    static CMD_SLOT_LOGIN = 1;
    static CMD_SLOT_LOGOUT = 2;
    static CMD_SLOT_DISCONNECTED = 37;
    static CMD_SLOT_JOIN_ROOM = 5001;
    static CMD_SLOT_BET = 5004;
    static CMD_SLOT_OPEN_JACKPOT = 5006;
    static CMD_SLOT_START_FREE_GAME = 5008;
    static CMD_SLOT_GAME_INFO = 5002;
    static CMD_SLOT_JACKPOT_INFO = 5003;
    static CMD_SLOT_ROUND_RESULT = 5004;
    static CMD_SLOT_BET_FAILED = 5005;
    static CMD_SLOT_JACKPOT_RESULT = 5006;
    static CMD_SLOT_FREE_GAME_RESULT = 5008;
    static CMD_SLOT_EXITGAME = 5002;
    static CMD_SLOT_KICK_OUT = 5014;
  }

  export class JACKPOT { static MINI = 1; static MINOR = 2; static MAJOR = 3;}
  export class ROUND_RESULT_TYPE { static LINE_WIN = 1; static JACKPOT = 2; static FREE_GAME = 3; }

  export class Send {
    public static sendSlotExitGame(roomId: number) {
      let pk = new WukongCmd.SlotSendExitGame();
      pk.roomId = roomId;
      WukongConnector.instance.sendPacket(pk);
    }

    public static sendSlotJoinGame(betAmount = 0) {
      let pk = new WukongCmd.SlotSendJoinGame();
      pk.betAmount = betAmount;
      WukongConnector.instance.sendPacket(pk);
      console.error("Send JoinGame", pk);
    }

    public static sendSlotBet(betAmount: number) {
      let pk = new WukongCmd.SlotSendBet();
      pk.betAmount = betAmount;
      WukongConnector.instance.sendPacket(pk);
      console.error("Send Bet", pk);
    }

    public static sendOpenJackpot() {
      let pk = new WukongCmd.SlotSendOpenJackpot();
      WukongConnector.instance.sendPacket(pk);
    }

    public static sendStartFreeGame() {
      let pk = new WukongCmd.SlotSendStartFreeGame();
      WukongConnector.instance.sendPacket(pk);
    }

    public static sendSlotLogin(nickname, accessToken) {
      let pk = new SendSlotLogin();
      pk.nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
      pk.accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
      WukongConnector.instance.sendPacket(pk);
    }

    public static sendSlotLoginByUrl(partner, accessToken, lang) {
      let pk = new SlotLoginByUrl();
      pk.appId = 11;
      pk.partner = partner;
      pk.accessToken = accessToken;
      pk.lang = lang;
      WukongConnector.instance.sendPacket(pk);
    }
  }

  //////////////////////////////////////////////////////////
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

  export class SlotSendJoinGame extends BGUI.BaseOutPacket {
    //5001
    public betAmount: number;

    getCmdId(): number {
      return Cmd.CMD_SLOT_JOIN_ROOM;
    }
    putData(): void {
      this.putInt(this.betAmount);
    }
  }

  export class SlotSendExitGame extends BGUI.BaseOutPacket {
    //5002
    public roomId: number;

    getCmdId(): number {
      return Cmd.CMD_SLOT_EXITGAME;
    }
    putData(): void {
      this.putByte(this.roomId);
    }
  }

  export class SlotSendBet extends BGUI.BaseOutPacket {
    //5004
    /**
     * 25000
     * 50000
     * 100000
     * 250000
     * 500000
     * 1000000
     */
    public betAmount: number;

    getCmdId(): number {
      return Cmd.CMD_SLOT_BET;
    }
    putData(): void {
      this.putInt(this.betAmount);
    }
  }

  export class SlotSendOpenJackpot extends BGUI.BaseOutPacket {
    //5028
    getCmdId(): number {
      return Cmd.CMD_SLOT_OPEN_JACKPOT;
    }
    putData(): void {
    }
  }

  export class SlotSendStartFreeGame extends BGUI.BaseOutPacket {
    getCmdId(): number {
      return Cmd.CMD_SLOT_START_FREE_GAME;
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

  //Receive Start

  export class WukongReceivedLogin extends BGUI.BaseInPacket {
    public err: number = -1;

    protected unpack(): void {
        this.err = this.getError();
    }
  }


  export class SlotReceiveGameInfo extends BGUI.BaseInPacket {
    //5005
    public betAmount: number = 0;
    public currentMoney: number = 0;
    public amountFundBonus: number = 0;

    public jackpotResult: {
      amountFundBonus: number
    } = null;
    public freeGameResult: {
      currentRound: number
      totalRound: number
      totalPot: number
      /**
       * 1: lock
       * 2: unlock
       */
      type: number
      wukongs: number[]
    } = null;

    protected unpack(): void {
      this.betAmount = this.getLong();
      this.currentMoney = this.getLong();
      this.amountFundBonus = this.getLong();

      const activeJackpot = this.getBool();
      if (activeJackpot) {
        this.jackpotResult = {
          amountFundBonus: this.getLong()
        }
      }

      const activeFreeGame = this.getBool();
      if (activeFreeGame) {
        this.freeGameResult = {
          currentRound: this.getByte(),
          totalRound: this.getByte(),
          totalPot: this.getLong(),
          type: this.getByte(),
          wukongs: [
            this.getByte(),
            this.getByte(),
            this.getByte()
          ],
        }
      }
    }
  }

  export class SlotReceiveUserOut extends BGUI.BaseInPacket {
    //5014
    public reason: number = null;
    public isOut: boolean = null;
    protected unpack(): void {
      this.reason = this.getByte();
      this.isOut = this.getBool();
    }
  }

  export class SlotReceiveJackpotInfo extends BGUI.BaseInPacket {
    //5003
    public betAmount: number = 0;
    public amountFundBonus: number = 0;

    protected unpack(): void {
      this.betAmount = this.getLong();
      this.amountFundBonus = this.getLong();
    }
  }

  export class SlotReceiveRoundResult extends BGUI.BaseInPacket {
    //5022

    public betAmount: number = 0;
    /**
     * 1: JACKPOT
     * 2: SCATTER
     * 3: WILD
     * 4: BAND
     * 5: GLOVE
     * 6: GOLDEN_BANDED_STAFF
     * 7: MAGICAL_CIRCLET
     * 8: A
     * 9: K
     * 10: Q
     * 11: J
     * 80: WUKONG_LOCK_1
     * 81: WUKONG_LOCK_2
     * 90: WUKONG_WILD_X1
     * 91: WUKONG_WILD_X2
     * 92: WUKONG_WILD_X3
     */
    public items: Array<ImpItemCell> = [];
    public results = [];

    /**
     * 1: LINE_WIN
     * 2: JACKPOT => Open jackpot
     * 3: FREE_GAME => Open select free game
     */
    public type: number = 0;
    public amountProfit: number = 0;
    public currentMoney: number = 0;
    public amountFundBonus: number = 0;

    protected unpack(): void {
      this.betAmount = this.getLong();
      const itemsSize = this.getByte();
      for (let i = 0; i < itemsSize; i++) {
        this.items.push({
          id: this.getByte(),
          oldId: -1,
          highlight: this.getBool(),
        });
       
      }
      const resultSize = this.getByte();
      for (let i = 0; i < resultSize; i++) {
        this.results.push({
          id: this.getByte(),
          moneyWin: this.getLong(),
        });
      }
      this.type = this.getByte();
      this.amountProfit = this.getLong();
      this.currentMoney = this.getLong();
      this.amountFundBonus = this.getLong();
    }
  }

  export class SlotReceiveBetFailed extends BGUI.BaseInPacket {
    protected unpack(): void {
    }
  }

  export class SlotReceiveJackpotResult extends BGUI.BaseInPacket {
      /**
       * 0: MINI
       * 1: MINOR
       * 2: MAJOR
       */


    public amountFundBonus: number = 0;
    public idJackpot: number = 0;
    public nameJackpot: string = '';
    public amountInit: number = 0;
    public percentFundBonus: number = 0;
    public amountBonus: number = 0;
    public winMoney: number = 0;
    public currentMoney: number = 0;

    protected unpack(): void {
      this.amountFundBonus = this.getLong();
      this.idJackpot = this.getByte();
      this.nameJackpot = this.getString();
      this.amountInit = this.getLong();
      this.percentFundBonus = this.getInt();
      this.amountBonus = this.getLong();
      this.winMoney = this.getLong();
      this.currentMoney = this.getLong();
    }
  }

  export class SlotReceiveFreeGameResult extends BGUI.BaseInPacket {
    //5008
    public betAmount: number = 0;
    public option: number = 0;
    public currentRound: number = 0;
    public totalRound: number = 0;
    public totalPot: number = 0;
    public items: Array<ImpItemCell> = [];
    public results = [];
    public type: number = 0;
    public isUnlockAll: boolean = false;
    public currentMoney: number = 0;
    public amountProfit: number = 0;
    protected unpack(): void {
      this.betAmount = this.getLong();
      this.currentRound = this.getByte(); // 8
      this.totalRound = this.getByte(); // 20
      this.totalPot = this.getLong(); // Tông tiền thắng của free
      this.type = this.getByte(); // 1 or 2
      this.isUnlockAll = this.getBool(); // unlock 2 column
      const itemsSize = this.getByte();
      for (let i = 0; i < itemsSize; i++) {
        this.items.push({
          id: this.getByte(),
          oldId: -1,
          // highlight: false,
          highlight: this.getBool(),
          
        });
        // cc.error("SLOT_51_FREE_GAME_RESULT", this.items)
      }
      const resultSize = this.getByte();
      for (let i = 0; i < resultSize; i++) {
        this.results.push({
          id: this.getByte(),
          moneyWin: this.getLong(),
        });
      }
      this.amountProfit = this.getLong();
      this.currentMoney = this.getLong();
    }
  }
}
