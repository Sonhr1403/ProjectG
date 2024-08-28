import { DragonTiger_Const, IDataPlayer } from "./src/DragonTiger.Const";
import DragonTiger_GameManager from "./src/DragonTiger.GameManager";
import DragonTiger_CMD from "./src/network/DragonTiger.Cmd";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonTiger_TestHandle extends cc.Component {

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

    _listPlayersFake = [{ "uid": 9478, "nickName": "harry1", "currentMoney": 1855426492, "isBot": 0, "avatar": "" }, { "uid": 0, "nickName": "bot_dragon_tiger_1", "currentMoney": 820784536845, "isBot": 1, "avatar": "" }, { "uid": 0, "nickName": "bot_dragon_tiger_2", "currentMoney": 820900891734, "isBot": 1, "avatar": "" }, { "uid": 9500, "nickName": "shantestv2", "currentMoney": 1854697080, "isBot": 0, "avatar": "" }, { "uid": 9482, "nickName": "harry5", "currentMoney": 1846230592, "isBot": 0, "avatar": "" }, { "uid": 9480, "nickName": "harry3", "currentMoney": 2000151572, "isBot": 0, "avatar": "" }, { "uid": 9479, "nickName": "harry2", "currentMoney": 1855578692, "isBot": 0, "avatar": "" }, { "uid": 9481, "nickName": "harry4", "currentMoney": 1855578392, "isBot": 0, "avatar": "" }]

    onLoad() {
        BGUI.UserManager.instance.mainUserInfo = this.userData;

        BGUI.ZLog.log("BGUI.UserManager.instance.mainUserInfo -----> ", BGUI.UserManager.instance.mainUserInfo);
        BGUI.ZLog.log("BGUI.UserManager.instance.mainUserInfo -----> ", BGUI.UserManager.instance.mainUserInfo.nickname);
    }

    private onTestGetGameInfo(res: DragonTiger_CMD.ReceivedGameInfo) {
        DragonTiger_GameManager.instance.DRAGON_TIGER_GAME_INFO("test", res);
    }

    // private onTestUserJoinRoom(res:  DragonTiger_CMD.ReceivedNewUserJoin | any) {
    //      DragonTiger_GameManager.instance.onNewUserJoin("test", res);
    // }
    // private onTestUserLeaveRoom(res:  DragonTiger_CMD.ReceivedLeaveRoom) {
    //      DragonTiger_GameManager.instance.onUserLeaveRoom("test", res);
    // }

    // private onTestStartGame(res: DragonTiger_CMD.ReceivedUpdateResultCards) {
    //     DragonTiger_GameManager.instance.DRAGON_TIGER_UPDATE_CARDS("test", res);
    // }

    // private onTestDealCard(res:  DragonTiger_CMD.ReceivedDealCard) {
    //      DragonTiger_GameManager.instance.onStartDealCard("test", res);
    // }

    // private onTestContinueDealCard(res:  DragonTiger_CMD.ReceivedContinueDealCard) {
    //      DragonTiger_GameManager.instance.onCotinueDealCard("test", res);
    // }

    private onTestInfoPlayerBet(res: DragonTiger_CMD.ReceivedResponseBet) {
        BGUI.ZLog.log('onTestInfoPlayerBet ---> ', res)
        DragonTiger_GameManager.instance.DRAGON_TIGER_BET("test", res);
    }

    // private onTestEndGame(res:  DragonTiger_CMD.ReceivedEndGame) {
    //     BGUI.ZLog.log("onTestEndGame -------------=>  ", res);
    //      DragonTiger_GameManager.instance.onEndGame("test", res);
    // }

    // private onTestChat(res:  DragonTiger_CMD.ReceivedChatRoom) {
    //      DragonTiger_GameManager.instance.onChatRoom("test", res);
    // }



    onClicked(button, data) {
        BGUI.ZLog.log(" DragonTiger_TestHandle -----> ", data);

        // switch (parseInt(data)) {
        //     case DragonTiger_CMD.Code.DRAGON_TIGER_INFO:

        //         let dataGetGameInfo: DragonTiger_CMD.ReceivedGameInfo = new DragonTiger_CMD.ReceivedGameInfo();

        //         // "bets":[110000,0,110000,110000,10000],"betDetails":["[{\"userId\":0,\"username\":\"bot_dragon_tiger_2\",\"betValue\":100000,\"betSide\":0,\"inputTime\":0,\"isBot\":true,\"bot\":true},{\"userId\":0,\"username\":\"bot_dragon_tiger_1\",\"betValue\":10000,\"betSide\":0,\"inputTime\":0,\"isBot\":true,\"bot\":true}]","[]","[{\"userId\":0,\"username\":\"bot_dragon_tiger_2\",\"betValue\":10000,\"betSide\":3,\"inputTime\":0,\"isBot\":true,\"bot\":true},{\"userId\":0,\"username\":\"bot_dragon_tiger_1\",\"betValue\":100000,\"betSide\":3,\"inputTime\":0,\"isBot\":true,\"bot\":true}]","[{\"userId\":0,\"username\":\"bot_dragon_tiger_1\",\"betValue\":100000,\"betSide\":4,\"inputTime\":0,\"isBot\":true,\"bot\":true},{\"userId\":0,\"username\":\"bot_dragon_tiger_1\",\"betValue\":10000,\"betSide\":4,\"inputTime\":0,\"isBot\":true,\"bot\":true}]","[{\"userId\":0,\"username\":\"bot_dragon_tiger_1\",\"betValue\":10000,\"betSide\":5,\"inputTime\":0,\"isBot\":true,\"bot\":true}]"],"listCardDragon":[0,17,36],"listCardTiger":[29,50],"gameId":43,"moneyType":1,"referenceId":87059,"remainTime":16,"bettingState":true,"currentMoney":1855426492,"result":1,"playerSize":8,"listPlayers":[{"uid":9478,"nickName":"harry1","currentMoney":1855426492,"isBot":0,"avatar":""},{"uid":0,"nickName":"bot_dragon_tiger_1","currentMoney":820784536845,"isBot":1,"avatar":""},{"uid":0,"nickName":"bot_dragon_tiger_2","currentMoney":820900891734,"isBot":1,"avatar":""},{"uid":9500,"nickName":"shantestv2","currentMoney":1854697080,"isBot":0,"avatar":""},{"uid":9482,"nickName":"harry5","currentMoney":1846230592,"isBot":0,"avatar":""},{"uid":9480,"nickName":"harry3","currentMoney":2000151572,"isBot":0,"avatar":""},{"uid":9479,"nickName":"harry2","currentMoney":1855578692,"isBot":0,"avatar":""},{"uid":9481,"nickName":"harry4","currentMoney":1855578392,"isBot":0,"avatar":""}]

        //         dataGetGameInfo.remainTime = 10;
        //         dataGetGameInfo.bettingState = true;
        //         // dataGetGameInfo.betDetails = ["[{\"userId\":0,\"username\":\"bot_dragon_tiger_2\",\"betValue\":100000,\"betSide\":0,\"inputTime\":0,\"isBot\":true,\"bot\":true},{\"userId\":0,\"username\":\"bot_dragon_tiger_1\",\"betValue\":10000,\"betSide\":0,\"inputTime\":0,\"isBot\":true,\"bot\":true}]", "[]", "[{\"userId\":0,\"username\":\"bot_dragon_tiger_2\",\"betValue\":10000,\"betSide\":3,\"inputTime\":0,\"isBot\":true,\"bot\":true},{\"userId\":0,\"username\":\"bot_dragon_tiger_1\",\"betValue\":100000,\"betSide\":3,\"inputTime\":0,\"isBot\":true,\"bot\":true}]", "[{\"userId\":0,\"username\":\"bot_dragon_tiger_1\",\"betValue\":100000,\"betSide\":4,\"inputTime\":0,\"isBot\":true,\"bot\":true},{\"userId\":0,\"username\":\"bot_dragon_tiger_1\",\"betValue\":10000,\"betSide\":4,\"inputTime\":0,\"isBot\":true,\"bot\":true}]", "[{\"userId\":0,\"username\":\"bot_dragon_tiger_1\",\"betValue\":10000,\"betSide\":5,\"inputTime\":0,\"isBot\":true,\"bot\":true}]"]
        //         dataGetGameInfo.listCardDragon = [];
        //         dataGetGameInfo.listCardTiger = [];
        //         dataGetGameInfo.bets = [110000, 0, 110000, 110000, 10000];
        //         dataGetGameInfo.listPlayers = [{ "uid": 9478, "nickName": "harry1", "currentMoney": 1855426492, "isBot": 0, "avatar": "" }, { "uid": 0, "nickName": "bot_dragon_tiger_1", "currentMoney": 820784536845, "isBot": 1, "avatar": "" }, { "uid": 0, "nickName": "bot_dragon_tiger_2", "currentMoney": 820900891734, "isBot": 1, "avatar": "" }, { "uid": 9500, "nickName": "shantestv2", "currentMoney": 1854697080, "isBot": 0, "avatar": "" }, { "uid": 9482, "nickName": "harry5", "currentMoney": 1846230592, "isBot": 0, "avatar": "" }, { "uid": 9480, "nickName": "harry3", "currentMoney": 2000151572, "isBot": 0, "avatar": "" }, { "uid": 9479, "nickName": "harry2", "currentMoney": 1855578692, "isBot": 0, "avatar": "" }, { "uid": 94813, "nickName": "harry4", "currentMoney": 1855578392, "isBot": 0, "avatar": "" }, { "uid": 94831, "nickName": "harry10", "currentMoney": 1855578392, "isBot": 0, "avatar": "" }]
        //         this.onTestGetGameInfo(dataGetGameInfo);
        //         break;
        //     case DragonTiger_CMD.Code.DRAGON_TIGER_DEAL_CARDS:
        //         // {"_pos":26,"_data":{"0":1,"1":8,"2":65,"3":0,"4":0,"5":1,"6":0,"7":2,"8":0,"9":0,"10":0,"11":12,"12":0,"13":0,"14":0,"15":35,"16":0,"17":2,"18":0,"19":0,"20":0,"21":47,"22":0,"23":0,"24":0,"25":14},"_length":26,"_controllerId":1,"_cmdId":2113,"_error":0,"listCardDragon":[12,35],"listCardTiger":[47,14],"result":1}
        //         let dataDeal: DragonTiger_CMD.ReceivedDealCard = new DragonTiger_CMD.ReceivedDealCard();
        //         dataDeal.listCardDragon = [12, 35];
        //         dataDeal.listCardTiger = [47, 14, 3]
        //         this.onTestStartGame(dataDeal);
        //         break;
        //     case 21131:
        //         DragonTiger_GameManager.instance.cardManager.continueDealCard()
        //         break;
        //     case DragonTiger_CMD.Code.DRAGON_TIGER_BET:

        //         // DRAGON_TIGER_BET =  {"_pos":62,"_data":{"0":1,"1":8,"2":62,"3":0,"4":0,"5":0,"6":0,"7":0,"8":110,"9":11,"10":58,"11":88,"12":0,"13":1,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":3,"21":232,"22":0,"23":0,"24":0,"25":0,"26":0,"27":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0,"36":3,"37":232,"38":0,"39":0,"40":0,"41":0,"42":0,"43":0,"44":0,"45":0,"46":0,"47":0,"48":0,"49":0,"50":0,"51":0,"52":0,"53":0,"54":0,"55":0,"56":0,"57":0,"58":0,"59":0,"60":0,"61":0},"_length":62,"_controllerId":1,"_cmdId":2110,"_error":0,"myBets":[0,1000,0,0,0],"currentMoney":1846229592,"betSide":1,"betValue":1000}
        //         let arrS = [0, 1, 3, 4, 5]

        //         let dataInfoPlayerBet: DragonTiger_CMD.ReceivedResponseBet = new DragonTiger_CMD.ReceivedResponseBet();
        //         dataInfoPlayerBet.betSide = arrS[BGUI.Utils.randomInt(0, arrS.length - 1)]; //cửa đặt

        //         let idxChipBet = BGUI.Utils.randomInt(0, DragonTiger_Const.CHIP_AMOUNT.length - 1);
        //         dataInfoPlayerBet.betValue = DragonTiger_Const.CHIP_AMOUNT[idxChipBet];
        //         this.onTestInfoPlayerBet(dataInfoPlayerBet);
        //         break;
        //     case DragonTiger_CMD.Code.DRAGON_TIGER_END_GAME:
        //         DragonTiger_GameManager.instance.DRAGON_TIGER_END_GAME(0,'')
        //         // "listPlayers":[{"uid":0,"nickName":"bot_dragon_tiger_1","currentMoney":200427003501,"arrPrize":[0,1000000,-1,2000000,-1,0]},{"uid":0,"nickName":"bot_dragon_tiger_2","currentMoney":200454696731,"arrPrize":[-1,-1,-1,2000000,-1,-1]},{"uid":0,"nickName":"harry4","currentMoney":1855553392,"arrPrize":[-1,-1,-1,-1,-1,-1]},{"uid":0,"nickName":"harry2","currentMoney":1855574692,"arrPrize":[-1,-1,-1,-1,-1,-1]},{"uid":0,"nickName":"shantestv2","currentMoney":1855584992,"arrPrize":[-1,-1,-1,-1,-1,-1]},{"uid":0,"nickName":"harry5","currentMoney":1855576192,"arrPrize":[-1,-1,-1,-1,-1,-1]},{"uid":0,"nickName":"harry8","currentMoney":1855582592,"arrPrize":[-1,-1,-1,-1,-1,-1]}],"arrMoneyReturn":[1000,1000,-1,1000,1000,1000],"winPot":[1,3]}
        //         break;
        //     case 5000:
        //         DragonTiger_GameManager.instance.moveChipToDealer()
        //         break;
        //     case 5001:
        //         DragonTiger_GameManager.instance.moveChipToPotWin()
        //         break;
        //     case 5002:
        //         DragonTiger_GameManager.instance.moveChipToPlayer()
        //         break;
        //     case 5003:
        //         let arr = ["[{\"userId\":0,\"username\":\"bot_dragon_tiger_2\",\"betValue\":100000,\"betSide\":0,\"inputTime\":0,\"isBot\":true,\"bot\":true},{\"userId\":0,\"username\":\"bot_dragon_tiger_1\",\"betValue\":10000,\"betSide\":0,\"inputTime\":0,\"isBot\":true,\"bot\":true}]", "[]", "[{\"userId\":0,\"username\":\"bot_dragon_tiger_2\",\"betValue\":10000,\"betSide\":3,\"inputTime\":0,\"isBot\":true,\"bot\":true},{\"userId\":0,\"username\":\"bot_dragon_tiger_1\",\"betValue\":100000,\"betSide\":3,\"inputTime\":0,\"isBot\":true,\"bot\":true}]", "[{\"userId\":0,\"username\":\"bot_dragon_tiger_1\",\"betValue\":100000,\"betSide\":4,\"inputTime\":0,\"isBot\":true,\"bot\":true},{\"userId\":0,\"username\":\"bot_dragon_tiger_1\",\"betValue\":10000,\"betSide\":4,\"inputTime\":0,\"isBot\":true,\"bot\":true}]", "[{\"userId\":0,\"username\":\"bot_dragon_tiger_1\",\"betValue\":10000,\"betSide\":5,\"inputTime\":0,\"isBot\":true,\"bot\":true}]"]
        //         DragonTiger_GameManager.instance.chipManager.chipReconnect(arr)
        //         break;
        //     // case 6000:
        //     //     DragonTiger_GameManager.instance.cardManager.dealerCardDragon()
        //     //     break;
        //     // case 6001:
        //     //     DragonTiger_GameManager.instance.cardManager.dealCardDragon3()
        //     //     break;
        //     // case 6003:
        //     //     DragonTiger_GameManager.instance.cardManager.dealCardTiger3()
        //     //     break;
        //     // case 6004:
        //     //     DragonTiger_GameManager.instance.cardManager.openShowCard()
        //     //     break;
        //     case 6005:
        //         let arrWWin = [0, 3]
        //         DragonTiger_GameManager.instance.potOnTableManager.showLightWin(arrWWin)
        //         break;
        // }
    }
}