import { Bacarrat_Const } from "./Bacarrat.Const";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Bacarrat_PotOnTableManager extends cc.Component { ///

    @property(cc.Node)
    listNodeLight: Array<cc.Node> = [];

    @property(cc.Label)
    listLabelMyBet: Array<cc.Label> = [];

    @property(cc.Node)
    nFrameWin: Array<cc.Node> = [];

    @property(cc.Label)
    listLabelTotalBet: Array<cc.Label> = [];

    chipMyBet: Array<number> = [0, 0, 0, 0, 0, 0]


    onLoad() {
        this._hideAllLight();

        this.listLabelMyBet.forEach(e => {
            if (e) {
                e.string = "";
                e.node.parent.active = false;
            }
        })


        this.listLabelTotalBet.forEach(e => {
            if (e) {
                e.string = "";
            }
        })


        this.nFrameWin.forEach(e => {
            if (e) {
                e.active = false;
            }
        })
    }

    private _hideAllLight() {
        this.listNodeLight.forEach((e: cc.Node) => {
            if (e) {
                e.active = false;
            }
        })
    }

    getTotalMyBet() {
        let total = 0;
        for (let t of this.chipMyBet)
            total += t;

        return total;
    }

    // Check xem được cửa nào được nặn bài
    getSideNan(): number {
        let goldPlayer = this.chipMyBet[0]
        let goldBanker = this.chipMyBet[1]
        let goldTie = this.chipMyBet[2]
        let goldSuper6 = this.chipMyBet[5]

        if (goldPlayer > goldBanker) {
            return 0;
        } else {
            if (goldTie > 0 || goldSuper6 > 0 || goldBanker > 0)
                return 1;
        }

        return -1;
    }

    /**
     * 
     * @param idx : Id POT
     * @param total : tiền đặt
     */
    showMyBet(idx: number, total) {
        this.listLabelMyBet[idx].string = Bacarrat_Const.formatAlignNumberWithK(total)
        this.listLabelMyBet[idx].node.parent.active = true;

        // this.listLabelMyBet[idx].string = BGUI.Utils.formatMoneyWithCommaOnly(total)
        this.chipMyBet[idx] = total
    }

    /**
   * 
   * @param idx : Id POT
   * @param total : tiền đặt
   */
    showTotalBet(idx: number, total) {
        // this.listLabelTotalBet[idx].string = BGUI.Utils.formatMoneyWithCommaOnly(total)
        this.listLabelTotalBet[idx].string = Bacarrat_Const.formatAlignNumberWithK(total)
    }


    showLightBet(idx: number) {
        // BGUI.ZLog.log('showLightBet-----> ', idx);
        var nodeLight: cc.Node = this.listNodeLight[idx];
        nodeLight.active = true;
        nodeLight.stopAllActions();
        nodeLight.runAction(this._runEffect());
    }

    showEffectGoldFly(moneyPotWin) {

        let potWin = moneyPotWin.split(';')
        for (let i = 0; i < potWin.length; i++) {
            let win = parseInt(potWin[i])
            if (win > 0) {
                let GG = Bacarrat_Const.formatAlignNumberWithK(win)
                this.nFrameWin[i].active = true;
                let lbGoldWin = this.nFrameWin[i].getChildByName("lb_win").getComponent(cc.Label);
                lbGoldWin.string = "+ " + GG;
            }
        }
    }

    showLightWin(listWin: Array<number>, listPlayers) {
        var listIdTest = listWin;
        listIdTest.forEach(function (item: number) {
            var nodeLight: cc.Node = this.listNodeLight[item.toString()];
            nodeLight.active = true;
            nodeLight.stopAllActions();
            nodeLight.runAction(this._runEffect(2));
        }.bind(this));

        let pl = listPlayers.filter((e) => {
            return e.nickName.toUpperCase() === BGUI.UserManager.instance.mainUserInfo.nickname.toUpperCase();
        })

        this.showEffectGoldFly(pl[0].moneyPotWin);
    }

    _runEffect(times: number = 1) {
        var fadeIn = cc.fadeIn(0.1);
        var fadeOut = cc.fadeOut(1);
        var seq = cc.sequence(fadeIn, fadeOut);
        return seq.repeat(times);
    }

    cleanUp() {
        this._hideAllLight();

        this.chipMyBet = [0, 0, 0, 0, 0, 0]

        this.listLabelMyBet.forEach(e => {
            if (e) {
                e.string = "";
                e.node.parent.active = false;
            }
        })


        this.listLabelTotalBet.forEach(e => {
            if (e) {
                e.string = "";
            }
        })


        this.nFrameWin.forEach(e => {
            if (e) {
                e.active = false;
            }
        })
    }
}
