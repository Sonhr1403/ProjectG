const { ccclass, property } = cc._decorator;
import { BCLanguageMgr } from "./BC.LanguageMgr";
import BCConnector from "./BC.Connector";
import cmd from "./BauCua.Cmd";

@ccclass
export default class BCTransaction extends cc.Component {

    @property(cc.Prefab)
    private itemTransaction: cc.Prefab = null;

    @property(cc.Node)
    private content: cc.Node = null;

    @property(cc.Label)
    private lbPage: cc.Node = null;

    private _currentPage: number = 0;

    onLoad () {
        this.activeTrans(false);
        BCConnector.instance.addCmdListener(cmd.Code.CMD_BC_TRANSACTION_5028, this.responseBcHistory, this);
    }

    start() {
        // TODO
    }

    onDestroy() {
        BCConnector.instance.removeCmdListener(this, cmd.Code.CMD_BC_TRANSACTION_5028);
    }

    protected responseBcHistory(cmdId: any, data: Uint8Array) {
        let res = new cmd.BauCuaRecevieTransaction();
        res.unpackData(data);
        // console.error("BAU_CUA", new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
        /////////////////////
        let histories = res.histories;
        this.content.removeAllChildren();
        for(let history of histories)  {
            let _itemTrans = cc.instantiate(this.itemTransaction);
            let strDetail = this.details(history.details, history.dices);
            _itemTrans.getChildByName("LbPhien").getComponent(cc.Label).string = history.sessionId;
            _itemTrans.getChildByName("LbThoiGian").getComponent(cc.Label).string = history.time;
            _itemTrans.getChildByName("LbTongCuoc").getComponent(cc.Label).string = BGUI.Utils.formatMoneyWithCommaOnly(history.totalBet);
            _itemTrans.getChildByName("LbTienThang").getComponent(cc.Label).string = BGUI.Utils.formatMoneyWithCommaOnly(history.totalWin);
            _itemTrans.getChildByName("LbChiTiet").getComponent(cc.Label).string = strDetail;
            this.content.addChild(_itemTrans);
        }
    }

    private details(details: Array<any>, strDices: string) {
        let str = "[" + this.convertDices(strDices) + "]";
        for (let detail of details) {
            let strLangDoor = cmd.Config.doorName[detail.door]
            if (detail.doorBet > 0  && strLangDoor) {
                str += "[" + BCLanguageMgr.getString(strLangDoor) + ":" + BGUI.Utils.formatMoneyWithCommaOnly(detail.doorBet) + "]";
            }
        }
        return str;
    }

    private convertDices(strDice)  {
        let strResult = "";
        let listDices = strDice.split(";");
        for(let i of listDices)  {
            strResult += BCLanguageMgr.getString(cmd.Config.faceName[parseInt(i)]) + ",";
        }
        return strResult;
    }

    public show() {
        this.activeTrans(true);
    }

    protected onClickClose() {
        this.activeTrans(false);
    }

    protected onClickPreview() {

    }

    private onClickNext() {

    }
    // update (dt) {}

    private activeTrans(isActive: boolean) {
        this.node.active = isActive;
    }
}
