import PandaCommon from "./Panda.Common";
import { PandaConnector } from "./Panda.Connector";
import { PandaLanguageMgr } from "./Panda.LanguageMgr";

export namespace PandaCmd {
  /// DATA_TYPE
  export enum Direction { UP = 1, DOWN = -1 }

  export interface ImpFreeGame { option: number, currentRound: number, totalRound: number, totalPot: number }

  export interface ImpJackpot { jackpot: { miniJackpot: number, minorJackpot: number, majorJackpot: number, grandJackpot: number }, data: Array<number>, }

  export interface ImpItemJackpot { miniJackpot: number, minorJackpot: number, majorJackpot: number, grandJackpot: number }

  export interface ImpItemCell { index: number, id: number, oldId: number, highlight: boolean, isChange: boolean }

  export interface ImpColumn { list: Array<PandaCmd.ImpItemCell>, itemFrame: ImpFrame, }

  export interface ImpFrame { column: number, totalScratter: number, typeFree: number, listWild: Array<number>, speedUp: number; };

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
    static CMD_SLOT_EXITGAME = 5002;
    static CMD_SLOT_KICK_OUT = 5014;
  }

  export class TYPE_WIN { static BIG_WIN = 1; static MEGA_WIN = 2; static ULTRA_WIN = 3; static EPIC_WIN = 4; }
  export class JACKPOT { static MINI = 1; static MINOR = 2; static MAJOR = 3; static GRAND = 4; }
  export class ROUND_RESULT_TYPE { static LINE_WIN = 1; static JACKPOT = 2; static FREE_GAME = 3; }
  export class FREE_GAME_OPTION { static OPTION_0 = 0; static OPTION_1 = 1; static OPTION_2 = 2; static OPTION_3 = 3; }
  export class FREE_GAME_ROUND { static OPTION_1 = 20; static OPTION_2 = 10; static OPTION_3 = 5; }
  export class STATE_OF_SPIN { static KHOI_DONG = 0; static DANG_QUAY = 1; static KET_THUC = 2; }
  export class DEFINE_CHARACTOR {
    static JACKPOT = 1;
    static SCATTER = 2;
    static WILD = 3;
    static RED_SATAN = 4;
    static BLUE_SATAN = 5;
    static GREEN_SATAN = 6;
    static HEADPHONES = 7;
    static CAP = 8;
    static GLASSES = 9;
    static HEART = 10;
    static DIAMOND = 11;
    static SPADE = 12;
    static CLUB = 13;
    static SPRITE_CHARACTOR = {
      [DEFINE_CHARACTOR.JACKPOT]: { name: "JACKPOT", sprite: "slot_scatter " },
      [DEFINE_CHARACTOR.SCATTER]: { name: "SCATTER", sprite: "slot_scatter " },
      [DEFINE_CHARACTOR.WILD]: { name: "WILD", sprite: "slot_wolf" },
      [DEFINE_CHARACTOR.BLUE_SATAN]: { name: "BLUE_SATAN", sprite: "slot_vampire" },
      [DEFINE_CHARACTOR.GREEN_SATAN]: { name: "GREEN_SATAN", sprite: "slot_frankenstein" },
      [DEFINE_CHARACTOR.RED_SATAN]: { name: "RED_SATAN", sprite: "slot_mummy" },
      [DEFINE_CHARACTOR.HEADPHONES]: { name: "HEADPHONES", sprite: "slot_speaker" },
      [DEFINE_CHARACTOR.CAP]: { name: "CAP", sprite: "slot_micro" },
      [DEFINE_CHARACTOR.GLASSES]: { name: "GLASSES", sprite: "slot_disco_ball" },
      [DEFINE_CHARACTOR.HEART]: { name: "HEART", sprite: "slot_co" },
      [DEFINE_CHARACTOR.DIAMOND]: { name: "DIAMOND", sprite: "slot_ro" },
      [DEFINE_CHARACTOR.SPADE]: { name: "SPADE", sprite: "slot_tep" },
      [DEFINE_CHARACTOR.CLUB]: { name: "CLUB", sprite: "slot_bich" },
    };

    static ANIM_CHARACTOR = {
      [DEFINE_CHARACTOR.JACKPOT]: {
        z_index: 1,
        name: "JACKPOT",
        skin: null,
        anim_default: null,
        anim_spin: null,
        anim_stop_spin: null,
        anim_highlight: null,
        anim_free: null,
        skin_change: null,
        anim_change: null
      },
      [DEFINE_CHARACTOR.SCATTER]: {
        z_index: 1,
        name: "SCATTER",
        skin: "Scatter",
        anim_default: "Scatter_idle",
        anim_spin: "Spin",
        anim_stop_spin: "Spin_stop",
        anim_highlight: "Scatter_idle",
        anim_free: "Scatter_reward",
        skin_change: "Scatter",
        anim_change: "Scatter_idle"
      },
      [DEFINE_CHARACTOR.WILD]: {
        z_index: 2,
        name: "WILD",
        skin: "Wolf",
        anim_default: "Default",
        anim_spin: "Spin",
        anim_stop_spin: "Spin_stop",
        anim_highlight: "Default",
        anim_free: "wolf_reward",
        skin_change: "Wolf",
        anim_change: "wolf_reward"
      },
      [DEFINE_CHARACTOR.BLUE_SATAN]: {
        z_index: 1,
        name: "BLUE_SATAN",
        skin: "Vampire",
        anim_default: "Default",
        anim_spin: "Spin",
        anim_stop_spin: "Spin_stop",
        anim_highlight: "Hang_3",
        anim_free: "Hang_3",
        skin_change: "Vampire_gold",
        anim_change: "Hang_3_Gold_transform",
        anim_change_1: "Hang_3_Gold"
      },
      [DEFINE_CHARACTOR.GREEN_SATAN]: {
        z_index: 1,
        name: "GREEN_SATAN",
        skin: "Frankenstein",
        anim_default: "Default",
        anim_spin: "Spin",
        anim_stop_spin: "Spin_stop",
        anim_highlight: "Hang_3",
        anim_free: "Hang_3",
        skin_change: "Frankenstein_gold",
        anim_change: "Hang_3_Gold_transform",
        anim_change_1: "Hang_3_Gold"
      },
      [DEFINE_CHARACTOR.RED_SATAN]: {
        z_index: 1,
        name: "RED_SATAN",
        skin: "Mummy",
        anim_default: "Default",
        anim_spin: "Spin",
        anim_stop_spin: "Spin_stop",
        anim_highlight: "Hang_3",
        anim_free: "Hang_3",
        skin_change: "Mummy_gold",
        anim_change: "Hang_3_Gold_transform",
        anim_change_1: "Hang_3_Gold"
      },
      [DEFINE_CHARACTOR.HEADPHONES]: {
        z_index: 1,
        name: "HEADPHONES",
        skin: "Speaker",
        anim_default: "Default",
        anim_spin: "Spin",
        anim_stop_spin: "Spin_stop",
        anim_highlight: "Hang_1",
        anim_free: "Hang_1",
        skin_change: null,
        anim_change: null
      },
      [DEFINE_CHARACTOR.CAP]: {
        z_index: 1,
        name: "CAP",
        skin: "Micro",
        anim_default: "Default",
        anim_spin: "Spin",
        anim_stop_spin: "Spin_stop",
        anim_highlight: "Hang_1",
        anim_free: "Hang_1",
        skin_change: null,
        anim_change: null
      },
      [DEFINE_CHARACTOR.GLASSES]: {
        z_index: 1,
        name: "GLASSES",
        skin: "Disco_ball",
        anim_default: "Default",
        anim_spin: "Spin",
        anim_stop_spin: "Spin_stop",
        anim_highlight: "Hang_1",
        anim_free: "Hang_1",
        skin_change: null,
        anim_change: null
      },
      [DEFINE_CHARACTOR.HEART]: {
        z_index: 1,
        name: "HEART",
        skin: "Co",
        anim_spin: "Spin",
        anim_default: "Default",
        anim_stop_spin: "Spin_stop",
        anim_highlight: "Hang_2",
        anim_free: "Hang_2",
        skin_change: null,
        anim_change: null
      },
      [DEFINE_CHARACTOR.DIAMOND]: {
        z_index: 1,
        name: "DIAMOND",
        skin: "Ro",
        anim_default: "Default",
        anim_spin: "Spin",
        anim_stop_spin: "Spin_stop",
        anim_highlight: "Hang_2",
        anim_free: "Hang_2",
        skin_change: null,
        anim_change: null
      },
      [DEFINE_CHARACTOR.SPADE]: {
        z_index: 1,
        name: "SPADE",
        skin: "Tep",
        anim_default: "Default",
        anim_spin: "Spin",
        anim_stop_spin: "Spin_stop",
        anim_highlight: "Hang_2",
        anim_free: "Hang_2",
        skin_change: null,
        anim_change: null
      },
      [DEFINE_CHARACTOR.CLUB]: {
        z_index: 1,
        name: "CLUB",
        skin: "Bich",
        anim_default: "Default",
        anim_spin: "Spin",
        anim_stop_spin: "Spin_stop",
        anim_highlight: "Hang_2",
        anim_free: "Hang_2",
        skin_change: null, 
        anim_change: null
      },
    };

    static ANIM_SCATTER = {
      z_index: 1,
      name: "SCATTER",
      skin: "Scatter",
      anim_default: "Scatter_idle",
      anim_spin: "Spin",
      anim_stop_spin: "Spin_stop",
      anim_highlight: "Scatter_idle",
      anim_free: "Scatter_reward",
      skin_change: "Scatter",
      anim_2_wait: "Scatter_wait",
      anim_2_end: "Scatter_end",
      anim_3: "Scatter_reward",
    }
  };
  // dang quay cho cuc scatter thu 3 thi 2 cuc truoc chay wait / co cuc thu 3 thi reward/ ko 2 cuc con lai la end
  //5002
  export class SlotReceiveGameInfo extends BGUI.BaseInPacket {
    public betAmount: number = 0;
    public miniJackpot: number = 0;
    public minorJackpot: number = 0;
    public majorJackpot: number = 0;
    public grandJackpot: number = 0;
    public currentMoney: number = 0;
    // slotData: JACKPOT
    public jackpotResult: { miniJackpot: number, minorJackpot: number, majorJackpot: number, grandJackpot: number, slotData: number[] } = null;
    // option: FREE_GAME_OPTION / FREE_GAME_ROUND
    public freeGameResult: ImpFreeGame = null;

    protected unpack(): void {
      this.betAmount = this.getLong();
      this.currentMoney = this.getLong();
      this.miniJackpot = this.getLong();
      this.minorJackpot = this.getLong();
      this.majorJackpot = this.getLong();
      this.grandJackpot = this.getLong();

      const activeJackpot = this.getBool();
      if (activeJackpot) {
        this.jackpotResult = {
          miniJackpot: this.getLong(),
          minorJackpot: this.getLong(),
          majorJackpot: this.getLong(),
          grandJackpot: this.getLong(),
          slotData: [],
        }
        const slotDataSize = this.getShort();
        for (let i = 0; i < slotDataSize; i++) {
          this.jackpotResult.slotData.push(this.getByte());
        }
      }

      const activeFreeGame = this.getBool();
      if (activeFreeGame) {
        this.freeGameResult = {
          option: this.getByte(),
          currentRound: this.getByte(),
          totalRound: this.getByte(),
          totalPot: this.getLong(),
        }
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
    public miniJackpot: number = 0;
    public minorJackpot: number = 0;
    public majorJackpot: number = 0;
    public grandJackpot: number = 0;

    protected unpack(): void {
      this.betAmount = this.getLong();
      this.miniJackpot = this.getLong();
      this.minorJackpot = this.getLong();
      this.majorJackpot = this.getLong();
      this.grandJackpot = this.getLong();
    }
  }

  //5004
  /**
   * Type
   * 1: LINE_WIN
   * 2: JACKPOT => Open jackpot
   * 3: FREE_GAME => Open select free game
   */
  export class SlotReceiveRoundResult extends BGUI.BaseInPacket {
    public betAmount: number = 0;
    // DEFINE_CHARACTOR
    public result: Array<ImpItemCell> = [];
    public type: number = 0;
    public amountProfit: number = 0;
    public currentMoney: number = 0;
    public miniJackpot: number = 0;
    public minorJackpot: number = 0;
    public majorJackpot: number = 0;
    public grandJackpot: number = 0;

    protected unpack(): void {
      if (this.getError() != 0) {
        return;
      }
      this.betAmount = this.getLong();
      const dataSize = this.getByte();
      for (let i = 0; i < dataSize; i++) {
        this.result.push({
          index: i,
          id: this.getByte(),
          oldId: -1,
          highlight: this.getBool(),
          isChange: false
        });
      }
      this.type = this.getByte();
      this.amountProfit = this.getLong();
      this.currentMoney = this.getLong();
      if (this.type == ROUND_RESULT_TYPE.JACKPOT) {
        this.miniJackpot = this.getLong();
        this.minorJackpot = this.getLong();
        this.majorJackpot = this.getLong();
        this.grandJackpot = this.getLong();
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

  /**
   * When finished true have result open Jackpot
   */
  export class SlotReceiveJackpotResult extends BGUI.BaseInPacket {
    public miniJackpot: number = 0;
    public minorJackpot: number = 0;
    public majorJackpot: number = 0;
    public grandJackpot: number = 0;
    public data: Array<number> = [];   /** * 1: MINI * 2: MINOR * 3: MAJOR * 4: GRAND */
    public isFinished: boolean = false;
    public idJackpot: number = 0; /** * 1: MINI * 2: MINOR * 3: MAJOR * 4: GRAND */
    public nameJackpot: string = "";
    public winMoney: number = 0;
    public currentMoney: number = 0;

    protected unpack(): void {
      if (this.getError() != 0) {
        return;
      }
      this.miniJackpot = this.getLong();
      this.minorJackpot = this.getLong();
      this.majorJackpot = this.getLong();
      this.grandJackpot = this.getLong();
      const dataSize = this.getShort();
      for (let i = 0; i < dataSize; i++) {
        this.data.push(this.getByte());
      }
      this.isFinished = this.getBool();
      if (this.isFinished) {
        this.idJackpot = this.getByte();
        this.nameJackpot = this.getString();
        this.winMoney = this.getLong();
        this.currentMoney = this.getLong();
      }
    }
  }

  //5008
  // Error:
  // 1: Không có freegame
  // 2: Chưa chọn option cho free game
  // 3: Lượt quay hiện tại đang >= tổng số lượt quay
  // 4: Không có option đã chọn
  export class SlotReceiveFreeGameResult extends BGUI.BaseInPacket {
    public error: any = null;
    public betAmount: number = 0;
    public option: number = 0;
    public currentRound: number = 0;
    public totalRound: number = 0;
    public totalPot: number = 0;
    public result: Array<ImpItemCell> = [];
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
        this.result = [];
        this.type = 0;
        this.currentMoney = 0;
        this.amountProfit = 0;
        return;
      }
      this.betAmount = this.getLong();
      this.option = this.getByte();
      this.currentRound = this.getByte(); // 8
      this.totalRound = this.getByte(); // 20
      this.totalPot = this.getLong(); // Tông tiền thắng của free
      // oldId 0 is not change
      const dataSize = this.getByte();
      for (let i = 0; i < dataSize; i++) {
        let itemResult = {
          index: i,
          id: this.getByte(),
          oldId: this.getByte(),
          highlight: this.getBool(),
          isChange: false
        };
        this.result.push(itemResult);
      }
      // thay thế icon
      this.type = this.getByte();
      this.amountProfit = this.getLong();
      this.currentMoney = this.getLong();
    }
  }

  export class Send {
    public static sendSlotExitGame(roomId: number) {
      let pk = new PandaCmd.SlotSendExitGame();
      pk.roomId = roomId;
      PandaConnector.instance.sendPacket(pk);
    }

    public static sendSlotJoinGame(betAmount = 0) {
      let pk = new PandaCmd.SlotSendJoinGame();
      pk.betAmount = betAmount;
      PandaConnector.instance.sendPacket(pk);
    }

    public static sendSlotBet(betAmount: number) {
      console.error("SLOT_50 SEND", new Date().toLocaleString(), new Date().getMilliseconds());
      let pk = new PandaCmd.SlotSendBet();
      pk.betAmount = betAmount;
      PandaConnector.instance.sendPacket(pk);
    }

    public static sendOpenJackpot(index: number) {
      let pk = new PandaCmd.SlotSendOpenJackpot();
      pk.index = index;
      PandaConnector.instance.sendPacket(pk);
    }

    public static sendSelectFreeGame(option: number) {
      let pk = new PandaCmd.SlotSendSelectFreeGame();
      pk.option = option;
      PandaConnector.instance.sendPacket(pk);
    }

    public static sendStartFreeGame() {
      let pk = new PandaCmd.SlotSendStartFreeGame();
      PandaConnector.instance.sendPacket(pk);
    }

    public static sendSlotLogin(nickname, accessToken) {
      let pk = new SendSlotLogin();
      pk.nickName = BGUI.UserManager.instance.mainUserInfo.nickname;
      pk.accessToken = BGUI.UserManager.instance.mainUserInfo.accessToken;
      PandaConnector.instance.sendPacket(pk);
    }

    public static sendSlotLoginByUrl(partner, accessToken, lang) {
      let pk = new SlotLoginByUrl();
      pk.appId = 11;
      pk.partner = partner;
      pk.accessToken = accessToken;
      pk.lang = lang;
      PandaConnector.instance.sendPacket(pk);
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

  //5002
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

  /**
   * 1: OPTION_1 - total round 20
   * 2: OPTION_2 - total round 10
   * 3: OPTION_3 - total round 5
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
