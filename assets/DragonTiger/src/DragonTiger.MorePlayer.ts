import UITableView from "../../framework/ui/UITableView";
import DragonTiger_GameManager from "./DragonTiger.GameManager";
import DragonTiger_ItemMorePlayer from "./DragonTiger.ItemMorePlayer";
import { SOUNDTYPE } from "./DragonTiger.SoundManager";
import DragonTiger_CMD from "./network/DragonTiger.Cmd";
import DragonTiger_Connector from "./network/DragonTiger.Connector";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonTiger_MorePlayer extends cc.Component implements BGUI.UITableViewDelegate, BGUI.UITableViewDataSource {

    tableCellWillRecycle?(tableView: UITableView, cell: BGUI.UITableCell, idx: number) {
        cc.log('tableCellWillRecycle ====================', idx);

        let ofs = Math.floor((idx + 7) / 50)
        console.log("this.offsetthis.offsetthis.offsetthis.offsetthis.offset = ", ofs)

        if (ofs > this.offset) {
            this.offset = ofs;
            this.sendMorePlayer()
        }
    }

    tableViewDidSelected?(tableView: UITableView, idx: number) {
        cc.log('tableViewDidSelected ====================' + idx);
    }

    tableViewWillDeselected?(tableView: UITableView, idx: number) {
        cc.log('tableViewWillDeselected ====================' + idx);
    }

    tableCellShouldHighlight?(tableView: UITableView, idx: number) {
        cc.log('tableCellShouldHighlight ====================' + idx);
        return true;
    }

    tableCellDidUnhighlight?(tableView: UITableView, idx: number) {
        cc.log('tableCellDidUnhighlight ====================' + idx);
    }

    tableCellDidHighlight?(tableView: UITableView, idx: number) {
        cc.log('tableCellDidHighlight ====================' + idx);
    }

    numberOfCellsInTableView(tableView: BGUI.UITableView): number {
        return this._dataPlayer.length;
    }

    tableCellAtIndex(tableView: BGUI.UITableView, idx: number): BGUI.UITableCell {
        let cell = tableView.dequeueCell();
        let comp = cell.getComponent(DragonTiger_ItemMorePlayer);
        var curData = this._dataPlayer[idx];
        comp.setData(curData);
        return cell
    }

    @property(UITableView)
    tableView: UITableView = null;

    _dataPlayer = []
    offset = 0

    onLoad() {

    }

    onEnable() {
        this.sendMorePlayer();
        DragonTiger_Connector.instance.addCmdListener(DragonTiger_CMD.Code.DRAGON_TIGER_MORE_PLAYER, this.DRAGON_TIGER_MORE_PLAYER, this)

        this.tableView.dataSource = this;
    }

    onDisable() {
        DragonTiger_Connector.instance.removeCmdListener(this, DragonTiger_CMD.Code.DRAGON_TIGER_MORE_PLAYER);
    }


    sendMorePlayer() {
        let pk = new DragonTiger_CMD.SendMorePlayer();
        pk.offset = this.offset
        DragonTiger_Connector.instance.sendPacket(pk)
    }

    DRAGON_TIGER_MORE_PLAYER(cmd, data) {
        let res = new DragonTiger_CMD.ReceivedUserOutTable();
        res.unpackData(data);

        // BGUI.ZLog.log("DRAGON_TIGER_MORE_PLAYER = ", res);

        this._dataPlayer = this._dataPlayer.concat(res.listMorePlayer)
        BGUI.ZLog.log("DRAGON_TIGER_MORE_PLAYER = ", this._dataPlayer);

        this.tableView.reloadData();
        this.tableView.delegate = this
    }


    onClosePopup() {
        DragonTiger_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK);
        this.node.removeFromParent();

    }
}