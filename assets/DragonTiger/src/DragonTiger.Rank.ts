import UITableView from "../../framework/ui/UITableView";
import { DragonTiger_Const } from "./DragonTiger.Const";
import DragonTiger_GameManager from "./DragonTiger.GameManager";
import DragonTiger_ItemRank from "./DragonTiger.ItemRank";
import { SOUNDTYPE } from "./DragonTiger.SoundManager";
import DragonTiger_CMD from "./network/DragonTiger.Cmd";
import DragonTiger_Connector from "./network/DragonTiger.Connector";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonTiger_Rank extends cc.Component implements BGUI.UITableViewDataSource {
    numberOfCellsInTableView(tableView: BGUI.UITableView): number {
        return this.dataRank.length;
    }

    tableCellAtIndex(tableView: BGUI.UITableView, idx: number): BGUI.UITableCell {
        let cell = tableView.dequeueCell();
        let comp = cell.getComponent(DragonTiger_ItemRank);
        var curData = this.dataRank[idx];
        comp.setData(curData);
        return cell
    }

    @property(cc.Sprite)
    avt1: cc.Sprite = null
    @property(cc.Label)
    lb_name1: cc.Label = null
    @property(cc.Label)
    lb_chip1: cc.Label = null

    @property(cc.Sprite)
    avt2: cc.Sprite = null
    @property(cc.Label)
    lb_name2: cc.Label = null
    @property(cc.Label)
    lb_chip2: cc.Label = null
    @property(UITableView)
    tableView: UITableView = null;

    dataRank = []

    onEnable() {
        DragonTiger_Connector.instance.addCmdListener(DragonTiger_CMD.Code.DRAGON_TIGER_TOP_PLAYER, this.DRAGON_TIGER_TOP_PLAYER, this);
        this.tableView.dataSource = this;
        this.tableView.reloadData();
        this.sendTopPlayer()

    }

    onDisable() {
        DragonTiger_Connector.instance.removeCmdListener(this, DragonTiger_CMD.Code.DRAGON_TIGER_TOP_PLAYER);
    }

    sendTopPlayer() {
        let pk = new DragonTiger_CMD.SendTopPlayer();
        DragonTiger_Connector.instance.sendPacket(pk)
    }

    DRAGON_TIGER_TOP_PLAYER(cmdId, data) {
        let res = new DragonTiger_CMD.ReceivedTopPlayer();
        res.unpackData(data);

        console.log('DRAGON_TIGER_TOP_PLAYER => ', JSON.stringify(res))
        this.dataRank = res.listTopPlayer;

        for (let i = 0; i < this.dataRank.length; i++) {
            this.dataRank[i].index = i
        }

        this.tableView.dataSource = this;
        this.tableView.reloadData();

        this.loadDataTop(this.dataRank)
    }

    loadDataTop(data) {
        // {"nickName":"test1","currentMoney":1000,"avatar":"avatar","interest":5000
        let dt1 = data[0];
        let dt2 = data[1];

        if (dt1.avatar.includes('http')) {
            DragonTiger_Const.loadImgFromUrl(this.avt1, dt1.avatar)
        }
        this.lb_name1.string = dt1.nickName
        this.lb_chip1.string = DragonTiger_Const.formatAlignNumberWithK(dt1.interest)

        if (dt2.avatar.includes('http')) {
            DragonTiger_Const.loadImgFromUrl(this.avt2, dt2.avatar)
        }
        this.lb_name2.string = dt2.nickName
        this.lb_chip2.string = DragonTiger_Const.formatAlignNumberWithK(dt2.interest)
    }

    onClosePopup() {
        DragonTiger_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        this.node.removeFromParent();
    }
}
