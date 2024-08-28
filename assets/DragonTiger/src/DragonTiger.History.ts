import UITableView from "../../framework/ui/UITableView";
import DragonTiger_ItemHistory from "./DragonTiger.ItemHistory";
import DragonTiger_CMD from "./network/DragonTiger.Cmd";
import DragonTiger_Connector from "./network/DragonTiger.Connector";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonTiger_History extends cc.Component implements BGUI.UITableViewDataSource {

    numberOfCellsInTableView(tableView: BGUI.UITableView): number {
        return this.dataHis.length;
    }

    tableCellAtIndex(tableView: BGUI.UITableView, idx: number): BGUI.UITableCell {
        let cell = tableView.dequeueCell();
        let comp = cell.getComponent(DragonTiger_ItemHistory);
        var curData = this.dataHis[idx];
        comp.setData(curData);
        return cell
    }

    @property(UITableView)
    tableView: UITableView = null

    @property(cc.Label)
    lb_page: cc.Label = null

    @property(cc.Node)
    btn_back: cc.Node = null
    @property(cc.Node)
    btn_next: cc.Node = null

    dataHis = []
    total_page = 0;
    current_page = 1;


    onEnable() {
        this._sendGetHistoryBet(this.current_page);
        DragonTiger_Connector.instance.addCmdListener(DragonTiger_CMD.Code.DRAGON_TIGER_HISTORY_BET, this.DRAGON_TIGER_HISTORY_BET, this)

        this.tableView.dataSource = this;
        this.tableView.reloadData();
    }

    onDisable() {
        DragonTiger_Connector.instance.removeCmdListener(this, DragonTiger_CMD.Code.DRAGON_TIGER_HISTORY_BET);
    }

    _sendGetHistoryBet(page) {
        let pk = new DragonTiger_CMD.SendHistoryBet();
        pk.page = page
        DragonTiger_Connector.instance.sendPacket(pk)
        BGUI.ZLog.log("_sendGetHistoryBet = ", pk);
    }

    DRAGON_TIGER_HISTORY_BET(cmdId, data) {
        let res = new DragonTiger_CMD.ReceivedHistoryBet();
        res.unpackData(data);

        BGUI.ZLog.log("DRAGON_TIGER_HISTORY_BET = ", res);
        this.total_page = res.totalPage

        this.updateStatusBtn()

        this.dataHis = res.listHistory;
        this.tableView.dataSource = this;
        this.tableView.reloadData();
    }

    onClickNext() {
        if (this.current_page < this.total_page) {
            this.current_page++;
            this._sendGetHistoryBet(this.current_page);
        }
    }

    onClickBack() {
        if (this.current_page > 1) {
            this.current_page--;
            this._sendGetHistoryBet(this.current_page);
        }
    }

    updateStatusBtn() {
        this.lb_page.string = this.current_page + ''
        this.btn_back.active = true;
        this.btn_next.active = true;

        if (this.current_page >= this.total_page) {
            this.btn_next.active = false;
        }
        if (this.current_page <= 1) {
            this.btn_back.active = false;
        }
    }

    onClosePopup() {
        this.node.removeFromParent();
    }
}
