
import Bacarrat_Chip from "./Bacarrat.Chip";
import { Bacarrat_Const } from "./Bacarrat.Const";
import Bacarrat_GameManager from "./Bacarrat.GameManager";
import { SOUNDTYPE } from "./Bacarrat.SoundManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bacarrat_MyChipPot extends cc.Component {

    @property(Bacarrat_Chip)
    listMyChipPot: Array<Bacarrat_Chip> = [];

    @property(cc.ScrollView)
    scrollBet: cc.ScrollView = null

    @property(cc.Button)
    btn_pre: cc.Button = null

    @property(cc.Button)
    btn_next: cc.Button = null

    private _currentPercent = 0
    private _cPercent = 0;
    private _betValue: number = 0;

    onLoad() {
        this.listMyChipPot.forEach((e: Bacarrat_Chip, idx) => {
            if (e) {
                e.setLabelChip(idx);
                e.setSpriteChip(idx)
            }
        })
        let nodeFirst = this.listMyChipPot[0].node;
        this._showLight(nodeFirst, true);
        this._effShowButton(nodeFirst);
        this.setValueBet(Bacarrat_Const.CHIP_AMOUNT[0])

        this._cPercent = 1 / (this.scrollBet.content.childrenCount - 4);
        this.updateBtn()
    }

    setValueBet(value: number) {
        this._betValue = value;
    }

    getValueBet(): number {
        return this._betValue;
    }

    private _showLight(e: cc.Node, b: boolean) {
        e.getChildByName("bg_select").active = b;
    }

    private _effShowButton(e: cc.Node) {
        e.stopAllActions();
        e.runAction(cc.scaleTo(0.2, 1.2).easing(cc.easeBackInOut()))
    }

    onTouchButtonClick(e, custom) {
        BGUI.ZLog.log("button: ", e.target);
        this._handleButton(e.target);
    }

    _handleButton(button: cc.Node) {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        BGUI.ZLog.log("_handleButton ==========" + button.name);
        this.listMyChipPot.forEach((e: Bacarrat_Chip) => {
            if (e) {
                // e.node.setPosition(e.node.x, 0);
                e.node.scale = 1;
                this._showLight(e.node, false);
            }
        })
        // this.isAllIn = false;

        this._showLight(button, true);
        this._effShowButton(button)

        var numOfButton = Bacarrat_Const.CHIP_AMOUNT[parseInt(button.name)]
        if (button.name == "all_in") {
            // this.isAllIn = true;
            // var curGold = UserManager.instance.mainUserInfo.gold;
            // this.setValueBet(curGold);
        } else {
            // this.isAllIn = false;
            this.setValueBet(numOfButton);
        }

        BGUI.ZLog.log("My Choose Potttttt ====" + this.getValueBet());
    }

    eventScrollLeft() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK);
        this._currentPercent -= this._cPercent;
        if (this._currentPercent < 0)
            this._currentPercent = 0

        this.updateBtn()
        this.scrollBet.scrollToPercentHorizontal(this._currentPercent, .3);
    }

    eventScrollRight() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK);
        this._currentPercent += this._cPercent;
        if (this._currentPercent > 1)
            this._currentPercent = 1

        this.updateBtn()
        this.scrollBet.scrollToPercentHorizontal(this._currentPercent, .3);
    }

    updateBtn() {
        if (this._currentPercent === 0) {
            this.btn_pre.interactable = false
            this.btn_next.interactable = true
        }
        else if (this._currentPercent === 1) {
            this.btn_pre.interactable = true
            this.btn_next.interactable = false
        }
        else {
            this.btn_pre.interactable = true
            this.btn_next.interactable = true
        }
    }
}
