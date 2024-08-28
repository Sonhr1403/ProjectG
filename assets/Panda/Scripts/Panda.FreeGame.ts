const { ccclass, property } = cc._decorator;
import { PandaCmd } from "./Panda.Cmd";
import PandaController from "./Panda.Controller";
import { PandaLanguageMgr } from "./Panda.LanguageMgr";
import PandaSoundControler, { SLOT_SOUND_TYPE } from "./Panda.SoundControler";

@ccclass
export default class PandaFreeGame extends cc.Component {

    public static instance: PandaFreeGame = null;

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
        PandaFreeGame.instance = this;
    }

    start() {
        // TODO
    }

    protected onClickSpinFree(arg, data) {
        PandaSoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
        switch (parseInt(data)) {
            case PandaCmd.FREE_GAME_OPTION.OPTION_3:
                PandaController.instance.activeNodeTable(true);
                PandaCmd.Send.sendSelectFreeGame(PandaCmd.FREE_GAME_OPTION.OPTION_3);
                break;

            case PandaCmd.FREE_GAME_OPTION.OPTION_2:
                PandaController.instance.activeNodeTable(true);
                PandaCmd.Send.sendSelectFreeGame(PandaCmd.FREE_GAME_OPTION.OPTION_2);
                break;

            case PandaCmd.FREE_GAME_OPTION.OPTION_1:
                PandaController.instance.activeNodeTable(true);
                PandaCmd.Send.sendSelectFreeGame(PandaCmd.FREE_GAME_OPTION.OPTION_1);
                break;
        }
        this.activeFreeGame(false);
    }

    public activeFreeGame(isActive: boolean) {
        this.node.active = isActive;
    }

    public showFreeGame() {
        PandaSoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_SHOW_FREE_GAME);
        this.activeFreeGame(true);
        // this.lbFreeBetAmount.string = BGUI.Utils.formatMoneyWithCommaOnly(data.betAmount);
        // this.lbFreeTotalRound.string = BGUI.Utils.formatMoneyWithCommaOnly(data.totalRound);
        // this.lbFreeCurrentRound.string = BGUI.Utils.formatMoneyWithCommaOnly(data.currentRound);
        // this.lbFreeTotalPot.string = BGUI.Utils.formatMoneyWithCommaOnly(data.totalPot);
    }
}
