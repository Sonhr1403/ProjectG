import DragonTiger_Chip from "./DragonTiger.Chip";
import { DragonTiger_Const } from "./DragonTiger.Const";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonTiger_MyChipPot extends cc.Component {

    @property(DragonTiger_Chip)
    listMyChipPot: Array<DragonTiger_Chip> = [];

    private _betValue: number = 0;

    onLoad() {
        this.listMyChipPot.forEach((e: DragonTiger_Chip, idx) => {
            if (e) {
                e.setLabelChip(idx);
                e.setSpriteChip(idx)
            }
        })
        let nodeFirst = this.listMyChipPot[0].node;
        this._showLight(nodeFirst, true);
        this._effShowButton(nodeFirst.parent);
        this.setValueBet(DragonTiger_Const.CHIP_AMOUNT[0])
    }

    setValueBet(value: number) {
        this._betValue = value;
    }

    getValueBet(): number {
        return this._betValue;
    }

    private _showLight(node: cc.Node, isActice: boolean) {
        node.parent.getChildByName('highlight').active = isActice
    }

    private _effShowButton(e: cc.Node) {
        e.stopAllActions();
        cc.tween(e)
            .to(0.2, { y: 20 })
            .start()
    }

    onTouchButtonClick(e, data) {
        if (this._betValue === DragonTiger_Const.CHIP_AMOUNT[parseInt(data)])
            return;

        BGUI.ZLog.log("button: ", e.target);
        this._handleButton(e.target, data);
    }

    _handleButton(button: cc.Node, data) {
        //  DragonTiger_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        BGUI.ZLog.log("_handleButton ==========" + data);
        this.listMyChipPot.forEach((e: DragonTiger_Chip) => {
            if (e) {
                // e.node.setPosition(e.node.x, 0);
                e.node.parent.y = 0;
                this._showLight(e.node, false)
            }
        })

        this._showLight(button, true);
        this._effShowButton(button.parent)

        var numOfButton = DragonTiger_Const.CHIP_AMOUNT[parseInt(data)]
        this.setValueBet(numOfButton);

        BGUI.ZLog.log("My Choose Potttttt ====" + this.getValueBet());
    }
}
