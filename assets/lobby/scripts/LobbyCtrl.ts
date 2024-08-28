// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { LANGUAGE, LanguageMgr } from "../../framework/localize/LanguageMgr";
import LoginFeature from "../../framework/ui/LoginFeature";
import { LobbyCmdId, LobbyConst } from "../LobbyConst";
import { LobbySend } from "../scripts/network/LobbySend";
import CanvasAlwaysShow from "./CanvasAlwaysShow";
import BundleBooGyi from "./gameicon/BundleBooGyi";
import BundleMiniGame from "./gameicon/BundleMiniGame";
import BundleShanKoeMee from "./gameicon/BundleShanKoeMee";
import BundleShweShan from "./gameicon/BundleShweShan";
import GetInforFirstGame from "./network/GetInformationFirstGame";
import Support from "./Popup/LobbySupport";
import { cmdReceive } from "./network/LobbyReceive";
import PopUp_LeaderBoard from "./Popup/Popup_Leaderboard";
import BundleBacarrat from "./gameicon/BundleBacarrat";
import BundleLongHo from "./gameicon/BundleLongHo";
import BundleBauCau from "./gameicon/BundleBauCua";

import Mail from "./Popup/Mail";
import Friend from "./Popup/Friend";
import LabelLocalized from "../../framework/localize/LabelLocalized";
const { ccclass, property } = cc._decorator;

@ccclass
export default class LobbyCtrl extends cc.Component {
  public static instance: LobbyCtrl = null;

  @property(cc.Node)
  nHeader: cc.Node = null;

  @property(cc.Node)
  nHeaderLogin: cc.Node = null;

  //info

  configFirstGame: any = null;

  @property(BundleMiniGame)
  bundleTX: BundleMiniGame = null;

  @property(cc.AudioClip)
  bgMusic: cc.AudioClip = null;

  @property(cc.Node)
  nCounterEgg: cc.Node = null;

  @property(cc.Prefab)
  settingPU: cc.Prefab = null;

  @property(cc.Prefab)
  supportPU: cc.Prefab = null;
  @property(cc.Prefab)
  shopPU: cc.Prefab = null;
  @property(cc.Prefab)
  friendPU: cc.Prefab = null;
  @property(cc.Prefab)
  leaderboardPU: cc.Prefab = null;
  @property(cc.Prefab)
  mailPU: cc.Prefab = null;

  @property(cc.Node)
  nCounterMail: cc.Node = null;

  @property(cc.Node)
  nTopJackpot: cc.Node = null;

  @property(cc.Node)
  btnSupport: cc.Node = null;
  @property(cc.Node)
  supportBlock: cc.Node = null;

  @property(LoginFeature)
  btnLogin: LoginFeature = null;

  @property(LoginFeature)
  btnReg: LoginFeature = null;

  @property(LoginFeature)
  btnForget: LoginFeature = null;
  musicOn: boolean = true;

  @property(BundleShanKoeMee)
  bundleSKM: BundleShanKoeMee = null;

  @property(BundleBooGyi)
  bundleBoogyi: BundleBooGyi = null;

  @property(BundleShweShan)
  bundleShweshan: BundleShweShan = null;

  @property(BundleBacarrat)
  bundleBaccarat: BundleBacarrat = null;

  @property(BundleLongHo)
  bundleLongHo: BundleLongHo = null;

  @property(BundleBauCau)
  bundleBauCua: BundleBauCau = null;

  @property(cc.SpriteFrame)
  vipSF: cc.SpriteFrame[] = [];
  checkNewMail = null;
  dataMail = [];
  friendList = [];

  deleteMailIds: Array<number> = [];
  popUp_Support: cc.Node = null;
  popUp_Shop: cc.Node = null;
  popUp_Friend: cc.Node = null;
  popUp_Setting: cc.Node = null;
  popUp_Mail: cc.Node = null;

  popUp_LeaderBoard: cc.Node = null;
  mailLoadSuccess = false;
  onLoad() {
    let data = cc.sys.localStorage.getItem("current_user_info_login");
    if (data) {
      this.btnLogin.enabled = false;
      this.scheduleOnce(() => {
        this.btnLogin.enabled = true;
      }, 1);
    }

    LobbyCtrl.instance = this;
    this._updateUIHeader();
    this.initPopup();
    this.playBgMusic();
    this.initLeaderBoard();

    BGUI.NetworkPortal.instance.addCmdListener(
      LobbyCmdId.TOP_PLAYERS,
      this.receiveTopPlayers,
      this
    );

    BGUI.NetworkPortal.instance.addCmdListener(
      LobbyCmdId.RECEIVE_MAIL,
      this.receiveMail,
      this
    );

    BGUI.NetworkPortal.instance.addCmdListener(
      LobbyCmdId.LIST_FRIEND,
      this.receiveListFriend,
      this
    );
  }

  start(): void {
    let getInfoFirstGame = cc.Canvas.instance.getComponent(GetInforFirstGame);
    if (!getInfoFirstGame) {
      cc.Canvas.instance.addComponent(GetInforFirstGame);
    }
  }

  onEnable() {
    cc.audioEngine.stopMusic();
    const soundState = localStorage.getItem("sound");
    // cc.log(soundState, "soundState");
    if (soundState == "true") {
      this.playBgMusic();
    }
    if (soundState == "false") {
      this.stopBgMusic();
    } else {
      this.playBgMusic();
    }
    // this.musicOn = true;
    BGUI.EventDispatch.instance.add(
      BGUI.EVENT_GAMECORE.LOGIN_SUCCESS,
      this.onLoginSucess,
      this
    );
    BGUI.EventDispatch.instance.add(
      BGUI.EVENT_GAMECORE.LOGOUT,
      this.logOut,
      this
    );

    BGUI.EventDispatch.instance.add(
      LobbyConst.EVENT_NAME.AUTO_LOGIN_BY_TOKEN,
      this.autoLoginByToken,
      this
    );

    // BGUI.NetworkPortal.instance.addCmdListener(
    //   LobbyCmdId.RECEIVE_MAIL,
    //   this.receiveMail,
    //   this
    // );

    let canvasAlways = cc.Canvas.instance.getComponent(CanvasAlwaysShow);
    if (!canvasAlways) {
      cc.Canvas.instance.addComponent(CanvasAlwaysShow);
    }
    this.getMail();
    // this._showGUIChooseLanguage();
  }

  private _showGUIChooseLanguage() {
    let isShow = BGUI.ClientData.getString("SHOW_GUI_CHOOSE_LANGUAGE", "");
    if (!isShow) {
      let bundle = "Lobby";
      let prfAttendance = "prefabs/language/GUI_LANGUAGE";
      BGUI.BundleManager.instance.getPrefabFromBundle(
        prfAttendance,
        bundle,
        (prf: cc.Prefab) => {
          BGUI.UIPopupManager.instance.showPopupFromPrefab(prf);
        }
      );
    } else {
      this._updateImgChoseLange();
    }
  }

  onDisable() {
    // BGUI.NetworkPortal.instance.removeCmdListener(this, LobbyCmdId.RECEIVE_MAIL);
    BGUI.NetworkPortal.instance.removeCmdListener(this, LobbyCmdId.TOP_PLAYERS);
    BGUI.EventDispatch.instance.remove(
      LobbyConst.EVENT_NAME.AUTO_LOGIN_BY_TOKEN,
      this.autoLoginByToken,
      this
    );
    BGUI.EventDispatch.instance.remove(
      BGUI.EVENT_GAMECORE.LOGIN_SUCCESS,
      this.onLoginSucess,
      this
    );
    BGUI.EventDispatch.instance.remove(
      BGUI.EVENT_GAMECORE.LOGOUT,
      this.logOut,
      this
    );
    BGUI.NetworkPortal.instance.removeCmdListener(
      this,
      LobbyCmdId.RECEIVE_MAIL
    );
    BGUI.NetworkPortal.instance.removeCmdListener(this, LobbyCmdId.LIST_FRIEND);
  }

  playBgMusic() {
    BGUI.ZLog.log("playBgMusic:" + BGUI.AudioManager.instance.musicVolume);
    // BGUI.AudioManager.instance.playMusic(this.bgMusic);
    // BGUI.AudioManager.instance.musicVolume = 3;
    // cc.audioEngine.playMusic(this.bgMusic, true);
    this.musicOn = true;
    localStorage.setItem("sound", "true");
  }
  stopBgMusic() {
    BGUI.ZLog.log("stopBgMusic ");
    // BGUI.AudioManager.instance.pauseMusic();
    // BGUI.AudioManager.instance.musicVolume = 0;
    cc.audioEngine.stopMusic();
    this.musicOn = false;
    localStorage.setItem("sound", "false");
  }

  logOut() {
    cc.sys.localStorage.removeItem("current_user_info_login");
    this._updateUIHeader();
    BGUI.UIPopupManager.instance.removeAllPopups();

    location.reload();
  }

  onLoginSucess() {
    this.nHeader.active = true;
    this.nHeaderLogin.active = false;
    // this.bundleShweshan._onClicked();

    if (!BGUI.NetworkPortal.instance.isConnected())
      BGUI.NetworkPortal.instance.connect();
    this.scheduleOnce(() => {
      this.getMail();
    }, 1);
  }

  updateJackpot(cmdId: number, data) {
    let res = new cmdReceive.ReceivedUpdateSlotJackpot();
    res.unpackData(data);

    let jackpot = JSON.parse(res.jackpots);

    // BGUI.ZLog.log('updateJackpot ---------> ' + JSON.stringify(res['jackpots']));
    for (const key in jackpot) {
      var dataJackpot = {
        slotID: key,
        listJackPot: jackpot[key],
      };

      let object = dataJackpot.listJackPot;

      var lst = [];
      for (const property in object) {
        lst.push(object[property]);
      }
      LobbyConst.slotByKeys.set(dataJackpot.slotID, lst);
    }

    BGUI.EventDispatch.instance.emit(
      LobbyConst.EVENT_NAME.EVENT_UPDATE_JACKPOT
    );
  }

  private _showGameTX() {
    // if (CC_DEBUG || CC_DEV) return;
    this.bundleTX._onClicked();
  }

  private _updateUIHeader() {
    this.nHeader.active = false;
    this.nHeaderLogin.active = true;
  }

  getInfoOpenEgg() {
    BGUI.UIWaitingLayout.showWaiting();
    let url = this.urlGetOpenEgg(
      BGUI.UserManager.instance.mainUserInfo.identification
    );
    BGUI.Https.get(url, (response) => {
      BGUI.UIWaitingLayout.hideWaiting();
      if (!response) return;
      let totalEgg = parseInt(response.gold) + parseInt(response.white);
      this.nCounterEgg.active = totalEgg > 0;
      this.nCounterEgg.getChildByName("lb").getComponent(cc.Label).string =
        totalEgg.toString();
    });
  }

  getTotalMail() {
    BGUI.UIWaitingLayout.showWaiting();
    let url = this.urlGetTotalMail(
      BGUI.UserManager.instance.mainUserInfo.nickname
    );
    BGUI.Https.get(url, (response) => {
      BGUI.UIWaitingLayout.hideWaiting();
      if (!response) return;
      BGUI.ZLog.log("getTotalMail ====> " + JSON.stringify(response));
      let totalMail = response.total;
      this.nCounterMail.active = totalMail > 0;
      this.nCounterMail.getChildByName("lb").getComponent(cc.Label).string =
        totalMail.toString();
    });
  }

  urlGetTotalMail(nickname) {
    return LobbyConst.BASE_URL + "c=2032&nickname=" + nickname;
  }
  urlGetOpenEgg(userId) {
    return LobbyConst.BASE_URL + "c=2037&id=" + userId;
  }

  onClickFanpage() {
    cc.sys.openURL(this.configFirstGame && this.configFirstGame.facebook);
  }
  onClickZalo() {
    cc.sys.openURL(
      this.configFirstGame &&
        this.configFirstGame.cskh &&
        this.configFirstGame.cskh.zalo
    );
  }
  onClickMessenger() {
    cc.sys.openURL(
      this.configFirstGame &&
        this.configFirstGame.cskh &&
        this.configFirstGame.cskh.messenger
    );
  }
  onClickTele() {
    cc.sys.openURL(
      this.configFirstGame &&
        this.configFirstGame.cskh &&
        this.configFirstGame.cskh.telegram
    );
  }

  onClickLine() {
    cc.sys.openURL(
      this.configFirstGame &&
        this.configFirstGame.cskh &&
        this.configFirstGame.cskh.line
    );
  }

  onClickTalk() {
    cc.sys.openURL(
      this.configFirstGame &&
        this.configFirstGame.cskh &&
        this.configFirstGame.cskh.ka_kao_talk
    );
  }

  ///// BEGIN LANGUAGE /////
  _updateImgChoseLange() {
    let lang = LanguageMgr.instance.getCurrentLanguage();
    let node_login = this.node.getChildByName("nHeader-Login");
    let layout = node_login.getChildByName("layoutLanguage");
    layout.children.find((e: cc.Node) => {
      if (e && e.name == lang) {
        layout.getChildByName("img-lang-chose").setPosition(e.position);
      }
    });
  }

  onChangeLangByName(sender: cc.Button, data) {
    this.processChangeLanguage(data);
  }

  processChangeLanguage(data) {
    let self = this;
    let lang = LANGUAGE.ENGLISH;
    let languageName = "";
    switch (data) {
      case "en":
        lang = LANGUAGE.ENGLISH;
        languageName = "English";
        break;
      case "mm":
        lang = LANGUAGE.MYANMAR;
        languageName = "ျမန္မာ။";
        break;
      case "vn":
        lang = LANGUAGE.VIETNAMESE;
        languageName = "Tiếng Việt";
        break;
      case "tl":
        lang = LANGUAGE.THAILAN;
        languageName = "ไทย";
        break;
      case "cam":
        lang = LANGUAGE.CAMBODIA;
        languageName = "ភាសាខ្មែរ";
        break;
    }

    if (LanguageMgr.instance.getCurrentLanguage() == lang) return;

    this.emitLogicChoose(data);
  }

  emitLogicChoose(data) {
    this.updateLang(data);
    cc.Canvas.instance.node.emit(
      BGUI.EVENT_GAMECORE.EVENT_UPDATE_LANGUAGE_LABEL,
      this
    );
    cc.Canvas.instance.node.emit(
      BGUI.EVENT_GAMECORE.EVENT_UPDATE_LANGUAGE_SPRITE,
      this
    );
    cc.Canvas.instance.node.emit(
      BGUI.EVENT_GAMECORE.EVENT_UPDATE_LANGUAGE_SPINE,
      this
    );
  }

  updateLang(lang) {
    BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, lang);
    BGUI.ClientData.setString("SHOW_GUI_CHOOSE_LANGUAGE", lang);
    LanguageMgr.instance.setCurrentLanguage(lang);
    LanguageMgr.updateLocalization(lang);
    // this._updateImgChoseLange();
  }

  ///  END LANGUAGE ///

  autoLoginByToken() {
    let data = cc.sys.localStorage.getItem("current_user_info_login");
    BGUI.ZLog.log("autoLoginByToken", data);
    if (data != null && data != undefined) {
      if (LobbyConst.CHECK_GET_API_FIRST_GAME) {
        this.loginAccessToken(data);
        BGUI.ZLog.log("loginAccessToken", data);
      }
    }
  }

  loginAccessToken(response) {
    let jsonData = JSON.parse(response);
    let success = jsonData["success"];
    let errorCode = jsonData["errorCode"];
    if (success) {
      let sessionKey = jsonData["sessionKey"];
      var userData = JSON.parse(this.Jacob__Codec__Base64__decode(sessionKey));
      BGUI.UserManager.instance.mainUserInfo = userData;
      BGUI.UserManager.instance.mainUserInfo.sessionKey =
        jsonData["sessionKey"];
      BGUI.UserManager.instance.mainUserInfo.accessToken =
        jsonData["accessToken"];
      BGUI.UserManager.instance.mainUserInfo.identification = jsonData["id"];
      BGUI.UserManager.instance.mainUserInfo.reference = jsonData["reference"];
      // BGUI.UserManager.instance.mainUserInfo.game = jsonData["password"];
      var url = this.urlLoginAcccessToken(
        BGUI.UserManager.instance.mainUserInfo.nickname,
        BGUI.UserManager.instance.mainUserInfo.accessToken,
        BGUI.PlatformInterface.OSName
      );
      BGUI.Https.get(url, (response) => {
        this.callbackLogin(response);
      });
    }
  }

  public Jacob__Codec__Base64__decode(input) {
    var _keyStr =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let output: any = [],
      chr1,
      chr2,
      chr3,
      enc1,
      enc2,
      enc3,
      enc4,
      i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output.push(String.fromCharCode(chr1));

      if (enc3 != 64) {
        output.push(String.fromCharCode(chr2));
      }
      if (enc4 != 64) {
        output.push(String.fromCharCode(chr3));
      }
    }

    output = output.join("");

    return output;
  }

  urlLoginAcccessToken(nickName, accessToken, platform) {
    return (
      LobbyConst.BASE_URL +
      "c=2&nn=" +
      nickName +
      "&at=" +
      accessToken +
      "&pf=" +
      platform
    );
  }

  callbackLogin(response) {
    var jsonData = response;
    var success = jsonData["success"];
    var errorCode = jsonData["errorCode"];
    if (success) {
      cc.log("===============onLoginSucess=======================", jsonData);
      BGUI.GameCoreManager.instance.isLoginSuccess = true;
      var sessionKey = jsonData["sessionKey"];
      var userData = JSON.parse(this.Jacob__Codec__Base64__decode(sessionKey));
      cc.sys.localStorage.setItem(
        "current_user_info_login",
        JSON.stringify(jsonData)
      );
      BGUI.UserManager.instance.mainUserInfo = userData;
      BGUI.UserManager.instance.mainUserInfo.sessionKey =
        jsonData["sessionKey"];
      BGUI.UserManager.instance.mainUserInfo.accessToken =
        jsonData["accessToken"];
      BGUI.UserManager.instance.mainUserInfo.identification = jsonData["id"];
      BGUI.UserManager.instance.mainUserInfo.game = jsonData["game"];
      BGUI.UserManager.instance.mainUserInfo.reference = jsonData["reference"];

      cc.log(BGUI.UserManager.instance.mainUserInfo, userData);

      BGUI.EventDispatch.instance.emit(BGUI.EVENT_GAMECORE.LOGIN_SUCCESS);
      if (!BGUI.NetworkPortal.instance.isConnected()) {
        BGUI.NetworkPortal.instance.connect();
      }

      if (BGUI.UserManager.instance.mainUserInfo.game != "") {
        switch (BGUI.UserManager.instance.mainUserInfo.game) {
          case "BooGyi":
            this.bundleBoogyi._onClicked();
            break;
          case "ShanKoeMee":
            this.bundleSKM._onClicked();
            break;
          case "ShweShan":
            this.bundleShweshan._onClicked();
            break;
          case "Baccarat":
            this.bundleBaccarat._onClicked();
            break;
          case "LongHo":
            this.bundleLongHo._onClicked();
            break;
          case "BauCua":
            this.bundleBauCua._onClicked();
            break;
        }
      }
    } else {
      BGUI.ZLog.log(
        "===============onLogin FAILLLL=======================",
        jsonData
      );
      var message = "";
      switch (parseInt(errorCode)) {
        case 1001:
          message = LanguageMgr.getString("lobby.warning.server_lost_connect");
          var listAction = [
            BGUI.PopupAction.make("Retry", () => {
              this.autoLoginByToken();
            }),
          ];
          break;
        case 4444:
          message = LanguageMgr.getString(
            "lobby.warning.account_logining_please_logout"
          );
          break;
        case 1109:
          message = LanguageMgr.getString("lobby.warning.account_banning");
          break;
        case 1008:
          message = LanguageMgr.getString(
            "lobby.warning.invalid_authentication_code"
          );
          break;
        case 1021:
          message = LanguageMgr.getString(
            "lobby.warning.overtime_authentication"
          );
          break;
        case 1114:
          message = LanguageMgr.getString(
            "lobby.warning.server_maintain_go_later"
          );
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
          message = LanguageMgr.getString(
            "lobby.warning.you_not_create_username"
          );
          break;
      }

      if (message != "" && message != undefined && message != "undefined") {
        BGUI.UIPopupManager.instance.showPopupSmall(message, listAction);
      }

      // if (errorCode == 2001) {
      //   BGUI.ZLog.log("GUI_DISPLAYNAME");
      // BGUI.UIPopupManager.instance.showPopupFromPrefab(BGUI.CommonAssetDefined.instance.getPrefabByName("GUI_DISPLAYNAME"), (guiDisplayName: GUIDisplayNameCtrl) => {
      //     guiDisplayName.setInfo(this.edbAccount.string, window.md5(this.edbPass.string));
      // });
      // BGUI.UIPopupManager.instance.showPopupFromPrefab(BGUI.CommonAssetDefined.instance.getPrefabByName("GUI_DISPLAYNAME"), (guiDisplayName: GUIDisplayNameCtrl) => {
      //     guiDisplayName.setInfo(this.edbAccount.string, window.md5(this.edbPass.string));
      // });
      // }
    }
  }

  showPopUpSetting() {
    BGUI.UIPopupManager.instance.showPopupFromPrefab(this.settingPU);
  }
  toggleSupportOn() {
    this.supportBlock.active = true;

    this.btnSupport.getComponent(cc.Button).interactable = false;
    this.popUp_Support.active = true;
    this.popUp_Support.runAction(cc.moveBy(0.4, -450, 0));
    this.scheduleOnce(
      () => (this.btnSupport.getComponent(cc.Button).interactable = true),
      1.5
    );
  }
  initPopup() {
    this.initSupport();
    this.initShop();
    this.initFriend();
    this.initMail();
    this.initSetting();
  }
  initSupport() {
    this.popUp_Support = cc.instantiate(this.supportPU);
    this.popUp_Support.setPosition(cc.v2(450, 0));
    this.popUp_Support.active = false;
    this.node.addChild(this.popUp_Support);
  }
  initShop() {
    this.popUp_Shop = cc.instantiate(this.shopPU);
    this.popUp_Shop.setPosition(cc.v2(0, 0));
    this.popUp_Shop.active = false;
    this.node.addChild(this.popUp_Shop);
  }
  initFriend() {
    this.popUp_Friend = cc.instantiate(this.friendPU);
    this.popUp_Friend.setPosition(cc.v2(0, 0));
    this.popUp_Friend.active = false;
    this.node.addChild(this.popUp_Friend);
  }
  initMail() {
    this.popUp_Mail = cc.instantiate(this.mailPU);
    this.popUp_Mail.setPosition(cc.v2(0, 0));
    this.popUp_Mail.active = false;
    this.node.addChild(this.popUp_Mail);
  }
  initSetting() {
    this.popUp_Setting = cc.instantiate(this.settingPU);
    this.popUp_Setting.setPosition(cc.v2(0, 0));
    this.popUp_Setting.active = false;
    this.node.addChild(this.popUp_Setting);
  }

  togglePopUp(event: Event, idx) {
    switch (idx) {
      case "1":
        this.popUp_Shop.active = true;
        // BGUI.UIPopupManager.instance.showPopupFromPrefab(this.shopPU);
        break;
      case "5":
        if (this.mailLoadSuccess == true) {
          this.popUp_Mail.active = true;
        }

        // BGUI.UIPopupManager.instance.showPopupFromPrefab(this.friendPU);
        break;
      case "4":
        try {
          let pk = new LobbySend.SendListFriend();
          BGUI.NetworkPortal.instance.sendPacket(pk);
        } catch (error) {
          cc.error("Send ListFriend Error: ", error);
        }
        break;
      case "7":
        this.popUp_Setting.active = true;

        // BGUI.UIPopupManager.instance.showPopupFromPrefab(this.settingPU);
        break;
      case "8":
        this.toggleSupportOn();
        break;
      default:
        break;
    }
  }

  receiveListFriend(cmdId: any, data: Uint8Array) {
    let res = new cmdReceive.ReceivedListFriend();
    res.unpackData(data);
    console.log("HHHHH LIST_FRIEND", res);
    switch (res.error) {
      case 0:
        cc.log(res.list);
        this.popUp_Friend.active = true;
        Friend.instance.createFriend(res);
        break;
      default:
        console.error("receiveListFriend ERROR", res.error);
        break;
    }
  }

  getMail() {
    try {
      let pk = new LobbySend.SendMail();
      BGUI.NetworkPortal.instance.sendPacket(pk);
    } catch (error) {
      console.error("Send Mail Error: ", error);
    }
  }
  receiveMail(cmdId: any, data: Uint8Array) {
    let res = new cmdReceive.ReceivedMail();
    res.unpackData(data);
    this.dataMail = [];
    this.dataMail = res.list;
    console.log("HHHHH MAIL", res);
    let newMailCounter = 0;
    switch (res.error) {
      case 0:
        this.mailLoadSuccess = true;
        for (let i = 0; i < res.list.length; i++) {
          let mailInfo = res.list[i];
          if (mailInfo["status"] == 0) {
            newMailCounter += 1;
          }
          if (mailInfo["isClaimed"] == true || mailInfo["gold"] == 0) {
            if (this.deleteMailIds.indexOf(mailInfo["id"]) < 0) {
              this.deleteMailIds.push(mailInfo["id"]);
            }
          }
        }
        if (newMailCounter > 0) {
          this.nCounterMail.active = true;
          this.nCounterMail.children[1].getComponent(cc.Label).string =
            newMailCounter.toString();
        } else {
          this.nCounterMail.active = false;
        }

        break;
      default:
        console.error("receiveMail ERROR", res.error);
        break;
    }
  }

  sendTopPlayers() {
    try {
      let pk = new LobbySend.SendTopPlayer();
      BGUI.NetworkPortal.instance.sendPacket(pk);
    } catch (error) {
      console.error("Send Mail Error: ", error);
    }
  }

  receiveTopPlayers(cmdId: any, data: Uint8Array) {
    let res = new cmdReceive.ReceivedTopPlayers();
    res.unpackData(data);
    console.error("HHHHH TOP PLAYERS", res);

    switch (res.error) {
      case 0:
        this.popUp_LeaderBoard.active = true;
        PopUp_LeaderBoard.instance.createItem(
          res.topPlayers.length,
          res.topPlayers
        );
        break;
      default:
        console.error("receive Top PLayers ERROR", res.error);
        break;
    }
  }

  initLeaderBoard() {
    this.popUp_LeaderBoard = cc.instantiate(this.leaderboardPU);
    this.popUp_LeaderBoard.setPosition(cc.v2(0, 50));
    this.popUp_LeaderBoard.active = false;
    this.node.addChild(this.popUp_LeaderBoard);
  }
}
