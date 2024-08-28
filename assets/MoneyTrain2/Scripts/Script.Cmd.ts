import { isEmpty } from "lodash";
import { MoneyTrain2Connector } from "./Script.Connector";

export namespace SlotCmd {
  /// DATA_TYPE
  export enum Direction {
    UP = 1,
    DOWN = -1,
  }

  export interface ImpItemCell {
    index: number;
    id: number;
    highlight?: boolean;
    value?: number;
  }

  export interface ImpData {
    betAmount: number;
    cellSize: number;
    listCell: Array<ImpItemCell>;
    resultSize: number;
    listResult: Array<ImpResult>;
    type: number;
    totalProfit: number;
    currentMoney: number;
    multiple?: number;
  }

  export interface ImpResult {
    hlSize: number;
    listHL: Array<number>;
    lineWinSize: number;
    listLineWin: Array<number>;
  }

  export interface ImpListActions {
    boosterId: number;
    boosterIndex: number;
    // currentRound: number;

    listBoosterSize: number;
    listBooster: Array<ImpBooster>;
  }

  export interface ImpBooster {
    index: number;
    id: number;
    value: number;
  }

  export interface ImpMini {
    betAmount?: number;
    isActionEmpty?: boolean;
    listActionsSize?: number;
    listActions?: Array<ImpListActions>;
    totalPot: number;
    currentMoney?: number;
    totalBooster: number;
    totalRound: number;
    currentRound: number;
    listBoosterSize?: number;
    listBooster?: Array<ImpBooster>;
  }

  export interface ImpFreeGame {
    totalRound: number;
    currentRound: number;
    totalPot: number;
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

  export class STATE_OF_WIN {
    static BIG_WIN_START = "big_win_start";
    static BIG_WIN_LOOP = "big_win_loop";
    static EPIC_WIN_START = "epic_win_start";
    static EPIC_WIN_LOOP = "epic_win_loop";
    static MEGA_WIN_START = "mega_win_start";
    static MEGA_WIN_LOOP = "mega_win_loop";
    static EXPLOSIVE_WIN_START = "explosive_win_start";
  }

  export class STATE_OF_WHEEL {
    static ANIMATION = "animation";
    static BACK_WHEEL_START = "back_wheel_start";
    static BACK_WHEEL_STOP = "back_wheel_stop";
    static FRONT_WHEEL_START = "front_wheel_start";
    static FRONT_WHEEL_STOP = "front_wheel_stop";
  }

  export class STATE_OF_ANIM {
    static ANIMATION = "animation"; //H1->L8, torch2x
    static BASE = "base"; //wild
    static FIRE = "fire"; //wild
    static ALT_WIN = "alt_win"; //bonus
    static ALT_WIN_CLOSE = "alt_win_close"; //bonus
    static ANTICIPATION = "anticipation"; //bonus
    static LAND = "land"; //bonus, super_scatter
    static WIN = "win"; //bonus
    static WIN_CLOSE = "win_close"; //bonus
    static NECROMANCER_REACTION = "necromancer_reaction"; //necromancer2x, collector2x, payer2x, sniper2x, collector_payer, reset_plus
    static COLLECTOR_REACTION = "collector_reaction"; //bonus, necromancer2x, collector2x, payer2x, sniper2x, collector_payer, persistent_collector, persistent_payer, persistent_sniper, reset_plus, super_scatter
    static PAYER_REACTION = "payer_reaction"; //bonus, necromancer2x, collector2x, payer2x, sniper2x, collector_payer, persistent_collector, persistent_payer, persistent_sniper, reset_plus, super_scatter
    static SNIPER_REACTION = "sniper_reaction"; //bonus, necromancer2x, collector2x, payer2x, sniper2x, collector_payer, persistent_collector, persistent_payer, persistent_sniper, reset_plus, super_scatter
    static PERSISTENT_COLLECTOR_REACTION = "persistent_collector_reaction"; //necromancer2x, collector2x, payer2x, sniper2x, collector_payer, persistent_collector, persistent_payer, persistent_sniper, reset_plus
    static PERSISTENT_PAYER_REACTION = "persistent_payer_reaction"; //bonus, necromancer2x, collector2x, payer2x, sniper2x, collector_payer, persistent_collector, persistent_payer, persistent_sniper, reset_plus, super_scatter
    static PERSISTENT_SNIPPER_REACTION = "persistent_snipper_reaction"; //necromancer2x, collector2x, payer2x, sniper2x, collector_payer, persistent_collector, persistent_payer, persistent_sniper, reset_plus
    static ACTION = "action"; //necromancer2x, collector2x, payer2x, sniper2x, collector_payer, persistent_collector, persistent_payer, persistent_sniper, reset_plus
    static CLOSED = "closed"; //necromancer2x, collector2x, payer2x, sniper2x, collector_payer, persistent_collector, persistent_payer, persistent_sniper, reset_plus
    static RANDOM_GLOW = "random_glow"; //necromancer2x, collector2x, payer2x, sniper2x, collector_payer, reset_plus
    static SCALE_DOWN = "scale_down"; //necromancer2x, collector2x, payer2x, sniper2x, collector_payer, persistent_collector, persistent_payer, persistent_sniper, reset_plus
    static SCALE_UP = "scale_up"; //necromancer2x, collector2x, payer2x, sniper2x, collector_payer, persistent_collector, persistent_payer, persistent_sniper, reset_plus
    static SCALE_UP_FIRST_TIME = "scale_up_first_time"; //persistent_collector, persistent_payer, persistent_sniper
    static CARD_ANIM = "card_anim"; //persistent_collector, persistent_payer, persistent_sniper
  }

  export class DEFINE_CHARACTER {
    static EMPTY = -1;
    static WILD = 0;
    static BONUS = 1;
    static NECROMANCER = 2;
    static COLLECTOR = 3;
    static SNIPER = 4;
    static PAYER = 5;
    static SPADES = 6;
    static HEARTS = 7;
    static CLUBS = 8;
    static DIAMONDS = 9;
    static PERSISTENT_PAYER = 10;
    static PERSISTENT_SNIPER = 11;
    static PERSISTENT_COLLECTOR = 12;
    static RESET_PLUS = 13;
  }

  export class SlotReceiveLogin extends BGUI.BaseInPacket {
    // public userId: number = 0;
    // public username: string = "";
    // public displayName: string = "";
    // public avatar: string = "";
    // public currentMoney: number = 0;
    protected unpack(): void {
      // this.userId = this.getInt();
      // this.username = this.getString();
      // this.displayName = this.getString();
      // this.avatar = this.getString();
      // this.currentMoney = this.getLong();
    }
  }

  //5002
  export class SlotReceiveGameInfo extends BGUI.BaseInPacket {
    public betAmount: number = 0;
    public currentMoney: number = 0;
    public isFreeGame: boolean = false;
    public isMiniGame: boolean = false;
    public freeGame: ImpFreeGame = {
      totalRound: -1,
      currentRound: -1,
      totalPot: -1,
    };
    public miniGame: ImpMini = {
      totalRound: -1,
      currentRound: -1,
      totalPot: -1,
      totalBooster: -1,
      // listActionsSize: -1,
      // listActions: [],
      // isActionEmpty: false,
      listBooster: [],
      listBoosterSize: -1,
    };

    protected unpack(): void {
      this.betAmount = this.getLong();
      this.currentMoney = this.getLong();
      this.isFreeGame = this.getBool();
      if (this.isFreeGame) {
        this.freeGame.totalRound = this.getByte();
        this.freeGame.currentRound = this.getByte();
        this.freeGame.totalPot = this.getLong();
      }

      this.isMiniGame = this.getBool();
      if (this.isMiniGame) {
        // this.miniGame.isActionEmpty = this.getBool();

        // if (this.miniGame.isActionEmpty) {
        //   this.miniGame.listActionsSize = this.getByte();
        //   for (let i = 0; i < this.miniGame.listActionsSize; i++) {
        //     let itemActions: ImpListActions = {
        //       boosterId: this.getByte(),
        //       boosterIndex: this.getInt(),
        //       currentRound: this.getInt(),

        //       listBoosterSize: this.getByte(),
        //       listBooster: [],
        //     };
        //     for (let i = 0; i < itemActions.listBoosterSize; i++) {
        //       let itemBooster: ImpBooster = {
        //         index: this.getInt(),
        //         id: this.getByte(),
        //         value: this.getInt(),
        //       };
        //       itemActions.listBooster.push(itemBooster);
        //     }
        //     this.miniGame.listActions.push(itemActions);
        //   }
        // } else {
          this.miniGame.listBoosterSize = this.getByte();
          for (let i = 0; i < this.miniGame.listBoosterSize; i++) {
            let itemBooster: ImpBooster = {
              index: this.getInt(),
              id: this.getByte(),
              value: this.getInt(),
            };
            this.miniGame.listBooster.push(itemBooster);
          // }
        }

        this.miniGame.totalPot = this.getLong();
        this.miniGame.totalBooster = this.getLong();
        this.miniGame.totalRound = this.getByte();
        this.miniGame.currentRound = this.getByte();
      }
    }
  }

  //5004
  export class SlotReceiveRoundResult extends BGUI.BaseInPacket {
    public data: ImpData = {
      betAmount: -1,
      cellSize: 0,
      listCell: [],
      resultSize: 0,
      listResult: [],
      type: -1,
      totalProfit: -1,
      currentMoney: -1,
    };

    protected unpack(): void {
      if (this.getError() != 0) {
        return;
      }

      this.data.betAmount = this.getLong();

      this.data.cellSize = this.getByte();
      for (let i = 0; i < this.data.cellSize; i++) {
        let itemCell: ImpItemCell = {
          index: i,
          id: this.getByte(),
          highlight: false,
          value: -1,
        };
        let isValue = this.getBool();
        if (isValue) {
          itemCell.value = this.getInt();
        }
        this.data.listCell.push(itemCell);
      }

      this.data.resultSize = this.getByte();
      if (this.data.resultSize !== 0) {
        for (let j = 0; j < this.data.resultSize; j++) {
          let result: ImpResult = {
            hlSize: this.getByte(),
            listHL: [],
            lineWinSize: 0,
            listLineWin: [],
          };
          for (let k = 0; k < result.hlSize; k++) {
            result.listHL.push(this.getByte());
          }
          result.lineWinSize = this.getByte();
          for (let l = 0; l < result.lineWinSize; l++) {
            result.listLineWin.push(this.getByte());
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
    }
  }

  //5008
  export class SlotReceiveFreeGame extends BGUI.BaseInPacket {
    public data: ImpData = {
      betAmount: -1,
      cellSize: 0,
      listCell: [],
      resultSize: 0,
      listResult: [],
      type: -1,
      totalProfit: -1,
      currentMoney: -1,
      multiple: -1,
    };

    protected unpack(): void {
      if (this.getError() != 0) {
        return;
      }

      this.data.betAmount = this.getLong();

      this.data.cellSize = this.getByte();
      for (let i = 0; i < this.data.cellSize; i++) {
        let itemCell: ImpItemCell = {
          index: i,
          id: this.getByte(),
          highlight: false,
        };
        this.data.listCell.push(itemCell);
      }

      this.data.resultSize = this.getByte();
      if (this.data.resultSize !== 0) {
        for (let j = 0; j < this.data.resultSize; j++) {
          let result: ImpResult = {
            hlSize: this.getByte(),
            listHL: [],
            lineWinSize: 0,
            listLineWin: [],
          };
          for (let k = 0; k < result.hlSize; k++) {
            result.listHL.push(this.getByte());
          }
          result.lineWinSize = this.getByte();
          for (let l = 0; l < result.lineWinSize; l++) {
            result.listLineWin.push(this.getByte());
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
      this.data.multiple = this.getInt();
    }
  }

  // Error:
  // 1: Không trừ được tiền
  // 2: Đang có freegame
  // 3: Đang có jackpot
  // 4: Đang có minigame (Các game Slot khác sẽ có Satan k có)
  //5005
  export class SlotReceiveBetFailed extends BGUI.BaseInPacket {
    public error: any = null;
    protected unpack(): void {
      this.error = this.getError();
    }
  }

  //5010
  export class SlotReceiveMiniGame extends BGUI.BaseInPacket {
    public miniGame: ImpMini = {
      betAmount: -1,
      isActionEmpty: false,
      listActionsSize: -1,
      listActions: [],
      totalPot: -1,
      currentMoney: -1,
      totalBooster: -1,
      totalRound: -1,
      currentRound: -1,
      listBoosterSize: -1,
      listBooster: [],
    };

    public err: number = -1;

    protected unpack(): void {
      this.err = this.getError();
      if (this.err !== 0) {
        return;
      }
      this.miniGame.betAmount = this.getLong();

      this.miniGame.isActionEmpty = this.getBool();
      if (this.miniGame.isActionEmpty) {
        this.miniGame.listActionsSize = this.getByte();
        for (let i = 0; i < this.miniGame.listActionsSize; i++) {
          let itemActions: ImpListActions = {
            boosterId: this.getByte(),
            boosterIndex: this.getInt(),
            // currentRound: this.getInt(),

            listBoosterSize: this.getByte(),
            listBooster: [],
          };
          for (let i = 0; i < itemActions.listBoosterSize; i++) {
            let itemBooster: ImpBooster = {
              index: this.getInt(),
              id: this.getByte(),
              value: this.getInt(),
            };
            itemActions.listBooster.push(itemBooster);
          }
          this.miniGame.listActions.push(itemActions);
        }
      } else {
        this.miniGame.listBoosterSize = this.getByte();
        for (let i = 0; i < this.miniGame.listBoosterSize; i++) {
          let itemBooster: ImpBooster = {
            index: this.getInt(),
            id: this.getByte(),
            value: this.getInt(),
          };
          this.miniGame.listBooster.push(itemBooster);
        }
      }

      this.miniGame.totalPot = this.getLong();
      this.miniGame.currentMoney = this.getLong();
      this.miniGame.totalBooster = this.getLong();
      this.miniGame.totalRound = this.getByte();
      this.miniGame.currentRound = this.getByte();
    }
  }

  export class Send {
    public static sendSlotJoinGame(betAmount = 0) {
      let pk = new SlotSendJoinGame();
      pk.betAmount = betAmount;
      cc.error(pk);
      MoneyTrain2Connector.instance.sendPacket(pk);
    }

    public static sendSlotBet(betAmount: number) {
      let pk = new SlotSendBet();
      pk.betAmount = betAmount;
      MoneyTrain2Connector.instance.sendPacket(pk);
    }

    public static sendStartFreeGame() {
      let pk = new SlotCmd.SlotSendStartFreeGame();
      MoneyTrain2Connector.instance.sendPacket(pk);
    }

    public static sendStartMiniGame() {
      let pk = new SlotCmd.SlotSendStartMiniGame();
      MoneyTrain2Connector.instance.sendPacket(pk);
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

  //5008
  export class SlotSendStartFreeGame extends BGUI.BaseOutPacket {
    getCmdId(): number {
      return Cmd.CMD_SLOT_FREE_GAME_RESULT;
    }
    putData(): void {}
  }

  //5010
  export class SlotSendStartMiniGame extends BGUI.BaseOutPacket {
    getCmdId(): number {
      return Cmd.CMD_SLOT_OPEN_MINIGAME;
    }
    putData(): void {}
  }

  //////////////////////////////////////////////////////////
}
