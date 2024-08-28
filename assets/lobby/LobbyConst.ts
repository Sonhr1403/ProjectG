import { LANGUAGE, LanguageMgr } from "../framework/localize/LanguageMgr";

export class LobbyConst {

    public static readonly OS = 1;
    // public static readonly GAME_MODE = false; // true -? live, false -> dev // 
    public static readonly GAME_MODE = BGUI.GameConfigZ.configFirstGame != null; // true -? live, false -> dev
    // public static readonly CURRENT_DOMAIN = LobbyConst.GAME_MODE  ? BGUI.GameConfigZ.configFirstGame['domainAPI'] : "http://10.10.10.11";
    // public static readonly CURRENT_PORT = LobbyConst.GAME_MODE ?  BGUI.GameConfigZ.configFirstGame['portAPI'] : ":8081/api?app_id=";

    ///test máy huế
    public static readonly CURRENT_DOMAIN = LobbyConst.GAME_MODE  ? BGUI.GameConfigZ.configFirstGame['domainAPI'] : "http://172.26.160.1";
    public static readonly CURRENT_PORT = LobbyConst.GAME_MODE ?  BGUI.GameConfigZ.configFirstGame['portAPI'] : ":8081/api?app_id=";

    ////server 7
    // public static readonly CURRENT_DOMAIN = LobbyConst.GAME_MODE  ? BGUI.GameConfigZ.configFirstGame['domainAPI'] : "https://api-7kef7e.wiwatech.com";
    // public static readonly CURRENT_PORT = LobbyConst.GAME_MODE ?  BGUI.GameConfigZ.configFirstGame['portAPI'] : ":443/api?app_id=";


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

    public static readonly API = {
        LOGIN: "",
        REGISTRY: "",

    }

    


    public static DATA_BANKS = null;
    public static NATION_NAME = "VN";
    public static USER_BUY_AND_SOLD = false;

    public static slotByKeys: Map<string, any[]> = new Map();


    public static RATE_TRANSFER_GOLD = {
        JP: 0,
        KR: 0,
        TW: 0,
        LA: 0,
        US: 0,
        VN: 0,
        LD: 0,
        WB: 0,
        JL: 0,
        BAHT: 0,
        MMK:0,
        MM:0,
        TH:0,
        SG:0,
    }

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
    public static readonly TAG_ID_GAME_LIVE = {
        CONST_GAME_LONG_HO: 201,
        CONST_GAME_LIVE_LONG_HO: 202,
        CONST_GAME_LIVE_XOC_DIA: 203,
        CONST_GAME_LIVE_BACARAT: 204,
        CONST_GAME_LIVE_ROULET: 205,
        CONST_GAME_LIVE_SICBO: 206
    }
}

export class LobbyCmdId {
    public static readonly USER_LOGIN: number = 1;
    // public static readonly GIFTCODE: number = 20017;
    public static readonly GET_LINK_LIVESTREAM = 20132;
    public static readonly GET_LINK_BANCA = 20131;
    public static readonly CONST_GAME_BET_THE_THAO = 401;
    public static readonly CONST_GAME_BET_LODE = 402;
    public static readonly CONST_GAME_BET_BAN_CA = 403;
    public static readonly EXCHANGE_VIN = 20014;
    public static readonly EXCHANGE_VIN_NEW = 20058;
    public static readonly RESULT_EXCHANGE_VIN = 20034;
    public static readonly SEND_OTP = 20019;
    public static readonly LOBBY_DISCONNECT = 20119;
    public static readonly EVENT_SHOW = 20119;
    public static readonly GET_LINK_BET = 20120
    public static readonly LOBBY_WITHDRAWAL_VIETNAM = 20121;
    // public static readonly WS_TALK_SHOW_GIFT_IDOL = 20151; // Tặng quà cho Idol
    public static readonly WS_TALK_SHOW_SUBSCRIBE = 20152; // subscribe
    public static readonly WS_RES_SHOW_GIFT_ALL_USER = 20153; // Khi có người tặng quà sẽ gửi cho những người khác
   

    public static readonly START_NEW_VQMM = 20042;
    public static readonly GET_INFORMATION_SERCURITY = 20050;
    public static readonly ACTIVE_MOBILE = 20006;
    public static readonly UPDATE_PHONE_USER = 20004;
    public static readonly UPDATE_USER_INFO = 20002;
    public static readonly CHECK_NICK_NAME = 20018;
    public static readonly GET_MONEY_HOANCUOC = 20133;
    public static readonly CHANGEPASS = 20000;
    public static readonly RESULT_CHANGEPASS = 20020;
    public static readonly UPDATE_JACKPOT = 20101;
    public static readonly SUBCRIBE_JACPORT = 20102
    public static readonly UNSUBCRIBE_JACPORT = 20103
    public static readonly UPDATE_SLOT_POTS = 10003
    public static readonly NHAN_THUONG_TOPVIP = 20137
    public static readonly MN_SUBSCRIBE = 2000
    public static readonly UPDATE_TIME_TAI_XIU = 2124
    public static readonly PROGRESS_VIP_INFO = 20139
    public static readonly CONVERT_DIAMOND = 20119
    public static readonly LOBBY_EVENT_NHAN_THUONG = 20117;
    public static readonly BROADCAST_MESSAGE = 20100;
    public static readonly BROADCAST_MESSAGE_2 = 20999;
    public static readonly STATUS_LOGIN = 20129;
    public static readonly LOBBY_SEND_B_MAIL = 20110;
    public static readonly LOBBY_UPDATE_STATUS_B_MAIL = 20111;
    public static readonly NEW_MAIL = 20053;
    public static readonly MN_UPDATE_USER_INFO = 2003;
    public static readonly LOBBY_CK_CHECK_GIFT_CODE = 20142;
    public static readonly RUN_EVENT = 20402;
    public static readonly LOBBY_CHANGE_MOBILE_OTP = 20123;
    public static readonly GET_LIST_GIFT_XMAS = 20145;
    public static readonly OPEN_GIFT_XMAS = 20146;
    public static readonly REWARD_PROGRESS_NAP = 20136;
    public static readonly LOBBY_EVENT_CHECK_LUCKY_MONEY_LUNAR = 20134;
    public static readonly LOBBY_EVENT_REWARD_LUCKY_MONEY_LUNAR = 20135;
    public static readonly LOBBY_EVENT_SHOW_BUTTON_GIFT = 20147;
    public static readonly LOBBY_EVENT_MERGE_WORD = 20148;
    public static readonly BREAK_EGG_LOBBY = 20114;
    // public static readonly SEND_DIEMDANH = 20113;
    public static readonly SAFE_MONEY = 20009;
    public static readonly RESULT_SAFE_MONEY = 20029;
    public static readonly SAFE_CREATE_PASS = 20200;
    public static readonly SAFE_UPDATE_PASS = 20201;
    public static readonly MINI_GET_BALANCE = 20051;
    public static readonly CHECK_DEVICE = 1051;
    public static readonly BACK_TO_LOBBY_LIVEGAME = 20203;
    public static readonly PLAYER_PROFILE = 30153;
    public static readonly CHANGE_DISPLAYNAME = 30154;
    public static readonly CHANGE_AVATAR = 30155;
    public static readonly GIFT_CODE = 20017;
    public static readonly FREE_CHIPS = 30152;
    public static readonly RECEIVE_MAIL = 30156;
    public static readonly DELETE_MAIL = 30160;
    public static readonly READ_MAIL = 30111;
    public static readonly TOP_PLAYERS = 30151;
    public static readonly CLAIM_GOLD = 30157;
    public static readonly LIST_FRIEND = 30161;
    public static readonly DELETE_FRIEND = 30159;
    public static readonly ADD_FRIEND = 30158;
    
    //// Event merge word
    public static readonly LIGATURE_CHARACTER = 20140;
    public static readonly LIGATURE_SEND_SELL_CHARACTER = 20141;
    public static readonly LIGATURE_SR_TRANSACTION_CHARACTER = 20143;
    public static readonly LIGATURE_RECEIVED_BOUGHT_CHAR = 20145;
    public static readonly LIGATURE_RECEIVED_SELL_CHARACTER = 20146;
}
