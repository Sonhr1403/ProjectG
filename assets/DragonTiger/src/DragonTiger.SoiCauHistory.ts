import { DragonTiger_Const } from "./DragonTiger.Const";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonTiger_SoiCauHistory extends cc.Component {

    @property(cc.Node)
    listCau: cc.Node = null;
    @property(cc.SpriteFrame)
    iconScore: cc.SpriteFrame[] = []

    // private _data = JSON.parse(JSON.stringify([{ "currrentTime": "30-05-2023", "roomId": 1, "playerResult": "KING_BICH QUEEN_CO TWO_RO ", "bankerResult": "SIX_TEP ACE_TEP ", "betValue": "0,0,0,0,0,0", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [11, 36, 39], "listBanker": [17, 25], "bankerPoint": 7, "playerPoint": 2 },
    // { "currrentTime": "30-06-2023", "roomId": 1, "playerResult": "SEVEN_BICH TWO_RO ", "bankerResult": "FIVE_TEP SEVEN_RO FOUR_BICH ", "betValue": "0,0,0,0,0,0", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0, 5], "listPlayer": [5, 39], "listBanker": [16, 44, 2], "bankerPoint": 6, "playerPoint": 9 },
    // { "currrentTime": "30-07-2023", "roomId": 1, "playerResult": "TEN_RO ACE_BICH JACK_RO ", "bankerResult": "FOUR_RO ACE_CO ", "betValue": "0,0,0,0,0,0", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [47, 12, 48], "listBanker": [41, 38], "bankerPoint": 5, "playerPoint": 1 },
    // { "currrentTime": "30-08-2023", "roomId": 1, "playerResult": "NINE_BICH EIGHT_CO ", "bankerResult": "KING_BICH JACK_CO FIVE_TEP ", "betValue": "0,0,0,0,0,0", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [7, 32], "listBanker": [11, 35, 16], "bankerPoint": 5, "playerPoint": 7 },
    // { "currrentTime": "30-09-2023", "roomId": 1, "playerResult": "KING_CO SEVEN_RO ", "bankerResult": "ACE_CO QUEEN_BICH FOUR_RO ", "betValue": "0,0,0,0,0,0", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [37, 44], "listBanker": [38, 10, 41], "bankerPoint": 5, "playerPoint": 7 },
    // { "currrentTime": "30-10-2023", "roomId": 1, "playerResult": "SIX_BICH SEVEN_BICH EIGHT_TEP ", "bankerResult": "NINE_CO ACE_RO QUEEN_RO ", "betValue": "0,0,0,0,0,0", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [4, 5, 19], "listBanker": [33, 51, 49], "bankerPoint": 0, "playerPoint": 1 },
    // { "currrentTime": "30-10-2023", "roomId": 1, "playerResult": "NINE_CO EIGHT_RO ", "bankerResult": "QUEEN_CO JACK_RO SEVEN_TEP ", "betValue": "0,0,0,0,0,0", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [2], "listPlayer": [33, 45], "listBanker": [36, 48, 18], "bankerPoint": 7, "playerPoint": 7 },
    // { "currrentTime": "30-11-2023", "roomId": 1, "playerResult": "KING_TEP EIGHT_RO ", "bankerResult": "JACK_RO QUEEN_RO FIVE_BICH ", "betValue": "0,0,0,0,0,0", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [24, 45], "listBanker": [48, 49, 3], "bankerPoint": 5, "playerPoint": 8 },
    // { "currrentTime": "30-12-2023", "roomId": 1, "playerResult": "EIGHT_RO ACE_RO ", "bankerResult": "EIGHT_TEP TWO_RO TWO_BICH ", "betValue": "0,0,0,0,0,0", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0, 4], "listPlayer": [45, 51], "listBanker": [19, 39, 0], "bankerPoint": 2, "playerPoint": 9 },
    // { "currrentTime": "30-13-2023", "roomId": 1, "playerResult": "EIGHT_RO ACE_BICH ", "bankerResult": "ACE_RO FOUR_RO ", "betValue": "0,0,0,0,0,0", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [45, 12], "listBanker": [51, 41], "bankerPoint": 5, "playerPoint": 9 },
    // { "currrentTime": "30-13-2023", "roomId": 1, "playerResult": "FOUR_TEP FOUR_CO ", "bankerResult": "SEVEN_CO JACK_RO ", "betValue": "0,0,0,0,0,0", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0, 3], "listPlayer": [15, 28], "listBanker": [31, 48], "bankerPoint": 7, "playerPoint": 8 },
    // { "currrentTime": "30-14-2023", "roomId": 1, "playerResult": "FOUR_CO KING_RO ACE_BICH ", "bankerResult": "ACE_RO THREE_BICH ", "betValue": "0,0,0,0,0,0", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [28, 50, 12], "listBanker": [51, 1], "bankerPoint": 4, "playerPoint": 5 },
    // { "currrentTime": "30-15-2023", "roomId": 1, "playerResult": "TWO_RO KING_BICH EIGHT_CO ", "bankerResult": "TWO_TEP THREE_TEP ", "betValue": "0,0,0,0,0,0", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [39, 11, 32], "listBanker": [13, 14], "bankerPoint": 5, "playerPoint": 0 },
    // { "currrentTime": "30-16-2023", "roomId": 1, "playerResult": "SIX_TEP EIGHT_RO NINE_CO ", "bankerResult": "QUEEN_TEP KING_BICH NINE_BICH ", "betValue": "0,0,0,0,0,0", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [17, 45, 33], "listBanker": [23, 11, 7], "bankerPoint": 9, "playerPoint": 3 },
    // { "currrentTime": "30-17-2023", "roomId": 1, "playerResult": "FOUR_RO KING_RO ACE_RO ", "bankerResult": "TWO_CO SIX_TEP ", "betValue": "0,0,0,0,0,0", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [41, 50, 51], "listBanker": [26, 17], "bankerPoint": 8, "playerPoint": 5 },
    // { "currrentTime": "30-18-2023", "roomId": 1, "playerResult": "SEVEN_CO THREE_CO FIVE_BICH ", "bankerResult": "JACK_TEP ACE_CO QUEEN_TEP ", "betValue": "0,0,0,0,0,0", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [31, 27, 3], "listBanker": [22, 38, 23], "bankerPoint": 1, "playerPoint": 5 },
    // { "currrentTime": "30-18-2023", "roomId": 1, "playerResult": "NINE_TEP QUEEN_BICH ", "bankerResult": "NINE_CO FIVE_CO ", "betValue": "0,0,0,0,0,0", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0], "listPlayer": [20, 10], "listBanker": [33, 29], "bankerPoint": 4, "playerPoint": 9 },
    // { "currrentTime": "30-19-2023", "roomId": 1, "playerResult": "QUEEN_RO TWO_TEP NINE_RO ", "bankerResult": "JACK_TEP JACK_BICH JACK_RO ", "betValue": "0,0,0,0,0,0", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [0, 4], "listPlayer": [49, 13, 46], "listBanker": [22, 9, 48], "bankerPoint": 0, "playerPoint": 1 },
    // { "currrentTime": "30-20-2023", "roomId": 1, "playerResult": "NINE_CO THREE_TEP THREE_CO ", "bankerResult": "EIGHT_BICH NINE_RO ", "betValue": "0,0,0,0,0,0", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1, 3], "listPlayer": [33, 14, 27], "listBanker": [6, 46], "bankerPoint": 7, "playerPoint": 5 },
    // { "currrentTime": "30-21-2023", "roomId": 1, "playerResult": "TEN_RO ACE_RO NINE_CO ", "bankerResult": "KING_CO EIGHT_TEP ", "betValue": "0,0,0,0,0,0", "prize": "0.0,0.0,0.0,0.0,0.0,0.0", "listWinType": [1], "listPlayer": [47, 51, 33], "listBanker": [37, 19], "bankerPoint": 8, "playerPoint": 0 }]))

    private _data = null

    setData(data: any, typeAction = false) {
        if (!data) return;
        this._data = data;
        this.updateCau();

        // if (typeAction)
        //     this.actionShow()
    }

    // actionShow() {
    //     for (let i = 0; i < this.listCau.childrenCount; i++) {
    //         let cau = this.listCau.children[i];
    //         cau.opacity = 0;
    //         cau.scale = 1.5;
    //         cc.tween(cau).delay(i * 0.3)
    //             .to(0.3, { opacity: 255, scale: 1 })
    //             .start();
    //     }
    // }

    updateCau() {
        let startPos = this._data.length - this.listCau.childrenCount;
        if (startPos < 0) startPos = 0;

        for (let i = 0; i < this.listCau.childrenCount; i++) {
            let nodeCau = this.listCau.children[i];
            if (!nodeCau) return;
            if (startPos + i < this._data.length) {
                nodeCau.active = true;
                nodeCau.getComponent(cc.Sprite).spriteFrame = this.iconScore[this._data[startPos + i]];
            } else {
                nodeCau.active = false;
            }
        }
    }
}