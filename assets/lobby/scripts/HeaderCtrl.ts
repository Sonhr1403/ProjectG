// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import { LobbyCmdId, LobbyConst } from "../LobbyConst";
import AvatarsCtrl from "./AvatarsCtrl";
import { cmdReceive } from "./network/LobbyReceive";
import { LobbySend } from "./network/LobbySend";
import PopUp_FreeChips from "./Popup/Popup_FreeChips";
import Popup_InfoPlayer from "./Popup/Popup_InfoPlayer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HeaderCtrl extends cc.Component {
  public static instance: HeaderCtrl = null;

  //info
  @property(cc.Label)
  lbDisplayName: cc.Label = null;

  @property(cc.Label)
  lbCurGold: cc.Label = null;

  // @property(cc.Label)
  // lbMGT: cc.Label = null;

  // @property(cc.Label)
  // lbNameSetting: cc.Label = null;
  // @property(cc.Label)
  // lbIDSetting: cc.Label = null;

  @property(cc.Sprite)
  spAvatar: cc.Sprite = null;

  // @property(cc.Node)
  // nLang: cc.Node = null;

  // @property(cc.Node)
  // nodeNotify: cc.Node = null;
  // @property(cc.Node)
  // layoutAlert: cc.Node = null;
  // @property(cc.Node)
  // layoutTopCuoc: cc.Node = null;
  // @property(cc.Node)
  // item_alert: cc.Node = null;
  // @property(cc.Node)
  // item_top: cc.Node = null;

  @property(cc.Node)
  lobbyScene: cc.Node = null;

  @property(cc.Prefab)
  prefabPlayerInfo: cc.Prefab = null;

  @property(cc.Prefab)
  prefabNews: cc.Prefab = null;

  @property(cc.Prefab)
  prefabGiftCode: cc.Prefab = null;

  @property(cc.Prefab)
  prefabFreeChips: cc.Prefab = null;

  @property(cc.Prefab)
  prefabEvent: cc.Prefab = null;

  arrBroadcast = [];
  arrBroadcastTopCuoc = [];

  popUp_News: cc.Node = null;

  popUp_PlayerInfo: cc.Node = null;

  popUp_GiftCode: cc.Node = null;

  popUp_FreeChips: cc.Node = null;

  popUp_Event: cc.Node = null;

  private _guiLang: cc.Node = null;

  public avaDownload: cc.SpriteFrame = null;

  protected onLoad(): void {
    HeaderCtrl.instance = this;
    this.initPopUpPlayerInfo();
    this.initPopUpNews();
    this.initPopUpGiftCode();
    this.initPopUpFreeChips();
    this.initPopUpEvent();
    BGUI.NetworkPortal.instance.addCmdListener(
      LobbyCmdId.PLAYER_PROFILE,
      this.receiveUpdatePlayerInfo,
      this
    );
    BGUI.NetworkPortal.instance.addCmdListener(
      LobbyCmdId.FREE_CHIPS,
      this.receiveFreeChips,
      this
    );
  }

  initPopUpPlayerInfo() {
    this.popUp_PlayerInfo = cc.instantiate(this.prefabPlayerInfo);
    this.popUp_PlayerInfo.zIndex = 999;
    this.popUp_PlayerInfo.setPosition(cc.v2(0, 0));
    this.popUp_PlayerInfo.active = false;
    this.lobbyScene.addChild(this.popUp_PlayerInfo);
  }

  onClickedPlayerInfo() {
    this.sendUpdatePlayerInfo();
  }

  sendUpdatePlayerInfo() {
    try {
      let pk = new LobbySend.SendUpdatePlayerInfo();
      BGUI.NetworkPortal.instance.sendPacket(pk);
    } catch (error) {
      console.error("Send Update Player Info Error: ", error);
    }
  }

  receiveUpdatePlayerInfo(cmdId: any, data: Uint8Array) {
    let res = new cmdReceive.ReceivedUpdatePlayerInfo();
    res.unpackData(data);
    console.error("HHHHH PLAYER_PROFILE", res);

    switch (res.error) {
      case 0:
        this.popUp_PlayerInfo.active = true;
        Popup_InfoPlayer.instance.updateInfo(res);
        break;
      default:
        console.error("receiveUpdatePlayerInfo ERROR", res.error);
        break;
    }
  }

  initPopUpNews() {
    this.popUp_News = cc.instantiate(this.prefabNews);
    this.popUp_News.zIndex = 999;
    this.popUp_News.setPosition(cc.v2(0, 0));
    this.popUp_News.active = false;
    this.lobbyScene.addChild(this.popUp_News);
  }

  onClickNews() {
    this.popUp_News.getComponent("Popup_News").unHide();
    this.popUp_News.active = true;
  }

  initPopUpGiftCode() {
    this.popUp_GiftCode = cc.instantiate(this.prefabGiftCode);
    this.popUp_GiftCode.zIndex = 999;
    this.popUp_GiftCode.setPosition(cc.v2(0, 0));
    this.popUp_GiftCode.active = false;
    this.lobbyScene.addChild(this.popUp_GiftCode);
  }

  onClickGiftCode() {
    this.popUp_GiftCode.active = true;
  }

  initPopUpFreeChips() {
    this.popUp_FreeChips = cc.instantiate(this.prefabFreeChips);
    this.popUp_FreeChips.zIndex = 999;
    this.popUp_FreeChips.setPosition(cc.v2(0, 0));
    this.popUp_FreeChips.active = false;
    this.lobbyScene.addChild(this.popUp_FreeChips);
  }

  onClickFreeChips() {
    try {
      let pk = new LobbySend.SendFreeChips();
      BGUI.NetworkPortal.instance.sendPacket(pk);
    } catch (error) {
      console.error("Send Free Chips Error: ", error);
    }
  }

  receiveFreeChips(cmdId: any, data: Uint8Array) {
    let res = new cmdReceive.ReceivedFreeChips();
    res.unpackData(data);
    console.error("HHHHH Free Chips", res);

    let mess = "";
    switch (res.error) {
      case 0:
        this.popUp_FreeChips.active = true;
        let money =
          res.currentMoneyVin - BGUI.UserManager.instance.mainUserInfo.vinTotal;
        PopUp_FreeChips.instance.updateMoneyGet(money);
        BGUI.UserManager.instance.mainUserInfo.vinTotal = res.currentMoneyVin;
        this.lbCurGold.string = BGUI.Utils.formatMoneyWithCommaOnly(
          res.currentMoneyVin
        );
        break;
      case 1:
        mess = LanguageMgr.getString("lobby.warning.error_in_processing");
        break;
      case 2:
        mess = LanguageMgr.getString("lobby.warning.error_in_processing");
        break;
      case 3:
        mess = LanguageMgr.getString("lobby.warning.error_in_processing");
        break;
      case 4:
        mess = LanguageMgr.getString("lobby.warning.error_in_processing");
        break;
      case 5:
        mess = LanguageMgr.getString("alert.error.account_undefined");
        break;
      default:
        console.error("receiveUpdatePlayerInfo ERROR", res.error);
        break;
    }
  }

  initPopUpEvent() {
    this.popUp_Event = cc.instantiate(this.prefabEvent);
    this.popUp_Event.zIndex = 999;
    this.popUp_Event.setPosition(cc.v2(0, 0));
    this.popUp_Event.active = false;
    this.lobbyScene.addChild(this.popUp_Event);
  }

  onClickEvent() {
    this.popUp_Event.active = true;
  }

  updateInfo() {
    let avatar: string = BGUI.UserManager.instance.mainUserInfo.avatar;
    let displayName: string =
      BGUI.UserManager.instance.mainUserInfo.nickname;
    let mgt: number = BGUI.UserManager.instance.mainUserInfo.xuTotal;
    let curGold: number = BGUI.UserManager.instance.mainUserInfo.vinTotal;

    this.lbDisplayName.string = this.displayName(displayName, 15);
    //  
    this.lbCurGold.string = BGUI.Utils.formatMoneyWithCommaOnly(curGold);

    let defaultAva = AvatarsCtrl.instance.defaultAvatars;
    if (avatar !== "0") {
      cc.assetManager.loadRemote(avatar, (err, texture) => {
        if (err) {
          console.error("Failed to load image: ", err);
          this.spAvatar.spriteFrame = defaultAva;
          this.avaDownload = defaultAva;
          return;
        }

        if (texture instanceof cc.Texture2D) {
          this.avaDownload = new cc.SpriteFrame(texture);
          this.spAvatar.spriteFrame = this.avaDownload;
        } else {
          console.error("Loaded asset is not a Texture2D");
          this.spAvatar.spriteFrame = defaultAva;
          this.avaDownload = defaultAva;
        }
      });
    } else {
      this.spAvatar.spriteFrame = defaultAva;
      this.avaDownload = defaultAva;
    }
  }

  onUpdateTotalGold(gold: number) {
    BGUI.UserManager.instance.mainUserInfo.vinTotal = gold;
    BGUI.UINumericLabelHelper.scheduleForLabel(this.lbCurGold, gold);
  }

  onLogoutClicked() {
    if (!cc.Canvas.instance.node.getChildByName("Header_InGame")) {
      let mess = LanguageMgr.getString("lobby.warning.you_sure_out_game");
      var listAction = [
        BGUI.PopupAction.make("OK", () => {
          BGUI.EventDispatch.instance.emit(BGUI.EVENT_GAMECORE.LOGOUT);
        }),
        BGUI.PopupAction.make("CLOSE", () => {}),
      ];

      BGUI.UIPopupManager.instance.showPopup(mess, listAction);

      let bundle = "Lobby";
      let prfLogOut = "prefabs/GUI_LOGOUT";
      BGUI.BundleManager.instance.getPrefabFromBundle(
        prfLogOut,
        bundle,
        (prf: cc.Prefab) => {
          BGUI.UIPopupManager.instance.showPopupFromPrefab(prf);
        }
      );
    } else {
      //back ra ngoài lobby
      BGUI.UIScreenManager.instance.popToRootScreen();
      this.node.removeFromParent();
      this.node.destroy();
    }
  }

  private _updateAvatar() {
    let avatar: string = BGUI.UserManager.instance.mainUserInfo.avatar;
    this.spAvatar.spriteFrame =
      AvatarsCtrl.instance.listSpfAvatars[parseInt(avatar)];
  }

  onEnable(): void {
    if (BGUI.GameCoreManager.instance.isLoginSuccess) {
      this.updateInfo();
    }
    BGUI.EventDispatch.instance.add(
      LobbyConst.EVENT_NAME.EVENT_UPDATE_AVATAR,
      this._updateAvatar,
      this
    );
    BGUI.EventDispatch.instance.add(
      BGUI.EVENT_GAMECORE.UPDATE_TOTAL_GOLD,
      this.onUpdateTotalGold,
      this
    );

    // BGUI.NetworkPortal.instance.addCmdListener(LobbyCmdId.BROADCAST_MESSAGE, this.addDataRunEvent, this)
    // BGUI.NetworkPortal.instance.addCmdListener(LobbyCmdId.BROADCAST_MESSAGE_2, this.addDataTopCuoc, this)
  }

  // runDataEvent() {
  //     this.layoutAlert.stopAllActions()
  //     this.layoutAlert.x = 800;
  //     this.layoutAlert.active = true;
  //     cc.tween(this.layoutAlert)
  //         .to(80, { x: -this.layoutAlert.width - 800 })
  //         .call(() => {
  //             this.layoutAlert.active = false;
  //             this.nodeNotify.active = false;
  //         })
  //         .start();
  // }

  // runDataEventTopCuoc() {
  //     this.layoutTopCuoc.stopAllActions()
  //     this.layoutTopCuoc.x = 800;
  //     this.layoutTopCuoc.active = true;
  //     cc.tween(this.layoutTopCuoc)
  //         .to(70, { x: -this.layoutTopCuoc.width - 800 })
  //         .call(() => {
  //             this.layoutTopCuoc.active = false;
  //         })
  //         .start();
  // }

  // addDataRunEvent(cmdId: any, data: Uint8Array) {
  //     let res = new cmdReceive.CmdReceivedBroadcastMessage()
  //     res.unpackData(data);

  //     let data1 = JSON.parse(res.content);
  //     let content = data1.entries;

  //     this.arrBroadcast = []
  //     if (content.length > 0) {
  //         for (var i = 0; i < content.length; i++) {
  //             var counter = content[i]
  //             this.arrBroadcast.push(counter)
  //         }
  //         this.insertDataToRunEvent()
  //     }
  // }

  // insertDataToRunEvent() {
  //     let sizeAlert = this.layoutAlert.childrenCount;
  //     for (let i = 0; i < this.arrBroadcast.length; i++) {
  //         let item
  //         if (i >= sizeAlert) {
  //             item = cc.instantiate(this.item_alert);
  //             this.layoutAlert.addChild(item)
  //         }
  //         else
  //             item = this.layoutAlert.children.at(i);

  //         item.active = true;

  //         let namegame = this.checkIconGame(this.arrBroadcast[i].g)
  //         let lb_game = item.getChildByName("lb_game").getComponent(cc.Label);
  //         lb_game.string = namegame;

  //         let lb_name = item.getChildByName("lb_name").getComponent(cc.Label);
  //         lb_name.string = this.arrBroadcast[i].n;

  //         let lb_money = item.getChildByName("lb_money").getComponent(cc.Label);
  //         lb_money.string = BGUI.Utils.formatMoneyWithCommaOnly(this.arrBroadcast[i].m);
  //         // lb_money.string = this.arrBroadcast[i].m;
  //     }

  //     for (let i = this.arrBroadcast.length; i < sizeAlert; i++)
  //         this.layoutAlert.children.at(i).active = false

  //     this.runDataEvent()

  // }

  // addDataTopCuoc(cmdId: any, data: Uint8Array) {
  //     this.nodeNotify.active = true;

  //     let res = new cmdReceive.CmdReceivedBroadcastMessageTopCuoc()
  //     res.unpackData(data);

  //     let data1 = JSON.parse(res.content);
  //     let content = data1.entries;

  //     this.arrBroadcastTopCuoc = []
  //     if (content.length > 0) {
  //         for (var i = 0; i < content.length; i++) {
  //             var counter = content[i]
  //             this.arrBroadcastTopCuoc.push(counter)
  //         }
  //         this.insertDataTopCuoc(res.date)
  //     }
  // }

  // insertDataTopCuoc(date) {
  //     let sizeTop = this.layoutTopCuoc.childrenCount;

  //     let title = this.layoutTopCuoc.children.at(0);
  //     let lb_date = title.getChildByName("lb_date").getComponent(cc.Label);
  //     lb_date.string = LanguageMgr.getString("lobby.gui_header.day") + " " + date;

  //     for (let i = 0; i < this.arrBroadcastTopCuoc.length; i++) {
  //         let item
  //         if (i > sizeTop) {
  //             item = cc.instantiate(this.item_top);
  //             this.layoutTopCuoc.addChild(item)
  //         }
  //         else
  //             item = this.layoutTopCuoc.children.at(i + 1);

  //         item.active = true;

  //         // Notify TopCuoc 2:{"entries":[{"g":2,"n":"deococu68","m":664176912},{"g":2,"n":"Baidolam6886","m":572595790},{"g":2,"n":"hongsonjp88","m":482519285},{"g":2,"n":"Bogia2022","m":475338304},{"g":2,"n":"kygiang2806","m":426800853},{"g":2,"n":"co05saigon","m":402505556},{"g":2,"n":"HuanAnh","m":370641400},{"g":2,"n":"namga8888","m":334591535},{"g":2,"n":"HT2000","m":262751729},{"g":2,"n":"th5001ngay","m":259476203}]}

  //         let x = i + 1;
  //         let lb_top = item.getChildByName("lb_top").getComponent(cc.Label);
  //         lb_top.string = "TOP" + x + ":";

  //         let lb_name = item.getChildByName("lb_name").getComponent(cc.Label);
  //         lb_name.string = this.arrBroadcastTopCuoc[i].n;
  //     }

  //     for (let i = this.arrBroadcastTopCuoc.length + 1; i < sizeTop; i++)
  //         this.layoutTopCuoc.children.at(i).active = false

  //     this.runDataEventTopCuoc()
  // }

  checkIconGame(value) {
    var str = "";
    if (value == 1) {
      str = '"MiniPoker"';
    } else if (value == 2) {
      str = '"TaiXiu"';
    } else if (value == 3) {
      str = '"BauCua"';
    } else if (value == 4) {
      str = '"CaoThap"';
    } else if (value == 5) {
      str = '"PokeGo"';
    } else if (value == 8) {
      str = '"Sam"';
    } else if (value == 9) {
      str = '"BaCay"';
    } else if (value == 10) {
      str = '"MauBinh"';
    } else if (value == 11) {
      str = '"TLMN"';
    } else if (value == 12) {
      str = '"TaLa"';
    } else if (value == 13) {
      str = '"Lieng"';
    } else if (value == 14) {
      str = '"XiTo"';
    } else if (value == 15) {
      str = '"XocXoc"';
    } else if (value == 16) {
      str = '"BaiCao"';
    } else if (value == 17) {
      str = '"Poker"';
    } else if (value == 18) {
      str = '"SieuAnhHung"';
    } else if (value == 19) {
      str = '"MyNhanNgu"';
    } else if (value == 20) {
      str = '"KhoBau"';
    } else if (value == 21) {
      str = '"NuDiepVien"';
    } else if (value == 22) {
      str = '"ThoDan"';
    }
    // cc.log("ten game : " + str)
    return str;
  }

  onShowLangClicked() {
    let bundle = "Lobby";
    let prfAttendance = "prefabs/language/GUI_LANGUAGE";
    BGUI.BundleManager.instance.getPrefabFromBundle(
      prfAttendance,
      bundle,
      (prf: cc.Prefab) => {
        BGUI.UIPopupManager.instance.showPopupFromPrefab(prf);
      }
    );
    // return;
    // this.nLang.active = !this.nLang.active;
    // if (cc.Canvas.instance.node.getChildByName("NodeLang") == null) {
    //     let frameSize = this.node.parent.getContentSize();
    //     let rX = frameSize.width / this.node.width;
    //     let rY = frameSize.height / this.node.height;
    //     let nodeLang = cc.instantiate(this.nLang);
    //     this._guiLang = nodeLang;
    //     nodeLang.name = "NodeLang";
    //     nodeLang.scale = Math.min(rX, rY);
    //     nodeLang.setPosition(750, 350);
    //     nodeLang.active = true;
    //     cc.Canvas.instance.node.addChild(nodeLang, BGUI.eZIndex.NAVIGATOR);
    //     this._updateImgChoseLange();

    // } else {
    //     cc.Canvas.instance.node.getChildByName("NodeLang").active = !cc.Canvas.instance.node.getChildByName("NodeLang").active;
    //     this._updateImgChoseLange();
    // }
  }

  // private _updateImgChoseLange() {
  //     let lang = LanguageMgr.instance.getCurrentLanguage();
  //     let nLang = cc.Canvas.instance.node.getChildByName("NodeLang");
  //     let layout = nLang.getChildByName("layout");
  //     layout.children.find((e: cc.Node) => {
  //         if (e && e.name == lang) {
  //             BGUI.ZLog.log('_updateImgChoseLange', e.position);
  //             layout.getChildByName("img-lang-chose").setPosition(e.position);
  //         }
  //     });
  // }

  // onChangeLangByName(sender: cc.Button, data) {
  //     this.processChangeLanguage(data);
  //     this.onHideGUILang();
  // }

  // processChangeLanguage(data) {
  //     let self = this;
  //     let lang = LANGUAGE.ENGLISH;
  //     let languageName = "";
  //     switch (data) {
  //         case 'en':
  //             lang = LANGUAGE.ENGLISH;
  //             languageName = "English";
  //             break;
  //         case 'mm':
  //             lang = LANGUAGE.MYANMAR;
  //             languageName = "ျမန္မာ။";
  //             break;
  //         case 'vn':
  //             lang = LANGUAGE.VIETNAMESE;
  //             languageName = "Tiếng Việt";
  //             break;
  //         case 'tl':
  //             lang = LANGUAGE.THAILAN;
  //             languageName = "ไทย";
  //             break;
  //         case 'cam':
  //             lang = LANGUAGE.CAMBODIA;
  //             languageName = "ភាសាខ្មែរ";
  //             break;

  //     }

  //     if (LanguageMgr.instance.getCurrentLanguage() == lang) return;
  //     var title = LanguageMgr.getString("alert.title_notification");
  //     var content = LanguageMgr.getString("lobby.gui_header.confirm_change_language", { language: languageName });

  //     var listAction = [
  //         BGUI.PopupAction.make(LanguageMgr.getString("alert.ok"), () => {
  //             this.updateLang(data);
  //             cc.Canvas.instance.node.emit(BGUI.EVENT_GAMECORE.EVENT_UPDATE_LANGUAGE_LABEL, this);
  //             cc.Canvas.instance.node.emit(BGUI.EVENT_GAMECORE.EVENT_UPDATE_LANGUAGE_SPRITE, this);
  //             cc.Canvas.instance.node.emit(BGUI.EVENT_GAMECORE.EVENT_UPDATE_LANGUAGE_SPINE, this);
  //         }),
  //         BGUI.PopupAction.make(LanguageMgr.getString("alert.no"), null)
  //     ];

  //     BGUI.UIPopupManager.instance.showPopupSmall(content, listAction, title);
  // }

  // updateLang(lang) {
  //     BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, lang);
  //     LanguageMgr.instance.setCurrentLanguage(lang);
  //     LanguageMgr.updateLocalization(lang);
  //     // this._updateImgTick(lang);
  // }

  onHideGUILang() {
    if (this._guiLang) this._guiLang.active = false;
  }

  displayName(name, maxLength) {
    if (name === undefined) return "";
    if (maxLength === undefined) maxLength = 10;

    name = name.trim();

    if (name.length > maxLength) {
      var newName = name.substr(0, maxLength);
      newName += "...";
    } else {
      newName = name;
    }

    return newName;
  }

  protected onDestroy(): void {
    BGUI.NetworkPortal.instance.removeCmdListener(
      this,
      LobbyCmdId.PLAYER_PROFILE
    );
    BGUI.NetworkPortal.instance.removeCmdListener(this, LobbyCmdId.FREE_CHIPS);
  }

  onDisable(): void {
    BGUI.EventDispatch.instance.remove(
      LobbyConst.EVENT_NAME.EVENT_UPDATE_AVATAR,
      this._updateAvatar,
      this
    );
    BGUI.EventDispatch.instance.remove(
      BGUI.EVENT_GAMECORE.UPDATE_TOTAL_GOLD,
      this.onUpdateTotalGold,
      this
    );

    BGUI.NetworkPortal.instance.removeCmdListener(
      this,
      LobbyCmdId.BROADCAST_MESSAGE
    );
    BGUI.NetworkPortal.instance.removeCmdListener(
      this,
      LobbyCmdId.BROADCAST_MESSAGE_2
    );
  }
}
