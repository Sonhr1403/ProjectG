import { DragonTiger_Const } from "./DragonTiger.Const";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonTiger_PotOnTableManager extends cc.Component {

    @property(cc.Node)
    listNodeLight: Array<cc.Node> = [];

    // @property(cc.Label)
    // listLabelMyBet: Array<cc.Label> = [];

    // @property(cc.Node)
    // nFrameWin: Array<cc.Node> = [];

    @property(cc.Label)
    listLabelTotalBet: Array<cc.Label> = [];
    @property(cc.Label)
    listLabelMyBet: Array<cc.Label> = [];




    onLoad() {
        this._hideAllLight()

        this.listLabelTotalBet.forEach(e => {
            if (e) {
                e.string = ''
            }
        })

        this.listLabelMyBet.forEach(e => {
            if (e) {
                e.string = ''
                e.node.parent.active = false;
            }
        })

        // this.nFrameWin.forEach(e => {
        //     if (e) {
        //         e.active = false;
        //     }
        // })
    }

    private _hideAllLight() {
        this.listNodeLight.forEach((e: cc.Node) => {
            if (e) {
                e.active = false;
            }
        })
    }

    // /**
    //  * 
    //  * @param idx : Id POT
    //  * @param total : tiền đặt
    //  */
    showMyBet(idx: number, total) {
        if (total > 0) {
            this.listLabelMyBet[idx].string = DragonTiger_Const.formatAlignNumberWithK(total)
            this.listLabelMyBet[idx].node.parent.active = true;
        }
        else {
            this.listLabelMyBet[idx].string = ''
            this.listLabelMyBet[idx].node.parent.active = false;
        }
    }

    /**
   * 
   * @param idx : Id POT
   * @param total : tiền đặt
   */
    showTotalBet(idx: number, total) {
        // this.listLabelTotalBet[idx].string = BGUI.Utils.formatMoneyWithCommaOnly(total)
        if (total > 0)
            this.listLabelTotalBet[idx].string = DragonTiger_Const.formatAlignNumberWithK(total)
        else
            this.listLabelTotalBet[idx].string = ''
    }


    showLightBet(idx: number) {
        // BGUI.ZLog.log('showLightBet-----> ', idx);
        var nodeLight: cc.Node = this.listNodeLight[idx];
        nodeLight.active = true;
        nodeLight.stopAllActions();
        nodeLight.runAction(this._runEffect());
    }

    // showEffectGoldFly(moneyPotWin) {

    //     let potWin = moneyPotWin.split(';')
    //     for (let i = 0; i < potWin.length; i++) {
    //         let win = parseInt(potWin[i])
    //         if (win > 0) {
    //             let GG = DragonTiger_Const.formatAlignNumberWithK(win)
    //             this.nFrameWin[i].active = true;
    //             let lbGoldWin = this.nFrameWin[i].getChildByName("lb_win").getComponent(cc.Label);
    //             lbGoldWin.string = "+ " + GG;
    //         }
    //     }
    // }

    showLightWin(listWin: Array<number>) {
        var listIdTest = listWin;
        listIdTest.forEach(function (item: number) {
            var nodeLight: cc.Node = this.listNodeLight[item.toString()];
            nodeLight.active = true;
            nodeLight.stopAllActions();
            nodeLight.runAction(this._runEffect(2));
        }.bind(this));

        // let pl = listPlayers.filter((e) => {
        //     return e.nickName.toUpperCase() === BGUI.UserManager.instance.mainUserInfo.nickname.toUpperCase();
        // })

        // this.showEffectGoldFly(pl[0].moneyPotWin);
    }

    _runEffect(times: number = 1) {
        var fadeIn = cc.fadeIn(0.1);
        var fadeOut = cc.fadeOut(1);
        var seq = cc.sequence(fadeIn, fadeOut);
        return seq.repeat(times);
    }

    cleanUp() {
        this._hideAllLight();

        this.listLabelTotalBet.forEach(e => {
            if (e) {
                e.string = ''
            }
        })

        this.listLabelMyBet.forEach(e => {
            if (e) {
                e.string = ''
                e.node.parent.active = false;
            }
        })


        // this.chipMyBet = [0, 0, 0, 0, 0, 0]

        // this.nFrameWin.forEach(e => {
        //     if (e) {
        //         e.active = false;
        //     }
        // })
    }
}
