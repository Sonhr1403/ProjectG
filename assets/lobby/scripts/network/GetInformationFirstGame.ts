

import { LobbyConst } from "../../LobbyConst";
import BOOGYIConnector from "./wss/BOOGYIConnector";
import SHWESHANConnector from "./wss/SHWESHANConnector";
import SKMConnector from "./wss/SKMConnector";
import BauCuaConnector from "./wss/BauCuaConnector";


import { PokerConnector } from "./wss/PokerConnector";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GetInforFirstGame extends cc.Component {
    onEnable() {
        BGUI.EventDispatch.instance.add(BGUI.EVENT_GAMECORE.LOGOUT, this.onLogOut, this);
        this.sendAPIGetGameInfo();
    }

    onDisable() {
        BGUI.EventDispatch.instance.remove(BGUI.EVENT_GAMECORE.LOGOUT, this.onLogOut, this);
    }

    onGetInfo() {
        var url = this.urlGetConfig() + '?v=' + Date.now();
        BGUI.Https.get(url, (response) => {
            BGUI.UIWaitingLayout.hideWaiting();
            if (!response) {
                LobbyConst.CHECK_GET_API_FIRST_GAME = false;
                let mess = "Load API First Game Fail!";
                var listAction = [
                    BGUI.PopupAction.make("OK", () => {
                        this.sendAPIGetGameInfo();
                    }),
                ]
                BGUI.UIPopupManager.instance.showPopupSmall(mess, listAction);
                return;
            }
            var jsonData = response;
            if (BGUI.GameConfigZ.configFirstGame) {
                BGUI.GameConfigZ.configFirstGame['jsonData'] = response;
                console.log(BGUI.GameConfigZ.configFirstGame)
            }
           
         
            BGUI.NetworkPortal.instance.HOST = jsonData.minigame.ip;
            BGUI.NetworkPortal.instance.PORT = jsonData.minigame.port;

            SKMConnector.instance.HOST = jsonData.shan.ip;
            SKMConnector.instance.PORT = jsonData.shan.port;

            BOOGYIConnector.instance.HOST = jsonData.boogyi.ip;
            BOOGYIConnector.instance.PORT = jsonData.boogyi.port;

            BauCuaConnector.instance.HOST = jsonData.baucua.ip;
            BauCuaConnector.instance.PORT = jsonData.baucua.port;


            SHWESHANConnector.instance.HOST = jsonData.shweshan.ip;
            SHWESHANConnector.instance.PORT = jsonData.shweshan.port;
            

            PokerConnector.instance.HOST = jsonData.poker.ip;
            PokerConnector.instance.PORT = jsonData.poker.port;

            LobbyConst.CHECK_GET_API_FIRST_GAME = true;
        })
    }

    public sendAPIGetGameInfo() {
        this.onGetInfo();
    }

    onLogOut() {
        BGUI.NetworkPortal.instance.disconnect();
        SKMConnector.instance.disconnect();
        BOOGYIConnector.instance.disconnect();
        SHWESHANConnector.instance.disconnect();
    }

    urlGetConfig() {
        var os = BGUI.PlatformInterface.OSName;
        if (os == "android")
            os = "ad"
        BGUI.ZLog.log(os);
        var did = ''
        let accessTokenUrl = '';
        let BASE_URL = LobbyConst.BASE_URL;
        var url = BASE_URL + "app_id=" + '11' + '&c=6&v=' + '1.0' + '&pf=' + os + '&did=' + did + '&at=' + accessTokenUrl
        return url;
    }
}

