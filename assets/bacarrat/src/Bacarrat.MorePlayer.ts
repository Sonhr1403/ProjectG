import UITableView from "../../framework/ui/UITableView";
import Bacarrat_GameManager from "./Bacarrat.GameManager";
import Bacarrat_ItemMorePlayer from "./Bacarrat.ItemMorePlayer";
import { SOUNDTYPE } from "./Bacarrat.SoundManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bacarrat_MorePlayer extends cc.Component implements BGUI.UITableViewDataSource {
    numberOfCellsInTableView(tableView: BGUI.UITableView): number {
        return this._dataPlayer.length;
    }

    tableCellAtIndex(tableView: BGUI.UITableView, idx: number): BGUI.UITableCell {
        let cell = tableView.dequeueCell();
        let comp = cell.getComponent(Bacarrat_ItemMorePlayer);
        var curData = this._dataPlayer[idx];
        comp.setData(curData);
        return cell
    }

    @property(UITableView)
    tableView: UITableView = null;
    _dataPlayer = []

    onEnable() {
        this._dataPlayer = Bacarrat_GameManager.instance.playerManager.listMorePlayer
        this.tableView.dataSource = this;
        this.tableView.reloadData();
    }

    onClosePopup() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK);
        this.node.removeFromParent();
    }
}