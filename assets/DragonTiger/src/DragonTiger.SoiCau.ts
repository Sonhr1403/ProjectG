import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import { DragonTiger_Const } from "./DragonTiger.Const";
import DragonTiger_GameManager from "./DragonTiger.GameManager";
import { SOUNDTYPE } from "./DragonTiger.SoundManager";
import DragonTiger_CMD from "./network/DragonTiger.Cmd";
import DragonTiger_Connector from "./network/DragonTiger.Connector";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonTiger_SoiCau extends cc.Component {


    @property(cc.SpriteFrame)
    spfScore: cc.SpriteFrame[] = []

    @property(cc.Node)
    nSoiCau: cc.Node[] = []
    @property(cc.Node)
    nActive: cc.Node = null

    @property(cc.Node)
    dishRoad: cc.Node = null
    @property(cc.Node)
    bigRoad: cc.Node = null

    @property(cc.Sprite)
    sp_dragon: cc.Sprite = null;
    @property(cc.Sprite)
    sp_tiger: cc.Sprite = null;

    @property(cc.Label)
    lb_percent_dragon: cc.Label = null
    @property(cc.Label)
    lb_percent_tiger: cc.Label = null
    @property(cc.Label)
    lb_title: cc.Label = null
    @property(cc.Label)
    lb_title2: cc.Label = null
    @property(cc.Label)
    lb_dragon: cc.Label = null
    @property(cc.Label)
    lb_tiger: cc.Label = null
    @property(cc.Label)
    lb_shan: cc.Label = null
    @property(cc.Label)
    lb_straight: cc.Label = null
    @property(cc.Label)
    lb_straight_flush: cc.Label = null

    tab = -1;

    private _dataThongKe = null
    private _dataSoiCau = null


    onLoad() {

    }

    onEnable() {
        DragonTiger_Connector.instance.addCmdListener(DragonTiger_CMD.Code.DRAGON_TIGER_SOI_CAU, this.DRAGON_TIGER_SOI_CAU, this);
        DragonTiger_Connector.instance.addCmdListener(DragonTiger_CMD.Code.DRAGON_TIGER_THONG_KE, this.DRAGON_TIGER_THONG_KE, this);

        this.onClickTab(null, 0);
    }

    onDisable() {
        DragonTiger_Connector.instance.removeCmdListener(this, DragonTiger_CMD.Code.DRAGON_TIGER_SOI_CAU);
        DragonTiger_Connector.instance.removeCmdListener(this, DragonTiger_CMD.Code.DRAGON_TIGER_THONG_KE);
    }

    onSendSoiCau() {
        let pk = new DragonTiger_CMD.SendSoiCau()
        DragonTiger_Connector.instance.sendPacket(pk)
    }

    onSendThongKe() {
        let pk = new DragonTiger_CMD.SendThongKe()
        DragonTiger_Connector.instance.sendPacket(pk)
    }


    DRAGON_TIGER_SOI_CAU(cmdId, data) {
        let res = new DragonTiger_CMD.ReceivedSoiCau();
        res.unpackData(data);

        console.log('DRAGON_TIGER_SOI_CAU = ', JSON.stringify(res))
        this._dataSoiCau = res;
        this.updateView()
    }

    DRAGON_TIGER_THONG_KE(cmdId, data) {
        let res = new DragonTiger_CMD.ReceivedThongKe();
        res.unpackData(data);

        console.log('DRAGON_TIGER_THONG_KE = ', JSON.stringify(res))

        this._dataThongKe = res;
        this.updateView()
    }

    onClickTab(event, data) {
        if (this.tab === parseInt(data))
            return

        this.tab = parseInt(data);

        if (this.tab === 0) {
            this.nActive.x = -150
            this.onSendSoiCau();
        } else {
            this.nActive.x = 150
            this.onSendThongKe();
        }
    }

    setDataDishRoad() {
        let dataDishRoad = this._dataSoiCau.dishRoad;
        let startPos = this._dataSoiCau.dishRoad.length - this.dishRoad.childrenCount;
        if (startPos < 0) startPos = 0;

        for (let i = 0; i < this.dishRoad.childrenCount; i++) {
            let nodeCau = this.dishRoad.children[i];
            if (!nodeCau) return;
            if (startPos + i < dataDishRoad.length) {
                nodeCau.active = true;
                let type = dataDishRoad[startPos + i];
                nodeCau.getComponent(cc.Sprite).spriteFrame = this.spfScore[type];
            } else {
                nodeCau.active = false;
            }
        }
    }

    setDataBigRoad() {
        let data = this._dataSoiCau.bigRoad.split(',');

        for (let i = 0; i < data.length; i++) {
            let row = Math.floor(i / 20);
            let col = i % 20;

            let nodeCau = this.bigRoad.children[col].children[row];
            if (data[i] >= 0) {
                nodeCau.active = true;
                nodeCau.getComponent(cc.Sprite).spriteFrame = this.spfScore[data[i]];
            }
            else {
                nodeCau.active = false;
            }
        }
    }

    updateView() {
        if (this.tab === 0) {
            this.nSoiCau[0].active = true;
            this.nSoiCau[1].active = false;
        }
        else {
            this.nSoiCau[1].active = true;
            this.nSoiCau[0].active = false;
        }

        // {"dishRoad":[0,0,1,0,1,0,0,1,0,1,0,1,0,1,1,0,0,0,1,1],"bigRoad":"0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,-1,1,-1,1,0,-1,-1,1,0,-1,0,1,0,1,-1,-1,-1,1,-1,-1,-1,1,-1,1,-1,-1,-1,-1,-1,-1,0,-1,-1,1,-1,-1,-1,1,-1,-1,-1,1,-1,-1,-1,-1,-1,-1,-1,-1,0,-1,-1,-1,-1,-1,-1,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1"}
        if (this.nSoiCau[0].active) {
            this.setDataDishRoad()
            this.setDataBigRoad()
        }
        // "perDragon":"46.67","perTiger":"53.33","numDragon":362,"numTiger":354,"numShan":336,"numStraight":326,"numStraightFlush":356,"total":75}
        else if (this.nSoiCau[1].active) {
            this.lb_title.string = LanguageMgr.getString('longho.popup.title_count_statitics') + BGUI.Utils.formatMoneyWithCommaOnly(this._dataThongKe.total);
            this.sp_dragon.fillRange = parseFloat(this._dataThongKe.perDragon) / 100;
            this.sp_tiger.fillRange = parseFloat(this._dataThongKe.perTiger) / 100;
            this.lb_percent_dragon.string = this._dataThongKe.perDragon + '%'
            this.lb_percent_tiger.string = this._dataThongKe.perTiger + '%'

            this.lb_title2.string = LanguageMgr.getString('longho.popup.title_count_statitics') + BGUI.Utils.formatMoneyWithCommaOnly(this._dataThongKe.total);
            this.lb_dragon.string = BGUI.Utils.formatMoneyWithCommaOnly(this._dataThongKe.numDragon);
            this.lb_tiger.string = BGUI.Utils.formatMoneyWithCommaOnly(this._dataThongKe.numTiger);
            this.lb_shan.string = BGUI.Utils.formatMoneyWithCommaOnly(this._dataThongKe.numShan);
            this.lb_straight.string = BGUI.Utils.formatMoneyWithCommaOnly(this._dataThongKe.numStraight);
            this.lb_straight_flush.string = BGUI.Utils.formatMoneyWithCommaOnly(this._dataThongKe.numStraightFlush);

        }
    }

    onClosePopup() {
        DragonTiger_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        this.node.removeFromParent();
    }
}