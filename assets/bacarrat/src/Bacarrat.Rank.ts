import UITableView from "../../framework/ui/UITableView";
import Bacarrat_ItemRank from "./Bacarrat.ItemRank";



const { ccclass, property } = cc._decorator;

@ccclass
export default class BacarratRank extends BGUI.UIPopup implements BGUI.UITableViewDataSource {
    numberOfCellsInTableView(tableView: BGUI.UITableView): number {
        return this.dataRank.length;
    }

    tableCellAtIndex(tableView: BGUI.UITableView, idx: number): BGUI.UITableCell {
        let cell = tableView.dequeueCell();
        let comp = cell.getComponent(Bacarrat_ItemRank);
        var curData = this.dataRank[idx];
        comp.setData(curData);
        return cell
    }

    dataRank = JSON.parse(JSON.stringify([{ "session": 0, "account": "nick08", "win": 17950 }]))

    @property(UITableView)
    tableView: UITableView = null;

    onEnable() {
        this.tableView.dataSource = this;
        this.tableView.reloadData();
    }
}
