import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import { PokerConnector } from "../../lobby/scripts/network/wss/PokerConnector";
import { Poker } from "./Poker.Cmd";
import PokerRoom from "./Poker.Room";
import PokerController from "./Poker.Controller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerRooms extends cc.Component {
    public static instance: PokerRooms = null;

    @property(cc.Node)
    public btnPlayingNow: cc.Node = null;

    @property(cc.Prefab)
    public prefabItemRoom: cc.Prefab = null;

    @property(cc.Node)
    public contentListRooms: cc.Node = null;

    private dataRooms: object = {};

    onLoad() {
        PokerRooms.instance = this;
        PokerConnector.instance.addCmdListener(BGUI.CmdDefine.DISCONNECTED, this.backToLobby, this);
        PokerConnector.instance.addCmdListener(Poker.Cmd.CMD_LIST_ROOMS, this.responseGetListRooms, this);
    }

    onDestroy() {
        PokerConnector.instance.removeCmdListener(this, Poker.Cmd.CMD_LIST_ROOMS);
    }

    private responseGetListRooms(cmdId: any, data: Uint8Array) {
        let res = new Poker.ReceivedGetListRooms();
        res.unpackData(data);
        console.error("HHHH CMD_LIST_ROOMS", res);
        this._handleGetListRoom(res);
    }

    private _handleGetListRoom(res: Poker.ReceivedGetListRooms): void {

        this.dataRooms = {};

        let rooms = {
            "5000": "1",
            "10000": "1",
            "25000": "1",
            "60000": "1",
            "150000": "1",
            "400000": "1",
            "800000": "1",
            "1500000": "1",
            "4000000": "1",
            "8000000": "1",
        };

        for (let i = 0; i < res.list.length; i++) {
            const roomTypeData = res.list[i];
            let key = roomTypeData.moneyBet;
            if (rooms[key]) {
                if (this.dataRooms[key]) {
                    this.dataRooms[key].options.push({
                        id: roomTypeData.id,
                        rule: roomTypeData.rule,
                    });
                    this.dataRooms[key].userCount = this.dataRooms[key].userCount + roomTypeData.totalUser;
                } else {
                    this.dataRooms[key] = roomTypeData;
                    this.dataRooms[key].bg = rooms[key];
                    this.dataRooms[key].userCount = roomTypeData.totalUser;
                    this.dataRooms[key].requiredMoney = roomTypeData.minMoney;
                    this.dataRooms[key].buyInRanger = [roomTypeData.minMoney, roomTypeData.maxMoney];
                    this.dataRooms[key].options = [{
                        id: roomTypeData.id,
                        rule: roomTypeData.rule,
                    }];
                }
            }
        }

        console.log('handleGetListRoom');
        // Poker.Send.sendJoinRoom(res.list[0], 500000, false);
        this.reloadListRoom();
    }

    private reloadListRoom() {
        // this.btnPlayingNow.active = true;
        this.contentListRooms.removeAllChildren(true);
        console.log("this.dataRooms", this.dataRooms);
        for (let key in this.dataRooms) {
            let itemRoom = this.dataRooms[key];
            let prefabItemRoom = cc.instantiate(this.prefabItemRoom);
            let objRoom = prefabItemRoom.getComponent(PokerRoom);
            objRoom.renderRoom(itemRoom);
            this.contentListRooms.addChild(prefabItemRoom);
        }
    }

    public onClickPlayingNow() {
        let minMoneyReq = 8000000;
        let maxMoneyReq = 0;
        let joinRoomIndex = -1;
        for (let index = 0; index < this.contentListRooms.childrenCount; index++) {
            let roomItem = this.contentListRooms.children[index].getComponent(PokerRoom);
            minMoneyReq = Math.min(minMoneyReq, roomItem.roomInfo["requiredMoney"]);
            maxMoneyReq = Math.max(maxMoneyReq, roomItem.roomInfo["maxJoin"][0]);
            if (maxMoneyReq < BGUI.UserManager.instance.mainUserInfo.vinTotal) {
                joinRoomIndex = index
            }
        }
        if (BGUI.UserManager.instance.mainUserInfo.vinTotal < minMoneyReq)
            BGUI.UIPopupManager.instance.showPopup(LanguageMgr.getString("boogyi.not_enough_gold_please_deposit"));
        else {
            if (joinRoomIndex >= 0) {
                let roomItem = this.contentListRooms.children[joinRoomIndex].getComponent(PokerRoom);
                this.sendJoinRoomType(roomItem.roomInfo);
            } else {
                BGUI.UIPopupManager.instance.showPopup(LanguageMgr.getString("boogyi.no_valid_table_found"));
            }
        }
    }

    public sendJoinRoomType(infoRoom: Poker.ImpRoom) {
        Poker.Send.sendJoinRoom(infoRoom);
    }

    public backToLobby() {
        BGUI.GameCoreManager.instance.onBackToLobby();
    }

}
