declare namespace BGUI {
    class GameConfigZ {
        static configFirstGame: IConfigFirstGame;
        static folderContainGame: string;
        static isDev: boolean;
        static readonly GLOBAL_APP_ID: () => number;
    }
}
declare namespace BGUI {
    class UIOnOffSwitcher extends cc.Component {
        nOn: cc.Node;
        nOff: cc.Node;
        isOn: boolean;
        private switchOnClick;
        private switchHandler;
        setSwitchOnClick(switchOnClick: boolean): void;
        setOnOff(isOn: boolean): void;
        onEnable(): void;
        onDisable(): void;
        _onClick(): void;
        start(): void;
        _updateUI(): void;
    }
}
declare namespace BGUI {
    enum eAudioType {
        Music = 0,
        SFX = 1
    }
    class AudioControl extends UIOnOffSwitcher {
        controlType: eAudioType;
        start(): void;
        setOnOff(isOn: boolean): void;
    }
}
declare namespace BGUI {
    class AudioManager extends cc.Component {
        static get instance(): AudioManager;
        private _currentMusicClip;
        private _currentMusicUrl;
        get musicVolume(): number;
        set musicVolume(value: number);
        private _musicVolume;
        get sfxVolume(): number;
        set sfxVolume(value: number);
        private _sfxVolume;
        private _audioCurrentTimeMap;
        onLoad(): void;
        playSfx(clip: cc.AudioClip, multiple?: number): void;
        pauseMusic(): void;
        private _validMusic;
        playMusic(clip: cc.AudioClip): void;
        update(dt: number): void;
    }
}
declare namespace BGUI {
    class ESoundDefined extends cc.Component {
        static get instance(): ESoundDefined;
        private static _instance;
        audioClick: cc.AudioClip;
        onLoad(): void;
    }
}
declare namespace BGUI {
    enum EDownLoadBundle {
        NONE = 0,
        IOS = 1,
        ANDROID = 2,
        WEB = 3,
        NATIVE = 4
    }
    interface IInfoBundle {
        isShow: number;
        isTest: number;
        id: number;
        bundleName: string;
        prefabGameName: string;
        sceneGameName: string;
        isHardCoreLink: boolean;
        linkHardCore: string;
    }
    interface IConfigFirstGame {
        key: string;
        gamename: string;
        manifestUrl: string;
        dv: {
            i: boolean;
            a: boolean;
            w: boolean;
        };
        pro: {
            msg: string;
            isShow: boolean;
        };
        ct: Array<string>;
        tl: Array<string>;
        cfg_link: {
            rdl: Array<string>;
            tgll: Array<string>;
            zl: string;
            tcf: Array<string>;
            tlg: string;
        };
        cfg_gd_levels: {};
        cfg_ui: {
            bg: string;
            logo: string;
            bg_progress: string;
            bg_bar: string;
            bg_button: string;
        };
        cfg_bundles: {
            link_debug: string;
            link_production: string;
            bundles: Array<IInfoBundle>;
        };
    }
    interface IUserInfo {
        sessionKey: string;
        nickname: string;
        facebookId: string;
        vinTotal: number;
        xuTotal: number;
        vippoint: number;
        vippointSave: number;
        createTime: string;
        IP: string;
        reference: string;
        avatar: string;
        certificate: string;
        birthday: string;
        luckyRotate: number;
        sessionKeyId: number;
        accessToken: string;
        username: string;
        identification: string;
        email: string;
        mobile: string;
        mobileSecurity: string;
        emailSecurity: string;
        appSecurity: string;
        loginSecure: string;
        moneyLoginOtp: string;
        moneyUse: string;
        safe: string;
        configGame: string;
        userID: number;
    }
}
declare namespace BGUI {
    class UserManager extends cc.EventTarget {
        static get instance(): UserManager;
        private static _instance;
        get mainUserInfo(): IUserInfo;
        set mainUserInfo(value: IUserInfo);
        private _mainUserInfo;
    }
}
declare namespace BGUI {
    class BhvShake extends cc.Component {
        movingMode: boolean;
        decayMode: boolean;
        damping: number;
        shakeTime: number;
        intensity: cc.Vec2;
        _intensity: cc.Vec2;
        _originPos: cc.Vec2;
        _isShaking: boolean;
        _timer: number;
        onLoad(): void;
        onButtonShake(e: any, time: string): void;
        setOriginPos(pos: cc.Vec2): void;
        shake(time?: number, intensity?: cc.Vec2): void;
        update(dt: any): void;
    }
}
declare namespace BGUI {
    enum MOVEMENT {
        horizontal = 0,
        vertical = 1,
        scale = 2,
        scaleX = 3,
        scaleY = 4,
        angle = 5,
        opacity = 6,
        skewX = 7,
        skewY = 8,
        forward = 9,
        value = 10
    }
    enum WAVE {
        sine = 0,
        triangle = 1,
        sawtooth = 2,
        reverseSawtooth = 3,
        square = 4
    }
    class BhvSine extends cc.Component {
        activeAtStart: boolean;
        movement: MOVEMENT;
        wave: WAVE;
        period: number;
        periodRandom: number;
        periodOffset: number;
        periodOffsetRandom: number;
        magnitude: number;
        magnitudeRandom: number;
        private i;
        private mag;
        private initialValue;
        private initialValue2;
        private lastKnownValue;
        private lastKnownValue2;
        onLoad(): void;
        start(): void;
        init(): void;
        setMovement(m: MOVEMENT): void;
        setPhase(x: any): void;
        value: number;
        private waveFunc;
        update(dt: number): void;
        private updateFromPhase;
        private getCyclePos;
    }
}
declare namespace BGUI {
    enum TYPE_MODE {
        left2right = 0,
        right2left = 1,
        middle2sides = 2,
        sides2middle = 3
    }
    export class BhvTextTyping extends cc.Component {
        typeMode: TYPE_MODE;
        speed: number;
        autoStart: boolean;
        get isLastChar(): boolean;
        insertIdx: number;
        textLen: number;
        typingIdx: number;
        fLabel: cc.Label;
        text: string;
        isTyping: boolean;
        paused: boolean;
        start(): void;
        run(text?: string, speed?: number, startIdx?: number): void;
        stop(showAllText?: boolean): void;
        pause(): void;
        resume(): void;
        appendText(text: string): void;
        private setTypingContent;
        private onTyping;
        private getTypingString;
        private startTimer;
        private setText;
        private getTextLength;
        private getSubString;
    }
    export {};
}
declare namespace BGUI {
    class LanguageMgr {
        private static _instance;
        static get instance(): LanguageMgr;
        currentLang: string;
        setCurrentLanguage(language: string): void;
        getCurrentLanguage(): string;
    }
}
declare namespace BGUI {
    class SpineLocalized extends cc.Component {
        spineConfigs: any;
        isRunNew: boolean;
        isLoop: boolean;
        private spine;
        start(): void;
        fetchRender(): void;
        getSpineSkeletonDataByLang(lang: any): any;
        onEnable(): void;
        updateLanguage(): void;
        updateSpine(language: any): void;
    }
}
declare namespace BGUI {
    class SpriteLocalized extends cc.Component {
        private spriteConfigs;
        private sprite;
        start(): void;
        onLoad(): void;
        fetchRender(): void;
        getSpriteFrameByLang(lang: any): any;
        updateLanguage(): void;
        updateSprite(language: any): void;
    }
}
declare namespace BGUI {
    class BundleManager extends cc.Component {
        static isDownload: boolean;
        static get instance(): BundleManager;
        releaseBundle(bundleName: any): void;
        getBundle(bundleName: string): cc.AssetManager.Bundle;
        loadBundleFromLocal(bundleName: string, callback: Function): void;
        getPrefabFromBundle(url: string, bundleName: any, callback: Function): cc.Prefab;
    }
}
declare namespace BGUI {
    const EVENT_GAMECORE: {
        LOGIN_SUCCESS: string;
        DISCONNECT: string;
        LOGOUT: string;
        UPDATE_GOLD: string;
        UPDATE_TOTAL_GOLD: string;
        UPDATE_VIPPOINT: string;
        UPDATE_TOTAL_VIPPOINT: string;
        UPDATE_DISPLAYNAME: string;
        EVENT_UPDATE_LANGUAGE_LABEL: string;
        EVENT_UPDATE_LANGUAGE_SPRITE: string;
        EVENT_UPDATE_LANGUAGE_SPINE: string;
        REQUIRE_LOGIN: string;
        DATA_BUNDLE_DOWNLOAD: string;
    };
    class GameCoreManager extends cc.Component {
        gameName: string;
        isSetupDone: boolean;
        nMiniGames: cc.Node;
        nWidgetShowJackpot: cc.Node;
        nLayerMiniGame: cc.Node;
        btnAccept: cc.Button;
        listFontCommon: cc.Font;
        listFontLanguage: Array<cc.Font>;
        isLoginSuccess: boolean;
        gameID: number;
        deviceIdWeb: any;
        static get instance(): GameCoreManager;
        getWebDeviceID(): any;
        start(): void;
        onLoad(): void;
        onEnable(): void;
        onAddLocalize(data: any): void;
        getLangByKey(key: string): any;
        onDisable(): void;
        onLoginSucess(): void;
        addGold(gold: number): void;
        subGold(gold: number): void;
        updateTotalGold(totalGold: number): void;
        addVippoint(vp: number): void;
        subVippoint(vp: number): void;
        updateTotalVippoint(totalVP: number): void;
        onBackToLobby(): void;
        getGameId(): number;
        setGameID(n: number): void;
        setupGame(callback?: Function): void;
        update(dt: any): void;
    }
}
declare namespace BGUI {
    abstract class BaseInPacket {
        private _pos;
        private _data;
        private _length;
        private _controllerId;
        private _cmdId;
        private _error;
        constructor();
        get success(): boolean;
        unpackData(a: any): void;
        protected abstract unpack(): void;
        getCmdId(): number;
        getControllerId(): number;
        getError(): ErrorDefine;
        parseByte(): number;
        getByte(): number;
        getBool(): boolean;
        getBytes(a: any): any[];
        getShort(): number;
        getUnsignedShort(): number;
        getInt(): number;
        getLongGameBai(): number;
        getLong(): number;
        getLongTime(): number;
        byteArrayToLong(array: any): number;
        getDouble(): number;
        getCharArray(): any[];
        getString(): string;
        getStringDecoded(): string;
        clean(): void;
    }
}
declare namespace BGUI {
    abstract class BaseOutPacket {
        _pos: number;
        _data: number[];
        _length: number;
        _controllerId: number;
        abstract getCmdId(): number;
        private _isPackedHeader;
        constructor();
        setControllerId(a: any): void;
        initData(a: any): void;
        reset(): void;
        packHeader(): void;
        putByte(a: any): this;
        abstract putData(): void;
        putByteArray(a: any): this;
        putBytes(a: any): this;
        putShort(a: any): this;
        putUnsignedShort(a: any): this;
        putInt(a: any): this;
        putLong(a: any): this;
        putString(a: any): this;
        putStringNonEncodeURI(a: any): this;
        updateUnsignedShortAtPos(a: any, b: any): void;
        updateSize(): void;
        getData(): number[];
        _stringConvertToByteArrayNonEncodeURI(strData: any): Uint8Array;
        _stringConvertToByteArray(a: any): Uint8Array;
        putString2(a: any): this;
        _stringConvertToByteArray2(a: any): any[];
        putString3(a: any): this;
        toUTF8Array(str: any): any[];
        clean(): void;
    }
}
declare namespace BGUI {
    enum CmdDefine {
        HAND_SHAKE = 0,
        USER_LOGIN = 1,
        USER_LOG_OUT = 2,
        DISCONNECTED = 37,
        RETRIEVE_DATA = 100,
        PING_PONG = 1050
    }
    enum ControllerID {
        SYSTEM = 0,
        EXTENSIONS = 1
    }
    class SendLogin extends BGUI.BaseOutPacket {
        nickName: string;
        accessToken: string;
        app_id: number;
        getCmdId(): number;
        putData(): void;
    }
}
declare namespace BGUI {
    class ResponseObj {
        constructor(cb: Function, cmds: number[]);
        cmds: number[];
        cb: Function;
        createdTime: number;
        isAvailable(): boolean;
    }
    class Connector extends cc.Component implements WebSocketClientListener {
        private _domain;
        private _port;
        set HOST(value: string);
        set PORT(value: number);
        _tcpClient: WebSocketClient;
        private _isConnected;
        private _cmdListenerList;
        private _responseFuncs;
        private _disconnectCallback;
        set disconnectCallback(value: Function);
        get disconnectCallback(): Function;
        onFinishConnect(success: boolean): void;
        onPingPong(cmd: any, data: any): void;
        onDisconnected(code: number): void;
        onReceived(cmdId: number, pkg: Uint8Array): void;
        addCmdListener(cmd: number, func: Function, obj: any): void;
        removeCmdListener(obj: any, cmd?: number): void;
        isConnected(): boolean;
        getServerInfo(): string;
        getNetwork(): WebSocketClient;
        connect(): void;
        disconnect(): void;
        sendPacket(pk: BaseOutPacket): void;
        ping(): void;
        sendCmd(cmdId: number): void;
        requestPacketWithResponseCmd(pk: BaseOutPacket, resCmd: number, cb: Function): void;
        requestPacketWithResponseCmds(pk: BaseOutPacket, resCmds: number[], cb: Function): void;
        requestPacket(pk: BaseOutPacket, cb: Function): void;
        requestCmd(cmdId: number, cb: Function): void;
        requestCmdWithResponseCmd(cmdId: number, resCmd: number, cb: Function): void;
        requestCmdWithResponseCmds(cmdId: number, resCmds: number[], cb: Function): void;
        private readonly MAX_TIME_SEND_PING_DEFAULT;
        private _isStarted;
        private _maxTime;
        private _time;
        private _timeSendPingCount;
        private tick;
        private _startDisconnectDetector;
        private _stopDisconnectDetector;
        rewindDisconnectDetector(): void;
        private onTimeOut;
    }
}
declare namespace BGUI {
    enum ErrorDefine {
        SUCCESS = 0,
        FAIL = 1,
        PARAM_INVALID = 2,
        MAINTAIN_SYSTEM = 3,
        SESSION_KEY_INVALID = 4,
        SESSION_EXPIRED = 5,
        ROOM_NOT_EXIST = 20,
        NOT_ENOUGH_MIN_BUY_IN = 21,
        OUT_BUY_IN_RANGE = 22,
        GAME_STRUCTURE_INVALID = 23,
        ALREADY_IN_GAME = 24,
        ENTERING_GAME = 25,
        GAME_STRUCTURE_OUT_ZONE = 26,
        FRIEND_EXISTED = 28,
        FRIEND_LIST_IS_FULL = 29,
        ROOM_FULL = 30,
        TOO_MUCH_GOLD_TO_RECEIVE_SUPPORT = 31,
        REACH_MAX_DAILY_SUPPORT_TIME = 32,
        NOT_ENOUGH_NUMBER_INVITED_FRIENDS = 32,
        NOT_ENOUGH_TOTAL_GROSS = 32,
        OVER_MAX_FRIEND_INVITATION_PER_DAY = 32,
        GIFT_CODE_INVALID = 43,
        GIFT_CODE_EXPIRED = 44,
        GIFT_CODE_IS_USED = 45,
        USER_USED_CODE_IN_EVENT = 46,
        GIFT_CODE_SYSTEM_MAINTAINING = 47,
        LOGIN_BANNED_IP = 48,
        LOGIN_BANNED_USER = 49,
        PLAYER_ACTION_INVALID = 50,
        PLAYER_ACTION_FAIL = 51,
        PLAYER_ACTION_IN_COOL_DOWN_TIME = 52,
        PAYMENT_TRANSACTION_IS_NOT_VERIFIED = 60,
        PAYMENT_TRANSACTION_DUPLICATED = 61,
        PAYMENT_TRANSACTION_SANDBOX_TO_PRODUCTION = 62,
        PAYMENT_TRANSACTION_PRODUCTION_TO_SANDBOX = 63,
        PAYMENT_PRODUCT_ID_INVALID = 64,
        PAYMENT_CAN_NOT_UPDATE_TO_BILLING = 65,
        NOT_ENOUGH_XU = 100,
        NOT_ENOUGH_GOLD = 101
    }
    enum RETRIEVE_CODE {
        INTERNAL_ERROR = -2,
        PARAM_INVALID = -1,
        HAS_SEA_DATA = 1,
        HAS_TEXAS_DATA = 2,
        NO_TEXAS_DATA = 3
    }
    enum BLUE_P_CODE {
        SUCCESS = 1,
        CREATE_TRANSACTION_FAIL = -1,
        WRONG_PAYMENT_METHOD = -2,
        CARD_INFO_INVALID = -10,
        WRONG_HASH = -100
    }
    enum ZING_CARD_CODE {
        SUCCESS = 1,
        FAIL = -1,
        IN_PROCESSING = 2
    }
}
declare namespace BGUI {
    class Https {
        static get(url: string, cb: (response: any) => void, isShowLog?: boolean): void;
        static getRaw(url: string, cb: (response: any) => void, isShowLog?: boolean): void;
        static packDataForRequest(data: any): string;
        static request(url: any, n: any): void;
    }
}
declare namespace BGUI {
    interface IReceiveData {
        unpack(pk: BaseInPacket): any;
    }
}
declare namespace BGUI {
    class NetworkPortal extends Connector {
        static get instance(): NetworkPortal;
        private static _instance;
        onFinishConnect(success: boolean): void;
        sendPacket(pk: BaseOutPacket): void;
    }
}
declare namespace BGUI {
    class NullInPacket extends BaseInPacket {
        protected unpack(): void;
    }
}
declare namespace BGUI {
    class NullOutPacket extends BaseOutPacket {
        constructor(cmdId: number);
        cmdId: number;
        getCmdId(): number;
        putData(): void;
    }
}
declare namespace BGUI {
    var BIT_IS_BINARY_INDEX: number;
    var BIT_IS_ENCRYPT_INDEX: number;
    var BIT_IS_COMPRESS_INDEX: number;
    var BIT_IS_BLUE_BOXED_INDEX: number;
    var BIT_IS_BIG_SIZE_INDEX: number;
    var BYTE_PACKET_SIZE_INDEX: number;
    var BIG_HEADER_SIZE: number;
    var NORMAL_HEADER_SIZE: number;
    class PacketHeaderAnalyze {
        static getDataSize(a: any): number;
        static getCmdIdFromData(a: any): number;
        static isBigSize(a: any): boolean;
        static isCompress(a: any): boolean;
        static getValidSize(a: any): number;
        static getBit(a: any, b: any): boolean;
        static genHeader(a: any, b: any): number;
        static setBit(a: any, b: any, d: any): number;
        static getIntAt(a: any, b: any): number;
        static getUnsignedShortAt(a: any, b: any): number;
        static getShortAt(a: any, b: any): number;
    }
}
declare namespace BGUI {
    class SendPingPong extends BaseOutPacket {
        v: any;
        getCmdId(): number;
        putData(): void;
    }
    class RecievePingPong extends BGUI.BaseInPacket {
        protected unpack(): void;
        v: number;
    }
}
declare namespace BGUI {
    interface WebSocketClientListener {
        onFinishConnect(success: boolean): any;
        onDisconnected(code: number): any;
        onReceived(cmdId: number, data: Uint8Array): any;
    }
    class WebSocketClient {
        private _ws;
        private _wsState;
        private _host;
        private _port;
        private _isSsl;
        get listener(): WebSocketClientListener;
        set listener(value: WebSocketClientListener);
        private _listener;
        connect(host: string, port: number): void;
        onSocketConnect(): void;
        onSocketClose(event: CloseEvent): void;
        onSocketData(msg: MessageEvent): void;
        onSocketError(): void;
        send(pk: BaseOutPacket): void;
        disconnect(): void;
    }
}
declare namespace BGUI {
    const TrackingAction: {
        SETUP_GAME: string;
        DOWNLOAD_HOTUPDATE: string;
        LOAD_BUNDLE: string;
        LOAD_BUNDLE_SUCESS: string;
        LOAD_BUNDLE_FAIL: string;
        CHANGE_SCENE: string;
        CLEAR_CACHE: string;
        NOTI_MAINTAIN: string;
    };
    class TrackZ {
        static codeXX: string;
        static channel: string;
        static open: (info: any) => void;
        static postAPI(url: any, e: any, n: any): void;
    }
}
declare namespace BGUI {
    const DATA_STORAGE: {
        CCSettings: string;
        MD5CACHE: string;
    };
    class BundleDownLoad extends cc.Component {
        linkUrl: string;
        bundleName: string;
        prefabMainNameURL: string;
        prgLoadGame: cc.ProgressBar;
        lbMsg: cc.Label;
        autoDownload: boolean;
        isClicked: boolean;
        gameID: number;
        isDownloadLocal: boolean;
        isDownloadBundleNotLoad: boolean;
        private _isLoadingGame;
        private _numOfClickShowTest;
        onEnable(): void;
        onDisable(): void;
        _onClicked(): void;
        onLoadGameClicked(): void;
        private _checkRequireLocal;
        private _checkRequireLive;
        releaseBundle(bundleName: any): void;
        private _showMsg;
        private getCCSettingFromUrl;
        private _setupFirstDownLoad;
        private getConfigBundle;
        private onDownLoadByMd5;
        private onDownLoadByMd5NotLoadPreLoad;
        findMd5Verion(bundleVers: any, x: any): any;
        findLocalizeVerion(bundleVers: any, x: any): any;
        onFuturePrefabLoadDone(prefab: cc.Prefab): void;
    }
}
declare namespace BGUI {
    class CommonAssetDefined extends cc.Component {
        static get instance(): CommonAssetDefined;
        WAITING_LAYOUT: cc.Prefab;
        BUTTON_COMMON: cc.Prefab;
        FADED_BACKGROUND: cc.Prefab;
        FADED_BACKGROUND_FADED: cc.Prefab;
        CENTER_NOTIFICATION: cc.Prefab;
        TEXT_FLY: cc.Prefab;
        POPUP_COMMON: cc.Prefab;
        TOOLTIP_MESSAGE: cc.Prefab;
        listPrefabDefined: any[];
        isRequireRes(): boolean;
        getPrefabByName(name: string): cc.Prefab;
        addPrefab(data: any): void;
    }
}
declare namespace BGUI {
    enum UICancelInteractionType {
        OnTouchDown = 1,
        OnTouchUp = 2,
        OnMoveFromTarget = 4,
        OnTouchDownOrTouchUp = 3,
        OnTouchDownOrMoveFromTarget = 5,
        OnTouchUpOrMoveFromTarget = 6,
        Invalid = 0
    }
    interface UICancelInteractionListener {
        onInteractionCancelled(type: UICancelInteractionType, event: cc.Event.EventTouch): any;
    }
    class ControlEvent {
        static PositionChanged: string;
        static SizeChanged: string;
        static ScaleChanged: string;
        static Click: string;
        static Switch: string;
        static ShowTooltip: string;
        static LongClick: string;
        static TouchDown: string;
        static TouchDragInside: string;
        static TouchDragOutside: string;
        static TouchDragEnter: string;
        static TouchDragExit: string;
        static TouchUpInside: string;
        static TouchUpOutside: string;
        static TouchCancel: string;
        static DragBegan: string;
        static DragMoved: string;
        static DragEnded: string;
        static DragCancelled: string;
        static CanvasCancel: string;
        static TutorialNextStep: string;
        static TutorialNextConversation: string;
        static TutorialFinishConversation: string;
        static TutorialStartConversation: string;
        static TutorialFinished: string;
        static TabbarItemSelected: string;
        static ScreenWillAppear: string;
        static ScreenDidAppear: string;
        static ScreenWillDisappear: string;
        static ScreenDidDisappear: string;
        static PopupWillAppear: string;
        static PopupDidAppear: string;
        static PopupWillDisappear: string;
        static PopupDidDisappear: string;
        static WindowWillAppear: string;
        static WindowDidAppear: string;
        static WindowWillDisappear: string;
        static WindowDidDisappear: string;
        static ScreenDidPush: string;
        static ScreenDidPop: string;
        static ProductResponse: string;
        static TransitionStarted: string;
        static TransitionFinished: string;
        static RadioButtonSelected: string;
        static MenuShow: string;
        static MenuHide: string;
        static SHOW_WAITTING_POPUP: string;
        static HIDE_WATTING_POPUP: string;
        static TURN_ON_GAME_OVER: string;
        static TURN_ON_LOBBY: string;
        static TURN_ON_GAME_PLAY: string;
        static TURN_ON_HELP: string;
        static ON_SOUND_CHANGED: string;
        static ON_CHANGED_UI_SOUND_NODE: string;
        static ON_PLAY_AUDIO_CLICK: string;
        static ON_PLAY_AUDIO_WIN: string;
        static ON_PLAY_AUDIO_LOSE: string;
        static HIGH_SCORE: string;
        static FZ_COIN: string;
        static SCORE: string;
    }
}
declare namespace BGUI {
    class DropDown extends cc.Component {
        template: cc.Node;
        labelCaption: cc.Label;
        spriteCaption: cc.Sprite;
        labelItem: cc.Label;
        spriteItem: cc.Sprite;
        optionDatas: DropDownOptionData[];
        private _dropDown;
        private validTemplate;
        private items;
        private isShow;
        private _selectedIndex;
        private get selectedIndex();
        private _delegate;
        set delegate(value: any);
        get delegate(): any;
        private set selectedIndex(value);
        addOptionDatas(optionDatas: DropDownOptionData[]): void;
        clearOptionDatas(): void;
        show(): void;
        private addItem;
        hide(): void;
        private delayedDestroyDropdownList;
        private destroyItem;
        private setUpTemplate;
        private refreshShownValue;
        protected createDropDownList(template: cc.Node): cc.Node;
        protected destroyDropDownList(dropDownList: cc.Node): void;
        protected createItem(itemTemplate: DropDownItem): DropDownItem;
        private onSelectedItem;
        private onClick;
        start(): void;
        onEnable(): void;
        onDisable(): void;
        private clamp;
    }
}
declare namespace BGUI {
    class DropDownItem extends cc.Component {
        label: cc.Label;
        sprite: cc.Sprite;
        toggle: cc.Toggle;
    }
}
declare namespace BGUI {
    class DropDownOptionData {
        optionString: string;
        optionSf: cc.SpriteFrame;
    }
}
declare namespace BGUI {
    class EventDispatch {
        private static _instance;
        static get instance(): EventDispatch;
        private listeners;
        emit(event: any, ...params: any[]): void;
        add(event: any, cb: Function, host?: any, callNow?: boolean, ...params: any[]): void;
        remove(event: any, cb: Function, host?: any): void;
        clear(): void;
    }
}
declare namespace BGUI {
    enum GUI_TYPE {
        POPUP = 0,
        WINDOW = 1,
        SCREEN = 2
    }
    class LoginFeature extends cc.Component {
        tabIndex: number;
        guiType: number;
        featurePrefab: cc.Prefab;
        isLoadFromUrl: boolean;
        featurePrefabUrl: string;
        bundleName: string;
        isNotLogin: boolean;
        onEnable(): void;
        onDisable(): void;
        _onClicked(): void;
        private _loadUI;
        onFeatureClicked(): void;
    }
}
declare namespace BGUI {
    enum eAutoLayoutType {
        Raw = 0,
        Scale = 1,
        ScaleToFit = 2,
        ScaleToFill = 3
    }
    class UIAutoLayout extends cc.Component {
        type: eAutoLayoutType;
        onEnable(): void;
        onDisable(): void;
        _onChangeFrame(): void;
        _updateUI(): void;
    }
}
declare namespace BGUI {
    class UIButtonCommon extends cc.Component {
        listSprite: Array<cc.SpriteFrame>;
        lbAction: cc.Label;
    }
}
declare namespace BGUI {
    let ANIMATE_SCALE_MIN: number;
    let ANIMATE_TIME: number;
    enum eZIndex {
        SCREEN = 4,
        NAVIGATOR = 8,
        WINDOW = 16,
        POPUP = 64,
        EFFECT = 128,
        DIALOG = 256,
        Z_ORDER_MAX = 1024,
        LOADING = 4096
    }
    enum eGUIType {
        SCREEN = 0,
        POPUP = 1,
        WINDOW = 2
    }
}
declare namespace BGUI {
    class UIViewGroup extends cc.ViewGroup {
        _hasNestedViewGroup(event: cc.Event, captureListeners?: any[]): boolean;
        onLoad(): void;
    }
}
declare namespace BGUI {
    interface UIDragDropDelegate {
        itemShouldDrag(drag: UIDragDrop): boolean;
    }
    class UIDragDrop extends UIViewGroup implements UIScrollViewDisabledRefObject {
        dragAlwaysCenter: boolean;
        backToStartPosition: boolean;
        stickyDrag: boolean;
        propagateTouchEvent: boolean;
        dragScale: number;
        disableScrollViewWhileDrag: boolean;
        private _oldZOrder;
        private _oldScale;
        get startPosition(): cc.Vec2;
        protected _startPosition: cc.Vec2;
        protected _deltaPosition: cc.Vec2;
        protected touchingObj: cc.Touch;
        get dragged(): boolean;
        protected _dragged: boolean;
        get delegate(): UIDragDropDelegate;
        set delegate(value: UIDragDropDelegate);
        private _delegate;
        private _capturedScrollView;
        private _scrollViewMovingTick;
        get oldParent(): cc.Node;
        private _oldParent;
        onEnable(): void;
        onDisable(): void;
        _registerEvent(): void;
        _unregisterEvent(): void;
        scrollViewShouldScroll(scrollView: UIScrollView): boolean;
        onCanvasCancel(dragDrop: UIDragDrop): void;
        _getParentScrollView(): UIScrollView;
        isNestedViewGroup(event: cc.Event.EventTouch): boolean;
        _executeBeganLogicWithTouch(touch: cc.Touch): void;
        _handleDragBeganLogic(event: cc.Event.EventTouch): void;
        _handleDragMovedLogic(event: cc.Event.EventTouch): void;
        _handleDragEndedLogic(event: cc.Event.EventTouch): void;
        _onDragBegan(event: cc.Event.EventTouch): void;
        _onDragMoved(event: cc.Event.EventTouch): void;
        _onDragEnded(event: cc.Event.EventTouch): void;
        _onDragCancelled(event: cc.Event.EventTouch): void;
        _backToStartPositionIfNeeded(): void;
        cancel(): void;
    }
}
declare namespace BGUI {
    class UIDraggable extends UIViewGroup {
        draggable: boolean;
        backToStartPosition: boolean;
        autoFitEdge: boolean;
        private _touchMoved;
        private _startPosititon;
        onLoad(): void;
        start(): void;
        _handleAfterDragLogic(animated?: boolean): void;
        onEnable(): void;
        onDisable(): void;
        onParentSizeChanged(): void;
        protected _stopPropagationIfTargetIsMe(event: cc.Event): void;
        private _onTouchBegan;
        private _onTouchMoved;
        private _onTouchEnded;
        private _onTouchCancelled;
        onDraggableBegan(event: cc.Event.EventTouch): void;
        onDraggableEnded(event: cc.Event.EventTouch): void;
        onDraggableCancelled(event: cc.Event.EventTouch): void;
        onDraggableMoved(event: cc.Event.EventTouch): void;
    }
}
declare namespace BGUI {
    interface UIJoystickDelegate {
        onJoystickExecuted(pos: cc.Vec2): any;
    }
    enum UIJoystickState {
        STARTED = 0,
        IDLE = 1
    }
    class UIJoystick extends cc.Component {
        analog: cc.Node;
        background: cc.Node;
        radius: number;
        touchAnyWhereToStart: boolean;
        followFinger: boolean;
        private _analogStartPos;
        private _backgroundStartPos;
        private _state;
        get state(): UIJoystickState;
        get delegate(): UIJoystickDelegate;
        set delegate(value: UIJoystickDelegate);
        private _delegate;
        start(): void;
        onEnable(): void;
        onDisable(): void;
        _executeEvent(): void;
        _onTouchBegan(event: cc.Event.EventTouch): void;
        _onTouchMoved(event: cc.Event.EventTouch): void;
        _onTouchEnded(event: cc.Event.EventTouch): void;
        _onTouchCancelled(event: cc.Event.EventTouch): void;
    }
}
declare namespace BGUI {
    class UINumericLabelHelper extends cc.Component {
        private _label;
        private _data;
        get data(): number;
        set data(value: number);
        private _delta;
        private _start;
        private _duration;
        private _elapsed;
        private _progressing;
        onLoad(): void;
        start(): void;
        setString(value: string): void;
        scheduleProgress(number: number, duration?: number): void;
        static scheduleForLabel(label: cc.Label, number: number, duration?: number): void;
        update(dt: number): void;
    }
}
declare namespace BGUI {
    class PopupAction {
        private constructor();
        name: string;
        callback: Function;
        hidePopupOnClick: boolean;
        static make(name: string, callback?: Function, hidePopupOnClick?: boolean): PopupAction;
    }
    class UIPopup extends UIViewGroup {
        protected actions: Map<string, PopupAction>;
        get hideWhenTouchOnBackground(): boolean;
        set hideWhenTouchOnBackground(value: boolean);
        private _hideWhenTouchOnBackground;
        private _touchMoved;
        set draggable(value: boolean);
        get draggable(): boolean;
        private _draggable;
        constructor();
        onEnable(): void;
        onDisable(): void;
        protected _stopPropagationIfTargetIsMe(event: cc.Event): void;
        _onTouchBegan(event: cc.Event.EventTouch, listeners: any[]): void;
        _onTouchMoved(event: cc.Event.EventTouch, listeners: any[]): void;
        _onTouchEnded(event: cc.Event.EventTouch, listeners: any[]): void;
        _onTouchCancelled(event: cc.Event.EventTouch, listeners: any[]): void;
        executeAction(name: string): void;
        setActions(actions: PopupAction[]): void;
        addAction(action: PopupAction): void;
        isSystemDialog(): boolean;
        hide(): void;
        popupWillAppear(): void;
        popupDidAppear(): void;
        popupWillDisappear(): void;
        popupDidDisappear(): void;
        isSinglePopup(): boolean;
    }
}
declare namespace BGUI {
    class UIPopupCommon extends UIPopup {
        lbTitle: cc.Label;
        lbContent: cc.Label;
        nCustomView: cc.Node;
        nActionContainer: cc.Node;
        btnClose: cc.Button;
        buttons: Map<string, UIButtonCommon>;
        nSmall: cc.Node;
        nBig: cc.Node;
        lbContent_Small: cc.Label;
        lbTitle_Small: cc.Label;
        nActionContainerSmall: cc.Node;
        private _unregisterEvent;
        private _onActionClicked;
        setTitle(title: string): void;
        setContent(content: string): void;
        setCustomView(customView: cc.Node): void;
        setActions(actions: PopupAction[]): void;
        addAction(action: PopupAction): void;
        private _addButtonForAction;
        setActionsSmall(actions: PopupAction[]): void;
        addActionSmall(action: PopupAction): void;
        private _addButtonForActioSmall;
        onDisable(): void;
        onEnable(): void;
    }
}
declare namespace BGUI {
    class UIPopupManager extends cc.Component {
        private _popupStack;
        static get instance(): UIPopupManager;
        onLoad(): void;
        get fadedBackground(): cc.Node;
        get systemDialog(): UIPopup;
        private hidePopUp;
        removePopup(popup: UIPopup | typeof cc.Component, animated?: boolean): void;
        showPopupFromPrefabName(filePath: string, callback?: (popup: UIPopup) => void, hideWhenTouchOnBackground?: boolean, animated?: boolean): void;
        showPopupFromPrefab(prefab: cc.Prefab, callback?: (popup: UIPopup) => void, hideWhenTouchOnBackground?: boolean, animated?: boolean): void;
        showPopupFromNode(node: cc.Node, callback?: (popup: UIPopup) => void, hideWhenTouchOnBackground?: boolean, animated?: boolean): void;
        updateFadedBackground(): void;
        onFadedBackgroundClicked(): void;
        has(def: typeof cc.Component): boolean;
        find(def: typeof cc.Component): UIPopup;
        removeAllPopups(): void;
        showSystemDialog(content: string, act?: PopupAction[] | PopupAction, title?: string): void;
        hideSystemDialog(): void;
        showPopup(content: string, actions?: PopupAction[], title?: string, customView?: cc.Node): void;
        showPopupSmall(content: string, actions?: PopupAction[], title?: string, customView?: cc.Node): void;
    }
}
declare namespace BGUI {
    class UIScreen extends UIViewGroup {
        hideCurScreenOnShow: boolean;
        get manager(): UIScreenManager;
        set manager(value: UIScreenManager);
        private _manager;
        handleParams(params: any): void;
    }
}
declare namespace BGUI {
    class UIScreenManager extends cc.Component {
        static get instance(): UIScreenManager;
        private _screenStack;
        private _screenCached;
        onLoad(): void;
        get current(): UIScreen;
        cacheFromPrefab(prefab: cc.Prefab): UIScreen;
        initWithRootPrefab(prefab: cc.Prefab, cb?: (screen: UIScreen) => void): UIScreen;
        initWithRootNode(node: cc.Node, cb?: (screen: UIScreen) => void): UIScreen;
        pushScreen(prefab: cc.Prefab, cb?: (screen: UIScreen) => void): UIScreen;
        removeScreen(def: UIScreen | string): void;
        replaceScreen(prefab: cc.Prefab, cb?: (screen: UIScreen) => void): UIScreen;
        popScreen(): UIScreen;
        popToRootScreen(): UIScreen;
        popToScreen(def: typeof cc.Component): UIScreen;
        popToScreenAtIndex(screenIdx: number): UIScreen;
        private getScreenFromPrefab;
        private getScreenFromNode;
        hasScreen(def: typeof cc.Component | string): boolean;
        findScreen(def: typeof cc.Component | string): UIScreen;
    }
}
declare namespace BGUI {
    enum UIScrollBarDirection {
        HORIZONTAL = 0,
        VERTICAL = 1
    }
    class UIScrollBar extends cc.Component {
        private _scrollView;
        private _touching;
        private _autoHideRemainingTime;
        private _opacity;
        direction: UIScrollBarDirection;
        handle: cc.Sprite;
        enableAutoHide: boolean;
        autoHideTime: number;
        static readonly Direction: typeof UIScrollBarDirection;
        setTargetScrollView(scrollView: UIScrollView): void;
        _convertToScrollViewSpace(content: cc.Node): cc.Vec2;
        _setOpacity(opacity: number): void;
        _onScroll(outOfBoundary: cc.Vec2): void;
        _updateHanlderPosition(position: cc.Vec2): void;
        _fixupHandlerPosition(): cc.Vec2;
        _onTouchBegan(): void;
        _conditionalDisableScrollBar(contentSize: cc.Size, scrollViewSize: cc.Size): boolean;
        _onTouchEnded(): void;
        _calculateLength(contentMeasure: number, scrollViewMeasure: number, handleNodeMeasure: number, outOfBoundary: number): number;
        _calculatePosition(contentMeasure: number, scrollViewMeasure: number, handleNodeMeasure: number, contentPosition: number, outOfBoundary: number, actualLenth: number): cc.Vec2;
        _updateLength(length: number): void;
        _processAutoHide(deltaTime: number): void;
        start(): void;
        hide(): void;
        show(): void;
        update(dt: number): void;
    }
}
declare namespace BGUI {
    class UIScrollContent extends cc.Component {
        get scrollView(): UIScrollView;
        set scrollView(value: UIScrollView);
        private _scrollView;
    }
}
declare namespace BGUI {
    enum UIScrollDirection {
        VERTICAL = 1,
        HORIZONTAL = 2,
        BOTH = 3
    }
    interface UIScrollViewDelegate {
        scrollViewDidScroll?(scrollView: UIScrollView): any;
        scrollViewWillBeginDragging?(scrollView: UIScrollView): any;
        scrollViewWillEndDragging?(scrollView: UIScrollView, velocity: cc.Vec2): any;
        scrollViewDidEndDragging?(scrollView: UIScrollView, decelerate: boolean): any;
        scrollViewChildrenShouldDrag?(scrollView: UIScrollView, event: cc.Event.EventTouch): boolean;
    }
    interface UIScrollViewDisabledRefObject {
        scrollViewShouldScroll?(scrollView: UIScrollView): any;
    }
    class UIScrollView extends UIViewGroup {
        protected _touchMoved: boolean;
        protected _touches: cc.Touch[];
        protected _touchMoveDisplacements: Array<cc.Vec2>;
        protected _touchMoveTimeDeltas: Array<number>;
        protected _touchMovePreviousTimestamp: number;
        protected _autoScroll: boolean;
        protected _autoScrollStartPosition: cc.Vec2;
        protected _autoScrollPreviousPosition: cc.Vec2;
        protected _autoScrollDeltaPosition: cc.Vec2;
        protected _autoScrollTotalTime: number;
        protected _autoScrollElapsedTime: number;
        protected _autoZoomScale: boolean;
        protected _autoZoomScaleStartScale: number;
        protected _autoZoomScalePreviousScale: number;
        protected _autoZoomScaleDeltaScale: number;
        protected _autoZoomScaleTotalTime: number;
        protected _autoZoomScaleElapsedTime: number;
        private _disabledRefObjects;
        retainDisabledRef(obj: UIScrollViewDisabledRefObject): void;
        releaseDisabledRef(obj: UIScrollViewDisabledRefObject): void;
        get autoScroll(): boolean;
        get autoScrollDeltaPosition(): cc.Vec2;
        get autoScrollStartPosition(): cc.Vec2;
        get delegate(): UIScrollViewDelegate;
        set delegate(value: UIScrollViewDelegate);
        protected _delegate: UIScrollViewDelegate;
        direction: UIScrollDirection;
        zoomScaleEnabled: boolean;
        maxScale: number;
        minScale: number;
        content: cc.Node;
        scrollEnabled: boolean;
        touchEnabled: boolean;
        dragChildrenEnabled: boolean;
        easingAutoScroll: boolean;
        movementFactor: number;
        horizontalScrollBar: UIScrollBar;
        verticalScrollBar: UIScrollBar;
        autoClearAutoScroll: boolean;
        autoClearAutoZoomScale: boolean;
        get beginContentPosition(): cc.Vec2;
        protected _beginContentPosition: cc.Vec2;
        get dragging(): boolean;
        protected _dragging: boolean;
        protected _dragBeganPosition: cc.Vec2;
        protected _boundaryRect: cc.Rect;
        get dragBeganPosition(): cc.Vec2;
        onLoad(): void;
        onEnable(): void;
        onDisable(): void;
        cancelTouch(): void;
        static quintEaseOut(ratio: number): number;
        _updateScrollBar(outOfBoundary: cc.Vec2): void;
        _recalculateBoundary(): void;
        get offsetMinX(): number;
        get offsetMinY(): number;
        get offsetMaxX(): number;
        get offsetMaxY(): number;
        _calculateTouchMoveVelocity(): cc.Vec2;
        protected _gatherTouchMove(delta: cc.Vec2): void;
        protected _calculateAutoScrollTimeByInitialSpeed(initialSpeed: number): number;
        protected _startInertiaScroll(touchMoveVelocity: cc.Vec2): void;
        protected _startAttenuatingAutoScroll(deltaMove: cc.Vec2, initialVelocity: cc.Vec2): void;
        startAutoScroll(delta: cc.Vec2, duration: number): void;
        startAutoZoomScale(delta: number, duration: number): void;
        scaleTo(scale: number, animated?: boolean): boolean;
        scrollToLeftTop(animated?: boolean): boolean;
        scrollToLeftBottom(animated?: boolean): boolean;
        scrollToRightTop(animated?: boolean): boolean;
        scrollToRightBottom(animated?: boolean): boolean;
        scrollToTop(animated?: boolean): boolean;
        scrollToBottom(animated?: boolean): boolean;
        scrollToLeft(animated?: boolean): boolean;
        scrollToRight(animated?: boolean): boolean;
        followTarget(target: cc.Node): void;
        scrollTo(center: cc.Vec2, animated?: boolean): boolean;
        scrollToIn(center: cc.Vec2, duration?: number): boolean;
        scrollAndScaleTo(center: cc.Vec2, scale: number, duration?: number): boolean;
        protected _reAlignBoundIfNeed(): void;
        protected update(dt: number): void;
        protected scrollViewDidScroll(scrollView: UIScrollView): void;
        protected _handlePressLogic(touch: cc.Touch): void;
        protected _onTouchBegan(event: cc.Event.EventTouch, captureListeners: any[]): void;
        protected _clearAutoScrollData(): void;
        protected _clearAutoZoomScaleData(): void;
        protected _handleMoveLogic(touch: cc.Touch): void;
        protected _onTouchMoved(event: cc.Event.EventTouch, captureListeners: any[]): void;
        protected _handleReleaseLogic(touch: cc.Touch, isCancel: boolean): void;
        removeTouch(touch: cc.Touch): void;
        protected _onTouchEnded(event: cc.Event.EventTouch, captureListeners: any[]): void;
        protected _onTouchCancelled(event: cc.Event.EventTouch, captureListeners: any[]): void;
        protected _stopPropagationIfTargetIsMe(event: cc.Event): void;
        _hasNestedViewGroup(event: cc.Event, captureListeners: any[]): boolean;
        protected _onMouseWheel(event: cc.Event.EventMouse, captureListeners: any[]): void;
        protected _registerEvent(): void;
        protected _unregisterEvent(): void;
        _onShowGame(event: any): void;
        getMinScale(): number;
        setZoomScale(scale: number): boolean;
        scrollLockedByRefObjects(): boolean;
        setContentPosition(position: cc.Vec2, fromTouch?: boolean): boolean;
    }
}
declare namespace BGUI {
    interface UITabbarDelegate {
        tabbarShouldSelectItemAtIndex?(idx: number): boolean;
        tabbarSelectedAtIndex?(tabbar: UITabbarController, idx: number): void;
    }
    class UITabbarController extends cc.Component {
        items: UITabbarItem[];
        content: cc.Node;
        titleLabel: cc.Label;
        startIndex: number;
        get delegate(): UITabbarDelegate;
        set delegate(value: UITabbarDelegate);
        private _delegate;
        get curSelectedIndex(): number;
        private _curSelectedIndex;
        onLoad(): void;
        start(): void;
        onEnable(): void;
        onDisable(): void;
        onItemClick(item: UITabbarItem): void;
        selectItemAtIndex(idx: number): boolean;
    }
}
declare namespace BGUI {
    class UITabbarItemDelegate {
        tabbarItemShouldSelected?(item: UITabbarItem): boolean;
    }
    class UITabbarItem extends cc.Component {
        title: string;
        prefab: cc.Prefab;
        nodeContent: cc.Node;
        nodeOn: cc.Node;
        nodeOff: cc.Node;
        isLoadFromUrl: boolean;
        featurePrefabUrl: string;
        bundleName: string;
        get content(): cc.Node;
        private _content;
        get selected(): boolean;
        setSelected(value: boolean): void;
        private _selected;
        private _idx;
        get idx(): number;
        set idx(value: number);
        get delegate(): UITabbarItemDelegate;
        set delegate(value: UITabbarItemDelegate);
        private _delegate;
        onEnable(): void;
        onDisable(): void;
        _onClicked(): void;
        start(): void;
        _updateUI(): void;
    }
}
declare namespace BGUI {
    class UITableCell extends cc.Component {
        nSelected: cc.Node;
        nDeselected: cc.Node;
        nHighlighted: cc.Node;
        nUnhighlighted: cc.Node;
        private _idx;
        get idx(): number;
        setIdx(idx: number): void;
        get selected(): boolean;
        setSelected(value: boolean): void;
        private _selected;
        get highlighted(): boolean;
        setHighlighted(value: boolean): void;
        private _highlighted;
    }
}
declare namespace BGUI {
    enum UITableViewFillOrder {
        LEFT_TO_RIGHT__TOP_TO_BOTTOM = 0,
        TOP_TO_BOTTOM__LEFT_TO_RIGHT = 1
    }
    enum UITableViewInteractionMode {
        NONE = 0,
        CLICK = 1,
        SINGLE_SELECTION = 2,
        MULTIPLE_SELECTION = 3
    }
    interface UITableViewDelegate extends UIScrollViewDelegate {
        tableCellClicked?(tableView: UITableView, cell: UITableCell, idx: number): any;
        tableViewDidSelected?(tableView: UITableView, idx: number): any;
        tableViewWillDeselected?(tableView: UITableView, idx: number): any;
        tableViewDidDeselected?(tableView: UITableView, idx: number): any;
        tableCellWillRecycle?(tableView: UITableView, cell: UITableCell, idx: number): any;
        tableCellShouldHighlight?(tableView: UITableView, idx: number): boolean;
        tableCellDidUnhighlight?(tableView: UITableView, idx: number): any;
        tableCellDidHighlight?(tableView: UITableView, idx: number): any;
        tableCellShouldSelect?(tableView: UITableView, idx: number): boolean;
        tableClickOnSelectedCell?(tableView: UITableView, idx: number): any;
    }
    interface UITableViewDataSource {
        numberOfCellsInTableView(tableView: UITableView): number;
        tableCellAtIndex(tableView: UITableView, idx: number): UITableCell;
        tableCellSize?(tableView: UITableView): cc.Size;
        tableCellAnchor?(tableView: UITableView): cc.Vec2;
    }
    class UITableView extends UIScrollView {
        fillOrder: UITableViewFillOrder;
        interactionMode: UITableViewInteractionMode;
        cellPagingEnabled: boolean;
        numberOfPagingCell: number;
        tableCell: cc.Prefab;
        nEmpty: cc.Node;
        get cellSize(): cc.Size;
        set cellSize(value: cc.Size);
        private _cellSize;
        private _cellAnchor;
        private _indices;
        private _cellsUsed;
        private _cellsFreed;
        get rows(): number;
        private _rows;
        get cols(): number;
        private _cols;
        private _realContentSize;
        private _lastestCellCount;
        static _cellPoolCache: any;
        get selectedIndex(): number;
        get selectedIndices(): Array<number>;
        private _selectedIndices;
        get delegate(): UITableViewDelegate;
        set delegate(value: UITableViewDelegate);
        private _tableViewDelegate;
        get dataSource(): UITableViewDataSource;
        set dataSource(value: UITableViewDataSource);
        private _dataSource;
        private _isUsedCellsDirty;
        private _highlightedIndex;
        private _touchingIndex;
        private _highlightedTouchObj;
        private _startIdx;
        private _endIdx;
        cellCacheKey(): string;
        onLoad(): void;
        onEnable(): void;
        onDisable(): void;
        _onShowGame(event: any): void;
        start(): void;
        _handlePressLogic(touch: cc.Touch): void;
        _handleMoveLogic(touch: cc.Touch): void;
        _handleReleaseLogic(touch: cc.Touch, isCancel: boolean): void;
        protected _handlePressLogicForTableInteraction(touch: cc.Touch): void;
        protected _handleMoveLogicForTableInteraction(touch: cc.Touch): void;
        protected _handleReleaseLogicForTableInteraction(touch: cc.Touch, isCancel: boolean): void;
        protected _handleCancelLogicForTableInteraction(touch: cc.Touch): void;
        private _setSelectedForCell;
        private _setHighlightedForCell;
        deselectAll(): void;
        selectAll(): void;
        selectCellAtIndex(index: number): void;
        clearSelection(reload?: boolean): void;
        deselectCellAtIndex(index: number): void;
        private _onContentClick;
        getStartIndex(): number;
        getEndIndex(): number;
        scrollToIndex(index: number, animated?: boolean): void;
        private _updateCellCount;
        protected scrollViewDidScroll(scrollView: UIScrollView): void;
        updateCellAtIndex(idx: number): void;
        _addCellIfNecessary(cell: UITableCell): void;
        cellAtIndex(idx: number): UITableCell;
        reloadData(): void;
        dequeueCell(): UITableCell;
        _indexFromOffset(offset: cc.Vec2): number;
        _offsetFromIndex(index: number): cc.Vec2;
        _moveCellOutOfSight(cell: UITableCell, idx?: number): void;
        _setIndexForCell(index: number, cell: UITableCell): void;
        _onViewSizeChanged(): void;
        _updateGridData(): void;
        _updateContentSize(): void;
    }
}
declare namespace BGUI {
    class UITextManager extends cc.Component {
        private static _centerNotificationStack;
        static showCenterNotification(msg: string): void;
        static effectTextPool: cc.NodePool;
        static showTextFly(from: cc.Node, text: string, color?: cc.Color, prefab?: cc.Prefab): void;
        static showMoneyEffect(from: cc.Node, amount: number, color?: cc.Color, prefab?: cc.Prefab): void;
    }
}
declare namespace BGUI {
    enum TooltipHideType {
        OnTouchDownOnScreen = 0,
        OnTouchUpOrMoveFromTarget = 1,
        Invalid = 2
    }
    class UITooltipHandler extends cc.Component {
        followTarget: boolean;
        showAtTarget: boolean;
        hideType: TooltipHideType;
        manager: UITooltipManager;
        get target(): cc.Node;
        set target(value: cc.Node);
        private _target;
        start(): void;
        update(dt: number): void;
        hide(): void;
    }
}
declare namespace BGUI {
    enum TooltipShowType {
        OnClick = 0,
        OnLongClick = 1,
        OnTouchDown = 2
    }
    class UITooltipListener extends cc.Component {
        message: string;
        prefab: cc.Prefab;
        target: cc.Node;
        showType: TooltipShowType;
        onLoad(): void;
        start(): void;
        onEnable(): void;
        onDisable(): void;
        private _showTooltipFromListener;
    }
}
declare namespace BGUI {
    class TooltipSession {
        constructor(node: cc.Node, target: cc.Node);
        node: cc.Node;
        target: cc.Node;
    }
    class UITooltipManager extends cc.Component {
        static get instance(): UITooltipManager;
        onEnable(): void;
        onDisable(): void;
        private _registerEvent;
        private _unregisterEvent;
        get curTooltipSession(): TooltipSession;
        private _curTooltipSession;
        showTooltipMessage(parent: cc.Node, message: string, nTarget: cc.Node, offset?: cc.Vec2, tracking?: boolean): void;
        showTooltipFromPrefabName(parent: cc.Node, filePath: string, target: cc.Node, cb?: Function, tracking?: boolean): void;
        showTooltipFromPrefab(parent: cc.Node, prefab: cc.Prefab, target: cc.Node, cb?: Function, tracking?: boolean): void;
        showTooltipFromNode(parent: cc.Node, node: cc.Node, target: cc.Node, cb?: Function, tracking?: boolean): void;
        hideTooltip(): void;
        _handleTooltipOnTouchUp(): void;
        _handleTooltipOnTouchDown(event: cc.Event.EventTouch): void;
        _handleTooltipFromTarget(touch: cc.Touch): void;
        _handleTooltipFromCanvas(event: cc.Event.EventTouch): void;
        _handleTooltipFromTouch(touch: cc.Touch): void;
        protected _onTouchBegan(event: cc.Event.EventTouch, captureListeners: any[]): void;
        protected _onTouchMoved(event: cc.Event.EventTouch, captureListeners: any[]): void;
        protected _onTouchEnded(event: cc.Event.EventTouch, captureListeners: any[]): void;
        protected _onTouchCancelled(event: cc.Event.EventTouch, captureListeners: any[]): void;
    }
}
declare namespace BGUI {
    class UITooltipMessage extends UITooltipHandler {
        spBubble: cc.Sprite;
        lbMessage: cc.Label;
    }
}
declare namespace BGUI {
    class UITouchHandler extends cc.Component {
        touchEvent: cc.Component.EventHandler;
        longClickEnabled: boolean;
        private _longPressed;
        private _pressed;
        private _lastHits;
        onEnable(): void;
        onDisable(): void;
        private _registerEvent;
        private _unregisterEvent;
        protected _onTouchBegan(event: cc.Event.EventTouch): boolean;
        protected _onTouchMoved(event: cc.Event.EventTouch): void;
        protected _onTouchEnded(event: cc.Event.EventTouch): void;
        protected _onTouchCancelled(event: cc.Event.EventTouch): void;
        private _longClickExec;
        cancelTouch(): void;
    }
}
declare namespace BGUI {
    class UIWaitingLayout extends cc.Component {
        private static _loadingTags;
        static showWaiting(tag?: string): void;
        static hideWaiting(tag?: string): void;
        private static get waitingLayout();
        private static showWaitingLayout;
        private static hideWaitingLayout;
    }
}
declare namespace BGUI {
    class UIWindow extends UIViewGroup {
        unfocusScale: number;
        focusScale: number;
        private _touchMoved;
        private _pressed;
        windowWillAppear(): void;
        windowDidAppear(): void;
        windowWillDisappear(): void;
        windowDidDisappear(): void;
        onEnable(): void;
        onDisable(): void;
        protected _stopPropagationIfTargetIsMe(event: cc.Event): void;
        _onTouchBegan(event: cc.Event.EventTouch, listeners: any[]): void;
        _onTouchMoved(event: cc.Event.EventTouch, listeners: any[]): void;
        _onTouchEnded(event: cc.Event.EventTouch, listeners: any[]): void;
        _onTouchCancelled(event: cc.Event.EventTouch, listeners: any[]): void;
        hide(): void;
    }
}
declare namespace BGUI {
    class UIWindowManager extends cc.Component {
        private _windowStack;
        static get instance(): UIWindowManager;
        onLoad(): void;
        pushWindowToTop(def: typeof cc.Component | UIWindow): void;
        pushWindowToTopAtIndex(lIdx: number): void;
        removeAllWindows(): void;
        removeWindow(wd: typeof cc.Component | UIWindow, animated?: boolean): void;
        showWindowFromPrefabName(filePath: string, callback?: Function, animated?: boolean): void;
        showWindowFromPrefab(prefab: cc.Prefab, callback?: Function, animated?: boolean): void;
        showWindowFromNode(node: cc.Node, callback?: Function, animated?: boolean): void;
        get fadedBackground(): cc.Node;
        updateFadedBackground(): void;
        hasWindow(def: typeof cc.Component | string): boolean;
        findWindow(def: typeof cc.Component | string | any): cc.Component;
    }
}
declare namespace BGUI {
    class ArrayUtil {
        static copy2DArray(array: any[][]): any[][];
        static fisherYatesShuffle(array: any[]): any[];
        static confound(array: []): any[];
        static flattening(array: any[]): any[];
        static combineArrays(array1: any[], array2: any[]): any[];
        static getRandomValueInArray(array: any[]): any;
    }
}
declare namespace BGUI {
    class CalUtil {
        static getRandomNumber(min?: number, max?: number): number;
        static getAngle(p1: cc.Vec2, p2: cc.Vec2): number;
        static getDistance(p1: cc.Vec2, p2: cc.Vec2): number;
        static angleToRadian(angle: number): number;
    }
}
declare namespace BGUI {
    enum ClientDataKey {
        KEY_ENCRYPT = "zzzzzzzzzzmm",
        GUEST_ID = "_guest_id",
        DEVICE_ID = "_device_id",
        PASSWORD = "_password",
        NATION = "_nation",
        USER_ID = "_user_id",
        OPEN_ID = "_open_id",
        USER_NAME = "_user_name",
        SESSION_KEY = "_session_key",
        SESSION_TOKEN = "session_token",
        ACCESS_TOKEN = "_access_token",
        ACCESS_TOKEN2 = "_access_token",
        OAUTHEN_CODE = "_oauth_code",
        LOGIN_METHOD = "login_method",
        LANGUAGE = "key_user_lang",
        FORCE_UPDATE_VERSION_IOS = "FORCE_UPDATE_VERSION_IOS",
        FORCE_UPDATE_VERSION_ANDROID = "FORCE_UPDATE_VERSION_ANDROID"
    }
    class ClientData {
        static getString(key: string | number, defaultValue: string): string;
        static setString(key: string | number, value: string): void;
        static getNumber(key: string | number, defaultValue: number): number;
        static setNumber(key: string | number, value: number): void;
        static getBoolean(key: string | number, defaultValue: boolean): boolean;
        static setBoolean(key: string | number, value: boolean): void;
    }
}
declare namespace BGUI {
    class EaseUtils extends cc.Component {
        static bezierAt(a: number, b: number, c: number, d: number, t: number): number;
        static easeIn(dt: number, rate: number): number;
        static easeOut(dt: number, rate: number): number;
        static easeInOut(dt: number, rate: number): number;
        static easeExponentialIn(dt: number): number;
        static easeExponentialOut(dt: number): number;
        static easeExponentialInOut(dt: number): number;
        static easeSineIn(dt: number): number;
        static easeSineOut(dt: number): number;
        static easeSineInOut(dt: number): number;
        static easeElasticIn(dt: number, rate: number): number;
        static easeElasticOut(dt: number, rate: number): number;
        static easeElasticInOut(dt: number, rate: number): number;
        static easeQuadraticActionIn(dt: number): number;
        static easeQuadraticActionOut(dt: number): number;
        static easeQuadraticActionInOut(dt: number): number;
        static easeQuarticActionIn(dt: number): number;
        static easeQuarticActionOut(dt: number): number;
        static easeQuarticActionInOut(dt: number): number;
        static easeQuinticActionIn(dt: number): number;
        static easeQuinticActionOut(dt: number): number;
        static easeQuinticActionInOut(dt: number): number;
        static easeCircleActionIn(dt: number): number;
        static easeCircleActionOut(dt: number): number;
        static easeCircleActionInOut(dt: number): number;
        static easeCubicActionIn(dt: number): number;
        static easeCubicActionOut(dt: number): number;
        static easeCubicActionInOut(dt: number): number;
        static easeBackIn(dt: number): number;
        static easeBackOut(dt: number): number;
        static easeBackInOut(dt: number): number;
    }
}
declare namespace BGUI {
    class ZLog {
        constructor();
        static enable: boolean;
        static assert(condition?: boolean, message?: string, ...data: any[]): void;
        static clear(): void;
        static count(label?: string): void;
        static debug(message?: any, ...optionalParams: any[]): void;
        static dir(value?: any, ...optionalParams: any[]): void;
        static dirxml(value: any): void;
        static error(message?: any, ...optionalParams: any[]): void;
        static exception(message?: string, ...optionalParams: any[]): void;
        static group(groupTitle?: string, ...optionalParams: any[]): void;
        static groupCollapsed(groupTitle?: string, ...optionalParams: any[]): void;
        static groupEnd(): void;
        static info(message?: any, ...optionalParams: any[]): void;
        static log(message?: any, ...optionalParams: any[]): void;
        static markTimeline(label?: string): void;
        static table(...tabularData: any[]): void;
        static time(label?: string): void;
        static timeEnd(label?: string): void;
        static timeStamp(label?: string): void;
        static timeline(label?: string): void;
        static timelineEnd(label?: string): void;
        static warn(message?: any, ...optionalParams: any[]): void;
    }
}
declare namespace BGUI {
    class NodeUtil {
        static getRelativePosition(node: cc.Node, target: cc.Node): cc.Vec2;
    }
}
declare namespace BGUI {
    class ObjectUtil {
        static deepCopy(target: object): any;
        static copy(target: object): object;
    }
}
declare namespace BGUI {
    enum Platform {
        INVALID = 0,
        ANDROID = 1,
        WINDOWS = 2,
        IOS = 3,
        WEB = 4,
        MAC = 5
    }
    enum StoreType {
        WEB = 0,
        IOS = 1,
        ANDROID = 2,
        ANDROID_STORE = 3,
        IOS_STORE = 4
    }
    class PlatformInterface {
        private static ObjCName;
        private static JavaName;
        static get useObjC(): boolean;
        static get useJava(): boolean;
        static hasNetwork(): boolean;
        private static _deviceToken;
        static copy(text: string): void;
        static vibrationEffect(time: number): any;
        static get OSName(): string;
        static get platform(): Platform;
        static get deviceID(): string;
        static get deviceModel(): string;
        static get deviceToken(): string;
        static get phoneNumber(): string;
        static get OSVersion(): string;
        static get appVersion(): string;
        static get versionCode(): string;
        static get bundleID(): string;
        static get connectionType(): cc.sys.NetworkType;
    }
}
declare namespace BGUI {
    enum ePrefabDefine {
        BUTTON_COMMON = "BUTTON_COMMON",
        FADED_BACKGROUND = "FADED_BACKGROUND",
        POPUP_COMMON = "POPUP_COMMON",
        LOADING = "LOADING",
        TEXT_FLY = "TEXT_FLY",
        CENTER_NOTIFICATION = "CENTER_NOTIFICATION",
        WAITING_LAYOUT = "WAITING_LAYOUT"
    }
    class PrefabUtils extends cc.Component {
        static loadPrefab(e: string, cb: (err: Error, prf: cc.Prefab) => void): void;
        static getPrefab(e: string): cc.Prefab;
        static createNode(e: string): cc.Node;
    }
}
declare namespace BGUI {
    class PromiseUtil {
        static delay(time: number): Promise<void>;
    }
}
declare namespace BGUI {
    const FOLDER_NAME: {
        REQUIRE: string;
        COMMON: string;
        LOBBY: string;
    };
    class ResourcesManager {
        private static _instance;
        static get instance(): ResourcesManager;
        dictPrefabs: Map<string, cc.Prefab>;
        dictSounds: Map<string, cc.AudioClip>;
        dictAtlas: Map<string, cc.SpriteAtlas>;
        preLoad(url: string, progress: Function, loadDone: Function): void;
        getPrefab(namePrefab: string): cc.Prefab;
        getSound(nameSound: string): cc.AudioClip;
        logTest(): void;
    }
}
declare namespace BGUI {
    class StringUtils {
        static percentString(percent: number): string;
        static humanFileSize(bytes: number, si?: boolean): string;
        static paramsToQueryString(data: any): string;
        static queryStringToParams(url: string): any;
        static formatNumber(num: number, digits?: number): string;
        static getQueryString(field: any, url: any): string;
        static replaceAll(str: any, search: any, repl: any): string;
        static ISOStringFromTime(time: number): string;
        static stringFromShortTime(time: number): string;
        static stringFromRemainingTime(time: number, maxSize?: number): string;
        static dateTimeFromTimeString(str: string): Date;
        static timestampToDateTimeString(time: number, flipX?: boolean, token?: string): string;
        static timestampToString(time: number): string;
        static versionCompare(v1: string, v2: string, options?: {
            lexicographical?: any;
            zeroExtend?: any;
        }): number;
    }
}
declare namespace BGUI {
    type TaskFinishCallback = () => void;
    type TaskCallback = (TaskFinishCallback: any) => void;
    class TaskQueue {
        private _curTask;
        private _taskQueue;
        pushTask(task: TaskCallback, priority?: number): void;
        clearTask(): void;
        private executeNextTask;
    }
    class TaskManager {
        private static _instance;
        private _taskQueues;
        static getInstance(): TaskManager;
        static destory(): void;
        private constructor();
        pushTask(task: TaskCallback, priority?: number): void;
        pushTaskByTag(task: TaskCallback, tag: number, priority?: number): void;
        clearTaskQueue(tag?: number): void;
        clearAllTaskQueue(): void;
        private getTaskQueue;
    }
}
declare namespace BGUI {
    class TimeUtil {
        static getTargetTimestamp(hour?: number, minute?: number, second?: number): number;
        static getCurrentTimestamp(): number;
    }
}
declare namespace BGUI {
    class Utils {
        static get minScaleFactor(): number;
        static get maxScaleFactor(): number;
        static readonly EVENT_CHANGE_FRAME = "EVENT_CHANGE_FRAME";
        private static get protoLabel();
        static generateSystemTextSize(str: string, fontSize: number, lineHeight: number, overFlow: cc.Label.Overflow, enabledWrap?: boolean, width?: number): cc.Size;
        static alignView(): void;
        static randomInt(min: any, max: any): number;
        static randomFloat(min: any, max: any): number;
        static randomBool(): boolean;
        static randomSuccess(ratio: number): boolean;
        static isValidEmail(email: string): boolean;
        static isValidUsername(email: string): boolean;
        static isValidMobilePhoneNumber(phoneNumber: string): boolean;
        static getRandomInt: (min: number, max: number) => number;
        static formatMoneyWithCommaOnly: (money: number) => string;
        static getAngleByTwoPoint(param: cc.Vec2, param1: cc.Vec2): number;
        static pointFromAngleAndRadius(center: cc.Vec2, angle: number, radius: number): cc.Vec2;
        static formatNumber00(number: number, length: number): string;
        static transitionsNode(nodeFrom: cc.Node, nodeTo: cc.Node, callback?: Function): void;
        static transitionsNode2(nodeFrom: cc.Node, nodeTo: cc.Node, callback?: Function): void;
        static transitionsNode3(nodeFrom: cc.Node, nodeTo: cc.Node, callback?: Function): void;
        static findDeep(name: string, node: cc.Node): cc.Node;
        static transitionScene(sceneUrl: string, callback?: Function): void;
        static randomArrayItems(arr: Array<any>, count?: number): any[];
        static randomNotSame(max: number, min: number): Array<number>;
    }
}
import BGUI = BGUI;