import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import BOOGYIConnector from "../../lobby/scripts/network/wss/BOOGYIConnector";
import BOOGYICmd from "./BOOGYI.Cmd";
import BOOGYIItemRoom from "./BOOGYI.ItemRoom";
import BOOGYIController from "./BOOGYI.Controller";
const { ccclass, property } = cc._decorator;

@ccclass
export default class BOOGYILobbyRoom extends cc.Component {
    public static instance: BOOGYILobbyRoom = null;

    @property(cc.Node)
    public btnPlayingNow: cc.Node = null;

    @property(cc.Prefab)
    public prefabItemRoom: cc.Prefab = null;

    @property(cc.Node)
    public contentListRooms: cc.Node = null;

    private dataRooms: object = {};

    onLoad() {
        BOOGYILobbyRoom.instance = this;
        BOOGYIConnector.instance.addCmdListener(BGUI.CmdDefine.DISCONNECTED, this.backToLobby, this);
        BOOGYIConnector.instance.addCmdListener(BOOGYICmd.Code.GET_LIST_ROOM_TYPE, this.responseGetListRoomType, this);
        BOOGYIConnector.instance.addCmdListener(BOOGYICmd.Code.MONEY_BET_CONFIG, this.responseMoneyBetConfig, this);
    }

    onDestroy() {
        BOOGYIConnector.instance.removeCmdListener(this, BOOGYICmd.Code.GET_LIST_ROOM_TYPE);
    }

    private responseMoneyBetConfig(cmdId: any, data: Uint8Array) {
        let res = new BOOGYICmd.ResMoneyBetConfig();
        res.unpackData(data);
        console.error("HHHH MONEY_BET_CONFIG", res);
        this.dataRooms = res.list;
        this.reloadListRoom();
    }

    private responseGetListRoomType(cmdId: any, data: Uint8Array) {
        this.unschedule(BOOGYIController.instance.logTime);
        let res = new BOOGYICmd.ReceivedGetListRoomType();
        res.unpackData(data);
        console.error("HHHH GET_LIST_ROOM_TYPE", res);
        this._handleGetListRoom(res);
    }

    private _handleGetListRoom(res: BOOGYICmd.ReceivedGetListRoomType): void {

        this.dataRooms = {};

        let rooms = {
            "1000": "1",
            "5000": "1",
            "20000": "2",
            "50000": "2",
            "100000": "3",
            "500000": "3"
        };

        for (let i = 0; i < res.list.length; i++) {
            let key = res.list[i].moneyBet;
            if (rooms[key]) {
                const roomTypeData = res.list[i];
                this.dataRooms[key] = roomTypeData;
                this.dataRooms[key].bg = rooms[key];
                this.dataRooms[key].userCount = roomTypeData.totalUser;
                this.dataRooms[key].requiredMoney = roomTypeData.minMoney;
                if (!roomTypeData.maxMoney) {
                    this.dataRooms[key].maxJoin = [roomTypeData.minMoney]
                } else {
                    this.dataRooms[key].maxJoin = [roomTypeData.minMoney, roomTypeData.maxMoney]
                }
            }
        }
        this.reloadListRoom();
    }

    private reloadListRoom() {
        // this.btnPlayingNow.active = true;
        this.contentListRooms.removeAllChildren(true);
        for (let key in this.dataRooms) {
            let itemRoom = this.dataRooms[key];
            let prefabItemRoom = cc.instantiate(this.prefabItemRoom);
            let _BOOGYIItemRoom = prefabItemRoom.getComponent(BOOGYIItemRoom);
            _BOOGYIItemRoom.renderRoom(itemRoom);
            this.contentListRooms.addChild(prefabItemRoom);
        }
    }

    public onClickPlayingNow() {
        let minMoneyReq = 8000000;
        let maxMoneyReq = 0;
        let joinRoomIndex = -1;
        for (let index = 0; index < this.contentListRooms.childrenCount; index++) {
            let roomItem = this.contentListRooms.children[index].getComponent(BOOGYIItemRoom);
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
                let roomItem = this.contentListRooms.children[joinRoomIndex].getComponent(BOOGYIItemRoom);
                this.sendJoinRoomType(roomItem.roomInfo);
            } else {
                BGUI.UIPopupManager.instance.showPopup(LanguageMgr.getString("boogyi.no_valid_table_found"));
            }
        }
    }

    public sendJoinRoomType(infoRoom: BOOGYICmd.ImpRoomTypeInfo) {
        try {
            let pk = new BOOGYICmd.SendJoinRoomType()
            pk.id = infoRoom.id;
            pk.moneyBet = infoRoom.moneyBet;
            pk.minMoney = infoRoom.minMoney;
            pk.maxMoney = infoRoom.maxMoney;
            pk.maxUserPerRoom = infoRoom.maxUserPerRoom;
            BOOGYIConnector.instance.sendPacket(pk)
        } catch (error) {
            console.error("Error:", error)
        }
    }

    public backToLobby() {
        BGUI.GameCoreManager.instance.onBackToLobby();
    }

}
