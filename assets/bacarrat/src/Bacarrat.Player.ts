import { Bacarrat_Const, IDataPlayer } from "./Bacarrat.Const";
import Bacarrat_GameManager from "./Bacarrat.GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bacarrat_Player extends cc.Component {

    @property(cc.Sprite)
    spAvatar: cc.Sprite = null;

    @property(cc.Label)
    lbMoney: cc.Label = null;

    @property(cc.Label)
    lbPlayerName: cc.Label = null;

    @property(sp.Skeleton)
    skeWin: sp.Skeleton = null;

    @property(cc.Label)
    lbWin: cc.Label = null;

    @property(cc.Node)
    nodeWin: cc.Node = null;

    _namePlayer = ''

    setPlayerInfo(dataPlayer: IDataPlayer) {
        this._namePlayer = dataPlayer.nickName;
        this.lbPlayerName.string = this.displayName(dataPlayer.displayName, 10);
        // if (dataPlayer.currentMoney < 1000000)
        //     this.lbMoney.string = BGUI.Utils.formatMoneyWithCommaOnly(dataPlayer.currentMoney);
        // else
        this.lbMoney.string = Bacarrat_Const.formatAlignNumberWithK(dataPlayer.currentMoney)

        if (dataPlayer.avatar.includes('http')) {
            Bacarrat_Const.loadImgFromUrl(this.spAvatar, dataPlayer.avatar)
        }
        else {
            this.spAvatar.spriteFrame = Bacarrat_GameManager.instance.spfAvatar;
        }

        this._showEffectActive();
    }

    private _showEffectActive() {
        this.node.active = true;
        this.node.stopAllActions();

        this.node.scale = 0;
        cc.tween(this.node)
            .to(0.3, { scale: 1 })
            .start();
    }

    leaveRoom() {
        this.node.stopAllActions();
        this.node.active = true;
        this.node.scale = 1;
        cc.tween(this.node)
            .to(0.3, { scale: 0 })
            .call(() => {
                this.lbPlayerName.string = '';
                this.node.active = false;
            })
            .start();
    }


    getNickName(): string {
        return this._namePlayer
    }

    showEffectGoldWin(goldWin: number) {
        BGUI.ZLog.log('showEffectGoldWin = ', goldWin)

        this.nodeWin.active = false;
        // this.lbWin.string = BGUI.Utils.formatMoneyWithCommaOnly(goldWin);
        this.lbWin.string = "+" + Bacarrat_Const.formatAlignNumberWithK(goldWin)
        this.nodeWin.stopAllActions();

        if (goldWin > 0) {
            // BGUI.UITextManager.showTextFly(this.node, BGUI.Utils.formatMoneyWithCommaOnly(goldWin), cc.Color.YELLOW)
            // this.skeWin.node.active = true;

            this.nodeWin.active = true;
            cc.tween(this.nodeWin)
                .delay(3)
                .call(() => {
                    this.nodeWin.active = false;
                })
                .start();
        }
    }

    displayName(name, maxLength) {
        if (name === undefined)
            return "";
        if (maxLength === undefined)
            maxLength = 18;
        name = name.trim();
        if (name.length > maxLength) {
            var newName = name.substr(0, maxLength);
            newName += "...";
        }
        else {
            newName = name;
        }
        return newName;
    }

    updateGold(total: number) {
        this.lbMoney.string = Bacarrat_Const.formatAlignNumberWithK(total)
    }

    cleanUp() {
        // this.skeWin.node.active = false;
    }
}
