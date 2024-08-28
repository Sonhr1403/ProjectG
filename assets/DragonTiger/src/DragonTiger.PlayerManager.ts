import { IDataPlayer } from "./DragonTiger.Const";
import DragonTiger_GameManager from "./DragonTiger.GameManager";
import DragonTiger_Player from "./DragonTiger.Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonTiger_PlayerManager extends cc.Component {

    @property(DragonTiger_Player)
    listPlayer: Array<DragonTiger_Player> = [];

    listMorePlayer: Array<IDataPlayer> = []
    _listDataPlayer: Array<IDataPlayer> = []

    @property(cc.Label)
    lbNumMorePlayer: cc.Label = null

    onLoad(): void {
        this._hideAllPlayer();
    }

    private _hideAllPlayer() {
        this.listPlayer.forEach(e => {
            if (e) {
                e.node.active = false;
            }
        })
    }

    getSlotIdxByNickName(name: string): number {
        if (name === '')
            return 8;

        let index = this.listPlayer.findIndex((e: DragonTiger_Player) => {
            return e.getNickName().toUpperCase() === name.toUpperCase();
        });

        if (index === -1)
            index = 8;

        return index;
    }

    setData(data) {
        if (!data) {
            BGUI.ZLog.error('IDataPlayer -> null')
            return;
        }
        this._listDataPlayer = [];
        this._hideAllPlayer();
        // this.cleanUp();


        // this._listDataPlayer = data

        // this._listDataPlayer = this._listDataPlayer.concat(data);
        // BGUI.ZLog.log(' DragonTiger_PlayerManager ->', data)
        //tìm mình
        let myData = data.find(e => {
            return e.nickName.toUpperCase() === BGUI.UserManager.instance.mainUserInfo.nickname.toUpperCase();
        })

        if (myData) {
            BGUI.ZLog.log("myData--------->" + JSON.stringify(myData));
            this.listPlayer[0].getComponent(DragonTiger_Player).setPlayerInfo(myData);
            BGUI.UserManager.instance.mainUserInfo.vinTotal = myData.currentMoney;
        }

        //case còn những thằng còn lại
        this._listDataPlayer = data.filter(e => {
            return e.nickName.toUpperCase() !== BGUI.UserManager.instance.mainUserInfo.nickname.toUpperCase();
        })

        this._listDataPlayer.forEach(e => {
            if (e) {
                this._refreshView(e)
            }
        });
    }

    joinRoom(data) {
        this.lbNumMorePlayer.string = data.userOutTable + ''

        let playerNew = data.listPlayers;
        for (let pl of playerNew) {
            let isJoin = true;
            for (let pl1 of this._listDataPlayer) {
                if (pl.nickName === pl1.nickName) {
                    isJoin = false;
                    break;
                }
            }

            if (isJoin) {
                this._refreshView(pl)
            }
        }
        this._listDataPlayer = []
        this._listDataPlayer = playerNew
    }

    private _refreshView(itemPlayer) {
        //check xem những chỗ nào chưa có người ngồi
        let listViewNotActive = this.listPlayer.filter(e => {
            if (e) {
                return e.node.active != true;
            }
        })

        if (listViewNotActive.length - 1 == 0) { // vì đang add 7 thằng chơi
            return;
        };

        BGUI.ZLog.log('setPlayerInfo = ', itemPlayer, listViewNotActive.length)
        listViewNotActive[0].getComponent(DragonTiger_Player).setPlayerInfo(itemPlayer);
    }

    //2207
    leaveRoom(data) {
        this.lbNumMorePlayer.string = data.userOutTable + ''

        let playerNew = data.listPlayers;
        for (let pl of this._listDataPlayer) {
            let isLeave = true;
            for (let pl1 of playerNew) {
                if (pl.nickName === pl1.nickName) {
                    isLeave = false;
                    break;
                }
            }

            if (isLeave) {
                let nPlayer = this.listPlayer.find(e => {
                    return e.getComponent(DragonTiger_Player).getNickName().toUpperCase() === pl.nickName.toUpperCase();
                })

                if (nPlayer) {
                    nPlayer.getComponent(DragonTiger_Player).leaveRoom();
                }
            }
        }

        for (let pl of playerNew) {
            let isJoin = true;
            for (let pl1 of this._listDataPlayer) {
                if (pl.nickName === pl1.nickName) {
                    isJoin = false;
                    break;
                }
            }

            if (isJoin) {
                this._refreshView(pl)
            }
        }
        this._listDataPlayer = []
        this._listDataPlayer = playerNew
    }

    cleanUp() {
        // this.listPlayer.forEach((e:  DragonTiger_Player) => {
        //     if (e) {
        //         e.cleanUp();
        //     }
        // });
    }
}
