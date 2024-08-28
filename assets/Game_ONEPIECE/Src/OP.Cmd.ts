import { OPConnector } from "./Connector/OP.Connector";

export namespace OPCmd {
  export interface BingoItem {
    number: number;
    type: number;
    enabled: boolean;
  }
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
    static CMD_SLOT_START_MINIGAME = 5011;
    static CMD_SLOT_OPEN_MINIGAME = 5010;
    static CMD_SLOT_EXITGAME = 5002;
    static CMD_SLOT_KICK_OUT = 5014;
  }

  export class JACKPOT {
    static MINI = 1;
    static MINOR = 2;
    static MAJOR = 3;
  }

  export class ROUND_RESULT_TYPE {
    static LINE_WIN = 1;
    static JACKPOT = 2;
    static FREE_GAME = 3;
  }

  export class SPIN_WHEEL_TYPE {
    static POWER_SPIN = 1;
    static POWER_CLIMB = 2;
    static POWER_PRIZE = 3;
  }

  export class Send {
    public static sendSlotExitGame(roomId: number) {
      let pk = new OPCmd.SlotSendExitGame();
      pk.roomId = roomId;
      OPConnector.instance.sendPacket(pk);
    }

    public static sendSlotJoinGame(betAmount: number) {
      let pk = new OPCmd.SlotSendJoinGame();
      pk.betAmount = betAmount;
      OPConnector.instance.sendPacket(pk);
      console.error("Send JoinGame", pk);
    }

    public static sendSlotBet(
      betAmount: number
      // isFreeGame: boolean
    ) {
      let pk = new OPCmd.SlotSendBet();
      pk.betAmount = betAmount;
      // pk.isFreeGame = isFreeGame;
      OPConnector.instance.sendPacket(pk);
      console.error("Send Bet", pk);
    }

    public static sendOpenJackpot() {
      let pk = new OPCmd.SlotSendOpenJackpot();
      OPConnector.instance.sendPacket(pk);
    }
    public static sendOpenMinigame() {
      let pk = new OPCmd.SlotSendOpenMinigame();
      OPConnector.instance.sendPacket(pk);
    }

    public static sendStartFreeGame() {
      let pk = new OPCmd.SlotSendStartFreeGame();
      OPConnector.instance.sendPacket(pk);
    }

    public static sendSlotLogin(nickname, accessToken) {
      let pk = new SendSlotLogin();
      pk.nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
      pk.accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
      OPConnector.instance.sendPacket(pk);
    }

    public static sendSlotLoginByUrl(partner, accessToken, lang) {
      let pk = new SlotLoginByUrl();
      pk.appId = 11;
      pk.partner = partner;
      pk.accessToken = accessToken;
      pk.lang = lang;
      OPConnector.instance.sendPacket(pk);
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
        this.scene = this.readByte(bf);
        this.betAmount = this.readInt(bf);
        this.isFreeGame = this.readBoolean(bf);
     */
    // public scene: number;
    public betAmount: number;
    // public isFreeGame: boolean = false;

    getCmdId(): number {
      return Cmd.CMD_SLOT_BET;
    }
    putData(): void {
      // this.putByte(this.scene);
      this.putInt(this.betAmount);
      // this.putByte(this.isFreeGame ? 1 : 0);
    }
  }

  export class SlotSendOpenJackpot extends BGUI.BaseOutPacket {
    //5028
    getCmdId(): number {
      return Cmd.CMD_SLOT_OPEN_JACKPOT;
    }
    putData(): void {}
  }
  export class SlotSendOpenMinigame extends BGUI.BaseOutPacket {
    //5028
    getCmdId(): number {
      return Cmd.CMD_SLOT_START_MINIGAME;
    }
    putData(): void {}
  }

  export class SlotSendStartFreeGame extends BGUI.BaseOutPacket {
    getCmdId(): number {
      return Cmd.CMD_SLOT_START_FREE_GAME;
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
  //////////////////////////////////////////////////////////

  //Receive Start

  export class SlotReceivedLogin extends BGUI.BaseInPacket {
    public err: number = -1;

    protected unpack(): void {
      this.err = this.getError();
    }
  }

  export class SlotReceiveGameInfo extends BGUI.BaseInPacket {
    //5005
    public betAmount: number = 0;
    public currentMoney: number = 0;

    public bingoData: {
      totalJackpot: number;
      totalBingo: number;
      ticketPrize: number;
      bingoItem: Array<BingoItem>;
    } = null;

    public activeJackpot: boolean;
    public activeFreeGame: boolean;

    protected unpack(): void {
      this.betAmount = this.getLong();
      this.currentMoney = this.getLong();

      let jackpotTotal = this.getByte();
      let bingoTotal = this.getByte();
      let ticketPrizeTemp = this.getByte();
      let bingoItemTemp: Array<BingoItem> = [];
      let bingoItemLength = this.getByte();
      for (let i = 0; i < bingoItemLength; i++) {
        bingoItemTemp.push({
          number: this.getByte(),
          type: this.getByte(),
          enabled: this.getBool(),
        });
      }
      
      this.bingoData = {
        totalJackpot: jackpotTotal,
        totalBingo: bingoTotal,
        ticketPrize: ticketPrizeTemp,
        bingoItem: bingoItemTemp,
      };

      this.activeJackpot = this.getBool();
      this.activeFreeGame = this.getBool();
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
    public miniFundBonus: number = 0;
    public minorFundBonus: number = 0;
    public majorFundBonus: number = 0;

    protected unpack(): void {
      this.betAmount = this.getLong();
      this.miniFundBonus = this.getLong();
      this.minorFundBonus = this.getLong();
      this.majorFundBonus = this.getLong();
    }
  }

  export class SlotReceiveRoundResult extends BGUI.BaseInPacket {
    //5022
    public betAmount: number = 0;
    public item = [];
    public result = [];
    public type: number = 0;

    //Bingo 
    public totalBingo: number = 0; // Bonus / fill
    public totalJackpot: number = 0;  // chest
    public ticketPrize: number = 0;
    public indexHighlight = [];
    public lineBingo = [];
    public bingoBoard = [];
    public bingoBoardNew = [];
    //Bingo

    public amountProfit: number = 0;
    public currentMoney: number = 0;

    protected unpack(): void {
      this.betAmount = this.getLong();
      this.item = [];
      const listItemIndex = this.getByte();
      for (let i = 0; i < listItemIndex; i++) {
        let id = this.getByte();
        let highlight = this.getBool();
        if (id == 14) {
          this.item.push({
            id: id,
            highlight: highlight,
            bingoIndex: this.getByte(),
            bingoNum: this.getByte(),
          });
        } else if (id == 3) {
          this.item.push({
            id: id,
            highlight: highlight,
            indexBingo1: this.getByte(),
            indexBingo2: this.getByte(),
            indexBingo3: this.getByte(),
          });
        } else {
          this.item.push({
            id: id,
            highlight: highlight,
          });
        }
      }
      const listResultIndex = this.getByte();
      for (let j = 0; j < listResultIndex; j++) {
        this.result.push({
          lineWin: this.getByte(),
          moneyWin: this.getLong(),
        });
      }
      this.type = this.getByte();

      //Bingo:
      this.totalBingo = this.getByte();
      this.totalJackpot = this.getByte();
      this.ticketPrize = this.getByte();

      let tempSize1 = this.getShort();
      for (let i = 0; i < tempSize1; i++) {
        let num = this.getByte();
        this.indexHighlight.push(num);
      }
      let tempSize2 = this.getShort();
      for (let i = 0; i < tempSize2; i++) {
        let num = this.getByte();
        this.lineBingo.push(num);
      }

      let bingoItemOld = this.getBool();
      if (bingoItemOld) {
        for (let i = 0; i < 25; i++) {
          this.bingoBoard.push({
            number: this.getByte(),
            type: this.getByte(),
            enabled: this.getBool(),
          });
        }
      }

      for (let i = 0; i < 25; i++) {
        this.bingoBoardNew.push({
          number: this.getByte(),
          type: this.getByte(),
          enabled: this.getBool(),
        });
      }
      //Bingo

      this.amountProfit = this.getLong();
      this.currentMoney = this.getLong();
    }
  }

  export class SlotReceiveBetFailed extends BGUI.BaseInPacket {
    protected unpack(): void {}
  }

  export class SlotReceiveJackpotResult extends BGUI.BaseInPacket {
    public winMoney: number = 0;
    public currentMoney: number = 0;

    protected unpack(): void {
      this.winMoney = this.getLong();
      this.currentMoney = this.getLong();
    }
  }

  export class SlotReceiveMiniGameResult extends BGUI.BaseInPacket {
    //5010
    public betAmount: number = 0;
    public index: number = 0;
    public finished: boolean;
    public miniGameItem = [];

    public amountProfit: number = 0;
    public totalPot: number = 0;
    public currentMoney: number = 0;

    protected unpack(): void {
      this.betAmount = this.getLong();
      this.miniGameItem = [];
      const miniGameItemListOpen = this.getByte();
      for (let i = 0; i < miniGameItemListOpen; i++) {
        this.miniGameItem.push({
          index: this.getByte(),
          id: this.getByte(), 
          amount: this.getLong(),  // getMultiple() * betAmount
          multiple: this.getByte(), 
        });
      }

      this.totalPot = this.getLong();
      this.amountProfit = this.getLong();
      this.currentMoney = this.getLong();
    }
  }

  export class SlotReceiveFreeGameResult extends BGUI.BaseInPacket {
    //5008
    public betAmount: number = 0;
    public colIndex: number = 0;
    public resultSelectFreeGame = [];
    public currentRound: number = 0;
    public totalRound: number = 0;
    public totalPot: number = 0;
    public item = [];
    public type: number = 0;
    public amountProfit: number = 0;
    public currentMoney: number = 0;
    protected unpack(): void {
      this.betAmount = this.getLong();
      this.colIndex = this.getByte();
      let tempSize2 = this.getShort();
      for (let i = 0; i < tempSize2; i++) {
        let num = this.getByte();
        this.resultSelectFreeGame.push(num);
      }
      this.currentRound = this.getByte();
      this.totalRound = this.getByte();
      this.totalPot = this.getLong();
      this.item = [];
      const itemsSize = this.getByte();
      for (let i = 0; i < itemsSize; i++) {
        this.item.push({
          id: this.getByte(),
          highlight: this.getByte(),
        });
      }

      this.type = this.getByte();
      this.amountProfit = this.getLong();
      this.currentMoney = this.getLong();
    }
  }
}
