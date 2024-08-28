import { DragonTiger_Const } from "./DragonTiger.Const";
import DragonTiger_GameManager from "./DragonTiger.GameManager";
import { SOUNDTYPE } from "./DragonTiger.SoundManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonTiger_Chip extends cc.Component {

    @property(cc.Label)
    lbGold: cc.Label = null;

    //ux
    private _chipIdx: number = -1;
    private _typePot: number = -1; //cửa đặt
    // private _slotIdx: number = -1;

    setData(chipIdx: number, typePot: number) {
        // BGUI.ZLog.log("idxChip === " + chipIdx);
        // this._slotIdx = slotIdx;
        this._chipIdx = chipIdx;
        this._typePot = typePot;

        this.setSpriteChip(chipIdx);
        this.setLabelChip(chipIdx);
    }

    setLabelChip(chipIdx: number) {
        // BGUI.ZLog.log("setLabelChip === " + amount);
        this.lbGold.string = DragonTiger_Const.formatAlignNumberWithK(DragonTiger_Const.CHIP_AMOUNT[chipIdx]);
    }

    getAmountChip() {
        return DragonTiger_Const.CHIP_AMOUNT[this._chipIdx];
    }


    setSpriteChip(chipIdx: number) {
        this.node.getComponent(cc.Sprite).spriteFrame = DragonTiger_GameManager.instance.chipManager.spfChip[chipIdx]
    }

    getIdxChip(): number {
        return this._chipIdx;
    }

    getTypePot(): number {
        return this._typePot;
    }

    // getIdxSlot(): number {
    //     return this._slotIdx;
    // }

    moveToPos(from: cc.Vec2, to: cc.Vec2) {
        // this.lbGold.node.active = false;
        this.node.setPosition(from);
        // this.node.stopAllActions();

        var actMove = cc.moveTo(0.5, to).easing(cc.easeSineIn());
        var sound = cc.callFunc(() => {
            DragonTiger_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.BET);
        })
        var seq = cc.sequence(actMove, sound);
        this.node.runAction(seq);
    }

    moveToPotWin(from: cc.Vec2, to: cc.Vec2) {
        // this.lbGold.node.active = false;
        this.node.setPosition(from);
        // this.node.stopAllActions();

        var actMove = cc.moveTo(0.5, to).easing(cc.easeSineIn());
        var sound = cc.callFunc(() => {
            // DragonTiger_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.RUNMONEY);
            // // SystemUIManager.instance.playSound(eSound.bet);
            // this.node.removeFromParent();
            // cc.removeSelf();
            //  DragonTiger_GameManager.instance.chipManager.mergeChip();
        })
        var seq = cc.sequence(actMove, sound);
        this.node.runAction(seq);
    }


    actionMoveChipToDealer(from: cc.Vec2, to: cc.Vec2) {
        this.lbGold.node.active = false;
        this.node.setPosition(from);
        this.node.stopAllActions();
        var self = this;
        var actRemove = cc.callFunc(function () {
            self.node.removeFromParent();
        })
        var actMove = cc.moveTo(0.5, to).easing(cc.easeOut(1));
        var delay = cc.delayTime(0.2);
        var sound = cc.callFunc(function () {

        })
        var seq = cc.sequence(actMove, sound, delay, actRemove);
        this.node.runAction(seq);
    }

    actionMoveChipToSlot(from: cc.Vec2, to: cc.Vec2, callBack: Function = null) {
        this.lbGold.node.active = false;
        this.node.setPosition(from);
        this.node.stopAllActions();
        var self = this;
        var actRemove = cc.callFunc(function () {
            self.node.removeFromParent();
        });
        var actCallback = cc.callFunc(function () {
            callBack && callBack();
        })
        var sound = cc.callFunc(function () {

        })
        var actMove = cc.moveTo(0.5, to).easing(cc.easeBackOut())
        var delay = cc.delayTime(0.2);
        var seq = cc.sequence(actMove, sound, delay, actRemove, actCallback);
        this.node.runAction(seq);
    }

    destroyChip() {
        this.node.destroy();
    }


}
