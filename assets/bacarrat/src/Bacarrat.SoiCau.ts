
import { Bacarrat_Const } from "./Bacarrat.Const";
import Bacarrat_GameManager from "./Bacarrat.GameManager";
import { SOUNDTYPE } from "./Bacarrat.SoundManager";
import Bacarrat_CMD from "./network/Bacarrat.Cmd";
import { Bacarrat_Connector } from "./network/Bacarrat.Connector";



const { ccclass, property } = cc._decorator;

const HOA = 2;

@ccclass
export default class Bacarrat_SoiCau extends cc.Component {

    @property(cc.Node)
    dishRoad: cc.Node = null

    @property(cc.Node)
    bigRoad: cc.Node = null

    @property(cc.Node)
    scoreRoad: cc.Node = null

    @property(cc.Node)
    bigEyeRoad: cc.Node = null

    @property(cc.Node)
    smallRoad: cc.Node = null

    @property(cc.Node)
    cockRoach: cc.Node = null

    @property(cc.SpriteFrame)
    bgDishBoard: cc.SpriteFrame[] = []

    @property(cc.SpriteFrame)
    bgBigRoad: cc.SpriteFrame[] = []

    @property(cc.SpriteFrame)
    bgScoreRoad: cc.SpriteFrame[] = []

    @property(cc.SpriteFrame)
    bgCockRoad: cc.SpriteFrame[] = []

    @property(cc.Color)
    listColor: cc.Color[] = []

    @property(cc.PageView)
    allPage: cc.PageView = null;

    @property(cc.Button)
    btnPre: cc.Button = null;

    @property(cc.Button)
    btnNext: cc.Button = null

    listCauNew = []
    listDataBigRoad = []
    listDataScore = []

    listDataBigEye = []
    listDataSmall = []
    listDataCock = []

    lastType = 0
    private _data = null;
    // private _data = JSON.parse(JSON.stringify([
    //     // { "listWinType": [1], "bankerPoint": 2, "playerPoint": 1 },
  // ]))

    onEnable() {
        this.allPage.node.on('scroll-ended', function () {
            this.updateView();
        }, this);

        this._sendGetStatitics();
        Bacarrat_Connector.instance.addCmdListener(Bacarrat_CMD.Code.STATITICS, this.onStatitics, this)
    }

    onDisable() {
        Bacarrat_Connector.instance.removeCmdListener(this, Bacarrat_CMD.Code.STATITICS);
    }

    onStatitics(cmd, data) {
        let res = new Bacarrat_CMD.ReceivedStatiticsHistory();
        res.unpackData(data);

        BGUI.ZLog.log("onStatitics = ", res);

        this._data = res.listHistory;
        this._data.reverse()

        this.reformatDataBigRoad();
        this.reformatDataCau();
        this.reformatDataScore();
        this.reformatDataBigEye();
        this.reformatDataSmall();
        this.reformatDataCock();

        this.updateView();
    }

    private _sendGetStatitics() {
        let pk = new Bacarrat_CMD.SendRequestHistoryStatitics();
        Bacarrat_Connector.instance.sendPacket(pk)
    }

    onBtnOpenSoiCauExtend() {
        Bacarrat_GameManager.instance.nPopup.onClickSoiCauExtend();
        this.onClosePopup();
    }

    onBtnPre() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        let id = Math.max(this.allPage.getCurrentPageIndex() - 1, 0)
        this.allPage.scrollToPage(id, .3);
        this.updateView()
    }

    onBtnNext() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        let id = Math.min(this.allPage.getCurrentPageIndex() + 1, 5)
        this.allPage.scrollToPage(id, .3);
        this.updateView()
    }

    updateView() {
        let id = this.allPage.getCurrentPageIndex();

        if (id == 0) {
            this.btnPre.interactable = false;
            this.btnNext.interactable = true;
        }
        else if (id == 5) {
            this.btnPre.interactable = true;
            this.btnNext.interactable = false;
        }
        else {
            this.btnPre.interactable = true;
            this.btnNext.interactable = true;
        }

        switch (id) {
            case 0:
                this.setDataDishRoad();
                break;
            case 1:
                this.setDatBigRoad()
                break;
            case 2:
                this.setScoreRoad();
                break;
            case 3:
                this.setBigEyeRoad();
                break;
            case 4:
                this.setDataSmallRoad();
                break;
            case 5:
                this.setCockRoad();
                break;
            default:
                break;
        }
    }

    reformatDataScore() {
        this.listDataScore = [];
        let rowCau = [];
        let lastType = -1;
        let dataClone = [...this._data];

        for (let i = 0; i < dataClone.length; i++) {
            let dt = { ...dataClone[i] }
            let type = this.getTypeCau(dt.listWinType);
            if (lastType < 0) {
                if (type != Bacarrat_Const.TAG_POT.TIE) {
                    rowCau.push(dt);
                    lastType = type;
                }
            } else {
                if (type === Bacarrat_Const.TAG_POT.TIE) {
                    rowCau.push(dt)
                } else {
                    if (type === lastType) {
                        rowCau.push(dt);
                    } else {
                        this.listDataScore.push(rowCau);
                        rowCau = [];
                        rowCau.push(dt);
                        lastType = type;
                    }
                }
            }
        }

        this.listDataScore.push(rowCau);
    }

    reformatDataBigRoad() {
        this.listDataBigRoad = [];
        let rowCau = [];
        let lastType = -1;
        let dataClone = [...this._data];

        for (let i = 0; i < dataClone.length; i++) {
            let dt = { ...dataClone[i] }
            let type = this.getTypeCau(dt.listWinType);
            if (lastType < 0) {
                if (type != Bacarrat_Const.TAG_POT.TIE) {
                    rowCau.push(dt);
                    lastType = type;
                }
            } else {
                if (type === Bacarrat_Const.TAG_POT.TIE) {
                    let len = rowCau.length;
                    rowCau[len - 1].listWinType = rowCau[len - 1].listWinType.concat(dt.listWinType)
                } else {
                    if (type === lastType) {
                        rowCau.push(dt);
                    } else {
                        this.listDataBigRoad.push(rowCau);
                        rowCau = [];
                        rowCau.push(dt);
                        lastType = type;
                    }
                }
            }
        }

        this.listDataBigRoad.push(rowCau);
    }

    reformatDataCau() {
        this.listCauNew = [];
        let rowCau = [];
        let lastType = -1;
        let dataClone = [...this._data];

        for (let i = 0; i < dataClone.length; i++) {
            let dt = { ...dataClone[i] }
            let type = this.getTypeCau(dt.listWinType);
            if (lastType < 0) {
                if (type != Bacarrat_Const.TAG_POT.TIE) {
                    rowCau.push(dt);
                    lastType = type;
                }
            } else {
                if (type !== Bacarrat_Const.TAG_POT.TIE) {
                    if (type === lastType) {
                        rowCau.push(dt);
                    } else {
                        this.listCauNew.push(rowCau);

                        rowCau = [];
                        rowCau.push(dt);
                        lastType = type;
                    }
                }
            }
        }

        this.listCauNew.push(rowCau);
    }

    reformatDataSmall() {
        this.listDataSmall = []
        let rowCau = [];
        let lastType = -1;

        if (this.listCauNew.length < 3)
            return;

        let st = 2;
        if (this.listCauNew[2].length === 1)
            st = 3

        for (let col = st; col < this.listCauNew.length; col++) {
            let data = this.listCauNew[col];

            let sizRow1 = this.listCauNew[col - 1].length;
            let sizRow2 = this.listCauNew[col - 2].length;
            let sizRow3 = 0;

            if (col >= 3)
                sizRow3 = this.listCauNew[col - 3].length;

            for (let row = 0; row < data.length; row++) {
                if (row === 0 && col !== 2) {
                    if (sizRow1 === sizRow3) {
                        if (lastType === 1) {
                            rowCau.push(1)
                        }
                        else {
                            if (rowCau.length > 0) {
                                this.listDataSmall.push(rowCau)
                            }
                            rowCau = [];
                            rowCau.push(1);
                            lastType = 1;
                        }
                    }
                    else {
                        if (lastType == 0) {
                            rowCau.push(0)
                        }
                        else {
                            if (rowCau.length > 0) {
                                this.listDataSmall.push(rowCau)
                            }
                            rowCau = [];
                            rowCau.push(0);
                            lastType = 0;
                        }
                    }
                    continue;
                }

                if (row < sizRow2) {
                    if (lastType === 1) {
                        rowCau.push(1)
                    }
                    else {
                        if (rowCau.length > 0) {
                            this.listDataSmall.push(rowCau)
                        }
                        rowCau = [];
                        rowCau.push(1);
                        lastType = 1;
                    }
                    continue;
                }

                if (row == sizRow2) {
                    if (lastType == 0) {
                        rowCau.push(0)
                    }
                    else {
                        this.listDataSmall.push(rowCau)
                        rowCau = [];
                        rowCau.push(0);
                        lastType = 0;
                    }
                    continue;
                }

                if (row >= sizRow2 + 1) {
                    if (lastType === 1) {
                        rowCau.push(1)
                    }
                    else {
                        this.listDataSmall.push(rowCau)
                        rowCau = [];
                        rowCau.push(1);
                        lastType = 1;
                    }
                }
            }
        }

        if (rowCau.length > 0) {
            this.listDataSmall.push(rowCau)
        }
    }

    reformatDataBigEye() {
        this.listDataBigEye = []
        let rowCau = [];
        let lastType = -1;

        if (this.listCauNew.length < 2)
            return;

        let st = 1;
        if (this.listCauNew[1].length === 1)
            st = 2

        for (let col = st; col < this.listCauNew.length; col++) {
            let data = this.listCauNew[col];

            let sizRow2 = 0;
            let sizRow1 = this.listCauNew[col - 1].length;
            if (col >= 2)
                sizRow2 = this.listCauNew[col - 2].length;

            for (let row = 0; row < data.length; row++) {
                if (row === 0 && col !== 1) {
                    if (sizRow1 === sizRow2) {
                        if (lastType === 1) {
                            rowCau.push(1)
                        }
                        else {
                            if (rowCau.length > 0) {
                                this.listDataBigEye.push(rowCau)
                            }
                            rowCau = [];
                            rowCau.push(1);
                            lastType = 1;
                        }
                    }
                    else {
                        if (lastType == 0) {
                            rowCau.push(0)
                        }
                        else {
                            if (rowCau.length > 0) {
                                this.listDataBigEye.push(rowCau)
                            }
                            rowCau = [];
                            rowCau.push(0);
                            lastType = 0;
                        }
                    }
                    continue;
                }

                if (row < sizRow1) {
                    if (lastType === 1) {
                        rowCau.push(1)
                    }
                    else {
                        if (rowCau.length > 0) {
                            this.listDataBigEye.push(rowCau)
                        }
                        rowCau = [];
                        rowCau.push(1);
                        lastType = 1;
                    }
                    continue;
                }

                if (row == sizRow1) {
                    if (lastType == 0) {
                        rowCau.push(0)
                    }
                    else {
                        this.listDataBigEye.push(rowCau)
                        rowCau = [];
                        rowCau.push(0);
                        lastType = 0;
                    }
                    continue;
                }

                if (row >= sizRow1 + 1) {
                    if (lastType === 1) {
                        rowCau.push(1)
                    }
                    else {
                        this.listDataBigEye.push(rowCau)
                        rowCau = [];
                        rowCau.push(1);
                        lastType = 1;
                    }
                }
            }
        }

        if (rowCau.length > 0) {
            this.listDataBigEye.push(rowCau)
        }
    }

    reformatDataCock() {
        this.listDataCock = []
        let rowCau = [];
        let lastType = -1;

        if (this.listCauNew.length < 4)
            return;

        let st = 3;
        if (this.listCauNew[3].length === 1)
            st = 4

        for (let col = st; col < this.listCauNew.length; col++) {
            let data = this.listCauNew[col];

            let sizRow1 = this.listCauNew[col - 1].length;
            let sizRow3 = this.listCauNew[col - 3].length;
            let sizRow4 = 0;

            if (col >= 4)
                sizRow4 = this.listCauNew[col - 4].length;

            for (let row = 0; row < data.length; row++) {
                if (row === 0 && col !== 3) {
                    if (sizRow1 === sizRow4) {
                        if (lastType === 1) {
                            rowCau.push(1)
                        }
                        else {
                            if (rowCau.length > 0) {
                                this.listDataCock.push(rowCau)
                            }
                            rowCau = [];
                            rowCau.push(1);
                            lastType = 1;
                        }
                    }
                    else {
                        if (lastType == 0) {
                            rowCau.push(0)
                        }
                        else {
                            if (rowCau.length > 0) {
                                this.listDataCock.push(rowCau)
                            }
                            rowCau = [];
                            rowCau.push(0);
                            lastType = 0;
                        }
                    }
                    continue;
                }

                if (row < sizRow3) {
                    if (lastType === 1) {
                        rowCau.push(1)
                    }
                    else {
                        if (rowCau.length > 0) {
                            this.listDataCock.push(rowCau)
                        }
                        rowCau = [];
                        rowCau.push(1);
                        lastType = 1;
                    }
                    continue;
                }

                if (row == sizRow3) {
                    if (lastType == 0) {
                        rowCau.push(0)
                    }
                    else {
                        this.listDataCock.push(rowCau)
                        rowCau = [];
                        rowCau.push(0);
                        lastType = 0;
                    }
                    continue;
                }

                if (row >= sizRow3 + 1) {
                    if (lastType === 1) {
                        rowCau.push(1)
                    }
                    else {
                        this.listDataCock.push(rowCau)
                        rowCau = [];
                        rowCau.push(1);
                        lastType = 1;
                    }
                }
            }
        }

        if (rowCau.length > 0) {
            this.listDataCock.push(rowCau)
        }

        BGUI.ZLog.log('reformatDataCock = ', this.listDataCock);
    }

    setDataDishRoad() {
        let total = this._data.length;
        let totalCol = Math.ceil(total / 6);
        let startPos = total - 72;
        if (startPos < 0)
            startPos = 0;

        for (let id = 0; id < this.dishRoad.children.length; id++) {
            let nodeDish = this.dishRoad.children[id];
            if (id < totalCol) {
                if (!nodeDish.active)
                    nodeDish.active = true;

                for (let i = 0; i < nodeDish.children.length; i++) {
                    let nodeCau = nodeDish.children[i];
                    if (!nodeCau.active)
                        nodeCau.active = true;

                    let pos = startPos + id * 6 + i;
                    if (pos < total) {
                        let type = this._data[pos].listWinType;
                        this.setCauDishRoad(type, nodeCau);
                    } else {
                        nodeCau.active = false;
                    }
                }
            }
            else {
                nodeDish.active = false;
            }
        }
    }

    setDatBigRoad() {
        let newData = this.genNewData(this.listDataBigRoad);
        let sizeData = newData.length
        let idStart = sizeData - 12;
        if (idStart < 0)
            idStart = 0;

        for (let col = 0; col < this.bigRoad.children.length; col++) {
            let nodeScore = this.bigRoad.children[col];
            for (let row = 0; row < nodeScore.children.length; row++) {
                let nodeCau = nodeScore.children[row];
                nodeCau.active = false;
            }
        }

        for (let col = idStart; col < sizeData; col++) {
            for (let row = 0; row < newData[col].length; row++) {
                if (newData[col][row] !== null) {
                    let nodeCau = this.bigRoad.children[col - idStart].children[row];
                    nodeCau.active = true;
                    this.setCauBigRoad(newData[col][row].listWinType, nodeCau);

                }
            }
        }
    }

    setScoreRoad() {
        let newData = this.genNewData(this.listDataScore);
        let sizeData = newData.length
        let idStart = sizeData - 12;
        if (idStart < 0)
            idStart = 0;

        for (let col = 0; col < this.scoreRoad.children.length; col++) {
            let nodeScore = this.scoreRoad.children[col];
            for (let row = 0; row < nodeScore.children.length; row++) {
                let nodeCau = nodeScore.children[row];
                nodeCau.active = false;
            }
        }

        for (let col = idStart; col < sizeData; col++) {
            for (let row = 0; row < newData[col].length; row++) {
                if (newData[col][row] !== null) {
                    let nodeCau = this.scoreRoad.children[col - idStart].children[row];
                    nodeCau.active = true;
                    this.setCauScore(newData[col][row], nodeCau);

                }
            }
        }
    }

    setBigEyeRoad() {
        let newData = this.genNewData(this.listDataBigEye);
        let sizeData = newData.length
        let idStart = sizeData - 12;
        if (idStart < 0)
            idStart = 0;

        for (let col = 0; col < this.bigEyeRoad.children.length; col++) {
            let nodeScore = this.bigEyeRoad.children[col];
            for (let row = 0; row < nodeScore.children.length; row++) {
                let nodeCau = nodeScore.children[row];
                nodeCau.active = false;
            }
        }

        for (let col = idStart; col < sizeData; col++) {
            for (let row = 0; row < newData[col].length; row++) {
                if (newData[col][row] !== null) {
                    let nodeCau = this.bigEyeRoad.children[col - idStart].children[row];
                    nodeCau.active = true;
                    this.setCauBigEye(newData[col][row], nodeCau);

                }
            }
        }
    }

    setDataSmallRoad() {
        let newData = this.genNewData(this.listDataSmall);
        let sizeData = newData.length
        let idStart = sizeData - 12;
        if (idStart < 0)
            idStart = 0;

        for (let col = 0; col < this.smallRoad.children.length; col++) {
            let nodeScore = this.smallRoad.children[col];
            for (let row = 0; row < nodeScore.children.length; row++) {
                let nodeCau = nodeScore.children[row];
                nodeCau.active = false;
            }
        }

        for (let col = idStart; col < sizeData; col++) {
            for (let row = 0; row < newData[col].length; row++) {
                if (newData[col][row] !== null) {
                    let nodeCau = this.smallRoad.children[col - idStart].children[row];
                    nodeCau.active = true;
                    this.setCauSmall(newData[col][row], nodeCau);

                }
            }
        }
    }

    setCockRoad() {

        let newData = this.genNewData(this.listDataCock);
        let sizeData = newData.length
        let idStart = sizeData - 12;
        if (idStart < 0)
            idStart = 0;

        for (let col = 0; col < this.cockRoach.children.length; col++) {
            let nodeScore = this.cockRoach.children[col];
            for (let row = 0; row < nodeScore.children.length; row++) {
                let nodeCau = nodeScore.children[row];
                nodeCau.active = false;
            }
        }

        for (let col = idStart; col < sizeData; col++) {
            for (let row = 0; row < newData[col].length; row++) {
                if (newData[col][row] !== null) {
                    let nodeCau = this.cockRoach.children[col - idStart].children[row];
                    nodeCau.active = true;
                    this.setCauCock(newData[col][row], nodeCau);

                }
            }
        }
    }

    getTypeCau(typeCau) {
        for (let i = 0; i < typeCau.length; i++) {
            if (typeCau[i] <= Bacarrat_Const.TAG_POT.TIE)
                return typeCau[i];
        }

        return Bacarrat_Const.TAG_POT.TIE;
    }

    setCauDishRoad(type, nodeCau) {
        let cai = nodeCau.getChildByName("cai");
        let con = nodeCau.getChildByName("con");
        let lb_super = nodeCau.getChildByName("lb_super6")
        cai.active = false;
        con.active = false;
        lb_super.active = false;

        for (let i = 0; i < type.length; i++) {
            if (type[i] > Bacarrat_Const.TAG_POT.TIE) {
                if (type[i] === Bacarrat_Const.TAG_POT.PLAYER_PAIR) {
                    con.active = true;
                } else if (type[i] === Bacarrat_Const.TAG_POT.BANKER_PAIR) {
                    cai.active = true;
                } else if (type[i] === Bacarrat_Const.TAG_POT.SUPER_6) {
                    lb_super.active = true
                }
            } else {
                nodeCau.getComponent(cc.Sprite).spriteFrame = this.bgDishBoard[type[i]];
            }
        }
    }

    setCauBigRoad(type, nodeCau) {
        let banker = nodeCau.getChildByName("cai");
        let player = nodeCau.getChildByName("con");
        let super6 = nodeCau.getChildByName("lb_super6");

        banker.active = false;
        player.active = false;
        super6.active = false;

        for (let i = 0; i < type.length; i++) {
            let xtype = type[i];
            if (xtype > Bacarrat_Const.TAG_POT.TIE) {
                if (xtype === Bacarrat_Const.TAG_POT.PLAYER_PAIR) {
                    player.active = true;
                } else if (xtype === Bacarrat_Const.TAG_POT.BANKER_PAIR) {
                    banker.active = true;
                } else {
                    super6.active = true;
                }
            } else {
                if (xtype === Bacarrat_Const.TAG_POT.TIE) {
                    xtype = this.lastType + 2;
                } else {
                    if (xtype < Bacarrat_Const.TAG_POT.TIE)
                        this.lastType = xtype;
                }

                nodeCau.getComponent(cc.Sprite).spriteFrame = this.bgBigRoad[xtype];
            }
        }
    }

    setCauScore(cauInfo, nodeCau) {
        let type = cauInfo.listWinType;
        for (let i = 0; i < type.length; i++) {
            if (type[i] <= Bacarrat_Const.TAG_POT.TIE) {
                nodeCau.getComponent(cc.Sprite).spriteFrame = this.bgScoreRoad[type[i]];
                nodeCau.getChildByName("lb_win").color = this.listColor[type[i]];
                nodeCau.getChildByName("lb_lose").active = true

                if (type[i] === Bacarrat_Const.TAG_POT.PLAYER) {
                    nodeCau.getChildByName("lb_win").getComponent(cc.Label).string = cauInfo.playerPoint;
                    nodeCau.getChildByName("lb_lose").getComponent(cc.Label).string = cauInfo.bankerPoint;
                }
                else if (type[i] === Bacarrat_Const.TAG_POT.BANKER) {
                    nodeCau.getChildByName("lb_win").getComponent(cc.Label).string = cauInfo.bankerPoint;
                    nodeCau.getChildByName("lb_lose").getComponent(cc.Label).string = cauInfo.playerPoint;
                }
                else {
                    nodeCau.getChildByName("lb_win").getComponent(cc.Label).string = cauInfo.playerPoint;
                    nodeCau.getChildByName("lb_lose").active = false
                }
            }
        }
    }

    setCauSmall(type, nodeCau) {
        nodeCau.getComponent(cc.Sprite).spriteFrame = this.bgDishBoard[type];
    }

    setCauBigEye(type, nodeCau) {
        nodeCau.getComponent(cc.Sprite).spriteFrame = this.bgBigRoad[type];
    }

    setCauCock(type, nodeCau) {
        nodeCau.getComponent(cc.Sprite).spriteFrame = this.bgCockRoad[type];
    }

    genNewData(data) {
        let clData = [...data];
        let arrTick = []
        let arrDataTemp = []

        let totalData = clData.length;
        let sizeMap = totalData;

        for (let col = 0; col < totalData; col++) {
            let arr = []
            let arrD = []
            for (let row = 0; row < 6; row++) {
                arr.push(0);
                arrD.push(null)
            }
            arrTick.push(arr);
            arrDataTemp.push(arrD)
        }

        for (let i = 0; i < totalData; i++) {
            let dataCau = clData[i];
            let idCol = i
            let idRow = 0;
            let nextStep = 0;

            while (arrTick[idCol][idRow] === 1) {
                idCol++;

                if (idCol >= sizeMap) {
                    sizeMap++;

                    let arr = []
                    let arrD = []
                    for (let row = 0; row < 6; row++) {
                        arr.push(0);
                        arrD.push(null)
                    }
                    arrTick.push(arr);
                    arrDataTemp.push(arrD)
                }
            }

            for (let iCau = 0; iCau < dataCau.length; iCau++) {
                arrTick[idCol][idRow] = 1
                arrDataTemp[idCol][idRow] = dataCau[iCau];

                if (idRow === 5 || arrTick[idCol][idRow + 1] === 1) {
                    idCol++;
                    nextStep = iCau + 1;
                    break;
                }
                else {
                    idRow++;
                }
            }

            if (idCol >= sizeMap) {
                sizeMap++;

                let arr = []
                let arrD = []
                for (let row = 0; row < 6; row++) {
                    arr.push(0);
                    arrD.push(null)
                }
                arrTick.push(arr);
                arrDataTemp.push(arrD)
            }

            if (nextStep > 0) {
                for (let iCau = nextStep; iCau < dataCau.length; iCau++) {
                    arrTick[idCol][idRow] = 1
                    arrDataTemp[idCol][idRow] = dataCau[iCau];
                    idCol++;

                    if (idCol >= sizeMap && iCau < dataCau.length - 1) {
                        sizeMap++;

                        let arr = []
                        let arrD = []
                        for (let row = 0; row < 6; row++) {
                            arr.push(0);
                            arrD.push(null)
                        }
                        arrTick.push(arr);
                        arrDataTemp.push(arrD)
                    }
                }
            }
        }

        return arrDataTemp;
    }

    onClosePopup() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        this.node.removeFromParent();
    }
}
