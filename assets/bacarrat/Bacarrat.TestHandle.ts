import Bacarrat_Chip from "./src/Bacarrat.Chip";
import { Bacarrat_Const, IDataPlayer } from "./src/Bacarrat.Const";
import Bacarrat_GameManager from "./src/Bacarrat.GameManager";
import Bacarrat_Player from "./src/Bacarrat.Player";
import Bacarrat_CMD from "./src/network/Bacarrat.Cmd";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bacarrat_TestHandle extends cc.Component {

    userData: BGUI.IUserInfo = {
        sessionKey: "",
        nickname: "harry7",
        facebookId: "",
        vinTotal: 1,
        xuTotal: 1,
        vippoint: 1,
        vippointSave: 1,
        createTime: "",
        IP: "",
        reference: "",
        avatar: "",
        certificate: "",
        birthday: "",
        luckyRotate: 1,
        sessionKeyId: 1,
        accessToken: "",
        username: "",
        identification: "",
        email: "",
        mobile: "",
        mobileSecurity: "",
        emailSecurity: "",
        appSecurity: "",
        loginSecure: "",
        moneyLoginOtp: "",
        moneyUse: "",
        safe: "",
        configGame: "",
        userID: 1,
        game: "",
    };

    _listPlayersFake: Array<IDataPlayer> = [{ "nickName": "harry7", "avatar": "10", "currentMoney": 9508000 }, { "nickName": "harry7", "avatar": "10", "currentMoney": 9508000 }];

    onLoad() {
        BGUI.UserManager.instance.mainUserInfo = this.userData;

        BGUI.ZLog.log("BGUI.UserManager.instance.mainUserInfo -----> ", BGUI.UserManager.instance.mainUserInfo);
        BGUI.ZLog.log("BGUI.UserManager.instance.mainUserInfo -----> ", BGUI.UserManager.instance.mainUserInfo.nickname);
    }

    private onTestGetGameInfo(res: Bacarrat_CMD.ReceivedGetInfoGame) {
        Bacarrat_GameManager.instance.onGetGameInfo("test", res);
    }

    private onTestUserJoinRoom(res: Bacarrat_CMD.ReceivedNewUserJoin | any) {
        Bacarrat_GameManager.instance.onNewUserJoin("test", res);
    }
    private onTestUserLeaveRoom(res: Bacarrat_CMD.ReceivedLeaveRoom) {
        Bacarrat_GameManager.instance.onUserLeaveRoom("test", res);
    }

    private onTestStartGame(res: Bacarrat_CMD.ReceivedStartGame) {
        Bacarrat_GameManager.instance.onStartGame("test", res);
    }

    private onTestDealCard(res: Bacarrat_CMD.ReceivedDealCard) {
        Bacarrat_GameManager.instance.onStartDealCard("test", res);
    }

    private onTestContinueDealCard(res: Bacarrat_CMD.ReceivedContinueDealCard) {
        Bacarrat_GameManager.instance.onCotinueDealCard("test", res);
    }

    private onTestInfoPlayerBet(res: Bacarrat_CMD.ReceivedInfoPlayerBet) {
        BGUI.ZLog.log('onTestInfoPlayerBet ---> ', res)
        Bacarrat_GameManager.instance.onInfoPlayerBet("test", res);
    }

    private onTestEndGame(res: Bacarrat_CMD.ReceivedEndGame) {
        BGUI.ZLog.log("onTestEndGame -------------=>  ", res);
        Bacarrat_GameManager.instance.onEndGame("test", res);
    }

    private onTestChat(res: Bacarrat_CMD.ReceivedChatRoom) {
        Bacarrat_GameManager.instance.onChatRoom("test", res);
    }



    onClicked(button, data) {
        BGUI.ZLog.log("Bacarrat_TestHandle -----> ", data);

        switch (parseInt(data)) {
            case Bacarrat_CMD.Code.GET_GAME_INFO:

                //{ "_controllerId": 1, "_cmdId": 3005, "_error": 0, "currentTime": 12, "stateGame": 0, "listChipPot": [0, 0, 0, 0, 0, 0], "chipPotSize": 6, "cardPlayers": [], "cardPlayerSize": 0, "cardBankers": [], "cardBankerSize": 0, "listWinPot": [], "winPotSize": 0, "playerSize": 5, "listPlayers": [{ "nickName": "bot_Bacarat_1_5", "avatar": "10", "currentMoney": 9508000 }, { "nickName": "bot_Bacarat_1_8", "avatar": "0", "currentMoney": 10079500 }, { "nickName": "bot_Bacarat_1_65", "avatar": "4", "currentMoney": 10000000 }, { "nickName": "bot_Bacarat_1_9", "avatar": "10", "currentMoney": 20000 }, { "nickName": "harry7", "avatar": "10", "currentMoney": 1855578992 }], "seasionId": 12163 }

                let dataGetGameInfo: Bacarrat_CMD.ReceivedGetInfoGame = new Bacarrat_CMD.ReceivedGetInfoGame();
                dataGetGameInfo.currentTime = 10;
                dataGetGameInfo.stateGame = 4;
                dataGetGameInfo.listChipPot = [0, 0, 0, 0, 0, 0];
                dataGetGameInfo.cardPlayers = [25, 33, 26];
                dataGetGameInfo.cardBankers = [50, 20, 22];
                dataGetGameInfo.listWinPot = [];
                dataGetGameInfo.listPlayers = this._listPlayersFake;
                dataGetGameInfo.seasionId = 12163;
                this.onTestGetGameInfo(dataGetGameInfo);
                break;

            case Bacarrat_CMD.Code.USER_EXIT:

                // let dataUserExit: Bacarrat_CMD.ReceivedLeaveRoom = new Bacarrat_CMD.ReceivedLeaveRoom();
                // dataUserExit.nickName = "bot_Bacarat_1_65";
                // this.onTestUserLeaveRoom(dataUserExit);

                let dataLeaveRoom: Bacarrat_CMD.ReceivedLeaveRoom = new Bacarrat_CMD.ReceivedLeaveRoom();
                let idxOut = BGUI.Utils.randomInt(1, Bacarrat_GameManager.instance.playerManager._listDataPlayer.length - 1);
                let dataOut = Bacarrat_GameManager.instance.playerManager._listDataPlayer[idxOut];
                BGUI.ZLog.log('dataOut ----> ', dataOut)
                Bacarrat_GameManager.instance.playerManager.leaveRoom(dataOut);
                break;

            case Bacarrat_CMD.Code.NEW_USER_JOIN_ROOM:
                // let dataNewPlayerFake = { "_controllerId": 1, "_cmdId": 3006, "_error": 0, "nickName": "bot_Bacarat_1_75", "avatar": "2", "currentMoney": 10000000, "playerStatus": 1 }
                // Bacarrat_GameManager.instance.playerManager.addPlayer(dataNewPlayerFake)

                let dataUserJoinRoom: IDataPlayer = {
                    nickName: "user_test_" + BGUI.Utils.randomInt(10000, 1000000000),
                    avatar: BGUI.Utils.randomInt(1, 10).toString(),
                    currentMoney: BGUI.Utils.randomInt(10000, 1000000000)
                };


                // this.
                this.onTestUserJoinRoom(dataUserJoinRoom);
                break;

            case Bacarrat_CMD.Code.START_GAME:
                // let dataStartGame = { "_controllerId": 1, "_cmdId": 3001, "_error": 0, "currentTime": 17, "cardBankers": [45, 35], "cardPlayers": [26, 43] }
                let dataStartGame: Bacarrat_CMD.ReceivedStartGame = new Bacarrat_CMD.ReceivedStartGame();
                dataStartGame.currentTime = 17;
                this.onTestStartGame(dataStartGame);
                break;

            case Bacarrat_CMD.Code.DEAL_CARD:
                //_controllerId":1,"_cmdId":3001,"_error":0,"currentTime":17,"cardBankers":[9,8],"cardPlayers":[44,24]}
                let dataDealCard: Bacarrat_CMD.ReceivedDealCard = new Bacarrat_CMD.ReceivedDealCard();
                dataDealCard.currentTime = 17;
                dataDealCard.cardBankers = [9, 8];
                dataDealCard.cardPlayers = [44, 24]
                this.onTestDealCard(dataDealCard);
                break;

            case Bacarrat_CMD.Code.CONTINUE_DEALCARD:
                //,"_controllerId":1,"_cmdId":3011,"_error":0,"time":7,"state":3,"cardId":48}
                let dataContinueDealCard: Bacarrat_CMD.ReceivedContinueDealCard = new Bacarrat_CMD.ReceivedContinueDealCard();
                dataContinueDealCard.currentTime = 17;
                dataContinueDealCard.cardId = 1;
                dataContinueDealCard.state = 2;
                this.onTestContinueDealCard(dataContinueDealCard);
                break;

            case Bacarrat_CMD.Code.INFO_PLAYER_BET:
                // let dataInfoBet = { "_controllerId": 1, "_cmdId": 3000, "_error": 0, "typePot": 3, "betChip": 1000, "playerBet": "bot_Bacarat_1_81" };

                let dataInfoPlayerBet: Bacarrat_CMD.ReceivedInfoPlayerBet = new Bacarrat_CMD.ReceivedInfoPlayerBet();
                dataInfoPlayerBet.typePot = BGUI.Utils.randomInt(0, Object.keys(Bacarrat_Const.TAG_POT).length - 1); //cửa đặt
                let idxChipBet = BGUI.Utils.randomInt(0, Bacarrat_Const.CHIP_AMOUNT.length - 1);
                dataInfoPlayerBet.betChip = Bacarrat_Const.CHIP_AMOUNT[idxChipBet];
                let idxPlayer = BGUI.Utils.randomInt(0, Bacarrat_GameManager.instance.playerManager._listDataPlayer.length - 1);
                dataInfoPlayerBet.nickName = Bacarrat_GameManager.instance.playerManager._listDataPlayer[idxPlayer].nickName;
                this.onTestInfoPlayerBet(dataInfoPlayerBet);

                break;

            case 9999001:
                Bacarrat_GameManager.instance.clockCountDownTime.startCountDown(3);
                break;

            case 9999002:
                Bacarrat_GameManager.instance.onRebetClicked();
                break;
            case 999901:
                Bacarrat_GameManager.instance.onBetX2Clicked();
                break;

            case Bacarrat_CMD.Code.LEAVE_ROOM:

                break;

            case 30010:
                Bacarrat_GameManager.instance.cardManager.dealCardPlayer1();
                break;

            case 30011:
                Bacarrat_GameManager.instance.cardManager.dealCardBanker1();
                break;

            case 30012:
                Bacarrat_GameManager.instance.cardManager.dealCardPlayer2();
                break;

            case 30013:
                Bacarrat_GameManager.instance.cardManager.dealCardBanker2();
                break;

            case 40010:
                Bacarrat_GameManager.instance.cardManager.showCardNotAnim(1, true);
                Bacarrat_GameManager.instance.cardManager.openShowCardPlayer1(null, false);
                break;

            case 40011:
                Bacarrat_GameManager.instance.cardManager.openShowCardBanker1();
                break;

            case 40012:
                Bacarrat_GameManager.instance.cardManager.openShowCardPlayer2();
                break;

            case 40013:
                Bacarrat_GameManager.instance.cardManager.openShowCardBanker2();
                break;
            case 5555:
                let dataChat: Bacarrat_CMD.ReceivedChatRoom = new Bacarrat_CMD.ReceivedChatRoom();
                dataChat.nickname = 'harry7'
                dataChat.isIcon = true
                dataChat.content = "6"
                this.onTestChat(dataChat)
                break;
            case 55555:
                let dataChatText: Bacarrat_CMD.ReceivedChatRoom = new Bacarrat_CMD.ReceivedChatRoom();
                dataChatText.nickname = 'harry7'
                dataChatText.isIcon = false
                dataChatText.content = "Hello world"
                this.onTestChat(dataChatText)
                break;


            // case 999:
            //     let rdPotBet = BGUI.Utils.randomInt(0, Object.keys(Bacarrat_Const.TAG_POT).length - 1);
            //     //BGUI.ZLog.log('Bacarrat_TestHandle idPot--> ', rdPotBet);
            //     Bacarrat_GameManager.instance.potOnTableManager.showLightBet(rdPotBet);

            //     let idColumOfPot = BGUI.Utils.randomInt(0, Bacarrat_GameManager.instance.chipManager.lsPosBet[rdPotBet].length - 1);
            //     let chipIdx = BGUI.Utils.randomInt(0, Bacarrat_Const.CHIP_AMOUNT.length - 1);
            //     let rdSlotIdx = (BGUI.Utils.randomInt(0, Bacarrat_GameManager.instance.playerManager.listPlayer.length - 1));
            //     // let rdSlotIdx = 0;
            //     let posFrom = Bacarrat_GameManager.instance.playerManager.listPlayer[rdSlotIdx].node.getPosition();
            //     let posTo = Bacarrat_GameManager.instance.chipManager.lsPosBet[rdPotBet][idColumOfPot].clone();
            //     posTo.y += 4 * Bacarrat_GameManager.instance.chipManager.arrBet[rdPotBet][idColumOfPot].length

            //     Bacarrat_GameManager.instance.chipManager.totalBet[rdPotBet][idColumOfPot] += Bacarrat_Const.CHIP_AMOUNT[chipIdx]
            //     Bacarrat_GameManager.instance.chipManager.moveToPotBet(rdSlotIdx, chipIdx, rdPotBet, idColumOfPot, posFrom, posTo);

            //     let totalGoldFromPot = Bacarrat_GameManager.instance.chipManager.getTotalBetAllUser(rdPotBet)
            //     // BGUI.ZLog.log("totalGoldFromPot--->" , totalGoldFromPot);
            //     let mySlotIdx = 0;
            //     let totalMyBetByPot = Bacarrat_GameManager.instance.chipManager.getTotalBetBySlotIdx(mySlotIdx, rdPotBet)



            //     Bacarrat_GameManager.instance.potOnTableManager.showTotalBet(rdPotBet, totalGoldFromPot);

            //     Bacarrat_GameManager.instance.potOnTableManager.showMyBet(rdPotBet, totalMyBetByPot);

            //     break;

            case Bacarrat_CMD.Code.END_GAME:
                //"_controllerId":1,"_cmdId":3010,"_error":0,"time":5,"history":{"currrentTime":"29-31-2023","roomId":1,"playerResult":"TWO_CO SIX_RO ","bankerResult":"EIGHT_RO JACK_CO ","betValue":"0,0,0,1000,0,0","prize":"0.0,0.0,0.0,0.0,0.0,0.0","listWinType":[2],"listPlayer":[26,43],"listBanker":[45,35],"bankerPoint":8,"playerPoint":8},"winTypes":[2],"listPlayers":[{"nickName":"harry8","moneyExchange":0,"currentMoney":1855578792},{"nickName":"bot_Bacarat_1_75","moneyExchange":0,"currentMoney":10000000},{"nickName":"bot_Bacarat_1_81","moneyExchange":0,"currentMoney":9999000}]}
                //lấy ra tất cả các chip thua
                let dataEndGame: Bacarrat_CMD.ReceivedEndGame = new Bacarrat_CMD.ReceivedEndGame();
                dataEndGame.currentTime = 5;
                dataEndGame.winTypes = [2];
                dataEndGame.listPlayers = Bacarrat_GameManager.instance.playerManager._listDataPlayer;
                dataEndGame.history = [];
                this.onTestEndGame(dataEndGame)
                break;
        }
    }
}