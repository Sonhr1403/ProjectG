// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { IDataPlayer } from "./Bacarrat.Const";
import Bacarrat_GameManager from "./Bacarrat.GameManager";
import Bacarrat_Player from "./Bacarrat.Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bacarrat_PlayerManager extends cc.Component {

    @property(Bacarrat_Player)
    listPlayer: Array<Bacarrat_Player> = [];

    listMorePlayer: Array<IDataPlayer> = []
    _listDataPlayer: Array<IDataPlayer> = []


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
        let index = this.listPlayer.findIndex((e: Bacarrat_Player) => {
            return e.getNickName().toUpperCase() === name.toUpperCase();
        });

        if (index == -1)
            index = 6;

        return index;
    }

    setData(data) {
        if (!data) {
            BGUI.ZLog.error('IDataPlayer -> null')
            return;
        }
        this._listDataPlayer = [];
        this._hideAllPlayer();
        this.cleanUp();


        this._listDataPlayer = this._listDataPlayer.concat(data);
        BGUI.ZLog.log('Bacarrat_PlayerManager ->', data)
        // BGUI.ZLog.log(' this._listDataPlayer ->',  this._listDataPlayer.length)
        //tìm mình
        let myData = this._listDataPlayer.find(e => {
            return e.nickName.toUpperCase() === BGUI.UserManager.instance.mainUserInfo.nickname.toUpperCase();
        })
        this.listPlayer[0].getComponent(Bacarrat_Player).setPlayerInfo(myData);

        // BGUI.ZLog.log("myData--------->" + JSON.stringify(myData));
        BGUI.UserManager.instance.mainUserInfo.vinTotal = myData.currentMoney;

        //case còn những thằng còn lại

        let listOther = this._listDataPlayer.filter(e => {
            return e.nickName.toUpperCase() !== BGUI.UserManager.instance.mainUserInfo.nickname.toUpperCase();
        })

        listOther.forEach(e => {
            if (e) {
                this._refreshView(e)
            }
        });
    }


    //joinroom
    addPlayer(data) {
        BGUI.ZLog.log('Bacarrat_PlayerManager  addPlayer ->', data)
        let itemPlayer = {
            nickName: data.nickName,
            displayName: data.displayName,
            avatar: data.avatar,
            currentMoney: data.currentMoney,
        };
        this._listDataPlayer.push(itemPlayer);
        this._refreshView(itemPlayer)
    }

    private _refreshView(itemPlayer) {
        //check xem những chỗ nào chưa có người ngồi
        let listViewNotActive = this.listPlayer.filter(e => {
            if (e) {
                return e.node.active != true;
            }
        })
        if (listViewNotActive.length - 1 == 0) { // vì đang add 7 thằng chơi
            this.listMorePlayer.push(itemPlayer);
            Bacarrat_GameManager.instance.lbNumMorePlayer.string = this.listMorePlayer.length + "";
            return;
        };
        //random vị trí ngồi còn lại
        // let idx = BGUI.Utils.randomInt(0, listViewNotActive.length - 1)
        let idx = 0;
        BGUI.ZLog.log('_refreshView  addPlayer ->', idx)
        listViewNotActive[idx].getComponent(Bacarrat_Player).setPlayerInfo(itemPlayer);
    }


    private _removeUserInListMore(data) {
        let index = -1;
        for (let m = 0; m < this.listMorePlayer.length; m++) {
            if (this.listMorePlayer[m].nickName.toUpperCase() === data.nickName.toUpperCase()) {
                index = m;
                break;
            }
        }

        if (index !== -1) {
            this.listMorePlayer.splice(index, 1);
            Bacarrat_GameManager.instance.lbNumMorePlayer.string = this.listMorePlayer.length + "";
        }
    }


    leaveRoom(data) {
        //tìm thằng bỏ mẹ nào đó rời khỏi room
        if (this._listDataPlayer.length == 1) {
            BGUI.ZLog.error('Còn mỗi mình thôi máaaa -> ')
            return;
        }

        if (data.nickName.toUpperCase() === BGUI.UserManager.instance.mainUserInfo.nickname.toUpperCase()) {
            BGUI.ZLog.error('Ko xóa mình')
            return;
        }

        let dataOutRoom = this._listDataPlayer.find(e => {
            if (e) {
                return e.nickName.toUpperCase() === data.nickName.toUpperCase();
            }
        })

        BGUI.ZLog.log('Bacarrat_PlayerManager dataOutRoom---> ', dataOutRoom);
        //check xem nó ngồi ở ghế ko hay ở chỗ listMore?

        if (dataOutRoom === undefined) {
            BGUI.ZLog.error('Có đâu mà xóa')
            return;
        }

        let nSetting = this.listPlayer.find(e => {
            return e.getComponent(Bacarrat_Player).getNickName().toUpperCase() === dataOutRoom.nickName.toUpperCase();
        })

        BGUI.ZLog.log(nSetting);

        if (nSetting != null) {
            nSetting.getComponent(Bacarrat_Player).leaveRoom();
            //update thêm user vô
            if (this.listMorePlayer.length > 0) {
                nSetting.getComponent(Bacarrat_Player).setPlayerInfo(this.listMorePlayer[0]);
                this._removeUserInListMore(this.listMorePlayer[0]);
            }
        } else {
            this._removeUserInListMore(data);
        }

        var index = this._listDataPlayer.indexOf(data);
        if (index !== -1) {
            this._listDataPlayer.splice(index, 1);
        }
    }

    cleanUp() {
        // this.listPlayer.forEach((e: Bacarrat_Player) => {
        //     if (e) {
        //         e.cleanUp();
        //     }
        // });
    }
}
