
import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import { Bacarrat_Const } from "./Bacarrat.Const";
import Bacarrat_GameManager from "./Bacarrat.GameManager";
import { SOUNDTYPE } from "./Bacarrat.SoundManager";
import Bacarrat_CMD from "./network/Bacarrat.Cmd";
import { Bacarrat_Connector } from "./network/Bacarrat.Connector";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bacarrat_SoiCauExtend extends cc.Component {

    @property(cc.Node)
    dishRoad: cc.Node = null

    @property(cc.Node)
    bigRoad: cc.Node = null

    @property(cc.Node)
    thongKe: cc.Node = null

    @property(cc.Node)
    scoreRoad: cc.Node = null

    @property(cc.Node)
    bigEyeRoad: cc.Node = null

    @property(cc.Node)
    smallRoad: cc.Node = null

    @property(cc.Node)
    cockRoach: cc.Node = null

    @property(cc.PageView)
    allPage: cc.PageView = null;

    @property(cc.SpriteFrame)
    bgDishBoard: cc.SpriteFrame[] = []

    @property(cc.SpriteFrame)
    bgBigRoad: cc.SpriteFrame[] = []

    @property(cc.SpriteFrame)
    bgScoreRoad: cc.SpriteFrame[] = []

    @property(cc.SpriteFrame)
    bgCockRoad: cc.SpriteFrame[] = []

    @property(cc.Color)
    listColor: cc.Color[] = []

    @property(cc.Button)
    btn_pre: cc.Button = null
    @property(cc.Button)
    btn_next: cc.Button = null

    listCauNew = []
    listDataBigRoad = []
    listDataScore = []

    listDataBigEye = []
    listDataSmall = []
    listDataCock = []

    lastType = 0
    isFirst = true

    private _data = null;
    // private _data = JSON.parse(JSON.stringify([
    //     // { "currrentTime": "2023-07-24 13:51:44", "roomId": 1, "playerResult": "TWO_BICH EIGHT_CO ACE_TEP ", "bankerResult": "EIGHT_TEP FOUR_TEP TEN_RO ", "betValue": "35673000,83616000,96016000,54832000,17078000,105137000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [13, 6, 51], "listBanker": [45, 41, 34], "bankerPoint": 2, "playerPoint": 1 },
    //     // { "currrentTime": "2023-07-24 13:50:43", "roomId": 1, "playerResult": "QUEEN_CO JACK_CO THREE_BICH ", "bankerResult": "SEVEN_RO QUEEN_RO ", "betValue": "91461000,113520000,116108000,65731000,77066000,120365000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [10, 9, 14], "listBanker": [31, 36], "bankerPoint": 7, "playerPoint": 3 },
    //     // { "currrentTime": "2023-07-24 13:49:49", "roomId": 1, "playerResult": "ACE_TEP TEN_TEP SEVEN_RO ", "bankerResult": "TWO_BICH NINE_TEP FOUR_TEP ", "betValue": "21770000,72813000,111566000,52222000,98305000,10570000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [51, 47, 31], "listBanker": [13, 46, 41], "bankerPoint": 5, "playerPoint": 8 },
    //     // { "currrentTime": "2023-07-24 13:48:48", "roomId": 1, "playerResult": "EIGHT_RO ACE_CO ", "bankerResult": "NINE_BICH SEVEN_BICH ", "betValue": "6568000,81115000,16676000,90156000,61271000,160007000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [32, 12], "listBanker": [20, 18], "bankerPoint": 6, "playerPoint": 9 },
    //     // { "currrentTime": "2023-07-24 13:48:01", "roomId": 1, "playerResult": "NINE_CO EIGHT_TEP ", "bankerResult": "KING_BICH TEN_TEP SIX_BICH ", "betValue": "73770000,75016000,21036000,6725000,70927000,36277000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [7, 45], "listBanker": [24, 47, 17], "bankerPoint": 6, "playerPoint": 7 },
    //     // { "currrentTime": "2023-07-24 13:47:07", "roomId": 1, "playerResult": "KING_RO TWO_RO EIGHT_BICH ", "bankerResult": "NINE_RO JACK_CO ", "betValue": "72566000,116474000,120525000,71680000,103317000,31756000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [37, 26, 19], "listBanker": [33, 9], "bankerPoint": 9, "playerPoint": 0 },
    //     // { "currrentTime": "2023-07-24 13:46:13", "roomId": 1, "playerResult": "FIVE_TEP TWO_BICH ", "bankerResult": "TEN_TEP FOUR_RO ", "betValue": "12716000,65571000,3512000,21986000,7600000,13232000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [42, 13], "listBanker": [47, 28], "bankerPoint": 4, "playerPoint": 7 },
    //     // { "currrentTime": "2023-07-24 13:45:26", "roomId": 1, "playerResult": "SIX_BICH SEVEN_TEP ACE_RO ", "bankerResult": "TWO_RO TEN_BICH THREE_BICH ", "betValue": "7681000,116036000,66072000,31671000,112768000,177657000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [17, 44, 38], "listBanker": [26, 21, 14], "bankerPoint": 5, "playerPoint": 4 },
    //     // { "currrentTime": "2023-07-24 13:44:25", "roomId": 1, "playerResult": "THREE_TEP TWO_RO THREE_RO ", "bankerResult": "EIGHT_BICH JACK_RO ", "betValue": "45057000,18865000,21028000,31660000,81881000,20631000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [2, 3], "listPlayer": [40, 26, 27], "listBanker": [19, 35], "bankerPoint": 8, "playerPoint": 8 },
    //     // { "currrentTime": "2023-07-24 13:43:31", "roomId": 1, "playerResult": "FIVE_BICH KING_CO JACK_RO ", "bankerResult": "ACE_BICH JACK_TEP TEN_RO ", "betValue": "27008000,70574000,56646000,60626000,60342000,117261000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [16, 11, 35], "listBanker": [25, 48, 34], "bankerPoint": 1, "playerPoint": 5 },
    //     // { "currrentTime": "2023-07-24 13:42:30", "roomId": 1, "playerResult": "FIVE_RO NINE_BICH FOUR_BICH ", "bankerResult": "TWO_BICH ACE_BICH EIGHT_CO ", "betValue": "141267000,8029000,16148000,7176000,106762000,12260000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [29, 20, 15], "listBanker": [13, 25, 6], "bankerPoint": 1, "playerPoint": 8 },
    //     // { "currrentTime": "2023-07-24 13:41:29", "roomId": 1, "playerResult": "KING_BICH EIGHT_TEP ", "bankerResult": "JACK_TEP TEN_BICH NINE_RO ", "betValue": "1906000,115907000,1121000,60887000,67131000,185212000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [24, 45], "listBanker": [48, 21, 33], "bankerPoint": 9, "playerPoint": 8 },
    //     // { "currrentTime": "2023-07-24 13:40:35", "roomId": 1, "playerResult": "ACE_RO FIVE_RO ", "bankerResult": "FOUR_CO TEN_RO ", "betValue": "17126000,37761000,56117000,77019000,114681000,10038000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [38, 29], "listBanker": [2, 34], "bankerPoint": 4, "playerPoint": 6 },
    //     // { "currrentTime": "2023-07-24 13:39:48", "roomId": 1, "playerResult": "FOUR_RO EIGHT_RO SIX_CO ", "bankerResult": "EIGHT_TEP SEVEN_BICH SIX_TEP ", "betValue": "13111000,66080000,132672000,18176000,7163000,772000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [28, 32, 4], "listBanker": [45, 18, 43], "bankerPoint": 1, "playerPoint": 8 },
    //     // { "currrentTime": "2023-07-24 13:38:47", "roomId": 1, "playerResult": "NINE_CO SEVEN_RO ", "bankerResult": "NINE_RO TWO_CO QUEEN_TEP ", "betValue": "35771000,172221000,85116000,31157000,162105000,27251000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [7, 31], "listBanker": [33, 0, 49], "bankerPoint": 1, "playerPoint": 6 },
    //     // { "currrentTime": "2023-07-24 13:37:53", "roomId": 1, "playerResult": "SEVEN_BICH KING_CO ", "bankerResult": "NINE_BICH TEN_CO ", "betValue": "90258000,12687000,106821000,61546000,162259000,22013000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [18, 11], "listBanker": [20, 8], "bankerPoint": 9, "playerPoint": 7 },
    //     // { "currrentTime": "2023-07-24 13:37:06", "roomId": 1, "playerResult": "NINE_BICH SEVEN_RO ", "bankerResult": "QUEEN_BICH NINE_TEP ", "betValue": "12271000,12271000,129068000,21062000,63162000,19676000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [20, 31], "listBanker": [23, 46], "bankerPoint": 9, "playerPoint": 6 },
    //     // { "currrentTime": "2023-07-24 13:36:19", "roomId": 1, "playerResult": "TWO_TEP EIGHT_CO FOUR_BICH ", "bankerResult": "QUEEN_BICH QUEEN_RO ACE_RO ", "betValue": "126110000,61241000,168103000,31651000,81558000,72458000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0, 4], "listPlayer": [39, 6, 15], "listBanker": [23, 36, 38], "bankerPoint": 1, "playerPoint": 4 },
    //     // { "currrentTime": "2023-07-24 13:35:18", "roomId": 1, "playerResult": "EIGHT_BICH SIX_BICH TEN_TEP ", "bankerResult": "JACK_CO SEVEN_RO ", "betValue": "101275000,58322000,7705000,31627000,123175000,13125000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [19, 17, 47], "listBanker": [9, 31], "bankerPoint": 7, "playerPoint": 4 },
    //     // { "currrentTime": "2023-07-24 13:34:24", "roomId": 1, "playerResult": "EIGHT_CO NINE_TEP ", "bankerResult": "THREE_RO FIVE_TEP ", "betValue": "15617000,60613000,106836000,65247000,25237000,207121000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [6, 46], "listBanker": [27, 42], "bankerPoint": 8, "playerPoint": 7 },
    //     // { "currrentTime": "2023-07-24 13:33:37", "roomId": 1, "playerResult": "THREE_CO THREE_RO ", "bankerResult": "SIX_BICH QUEEN_BICH ", "betValue": "111322000,71246000,68326000,51165000,62191000,35062000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [2, 3], "listPlayer": [1, 27], "listBanker": [17, 23], "bankerPoint": 6, "playerPoint": 6 },
    //     // { "currrentTime": "2023-07-24 13:32:50", "roomId": 1, "playerResult": "NINE_BICH THREE_RO SEVEN_CO ", "bankerResult": "QUEEN_TEP ACE_CO TWO_RO ", "betValue": "2866000,50612000,63567000,123260000,57775000,122811000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [20, 27, 5], "listBanker": [49, 12, 26], "bankerPoint": 3, "playerPoint": 9 },
    //     // { "currrentTime": "2023-07-24 13:31:49", "roomId": 1, "playerResult": "TEN_CO NINE_CO ", "bankerResult": "NINE_TEP JACK_BICH ", "betValue": "122212000,81170000,65926000,74060000,101532000,51155000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [2], "listPlayer": [8, 7], "listBanker": [46, 22], "bankerPoint": 9, "playerPoint": 9 },
    //     // { "currrentTime": "2023-07-24 13:31:02", "roomId": 1, "playerResult": "TWO_BICH SIX_BICH ", "bankerResult": "TWO_TEP JACK_CO SEVEN_CO ", "betValue": "58076000,45691000,1815000,63126000,81201000,66662000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [13, 17], "listBanker": [39, 9, 5], "bankerPoint": 9, "playerPoint": 8 },
    //     // { "currrentTime": "2023-07-24 13:30:08", "roomId": 1, "playerResult": "QUEEN_RO SIX_CO ", "bankerResult": "THREE_BICH NINE_BICH FIVE_CO ", "betValue": "52218000,61192000,108161000,110015000,66694000,73131000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [36, 4], "listBanker": [14, 20, 3], "bankerPoint": 7, "playerPoint": 6 },
    //     { "currrentTime": "2023-07-24 13:29:14", "roomId": 1, "playerResult": "SIX_RO TWO_BICH ", "bankerResult": "SIX_BICH THREE_TEP ", "betValue": "12280000,12011000,112525000,181220000,200276000,81852000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [30, 13], "listBanker": [17, 40], "bankerPoint": 9, "playerPoint": 8 },
    //     { "currrentTime": "2023-07-24 13:28:27", "roomId": 1, "playerResult": "SEVEN_CO EIGHT_RO SIX_CO ", "bankerResult": "KING_TEP NINE_BICH ", "betValue": "14260000,23116000,70300000,56921000,106236000,31861000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [5, 32, 4], "listBanker": [50, 20], "bankerPoint": 9, "playerPoint": 1 },
    //     { "currrentTime": "2023-07-24 13:27:33", "roomId": 1, "playerResult": "ACE_CO KING_CO EIGHT_RO ", "bankerResult": "FOUR_TEP THREE_BICH ", "betValue": "62761000,56721000,75801000,15866000,52352000,54581000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [12, 11, 32], "listBanker": [41, 14], "bankerPoint": 7, "playerPoint": 9 },
    //     { "currrentTime": "2023-07-24 13:26:39", "roomId": 1, "playerResult": "NINE_TEP EIGHT_RO ", "bankerResult": "NINE_CO FIVE_CO ", "betValue": "25885000,124664000,5701000,41845000,51011000,33552000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [46, 32], "listBanker": [7, 3], "bankerPoint": 4, "playerPoint": 7 },
    //     { "currrentTime": "2023-07-24 13:25:52", "roomId": 1, "playerResult": "ACE_CO NINE_TEP SIX_CO ", "bankerResult": "FIVE_BICH QUEEN_BICH TWO_BICH ", "betValue": "71811000,71100000,80182000,55365000,36726000,7308000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [12, 46, 4], "listBanker": [16, 23, 13], "bankerPoint": 7, "playerPoint": 6 },
    //     { "currrentTime": "2023-07-24 13:24:51", "roomId": 1, "playerResult": "QUEEN_CO TWO_CO SEVEN_TEP ", "bankerResult": "TWO_RO ACE_BICH KING_TEP ", "betValue": "12226000,61015000,25650000,74768000,52267000,218931000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [10, 0, 44], "listBanker": [26, 25, 50], "bankerPoint": 3, "playerPoint": 9 },
    //     { "currrentTime": "2023-07-24 13:23:50", "roomId": 1, "playerResult": "QUEEN_RO TWO_RO JACK_TEP ", "bankerResult": "SIX_BICH TWO_BICH ", "betValue": "51185000,17030000,58164000,57227000,3817000,17701000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [36, 26, 48], "listBanker": [17, 13], "bankerPoint": 8, "playerPoint": 2 },
    //     { "currrentTime": "2023-07-24 13:22:56", "roomId": 1, "playerResult": "KING_TEP TWO_TEP FOUR_BICH ", "bankerResult": "FIVE_RO TEN_CO SIX_BICH ", "betValue": "13071000,5252000,110788000,37607000,12227000,18056000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [50, 39, 15], "listBanker": [29, 8, 17], "bankerPoint": 1, "playerPoint": 6 },
    //     { "currrentTime": "2023-07-24 13:21:55", "roomId": 1, "playerResult": "NINE_RO KING_TEP ", "bankerResult": "EIGHT_TEP TWO_BICH KING_RO ", "betValue": "77256000,8282000,116671000,105765000,77218000,6306000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [33, 50], "listBanker": [45, 13, 37], "bankerPoint": 0, "playerPoint": 9 },
    //     { "currrentTime": "2023-07-24 13:21:01", "roomId": 1, "playerResult": "KING_CO THREE_CO SEVEN_BICH ", "bankerResult": "EIGHT_CO FIVE_RO TWO_BICH ", "betValue": "68058000,139513000,113017000,169022000,55506000,3283000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [11, 1, 18], "listBanker": [6, 29, 13], "bankerPoint": 5, "playerPoint": 0 },
    //     { "currrentTime": "2023-07-24 13:20:00", "roomId": 1, "playerResult": "NINE_TEP FOUR_BICH JACK_RO ", "bankerResult": "FIVE_BICH SEVEN_BICH QUEEN_TEP ", "betValue": "17724000,111085000,17955000,17423000,3811000,89172000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [46, 15, 35], "listBanker": [16, 18, 49], "bankerPoint": 2, "playerPoint": 3 },
    //     { "currrentTime": "2023-07-24 13:18:59", "roomId": 1, "playerResult": "JACK_CO QUEEN_RO THREE_CO ", "bankerResult": "NINE_CO JACK_RO ", "betValue": "61252000,6317000,217957000,62911000,77712000,61137000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [9, 36, 1], "listBanker": [7, 35], "bankerPoint": 9, "playerPoint": 3 },
    //     { "currrentTime": "2023-07-24 13:18:05", "roomId": 1, "playerResult": "FIVE_BICH FOUR_BICH ", "bankerResult": "JACK_TEP EIGHT_TEP ", "betValue": "116001000,121641000,76755000,90587000,61519000,112520000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [16, 15], "listBanker": [48, 45], "bankerPoint": 8, "playerPoint": 9 },
    //     { "currrentTime": "2023-07-24 13:17:18", "roomId": 1, "playerResult": "THREE_TEP FOUR_RO ", "bankerResult": "THREE_BICH TEN_RO ", "betValue": "61540000,116224000,117145000,12323000,131072000,71936000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [40, 28], "listBanker": [14, 34], "bankerPoint": 3, "playerPoint": 7 },
    //     { "currrentTime": "2023-07-24 13:16:31", "roomId": 1, "playerResult": "SIX_BICH SEVEN_TEP TEN_RO ", "bankerResult": "FIVE_RO KING_CO ", "betValue": "173576000,36062000,79050000,26577000,70148000,125876000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [17, 44, 34], "listBanker": [29, 11], "bankerPoint": 5, "playerPoint": 3 },
    //     { "currrentTime": "2023-07-24 13:15:37", "roomId": 1, "playerResult": "TWO_TEP ACE_TEP FIVE_RO ", "bankerResult": "JACK_TEP TWO_RO SEVEN_CO ", "betValue": "171132000,69190000,112653000,22719000,116112000,102802000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [39, 51, 29], "listBanker": [48, 26, 5], "bankerPoint": 9, "playerPoint": 8 },
    //     { "currrentTime": "2023-07-24 13:14:36", "roomId": 1, "playerResult": "FIVE_BICH QUEEN_RO ACE_BICH ", "bankerResult": "SEVEN_BICH TWO_CO ", "betValue": "31712000,125507000,20828000,20326000,124363000,113671000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [16, 36, 25], "listBanker": [18, 0], "bankerPoint": 9, "playerPoint": 6 },
    //     { "currrentTime": "2023-07-24 13:13:42", "roomId": 1, "playerResult": "TEN_TEP FIVE_TEP JACK_BICH ", "bankerResult": "NINE_RO SEVEN_RO ", "betValue": "157265000,121266000,115757000,21385000,86043000,78319000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1, 5], "listPlayer": [47, 42, 22], "listBanker": [33, 31], "bankerPoint": 6, "playerPoint": 5 },
    //     { "currrentTime": "2023-07-24 13:12:48", "roomId": 1, "playerResult": "ACE_TEP ACE_RO JACK_TEP ", "bankerResult": "KING_CO FOUR_TEP ", "betValue": "55016000,156111000,62671000,71136000,35659000,177690000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1, 3], "listPlayer": [51, 38, 48], "listBanker": [11, 41], "bankerPoint": 4, "playerPoint": 2 },
    //     { "currrentTime": "2023-07-24 13:11:54", "roomId": 1, "playerResult": "THREE_TEP EIGHT_TEP KING_BICH ", "bankerResult": "QUEEN_RO JACK_CO TWO_TEP ", "betValue": "60621000,62310000,57130000,71263000,26228000,72322000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [40, 45, 24], "listBanker": [36, 9, 39], "bankerPoint": 2, "playerPoint": 1 },
    //     { "currrentTime": "2023-07-24 13:10:53", "roomId": 1, "playerResult": "TWO_RO TWO_CO KING_TEP ", "bankerResult": "THREE_RO TWO_TEP ", "betValue": "6315000,76668000,138617000,62950000,95938000,116870000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1, 3], "listPlayer": [26, 0, 50], "listBanker": [27, 39], "bankerPoint": 5, "playerPoint": 4 },
    //     { "currrentTime": "2023-07-24 13:09:59", "roomId": 1, "playerResult": "TEN_CO KING_RO FOUR_CO ", "bankerResult": "SIX_TEP SEVEN_CO QUEEN_CO ", "betValue": "22691000,62282000,6280000,100912000,42712000,75476000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [8, 37, 2], "listBanker": [43, 5, 10], "bankerPoint": 3, "playerPoint": 4 },
    //     { "currrentTime": "2023-07-24 13:08:58", "roomId": 1, "playerResult": "FIVE_CO QUEEN_TEP TWO_TEP ", "bankerResult": "FOUR_RO FIVE_RO ", "betValue": "1174000,27306000,70835000,172697000,137163000,51683000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [3, 49, 39], "listBanker": [28, 29], "bankerPoint": 9, "playerPoint": 7 },
    //     { "currrentTime": "2023-07-24 13:08:04", "roomId": 1, "playerResult": "THREE_RO THREE_TEP ", "bankerResult": "FIVE_TEP NINE_CO ", "betValue": "81070000,75173000,53891000,22027000,27776000,112063000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0, 3], "listPlayer": [27, 40], "listBanker": [42, 7], "bankerPoint": 4, "playerPoint": 6 },
    //     { "currrentTime": "2023-07-24 13:07:17", "roomId": 1, "playerResult": "JACK_RO KING_RO NINE_TEP ", "bankerResult": "TWO_TEP EIGHT_RO FOUR_CO ", "betValue": "60547000,61330000,86626000,162141000,7305000,117606000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [35, 37, 46], "listBanker": [39, 32, 2], "bankerPoint": 4, "playerPoint": 9 },
    //     { "currrentTime": "2023-07-24 13:51:44", "roomId": 1, "playerResult": "TWO_BICH EIGHT_CO ACE_TEP ", "bankerResult": "EIGHT_TEP FOUR_TEP TEN_RO ", "betValue": "35673000,83616000,96016000,54832000,17078000,105137000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [13, 6, 51], "listBanker": [45, 41, 34], "bankerPoint": 2, "playerPoint": 1 },
    //     { "currrentTime": "2023-07-24 13:50:43", "roomId": 1, "playerResult": "QUEEN_CO JACK_CO THREE_BICH ", "bankerResult": "SEVEN_RO QUEEN_RO ", "betValue": "91461000,113520000,116108000,65731000,77066000,120365000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [10, 9, 14], "listBanker": [31, 36], "bankerPoint": 7, "playerPoint": 3 },
    //     { "currrentTime": "2023-07-24 13:49:49", "roomId": 1, "playerResult": "ACE_TEP TEN_TEP SEVEN_RO ", "bankerResult": "TWO_BICH NINE_TEP FOUR_TEP ", "betValue": "21770000,72813000,111566000,52222000,98305000,10570000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [51, 47, 31], "listBanker": [13, 46, 41], "bankerPoint": 5, "playerPoint": 8 },
    //     { "currrentTime": "2023-07-24 13:48:48", "roomId": 1, "playerResult": "EIGHT_RO ACE_CO ", "bankerResult": "NINE_BICH SEVEN_BICH ", "betValue": "6568000,81115000,16676000,90156000,61271000,160007000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [32, 12], "listBanker": [20, 18], "bankerPoint": 6, "playerPoint": 9 },
    //     { "currrentTime": "2023-07-24 13:48:01", "roomId": 1, "playerResult": "NINE_CO EIGHT_TEP ", "bankerResult": "KING_BICH TEN_TEP SIX_BICH ", "betValue": "73770000,75016000,21036000,6725000,70927000,36277000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [7, 45], "listBanker": [24, 47, 17], "bankerPoint": 6, "playerPoint": 7 },
    //     { "currrentTime": "2023-07-24 13:47:07", "roomId": 1, "playerResult": "KING_RO TWO_RO EIGHT_BICH ", "bankerResult": "NINE_RO JACK_CO ", "betValue": "72566000,116474000,120525000,71680000,103317000,31756000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [37, 26, 19], "listBanker": [33, 9], "bankerPoint": 9, "playerPoint": 0 },
    //     { "currrentTime": "2023-07-24 13:46:13", "roomId": 1, "playerResult": "FIVE_TEP TWO_BICH ", "bankerResult": "TEN_TEP FOUR_RO ", "betValue": "12716000,65571000,3512000,21986000,7600000,13232000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [42, 13], "listBanker": [47, 28], "bankerPoint": 4, "playerPoint": 7 },
    //     { "currrentTime": "2023-07-24 13:45:26", "roomId": 1, "playerResult": "SIX_BICH SEVEN_TEP ACE_RO ", "bankerResult": "TWO_RO TEN_BICH THREE_BICH ", "betValue": "7681000,116036000,66072000,31671000,112768000,177657000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [17, 44, 38], "listBanker": [26, 21, 14], "bankerPoint": 5, "playerPoint": 4 },
    //     { "currrentTime": "2023-07-24 13:44:25", "roomId": 1, "playerResult": "THREE_TEP TWO_RO THREE_RO ", "bankerResult": "EIGHT_BICH JACK_RO ", "betValue": "45057000,18865000,21028000,31660000,81881000,20631000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [2, 3], "listPlayer": [40, 26, 27], "listBanker": [19, 35], "bankerPoint": 8, "playerPoint": 8 },
    //     { "currrentTime": "2023-07-24 13:43:31", "roomId": 1, "playerResult": "FIVE_BICH KING_CO JACK_RO ", "bankerResult": "ACE_BICH JACK_TEP TEN_RO ", "betValue": "27008000,70574000,56646000,60626000,60342000,117261000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [16, 11, 35], "listBanker": [25, 48, 34], "bankerPoint": 1, "playerPoint": 5 },
    //     { "currrentTime": "2023-07-24 13:42:30", "roomId": 1, "playerResult": "FIVE_RO NINE_BICH FOUR_BICH ", "bankerResult": "TWO_BICH ACE_BICH EIGHT_CO ", "betValue": "141267000,8029000,16148000,7176000,106762000,12260000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [29, 20, 15], "listBanker": [13, 25, 6], "bankerPoint": 1, "playerPoint": 8 },
    //     { "currrentTime": "2023-07-24 13:41:29", "roomId": 1, "playerResult": "KING_BICH EIGHT_TEP ", "bankerResult": "JACK_TEP TEN_BICH NINE_RO ", "betValue": "1906000,115907000,1121000,60887000,67131000,185212000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [24, 45], "listBanker": [48, 21, 33], "bankerPoint": 9, "playerPoint": 8 },
    //     { "currrentTime": "2023-07-24 13:40:35", "roomId": 1, "playerResult": "ACE_RO FIVE_RO ", "bankerResult": "FOUR_CO TEN_RO ", "betValue": "17126000,37761000,56117000,77019000,114681000,10038000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [38, 29], "listBanker": [2, 34], "bankerPoint": 4, "playerPoint": 6 },
    //     { "currrentTime": "2023-07-24 13:39:48", "roomId": 1, "playerResult": "FOUR_RO EIGHT_RO SIX_CO ", "bankerResult": "EIGHT_TEP SEVEN_BICH SIX_TEP ", "betValue": "13111000,66080000,132672000,18176000,7163000,772000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [28, 32, 4], "listBanker": [45, 18, 43], "bankerPoint": 1, "playerPoint": 8 },
    //     { "currrentTime": "2023-07-24 13:38:47", "roomId": 1, "playerResult": "NINE_CO SEVEN_RO ", "bankerResult": "NINE_RO TWO_CO QUEEN_TEP ", "betValue": "35771000,172221000,85116000,31157000,162105000,27251000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [7, 31], "listBanker": [33, 0, 49], "bankerPoint": 1, "playerPoint": 6 },
    //     { "currrentTime": "2023-07-24 13:37:53", "roomId": 1, "playerResult": "SEVEN_BICH KING_CO ", "bankerResult": "NINE_BICH TEN_CO ", "betValue": "90258000,12687000,106821000,61546000,162259000,22013000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [18, 11], "listBanker": [20, 8], "bankerPoint": 9, "playerPoint": 7 },
    //     { "currrentTime": "2023-07-24 13:37:06", "roomId": 1, "playerResult": "NINE_BICH SEVEN_RO ", "bankerResult": "QUEEN_BICH NINE_TEP ", "betValue": "12271000,12271000,129068000,21062000,63162000,19676000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [20, 31], "listBanker": [23, 46], "bankerPoint": 9, "playerPoint": 6 },
    //     { "currrentTime": "2023-07-24 13:36:19", "roomId": 1, "playerResult": "TWO_TEP EIGHT_CO FOUR_BICH ", "bankerResult": "QUEEN_BICH QUEEN_RO ACE_RO ", "betValue": "126110000,61241000,168103000,31651000,81558000,72458000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0, 4], "listPlayer": [39, 6, 15], "listBanker": [23, 36, 38], "bankerPoint": 1, "playerPoint": 4 },
    //     { "currrentTime": "2023-07-24 13:35:18", "roomId": 1, "playerResult": "EIGHT_BICH SIX_BICH TEN_TEP ", "bankerResult": "JACK_CO SEVEN_RO ", "betValue": "101275000,58322000,7705000,31627000,123175000,13125000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [19, 17, 47], "listBanker": [9, 31], "bankerPoint": 7, "playerPoint": 4 },
    //     { "currrentTime": "2023-07-24 13:34:24", "roomId": 1, "playerResult": "EIGHT_CO NINE_TEP ", "bankerResult": "THREE_RO FIVE_TEP ", "betValue": "15617000,60613000,106836000,65247000,25237000,207121000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [6, 46], "listBanker": [27, 42], "bankerPoint": 8, "playerPoint": 7 },
    //     { "currrentTime": "2023-07-24 13:33:37", "roomId": 1, "playerResult": "THREE_CO THREE_RO ", "bankerResult": "SIX_BICH QUEEN_BICH ", "betValue": "111322000,71246000,68326000,51165000,62191000,35062000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [2, 3], "listPlayer": [1, 27], "listBanker": [17, 23], "bankerPoint": 6, "playerPoint": 6 },
    //     { "currrentTime": "2023-07-24 13:32:50", "roomId": 1, "playerResult": "NINE_BICH THREE_RO SEVEN_CO ", "bankerResult": "QUEEN_TEP ACE_CO TWO_RO ", "betValue": "2866000,50612000,63567000,123260000,57775000,122811000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [20, 27, 5], "listBanker": [49, 12, 26], "bankerPoint": 3, "playerPoint": 9 },
    //     { "currrentTime": "2023-07-24 13:31:49", "roomId": 1, "playerResult": "TEN_CO NINE_CO ", "bankerResult": "NINE_TEP JACK_BICH ", "betValue": "122212000,81170000,65926000,74060000,101532000,51155000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [2], "listPlayer": [8, 7], "listBanker": [46, 22], "bankerPoint": 9, "playerPoint": 9 },
    //     { "currrentTime": "2023-07-24 13:31:02", "roomId": 1, "playerResult": "TWO_BICH SIX_BICH ", "bankerResult": "TWO_TEP JACK_CO SEVEN_CO ", "betValue": "58076000,45691000,1815000,63126000,81201000,66662000", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [13, 17], "listBanker": [39, 9, 5], "bankerPoint": 9, "playerPoint": 8 },
    // ]))

    onEnable() {
        this.allPage.node.on('scroll-ended', function () {
            this.setDataForPage2();
        }, this);

        this._sendGetStatitics();
        Bacarrat_Connector.instance.addCmdListener(Bacarrat_CMD.Code.STATITICS, this.setData, this)
    }

    onDisable() {
        Bacarrat_Connector.instance.removeCmdListener(this, Bacarrat_CMD.Code.STATITICS);
    }

    private _sendGetStatitics() {
        let pk = new Bacarrat_CMD.SendRequestHistoryStatitics();
        Bacarrat_Connector.instance.sendPacket(pk)
    }

    setData(cmd, data) {
        let res = new Bacarrat_CMD.ReceivedStatiticsHistory();
        res.unpackData(data);
        BGUI.ZLog.log("onStatitics extends = ", JSON.stringify(res.listHistory));

        this._data = res.listHistory;
        this._data.reverse();

        this.reformatDataBigRoad();
        this.reformatDataCau();
        this.reformatDataScore();
        this.reformatDataBigEye();
        this.reformatDataSmall();
        this.reformatDataCock();

        this.setDataDishRoad();
        this.setDatBigRoad();
        this.setDataStatistical();

        this.isFirst = true;
        this.updateBtn()
    }

    setDataForPage2() {
        if (this.isFirst) {
            this.setScoreRoad();
            this.setBigEyeRoad();
            this.setDataSmallRoad();
            this.setCockRoad();
        }

        this.updateBtn()
        this.isFirst = false;
    }

    reformatDataScore() {
        this.listDataScore = [];
        let rowCau = [];
        let lastType = -1;
        let dataClone = [...this._data];

        for (let i = 0; i < dataClone.length; i++) {
            let dt = { ...dataClone[i] }
            let type = this.getTypeCau(dt.listWinType);
            if (lastType < 0) {
                if (type != Bacarrat_Const.TAG_POT.TIE) {
                    rowCau.push(dt);
                    lastType = type;
                }
            } else {
                if (type === Bacarrat_Const.TAG_POT.TIE) {
                    rowCau.push(dt)
                } else {
                    if (type === lastType) {
                        rowCau.push(dt);
                    } else {
                        this.listDataScore.push(rowCau);
                        rowCau = [];
                        rowCau.push(dt);
                        lastType = type;
                    }
                }
            }
        }

        this.listDataScore.push(rowCau);
    }

    reformatDataBigRoad() {
        this.listDataBigRoad = [];
        let rowCau = [];
        let lastType = -1;
        let dataClone = [...this._data];

        for (let i = 0; i < dataClone.length; i++) {
            let dt = { ...dataClone[i] }
            let type = this.getTypeCau(dt.listWinType);
            if (lastType < 0) {
                if (type != Bacarrat_Const.TAG_POT.TIE) {
                    rowCau.push(dt);
                    lastType = type;
                }
            } else {
                if (type === Bacarrat_Const.TAG_POT.TIE) {
                    let len = rowCau.length;
                    rowCau[len - 1].listWinType = rowCau[len - 1].listWinType.concat(dt.listWinType)
                } else {
                    if (type === lastType) {
                        rowCau.push(dt);
                    } else {
                        this.listDataBigRoad.push(rowCau);
                        rowCau = [];
                        rowCau.push(dt);
                        lastType = type;
                    }
                }
            }
        }

        this.listDataBigRoad.push(rowCau);
    }

    reformatDataCau() {
        this.listCauNew = [];
        let rowCau = [];
        let lastType = -1;
        let dataClone = [...this._data];

        for (let i = 0; i < dataClone.length; i++) {
            let dt = { ...dataClone[i] }
            let type = this.getTypeCau(dt.listWinType);
            if (lastType < 0) {
                if (type != Bacarrat_Const.TAG_POT.TIE) {
                    rowCau.push(dt);
                    lastType = type;
                }
            } else {
                if (type !== Bacarrat_Const.TAG_POT.TIE) {
                    if (type === lastType) {
                        rowCau.push(dt);
                    } else {
                        this.listCauNew.push(rowCau);

                        rowCau = [];
                        rowCau.push(dt);
                        lastType = type;
                    }
                }
            }
        }

        this.listCauNew.push(rowCau);
    }

    reformatDataSmall() {
        this.listDataSmall = []
        let rowCau = [];
        let lastType = -1;

        if (this.listCauNew.length < 3)
            return;

        let st = 2;
        if (this.listCauNew[2].length === 1)
            st = 3

        for (let col = st; col < this.listCauNew.length; col++) {
            let data = this.listCauNew[col];

            let sizRow1 = this.listCauNew[col - 1].length;
            let sizRow2 = this.listCauNew[col - 2].length;
            let sizRow3 = 0;

            if (col >= 3)
                sizRow3 = this.listCauNew[col - 3].length;

            for (let row = 0; row < data.length; row++) {
                if (row === 0 && col !== 2) {
                    if (sizRow1 === sizRow3) {
                        if (lastType === 1) {
                            rowCau.push(1)
                        }
                        else {
                            if (rowCau.length > 0) {
                                this.listDataSmall.push(rowCau)
                            }
                            rowCau = [];
                            rowCau.push(1);
                            lastType = 1;
                        }
                    }
                    else {
                        if (lastType == 0) {
                            rowCau.push(0)
                        }
                        else {
                            if (rowCau.length > 0) {
                                this.listDataSmall.push(rowCau)
                            }
                            rowCau = [];
                            rowCau.push(0);
                            lastType = 0;
                        }
                    }
                    continue;
                }

                if (row < sizRow2) {
                    if (lastType === 1) {
                        rowCau.push(1)
                    }
                    else {
                        if (rowCau.length > 0) {
                            this.listDataSmall.push(rowCau)
                        }
                        rowCau = [];
                        rowCau.push(1);
                        lastType = 1;
                    }
                    continue;
                }

                if (row == sizRow2) {
                    if (lastType == 0) {
                        rowCau.push(0)
                    }
                    else {
                        this.listDataSmall.push(rowCau)
                        rowCau = [];
                        rowCau.push(0);
                        lastType = 0;
                    }
                    continue;
                }

                if (row >= sizRow2 + 1) {
                    if (lastType === 1) {
                        rowCau.push(1)
                    }
                    else {
                        this.listDataSmall.push(rowCau)
                        rowCau = [];
                        rowCau.push(1);
                        lastType = 1;
                    }
                }
            }
        }

        if (rowCau.length > 0) {
            this.listDataSmall.push(rowCau)
        }
    }

    reformatDataBigEye() {
        this.listDataBigEye = []
        let rowCau = [];
        let lastType = -1;

        if (this.listCauNew.length < 2)
            return;

        let st = 1;
        if (this.listCauNew[1].length === 1)
            st = 2

        for (let col = st; col < this.listCauNew.length; col++) {
            let data = this.listCauNew[col];

            let sizRow2 = 0;
            let sizRow1 = this.listCauNew[col - 1].length;
            if (col >= 2)
                sizRow2 = this.listCauNew[col - 2].length;

            for (let row = 0; row < data.length; row++) {
                if (row === 0 && col !== 1) {
                    if (sizRow1 === sizRow2) {
                        if (lastType === 1) {
                            rowCau.push(1)
                        }
                        else {
                            if (rowCau.length > 0) {
                                this.listDataBigEye.push(rowCau)
                            }
                            rowCau = [];
                            rowCau.push(1);
                            lastType = 1;
                        }
                    }
                    else {
                        if (lastType == 0) {
                            rowCau.push(0)
                        }
                        else {
                            if (rowCau.length > 0) {
                                this.listDataBigEye.push(rowCau)
                            }
                            rowCau = [];
                            rowCau.push(0);
                            lastType = 0;
                        }
                    }
                    continue;
                }

                if (row < sizRow1) {
                    if (lastType === 1) {
                        rowCau.push(1)
                    }
                    else {
                        if (rowCau.length > 0) {
                            this.listDataBigEye.push(rowCau)
                        }
                        rowCau = [];
                        rowCau.push(1);
                        lastType = 1;
                    }
                    continue;
                }

                if (row == sizRow1) {
                    if (lastType == 0) {
                        rowCau.push(0)
                    }
                    else {
                        this.listDataBigEye.push(rowCau)
                        rowCau = [];
                        rowCau.push(0);
                        lastType = 0;
                    }
                    continue;
                }

                if (row >= sizRow1 + 1) {
                    if (lastType === 1) {
                        rowCau.push(1)
                    }
                    else {
                        this.listDataBigEye.push(rowCau)
                        rowCau = [];
                        rowCau.push(1);
                        lastType = 1;
                    }
                }
            }
        }

        if (rowCau.length > 0) {
            this.listDataBigEye.push(rowCau)
        }
    }

    reformatDataCock() {
        this.listDataCock = []
        let rowCau = [];
        let lastType = -1;

        if (this.listCauNew.length < 4)
            return;

        let st = 3;
        if (this.listCauNew[3].length === 1)
            st = 4

        for (let col = st; col < this.listCauNew.length; col++) {
            let data = this.listCauNew[col];

            let sizRow1 = this.listCauNew[col - 1].length;
            let sizRow3 = this.listCauNew[col - 3].length;
            let sizRow4 = 0;

            if (col >= 4)
                sizRow4 = this.listCauNew[col - 4].length;

            for (let row = 0; row < data.length; row++) {
                if (row === 0 && col !== 3) {
                    if (sizRow1 === sizRow4) {
                        if (lastType === 1) {
                            rowCau.push(1)
                        }
                        else {
                            if (rowCau.length > 0) {
                                this.listDataCock.push(rowCau)
                            }
                            rowCau = [];
                            rowCau.push(1);
                            lastType = 1;
                        }
                    }
                    else {
                        if (lastType == 0) {
                            rowCau.push(0)
                        }
                        else {
                            if (rowCau.length > 0) {
                                this.listDataCock.push(rowCau)
                            }
                            rowCau = [];
                            rowCau.push(0);
                            lastType = 0;
                        }
                    }
                    continue;
                }

                if (row < sizRow3) {
                    if (lastType === 1) {
                        rowCau.push(1)
                    }
                    else {
                        if (rowCau.length > 0) {
                            this.listDataCock.push(rowCau)
                        }
                        rowCau = [];
                        rowCau.push(1);
                        lastType = 1;
                    }
                    continue;
                }

                if (row == sizRow3) {
                    if (lastType == 0) {
                        rowCau.push(0)
                    }
                    else {
                        this.listDataCock.push(rowCau)
                        rowCau = [];
                        rowCau.push(0);
                        lastType = 0;
                    }
                    continue;
                }

                if (row >= sizRow3 + 1) {
                    if (lastType === 1) {
                        rowCau.push(1)
                    }
                    else {
                        this.listDataCock.push(rowCau)
                        rowCau = [];
                        rowCau.push(1);
                        lastType = 1;
                    }
                }
            }
        }

        if (rowCau.length > 0) {
            this.listDataCock.push(rowCau)
        }
    }

    setDataDishRoad() {
        let total = this._data.length;
        let totalCol = Math.ceil(total / 6);
        let startPos = total - 72;
        if (startPos < 0)
            startPos = 0;

        for (let id = 0; id < this.dishRoad.children.length; id++) {
            let nodeDish = this.dishRoad.children[id];
            if (id < totalCol) {
                if (!nodeDish.active)
                    nodeDish.active = true;

                for (let i = 0; i < nodeDish.children.length; i++) {
                    let nodeCau = nodeDish.children[i];
                    if (!nodeCau.active)
                        nodeCau.active = true;

                    let pos = startPos + id * 6 + i;
                    if (pos < total) {
                        let type = this._data[pos].listWinType;
                        this.setCauDishRoad(type, nodeCau);
                    } else {
                        nodeCau.active = false;
                    }
                }
            }
            else {
                nodeDish.active = false;
            }
        }
    }

    setDatBigRoad() {
        let newData = this.genNewData(this.listDataBigRoad);
        let sizeData = newData.length
        let idStart = sizeData - 29;
        if (idStart < 0)
            idStart = 0;

        for (let col = 0; col < this.bigRoad.children.length; col++) {
            let nodeScore = this.bigRoad.children[col];
            for (let row = 0; row < nodeScore.children.length; row++) {
                let nodeCau = nodeScore.children[row];
                nodeCau.active = false;
            }
        }

        for (let col = idStart; col < sizeData; col++) {
            for (let row = 0; row < newData[col].length; row++) {
                if (newData[col][row] !== null) {
                    let nodeCau = this.bigRoad.children[col - idStart].children[row];
                    nodeCau.active = true;
                    this.setCauBigRoad(newData[col][row].listWinType, nodeCau);

                }
            }
        }
    }

    setDataStatistical() {
        let caiWin = 0;
        let conWin = 0;
        let hoa = 0;
        let caiDoi = 0;
        let conDoi = 0;
        let super6 = 0;
        let total = this._data.length;

        for (let dt of this._data) {
            for (let type of dt.listWinType) {
                if (type == Bacarrat_Const.TAG_POT.BANKER)
                    caiWin++;
                if (type == Bacarrat_Const.TAG_POT.PLAYER)
                    conWin++;
                if (type == Bacarrat_Const.TAG_POT.TIE)
                    hoa++;
                if (type == Bacarrat_Const.TAG_POT.BANKER_PAIR)
                    caiDoi++;
                if (type == Bacarrat_Const.TAG_POT.PLAYER_PAIR)
                    conDoi++;
                if (type == Bacarrat_Const.TAG_POT.SUPER_6)
                    super6++;
            }
        }

        this.thongKe.getChildByName("lb_cai_thang").getComponent(cc.Label).string = caiWin + '';
        this.thongKe.getChildByName("lb_con_thang").getComponent(cc.Label).string = conWin + '';
        this.thongKe.getChildByName("lb_hoa").getComponent(cc.Label).string = hoa + '';
        this.thongKe.getChildByName("lb_super6").getComponent(cc.Label).string = super6 + '';
        this.thongKe.getChildByName("lb_cai_doi").getComponent(cc.Label).string = caiDoi + '';
        this.thongKe.getChildByName("lb_con_doi").getComponent(cc.Label).string = conDoi + '';
        this.thongKe.parent.getChildByName("lb_total").getComponent(cc.Label).string = LanguageMgr.getString('bacarrat.popup.total_game') + total;

        this.thongKe.getChildByName("lb_cai_thang_percent").getComponent(cc.Label).string = Math.round(caiWin / total * 100) + "%";
        this.thongKe.getChildByName("lb_con_thang_percent").getComponent(cc.Label).string = Math.round(conWin / total * 100) + "%";
        this.thongKe.getChildByName("lb_hoa_percent").getComponent(cc.Label).string = Math.round(hoa / total * 100) + "%";
        this.thongKe.getChildByName("lb_super6_percent").getComponent(cc.Label).string = Math.round(super6 / total * 100) + "%";
        this.thongKe.getChildByName("lb_cai_doi_percent").getComponent(cc.Label).string = Math.round(caiDoi / total * 100) + "%";
        this.thongKe.getChildByName("lb_con_doi_percent").getComponent(cc.Label).string = Math.round(conDoi / total * 100) + "%";
    }

    setScoreRoad() {
        let newData = this.genNewData(this.listDataScore);
        let sizeData = newData.length
        let idStart = sizeData - 12;
        if (idStart < 0)
            idStart = 0;

        for (let col = 0; col < this.scoreRoad.children.length; col++) {
            let nodeScore = this.scoreRoad.children[col];
            for (let row = 0; row < nodeScore.children.length; row++) {
                let nodeCau = nodeScore.children[row];
                nodeCau.active = false;
            }
        }

        for (let col = idStart; col < sizeData; col++) {
            for (let row = 0; row < newData[col].length; row++) {
                if (newData[col][row] !== null) {
                    let nodeCau = this.scoreRoad.children[col - idStart].children[row];
                    nodeCau.active = true;
                    this.setCauScore(newData[col][row], nodeCau);

                }
            }
        }
    }

    setBigEyeRoad() {
        let newData = this.genNewData(this.listDataBigEye);
        let sizeData = newData.length
        let idStart = sizeData - 12;
        if (idStart < 0)
            idStart = 0;

        for (let col = 0; col < this.bigEyeRoad.children.length; col++) {
            let nodeScore = this.bigEyeRoad.children[col];
            for (let row = 0; row < nodeScore.children.length; row++) {
                let nodeCau = nodeScore.children[row];
                nodeCau.active = false;
            }
        }

        for (let col = idStart; col < sizeData; col++) {
            for (let row = 0; row < newData[col].length; row++) {
                if (newData[col][row] !== null) {
                    let nodeCau = this.bigEyeRoad.children[col - idStart].children[row];
                    nodeCau.active = true;
                    this.setCauBigEye(newData[col][row], nodeCau);

                }
            }
        }
    }

    setDataSmallRoad() {
        let newData = this.genNewData(this.listDataSmall);
        let sizeData = newData.length
        let idStart = sizeData - 12;
        if (idStart < 0)
            idStart = 0;

        for (let col = 0; col < this.smallRoad.children.length; col++) {
            let nodeScore = this.smallRoad.children[col];
            for (let row = 0; row < nodeScore.children.length; row++) {
                let nodeCau = nodeScore.children[row];
                nodeCau.active = false;
            }
        }

        for (let col = idStart; col < sizeData; col++) {
            for (let row = 0; row < newData[col].length; row++) {
                if (newData[col][row] !== null) {
                    let nodeCau = this.smallRoad.children[col - idStart].children[row];
                    nodeCau.active = true;
                    this.setCauSmall(newData[col][row], nodeCau);

                }
            }
        }
    }

    setCockRoad() {

        let newData = this.genNewData(this.listDataCock);
        let sizeData = newData.length
        let idStart = sizeData - 12;
        if (idStart < 0)
            idStart = 0;

        for (let col = 0; col < this.cockRoach.children.length; col++) {
            let nodeScore = this.cockRoach.children[col];
            for (let row = 0; row < nodeScore.children.length; row++) {
                let nodeCau = nodeScore.children[row];
                nodeCau.active = false;
            }
        }

        for (let col = idStart; col < sizeData; col++) {
            for (let row = 0; row < newData[col].length; row++) {
                if (newData[col][row] !== null) {
                    let nodeCau = this.cockRoach.children[col - idStart].children[row];
                    nodeCau.active = true;
                    this.setCauCock(newData[col][row], nodeCau);

                }
            }
        }
    }

    getTypeCau(typeCau) {
        for (let i = 0; i < typeCau.length; i++) {
            if (typeCau[i] <= Bacarrat_Const.TAG_POT.TIE)
                return typeCau[i];
        }

        return Bacarrat_Const.TAG_POT.TIE;
    }

    setCauDishRoad(type, nodeCau) {
        let cai = nodeCau.getChildByName("cai");
        let con = nodeCau.getChildByName("con");
        let lb_super = nodeCau.getChildByName("lb_super6")
        cai.active = false;
        con.active = false;
        lb_super.active = false;

        for (let i = 0; i < type.length; i++) {
            if (type[i] > Bacarrat_Const.TAG_POT.TIE) {
                if (type[i] === Bacarrat_Const.TAG_POT.PLAYER_PAIR) {
                    con.active = true;
                } else if (type[i] === Bacarrat_Const.TAG_POT.BANKER_PAIR) {
                    cai.active = true;
                } else if (type[i] === Bacarrat_Const.TAG_POT.SUPER_6) {
                    lb_super.active = true
                }
            } else {
                nodeCau.getComponent(cc.Sprite).spriteFrame = this.bgDishBoard[type[i]];
            }
        }
    }

    setCauBigRoad(type, nodeCau) {
        let banker = nodeCau.getChildByName("cai");
        let player = nodeCau.getChildByName("con");
        let super6 = nodeCau.getChildByName("lb_super6");

        banker.active = false;
        player.active = false;
        super6.active = false;

        for (let i = 0; i < type.length; i++) {
            let xtype = type[i];
            if (xtype > Bacarrat_Const.TAG_POT.TIE) {
                if (xtype === Bacarrat_Const.TAG_POT.PLAYER_PAIR) {
                    player.active = true;
                } else if (xtype === Bacarrat_Const.TAG_POT.BANKER_PAIR) {
                    banker.active = true;
                } else {
                    super6.active = true;
                }
            } else {
                if (xtype === Bacarrat_Const.TAG_POT.TIE) {
                    xtype = this.lastType + 2;
                } else {
                    if (xtype < Bacarrat_Const.TAG_POT.TIE)
                        this.lastType = xtype;
                }

                nodeCau.getComponent(cc.Sprite).spriteFrame = this.bgBigRoad[xtype];
            }
        }
    }

    setCauScore(cauInfo, nodeCau) {
        let type = cauInfo.listWinType;
        for (let i = 0; i < type.length; i++) {
            if (type[i] <= Bacarrat_Const.TAG_POT.TIE) {
                nodeCau.getComponent(cc.Sprite).spriteFrame = this.bgScoreRoad[type[i]];
                nodeCau.getChildByName("lb_win").color = this.listColor[type[i]];
                nodeCau.getChildByName("lb_lose").active = true

                if (type[i] === Bacarrat_Const.TAG_POT.PLAYER) {
                    nodeCau.getChildByName("lb_win").getComponent(cc.Label).string = cauInfo.playerPoint;
                    nodeCau.getChildByName("lb_lose").getComponent(cc.Label).string = cauInfo.bankerPoint;
                }
                else if (type[i] === Bacarrat_Const.TAG_POT.BANKER) {
                    nodeCau.getChildByName("lb_win").getComponent(cc.Label).string = cauInfo.bankerPoint;
                    nodeCau.getChildByName("lb_lose").getComponent(cc.Label).string = cauInfo.playerPoint;
                }
                else {
                    nodeCau.getChildByName("lb_win").getComponent(cc.Label).string = cauInfo.playerPoint;
                    nodeCau.getChildByName("lb_lose").active = false
                }
            }
        }
    }

    setCauSmall(type, nodeCau) {
        nodeCau.getComponent(cc.Sprite).spriteFrame = this.bgDishBoard[type];
    }

    setCauBigEye(type, nodeCau) {
        nodeCau.getComponent(cc.Sprite).spriteFrame = this.bgBigRoad[type];
    }

    setCauCock(type, nodeCau) {
        nodeCau.getComponent(cc.Sprite).spriteFrame = this.bgCockRoad[type];
    }

    eventBackPage() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK);
        this.allPage.scrollToPage(0, .5);
        this.updateBtn()
    }

    genNewData(data) {
        let clData = [...data];
        let arrTick = []
        let arrDataTemp = []

        let totalData = clData.length;
        let sizeMap = totalData;

        for (let col = 0; col < totalData; col++) {
            let arr = []
            let arrD = []
            for (let row = 0; row < 6; row++) {
                arr.push(0);
                arrD.push(null)
            }
            arrTick.push(arr);
            arrDataTemp.push(arrD)
        }

        for (let i = 0; i < totalData; i++) {
            let dataCau = clData[i];
            let idCol = i
            let idRow = 0;
            let nextStep = 0;

            while (arrTick[idCol][idRow] === 1) {
                idCol++;

                if (idCol >= sizeMap) {
                    sizeMap++;

                    let arr = []
                    let arrD = []
                    for (let row = 0; row < 6; row++) {
                        arr.push(0);
                        arrD.push(null)
                    }
                    arrTick.push(arr);
                    arrDataTemp.push(arrD)
                }
            }

            for (let iCau = 0; iCau < dataCau.length; iCau++) {
                arrTick[idCol][idRow] = 1
                arrDataTemp[idCol][idRow] = dataCau[iCau];

                if (idRow === 5 || arrTick[idCol][idRow + 1] === 1) {
                    idCol++;
                    nextStep = iCau + 1;
                    break;
                }
                else {
                    idRow++;
                }
            }

            if (idCol >= sizeMap) {
                sizeMap++;

                let arr = []
                let arrD = []
                for (let row = 0; row < 6; row++) {
                    arr.push(0);
                    arrD.push(null)
                }
                arrTick.push(arr);
                arrDataTemp.push(arrD)
            }

            if (nextStep > 0) {
                for (let iCau = nextStep; iCau < dataCau.length; iCau++) {
                    arrTick[idCol][idRow] = 1
                    arrDataTemp[idCol][idRow] = dataCau[iCau];
                    idCol++;

                    if (idCol >= sizeMap && iCau < dataCau.length - 1) {
                        sizeMap++;

                        let arr = []
                        let arrD = []
                        for (let row = 0; row < 6; row++) {
                            arr.push(0);
                            arrD.push(null)
                        }
                        arrTick.push(arr);
                        arrDataTemp.push(arrD)
                    }
                }
            }
        }

        return arrDataTemp;
    }

    eventNextPage() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK);
        this.allPage.scrollToPage(1, .5);
        this.updateBtn()
    }

    updateBtn() {
        if (this.allPage.getCurrentPageIndex() === 0) {
            this.btn_pre.interactable = false;
            this.btn_next.interactable = true;
        }
        else {
            this.btn_pre.interactable = true;
            this.btn_next.interactable = false;
        }
    }

    onClosePopup() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        this.node.removeFromParent();
    }
}
