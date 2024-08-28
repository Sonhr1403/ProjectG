import { PandaCmd } from "./Panda.Cmd";
import PandaCommon from "./Panda.Common";
import PandaController from "./Panda.Controller";
import PandaJackpot from "./Panda.Jackpot";
import { PandaLanguageMgr } from "./Panda.LanguageMgr";
import PandaSoundControler, { SLOT_SOUND_TYPE } from "./Panda.SoundControler";

export enum STEP_JACKPOT { SCATTER_IDLE = 0, REWARD = 1, IDLE = 2, OPEN = 3 };

const { ccclass, property } = cc._decorator;

@ccclass
export default class PandaBtnJackpot extends cc.Component {

    @property(sp.Skeleton)
    private skeletonJackpot: sp.Skeleton = null;

    ////////////////////
    private _index: number = 0;
    public typeJackpot: number = -1;
    private skin = "Scatter";

    private defineSkinJackpot = {
        [PandaCmd.JACKPOT.MINI]: ["Jackpot_idle_mini", "Jackpot_open_mini", "Jackpot_reward_mini"],
        [PandaCmd.JACKPOT.MINOR]: ["Jackpot_idle_minor", "Jackpot_open_minor", "Jackpot_reward_minor"],
        [PandaCmd.JACKPOT.MAJOR]: ["Jackpot_idle_major", "Jackpot_open_major", "Jackpot_reward_major"],
        [PandaCmd.JACKPOT.GRAND]: ["Jackpot_idle_grand", "Jackpot_open_grand", "Jackpot_reward_grand"],
    };

    start() {
        // TODO
    }

    public get index(): number {
        return this._index;
    }

    public set index(index: number) {
        this._index = index;
    }

    protected onClickSendJackPot(arg) {
        if (!PandaController.instance.isJackpotFinished) {
            PandaJackpot.instance.indexOfBtnJackpot = this.index;
            PandaCmd.Send.sendOpenJackpot(this.index);
        }
        // this.fakeData(this.index);
    }

    private fakeData(idx) {
        let res = new PandaCmd.SlotReceiveJackpotResult();
        res.miniJackpot = 987654321;
        res.minorJackpot = 87654321;
        res.majorJackpot = 654321;
        res.grandJackpot = 54321;
        res.data = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4];
        res.isFinished = true;
        res.idJackpot = PandaCmd.JACKPOT.MAJOR;
        res.nameJackpot = "MINOR";
        res.winMoney = 999999;
        res.currentMoney = 9898989898;
        PandaController.instance.handleReceiveJackpotResult(res);
    }

    public setBtnJackpotTexture(typeJackPot: number, numberAppear: number) {
        this.skeletonJackpot.setSkin(this.skin);
        if (typeJackPot > 0) {
            this.typeJackpot = typeJackPot;
            if (numberAppear == 3) {
                this.skeletonJackpot.setAnimation(0, this.defineSkinJackpot[typeJackPot][2], false);
            } else {
                if (PandaJackpot.instance.indexOfBtnJackpot == this.index) {
                    this.skeletonJackpot.setAnimation(0, this.defineSkinJackpot[typeJackPot][1], false);
                } else {
                    this.skeletonJackpot.setAnimation(0, this.defineSkinJackpot[typeJackPot][0], false);
                }
            }
        } else {
            this.skeletonJackpot.setAnimation(0, "Scatter_idle", false);
        }
    }
}
