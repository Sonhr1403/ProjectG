const { ccclass, property } = cc._decorator;
import { Slot50Cmd } from "./Slot50.Cmd";
import Slot50Controller from "./Slot50.Controller";
import { Slot50LanguageMgr } from "./Slot50.LanguageMgr";
import Slot50SoundControler, { SLOT_SOUND_TYPE } from "./Slot50.SoundControler";

@ccclass
export default class Slot50FreeGame extends cc.Component {

    public static instance: Slot50FreeGame = null;

    // @property(cc.Label)
    // public lbFreeBetAmount: cc.Label = null;

    // @property(cc.Label)
    // public lbFreeCurrentRound: cc.Label = null;

    // @property(cc.Label)
    // public lbFreeTotalRound: cc.Label = null;

    // @property(cc.Label)
    // public lbFreeTotalPot: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Slot50FreeGame.instance = this;
    }

    start() {
        // TODO
    }

    protected onClickSpinFree(arg, data) {
        Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
        switch (parseInt(data)) {
            case Slot50Cmd.FREE_GAME_OPTION.OPTION_3:
                Slot50Controller.instance.activeNodeTable(true);
                Slot50Cmd.Send.sendSelectFreeGame(Slot50Cmd.FREE_GAME_OPTION.OPTION_3);
                break;

            case Slot50Cmd.FREE_GAME_OPTION.OPTION_2:
                Slot50Controller.instance.activeNodeTable(true);
                Slot50Cmd.Send.sendSelectFreeGame(Slot50Cmd.FREE_GAME_OPTION.OPTION_2);
                break;

            case Slot50Cmd.FREE_GAME_OPTION.OPTION_1:
                Slot50Controller.instance.activeNodeTable(true);
                Slot50Cmd.Send.sendSelectFreeGame(Slot50Cmd.FREE_GAME_OPTION.OPTION_1);
                break;
        }
        this.activeFreeGame(false);
    }

    public activeFreeGame(isActive: boolean) {
        this.node.active = isActive;
    }

    public showFreeGame() {
        Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_SHOW_FREE_GAME);
        this.activeFreeGame(true);
        // this.lbFreeBetAmount.string = BGUI.Utils.formatMoneyWithCommaOnly(data.betAmount);
        // this.lbFreeTotalRound.string = BGUI.Utils.formatMoneyWithCommaOnly(data.totalRound);
        // this.lbFreeCurrentRound.string = BGUI.Utils.formatMoneyWithCommaOnly(data.currentRound);
        // this.lbFreeTotalPot.string = BGUI.Utils.formatMoneyWithCommaOnly(data.totalPot);
    }
}
