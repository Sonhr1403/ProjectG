import { LANGUAGE, BCLanguageMgr } from "./BC.LanguageMgr";

export class LobbyConst {

    public static readonly OS = 1;
    // public static readonly GAME_MODE = false; // true -? live, false -> dev // 
    public static readonly GAME_MODE = BGUI.GameConfigZ.configFirstGame != null; // true -? live, false -> dev
    // public static readonly CURRENT_DOMAIN = LobbyConst.GAME_MODE  ? BGUI.GameConfigZ.configFirstGame['domainAPI'] : "http://10.10.10.11";
    // public static readonly CURRENT_PORT = LobbyConst.GAME_MODE ?  BGUI.GameConfigZ.configFirstGame['portAPI'] : ":8081/api?app_id=";
    public static readonly CURRENT_DOMAIN = LobbyConst.GAME_MODE ? BGUI.GameConfigZ.configFirstGame['domainAPI'] : "https://api-7kef7e.wiwatech.com";
    public static readonly CURRENT_PORT = LobbyConst.GAME_MODE ? BGUI.GameConfigZ.configFirstGame['portAPI'] : ":443/api?app_id=";
    // public static readonly CURRENT_DOMAIN = "http://172.16.10.249"; //test
    // public static readonly CURRENT_PORT = ":8081/api?app_id="; //test

    public static CHECK_GET_API_FIRST_GAME = false;
    public static DATA_TRANS_WORD = null
    public static CAN_SHOW_TOUR = false

    public static readonly GLOBAL_APP_ID = () => {
        let id = -1;
        if (cc.sys.isBrowser) {
            id = 11;
        } else {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                id = 13;
            }
            else if (cc.sys.os == cc.sys.OS_IOS) {
                id = 12;
            } else {
                id = 12;
            }
        }


        return id;
    }


    public static readonly APP_DEVICES = () => {
        return {
            id: BGUI.PlatformInterface.deviceID,
            model: BGUI.PlatformInterface.deviceModel,
            // deviceToken: BGUI.PlatformInterface.deviceToken,
            // phoneNumber: BGUI.PlatformInterface.phoneNumber,
            os_version: BGUI.PlatformInterface.OSVersion,
            // appVersion: BGUI.PlatformInterface.versionCode,
            package_name: BGUI.PlatformInterface.bundleID,
            os_name: BGUI.PlatformInterface.OSName,
        }
    }

    public static readonly GET_KEYID_BY_LANG = (lang: string) => {
        let x = "";
        switch (lang) {
            case LANGUAGE.VIETNAMESE:
                x = "vi-VN_1066";
                break;
            case LANGUAGE.ENGLISH:
                x = "en-US_1033";
                break;

        }
        return x;
    }

    public static readonly BASE_URL = LobbyConst.CURRENT_DOMAIN + LobbyConst.CURRENT_PORT + LobbyConst.GLOBAL_APP_ID() + "&"

    public static readonly API = { LOGIN: "", REGISTRY: "", }
    public static DATA_BANKS = null;
    public static NATION_NAME = "VN";
    public static USER_BUY_AND_SOLD = false;

    public static slotByKeys: Map<string, any[]> = new Map();
    public static RATE_TRANSFER_GOLD = { JP: 0, KR: 0, TW: 0, LA: 0, US: 0, VN: 0, LD: 0, WB: 0, JL: 0, BAHT: 0, MMK: 0, MM: 0, TH: 0, SG: 0, }

    public static readonly EVENT_NAME = {
        BUNDLEMINI_DOWNLOAD_SUCCESS: "BUNDLEMINI_DOWNLOAD_SUCCESS",
        BUNDLE_DOWNLOAD_FROM_ITEM_JACKPOT: "BUNDLE_DOWNLOAD_FROM_ITEM_JACKPOT",
        EVENT_UPDATE_JACKPOT: "EVENT_UPDATE_JACKPOT",
        CHANGE_TAB_UI: "CHANGE_TAB_UI",
        CHANGE_TAB_NATION: "CHANGE_TAB_NATION",
        EVENT_UPDATE_AVATAR: "EVENT_UPDATE_AVATAR",
        HEADER_INGAME: "HEADER_INGAME",
        REQUIRE_LOGIN: "REQUIRE_LOGIN",
        CHECK_DEVICE: "CHECK_DEVICE",
        AUTO_LOGIN_BY_TOKEN: "AUTO_LOGIN_BY_TOKEN",
    }
    public static readonly TAG_ID_GAME_LIVE = { CONST_GAME_LONG_HO: 201, CONST_GAME_LIVE_LONG_HO: 202, CONST_GAME_LIVE_XOC_DIA: 203, CONST_GAME_LIVE_BACARAT: 204, CONST_GAME_LIVE_ROULET: 205, CONST_GAME_LIVE_SICBO: 206 }
}
