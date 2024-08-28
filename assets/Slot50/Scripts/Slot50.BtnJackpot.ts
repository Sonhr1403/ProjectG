import { Slot50Cmd } from "./Slot50.Cmd";
import Slot50Common from "./Slot50.Common";
import Slot50Controller from "./Slot50.Controller";
import Slot50Jackpot from "./Slot50.Jackpot";
import { Slot50LanguageMgr } from "./Slot50.LanguageMgr";
import Slot50SoundControler, { SLOT_SOUND_TYPE } from "./Slot50.SoundControler";

export enum STEP_JACKPOT { SCATTER_IDLE = 0, REWARD = 1, IDLE = 2, OPEN = 3 };

const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot50BtnJackpot extends cc.Component {

    @property(sp.Skeleton)
    private skeletonJackpot: sp.Skeleton = null;

    ////////////////////
    private _index: number = 0;
    private skin = "Scatter";

    private defineSkinJackpot = {
        [Slot50Cmd.JACKPOT.MINI]: ["Jackpot_idle_mini", "Jackpot_open_mini", "Jackpot_reward_mini"],
        [Slot50Cmd.JACKPOT.MINOR]: ["Jackpot_idle_minor", "Jackpot_open_minor", "Jackpot_reward_minor"],
        [Slot50Cmd.JACKPOT.MAJOR]: ["Jackpot_idle_major", "Jackpot_open_major", "Jackpot_reward_major"],
        [Slot50Cmd.JACKPOT.GRAND]: ["Jackpot_idle_grand", "Jackpot_open_grand", "Jackpot_reward_grand"],
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
        if (!Slot50Controller.instance.isJackpotFinished) {
            Slot50Jackpot.instance.indexOfBtnJackpot = this.index;
            Slot50Cmd.Send.sendOpenJackpot(this.index);
        }
        // this.fakeData(this.index);
    }

    private fakeData(idx) {
        let res = new Slot50Cmd.SlotReceiveJackpotResult();
        res.miniJackpot = 987654321;
        res.minorJackpot = 87654321;
        res.majorJackpot = 654321;
        res.grandJackpot = 54321;
        res.data = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4];
        res.isFinished = true;
        res.idJackpot = Slot50Cmd.JACKPOT.MAJOR;
        res.nameJackpot = "MINOR";
        res.winMoney = 999999;
        res.currentMoney = 9898989898;
        Slot50Controller.instance.handleReceiveJackpotResult(res);
    }

    public setBtnJackpotTexture(typeJackPot: number, numberAppear: number) {
        this.skeletonJackpot.setSkin(this.skin);
        if (typeJackPot > 0) {
            if (numberAppear == 3) {
                this.skeletonJackpot.setAnimation(0, this.defineSkinJackpot[typeJackPot][2], false);
            } else {
                if (Slot50Jackpot.instance.indexOfBtnJackpot == this.index) {
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
