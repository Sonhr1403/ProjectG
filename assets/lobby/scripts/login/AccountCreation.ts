import { LanguageMgr } from "../../../framework/localize/LanguageMgr";

import { LobbyConst } from "../../LobbyConst";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DemoLogin extends BGUI.UIPopup {
    @property(cc.EditBox)
    edbAccount: cc.EditBox = null;

    @property(cc.EditBox)
    edbPass: cc.EditBox = null;
    
    @property(cc.EditBox)
    edbRePass: cc.EditBox = null;
    @property(cc.EditBox)
    edbEmail: cc.EditBox = null;
    @property(cc.EditBox)
    edbPhone: cc.EditBox = null;

    @property(cc.Toggle)
    toggleSaveAccount: cc.Toggle = null;
    
    @property(cc.Prefab)
    prefabCreateAccount: cc.Prefab = null;

     
    onLoad() {  
        let username = BGUI.ClientData.getString("USER_NAME", "");
        let pass = BGUI.ClientData.getString("PASSWORD", "");
        if (username != "" && pass != "") {
            this.edbAccount.string = username;
            this.edbPass.string = pass;
        }
        let data = cc.sys.localStorage.getItem("current_user_info_login");
        if (data)
            BGUI.EventDispatch.instance.add(LobbyConst.EVENT_NAME.AUTO_LOGIN_BY_TOKEN, this.hide, this);
    }

    onDisable() {
        let data = cc.sys.localStorage.getItem("current_user_info_login");
        if (data)
            BGUI.EventDispatch.instance.remove(LobbyConst.EVENT_NAME.AUTO_LOGIN_BY_TOKEN, this.hide, this);
    }

    onClickLogin() {
        var userName = this.edbAccount.string.trim();
        userName = userName.toLowerCase()
        var pass = this.edbPass.string.trim();

        if (userName.length <= 0) {
            BGUI.UIPopupManager.instance.showPopup(LanguageMgr.getString("lobby.warning.account_not_enter"));
            return;
        }
        if (pass.length <= 0) {
            BGUI.UIPopupManager.instance.showPopup(LanguageMgr.getString("lobby.warning.password_not_enter"));
            return;
        }

        BGUI.UIWaitingLayout.showWaiting();
        let username = this.edbAccount.string;
        let pwd = window.md5(this.edbPass.string);
        let url = this.urlLogin(username, pwd, BGUI.PlatformInterface.OSName);
        BGUI.Https.get(url, (response) => {
            BGUI.UIWaitingLayout.hideWaiting();
            this.onLoginSucess(response)
        })
    }


    onLoginSucess(response) {
        var jsonData = response;
        var success = jsonData['success']
        var errorCode = jsonData['errorCode'];
        if (success) {

            BGUI.GameCoreManager.instance.isLoginSuccess = true;
            var sessionKey = jsonData['sessionKey'];
            var userData = JSON.parse(this.Jacob__Codec__Base64__decode(sessionKey));
            cc.sys.localStorage.setItem("current_user_info_login", JSON.stringify(response));
            BGUI.UserManager.instance.mainUserInfo = userData;
            BGUI.UserManager.instance.mainUserInfo.sessionKey = jsonData['sessionKey'];
            BGUI.UserManager.instance.mainUserInfo.accessToken = jsonData['accessToken'];
            BGUI.UserManager.instance.mainUserInfo.identification = jsonData['id'];
            BGUI.UserManager.instance.mainUserInfo.game = jsonData['game'];
            BGUI.UserManager.instance.mainUserInfo.reference = jsonData["reference"];

            cc.log(userData)
            cc.log(LanguageMgr.instance.getCurrentLanguage())

            if (this.toggleSaveAccount && this.toggleSaveAccount.isChecked) {
                BGUI.ClientData.setString("USER_NAME", this.edbAccount.string);
                BGUI.ClientData.setString("PASSWORD", this.edbPass.string);
            } else {
                this.edbAccount.string = '';
                this.edbPass.string = '';

                BGUI.ClientData.setString("USER_NAME", this.edbAccount.string);
                BGUI.ClientData.setString("PASSWORD", this.edbPass.string);
            }
            BGUI.UserManager.instance.mainUserInfo.username = this.edbAccount.string;
            BGUI.EventDispatch.instance.emit(BGUI.EVENT_GAMECORE.LOGIN_SUCCESS);
            if (!BGUI.NetworkPortal.instance.isConnected())
                BGUI.NetworkPortal.instance.connect();
         

            this.hide();
            
        } else {
            let message = '';
            switch (parseInt(errorCode)) {
                case 1001:
                    message = LanguageMgr.getString("lobby.warning.server_lost_connect");
                    var listAction = [
                        BGUI.PopupAction.make("Retry", () => {
                          
                        }),
                      ];
                    break;
                case 4444:
                    message = LanguageMgr.getString("lobby.warning.account_logining_please_logout");
                    break;
                case 1109:
                    message = LanguageMgr.getString("lobby.warning.account_banning");
                    break;
                case 1008:
                    message = LanguageMgr.getString("lobby.warning.invalid_authentication_code");
                    break;
                case 1021:
                    message = LanguageMgr.getString("lobby.warning.overtime_authentication");
                    break;
                case 1114:
                    message = LanguageMgr.getString("lobby.warning.server_maintain_go_later");
                    break;
                case 1007:
                    message = LanguageMgr.getString("lobby.warning.password_wrong");
                    break;
                case 1109:
                    message = LanguageMgr.getString("lobby.warning.login_banned");
                    break;
                case 1005:
                    message = LanguageMgr.getString("lobby.warning.unexist_user");
                    break;
                case 2001:
                    message = LanguageMgr.getString("lobby.warning.you_not_create_username");
                    break;

            }

            if (message != '' && message != undefined && message != "undefined") {
                BGUI.UIPopupManager.instance.showPopupSmall(message, listAction);
            }

            // if (errorCode == 2001) {
            //     this.hide();
            // }
        }
    }





    urlLogin(username, password, platform) {
        let BASE_DOMAIN = LobbyConst.CURRENT_DOMAIN;
        let BASE_PORT = LobbyConst.CURRENT_PORT;
        let BASE_APP_ID = LobbyConst.GLOBAL_APP_ID();
        let accessTokenUrl = '';
        let BASE_URL = BASE_DOMAIN + BASE_PORT + BASE_APP_ID + "&"
        // let lang = LobbyConst.GET_KEYID_BY_LANG(LanguageMgr.instance.getCurrentLanguage());
        let lang = "en-US_1033";
        let devices = LobbyConst.APP_DEVICES;
        let di = JSON.stringify(devices);
        return BASE_URL + 'c=3&un=' + username + '&pw=' + password + '&pf=' + platform + '&at=' + accessTokenUrl + "&lang=" + lang + "&di=" + di;
    }

    Jacob__Codec__Base64__decode(input) {
        var _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
        let output: any = [],
            chr1, chr2, chr3,
            enc1, enc2, enc3, enc4,
            i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')

        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++))
            enc2 = _keyStr.indexOf(input.charAt(i++))
            enc3 = _keyStr.indexOf(input.charAt(i++))
            enc4 = _keyStr.indexOf(input.charAt(i++))

            chr1 = (enc1 << 2) | (enc2 >> 4)
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
            chr3 = ((enc3 & 3) << 6) | enc4

            output.push(String.fromCharCode(chr1))

            if (enc3 != 64) {
                output.push(String.fromCharCode(chr2))
            }
            if (enc4 != 64) {
                output.push(String.fromCharCode(chr3))
            }
        }

        output = output.join('')

        return output
    }

    createAccount(){
        BGUI.UIPopupManager.instance.showPopupFromPrefab(this.prefabCreateAccount)
    }
}
