import { LanguageMgr } from "../../framework/localize/LanguageMgr";

import Bacarrat_Card from "./Bacarrat.Card";
import { Bacarrat_Const } from "./Bacarrat.Const";
import Bacarrat_GameManager from "./Bacarrat.GameManager";
import { SOUNDTYPE } from "./Bacarrat.SoundManager";
import Bacarrat_CMD from "./network/Bacarrat.Cmd";
import { Bacarrat_Connector } from "./network/Bacarrat.Connector";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bacarrat_History extends cc.Component {

    @property(cc.Node)
    node_his: cc.Node = null;
    @property(cc.Node)
    lb_note: cc.Node = null;

    @property(cc.Button)
    btn_pre: cc.Button = null
    @property(cc.Button)
    btn_next: cc.Button = null

    @property(cc.Label)
    lb_time: cc.Label = null;
    @property(cc.Node)
    node_player: cc.Node = null;
    @property(cc.Node)
    node_banker: cc.Node = null;

    @property(cc.Node)
    listItem: cc.Node[] = []

    index = 0;
   _data = null


    // dt = [{ "sessionId": 9686, "currrentTime": "13-50-2023", "betValue": [200, 500, 0, 200, 0, 0], "winPot": [-200, -500, 0, -200, 0, 0], "cardsPlayer": [17, 16, 12], "cardsBanker": [14, 19, 37], "bankerPoint": 0, "playerPoint": 0 },
    // { "sessionId": 9687, "currrentTime": "13-51-2023", "betValue": [50000000, 0, 0, 0, 0, 0], "winPot": [-50000000, 0, 0, 0, 0, 0], "cardsPlayer": [3, 26], "cardsBanker": [35, 28], "bankerPoint": 0, "playerPoint": 0 },
    // { "sessionId": 9688, "currrentTime": "13-52-2023", "betValue": [0, 600, 0, 0, 0, 0], "winPot": [0, -600, 0, 0, 0, 0], "cardsPlayer": [36, 50, 40], "cardsBanker": [47, 5], "bankerPoint": 0, "playerPoint": 0 },
    // { "sessionId": 9689, "currrentTime": "13-53-2023", "betValue": [0, 300, 0, 0, 0, 0], "winPot": [0, -300, 0, 0, 0, 0], "cardsPlayer": [27, 3], "cardsBanker": [37, 46], "bankerPoint": 0, "playerPoint": 0 },
    // { "sessionId": 9692, "currrentTime": "13-56-2023", "betValue": [200, 0, 0, 0, 0, 0], "winPot": [-200, 0, 0, 0, 0, 0], "cardsPlayer": [11, 26, 45], "cardsBanker": [44, 22], "bankerPoint": 0, "playerPoint": 0 },
    // { "sessionId": 9693, "currrentTime": "13-56-2023", "betValue": [10500, 0, 0, 0, 0, 0], "winPot": [-10500, 0, 0, 0, 0, 0], "cardsPlayer": [17, 47], "cardsBanker": [24, 7], "bankerPoint": 0, "playerPoint": 0 },
    // { "sessionId": 9695, "currrentTime": "13-58-2023", "betValue": [600000000, 0, 0, 0, 0, 0], "winPot": [-600000000, 0, 0, 0, 0, 0], "cardsPlayer": [51, 45], "cardsBanker": [25, 4], "bankerPoint": 0, "playerPoint": 0 },
    // { "sessionId": 9697, "currrentTime": "13-00-2023", "betValue": [50000000, 0, 0, 0, 0, 0], "winPot": [-50000000, 0, 0, 0, 0, 0], "cardsPlayer": [19, 48], "cardsBanker": [25, 23, 36], "bankerPoint": 0, "playerPoint": 0 },
    // { "sessionId": 9699, "currrentTime": "13-02-2023", "betValue": [350000000, 0, 0, 0, 0, 0], "winPot": [-350000000, 0, 0, 0, 0, 0], "cardsPlayer": [20, 40, 13], "cardsBanker": [9, 36, 50], "bankerPoint": 0, "playerPoint": 0 }]
    onEnable() {
        this._sendGetHistoryPlayer();
        Bacarrat_Connector.instance.addCmdListener(Bacarrat_CMD.Code.HISTORY_PLAYER, this.onHistory, this)
    }

    onDisable() {
        Bacarrat_Connector.instance.removeCmdListener(this, Bacarrat_CMD.Code.HISTORY_PLAYER);
    }

    _sendGetHistoryPlayer() {
        let pk = new Bacarrat_CMD.SendRequestHistoryPlayer();
        Bacarrat_Connector.instance.sendPacket(pk)
    }

    onHistory(cmd, data) {
        let res = new Bacarrat_CMD.ReceivedHistoryPlayer();
        res.unpackData(data);

        BGUI.ZLog.log("ReceivedHistoryPlayer = ", res);

        this.index = 0;
        this._data = res.listHistory;
        this.reloadData();
    }

    reloadData() {
        BGUI.ZLog.log("_data = ", this._data)
        if (this._data.length == 0) {
            this.node_his.active = false
            this.lb_note.active = true
        }
        else {
            this.node_his.active = true
            this.lb_note.active = false
            this.updateViewBtn();

            this.lb_time.string = "#" + this._data[this.index].sessionId

            //player
            let p1 = this.node_player.getChildByName("card1").getComponent(Bacarrat_Card);
            let p2 = this.node_player.getChildByName("card2").getComponent(Bacarrat_Card);
            p1.setId(this._data[this.index].cardsPlayer[0]);
            p2.setId(this._data[this.index].cardsPlayer[1]);
            p1.setSpriteCard()
            p2.setSpriteCard()

            if (this._data[this.index].cardsPlayer.length > 2) {
                this.node_player.getChildByName("card3").active = true;
                let p3 = this.node_player.getChildByName("card3").getComponent(Bacarrat_Card);
                p3.setId(this._data[this.index].cardsPlayer[2]);
                p3.setSpriteCard()
            } else
                this.node_player.getChildByName("card3").active = false;
            this.node_player.getChildByName('lb_score').getComponent(cc.Label).string = this.showPoint(this.node_player, this._data[this.index].cardsPlayer.length);

            // banker
            let c1 = this.node_banker.getChildByName("card1").getComponent(Bacarrat_Card);
            let c2 = this.node_banker.getChildByName("card2").getComponent(Bacarrat_Card);
            c1.setId(this._data[this.index].cardsBanker[0]);
            c2.setId(this._data[this.index].cardsBanker[1]);
            c1.setSpriteCard()
            c2.setSpriteCard()

            if (this._data[this.index].cardsBanker.length > 2) {
                this.node_banker.getChildByName("card3").active = true;
                let c3 = this.node_banker.getChildByName("card3").getComponent(Bacarrat_Card);
                c3.setId(this._data[this.index].cardsBanker[2]);
                c3.setSpriteCard()
            } else
                this.node_banker.getChildByName("card3").active = false;
            this.node_banker.getChildByName('lb_score').getComponent(cc.Label).string = this.showPoint(this.node_banker, this._data[this.index].cardsBanker.length);



            for (let i = 0; i < this.listItem.length; i++)
                this.listItem[i].active = false;

            let vt = 0;
            for (let i = 0; i < this._data[this.index].betValue.length; i++) {
                let dt = this._data[this.index].betValue[i];
                if (dt > 0) {
                    this.listItem[vt].active = true;
                    switch (i) {
                        case 0:
                            this.listItem[vt].getChildByName('lb_gate').getComponent(cc.Label).string = 'PLAYER'
                            break
                        case 1:
                            this.listItem[vt].getChildByName('lb_gate').getComponent(cc.Label).string = 'BANKER'
                            break
                        case 2:
                            this.listItem[vt].getChildByName('lb_gate').getComponent(cc.Label).string = 'TIE'
                            break
                        case 3:
                            this.listItem[vt].getChildByName('lb_gate').getComponent(cc.Label).string = 'PLAYER PAIR'
                            break
                        case 4:
                            this.listItem[vt].getChildByName('lb_gate').getComponent(cc.Label).string = 'BANKER PAIR'
                            break
                        case 5:
                            this.listItem[vt].getChildByName('lb_gate').getComponent(cc.Label).string = 'SUPER 6'
                            break
                    }
                    this.listItem[vt].getChildByName('lb_bet').getComponent(cc.Label).string = Bacarrat_Const.formatAlignNumberWithK(dt)
                    this.listItem[vt].getChildByName('lb_win').getComponent(cc.Label).string = Bacarrat_Const.formatAlignNumberWithK(this._data[this.index].winPot[i])
                    if (this._data[this.index].winPot[i] > 0)
                        this.listItem[vt].getChildByName('lb_win').color = cc.Color.GREEN
                    else
                        this.listItem[vt].getChildByName('lb_win').color = cc.Color.RED

                    vt++;
                }
            }
        }
    }

    showPoint(nPot, numberOfcard: number) {
        let point1 = nPot.getChildByName("card1").getComponent(Bacarrat_Card).pointNumber();
        let point2 = nPot.getChildByName("card2").getComponent(Bacarrat_Card).pointNumber();

        let total = point1 + point2;
        if (numberOfcard > 2) {
            let point3 = nPot.getChildByName("card3").getComponent(Bacarrat_Card).pointNumber();
            total += point3;
        }

        return total % 10 + ''
    }

    actNextPage() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        this.index++;
        // this.updateView()
        this.reloadData();
    }

    actPrevPage() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        this.index--;
        // this.updateView()
        this.reloadData();
    }

    updateViewBtn() {
        BGUI.ZLog.log("updateView = ", this.index, this._data.length)
        if (this._data.length == 1) {
            this.btn_next.node.active = false;
            this.btn_pre.node.active = false;
        }
        else {
            if (this.index <= 0) {
                this.index = 0
                this.btn_next.node.active = true;
                this.btn_pre.node.active = false;
            } else if (this.index >= this._data.length - 1) {
                this.index = this._data.length - 1
                this.btn_next.node.active = false;
                this.btn_pre.node.active = true;
            } else {
                this.btn_next.node.active = true;
                this.btn_pre.node.active = true;
            }
        }
    }

    onClosePopup() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        this.node.removeFromParent();
    }
}
