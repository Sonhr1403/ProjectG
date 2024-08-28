// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
import { PlinkoCmd } from "./Plinko.CMD";
import { PlinkoConnector } from "./Plinko.Connector";
import PlinkoBlock from "./Plinko.Block";
import PlinkoCommon from "./Plinko.Common";
import PlinkoDetailedHistory from "./Plinko.DetailedHistory";
import PlinkoBall from "./Plinko.Ball";
import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import PlinkoMusicCtrler, { PLINKO_SOUND_TYPE } from "./Plinko.MusicCtrller";
const { ccclass, property } = cc._decorator;

@ccclass
export default class PlinkoMain extends cc.Component {
  public static instance: PlinkoMain = null;
  @property(cc.Node)
  public noti: cc.Node = null;
  @property(cc.Node)
  mainGameNode: cc.Node = null;
  @property(cc.Prefab)
  ball: cc.Prefab = null;
  @property(cc.Node)
  ballPool: cc.Node = null;
  @property(cc.Label)
  totalMoneyAvailable: cc.Label = null;
  @property(cc.Label)
  usernameLbl: cc.Label = null;
  @property(cc.Label)
  betLvLbl: cc.Label = null;
  @property(cc.Label)
  dropNumLbl: cc.Label = null;
  @property(cc.EditBox)
  edtInputBetAmount: cc.EditBox = null;
  @property(cc.EditBox)
  edtInputChatAutoDrop: cc.EditBox = null;
  @property(cc.EditBox)
  edtInputMultiDrop: cc.EditBox = null;
  @property(cc.Prefab)
  rowPrefab: cc.Prefab = null;
  @property(cc.Node)
  rowPool: cc.Node = null;
  @property(cc.Node)
  rowNumMenu: cc.Node = null;
  @property(cc.Node)
  testNode: cc.Node = null;
  @property(cc.Node)
  rowMenu: cc.Node = null;
  @property(cc.Node)
  toggleSelectRisk: cc.Node = null;
  @property(cc.Node)
  toggleSelectRowNum: cc.Node = null;
  @property(cc.Node)
  toggleSelectBetMode: cc.Node = null;
  @property(cc.Node)
  dropModeMask: cc.Node = null;
  @property(cc.Node)
  dropMenu: cc.Node = null;
  @property(cc.Node)
  plinkoHistory: cc.Node = null;
  @property(cc.Node)
  updateBtns: cc.Node = null;
  @property(cc.Node)
  betBtns: cc.Node = null;
  @property(cc.Node)
  autoBetBtn: cc.Node = null;
  @property(cc.Node)
  betBtn: cc.Node = null;
  @property(cc.SpriteFrame)
  betBtnNodeSprite: cc.SpriteFrame[] = [];
  @property(cc.SpriteFrame)
  betBtnLbl: cc.SpriteFrame[] = [];
  @property(cc.Prefab)
  plinkoDetailedHistoryPrefab: cc.Prefab = null;
  @property(cc.Node)
  plinkoHistoryContent: cc.Node = null;
  @property(cc.ScrollView)
  plinkoHistoryView: cc.ScrollView = null;
  @property(sp.Skeleton)
  winBar: sp.Skeleton = null;
  @property(cc.Label)
  winBarLbl: cc.Label = null;
  @property(cc.Node)
  nameTitle: cc.Node = null;
  @property(cc.Node)
  playerInfo: cc.Node = null;
  @property(cc.Node)
  interactableBtns: cc.Node[] = [];
  @property(cc.Node)
  editBetDrop: cc.Node = null;
  @property(cc.Node)
  public spAvatar: cc.Node = null;
  @property(cc.SpriteFrame)
  public defaultAvatars: cc.SpriteFrame = null;

  private username: string = null;
  private _scheduler = null;
  private _isGameActive: boolean = true;
  private hideTime: number = null;
  public rowNum: number = 8;
  public riskLevel: number = 0;
  public allAtOnce: boolean = true;
  public isAuto: boolean = false;
  public autoDropNum: number = 1;
  public goldAmount: number = 10000;
  public maxBet: number = 20000;
  public minBet: number = 1000;
  public betAmountArray = [1000, 2000, 5000, 10000, 20000];
  private betIndex: number = 0;
  public betAmount: number = 1000; //amount?
  public massCreateLimit: number = 1;
  public ballScale: number = 1;
  public goalPositions = [];
  public betResult = [];
  public quickDrop: boolean = false;
  public betHistory = [];
  public colorArray = [];
  public isMobile: boolean = false;
  private winScheduler;
  private currentScroll = 0;
  private stepScroll = 1 / 4;
  public rowScale;
  public spacingGoal;
  private enableToggle: boolean = true;
  private betMode = 0;
  arrayTestTemp = {
    8: {
      0: [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
      1: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
      2: [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29],
    },
    9: {
      0: [5.6, 2, 1.6, 1, 0.7, 0.7, 1, 1.6, 2, 5.6],
      1: [18, 4, 1.7, 0.9, 0.5, 0.5, 0.9, 1.7, 4, 18],
      2: [43, 7, 2, 0.6, 0.2, 0.2, 0.6, 2, 7, 43],
    },
    10: {
      0: [8.9, 3, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 3, 8.9],
      1: [22, 5, 2, 1.4, 0.6, 0.4, 0.6, 1.4, 2, 5, 22],
      2: [76, 10, 3, 0.9, 0.3, 0.2, 0.3, 0.9, 3, 10, 76],
    },
    11: {
      0: [8.4, 3, 1.9, 1.3, 1, 0.7, 0.7, 1, 1.3, 1.9, 3, 8.4],
      1: [24, 6, 3, 1.8, 0.7, 0.5, 0.5, 0.7, 1.8, 3, 6, 24],
      2: [120, 14, 5.2, 1.4, 0.4, 0.2, 0.2, 0.4, 1.4, 5.2, 14, 120],
    },
    12: {
      0: [10, 3, 1.6, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 1.6, 3, 10],
      1: [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33],
      2: [170, 24, 8.1, 2, 0.7, 0.2, 0.2, 0.2, 0.7, 2, 8.1, 24, 170],
    },
    13: {
      0: [8.1, 4, 3, 1.9, 1.2, 0.9, 0.7, 0.7, 0.9, 1.2, 1.9, 3, 4, 8.1],
      1: [43, 13, 6, 3, 1.3, 0.7, 0.4, 0.4, 0.7, 1.3, 3, 6, 13, 43],
      2: [260, 37, 11, 4, 1, 0.2, 0.2, 0.2, 0.2, 1, 4, 11, 37, 260],
    },
    14: {
      0: [7.1, 4, 1.9, 1.4, 1.3, 1.1, 1, 0.5, 1, 1.1, 1.3, 1.4, 1.9, 4, 7.1],
      1: [58, 15, 7, 4, 1.9, 1, 0.5, 0.2, 0.5, 1, 1.9, 4, 7, 15, 58],
      2: [420, 56, 18, 5, 1.9, 0.3, 0.2, 0.2, 0.2, 0.3, 1.9, 5, 18, 56, 420],
    },
    15: {
      0: [15, 8, 3, 2, 1.5, 1.1, 1, 0.7, 0.7, 1, 1.1, 1.5, 2, 3, 8, 15],
      1: [88, 18, 11, 5, 3, 1.3, 0.5, 0.3, 0.3, 0.5, 1.3, 3, 5, 11, 18, 88],
      2: [620, 83, 27, 8, 3, 0.5, 0.2, 0.2, 0.2, 0.2, 0.5, 3, 8, 27, 83, 620],
    },
    16: {
      0: [
        16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16,
      ],
      1: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110],
      2: [
        1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000,
      ],
    },
  };
  arrayFallChance = {
    8: [
      0.3906, 3.125, 10.9375, 21.875, 27.3438, 21.875, 10.9375, 3.125, 0.3906,
    ],
    9: [
      0.1953, 1.7578, 7.0313, 16.4063, 24.6094, 24.6094, 16.4063, 7.0313,
      1.7578, 0.1953,
    ],
    10: [
      0.0977, 0.9766, 4.3945, 11.7188, 20.5078, 24.6094, 20.5078, 11.7188,
      4.3945, 0.9766, 0.0977,
    ],
    11: [
      0.0488, 0.5371, 2.6855, 8.0566, 16.1133, 22.5586, 22.5586, 16.1133,
      8.0566, 2.6855, 0.5371, 0.0488,
    ],
    12: [
      0.0244, 0.293, 1.6113, 5.3711, 12.085, 19.3359, 22.5586, 19.3359, 12.085,
      5.3711, 1.6113, 0.293, 0.0244,
    ],
    13: [
      0.0122, 0.1587, 0.9521, 3.4912, 8.728, 15.7104, 20.9473, 20.9473, 15.7104,
      8.728, 3.4912, 0.9521, 0.1587, 0.0122,
    ],
    14: [
      0.0061, 0.0854, 0.5554, 2.2217, 6.1096, 12.2192, 18.3289, 20.9473,
      18.3289, 12.2192, 6.1096, 2.2217, 0.5554, 0.0854, 0.0061,
    ],
    15: [
      0.0031, 0.0458, 0.3204, 1.3885, 4.1656, 9.1644, 15.274, 19.6381, 19.6381,
      15.274, 9.1644, 4.1656, 1.3885, 0.3204, 0.0458, 0.0031,
    ],
    16: [
      0.0015, 0.0244, 0.1831, 0.8545, 2.7771, 6.665, 12.2192, 17.4561, 19.6381,
      17.4561, 12.2192, 6.665, 2.7771, 0.8545, 0.1831, 0.0244, 0.0015,
    ],
  };
  objectSize = {
    //blockspacing = pinSpacing || goalSpacing = rowSpacing
    8: { itemScale: 1.5, goalSpacing: 94, blockSpacing: 51 },
    9: { itemScale: 1.38, goalSpacing: 84, blockSpacing: 49 },
    10: { itemScale: 1.3, goalSpacing: 75, blockSpacing: 47 },
    11: { itemScale: 1.2, goalSpacing: 68, blockSpacing: 46 },
    12: { itemScale: 1.1, goalSpacing: 63, blockSpacing: 46 },
    13: { itemScale: 1, goalSpacing: 59, blockSpacing: 46 },
    14: { itemScale: 0.9, goalSpacing: 55, blockSpacing: 48 },
    15: { itemScale: 0.8, goalSpacing: 51.5, blockSpacing: 50 },
    16: { itemScale: 0.75, goalSpacing: 48, blockSpacing: 50 },
  };
  //number of rows : risk level : multipliers
  private backToLobby() {
    PlinkoConnector.instance.disconnect();
    BGUI.GameCoreManager.instance.onBackToLobby();
  }

  onLoad() {
    const url = window.location.href;
    let urlSearchParams = new URLSearchParams(url.split("?")[1]);
    if (
      url &&
      url.includes("?") &&
      urlSearchParams &&
      urlSearchParams.get("lang")
    ) {
      let lang = urlSearchParams.get("lang");
      BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, lang);
      LanguageMgr.updateLang(lang);
      // LobbyCtrl.instance.emitLogicChoose(lang)
    } else {
      BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, "en");
      LanguageMgr.updateLang("en");
      // LobbyCtrl.instance.emitLogicChoose("en")
    }

    // this.setupColliGame();
    PlinkoMain.instance = this;
    PlinkoConnector.instance.addCmdListener(
      PlinkoCmd.Cmd.CMD_PLINKO_LOGIN,
      this.responseLogin,
      this
    );
    PlinkoConnector.instance.addCmdListener(
      PlinkoCmd.Cmd.CMD_PLINKO_EXITGAME,
      this.responseDisconnect,
      this
    );
    PlinkoConnector.instance.addCmdListener(
      PlinkoCmd.Cmd.CMD_PLINKO_JOINGAME,
      this.responseJoinGame,
      this
    );

    PlinkoConnector.instance.addCmdListener(
      PlinkoCmd.Cmd.CMD_PLINKO_RESULT,
      this.responseResult,
      this
    );
    let physicsManager = cc.director.getPhysicsManager();
    physicsManager.enabled = true;
    var collisionManager = cc.director.getCollisionManager();
    collisionManager.enabled = true;
    // cc.game.setFrameRate(120);
    this.changeScreenOrientation();
    cc.view.setResizeCallback(() => {
      this.changeScreenOrientation();
    });
    cc.debug.setDisplayStats(false);
    cc.view.resizeWithBrowserSize(true);
    this.mainGameNode.on(
      cc.Node.EventType.TOUCH_START,
      this.closeMenuRow,
      this
    );
    cc.audioEngine.stopAll();
    // PlinkoMusicCtrler.instance.playBGMusic(PlinkoMusicCtrler.instance.mainBGM);
    // window.addEventListener("resize", () => {cc.log(window.innerHeight, window.innerWidth)});
    // window.addEventListener("resize", () => {
    //   this.changeScreenOrientation();
    // });
  }

  protected onDestroy(): void {
    PlinkoConnector.instance.removeCmdListener(
      this,
      PlinkoCmd.Cmd.CMD_PLINKO_LOGIN
    );
    PlinkoConnector.instance.removeCmdListener(
      this,
      PlinkoCmd.Cmd.CMD_PLINKO_EXITGAME
    );
    PlinkoConnector.instance.removeCmdListener(
      this,
      PlinkoCmd.Cmd.CMD_PLINKO_RESULT
    );
    PlinkoConnector.instance.removeCmdListener(
      this,
      PlinkoCmd.Cmd.CMD_PLINKO_JOINGAME
    );
    this.mainGameNode.off(
      cc.Node.EventType.TOUCH_START,
      this.closeMenuRow,
      this
    );

    cc.game.off(cc.game.EVENT_SHOW, this._onShowGame, this);
    cc.game.off(cc.game.EVENT_HIDE, this._onHideGame, this);
    cc.director.getScheduler().unscheduleUpdate(this);
  }

  start() {
    this.isMobile = cc.sys.isMobile;
    this._scheduler = window.setInterval(
      this.updateOffline.bind(this),
      1000 / 60
    );

    cc.game.on(cc.game.EVENT_SHOW, this._onShowGame, this);
    cc.game.on(cc.game.EVENT_HIDE, this._onHideGame, this);
  }

  closeMenuRow() {
    this.rowMenu.active = true;
  }

  private responseLogin(cmdId: any, data: Uint8Array) {
    let res = new PlinkoCmd.PlinkoReceivedLogin();
    res.unpackData(data);

    PlinkoMusicCtrler.instance.playBGMusic(PlinkoMusicCtrler.instance.mainBGM);

    let msg = "";
    let err = res.getError();

    switch (err) {
      case 3:
        PlinkoCmd.Send.sendPlinkoJoinGame();
        break;
      case 1:
        msg = LanguageMgr.getString("plinko.login_fail");
        break;
      case 2:
        msg = LanguageMgr.getString("plinko.login_fail");
        break;
      case 0:
        PlinkoCmd.Send.sendPlinkoJoinGame();
        break;

      default:
        msg = LanguageMgr.getString("plinko.login_fail");
        break;
    }
    if (msg !== "") {
      this.noti.active = true;
    }
  }

  private responseDisconnect(cmdId: any, data: Uint8Array) {
    let res = new PlinkoCmd.PlinkoReceivedOutGame();
    res.unpackData(data);

    this.backToLobby();
  }

  private responseJoinGame(cmdId: any, data: Uint8Array) {
    let res = new PlinkoCmd.PlinkoReceivedJoinGame();
    res.unpackData(data);

    this.goldAmount = res.gold;
    this.usernameLbl.getComponent(cc.Label).string = res.displayName;
    this.setAvatar(res.avatar);
    this.username = res.displayName;
    this.updateLabelMoney();
    this.createRow(this.rowNum);
    this.edtInputBetAmount.string = PlinkoCommon.numberWithCommas(
      this.betAmount
    ).toString();
    this.edtInputMultiDrop.string = "1";
  }

  private responseResult(cmdId: any, data: Uint8Array) {
    let todayTime = new Date().toLocaleTimeString();
    let todayDate = new Date().toLocaleDateString();
    let res = new PlinkoCmd.PlinkoReceiveBetResult();
    res.unpackData(data);
    this.betResult = res.betResults;

    for (let i = 0; i < this.betResult.length; i++) {
      let testIndex = this.arrayTestTemp[this.rowNum][this.riskLevel].indexOf(
        this.betResult[i].goal
      );
      this.betResult[i].date = todayDate;
      this.betResult[i].time = todayTime;
      this.scheduleOnce(
        () => this.findGoalPosOnReceivedBetResult(this.betResult[i]),
        i / 10
      );
    }
    this.disableToggleBtns();
  }

  protected onEnable(): void {
    PlinkoConnector.instance.connect();
  }

  protected onDisable(): void {
    PlinkoConnector.instance.disconnect();
  }

  updateCreateLimit() {
    if (this.edtInputMultiDrop.string.trim().length > 0) {
      if (Number(this.edtInputMultiDrop.string) < 0) {
        this.massCreateLimit = 1;
        this.edtInputMultiDrop.string = "1";
      } else if (Number(this.edtInputMultiDrop.string) > this.rowNum) {
        this.massCreateLimit = this.rowNum;
        this.edtInputMultiDrop.string = this.massCreateLimit.toString();
      } else {
        this.massCreateLimit = Number(this.edtInputMultiDrop.string);
      }
    }

    if (Number(this.massCreateLimit) > 1) {
      this.allAtOnce = true;
    } else {
      this.allAtOnce = false;
    }
  }

  quickUpdateCreateLimit(event, idx) {
    this.massCreateLimit += Number(idx);

    if (this.massCreateLimit >= this.rowNum) {
      this.massCreateLimit = this.rowNum;
    }
    if (this.massCreateLimit < 1) {
      this.massCreateLimit = 1;
    }
    this.edtInputMultiDrop.string = this.massCreateLimit.toString();
  }

  setMaxDrop() {
    this.massCreateLimit = Number(this.rowNum);
    this.edtInputMultiDrop.string = this.rowNum.toString();
    this.updateCreateLimit();
  }

  toggleQuickDrop() {
    this.quickDrop = !this.quickDrop;
  }
  toggleRowMenu() {
    this.rowMenu.active = true;
  }

  private setRowNum(event: Event, idx) {
    this.rowNum = idx;
    this.createRow(idx);
    if (this.massCreateLimit > this.rowNum) {
      this.setMaxDrop();
    }
  }
  private setRiskLevel(event: Event, idx) {
    this.riskLevel = idx;
    this.createRow(this.rowNum);
  }

  clearGoal() {
    this.goalPositions = [];
  }

  createRow(data: number) {
    this.ballPool.removeAllChildren(true);
    let temp = data;

    this.rowPool.removeAllChildren(true);
    let itemScale = this.objectSize[this.rowNum].itemScale;
    this.rowScale = itemScale;
    this.ballScale = itemScale;
    let goalSpacing = this.objectSize[this.rowNum].goalSpacing;
    this.spacingGoal = goalSpacing;
    let blockSpacing = this.objectSize[this.rowNum].blockSpacing;
    let arr = this.arrayTestTemp[this.rowNum][this.riskLevel];

    for (let i = 0; i < temp; i++) {
      let item = cc.instantiate(this.rowPrefab);
      if (i == temp - 1) {
        item
          .getComponent(PlinkoBlock)
          .initLastLineItem(
            i,
            this.rowNum,
            arr,
            blockSpacing,
            this.arrayFallChance[this.rowNum],
            itemScale
          );
      } else {
        item.getComponent(PlinkoBlock).initItem(i, blockSpacing);
      }
      item.setScale(itemScale, itemScale);
      item.setPosition(0, 0 - goalSpacing * i);
      item.name = item.name + i.toString();
      this.rowPool.addChild(item);
    }
  }

  createBall(array, idx, array2) {
    PlinkoMusicCtrler.instance.playType(PLINKO_SOUND_TYPE.START_DROP);
    this.goldAmount -= this.betAmount;
    this.updateLabelMoney();
    let item = cc.instantiate(this.ball);
    this.ballPool.addChild(item);
    this.clearGoal();
    let randomX = 0;
    let randomY = 0;
    item.setPosition(randomX, randomY);
    item.getComponent(PlinkoBall).initBall(array, idx, array2, randomX);
    item.setScale(this.ballScale, this.ballScale);
    item.active = true;
  }

  findGoalPosOnReceivedBetResult(idx) {
    let tempHolder = [];
    let tempIndex = [];
    let index = this.rowNum - 1;
    for (let j = 0; j < this.rowPool.children[index].children.length; j++) {
      if (
        this.rowPool.children[index].children[
          j
        ].children[2].children[0].getComponent(cc.Label).string == idx.goal
      ) {
        var tempPlaceholder = this.rowPool.children[index].children[
          j
        ].children[2].convertToWorldSpaceAR(new cc.Vec2(0, 0));
        tempHolder.push(tempPlaceholder);
        tempIndex.push(j);
      }
    }

    this.goalPositions.push(tempHolder);
    this.createBall(this.goalPositions, idx, tempIndex);
  }

  updateLabelMoney() {
    this.totalMoneyAvailable.string = PlinkoCommon.convert2Label(
      this.goldAmount
    );
  }

  sendBet() {
    this.betBtn.getComponent(cc.Button).interactable = false;
    this.scheduleOnce(
      () => (this.betBtn.getComponent(cc.Button).interactable = true),
      0.8
    );
    PlinkoCmd.Send.sendPlinkoBet(
      Number(this.riskLevel),
      Number(this.rowNum),
      Number(this.betAmount),
      Number(this.massCreateLimit),
      this.allAtOnce
    );
    this.dropNumLbl.string = this.autoDropNum.toString();
  }

  public updateBetLevel() {
    if (this.edtInputBetAmount.string.trim().length > 0) {
      this.betAmount = Number(this.edtInputBetAmount.string);
      this.edtInputBetAmount.string = PlinkoCommon.numberWithCommas(
        this.betAmount
      ).toString();
      this.betLvLbl.string = "Bet amount:  " + this.betAmount.toString();
    }
  }
  quickChangeBetLv(event: Event, idx) {
    this.betIndex += Number(idx);

    if (this.betIndex < 0) {
      this.betIndex = 0;
    } else if (this.betIndex >= 4) {
      this.betIndex = 4;
    }
    this.betAmount = this.betAmountArray[this.betIndex];
    this.edtInputBetAmount.string = PlinkoCommon.numberWithCommas(
      this.betAmountArray[this.betIndex]
    ).toString();
    this.betLvLbl.string =
      "Bet amount:  " + this.betAmountArray[this.betIndex].toString();
  }
  quickChangeAutoDropNum(event: Event, idx) {
    this.autoDropNum += Number(idx);

    if (this.autoDropNum < 0) {
      this.autoDropNum = 0;
    }
    this.edtInputChatAutoDrop.string = this.autoDropNum.toString();
  }
  quickChangeMaxBetLv() {
    this.betIndex = 4;
    this.betAmount = this.maxBet;
    this.edtInputBetAmount.string = PlinkoCommon.numberWithCommas(
      this.betAmount
    ).toString();
    this.betLvLbl.string = "Bet amount:  " + this.betAmount.toString();
  }
  quickChangeMinBetLv() {
    this.betIndex = 0;
    this.betAmount = this.minBet;
    this.edtInputBetAmount.string = PlinkoCommon.numberWithCommas(
      this.betAmount
    ).toString();
    this.betLvLbl.string = "Bet amount:  " + this.betAmount.toString();
  }
  public updateAutoDropNum() {
    if (this.edtInputChatAutoDrop.string.trim().length > 0) {
      this.autoDropNum = Number(this.edtInputChatAutoDrop.string);
      this.edtInputChatAutoDrop.string = this.autoDropNum.toString();
    }
  }

  public onKeyUp(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.enter:
        this.updateBetLevel();
        this.updateAutoDropNum();
        break;
    }
  }

  public setAutoDrop() {
    if (this.isAuto == false) {
      if (this.autoDropNum > 0) {
        this.isAuto = true;
        this.dropNumLbl.string = this.autoDropNum.toString();
        this.dropNumLbl.node.active = true;
        this.autoBetBtn.children[0].getComponent(cc.Sprite).spriteFrame =
          this.betBtnNodeSprite[1];
        this.autoBetBtn.children[0].children[0].getComponent(
          cc.Sprite
        ).spriteFrame = this.betBtnLbl[1];
        this.countDown();
        this.schedule(this.countDown, 4);
      }
    } else if (this.isAuto == true) {
      this.resetCountDown();
    }
  }

  private countDown(): void {
    this.autoDropNum--;
    if (this.autoDropNum >= 0) {
      this.sendBet();
    } else {
      this.resetCountDown();
    }
  }

  private resetCountDown(): void {
    this.unschedule(this.countDown);
    this.dropNumLbl.string = " ";
    this.edtInputChatAutoDrop.string = "1";
    this.autoBetBtn.children[0].getComponent(cc.Sprite).spriteFrame =
      this.betBtnNodeSprite[0];
    this.autoBetBtn.children[0].children[0].getComponent(
      cc.Sprite
    ).spriteFrame = this.betBtnLbl[0];
    this.dropNumLbl.node.active = false;
    this.isAuto = false;
    this.autoDropNum = 1;
  }

  renderPlinkoHistoryNumber() {
    this.winBar.node.stopAllActions();
    this.plinkoHistoryContent.removeAllChildren(true);
    let length = this.betHistory.length;
    let winFinal = 0;
    for (let i = 0; i < length; i++) {
      let item = cc.instantiate(this.plinkoDetailedHistoryPrefab);
      item
        .getComponent(PlinkoDetailedHistory)
        .initHistoryDetails(this.betHistory[i]);
      this.plinkoHistoryContent.addChild(item);
      if (i === 0) {
        winFinal = this.betHistory[0].goal;
      }
    }
    this.winBar.node.active = true;
    this.winBar.animation = "animation";
    this.winBarLbl.string = "Win " + winFinal.toString() + "x";
    this.winScheduler = cc
      .tween(this.winBar.node)
      .to(0.1, { scaleX: 1.4 })
      .delay(3)
      .to(0.1, { scaleX: 0 })
      .start();
  }

  toggleManualMode() {
    if (this.betMode == 1) {
      this.resetCountDown();
      this.betMode = 0;
      cc.tween(this.dropModeMask).to(0.1, { height: 128 }).start();
      cc.tween(this.dropMenu).by(0.15, { y: -60 }).start();
      this.autoBetBtn.active = false;
      this.betBtn.active = true;
    }
  }
  toggleAutoMode() {
    if (this.betMode == 0) {
      this.betMode = 1;
      cc.tween(this.dropModeMask).to(0.3, { height: 200 }).start();
      cc.tween(this.dropMenu).by(0.15, { y: 60 }).start();
      this.autoBetBtn.active = true;
      this.betBtn.active = false;
      this.autoDropNum = 1;
      this.dropNumLbl.string = "1";
      this.edtInputChatAutoDrop.string = "1";
    }
  }

  public showDetailedHistory(event: Event, idx) {
    let item = cc.instantiate(this.plinkoDetailedHistoryPrefab);
    item
      .getComponent(PlinkoDetailedHistory)
      .initHistoryDetails(this.betHistory[idx]);
    this.node.addChild(item);
  }

  private onClickExit() {
    PlinkoCmd.Send.sendPlinkoExitGame(this.username);
  }

  disableToggleBtns() {
    for (let i = 0; i < this.toggleSelectRowNum.children.length; i++) {
      this.toggleSelectRowNum.children[i].getComponent(cc.Toggle).interactable =
        false;
    }
    for (let j = 0; j < this.toggleSelectRisk.children.length; j++) {
      this.toggleSelectRisk.children[j].getComponent(cc.Toggle).interactable =
        false;
    }
    this.editBetDrop.getComponent(cc.EditBox).enabled = false;
    this.edtInputChatAutoDrop.getComponent(cc.EditBox).enabled = false;
    for (let l = 0; l < this.interactableBtns.length; l++) {
      this.interactableBtns[l].getComponent(cc.Button).interactable = false;
    }
  }

  enableToggleBtns() {
    for (let i = 0; i < this.toggleSelectRowNum.children.length; i++) {
      this.toggleSelectRowNum.children[i].getComponent(cc.Toggle).interactable =
        true;
    }
    for (let j = 0; j < this.toggleSelectRisk.children.length; j++) {
      this.toggleSelectRisk.children[j].getComponent(cc.Toggle).interactable =
        true;
    }
    this.editBetDrop.getComponent(cc.EditBox).enabled = true;
    this.edtInputChatAutoDrop.getComponent(cc.EditBox).enabled = true;
    for (let l = 0; l < this.interactableBtns.length; l++) {
      this.interactableBtns[l].getComponent(cc.Button).interactable = true;
    }
  }

  updateOffline() {
    if (!this._isGameActive) {
      if (cc.sys.isBrowser) {
        cc.director.mainLoop();
      }
    }
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
    } else {
      cc.game.resume();
    }
  }

  _onHideGame() {
    this._isGameActive = false;
    if (cc.sys.isNative && cc.sys.isMobile) {
      this.hideTime = performance.now();
    } else {
      cc.game.pause();
    }
  }

  public setAvatar(link: string) {
    let defaultAva = this.defaultAvatars;
    switch (link) {
      case "":
        this.spAvatar.getComponent(cc.Sprite).spriteFrame = defaultAva;
        this.spAvatar.parent.getChildByName("BG").active = true;
        break;

      default:
        cc.assetManager.loadRemote(link, (err, texture) => {
          if (err) {
            this.spAvatar.getComponent(cc.Sprite).spriteFrame = defaultAva;
            this.spAvatar.parent.getChildByName("BG").active = true;
            return;
          }

          if (texture instanceof cc.Texture2D) {
            let spTemp = new cc.SpriteFrame(texture);
            this.spAvatar.getComponent(cc.Sprite).spriteFrame = spTemp;
            this.spAvatar.parent.getChildByName("BG").active = false;
          } else {
            this.spAvatar.getComponent(cc.Sprite).spriteFrame = defaultAva;
            this.spAvatar.parent.getChildByName("BG").active = true;
            return;
          }
        });
        break;
    }
  }

  scrollHistoryDown() {
    this.currentScroll -= this.stepScroll;

    if (this.currentScroll < 0) {
      this.currentScroll = 0;
    }
    this.plinkoHistoryView.scrollToPercentVertical(this.currentScroll, 0.3);
  }

  scrollHistoryUp() {
    this.currentScroll += this.stepScroll;
    if (this.currentScroll > 1) {
      this.currentScroll = 1;
    }
    this.plinkoHistoryView.scrollToPercentVertical(this.currentScroll, 0.3);
  }
  fakeRun() {
    cc.game;
    let data = {
      curentMoney: 858787916,
      date: "7/12/2023",
      goal: this.arrayTestTemp[this.rowNum][this.riskLevel][7],
      moneyBet: 1000,
      payout: 1100,
      time: "17:31:26",
    };
    this.findGoalPosOnReceivedBetResult(data);
  }

  changeScreenOrientation() {
    let widthFrame = cc.view.getFrameSize().width;
    let heightFrame = cc.view.getFrameSize().height;
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.testNode.active = false;

    if (widthFrame / heightFrame > 1680 / 1080) {
      // LANDSCAPE ORIENTATION;
      this.plinkoHistory.active = true;
      this.ballPool.setPosition(425, 470.294);
      this.nameTitle.setScale(1);
      this.ballPool.setScale(1);
      this.testNode.setScale(1);
      this.rowNumMenu.setScale(1);
      this.betBtns.setScale(1);
      this.updateBtns.setScale(1);

      this.betBtns.getComponent(cc.Widget).isAlignHorizontalCenter = false;
      this.updateBtns.getComponent(cc.Widget).isAlignHorizontalCenter = false;
      this.playerInfo.getComponent(cc.Widget).isAlignHorizontalCenter = false;
      this.testNode.getComponent(cc.Widget).isAlignHorizontalCenter = false;

      this.updateBtns.getComponent(cc.Widget).isAlignLeft = true;
      this.betBtns.getComponent(cc.Widget).isAlignLeft = true;
      this.testNode.getComponent(cc.Widget).isAlignRight = true;
      this.playerInfo.getComponent(cc.Widget).isAlignLeft = true;

      this.testNode.getComponent(cc.Widget).right = 232.36;
      this.testNode.getComponent(cc.Widget).top = 100;
      this.betBtns.getComponent(cc.Widget).left = 341.85;
      this.updateBtns.getComponent(cc.Widget).left = 430.82;
      this.updateBtns.getComponent(cc.Widget).bottom = 337.76;
      this.playerInfo.getComponent(cc.Widget).left = 462.29;
      this.ballPool.getComponent(cc.Widget).right = 271.1;
      this.rowNumMenu.getComponent(cc.Widget).right = 136.76;
    } else if (widthFrame / heightFrame <= 1680 / 1080) {
      // PORTRAIT ORIENTATION;

      this.plinkoHistory.active = false;
      this.ballPool.setPosition(0, 420);
      this.nameTitle.setScale(0.6);
      this.ballPool.setScale(0.8);
      this.rowNumMenu.setScale(0.7);
      this.testNode.setScale(0.6);
      this.betBtns.setScale(0.7);
      this.updateBtns.setScale(0.7);
      this.betBtns.getComponent(cc.Widget).isAlignHorizontalCenter = true;
      this.updateBtns.getComponent(cc.Widget).isAlignHorizontalCenter = true;
      this.playerInfo.getComponent(cc.Widget).isAlignHorizontalCenter = true;
      this.testNode.getComponent(cc.Widget).isAlignHorizontalCenter = true;
      this.updateBtns.getComponent(cc.Widget).isAlignLeft = false;
      this.betBtns.getComponent(cc.Widget).isAlignLeft = false;
      this.testNode.getComponent(cc.Widget).isAlignRight = false;
      this.playerInfo.getComponent(cc.Widget).isAlignLeft = false;

      this.betBtns.getComponent(cc.Widget).left = 230;
      this.updateBtns.getComponent(cc.Widget).left = 300;
      this.updateBtns.getComponent(cc.Widget).bottom = 307.76;
      this.playerInfo.getComponent(cc.Widget).left = 350.29;
      this.testNode.getComponent(cc.Widget).right = 120;
      this.testNode.getComponent(cc.Widget).top = 100;
      this.ballPool.getComponent(cc.Widget).right = 278.1;
      this.rowNumMenu.getComponent(cc.Widget).right = 30;
    }
    this.testNode.active = true;
    this.rowPool.children.forEach((nCell) => {
      nCell.children.forEach((nRow) => {
        nRow.getChildByName("Block").setPosition(0, -24);
        nRow.getChildByName("Block").position.y = -24;
      });
    });
  }

  protected update(dt: number): void {
    this.rowPool.children.forEach((nCell) => {
      nCell.children.forEach((nRow) => {
        nRow.getChildByName("Block").setPosition(0, -24);
        nRow.getChildByName("Goal").setPosition(3.347, -75);
        nRow.getChildByName("Goal").angle = 0;
        nRow.getChildByName("Block").position.y = -24;
      });
    });
  }
}
