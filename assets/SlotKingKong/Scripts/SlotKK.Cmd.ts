import { SlotKKConnector } from "./Connector/SlotKK.Connector";
import SlotKKCommon from "./SlotKK.Common";

export namespace SlotCmd {
  /// DATA_TYPE
  export enum Direction {
    UP = 1,
    DOWN = -1,
  }

  export interface ImpFreeGame {
    option: number;
    currentRound: number;
    totalRound: number;
    totalPot: number;
    multiple: number;
  }

  export interface Data {
    indexSize: number;
    indexList: Array<number>;
    moneyWin: number;
    hlSize: number;
    hlArray: Array<number>;
    hlGoldSize: number;
    hlGoldArray: Array<number>;
  }

  export interface ImpItemCell {
    index: number;
    id: number;
    highlight: boolean;
    isExplode: boolean;
    rowTake: number;
    isActive: boolean;
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
    static CMD_SLOT_JACKPOT_RESULT = 5006;
    static CMD_SLOT_SELECT_FREE_GAME = 5007;
    static CMD_SLOT_FREE_GAME_RESULT = 5008;
    static CMD_SLOT_EXITGAME = 500;
    static CMD_SLOT_KICK_OUT = 5014;
  }

  export class TYPE_WIN {
    static BIG_WIN = 1;
    static SUPER_WIN = 2;
    static MEGA_WIN = 3;
  }

  export class ROUND_RESULT_TYPE {
    static NORMAL_GAME = 1;
    static FREE_GAME = 3;
  }

  export class STATE_OF_SPIN { static KHOI_DONG = 0; static DANG_QUAY = 1; static KET_THUC = 2; }


  export class DEFINE_CHARACTER {
    static WILD = 0;
    static SCATTER = 1;
    static GORILLA = 2;
    static GIRL = 3;
    static TANK = 4;
    static PLANE = 5;
    static BOAT = 6;
    static CAR = 7;
    static TEN = 8;
    static J = 9;
    static Q = 10;
    static K = 11;
    static A = 12;
    static COIN = 13;

    static ANIM_CHARACTER = {
      [DEFINE_CHARACTER.WILD]: {
        z_index: 1,
        name: "WILD",
        anim_default_01: "sym_0",
        anim_default_02: "sym_0_2",
        anim_default_03: "sym_0_3",
        anim_default_04: "sym_0_4",
        anim_default_05: "sym_0_5",
        anim_default_06: "sym_0_6",
        anim_boom_01: "sym_0_boom",
        anim_boom_02: "sym_0_2_boom",
        anim_boom_03: "sym_0_3_boom",
        anim_boom_04: "sym_0_4_boom",
        anim_boom_05: "sym_0_5_boom",
        anim_boom_06: "sym_0_6_boom",
        anim_hit_01: "sym_0_hit",
        anim_hit_02: "sym_0_2_hit",
        anim_hit_03: "sym_0_3_hit",
        anim_hit_04: "sym_0_4_hit",
        anim_hit_05: "sym_0_5_hit",
        anim_hit_06: "sym_0_6_hit",
      },
      [DEFINE_CHARACTER.GORILLA]: {
        z_index: 1,
        name: "VAMPIRE",
        anim_default_01: "sym_1",
        anim_default_02: "sym_1_2",
        anim_default_03: "sym_1_3",
        anim_default_04: "sym_1_4",
        anim_default_05: "sym_1_5",
        anim_default_06: "sym_1_6",
        anim_boom_01: "sym_1_boom",
        anim_boom_02: "sym_1_2_boom",
        anim_boom_03: "sym_1_3_boom",
        anim_boom_04: "sym_1_4_boom",
        anim_boom_05: "sym_1_5_boom",
        anim_boom_06: "sym_1_6_boom",
        anim_golden_01: "sym_1_golden",
        anim_golden_02: "sym_1_2_golden",
        anim_golden_03: "sym_1_3_golden",
        anim_golden_04: "sym_1_4_golden",
        anim_golden_05: "sym_1_5_golden",
        anim_golden_06: "sym_1_6_golden",
        anim_goldenboom_01: "sym_1_golden_boom",
        anim_goldenboom_02: "sym_1_2_golden_boom",
        anim_goldenboom_03: "sym_1_3_golden_boom",
        anim_goldenboom_04: "sym_1_4_golden_boom",
        anim_goldenboom_05: "sym_1_5_golden_boom",
        anim_goldenboom_06: "sym_1_6_golden_boom",
      },
      [DEFINE_CHARACTER.GIRL]: {
        z_index: 1,
        name: "GIRL",
        anim_default_01: "sym_2",
        anim_default_02: "sym_2_2",
        anim_default_03: "sym_2_3",
        anim_default_04: "sym_2_4",
        anim_default_05: "sym_2_5",
        anim_default_06: "sym_2_6",
        anim_boom_01: "sym_2_boom",
        anim_boom_02: "sym_2_2_boom",
        anim_boom_03: "sym_2_3_boom",
        anim_boom_04: "sym_2_4_boom",
        anim_boom_05: "sym_2_5_boom",
        anim_boom_06: "sym_2_6_boom",
        anim_golden_01: "sym_2_golden",
        anim_golden_02: "sym_2_2_golden",
        anim_golden_03: "sym_2_3_golden",
        anim_golden_04: "sym_2_4_golden",
        anim_golden_05: "sym_2_5_golden",
        anim_golden_06: "sym_2_6_golden",
        anim_goldenboom_01: "sym_2_golden_boom",
        anim_goldenboom_02: "sym_2_2_golden_boom",
        anim_goldenboom_03: "sym_2_3_golden_boom",
        anim_goldenboom_04: "sym_2_4_golden_boom",
        anim_goldenboom_05: "sym_2_5_golden_boom",
        anim_goldenboom_06: "sym_2_6_golden_boom",
      },
      [DEFINE_CHARACTER.TANK]: {
        z_index: 1,
        name: "TANK",
        anim_default_01: "sym_3",
        anim_default_02: "sym_3_2",
        anim_default_03: "sym_3_3",
        anim_default_04: "sym_3_4",
        anim_default_05: "sym_3_5",
        anim_default_06: "sym_3_6",
        anim_boom_01: "sym_3_boom",
        anim_boom_02: "sym_3_2_boom",
        anim_boom_03: "sym_3_3_boom",
        anim_boom_04: "sym_3_4_boom",
        anim_boom_05: "sym_3_5_boom",
        anim_boom_06: "sym_3_6_boom",
        anim_golden_01: "sym_3_golden",
        anim_golden_02: "sym_3_2_golden",
        anim_golden_03: "sym_3_3_golden",
        anim_golden_04: "sym_3_4_golden",
        anim_golden_05: "sym_3_5_golden",
        anim_golden_06: "sym_3_6_golden",
        anim_goldenboom_01: "sym_3_golden_boom",
        anim_goldenboom_02: "sym_3_2_golden_boom",
        anim_goldenboom_03: "sym_3_3_golden_boom",
        anim_goldenboom_04: "sym_3_4_golden_boom",
        anim_goldenboom_05: "sym_3_5_golden_boom",
        anim_goldenboom_06: "sym_3_6_golden_boom",
      },
      [DEFINE_CHARACTER.PLANE]: {
        z_index: 1,
        name: "PLANE",
        anim_default_01: "sym_4",
        anim_default_02: "sym_4_2",
        anim_default_03: "sym_4_3",
        anim_default_04: "sym_4_4",
        anim_default_05: "sym_4_5",
        anim_default_06: "sym_4_6",
        anim_boom_01: "sym_4_boom",
        anim_boom_02: "sym_4_2_boom",
        anim_boom_03: "sym_4_3_boom",
        anim_boom_04: "sym_4_4_boom",
        anim_boom_05: "sym_4_5_boom",
        anim_boom_06: "sym_4_6_boom",
        anim_golden_01: "sym_4_golden",
        anim_golden_02: "sym_4_2_golden",
        anim_golden_03: "sym_4_3_golden",
        anim_golden_04: "sym_4_4_golden",
        anim_golden_05: "sym_4_5_golden",
        anim_golden_06: "sym_4_6_golden",
        anim_goldenboom_01: "sym_4_golden_boom",
        anim_goldenboom_02: "sym_4_2_golden_boom",
        anim_goldenboom_03: "sym_4_3_golden_boom",
        anim_goldenboom_04: "sym_4_4_golden_boom",
        anim_goldenboom_05: "sym_4_5_golden_boom",
        anim_goldenboom_06: "sym_4_6_golden_boom",
      },
      [DEFINE_CHARACTER.BOAT]: {
        z_index: 1,
        name: "BOAT",
        anim_default_01: "sym_5",
        anim_default_02: "sym_5_2",
        anim_default_03: "sym_5_3",
        anim_default_04: "sym_5_4",
        anim_default_05: "sym_5_5",
        anim_default_06: "sym_5_6",
        anim_boom_01: "sym_5_boom",
        anim_boom_02: "sym_5_2_boom",
        anim_boom_03: "sym_5_3_boom",
        anim_boom_04: "sym_5_4_boom",
        anim_boom_05: "sym_5_5_boom",
        anim_boom_06: "sym_5_6_boom",
        anim_golden_01: "sym_5_golden",
        anim_golden_02: "sym_5_2_golden",
        anim_golden_03: "sym_5_3_golden",
        anim_golden_04: "sym_5_4_golden",
        anim_golden_05: "sym_5_5_golden",
        anim_golden_06: "sym_5_6_golden",
        anim_goldenboom_01: "sym_5_golden_boom",
        anim_goldenboom_02: "sym_5_2_golden_boom",
        anim_goldenboom_03: "sym_5_3_golden_boom",
        anim_goldenboom_04: "sym_5_4_golden_boom",
        anim_goldenboom_05: "sym_5_5_golden_boom",
        anim_goldenboom_06: "sym_5_6_golden_boom",
      },
      [DEFINE_CHARACTER.CAR]: {
        z_index: 1,
        name: "CAR",
        anim_default_01: "sym_6",
        anim_default_02: "sym_6_2",
        anim_default_03: "sym_6_3",
        anim_default_04: "sym_6_4",
        anim_default_05: "sym_6_5",
        anim_default_06: "sym_6_6",
        anim_boom_01: "sym_6_boom",
        anim_boom_02: "sym_6_2_boom",
        anim_boom_03: "sym_6_3_boom",
        anim_boom_04: "sym_6_4_boom",
        anim_boom_05: "sym_6_5_boom",
        anim_boom_06: "sym_6_6_boom",
        anim_golden_01: "sym_6_golden",
        anim_golden_02: "sym_6_2_golden",
        anim_golden_03: "sym_6_3_golden",
        anim_golden_04: "sym_6_4_golden",
        anim_golden_05: "sym_6_5_golden",
        anim_golden_06: "sym_6_6_golden",
        anim_goldenboom_01: "sym_6_golden_boom",
        anim_goldenboom_02: "sym_6_2_golden_boom",
        anim_goldenboom_03: "sym_6_3_golden_boom",
        anim_goldenboom_04: "sym_6_4_golden_boom",
        anim_goldenboom_05: "sym_6_5_golden_boom",
        anim_goldenboom_06: "sym_6_6_golden_boom",
      },
      [DEFINE_CHARACTER.A]: {
        z_index: 1,
        name: "A",
        anim_default_01: "sym_7",
        anim_default_02: "sym_7_2",
        anim_default_03: "sym_7_3",
        anim_default_04: "sym_7_4",
        anim_default_05: "sym_7_5",
        anim_default_06: "sym_7_6",
        anim_boom_01: "sym_7_boom",
        anim_boom_02: "sym_7_2_boom",
        anim_boom_03: "sym_7_3_boom",
        anim_boom_04: "sym_7_4_boom",
        anim_boom_05: "sym_7_5_boom",
        anim_boom_06: "sym_7_6_boom",
        anim_golden_01: "sym_7_golden",
        anim_golden_02: "sym_7_2_golden",
        anim_golden_03: "sym_7_3_golden",
        anim_golden_04: "sym_7_4_golden",
        anim_golden_05: "sym_7_5_golden",
        anim_golden_06: "sym_7_6_golden",
        anim_goldenboom_01: "sym_7_golden_boom",
        anim_goldenboom_02: "sym_7_2_golden_boom",
        anim_goldenboom_03: "sym_7_3_golden_boom",
        anim_goldenboom_04: "sym_7_4_golden_boom",
        anim_goldenboom_05: "sym_7_5_golden_boom",
        anim_goldenboom_06: "sym_7_6_golden_boom",
      },
      [DEFINE_CHARACTER.K]: {
        z_index: 1,
        name: "K",
        anim_default_01: "sym_8",
        anim_default_02: "sym_8_2",
        anim_default_03: "sym_8_3",
        anim_default_04: "sym_8_4",
        anim_default_05: "sym_8_5",
        anim_default_06: "sym_8_6",
        anim_boom_01: "sym_8_boom",
        anim_boom_02: "sym_8_2_boom",
        anim_boom_03: "sym_8_3_boom",
        anim_boom_04: "sym_8_4_boom",
        anim_boom_05: "sym_8_5_boom",
        anim_boom_06: "sym_8_6_boom",
        anim_golden_01: "sym_8_golden",
        anim_golden_02: "sym_8_2_golden",
        anim_golden_03: "sym_8_3_golden",
        anim_golden_04: "sym_8_4_golden",
        anim_golden_05: "sym_8_5_golden",
        anim_golden_06: "sym_8_6_golden",
        anim_goldenboom_01: "sym_8_golden_boom",
        anim_goldenboom_02: "sym_8_2_golden_boom",
        anim_goldenboom_03: "sym_8_3_golden_boom",
        anim_goldenboom_04: "sym_8_4_golden_boom",
        anim_goldenboom_05: "sym_8_5_golden_boom",
        anim_goldenboom_06: "sym_8_6_golden_boom",
      },
      [DEFINE_CHARACTER.Q]: {
        z_index: 1,
        name: "Q",
        anim_default_01: "sym_9",
        anim_default_02: "sym_9_2",
        anim_default_03: "sym_9_3",
        anim_default_04: "sym_9_4",
        anim_default_05: "sym_9_5",
        anim_default_06: "sym_9_6",
        anim_boom_01: "sym_9_boom",
        anim_boom_02: "sym_9_2_boom",
        anim_boom_03: "sym_9_3_boom",
        anim_boom_04: "sym_9_4_boom",
        anim_boom_05: "sym_9_5_boom",
        anim_boom_06: "sym_9_6_boom",
        anim_golden_01: "sym_9_golden",
        anim_golden_02: "sym_9_2_golden",
        anim_golden_03: "sym_9_3_golden",
        anim_golden_04: "sym_9_4_golden",
        anim_golden_05: "sym_9_5_golden",
        anim_golden_06: "sym_9_6_golden",
        anim_goldenboom_01: "sym_9_golden_boom",
        anim_goldenboom_02: "sym_9_2_golden_boom",
        anim_goldenboom_03: "sym_9_3_golden_boom",
        anim_goldenboom_04: "sym_9_4_golden_boom",
        anim_goldenboom_05: "sym_9_5_golden_boom",
        anim_goldenboom_06: "sym_9_6_golden_boom",
      },
      [DEFINE_CHARACTER.J]: {
        z_index: 1,
        name: "J",
        anim_default_01: "sym_10",
        anim_default_02: "sym_10_2",
        anim_default_03: "sym_10_3",
        anim_default_04: "sym_10_4",
        anim_default_05: "sym_10_5",
        anim_default_06: "sym_10_6",
        anim_boom_01: "sym_10_boom",
        anim_boom_02: "sym_10_2_boom",
        anim_boom_03: "sym_10_3_boom",
        anim_boom_04: "sym_10_4_boom",
        anim_boom_05: "sym_10_5_boom",
        anim_boom_06: "sym_10_6_boom",
        anim_golden_01: "sym_10_golden",
        anim_golden_02: "sym_10_2_golden",
        anim_golden_03: "sym_10_3_golden",
        anim_golden_04: "sym_10_4_golden",
        anim_golden_05: "sym_10_5_golden",
        anim_golden_06: "sym_10_6_golden",
        anim_goldenboom_01: "sym_10_golden_boom",
        anim_goldenboom_02: "sym_10_2_golden_boom",
        anim_goldenboom_03: "sym_10_3_golden_boom",
        anim_goldenboom_04: "sym_10_4_golden_boom",
        anim_goldenboom_05: "sym_10_5_golden_boom",
        anim_goldenboom_06: "sym_10_6_golden_boom",
      },
      [DEFINE_CHARACTER.TEN]: {
        z_index: 1,
        name: "TEN",
        anim_default_01: "sym_11",
        anim_default_02: "sym_11_2",
        anim_default_03: "sym_11_3",
        anim_default_04: "sym_11_4",
        anim_default_05: "sym_11_5",
        anim_default_06: "sym_11_6",
        anim_boom_01: "sym_11_boom",
        anim_boom_02: "sym_11_2_boom",
        anim_boom_03: "sym_11_3_boom",
        anim_boom_04: "sym_11_4_boom",
        anim_boom_05: "sym_11_5_boom",
        anim_boom_06: "sym_11_6_boom",
        anim_golden_01: "sym_11_golden",
        anim_golden_02: "sym_11_2_golden",
        anim_golden_03: "sym_11_3_golden",
        anim_golden_04: "sym_11_4_golden",
        anim_golden_05: "sym_11_5_golden",
        anim_golden_06: "sym_11_6_golden",
        anim_goldenboom_01: "sym_11_golden_boom",
        anim_goldenboom_02: "sym_11_2_golden_boom",
        anim_goldenboom_03: "sym_11_3_golden_boom",
        anim_goldenboom_04: "sym_11_4_golden_boom",
        anim_goldenboom_05: "sym_11_5_golden_boom",
        anim_goldenboom_06: "sym_11_6_golden_boom",
      },
      [DEFINE_CHARACTER.SCATTER]: {
        z_index: 1,
        name: "SCATTER",
        anim_default_01: "sym_12",
        anim_default_02: "sym_12_2",
        anim_default_03: "sym_12_3",
        anim_default_04: "sym_12_4",
        anim_default_05: "sym_12_5",
        anim_default_06: "sym_12_6",
        anim_hit_01: "sym_12_hit",
        anim_hit_02: "sym_12_2_hit",
        anim_hit_03: "sym_12_3_hit",
        anim_hit_04: "sym_12_4_hit",
        anim_hit_05: "sym_12_5_hit",
        anim_hit_06: "sym_12_6_hit",
      },
      [DEFINE_CHARACTER.COIN]: {
        z_index: 1,
        name: "COIN",
        anim_default_01: "sym_13",
        anim_default_02: "sym_13_2",
        anim_default_03: "sym_13_3",
        anim_default_04: "sym_13_4",
        anim_default_05: "sym_13_5",
        anim_default_06: "sym_13_6",
        anim_boom_01: "sym_13_boom",
        anim_boom_02: "sym_13_2_boom",
        anim_boom_03: "sym_13_3_boom",
        anim_boom_04: "sym_13_4_boom",
        anim_boom_05: "sym_13_5_boom",
        anim_boom_06: "sym_13_6_boom",
        anim_hit_01: "sym_13_hit",
        anim_hit_02: "sym_13_2_hit",
        anim_hit_03: "sym_13_3_hit",
        anim_hit_04: "sym_13_4_hit",
        anim_hit_05: "sym_13_5_hit",
        anim_hit_06: "sym_13_6_hit",
      },
    };
  }

  export class SlotKKReceiveLogin extends BGUI.BaseInPacket {
    protected unpack(): void {}
  }

  // dang quay cho cuc scatter thu 3 thi 2 cuc truoc chay wait / co cuc thu 3 thi reward/ ko 2 cuc con lai la end
  //5002
  export class SlotReceiveGameInfo extends BGUI.BaseInPacket {
    public betAmount: number = 0;
    public currentMoney: number = 0;
    public freeGameResult: ImpFreeGame = null;

    protected unpack(): void {
      if (this.getError() != 0) {
        return;
      }
      
      this.betAmount = this.getLong();
      this.currentMoney = this.getLong();

      const activeFreeGame = this.getBool();
      if (activeFreeGame) {
        this.freeGameResult = {
          option: this.getByte(),
          currentRound: this.getByte(),
          totalRound: this.getByte(),
          totalPot: this.getLong(),
          multiple: this.getInt()
        };
      }
    }
  }

  //5014
  // export class SlotReceiveUserOut extends BGUI.BaseInPacket {
  //   public reason: number = null;
  //   public isOut: boolean = null;
  //   protected unpack(): void {
  //     this.reason = this.getByte();
  //     this.isOut = this.getBool();
  //   }
  // }

  //5003
  // export class SlotReceiveJackpotInfo extends BGUI.BaseInPacket {
  //   public betAmount: number = 0;
  //   public miniJackpot: number = 0;
  //   public minorJackpot: number = 0;
  //   public majorJackpot: number = 0;
  //   public grandJackpot: number = 0;

  //   protected unpack(): void {
  //     this.betAmount = this.getLong();
  //     this.miniJackpot = this.getLong();
  //     this.minorJackpot = this.getLong();
  //     this.majorJackpot = this.getLong();
  //     this.grandJackpot = this.getLong();
  //   }
  // }

  //5004
  /**
   * Type
   * 1: NORMAL_GAME
   * 3: FREE_GAME => Open select free game
   */
  export class SlotReceiveRoundResult extends BGUI.BaseInPacket {
    public betAmount: number = 0;
    public type: number = 0;
    public amountProfit: number = 0;
    public currentMoney: number = 0;
    public list: Array<Data> = [];

    protected unpack(): void {
      if (this.getError() != 0) {
        return;
      }
      this.type = this.getByte();
      this.betAmount = this.getLong();
      this.amountProfit = this.getLong();
      this.currentMoney = this.getLong();
      const listSize = this.getByte();
      for (let i = 0; i < listSize; i++) {
        let data: Data = {
          indexSize: -1,
          indexList: [],
          moneyWin: -1,
          hlSize: -1,
          hlArray: [],
          hlGoldSize: -1,
          hlGoldArray: [],
        };
        data.indexSize = this.getByte();
        if (data.indexSize > 0) {
          for (let i = 0; i < data.indexSize; i++) {
            data.indexList.push(this.getByte());
          }
        }
        data.moneyWin = this.getLong();
        data.hlSize = this.getByte();
        if (data.hlSize > 0) {
          for (let i = 0; i < data.hlSize; i++) {
            data.hlArray.push(this.getByte());
          }
        }
        data.hlGoldSize = this.getByte();
        if (data.hlGoldSize > 0) {
          for (let i = 0; i < data.hlGoldSize; i++) {
            data.hlGoldArray.push(this.getByte());
          }
        }
        this.list.push(data);
      }
    }
  }

  // Error:
  // 1: Không trừ được tiền
  // 2: Đang có freegame
  // 3: Đang có jackpot
  // 4: Đang có minigame (Các game slot khác sẽ có Satan k có)
  export class SlotReceiveBetFailed extends BGUI.BaseInPacket {
    public error: any = null;
    protected unpack(): void {
      this.error = this.getError();
    }
  }

  //5008
  // Error:
  // 1: Không có freegame
  // 2: Chưa chọn option cho free game
  // 3: Lượt quay hiện tại đang >= tổng số lượt quay
  // 4: Không có option đã chọn
  // 5: Chọn option đã trong freegame
  export class SlotReceiveFreeGameResult extends BGUI.BaseInPacket {
    public error: any = null;
    public multiple: any = null;
    public betAmount: number = 0;
    public option: number = 0;
    public currentRound: number = 0;
    public totalRound: number = 0;
    public totalPot: number = 0;
    public list: Array<Data> = [];
    public type: number = 0;
    public currentMoney: number = 0;
    public amountProfit: number = 0;

    protected unpack(): void {
      this.error = this.getError();
      if (this.getError() != 0) {
        this.betAmount = 0;
        this.option = 0;
        this.currentRound = 0;
        this.totalRound = 0;
        this.totalPot = 0;
        this.list = [];
        this.type = 0;
        this.currentMoney = 0;
        this.amountProfit = 0;
        return;
      }
      this.multiple = this.getInt();
      this.betAmount = this.getLong();
      this.option = this.getByte();
      this.currentRound = this.getByte();
      this.totalRound = this.getByte();
      this.totalPot = this.getLong();
      const listSize = this.getByte();
      for (let i = 0; i < listSize; i++) {
        let data: Data = {
          indexSize: -1,
          indexList: [],
          moneyWin: -1,
          hlSize: -1,
          hlArray: [],
          hlGoldSize: -1,
          hlGoldArray: [],
        };
        data.indexSize = this.getByte();
        if (data.indexSize > 0) {
          for (let i = 0; i < data.indexSize; i++) {
            data.indexList.push(this.getByte());
          }
        }
        data.moneyWin = this.getLong();
        data.hlSize = this.getByte();
        if (data.hlSize > 0) {
          for (let i = 0; i < data.hlSize; i++) {
            data.hlArray.push(this.getByte());
          }
        }
        data.hlGoldSize = this.getByte();
        if (data.hlGoldSize > 0) {
          for (let i = 0; i < data.hlGoldSize; i++) {
            data.hlGoldArray.push(this.getByte());
          }
        }
        this.list.push(data);
      }
      this.type = this.getByte();
      this.amountProfit = this.getLong();
      this.currentMoney = this.getLong();
    }
  }

  export class Send {
    public static sendSlotExitGame(roomId: number) {
      let pk = new SlotSendExitGame();
      pk.roomId = roomId;
      SlotKKConnector.instance.sendPacket(pk);
    }

    public static sendSlotJoinGame(betAmount = 0) {
      let pk = new SlotSendJoinGame();
      pk.betAmount = betAmount;
      SlotKKCommon.runLog(pk);
      SlotKKConnector.instance.sendPacket(pk);
    }

    public static sendSlotBet(betAmount: number) {
      let pk = new SlotSendBet();
      pk.betAmount = betAmount;
      SlotKKConnector.instance.sendPacket(pk);
    }

    public static sendOpenJackpot(index: number) {
      let pk = new SlotSendOpenJackpot();
      pk.index = index;
      SlotKKConnector.instance.sendPacket(pk);
    }

    public static sendSelectFreeGame(option: number) {
      let pk = new SlotSendSelectFreeGame();
      pk.option = option;
      SlotKKConnector.instance.sendPacket(pk);
    }

    public static sendStartFreeGame() {
      let pk = new SlotSendStartFreeGame();
      SlotKKConnector.instance.sendPacket(pk);
    }

    public static sendSlotLogin(nickname, accessToken) {
      let pk = new SendSlotLogin();
      pk.nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
      pk.accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
      SlotKKConnector.instance.sendPacket(pk);
    }

    public static sendSlotLoginByUrl(partner, accessToken, lang) {
      let pk = new SlotLoginByUrl();
      pk.appId = 11;
      pk.partner = partner;
      pk.accessToken = accessToken;
      pk.lang = lang;
      SlotKKConnector.instance.sendPacket(pk);
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
  export class SlotSendExitGame extends BGUI.BaseOutPacket {
    public roomId: number;
    getCmdId(): number {
      return Cmd.CMD_SLOT_EXITGAME;
    }
    putData(): void {
      this.putByte(this.roomId);
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

  //5006
  export class SlotSendOpenJackpot extends BGUI.BaseOutPacket {
    public index: number;
    getCmdId(): number {
      return Cmd.CMD_SLOT_JACKPOT_RESULT;
    }
    putData(): void {
      this.putByte(this.index);
    }
  }

  /** 5007
   * 1: OPTION_1 - total round 15
   * 2: OPTION_2 - total round 10
   * 3: OPTION_3 - total round 5
   * 4: OPTION_4 - total round random
   */
  export class SlotSendSelectFreeGame extends BGUI.BaseOutPacket {
    public option: number;
    getCmdId(): number {
      return Cmd.CMD_SLOT_SELECT_FREE_GAME;
    }
    putData(): void {
      this.putByte(this.option);
    }
  }

  export class SlotSendStartFreeGame extends BGUI.BaseOutPacket {
    getCmdId(): number {
      return Cmd.CMD_SLOT_FREE_GAME_RESULT;
    }
    putData(): void {
      // TODO
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
