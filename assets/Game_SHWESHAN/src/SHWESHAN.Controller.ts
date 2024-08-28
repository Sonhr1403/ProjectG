import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import SHWESHANConnector from "../../lobby/scripts/network/wss/SHWESHANConnector";
import BaseCard, { TYPE_CARD } from "./SHWESHAN.BaseCard";
import CardGroup from "./SHWESHAN.CardGroup";
import { CardLogic } from "./SHWESHAN.CardLogic";
import SHWESHANCmd from "./SHWESHAN.Cmd";
import SHWESHANConstant from "./SHWESHAN.Constant";
import SHWESHANItemRoom from "./SHWESHAN.ItemRoom";
import SHWESHANPlayer from "./SHWESHAN.Player";
import ArrangeCard from "./SHWESHAN.ArrangeCard";
import EmosUtils from "./SHWESHAN.EmosUtil";
import Chip from "./SHWESHAN.Chip";
import SoundController, { SOUNDTYPE } from "./SHWESHAN.SoundController";
import LobbyCtrl from "../../lobby/scripts/LobbyCtrl";
import SWSPopupConfirmLeave from "./SHWESHAN.PopupConfirmLeave";
import { cmdReceive } from "../../lobby/scripts/network/LobbyReceive";
import { CmdSendGetBalance } from "../../lobby/scripts/network/LobbySend";

import SHWESHANChat from "./SHWESHAN.Chat";

const { ccclass, property } = cc._decorator;
@ccclass
export default class SHWESHANController extends cc.Component {
  public static instance: SHWESHANController = null;
  // UI Rooms
  @property(cc.Node)
  UI_ChooseRoom: cc.Node = null;
  @property(cc.Label)
  public lbRoomBalance: cc.Label = null;
  @property(cc.Node)
  nInvite: cc.Node = null;
  @property(SoundController)
  soundControler: SoundController = null;
  @property(cc.Node)
  contentListRooms: cc.Node = null;
  @property(cc.Prefab)
  prefabItemRoom: cc.Prefab = null;
  @property(cc.Node)
  playerContainer: cc.Node = null;
  @property(cc.Prefab)
  prefabPlayer: cc.Prefab = null;
  @property(cc.ScrollView)
  scrollListRoom: cc.ScrollView = null;

  public isInitedUIRoom = false;

  // UI Playing
  @property(cc.Node)
  UI_Playing: cc.Node = null;
  @property(cc.SpriteFrame)
  spriteCards: cc.SpriteFrame[] = [];
  @property(cc.SpriteFrame)
  spriteCardBack: cc.SpriteFrame = null;

  @property(sp.Skeleton)
  public skeletonBanker: sp.Skeleton = null;
  @property(cc.Button)
  btnLeaveRoom: cc.Button = null;
  @property(cc.Button)
  btnCancelLeaveRoom: cc.Button = null;

  // UI Chat
  @property(cc.Node)
  UI_Chat: cc.Node = null;
  @property(cc.Node)
  UI_Menu: cc.Node = null;

  // Popup
  @property(cc.Node)
  popupNodity: cc.Node = null;
  @property(cc.Label)
  labelNotifyContent: cc.Label = null;

  @property(cc.Label)
  lbTotalMoney: cc.Label = null;
  @property(cc.Label)
  lbTableName: cc.Label = null;
  @property(cc.Label)
  lbRoomId: cc.Label = null;
  @property(cc.Label)
  lbRoomBet: cc.Label = null;

  @property(cc.Label)
  lbTimeCountDown: cc.Label = null;
  @property(sp.Skeleton)
  spineCoundown: sp.Skeleton = null;
  @property(cc.Node)
  board: cc.Node = null;

  @property(cc.Label)
  lblToast: cc.Label = null;
  @property(cc.Prefab)
  prfCard: cc.Prefab = null;
  @property(cc.Prefab)
  prfPopupConfirmLeave: cc.Prefab = null;

  @property(cc.Node)
  nPopupGuide: cc.Node = null;

  @property(cc.Node)
  nPopupSoundSetting: cc.Node = null;

  @property(cc.Node)
  nArrangeCard: cc.Node = null;

  @property(cc.Button)
  public btnOnOffMucsic: cc.Button = null;
  @property(cc.SpriteFrame)
  public spriteBtnMusic: cc.SpriteFrame[] = [];

  @property(cc.Node)
  nChiaBai: cc.Node = null;

  @property(cc.Integer)
  maxPlayer: number = 2;

  @property(cc.Node)
  nodeTableCoin: cc.Node = null;
  @property(cc.SpriteFrame)
  sprCoin: cc.SpriteFrame = null;
  @property(cc.Prefab)
  prfChip: cc.Prefab = null;
  @property(cc.Node)
  effectNode: cc.Node = null;

  @property(cc.Node)
  tipBtn: cc.Node = null;
  @property(cc.Node)
  heart: cc.Node = null;

  @property(cc.Node)
  rearrangeBtn: cc.Node = null;
  @property(cc.SpriteFrame)
  public popUpChats: cc.SpriteFrame[] = [];
  @property(cc.SpriteFrame)
  public btnState: cc.SpriteFrame[] = [];
  @property(cc.Node)
  musicVolume: cc.Node = null;
  @property(cc.Node)
  sfxVolume: cc.Node = null;
  @property(cc.SpriteFrame)
  public betLv: cc.SpriteFrame[] = [];
  @property(cc.Sprite)
  public betLabel: cc.Sprite = null;

  //test
  public playerNotInteractCount: number = 0;
  isPlayerInteract: boolean = false;

  players: SHWESHANPlayer[] = [];
  buttons = {};
  myChair = 0;
  cardZorder = 0;
  sortBySuit = true;
  currTurnCards = [];
  isMyTurn = false;
  isNewRound = false;
  private dataRooms = [];
  private dataResultEndGame = [];

  private arrSort: boolean[] = [false, false, false];

  private cardsOnHand = {};
  _vectorCombinationOfCards: BaseCard[][] = [];
  _vectorRecommendedCards: BaseCard[][] = [];
  _recommendedCards = [];
  lastTurnCards: BaseCard[] = [];
  listChoosenCard: BaseCard[] = [];
  timeCountDown = 0;
  arrange_time = 0;
  _roomBet = 0;
  _playerBet = [];
  _chuongChair = -1;
  _arrChiaBai = [4, 5, 6, 0, 1, 2, 3];
  _dataEndGame: SHWESHANCmd.ReceivedEndGame = null;
  private _stateGame = 0;
  //1 prepare start game
  //2 chia 4 lá
  //4 mời cược
  //5 chia lá 5
  //6 mở bài
  //7 endgame

  // LIFE-CYCLE CALLBACKS:
  _oldPotPos = [];
  isMeStatus = 0;
  timexepbai = 0;
  openLeaveNoti = false;
  private readonly posArrow = [cc.v2(-515, -40), cc.v2(500, -40)];

  // @property([cc.SpriteFrame])
  // scores: cc.SpriteFrame[] = [];
  _roomInviteId = null;

  _intervalRoom = null;
  timeoutChat = null;
  chatHistory = [];
  chatHistoryName = [];
  refresherListRoom = null;
  start() {
    let self = this;
    this.UI_Playing.active = false;
    this.showUIRooms();
    this.scheduleOnce(this.sendRefreshListRoomType, 2);
    // this.scheduleOnce(() => {
    //     self._intervalRoom = window.setInterval(this.refeshListRoom.bind(this), 1000)
    // }, 2)
  }
  private _scheduler: number = null;

  onLoad() {
    SHWESHANConnector.instance.addCmdListener(
      BGUI.CmdDefine.DISCONNECTED,
      this.backToLobby,
      this
    );
    SHWESHANConnector.instance.addCmdListener(
      SHWESHANCmd.Code.LOGIN,
      this.LOGIN,
      this
    );
    SHWESHANConnector.instance.addCmdListener(
      SHWESHANCmd.Code.CHAT_ROOM,
      this.CHAT_ROOM,
      this
    );

    SHWESHANConnector.instance.addCmdListener(
      SHWESHANCmd.Code.GET_LIST_ROOM_TYPE,
      this.responseGetListRoomType,
      this
    );
    SHWESHANConnector.instance.addCmdListener(
      SHWESHANCmd.Code.JOIN_ROOM_FAIL,
      this.JOIN_ROOM_FAIL,
      this
    );
    SHWESHANConnector.instance.addCmdListener(
      SHWESHANCmd.Code.AUTO_RECONNECT_GAME_ROOM_FAIL,
      this.responseAutoReconnectGameRoomFail,
      this
    );
    SHWESHANConnector.instance.addCmdListener(
      SHWESHANCmd.Code.JOIN_ROOM_SUCCESS,
      this.JOIN_ROOM_SUCCESS,
      this
    );
    SHWESHANConnector.instance.addCmdListener(
      SHWESHANCmd.Code.MONEY_BET_CONFIG,
      this.MONEY_BET_CONFIG,
      this
    );
    SHWESHANConnector.instance.addCmdListener(
      SHWESHANCmd.Code.UPDATE_GAME_INFO,
      this.UPDATE_GAME_INFO,
      this
    );
    SHWESHANConnector.instance.addCmdListener(
      SHWESHANCmd.Code.AUTO_START,
      this.AUTO_START,
      this
    );
    SHWESHANConnector.instance.addCmdListener(
      SHWESHANCmd.Code.USER_JOIN_ROOM,
      this.USER_JOIN_ROOM,
      this
    );
    SHWESHANConnector.instance.addCmdListener(
      SHWESHANCmd.Code.TIP,
      this.responseTip,
      this
    );
    SHWESHANConnector.instance.addCmdListener(
      SHWESHANCmd.Code.CHIA_BAI,
      this.CHIA_BAI,
      this
    );
    SHWESHANConnector.instance.addCmdListener(
      SHWESHANCmd.Code.MOI_XEP_BAI,
      this.MOI_XEP_BAI,
      this
    );
    SHWESHANConnector.instance.addCmdListener(
      SHWESHANCmd.Code.XEP_BAI_LAI,
      this.XEP_BAI_LAI,
      this
    );

    SHWESHANConnector.instance.addCmdListener(
      SHWESHANCmd.Code.XEP_BAI,
      this.XEP_BAI,
      this
    );
    SHWESHANConnector.instance.addCmdListener(
      SHWESHANCmd.Code.XEP_BAI_XONG,
      this.XEP_BAI_XONG,
      this
    );
    SHWESHANConnector.instance.addCmdListener(
      SHWESHANCmd.Code.MO_BAI,
      this.MO_BAI,
      this
    );
    SHWESHANConnector.instance.addCmdListener(
      SHWESHANCmd.Code.BO_LUOT,
      this.BO_LUOT,
      this
    );
    SHWESHANConnector.instance.addCmdListener(
      SHWESHANCmd.Code.END_GAME,
      this.END_GAME,
      this
    );
    SHWESHANConnector.instance.addCmdListener(
      SHWESHANCmd.Code.UPDATE_MATCH,
      this.UPDATE_MATCH,
      this
    );
    SHWESHANConnector.instance.addCmdListener(
      SHWESHANCmd.Code.USER_LEAVE_ROOM,
      this.USER_LEAVE_ROOM,
      this
    );
    SHWESHANConnector.instance.addCmdListener(
      SHWESHANCmd.Code.REQUEST_LEAVE_ROOM,
      this.REQUEST_LEAVE_ROOM,
      this
    );

    SHWESHANConnector.instance.addCmdListener(50, this.onPingPong, this);
    SHWESHANController.instance = this;
    this.initSound();
    this.generatePlayer();
    this.updatePlayer();
    this._scheduler = window.setInterval(
      this.updateOffline.bind(this),
      1000 / 60
    );
    this.lbRoomBalance.string = BGUI.StringUtils.formatNumber(
      BGUI.UserManager.instance.mainUserInfo.vinTotal
    );
    this.isPlayerInteract = false;
    this.btnCancelLeaveRoom.node.active = false;
    this.playerNotInteractCount = 0;
    // this.refresherListRoom = setInterval(this.sendRefreshListRoomType, 5000);
    if (BGUI.UserManager.instance.mainUserInfo.game != "") {
      this.scheduleOnce(this.sendAutoReconnect, 0.5);
      BGUI.UserManager.instance.mainUserInfo.game = "";
    }
  }

  generatePlayer() {
    let mapPos = {
      0: cc.v3(543.261, -356, 0),
      1: cc.v3(-400.809, -356, 0),
      2: cc.v3(741.781, -50, 0),
      3: cc.v3(-729.596, -50, 0),
      4: cc.v3(499, 247.826, 0),
      5: cc.v3(-465, 255.672, 0),

      // 0: cc.v3(525, -323, 0),
      // 1: cc.v3(-370, -323, 0),
      // 2: cc.v3(730, -30, 0),
      // 3: cc.v3(-745, -30, 0),
      // 4: cc.v3(499, 280, 0),
      // 5: cc.v3(-465, 280, 0),
    };

    for (let index = 0; index < 6; index++) {
      let item = cc.instantiate(this.prefabPlayer);
      item.getComponent(SHWESHANPlayer).isMe = index === 0;
      item.getComponent(SHWESHANPlayer).pos = index;
      item.active = index === 0;
      // this.scheduleOnce(this.sendRefeshListRoom, 2)
      this.scheduleOnce(this.sendAutoReconnect, 1);

      item.position = mapPos[index];
      this.players[index] = item.getComponent(SHWESHANPlayer);
      this.playerContainer.addChild(item);
    }
  }

  updatePlayer() {
    let cardMapPos = {
      0: cc.v3(-200, -3, 0),
      1: cc.v3(185, -24, 0),
      2: cc.v3(-185, -24, 0),
      3: cc.v3(185, -24, 0),
      4: cc.v3(-185, -24, 0),
      5: cc.v3(185, -24, 0),

      // 0: cc.v3(-190, -27, 0),
      // 1: cc.v3(180, -30, 0),
      // 2: cc.v3(-180, -30, 0),
      // 3: cc.v3(180, -30, 0),
      // 4: cc.v3(-180, -30, 0),
      // 5: cc.v3(180, -30, 0),
    };

    let statusPos = {
      0: cc.v3(200, -90, 0),
      1: cc.v3(160, -80, 0),
      2: cc.v3(-160, -80, 0),
      3: cc.v3(160, -80, 0),
      4: cc.v3(-160, -80, 0),
      5: cc.v3(160, -80, 0),
    };

    let chatPos = {
      0: cc.v3(-80.75, 21.75, 0),
      1: cc.v3(286.068, 21.75, 0),
      2: cc.v3(-80.75, 21.75, 0),
      3: cc.v3(286.068, 21.75, 0),
      4: cc.v3(-80.75, 21.75, 0),
      5: cc.v3(286.068, 21.75, 0),
    };

    let chatTextPos = {
      0: cc.v3(-23.672, 0, 0),
      1: cc.v3(-5.672, 0, 0),
      2: cc.v3(-23.672, 0, 0),
      3: cc.v3(-5.672, 0, 0),
      4: cc.v3(-23.672, 0, 0),
      5: cc.v3(-5.672, 0, 0),
    };
    for (let index = 0; index < 6; index++) {
      this.playerContainer.children[index].getChildByName(
        "CardOnHand"
      ).position = cardMapPos[index];
      this.playerContainer.children[index].getChildByName("CardShow").position =
        cardMapPos[index];
      this.playerContainer.children[index].getChildByName(
        "cardScore"
      ).position = cardMapPos[index];
      this.playerContainer.children[index].getChildByName(
        "sws_bgstatus"
      ).position = statusPos[index];
      this.playerContainer.children[index].getChildByName(
        "Chat"
      ).children[1].position = chatPos[index];
      this.playerContainer.children[index]
        .getChildByName("Chat")
        .children[1].children[0].getComponent(cc.Sprite).spriteFrame =
        this.popUpChats[index];
      this.playerContainer.children[index].getChildByName(
        "Chat"
      ).children[1].children[0].children[0].position = chatTextPos[index];
    }
  }

  onPingPong() {
    cc.log("onPingPong");
  }

  onDestroy() {
    SHWESHANConnector.instance.removeCmdListener(
      this,
      BGUI.CmdDefine.DISCONNECTED
    );
    SHWESHANConnector.instance.removeCmdListener(
      this,
      BGUI.CmdDefine.DISCONNECTED
    );
    SHWESHANConnector.instance.removeCmdListener(this, SHWESHANCmd.Code.LOGIN);
    SHWESHANConnector.instance.removeCmdListener(
      this,
      SHWESHANCmd.Code.CHAT_ROOM
    );
    SHWESHANConnector.instance.removeCmdListener(
      this,
      SHWESHANCmd.Code.GET_LIST_ROOM_TYPE
    );
    SHWESHANConnector.instance.removeCmdListener(
      this,
      SHWESHANCmd.Code.JOIN_ROOM_FAIL
    );
    SHWESHANConnector.instance.removeCmdListener(
      SHWESHANCmd.Code.AUTO_RECONNECT_GAME_ROOM_FAIL
    );

    SHWESHANConnector.instance.removeCmdListener(
      this,
      SHWESHANCmd.Code.JOIN_ROOM_SUCCESS
    );
    SHWESHANConnector.instance.removeCmdListener(
      this,
      SHWESHANCmd.Code.MOI_CHOI
    );
    SHWESHANConnector.instance.removeCmdListener(
      this,
      SHWESHANCmd.Code.MONEY_BET_CONFIG
    );
    SHWESHANConnector.instance.removeCmdListener(
      this,
      SHWESHANCmd.Code.UPDATE_GAME_INFO
    );
    SHWESHANConnector.instance.removeCmdListener(
      this,
      SHWESHANCmd.Code.AUTO_START
    );
    SHWESHANConnector.instance.removeCmdListener(
      this,
      SHWESHANCmd.Code.USER_JOIN_ROOM
    );
    SHWESHANConnector.instance.removeCmdListener(
      this,
      SHWESHANCmd.Code.CHIA_BAI
    );
    SHWESHANConnector.instance.removeCmdListener(
      this,
      SHWESHANCmd.Code.MOI_XEP_BAI
    );
    SHWESHANConnector.instance.removeCmdListener(
      this,
      SHWESHANCmd.Code.XEP_BAI
    );
    SHWESHANConnector.instance.removeCmdListener(
      this,
      SHWESHANCmd.Code.XEP_BAI_XONG
    );
    SHWESHANConnector.instance.removeCmdListener(this, SHWESHANCmd.Code.MO_BAI);
    SHWESHANConnector.instance.removeCmdListener(
      this,
      SHWESHANCmd.Code.BO_LUOT
    );
    SHWESHANConnector.instance.removeCmdListener(
      this,
      SHWESHANCmd.Code.END_GAME
    );
    SHWESHANConnector.instance.removeCmdListener(
      this,
      SHWESHANCmd.Code.UPDATE_MATCH
    );
    SHWESHANConnector.instance.removeCmdListener(
      this,
      SHWESHANCmd.Code.USER_LEAVE_ROOM
    );
    SHWESHANConnector.instance.removeCmdListener(
      this,
      SHWESHANCmd.Code.REQUEST_LEAVE_ROOM
    );
    SHWESHANConnector.instance.removeCmdListener(
      this,
      SHWESHANCmd.Code.XEP_BAI_LAI
    );
  }

  // Request UI Room
  joinRoom(infoRoom) {
    let pk = new SHWESHANCmd.SendJoinRoomType();
    pk.id = infoRoom.id;
    this.playerNotInteractCount = 0;
    this.isPlayerInteract = false;
    pk.moneyBet = infoRoom.moneyBet;
    pk.minMoney = infoRoom.minMoney;
    pk.maxMoney = infoRoom.maxMoney;
    pk.maxUserPerRoom = infoRoom.maxUserPerRoom;
    SHWESHANConnector.instance.sendPacket(pk);
  }

  batDau(info) {
    let pk = new SHWESHANCmd.SendStartGame();
    SHWESHANConnector.instance.sendPacket(pk);
  }

  btnSort(event, data) {
    let idx = parseInt(data);
    event.currentTarget.angle += -180;
    let sortID = this.arrSort[idx] ? 1 : -1;
    this.arrSort[idx] = !this.arrSort[idx];

    if (idx == 1) {
      if (sortID == 1)
        this.dataRooms.sort((a, b) => {
          return a.requiredMoney - b.requiredMoney;
        });
      else
        this.dataRooms.sort((a, b) => {
          return b.requiredMoney - a.requiredMoney;
        });
    } else if (idx == 2) {
      if (sortID == 1)
        this.dataRooms.sort((a, b) => {
          return a.moneyBet - b.moneyBet;
        });
      else
        this.dataRooms.sort((a, b) => {
          return b.moneyBet - a.moneyBet;
        });
    } else {
      if (sortID == 1)
        this.dataRooms.sort((a, b) => {
          return a.userCount - b.userCount;
        });
      else
        this.dataRooms.sort((a, b) => {
          return b.userCount - a.userCount;
        });
    }
    this.reloadListRoom();
  }

  refeshListRoom() {
    // if(this.UI_ChooseRoom.active){
    let pk = new SHWESHANCmd.SendGetListRoomType();
    pk.player = this.maxPlayer;
    SHWESHANConnector.instance.sendPacket(pk);
    // }
  }

  showUIRooms() {
    this.UI_ChooseRoom.active = true;
    this.sendRefreshListRoomType();
  }

  closeUIRoom() {
    this.UI_ChooseRoom.active = false;
    this.sendRefreshListRoomType();
  }
  private sendAutoReconnect(): void {
    SHWESHANConnector.instance.sendPacket(new SHWESHANCmd.SendAutoReconnect());
  }
  private sendRefreshListRoomType(): void {
    SHWESHANConnector.instance.sendPacket(
      new SHWESHANCmd.SendGetListRoomType()
    );
  }

  private sendEndGameNotify(): void {
    SHWESHANConnector.instance.sendPacket(new SHWESHANCmd.SendEndGameNotify());
  }

  playingNow() {
    let minMoneyReq = 8000000;
    let maxMoneyReq = 0;
    let joinRoomIndex = -1;
    for (let index = 0; index < this.contentListRooms.childrenCount; index++) {
      let roomItem =
        this.contentListRooms.children[index].getComponent(SHWESHANItemRoom);
      minMoneyReq = Math.min(minMoneyReq, roomItem.roomInfo["requiredMoney"]);
      maxMoneyReq = Math.max(maxMoneyReq, roomItem.roomInfo["maxJoin"][0]);
      if (maxMoneyReq < BGUI.UserManager.instance.mainUserInfo.vinTotal) {
        joinRoomIndex = index;
      }
    }

    if (BGUI.UserManager.instance.mainUserInfo.vinTotal < minMoneyReq) {
      BGUI.UIPopupManager.instance.showPopup(
        LanguageMgr.getString("shweshan.not_enough_gold_please_deposit")
      );
    } else {
      if (joinRoomIndex >= 0) {
        let roomItem =
          this.contentListRooms.children[joinRoomIndex].getComponent(
            SHWESHANItemRoom
          );
        this.joinRoom(roomItem.roomInfo);
      } else {  
        BGUI.UIPopupManager.instance.showPopup(
          LanguageMgr.getString("shweshan.no_valid_table_found")
        );
      }
    }
  }

  showUIGuide() {
    this.nPopupGuide.active = true;
    this.closeUIMenu();
  }
  showUISound() {
    this.nPopupSoundSetting.active = true;
    this.closeUIMenu();
  }
  closeUISound() {
    this.nPopupSoundSetting.active = false;
  }
  showUIInvite() {
    this.nInvite.active = true;
    this.actionMoiChoi();
  }

  closeUIGuide() {
    this.nPopupGuide.active = false;
  }
  //Menu
  showUIMenu() {
    this.UI_Menu.active = !this.UI_Menu.active;
    if (this.isPlayerInteract == false) {
      this.isPlayerInteract = true;
    }
  }
  closeUIMenu() {
    this.UI_Menu.active = false;
  }
  // Chat
  showUIChat(CustomEvent: CustomEvent, idx: number) {
    cc.error("showuichat", idx, CustomEvent);
    if (idx == 1) {
      //Emo
      // cc.error("showuichat12", idx, this.UI_Chat.children);
      this.UI_Chat.getChildByName("ScrollviewEmotion").active = true;
      this.UI_Chat.getChildByName("ScrollviewQuickChat").active = false;
      // SHWESHANChat.instance.showEmotionChat()
    } else if (idx == 2) {
      //quick chat
      // cc.error("showuichat23", idx, this.UI_Chat.children);

      this.UI_Chat.getChildByName("ScrollviewEmotion").active = false;
      this.UI_Chat.getChildByName("ScrollviewQuickChat").active = true;
      // SHWESHANChat.instance.showQuickChat()
    }
    this.UI_Chat.active = true;

    if (this.isPlayerInteract == false) {
      this.isPlayerInteract = true;
    }
  }

  closeUIChat() {
    this.UI_Chat.active = false;
  }

  private _isGameActive: boolean = true;

  hideTime: number = null;

  updateOffline() {
    if (!this._isGameActive) {
      if (cc.sys.isBrowser) {
        cc.director.mainLoop();
      }
    }
  }

  onEnable() {
    this.UI_Playing.on(cc.Node.EventType.TOUCH_START, this.closeUIChat, this);
    this.UI_Playing.on(cc.Node.EventType.TOUCH_START, this.closeUIMenu, this);
    cc.game.on(cc.game.EVENT_SHOW, this._onShowGame, this);
    cc.game.on(cc.game.EVENT_HIDE, this._onHideGame, this);
    this.refresherListRoom = setInterval(this.sendRefreshListRoomType, 5000);
  }

  onDisable() {
    this.UI_Playing.off(cc.Node.EventType.TOUCH_START, this.closeUIChat, this);
    this.UI_Playing.off(cc.Node.EventType.TOUCH_START, this.closeUIMenu, this);

    cc.game.off(cc.game.EVENT_SHOW, this._onShowGame, this);
    cc.game.off(cc.game.EVENT_HIDE, this._onHideGame, this);
  }

  _onShowGame() {
    this._isGameActive = true;
    if (cc.sys.isNative && cc.sys.isMobile && this.hideTime) {
      let curTime = performance.now();
      let delta = (curTime - this.hideTime) / 1000;
      let itr = 0;
      while (itr < delta) {
        let dt = Math.min(0.1, delta - itr);
        cc.director.getScheduler().update(dt);
        itr += dt;
      }
      this.hideTime = null;
    }
  }

  _onHideGame() {
    this._isGameActive = false;
    if (cc.sys.isNative && cc.sys.isMobile) {
      this.hideTime = performance.now();
    }
  }

  chatEmotion(event, id) {
    let pk = new SHWESHANCmd.SendChatRoom();
    pk.a = 1;
    pk.b = id;
    SHWESHANConnector.instance.sendPacket(pk);
    this.closeUIChat();
  }
  //test
  responseVinTotal(cmdId: any, data: Uint8Array) {
    let res = new cmd.ResVinTotalOfUser();
    res.unpackData(data);
    let totalMoney = res.vinTotal;
    BGUI.UserManager.instance.mainUserInfo.vinTotal = totalMoney;
    BGUI.EventDispatch.instance.emit(
      BGUI.EVENT_GAMECORE.UPDATE_TOTAL_GOLD,
      totalMoney
    );
    BGUI.GameCoreManager.instance.onBackToLobby();
  }

  private requestVintotal(): void {
    let req = new CmdSendGetBalance();
    BGUI.NetworkPortal.instance.sendPacket(req);
  }
  backToLobby() {
    this.requestVintotal();
    BGUI.GameCoreManager.instance.onBackToLobby();
    clearInterval(this.refresherListRoom);
  }
  //test

  private _localVolume = 0;
  public onClickOnOffMusic(event, data) {
    this._localVolume = this._localVolume == 1 ? 0 : 1;
    this.musicVolume.children[1].getComponent(cc.Sprite).spriteFrame =
      this.btnState[this._localVolume];
    SHWESHANController.instance.soundControler.setOnVolume(this._localVolume);
  }
  private _sfxVolume = 1;
  public onClickOnOffSfx() {
    this._sfxVolume = this._sfxVolume == 1 ? 0 : 1;
    this.sfxVolume.children[1].getComponent(cc.Sprite).spriteFrame =
      this.btnState[this._sfxVolume];
    SHWESHANController.instance.soundControler.toggleSfx();
  }

  // Playing
  showUIPlaying() {
    this.unschedule(this.countDown);
    this.UI_Playing.active = true;
  }

  closeUIPlaying() {
    BGUI.UIPopupManager.instance.showPopupFromPrefab(
      this.prfPopupConfirmLeave,
      (pop: SWSPopupConfirmLeave) => {}
    );
    this.openLeaveNoti = true;
    this.sendRefreshListRoomType();
    this.closeUIMenu();
  }

  actionMoiChoi() {
    let pk = new SHWESHANCmd.SendRequestInfoMoiChoi();
    SHWESHANConnector.instance.sendPacket(pk);
  }

  JOIN_ROOM_SUCCESS(cmdId: any, data: Uint8Array) {
    // console.error(data, "jrs");
    this.chatHistory = [];
    this.chatHistoryName = [];

    this.btnCancelLeaveRoom.node.active = false;
    this.btnLeaveRoom.node.active = true;
    let res = new SHWESHANCmd.ReceivedJoinRoomSuccess();
    res.unpackData(data);

    LobbyCtrl.instance.stopBgMusic();
    this._localVolume = 1;
    this.btnOnOffMucsic.node.children[0].getComponent(cc.Sprite).spriteFrame =
      this.spriteBtnMusic[this._localVolume];
    SHWESHANController.instance.soundControler.setOnVolume(this._localVolume);

    this.show(true, res);
    if (res.gameServerState == 0) {
    } else if (res.gameServerState == 1) {
      this.processStateChiaBai(res);
    } else if (res.gameServerState == 2) {
      this.processStateChiaBai(res);
      let chair = this.convertChair(this.myChair);
      let pl = this.players[chair];
      this.nArrangeCard
        .getComponent(ArrangeCard)
        .setTimeRemain(res.countDownTime);
      if (pl.status >= 2) {
        // cc.log("JOIN_ROOM_SUCCESS", data);
        pl.runEffectOpenArrangeCard();
      }
    } else if (res.gameServerState == 3) {
      this.processStateChiaBai(res);
    }
  }

  LOGIN() {
    //BGUI.UIWaitingLayout.showWaiting();
    this.refeshListRoom();
    //SHWESHANConnector.instance.sendPacket(new SHWESHANCmd.SendGetGameConfig());
  }
  private responseAutoReconnectGameRoomFail(cmdId: any, data: Uint8Array) {
    console.error("XXXRES JOIN_ROOM_FAIL");
  }
  JOIN_ROOM_FAIL(cmdId: any, data: Uint8Array) {
    //BGUI.UIWaitingLayout.showWaiting();
    let res = new SHWESHANCmd.ReceivedJoinRoomFail();
    res.unpackData(data);
    console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
    let msg = LanguageMgr.getString("shweshan.error_not_defined", {
      id: res.getError(),
    });
    // LanguageMgr.getString
    const errCode: number = res.getError();

    switch (errCode) {
      case 1:
        msg = LanguageMgr.getString("shweshan.error_check_infomation");
        break;
      case 2:
        msg = LanguageMgr.getString(
          "shweshan.error_can_not_find_table_try_again"
        );
        break;
      case 3:
        msg = LanguageMgr.getString(
          "shweshan.error_not_enough_money_to_join_table"
        );
        break;
      case 4:
        msg = LanguageMgr.getString(
          "shweshan.error_can_not_find_table_try_again"
        );
        break;
      case 5:
        msg = LanguageMgr.getString("shweshan.error_join_room_too_fast");
        break;
      case 6:
        msg = LanguageMgr.getString("shweshan.error_server_maintenance");
        break;
      case 7:
        msg = LanguageMgr.getString("shweshan.error_can_not_find_table");
        break;
      case 8:
        msg = LanguageMgr.getString(
          "shweshan.error_password_table_not_correct"
        );
        break;
      case 9:
        msg = LanguageMgr.getString("shweshan.error_room_full");
        break;
      case 10:
        msg = LanguageMgr.getString("shweshan.error_has_been_kick");
    }
    BGUI.UIPopupManager.instance.showPopup(msg);
  }

  REQUEST_LEAVE_ROOM(cmdId: any, data: Uint8Array) {
    let res = new SHWESHANCmd.ReceiveNotifyRegOutRoom();
    res.unpackData(data);
    console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
    let outChair = res["outChair"];
    let isOutRoom = res["isOutRoom"];
    let player = this.players[this.convertChair(outChair)];
    player.leaveRoom(isOutRoom);
    if (player.isMe) {
      this.showToast(
        isOutRoom
          ? LanguageMgr.getString("shankoemee.register_leave_table_success")
          : LanguageMgr.getString("shankoemee.cancel_register_leave_table")
      );
    }
  }
  reloadListRoom() {
    let roomPos = {
      0: cc.v3(-506.5, -206, 0),
      1: cc.v3(-209.5, -206, 0),
      2: cc.v3(87.5, -206, 0),
      3: cc.v3(384.5, -206, 0),
      4: cc.v3(-379.5, -488, 0),
      5: cc.v3(-64.5, -488, 0),
      6: cc.v3(244, -488, 0),
    };

    this.contentListRooms.removeAllChildren(true);
    let idx = 0;
    for (let i in this.dataRooms) {
      if (i == "arrCardEqual") {
        continue;
      }

      let itemData = this.dataRooms[i];
      if (typeof itemData !== "object") {
        continue;
      }
      let item = cc.instantiate(this.prefabItemRoom);
      item.getComponent(SHWESHANItemRoom).initItem(itemData, idx);
      this.contentListRooms.addChild(item);
      idx++;
    }

    for (let i = 0; i < 7; i++) {
      this.contentListRooms.children[i].position = roomPos[i];

      if (i <= 2) {
        this.contentListRooms.children[i].children[5].x = 41.055;
      }
    }
    this.scrollListRoom.scrollToTop(0.2);
  }

  private responseGetListRoomType(cmdId: any, data: Uint8Array) {
    let res = new SHWESHANCmd.ReceivedGetListRoomType();
    res.unpackData(data);
    console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
    let roomBackgrounds = {
      "1000": "1",
      "5000": "1",
      "20000": "2",
      "50000": "2",
      "100000": "3",
      "500000": "3",
      "1000000": "4",
      "20000000": "4",
    };
    this.dataRooms = [];
    for (let i = 0; i < res.list.length; i++) {
      let key = res.list[i].moneyBet;
      if (roomBackgrounds[key]) {
        const roomTypeData = res.list[i];
        this.dataRooms[key] = roomTypeData;
        this.dataRooms[key].bg = roomBackgrounds[key];
        this.dataRooms[key].userCount = roomTypeData.totalUser;
        this.dataRooms[key].requiredMoney = roomTypeData.minMoney;
        if (!roomTypeData.maxMoney) {
          this.dataRooms[key].maxJoin = [roomTypeData.minMoney];
        } else {
          this.dataRooms[key].maxJoin = [
            roomTypeData.minMoney,
            roomTypeData.maxMoney,
          ];
        }
      }
    }
    this.reloadListRoom();
  }
  CHAT_ROOM(cmdId: any, data: Uint8Array) {
    //BGUI.UIWaitingLayout.showWaiting();
    let res = new SHWESHANCmd.ReceivedChatRoom();
    res.unpackData(data);
    console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);

    let chair = res["chair"];
    let isIcon = res["isIcon"];
    let content = res["content"];
    let seatId = this.convertChair(chair);
    let player = this.players[seatId];
    let name = player.info.displayName;
    if (!player) return;
    if (isIcon) {
      player.showChatEmotion(content);
    } else {
      player.showChatMsg(LanguageMgr.getString(content));
      
    }
  }
  

  MONEY_BET_CONFIG(cmdId: any, data: Uint8Array) {
    let res = new SHWESHANCmd.ResMoneyBetConfig();
    res.unpackData(data);
    console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
    this.dataRooms = res.list;
    this.reloadListRoom();
  }
  UPDATE_GAME_INFO(cmdId: any, data: Uint8Array) {
    let res = new SHWESHANCmd.ReceivedUpdateGameInfo();
    res.unpackData(data);
    console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
    this.show(false);

    this.updateGameInfo(res);
  }
  AUTO_START(cmdId: any, data: Uint8Array) {
    this.node.stopAllActions();
    let res = new SHWESHANCmd.ReceivedAutoStart();
    res.unpackData(data);
    console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
    this.autoStart(res);
  }
  USER_JOIN_ROOM(cmdId: any, data: Uint8Array) {
    let res = new SHWESHANCmd.ReceiveUserJoinRoom();
    res.unpackData(data);
    console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
    this.onUserJoinRoom(res);
  }
  CHIA_BAI(cmdId: any, data: Uint8Array) {
    let res = new SHWESHANCmd.ReceivedChiaBai();
    res.unpackData(data);
    console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
    this._stateGame = 2;
    this.UI_Menu.active = false;
    // this.UI_Chat.active = false;
    this.skeletonBanker.setAnimation(0, "chia bai", true);
    this.scheduleOnce(() => {
      this.skeletonBanker.setAnimation(0, "normal", true);
    }, 0.8);
    this.chiaBai(res);
  }

  TIP() {
    // this.tipBtn.getComponent(cc.Button).interactable = false;

    this.skeletonBanker.setAnimation(0, "tip_kiss", false);

    this.scheduleOnce(() => {
      this.skeletonBanker.setAnimation(0, "normal", true);
    }, 0.7);
    // this.scheduleOnce(() => {
    //   this.tipBtn.getComponent(cc.Button).interactable = true;
    // }, 2.5);
  }

  private sendTip() {
    try {
      let pk = new SHWESHANCmd.TIP();
      SHWESHANConnector.instance.sendPacket(pk);
    } catch (error) {
      console.error("ERROR Send Tip", error);
    }
  }

  private responseTip(cmdId: any, data: Uint8Array) {
    let res = new SHWESHANCmd.ReceivedTIP();
    // console.log(data, "res");
    res.unpackData(data);
    console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
    let err = res.getError();

    let chipData = [
      this._roomBet * 1,
      this._roomBet * 5,
      this._roomBet * 10,
      this._roomBet * 50,
    ];
    switch (err) {
      case 0:
        this.tipBtn.getComponent(cc.Button).interactable = false;

        let chair = this.convertChair(res.chair);
        let pl = this.players[chair];
        let toPos = pl.node.getPosition();
        // console.log("topos", toPos);
        //banker position: -10, 300
        let amount = res.amount;
        pl.current_money += amount;
        pl.lblCoin.string = pl.convert2Label(pl.current_money);
        BGUI.UserManager.instance.mainUserInfo.vinTotal = pl.current_money;
        this.lbRoomBalance.string = BGUI.StringUtils.formatNumber(
          pl.current_money
        );
        let newNode = cc.instantiate(this.prfChip);
        newNode.setPosition(toPos.x, toPos.y);
        newNode.setScale(0.5);
        newNode.getComponent(Chip).init(this.sprCoin, amount);
        this.playerContainer.addChild(newNode);

        let newHeart = cc.instantiate(this.heart);
        this.playerContainer.addChild(newHeart);
        newHeart.setPosition(1.116, 305.65652);
        // newHeart.setPosition(-18, 360);
        // console.log("newheart", newHeart.position, newHeart.active);
        // console.log(
        //   "newheart",
        //   this.tipBtn,
        // );
        // newHeart.active = true
        newNode.runAction(
          cc.sequence(
            cc.moveTo(1, -8, 200),
            // cc.moveTo(1, -15, 200),
            cc.callFunc(() => {
              newNode.removeFromParent(true);
            })
          )
        );
        this.scheduleOnce(() => this.TIP(), 1.2);
        this.scheduleOnce(() => (newHeart.active = true), 2);

        this.scheduleOnce(
          () =>
            newHeart.runAction(
              cc.sequence(
                cc.callFunc(() => {
                  newHeart.active = true;
                  this.scheduleOnce(() => {
                    cc.fadeOut(0.1), newHeart.removeFromParent(true);
                  }, 1);
                }),
                cc.moveTo(1, toPos.x, toPos.y),

                // cc.scaleTo(1, 1.5),
                cc.callFunc(() => {
                  pl.kissAnim();
                })
              )
            ),
          2.2
        );
        this.scheduleOnce(() => {
          this.tipBtn.getComponent(cc.Button).interactable = true;
        }, 0.5);
        break;
      case 1:
        console.error("Haven't join any room");

        break;

      case 2:
        console.error("Haven't join any chair");
        break;

      case 3:
        console.error("Don't have player info");
        break;

      case 4:
        BGUI.UIPopupManager.instance.showPopup(
          LanguageMgr.getString("boogyi.error_not_enough_money")
        );
        break;
    }
  }

  MOI_XEP_BAI(cmdId: any, data: Uint8Array) {
    BGUI.UIPopupManager.instance.removeAllPopups();
    this.UI_Chat.active = false;
    let res = new SHWESHANCmd.ReceivedMoiXepBai();
    res.unpackData(data);
    console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
    this.timexepbai = res.time;
    for (let i = 0; i < this.players.length; i++) {
      let pl = this.players[i];
      if (pl.status < SHWESHANConstant.PlayerState.WAITING) {
        // console.log("MOI_XEP_BAI", pl.status);
        continue;
      }
      pl.setTimeRemain(0);
      pl.setTimeRemain(res.time);
    }
    let chair = this.convertChair(this.myChair);
    let pl = this.players[chair];
    // pl.setTimeRemain(res.time);
    // for (let i = 0; i < this.players.length; i++) {
    //   this.playerContainer.children[i]
    //     .getComponent(SHWESHANPlayer)
    //     .setTimeRemain(res.time);
    // }
    this.nArrangeCard.getComponent(ArrangeCard).setTimeRemain(res.time);
    if (pl.status >= SHWESHANConstant.PlayerState.WAITING) {
      pl.runEffectOpenArrangeCard();
    }
  }
  xeplai(cmdId: any, data: Uint8Array) {
    let pk = new SHWESHANCmd.SendXepBaiLai();
    SHWESHANConnector.instance.sendPacket(pk);
    console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId);
    this.nArrangeCard.getComponent(ArrangeCard).rearrange();
  }
  //test
  XEP_BAI_LAI(cards) {
    for (let i = 0; i <= 3; i++) {
      let pk = new SHWESHANCmd.SendXepBai();
      pk.card1 = cards[i];
      pk.card2 = cards[i + 4];
      SHWESHANConnector.instance.sendPacket(pk);
      // let chair = this.convertChair(this.myChair);
      // let pl = this.players[chair];
      // pl.dataCards = cards;
      // pl.updateCardOnHand()
    }
    let chair = this.convertChair(this.myChair);
    let pl = this.players[chair];
    pl.dataCards = cards;
    pl.updateCardOnHand();
    // if (pl.status >= SHWESHANConstant.PlayerState.WAITING) {
    pl.runEffectOpenArrangeCard();
    console.error("notime");
  }

  XEP_BAI(cmdId: any, data: Uint8Array) {
    let res = new SHWESHANCmd.ReceivedXepBai();
    res.unpackData(data);
    console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
    this.xepBai(res);
  }
  XEP_BAI_XONG(cmdId: any, data: Uint8Array) {
    let res = new SHWESHANCmd.ReceivedXepBaiXong();
    res.unpackData(data);
    console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
    this.xepBaiXong(res);
  }
  MO_BAI(cmdId: any, data: Uint8Array) {
    let res = new SHWESHANCmd.ReceivedMoBai();
    res.unpackData(data);
    console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
    this._stateGame = 6;
    this.submitTurn(res);
  }
  BO_LUOT(cmdId: any, data: Uint8Array) {
    let res = new SHWESHANCmd.ReceivedBoluot();
    res.unpackData(data);
    console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
    this.passTurn(res);
  }
  END_GAME(cmdId: any, data: Uint8Array) {
    this.rearrangeBtn.active = false;
    let res = new SHWESHANCmd.ReceivedEndGame();
    res.unpackData(data);
    console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
    this._stateGame = 7;
    this._dataEndGame = res;
    this.soundControler.playMusicByType(SOUNDTYPE.START_COMPARE);
    this.runEffectCompare();
    this.scheduleOnce(() => {
      this.endGame(res);
    }, 1.5);
  }
  UPDATE_MATCH(cmdId: any, data: Uint8Array) {
    let res = new SHWESHANCmd.ReceivedUpdateMatch();
    res.unpackData(data);
    console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
    this.updateMatch(res);
  }
  USER_LEAVE_ROOM(cmdId: any, data: Uint8Array) {
    let res = new SHWESHANCmd.UserLeaveRoom();
    this.UI_Menu.active = false;
    this.UI_Chat.active = false;
    res.unpackData(data);
    console.error(new Date().toLocaleString(), new Date().getMilliseconds(), cmdId, res);
    this.userLeaveRoom(res);
    this.sendRefreshListRoomType();
  }

  initSound() {
    this.soundControler.initData();
  }

  public show(isShow: boolean, roomInfo = null) {
    if (isShow) {
      this.closeUIRoom();
      this.showUIPlaying();
      this.closeUIChat();
      this.setRoomInfo(roomInfo);
      this.soundControler.playMusicByType(SOUNDTYPE.BACKGROUND);
    } else {
      this.UI_Playing.active = false;
      this.skeletonBanker.setAnimation(0, "normal", true);
      this.UI_ChooseRoom.active = true;
      this.soundControler.stopMusicByType(SOUNDTYPE.BACKGROUND);
    }
  }

  setRoomInfo(room) {
    this.lbTotalMoney.string = BGUI.StringUtils.formatNumber(
      BGUI.UserManager.instance.mainUserInfo.vinTotal
    );
    this.lbTableName.string = room.gameId;
    this.lbRoomId.string = "#" + room.roomId;
    this.lbRoomBet.string = BGUI.StringUtils.formatNumber(room.moneyBet);

    switch (room.moneyBet) {
      case 1000:
        this.betLabel.spriteFrame = this.betLv[0];
        break;
      case 5000:
        this.betLabel.spriteFrame = this.betLv[1];
        break;
      case 20000:
        this.betLabel.spriteFrame = this.betLv[2];
        break;
      case 50000:
        this.betLabel.spriteFrame = this.betLv[3];
        break;
      case 100000:
        this.betLabel.spriteFrame = this.betLv[4];
        break;
      case 500000:
        this.betLabel.spriteFrame = this.betLv[5];
        break;
      case 1000000:
        this.betLabel.spriteFrame = this.betLv[6];
        break;
    }

    this._roomBet = room.moneyBet;

    this.myChair = room.myChair;
    this.setPlayersInfo(room);
    // this.setChuongChair(room.chuongChair)
  }

  setPlayersInfo(room) {
    this.isMeStatus = room.playerInfos[0].status;
    for (let i = 0; i < room.playerInfos.length; i++) {
      var info = room.playerInfos[i];
      if (
        (room.playerStatus && room.playerStatus[i] != 0) ||
        (room.playerInfos &&
          room.playerInfos[i] &&
          room.playerInfos[i].status &&
          room.playerInfos[i].status != 0)
      ) {
        var chair = this.convertChair(i);
        var pl = this.players[chair];
        if (pl) {
          pl.setPlayerInfo(info);
          pl.resetAndCleanUp();
          pl.setStatus(
            room.playerStatus
              ? room.playerStatus[i]
              : room.playerInfos[i].status
          );
        } else {
        }
      }
    }
  }

  updateGameInfo(data: SHWESHANCmd.ReceivedUpdateGameInfo) {
    this.setTimeCountDown(0);
    this.show(true, data);
    if (!this.checkPlayerIsPlaying(data)) {
      //user is not playing
      return;
    }

    let chair = this.convertChair(this.myChair);
    let pl = this.players[chair];

    if (data.gameServerState == 0) {
    } else if (data.gameServerState == 1) {
      if (pl.status >= 2) {
        pl.dataCards = data.cards;
      }
      this.processStateChiaBai(data);
    } else if (data.gameServerState == 2) {
      this.nArrangeCard
        .getComponent(ArrangeCard)
        .setTimeRemain(data.countDownTime);
      if (pl.status >= 2) {
        pl.dataCards = data.cards;
        pl.runEffectOpenArrangeCard();
      }
      this.processStateChiaBai(data);
    } else if (data.gameServerState == 3) {
      if (pl.status >= 2) {
        pl.dataCards = data.cards;
      }
      this.processStateChiaBai(data);
    }
  }
  processStateChiaBai(data) {
    for (let i = 0; i < data.playerInfos.length; i++) {
      var info = data.playerInfos[i];
      if (data.playerInfos[i].status >= 2) {
        var chair = this.convertChair(i);
        var player = this.players[chair];
        if (!player) continue;
        player.chiaBaiPlayerUpdate();
      }
    }
  }
  checkPlayerIsPlaying(data) {
    for (let i = 0; i < data.playerInfos.length; i++) {
      var info = data.playerInfos[i];
      if (data.playerInfos[i].status >= 2) {
        var chair = this.convertChair(i);
        var player = this.players[chair];
        if (!player) continue;
        if (data.playerInfos[i].status >= 2) {
          return true;
        }
      }
    }
    return false;
  }

  onUserJoinRoom(user) {
    if (user.uStatus != 0) {
      this.players[this.convertChair(user.uChair)].setStatus(user.uStatus);
      this.players[this.convertChair(user.uChair)].setPlayerInfo(user.info);
      this.isMeStatus = user.uStatus;
    }
  }

  autoStart(autoInfo) {
    // this.node.stopAllActions();

    this.players.forEach((p) => {
      p.resetAndCleanUp();
      // p.hideScore();
      p.cleanCard();
    });
    this.cleanCardsOnBoard();
    this.cleanCardsOnHand();
    this._playerBet = [];
    if (autoInfo.isAutoStart) {
      this.soundControler.playMusicByType(SOUNDTYPE.NEWGAME);
      this._stateGame = 1;
      this.showToast(LanguageMgr.getString("shweshan.waiting_new_game"), true);
      this.setTimeCountDown(autoInfo.autoStartTime);
      setTimeout(() => {
        this.runEffectStart();
      }, 1000); //2000
    }
  }

  countDown() {
    this.timeCountDown--;
    if (this.timeCountDown <= 0) {
      this.unschedule(this.countDown);
      this.lbTimeCountDown.node.active = false;
    } else {
      this.lbTimeCountDown.string = this.timeCountDown + "";
    }
  }

  setTimeCountDown(t: number) {
    this.unschedule(this.countDown);
    this.lbTimeCountDown.string = t + "";
    this.lbTimeCountDown.node.active = t > 0;
    this.timeCountDown = t;
    if (t > 0) this.schedule(this.countDown, 1);
  }

  xepBai(res) {
    let chair = this.convertChair(res.chair);
    let pl = this.players[chair];
    if (pl && pl.active) {
      if (pl.isMe) {
        // this.nArrangeCard.active = false;
        // pl.runEffectSubmitCard();
      } else {
        pl.runEffectChangeCard(res.card1, res.card2);
      }
    }
  }
  xepBaiXong(res) {
    let chair = this.convertChair(res.chair);
    let pl = this.players[chair];
    if (pl && pl.active) {
      if (pl.isMe) {
        // this.nArrangeCard.active = false;
        // pl.runEffectSubmitCard();
      } else {
        pl.showXepBaiXong();
      }
    }
  }
  submitTurn(turn: SHWESHANCmd.ReceivedMoBai) {
    this.setActiveButtons(["bt_submit_turn", "bt_pass_turn"], [false, false]);
    // this.players[0].setTimeRemain(0);
    var cards = turn.cards;
    // var cardHalf = (cards.length - 1) / 2;
    // var ranX = Math.floor(Math.random() * 100) - 50;
    // var ranY = Math.floor(Math.random() * 100) - 50;
    var chair = this.convertChair(turn.chair);
    var pl = this.players[chair];
    if (!pl) return;

    // this.lastTurnCards.forEach(card => card.setClickable(false));

    this.lastTurnCards = [];

    if (chair == 0) {
      for (let i = 0; i < cards.length; i++) {
        let cardScore = CardLogic.getCardScore(cards);

        let isboolay = CardLogic.checkBoolay(cards);
        let isboogyi = cardScore == 10 ? true : false;
        let multiple = isboolay
          ? 8
          : isboogyi
          ? 5
          : cardScore == 9
          ? 4
          : cardScore == 8
          ? 3
          : cardScore >= 1
          ? 2
          : 1;
        pl.showScore(cardScore, multiple);
        // let _card = pl.getCardById(cards[i])
        // if (!_card) continue;
        // _card.parent = this.board;
        // _card.zIndex = this.cardZorder;
        // this.cardZorder++;
        // _card.runAction(cc.moveTo(0.2, cc.v2((i - cardHalf) * 30 + ranX, ranY)));
        // _card.runAction(cc.scaleTo(0.2, 0.6, 0.6));
        // this.lastTurnCards.push(_card.getComponent(BaseCard));
        // delete this.cardsOnHand[cards[i]];
      }
      // pl.refreshCardOnHandBool(true)
    } else {
      for (let i = 0; i < cards.length; i++) {
        if (!pl.isMe) pl.cleanCard();
        let cardScore = CardLogic.getCardScore(cards);
        let isboolay = CardLogic.checkBoolay(cards);
        let isboogyi = cardScore == 10 ? true : false;
        let multiple = isboolay
          ? 8
          : isboogyi
          ? 5
          : cardScore == 9
          ? 4
          : cardScore == 8
          ? 3
          : cardScore >= 1
          ? 2
          : 1;
        pl.showScore(cardScore, multiple);
        // let _card = pl.getRandomCard()
        // if (!_card) continue;
        // _card.active = true;
        // _card.zIndex = this.cardZorder;
        // this.cardZorder++;
        // _card.parent = this.board;
        // _card.getComponent(BaseCard).setTextureWithCode(cards[i]);
        // _card.runAction(cc.moveTo(0.2, cc.v2((i - cardHalf) * 30 + ranX, ranY)));
        // _card.runAction(cc.scaleTo(0.2, 0.6, 0.6));
        // this.lastTurnCards.push(_card.getComponent(BaseCard));
      }
      // pl.setCardRemain(turn.numberCard);
      // this.currTurnCards = cards;
    }

    // this.showScore(this.lastTurnCards);
  }

  passTurn(turn) {
    this.setActiveButtons(["bt_submit_turn", "bt_pass_turn"], [false, false]);
    this.players[this.convertChair(turn.chair)].boLuot();
    this.players[this.convertChair(turn.chair)].setTimeRemain(0);
  }

  cleanCardsOnHand() {
    for (var key in this.cardsOnHand) delete this.cardsOnHand[key];
  }

  cleanCardsOnBoard() {
    this.board.removeAllChildren();
    this.lastTurnCards = [];
    this._recommendedCards = [];
    this._vectorCombinationOfCards = [];
    this._vectorRecommendedCards = [];
  }

  setActiveButtons(btnNames, actives) {
    for (let i = 0; i < btnNames.length; i++) {
      this.buttons[btnNames[i]].active = actives[i];
    }
  }

  endGame(data: SHWESHANCmd.ReceivedEndGame) {
    this.dataResultEndGame = [];

    this.players.forEach((p, i) => {
      p.setTimeRemain(0);
      p.setCardRemain(0);
      p.removeCardSlot();
    });
    this.baiLung();
    let chair = this.convertChair(this.myChair);
    let pl = this.players[chair];

    if (this.isPlayerInteract == true) {
      this.playerNotInteractCount = 0;
      this.isPlayerInteract = false;
    } else if (
      this.isPlayerInteract == false &&
      this._dataEndGame.statusList[chair] != 0 &&
      this._dataEndGame.statusList[chair] != 1
    ) {
      // this._dataEndGame.statusList.
      this.playerNotInteractCount += 1;
      // SHWESHANController.instance.isPlayerInteract = false;
    } else {
    }
    if (this.playerNotInteractCount == 3) {
      this.playerNotInteractCount = 0;
      this.isPlayerInteract = false;
      // console.log("inactive leave", this.playerNotInteractCount);
      this.actLeaveRoom();
    }
    this.scheduleOnce(() => {}, 5); //12
  }
  soBaiFinish() {
    for (let i = 0; i < this.maxPlayer; i++) {
      var chair = this.convertChair(i);
      let pl = this.players[chair];
      if (!pl || !pl.active) {
        continue;
      }
      if (this._dataEndGame && this._dataEndGame.statusList[i] == 3) {
        if (this._dataEndGame.currentMoneyList[i]) {
          pl.setCoin(this._dataEndGame.currentMoneyList[i]);
        }
        pl.setResult(0, this._dataEndGame.tongCuoiVanList[i], true);
        // console.log("goldwin", this._dataEndGame.tongCuoiVanList[i]);

        if (pl.isMe && this._dataEndGame.tongCuoiVanList[i] > 0) {
          this.soundControler.playMusicByType(SOUNDTYPE.WIN);
        } else if (pl.isMe && this._dataEndGame.tongCuoiVanList[i] < 0) {
          this.soundControler.playMusicByType(SOUNDTYPE.LOSE);
        }
      }
    }
    // this.sendEndGameNotify()
    this.scheduleOnce(() => this.sendEndGameNotify(), 3);
    //test
  }
  baiLung() {
    if (this.coBaiLung()) {
      // cc.log("coBaiLung");
      for (let i = 0; i < this._dataEndGame.resultInfos.length; i++) {
        var chair = this.convertChair(this._dataEndGame.resultInfos[i].chair);
        let player = this.players[chair];
        if (
          this._dataEndGame.resultInfos[i].bo[0] <=
            SHWESHANConstant.CardsType.LUNG &&
          player.status >= SHWESHANConstant.PlayerState.WAITING
        ) {
          player.showBaiLung(
            this._dataEndGame.cardList[this._dataEndGame.resultInfos[i].chair],
            this._dataEndGame.resultInfos[i].bo[0] == -1
          );
        }
      }
      this.scheduleOnce(() => {
        this.runEffectNemTienRound(0);
      }, 0.8);
      this.node.runAction(
        cc.sequence(
          cc.delayTime(2.6),
          cc.callFunc(
            function () {
              this.soBai(1);
            }.bind(this)
          )
        )
      );
    } else {
      this.soBai(1);
    }
  }
  hideBai(round) {
    // if (round == 4) {
    //   round = 1;
    // }
    this.scheduleOnce(() => {
      for (let i = 0; i < this._dataEndGame.resultInfos.length; i++) {
        var chair = this.convertChair(this._dataEndGame.resultInfos[i].chair);
        let player = this.players[chair];
        if (!player || !player.active) continue;
        if (
          this._dataEndGame.statusList[
            this._dataEndGame.resultInfos[i].chair
          ] >= SHWESHANConstant.PlayerState.WAITING
        ) {
          if (round == 0) {
            player.hideBaiLung(this._dataEndGame.resultInfos[i].bo[0] == -1);
          } else if (round == 4) {
            if (
              this._dataEndGame.resultInfos[i].bo[4] ==
                SHWESHANConstant.CardsType.ALL9 &&
              round == 4
            ) {
              // console.log("goldwin all9", player.lblNickname.string);
              player.hideBai(
                1,
                this._dataEndGame.cardList[
                  this._dataEndGame.resultInfos[i].chair
                ]
              );
              // player.setResult(0, this._dataEndGame.tongCuoiVanList[i], true)
              // this.runEffectMoney(player, -money, this._dataEndGame.resultInfos[i].roundThang[round] > 0)
            }
            this.node.runAction(
              cc.sequence(
                cc.delayTime(1.8), //4.0
                cc.callFunc(
                  function () {
                    this.soBaiFinish();
                  }.bind(this)
                )
              )
            );
          } else {
            player.hideBai(
              round == 4 ? 1 : round,
              this._dataEndGame.cardList[this._dataEndGame.resultInfos[i].chair]
            );
            // console.log(
            //   "goldwin all9",
            //   player.lblNickname.string,
            //   round,
            //   this._dataEndGame.resultInfos[i].bo
            // );
          }
        }
      }
    }, 1);
  }

  soBai(index) {
    var needSoBai = this.needSoBai();
    if (needSoBai) {
      for (let i = 0; i < this._dataEndGame.resultInfos.length; i++) {
        var chair = this.convertChair(this._dataEndGame.resultInfos[i].chair);
        let player = this.players[chair];
        if (!player || !player.active) continue;
        if (
          this._dataEndGame.statusList[
            this._dataEndGame.resultInfos[i].chair
          ] >= SHWESHANConstant.PlayerState.WAITING &&
          this._dataEndGame.resultInfos[i].bo[0] >
            SHWESHANConstant.CardsType.LUNG
        ) {
          player.soBo(
            index,
            this._dataEndGame.cardList[this._dataEndGame.resultInfos[i].chair],
            false
          );
        } else if (
          this._dataEndGame.statusList[
            this._dataEndGame.resultInfos[i].chair
          ] >= SHWESHANConstant.PlayerState.WAITING
        ) {
          player.stateBaiLung();
        }
      }
      this.scheduleOnce(() => {
        this.runEffectNemTienRound(index);
      }, 0.9); //timealter
      this.node.runAction(
        cc.sequence(
          cc.delayTime(3.4), //timealter
          cc.callFunc(
            function () {
              if (index < 3) {
                this.soBai(index + 1);
              } else {
                this.all9Effect();
              }
            }.bind(this)
          )
        )
      );
    } else {
      //run endgame
      this.all9Effect();
    }
  }

  all9Effect() {
    if (this.needShowAll9()) {
      cc.error("all9Effect", this._dataEndGame);
      for (let i = 0; i < this._dataEndGame.resultInfos.length; i++) {
        var chair = this.convertChair(this._dataEndGame.resultInfos[i].chair);
        let player = this.players[chair];
        if (!player || !player.active) continue;
        if (this._dataEndGame.resultInfos[i].roundThang[4] > 0) {
          player.soBo(
            1,
            this._dataEndGame.cardList[this._dataEndGame.resultInfos[i].chair],
            true
          );
        }
      }
      this.scheduleOnce(() => {
        this.runEffectNemTienRound(4);
      }, 0.8);
      // this.node.runAction(
      //   cc.sequence(
      //     cc.delayTime(4.0),
      //     cc.callFunc(
      //       function () {
      //         this.soBaiFinish();
      //       }.bind(this)
      //     )
      //   )
      // );
    } else {
      this.node.runAction(
        cc.sequence(
          cc.delayTime(2.0), //3.0
          cc.callFunc(
            function () {
              this.soBaiFinish();
            }.bind(this)
          )
        )
      );
    }
  }

  needSoBai() {
    var count = 0;
    for (let i = 0; i < this._dataEndGame.resultInfos.length; i++) {
      if (
        this._dataEndGame.resultInfos[i].bo[0] > SHWESHANConstant.CardsType.LUNG
      ) {
        count++;
      }
    }
    return count >= 2;
  }
  coBaiLung() {
    var count = 0;
    for (let i = 0; i < this._dataEndGame.resultInfos.length; i++) {
      if (
        this._dataEndGame.resultInfos[i].bo[0] <=
        SHWESHANConstant.CardsType.LUNG
      ) {
        count++;
      }
    }
    return count >= 1;
  }
  needShowAll9() {
    var count = 0;
    for (let i = 0; i < this._dataEndGame.resultInfos.length; i++) {
      if (
        this._dataEndGame.resultInfos[i].bo[4] ==
        SHWESHANConstant.CardsType.ALL9
      ) {
        count++;
      }
    }
    return count >= 1;
  }
  clearTablePot() {
    this.nodeTableCoin.removeAllChildren();
  }
  runEffectMoney(player: SHWESHANPlayer, money, thuTien = false) {
    // this.clearTablePot();
    let chipData = [
      this._roomBet * 1,
      this._roomBet * 5,
      this._roomBet * 10,
      this._roomBet * 50,
    ];

    let coinPosX = [624.835, -461.919, 855.458, -840.298, 573.284, -534.57];
    let coinPosY = [-358.879, -358.879, -18.361, -18.361, 338.416, 347.268];

    let data = this.getArrTablePot(money);
    let nWidth = this.nodeTableCoin.width / 2;
    let nHeight = this.nodeTableCoin.height / 2;
    for (let i = 0; i < chipData.length; i++) {
      for (let j = 0; j < data[i]; j++) {
        let newNode = cc.instantiate(this.prfChip);
        // newNode.addComponent(cc.Sprite).spriteFrame = this.sprCoin[i];
        newNode.getComponent(Chip).init(this.sprCoin, chipData[i]);
        // newNode.setScale((i+1)/10)
        let randomPosX = (Math.random() - 0.5) * nWidth;
        let randomPosY = (Math.random() - 0.5) * nHeight;
        newNode.setScale(0.5);
        this.nodeTableCoin.addChild(newNode);
        if (thuTien) {
          // SHWESHANPlayer.instance.nCardScore.getComponent(cc.Sprite).spriteFrame = SHWESHANPlayer.instance.scoreLose
          newNode.setPosition(randomPosX, randomPosY);
          // console.log("player position win", player.node.x, player.node.y)
          newNode.runAction(
            cc.sequence(
              cc.moveTo(
                0.375,
                coinPosX[player.node.getSiblingIndex()],
                coinPosY[player.node.getSiblingIndex()]
                // player.node.children[player.node.getSiblingIndex()].x,
                // player.node.children[player.node.getSiblingIndex()].y
              ).easing(cc.easeCubicActionOut()),
              cc.callFunc(() => {
                player.setResult(0, money);
                newNode.removeFromParent(true);
              })
            )
          );
        } else if (
          money == 0 &&
          this._dataEndGame.resultInfos[i].bo[0] >
            SHWESHANConstant.CardsType.LUNG
        ) {
          this.scheduleOnce(() => {
            player.setResult(0, money);
          }, 1);
        } else {
          newNode.setPosition(
            coinPosX[player.node.getSiblingIndex()],
            coinPosY[player.node.getSiblingIndex()]
            // player.node.children[player.node.getSiblingIndex()].x,
            // player.node.children[player.node.getSiblingIndex()].y
          );
          // newNode.setPosition(player.node.x, player.node.y);
          // console.log("player position lose", player.node.x, player.node.y)
          newNode.runAction(
            cc.sequence(
              cc.moveTo(0.375, randomPosX, randomPosY).easing(cc.easeOut(2.0)), //easing(cc.easeOut(2.0))
              cc.callFunc(() => {
                player.setResult(0, -money);
                this.scheduleOnce(() => {
                  newNode.removeFromParent(true);
                }, 1);
              })
            )
          );
        }

      }
    }
  }

  runEffectNemTienRound(round) {
    for (let i = 0; i < this._dataEndGame.resultInfos.length; i++) {
      var chair = this.convertChair(this._dataEndGame.resultInfos[i].chair);
      let player = this.players[chair];
      if (!player || !player.active) continue;
      let money =
        this._dataEndGame.resultInfos[i].moneyNeedToPayPerRound[round];

      if (money < 0) {
        this.soundControler.playMusicByType(SOUNDTYPE.RUNMONEY);
        this.runEffectMoney(
          player,
          -money,
          this._dataEndGame.resultInfos[i].roundThang[round] > 0
        );
      }
      if (
        money == 0 &&
        this._dataEndGame.resultInfos[i].bo[0] > SHWESHANConstant.CardsType.LUNG
      ) {
        this.scheduleOnce(() => {
          player.setResult(0, money);
        }, 1.2);
      }
    }
    this.scheduleOnce(() => {
      this.clearTablePot();
      for (let i = 0; i < this._dataEndGame.resultInfos.length; i++) {
        var chair = this.convertChair(this._dataEndGame.resultInfos[i].chair);
        let player = this.players[chair];
        if (!player || !player.active) continue;
        let money =
          this._dataEndGame.resultInfos[i].moneyNeedToPayPerRound[round];
        if (money > 0 || money == 0) {
          this.soundControler.playMusicByType(SOUNDTYPE.RUNMONEY);
          this.runEffectMoney(
            player,
            money,
            this._dataEndGame.resultInfos[i].roundThang[round] > 0
          );
        }
      }
      this.hideBai(round);
    }, 0.85); //timealter
  }

  getArrTablePot(money) {
    let chipData = [
      this._roomBet * 1,
      this._roomBet * 5,
      this._roomBet * 10,
      this._roomBet * 50,
    ];
    let data = [0, 0, 0, 0];
    for (let i = chipData.length - 1; i >= 0; i--) {
      data[i] = parseInt((money / chipData[i]).toString());
      money = money % chipData[i];
    }
    return data;
  }
  runEffectCompare() {
    this.rearrangeBtn.active = false;
    // cc.log("runEffectCompare");
    let self = this;
    this.effectNode.getChildByName("compareEffect").active = true;
    this.effectNode.getChildByName("compareEffect").setScale(0);
    this.effectNode.getChildByName("compareEffect").runAction(
      cc.sequence(
        cc.scaleTo(1, 1),
        cc.delayTime(1),
        cc.callFunc(() => {
          this.effectNode.getChildByName("compareEffect").active = false;
        })
      )
    );
  }

  runEffectStart() {
    this.spineCoundown.node.active = true;
    this.spineCoundown.setAnimation(0, "animation", false);
    // cc.log("runEffectStart");
    let self = this;
    setTimeout(() => {
      this.spineCoundown.node.active = false;
      this.effectNode.getChildByName("startEffect").active = true;
      this.effectNode.getChildByName("startEffect").setScale(0);
      this.effectNode.getChildByName("startEffect").runAction(
        cc.sequence(
          cc.scaleTo(1, 1),
          cc.delayTime(0.5),
          cc.callFunc(() => {
            this.effectNode.getChildByName("startEffect").active = false;
          })
        )
      );
    }, 2000);
  }
  updateMatch(data: SHWESHANCmd.ReceivedUpdateMatch) {
    this.myChair = data.myChair;
    this.isMeStatus = data.infos[0].status;
    for (let i = 0; i < data.infos.length; i++) {
      if (data.hasInfo[i]) {
        let chair = this.convertChair(i);
        let player = this.players[chair];
        player.setCoin(data.infos[i].money);
        player.setStatus(data.infos[i].status);
      }
    }
  }

  userLeaveRoom(data) {
    var chair = this.convertChair(data.chair);
    this.players[chair].setLeaveRoom();
    if (chair == 0) {
      this.players.forEach((p) => {
        p.resetAndCleanUp();
        p.hideScore();
        p.cleanCard();
        p.setLeaveRoom();
        this.closeUIMenu();
        this.closeUIChat();
        this.closeUISound();
        this.closeUIGuide();
        this.showToast("");
        this.unschedule(this.countDown);
        
      });
      this.show(false);
      
      this.UI_ChooseRoom.active = true;
    }
  }

  convertChair(a) {
    return (a - this.myChair + this.maxPlayer) % this.maxPlayer;
  }

  showToast(message: string, autoHide = true) {
    if (!autoHide) {
      this.lblToast.string = message;
      this.lblToast.string = message;
      let parent = this.lblToast.node.parent;
      parent.stopAllActions();
      parent.active = true;
      parent.opacity = 255;
      return;
    }
    this.lblToast.string = message;
    let parent = this.lblToast.node.parent;
    parent.stopAllActions();
    parent.active = true;
    parent.opacity = 0;
    parent.runAction(
      cc.sequence(
        cc.fadeIn(0.1),
        cc.delayTime(2),
        cc.fadeOut(0.2),
        cc.callFunc(() => {
          parent.active = false;
        })
      )
    );
  }

  //cancel leave
  actLeaveRoom() {
    BGUI.UIPopupManager.instance.removeAllPopups();
    this.playerNotInteractCount = 0;
    this.isPlayerInteract = false;
    SHWESHANConnector.instance.sendPacket(
      new SHWESHANCmd.SendRequestLeaveGame()
    );
    
    this.btnCancelLeaveRoom.node.active = !this.btnCancelLeaveRoom.node.active;
    this.btnLeaveRoom.node.active = !this.btnLeaveRoom.node.active;
  }

  chiaBai(data) {
    this.tipBtn.getComponent(cc.Button).interactable = false;
    // cc.log("chiabai", data)
    this.showToast("");
    // this.setTimeCountDown(data.timeChiaBai);
    var idxChia = 0;
    for (let i = 0; i < this._arrChiaBai.length; i++) {
      let player = this.players[this._arrChiaBai[i]];
      if (!player || !player.active) continue;
      if (player.status < SHWESHANConstant.PlayerState.WAITING) {
        continue;
      }
      if (player.isMe) {
        player.dataCards = data.cards;
        player.chiaBai(idxChia);
      } else {
        player.chiaBai(idxChia);
      }
      player.setTimeRemain(data.timeChiaBai);
      idxChia++;
      // player.runEffectDealCards();
      // this.scheduleOnce(() => {
      //     player.setCardRemain(data.cardSize)
      // }, 1)
    }
    this.scheduleOnce(
      () => (this.tipBtn.getComponent(cc.Button).interactable = true),
      2
    );
    this.scheduleOnce(() => {}, 1);
  }

  canHitCard(
    recommendCards: BaseCard[],
    _vectorRecommendedCards: BaseCard[][]
  ) {}

  canHitCards(_choosingCards: BaseCard[]) {}

  resortCardsWhenStraightSam(list: BaseCard[]): BaseCard[] {
    if (list.length == 0) return list;
    var temp = list.slice(0);
    CardLogic.sortVector(temp, false);
    return temp;
  }

  // showScore(cards: BaseCard[]) {}
  showArrangeCard(cards) {
    this.nArrangeCard.getComponent(ArrangeCard).setCardData(cards);
    // this.nArrangeCard.getComponent(SHWESHANPlayer).setCardData(cards);
  }
  hideArrangeCard() {
    let chair = this.convertChair(this.myChair);
    let pl = this.players[chair];
    this.nArrangeCard.getComponent(ArrangeCard).node.setScale(0.5);
    pl.runEffectSubmitCard();
  }
  changeCard(card1, card2, cards) {
    let pk = new SHWESHANCmd.SendXepBai();
    let chair = this.convertChair(this.myChair);
    pk.card1 = card1;
    pk.card2 = card2;

    SHWESHANConnector.instance.sendPacket(pk);
    let pl = this.players[chair];
    pl.dataCards = cards;
    pl.updateCardOnHand();
  }
  submitCard(cards, sendPacket = true) {
    if (this.openLeaveNoti == true) {
      this.closeUIPlaying();
    }
    let chair = this.convertChair(this.myChair);
    let pl = this.players[chair];
    pl.dataCards = cards;
    this.nArrangeCard.getComponent(ArrangeCard).node.setScale(0.5);
    pl.runEffectSubmitCard();
    this.rearrangeBtn.active = true;
    if (sendPacket) {
      let pk = new SHWESHANCmd.sendXepBaiXong();
      // console.log("pk", pk);
      SHWESHANConnector.instance.sendPacket(pk);
    }
  }
  submitBoLuot(cards, sendPacket = true) {
    if (this.openLeaveNoti == true) {
      this.closeUIPlaying();
    }
    let chair = this.convertChair(this.myChair);
    let pl = this.players[chair];
    pl.boLuot();
    pl.dataCards = cards;
    this.nArrangeCard.getComponent(ArrangeCard).node.setScale(0.5);
    pl.runEffectSubmitCard();
    if (sendPacket) {
      let pk = new SHWESHANCmd.SendBoLuot();
      SHWESHANConnector.instance.sendPacket(pk);
    }
  }
}
