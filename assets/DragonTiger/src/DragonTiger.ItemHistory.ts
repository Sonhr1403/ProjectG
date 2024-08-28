// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { DragonTiger_Const } from "./DragonTiger.Const";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonTiger_ItemHistory extends cc.Component {

    @property(cc.Label)
    lbPhien: cc.Label = null
    @property(cc.Label)
    lbTime: cc.Label = null
    @property(cc.Label)
    lbGate: cc.Label = null
    @property(cc.Label)
    lbKq: cc.Label = null
    @property(cc.Label)
    lbMoney: cc.Label = null

    data = null

    setData(_data: any) {
        if (!_data) return;
        this.data = _data;
        let index = this.data.time.indexOf('[')
        this.data.time = this.data.time.slice(0, index)
        let time = new Date(Date.parse(this.data.time))
        console.log('this.data.time = ', this.data.time)

        this.lbPhien.string = this.data.sessionID + ''
        this.lbTime.string = this.convertTime(this.data.time)
        this.lbGate.string = this.getBetValue(this.data.betValue)
        this.lbKq.string = this.getWinPot(this.data.winPot)
        this.lbMoney.string = DragonTiger_Const.formatAlignNumberWithK(this.data.money)

    }

    convertTime(timeC) {
        let index = this.data.time.indexOf('[')
        let ti = timeC.slice(0, index)
        let time = new Date(Date.parse(ti))

        return time.getDate() + '/' + time.getMonth() + ' ' + time.getHours() + ':' + time.getMinutes()
    }

    getBetValue(arrBet) {
        let arrMoney = ''

        for (let i = 0; i < arrBet.length; i++) {
            let m = DragonTiger_Const.formatAlignNumberWithK(arrBet[i])

            if (arrBet[i] > 0) {
                if (arrMoney !== '')
                    arrMoney += '-'

                switch (i) {
                    case 0:
                        arrMoney += 'L:' + m
                        break;
                    case 1:
                        arrMoney += 'H:' + m
                        break;
                    case 2:
                        arrMoney += 'SH:' + m
                        break;
                    case 3:
                        arrMoney += 'ST:' + m
                        break;
                    case 4:
                        arrMoney += 'TPS:' + m
                        break;
                    default:
                        break;
                }
            }
        }

        return arrMoney;
    }

    getWinPot(winPot) {
        let gate = ''

        for (let i = 0; i < winPot.length; i++) {
            switch (winPot[i]) {
                case 0:
                    gate += 'L'
                    break;
                case 1:
                    gate += 'H'
                    break;
                case 2:
                    gate += 'SH'
                    break;
                case 3:
                    gate += 'ST'
                    break;
                case 4:
                    gate += 'TPS'
                    break;
                default:
                    break;
            }

            if (i < winPot.length - 1) {
                gate += '-'
            }
        }

        return gate;
    }
}
