// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import { LobbyCmdId, LobbyConst } from "../LobbyConst";
import { cmdReceive } from "./network/LobbyReceive";

const { ccclass, property } = cc._decorator;
@ccclass
export default class CanvasAlwaysShow extends cc.Component {
    onEnable(): void {

     
        BGUI.EventDispatch.instance.add("REQUIRE_LOGIN", this.onShowGUILogin, this);
        BGUI.EventDispatch.instance.add("HEADER_INGAME", this.onShowHeaderInGame, this);
        BGUI.EventDispatch.instance.add(LobbyConst.EVENT_NAME.CHECK_DEVICE, this.onCheckDevice, this);

        BGUI.EventDispatch.instance.add(BGUI.EVENT_GAMECORE.LOGOUT, this.logOut, this);
        BGUI.EventDispatch.instance.add(BGUI.EVENT_GAMECORE.LOGIN_SUCCESS, this.onLoginSucess, this);
        BGUI.NetworkPortal.instance.addCmdListener(LobbyCmdId.MN_UPDATE_USER_INFO, this.onUpdateInfo, this);
        BGUI.NetworkPortal.instance.addCmdListener(LobbyCmdId.BACK_TO_LOBBY_LIVEGAME, this.onBackToLobbyLiveGame, this);
    }

    onBackToLobbyLiveGame(){
        BGUI.GameCoreManager.instance.onBackToLobby();
    }

    onCheckDevice(){
        
    }

    onUpdateInfo(cmdId: any, data: Uint8Array){
        let res = new cmd.ResUpdateMoney();
        res.unpackData(data);
        BGUI.ZLog.log(res)
        let totalMoney = BGUI.UserManager.instance.mainUserInfo.vinTotal;
        totalMoney = res.currentMoney;
        BGUI.EventDispatch.instance.emit(BGUI.EVENT_GAMECORE.UPDATE_TOTAL_GOLD, totalMoney);
    }

    logOut() {
        BGUI.ZLog.log('<---------------- LOG OUT --------------------->')
        BGUI.NetworkPortal.instance.removeCmdListener(LobbyCmdId.LOBBY_DISCONNECT);
        BGUI.NetworkPortal.instance.removeCmdListener(LobbyCmdId.MN_UPDATE_USER_INFO);

        BGUI.GameCoreManager.instance.isLoginSuccess = false;
        BGUI.NetworkPortal.instance.removeCmdListener(this, LobbyCmdId.MN_UPDATE_USER_INFO);
        BGUI.UserManager.instance.mainUserInfo = null;
        BGUI.UIPopupManager.instance.removeAllPopups();
        BGUI.UIWindowManager.instance.removeAllWindows();
        BGUI.UIScreenManager.instance.popToRootScreen();
        BGUI.NetworkPortal.instance.disconnect()
        this._removeFadeBG();
    }



    private _removeFadeBG() {
        if (BGUI.UIWindowManager.instance.fadedBackground.active)
            BGUI.UIWindowManager.instance.fadedBackground.active = false;
    }




    onLoginSucess() {
        BGUI.NetworkPortal.instance.addCmdListener(LobbyCmdId.LOBBY_DISCONNECT, this.reponseStatusLogin, this);
    }

    reponseStatusLogin(type) {
        this.logOut();
        let mess = "";
        if (parseInt(type) == 1) {
            mess = LanguageMgr.getString("lobby.warning.account_logining_please_logout");
        } else {
            mess = LanguageMgr.getString("lobby.warning.account_logining_please_logout");
        }
        // BGUI.UIPopupManager.instance.showPopup(mess);


        var listAction = [
            BGUI.PopupAction.make(LanguageMgr.getString("alert.ok"), () => {
                BGUI.EventDispatch.instance.emit(BGUI.EVENT_GAMECORE.LOGOUT);

            }),
        ]

        BGUI.UIPopupManager.instance.showPopup(mess, listAction);
    }


    onDisable() {
        BGUI.EventDispatch.instance.remove("REQUIRE_LOGIN", this.onShowGUILogin, this);
        BGUI.EventDispatch.instance.remove("HEADER_INGAME", this.onShowHeaderInGame, this);
        BGUI.NetworkPortal.instance.removeCmdListener(LobbyCmdId.LOBBY_DISCONNECT);
        BGUI.EventDispatch.instance.remove(BGUI.EVENT_GAMECORE.LOGIN_SUCCESS, this.onLoginSucess, this);
    }

    onShowGUILogin() {
        BGUI.UIPopupManager.instance.removeAllPopups();
        let bundle = "Lobby";
        let prfAttendance = "prefabs/login/Prefab_Login";
        BGUI.BundleManager.instance.getPrefabFromBundle(prfAttendance, bundle, (prf: cc.Prefab) => {
            BGUI.UIPopupManager.instance.showPopupFromPrefab(prf);
        })
    }

    onShowHeaderInGame() {
        BGUI.ZLog.log("onShowHeaderInGame============>")
        let bundle = "Lobby";
        let prfHeader_InGame = "prefabs/Header_InGame";
        BGUI.BundleManager.instance.getPrefabFromBundle(prfHeader_InGame, bundle, (prf: cc.Prefab) => {
            if (!cc.Canvas.instance.node.getChildByName('Header_InGame')) {
                let node = cc.instantiate(prf)
                node.name = "Header_InGame";
                cc.Canvas.instance.node.addChild(node, BGUI.GameCoreManager.instance.nLayerMiniGame.zIndex);
            }
        })
    }


}
