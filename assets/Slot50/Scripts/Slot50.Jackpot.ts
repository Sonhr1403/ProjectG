import Slot50BtnJackpot, { STEP_JACKPOT } from "./Slot50.BtnJackpot";
import { Slot50Cmd } from "./Slot50.Cmd";
import Slot50JackpotMoney from "./Slot50.JackpotMoney";
import { Slot50LanguageMgr } from "./Slot50.LanguageMgr";
import Slot50SoundControler, { SLOT_SOUND_TYPE } from "./Slot50.SoundControler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot50Jackpot extends cc.Component {
    public static instance: Slot50Jackpot = null;

    @property(cc.SpriteAtlas)
    public spriteAtlasJackpot: cc.SpriteAtlas = null;

    @property(cc.Prefab)
    public prfScatterJackpot: cc.Prefab = null;

    @property(cc.Node)
    public nIconMini: cc.Node = null;

    @property(cc.Node)
    public nIconMinor: cc.Node = null;

    @property(cc.Node)
    public nIconMajor: cc.Node = null;

    @property(cc.Node)
    public nIconGrand: cc.Node = null;

    @property(cc.Node)
    public nButtons: cc.Node = null;

    @property(cc.Prefab)
    public prfBtnJackpot: cc.Prefab = null;

    @property(cc.Node)
    public nMiniJackpot: cc.Node = null;
  
    @property(cc.Node)
    public nMinorJackpot: cc.Node = null;
  
    @property(cc.Node)
    public nMajorJackpot: cc.Node = null;
  
    @property(cc.Node)
    public nGrandJackpot: cc.Node = null;

    @property(cc.Prefab)
    public prfLbMoneyJackpot: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    private listPosBtn = [
        cc.v2(-250, 65), cc.v2(0, 65), cc.v2(250, 65),
        cc.v2(-375, -115), cc.v2(-125, -115), cc.v2(125, -115), cc.v2(375, -115),
        cc.v2(-500, -290), cc.v2(-250, -290), cc.v2(0, -290), cc.v2(250, -290), cc.v2(500, -290)
    ];
    private listPosScatterFly = {
        [Slot50Cmd.JACKPOT.MAJOR]: [cc.v3(200, 390, 0), cc.v3(147, 390, 0), cc.v3(95, 390, 0)],
        [Slot50Cmd.JACKPOT.MINI]: [cc.v3(200, 310, 0), cc.v3(147, 310, 0), cc.v3(95, 310, 0)],
        [Slot50Cmd.JACKPOT.GRAND]: [cc.v3(-200, 390, 0), cc.v3(-149, 390, 0), cc.v3(-95, 390, 0)],
        [Slot50Cmd.JACKPOT.MINOR]: [cc.v3(-200, 310, 0), cc.v3(-149, 310, 0), cc.v3(-95, 310, 0)],
    };
    private listDataBtn: Array<number> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    private listPosScatterJackpot = {
        [Slot50Cmd.JACKPOT.MAJOR]: [cc.v2(45, 0), cc.v2(-8, 0), cc.v2(-60, 0),],
        [Slot50Cmd.JACKPOT.GRAND]: [cc.v2(-45, 0), cc.v2(6, 0), cc.v2(60, 0),],
        [Slot50Cmd.JACKPOT.MINOR]: [cc.v2(-45, 0), cc.v2(6, 0), cc.v2(60, 0),],
        [Slot50Cmd.JACKPOT.MINI]: [cc.v2(45, 0), cc.v2(-8, 0), cc.v2(-60, 0),]
    };

    public indexOfBtnJackpot: number = -1;
    private numberOfMini: number = 0;
    private numberOfMinor: number = 0;
    private numberOfMajor: number = 0;
    private numberOfGrand: number = 0;

    onLoad() {
        Slot50Jackpot.instance = this;
        this.initTempLbJackpot();
        this.initTempIconJackpot();
    }

    start() {
        this.resetDataBtn();
        this.resetNewJackpot();
        this.activeJackpot(false);
    }

    private initTempLbJackpot() {
        this.nMiniJackpot.removeAllChildren();
        let lbMiniJackpot = cc.instantiate(this.prfLbMoneyJackpot);
        lbMiniJackpot.setAnchorPoint(1, 0.5);
        this.nMiniJackpot.addChild(lbMiniJackpot);

        this.nMinorJackpot.removeAllChildren();
        let lbMinorJackpot = cc.instantiate(this.prfLbMoneyJackpot);
        lbMinorJackpot.setAnchorPoint(0, 0.5);
        this.nMinorJackpot.addChild(lbMinorJackpot);

        this.nMajorJackpot.removeAllChildren();
        let lbMajorJackpot = cc.instantiate(this.prfLbMoneyJackpot);
        lbMajorJackpot.setAnchorPoint(1, 0.5);
        this.nMajorJackpot.addChild(lbMajorJackpot);

        this.nGrandJackpot.removeAllChildren();
        let lbGrandJackpot = cc.instantiate(this.prfLbMoneyJackpot);
        lbGrandJackpot.setAnchorPoint(0, 0.5);
        this.nGrandJackpot.addChild(lbGrandJackpot);
    }

    private initTempIconJackpot() {
        for (let key in this.listPosScatterJackpot) {
            let itemJackpot = this.listPosScatterJackpot[key];
            switch (parseInt(key)) {
                case Slot50Cmd.JACKPOT.MINI:
                    this.nIconMini.removeAllChildren();
                    for (let posIcon of itemJackpot) {
                        let nScatterJackpot = cc.instantiate(this.prfScatterJackpot);
                        nScatterJackpot.setPosition(posIcon);
                        this.nIconMini.addChild(nScatterJackpot);
                    }
                    break;

                case Slot50Cmd.JACKPOT.MINOR:
                    this.nIconMinor.removeAllChildren();
                    for (let posIcon of itemJackpot) {
                        let nScatterJackpot = cc.instantiate(this.prfScatterJackpot);
                        nScatterJackpot.setPosition(posIcon);
                        this.nIconMinor.addChild(nScatterJackpot);
                    }
                    break;

                case Slot50Cmd.JACKPOT.MAJOR:
                    this.nIconMajor.removeAllChildren();
                    for (let posIcon of itemJackpot) {
                        let nScatterJackpot = cc.instantiate(this.prfScatterJackpot);
                        nScatterJackpot.setPosition(posIcon);
                        this.nIconMajor.addChild(nScatterJackpot);
                    }
                    break;

                case Slot50Cmd.JACKPOT.GRAND:
                    this.nIconGrand.removeAllChildren();
                    for (let posIcon of itemJackpot) {
                        let nScatterJackpot = cc.instantiate(this.prfScatterJackpot);
                        nScatterJackpot.setPosition(posIcon);
                        this.nIconGrand.addChild(nScatterJackpot);
                    }
                    break;
            }
        }
    }

    private hideIconMiniJackpot() {
        for (let i = 0; i < 3; i++) {
            this.nIconMini.children[i].active = false;
        }
    }

    private hideIconMinorJackpot() {
        for (let i = 0; i < 3; i++) {
            this.nIconMinor.children[i].active = false;
        }
    }

    private hideIconMajorJackpot() {
        for (let i = 0; i < 3; i++) {
            this.nIconMajor.children[i].active = false;
        }
    }

    private hideIconGrandJackpot() {
        for (let i = 0; i < 3; i++) {
            this.nIconGrand.children[i].active = false;
        }
    }

    private resetNewJackpot() {
        this.hideIconMiniJackpot();
        this.hideIconMinorJackpot();
        this.hideIconMajorJackpot();
        this.hideIconGrandJackpot();
        this.numberOfMini = 0;
        this.numberOfMinor = 0;
        this.numberOfMajor = 0;
        this.numberOfGrand = 0;
    }

    private resetDataBtn() {
        this.listDataBtn = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    public activeJackpot(isActive: boolean) {
        this.node.active = isActive;
    }

    public initJackpot(res: Slot50Cmd.ImpJackpot) {
        this.activeJackpot(true);
        this.renderJackpot(res.data);
        this.nMiniJackpot.children[0].getComponent(Slot50JackpotMoney).init(res.jackpot.miniJackpot);
        this.nMinorJackpot.children[0].getComponent(Slot50JackpotMoney).init(res.jackpot.minorJackpot);
        this.nMajorJackpot.children[0].getComponent(Slot50JackpotMoney).init(res.jackpot.majorJackpot);
        this.nGrandJackpot.children[0].getComponent(Slot50JackpotMoney).init(res.jackpot.grandJackpot);
    }

    private renderJackpot(data: Array<number>) {
        this.resetNewJackpot();
        this.nButtons.removeAllChildren();
        this.listDataBtn = data;
        this.numberOfMini = this.listDataBtn.filter(i => i == Slot50Cmd.JACKPOT.MINI).length;
        this.numberOfMinor = this.listDataBtn.filter(i => i == Slot50Cmd.JACKPOT.MINOR).length;
        this.numberOfMajor = this.listDataBtn.filter(i => i == Slot50Cmd.JACKPOT.MAJOR).length;
        this.numberOfGrand = this.listDataBtn.filter(i => i == Slot50Cmd.JACKPOT.GRAND).length;
        const listNumberAppear = {
            [Slot50Cmd.JACKPOT.MINI]: this.numberOfMini,
            [Slot50Cmd.JACKPOT.MINOR]: this.numberOfMinor,
            [Slot50Cmd.JACKPOT.MAJOR]: this.numberOfMajor,
            [Slot50Cmd.JACKPOT.GRAND]: this.numberOfGrand,
        };

        for (let idx = 0; idx < 12; idx++) {
            let nBtnKJackpot = cc.instantiate(this.prfBtnJackpot);
            nBtnKJackpot.setPosition(this.listPosBtn[idx]);
            this.nButtons.addChild(nBtnKJackpot);
            let objBtnJacpot = nBtnKJackpot.getComponent(Slot50BtnJackpot);
            let numberAppear: number = (listNumberAppear[this.listDataBtn[idx]]) ? listNumberAppear[this.listDataBtn[idx]] : 0;
            objBtnJacpot.index = idx;
            objBtnJacpot.setBtnJackpotTexture(this.listDataBtn[idx], numberAppear);
        }

        //////////////////////
        if (this.numberOfMini > 0 && this.numberOfMini <= 3) {
            for (let i = 0; i < this.numberOfMini; i++) {
                this.nIconMini.children[i].active = true;
            }
        }
        if (this.numberOfMinor > 0 && this.numberOfMinor <= 3) {
            for (let j = 0; j < this.numberOfMinor; j++) {
                this.nIconMinor.children[j].active = true;
            }
        }
        if (this.numberOfMajor > 0 && this.numberOfMajor <= 3) {
            for (let h = 0; h < this.numberOfMajor; h++) {
                this.nIconMajor.children[h].active = true;
            }
        }
        if (this.numberOfGrand > 0 && this.numberOfGrand <= 3) {
            for (let k = 0; k < this.numberOfGrand; k++) {
                this.nIconGrand.children[k].active = true;
            }
        }
        if(Slot50Jackpot.instance.indexOfBtnJackpot >= 0) {
            this.handleFlyJackpot(this.listDataBtn[Slot50Jackpot.instance.indexOfBtnJackpot]);
        }
    }

    private handleFlyJackpot(typeJackPot: number, ) {
        let indexBtn: number = Slot50Jackpot.instance.indexOfBtnJackpot;
        switch (typeJackPot) {
            case Slot50Cmd.JACKPOT.MINI:
                this.flyIconJackpot(Slot50Cmd.JACKPOT.MINI, this.numberOfMini, indexBtn);
                break;

            case Slot50Cmd.JACKPOT.MINOR:
                this.flyIconJackpot(Slot50Cmd.JACKPOT.MINOR, this.numberOfMinor, indexBtn);
                break;

            case Slot50Cmd.JACKPOT.MAJOR:
                this.flyIconJackpot(Slot50Cmd.JACKPOT.MAJOR, this.numberOfMajor, indexBtn);
                break;

            case Slot50Cmd.JACKPOT.GRAND:
                this.flyIconJackpot(Slot50Cmd.JACKPOT.GRAND, this.numberOfGrand, indexBtn);
                break;
        }
    }

    private flyIconJackpot(typeJackPot: number, indexJackpot: number, indexBtn: number) {
        let newIdx = (indexJackpot > 0) ? (indexJackpot - 1) : 0;
        let nScatterJackpot = cc.instantiate(this.prfScatterJackpot);
        nScatterJackpot.setPosition(this.listPosBtn[indexBtn]);
        this.nButtons.addChild(nScatterJackpot);
        Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_FLY_COIN);
        cc.tween(nScatterJackpot).to(0.1, { position: this.listPosScatterFly[typeJackPot][newIdx] }).call(() => {
            this.showIconJackpot(typeJackPot, newIdx);
            nScatterJackpot.active = false;
            nScatterJackpot.removeFromParent();
        }).start();
    }

    private showIconJackpot(typeJackPot: number, indexJackpot: number) {
        switch (typeJackPot) {
            case Slot50Cmd.JACKPOT.MINI:
                this.nIconMini.children[indexJackpot].active = true;
                break;

            case Slot50Cmd.JACKPOT.MINOR:
                this.nIconMinor.children[indexJackpot].active = true;
                break;

            case Slot50Cmd.JACKPOT.MAJOR:
                this.nIconMajor.children[indexJackpot].active = true;
                break;

            case Slot50Cmd.JACKPOT.GRAND:
                this.nIconGrand.children[indexJackpot].active = true;
                break;
        }
    }

    public hidden() {
        this.activeJackpot(false);
    }
}
