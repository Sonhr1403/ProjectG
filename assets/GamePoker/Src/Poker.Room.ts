import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import PokerRooms from "./Poker.Rooms";
import { Poker } from "./Poker.Cmd";
import PokerController from "./Poker.Controller";

const { ccclass, property } = cc._decorator;
@ccclass

export default class PokerRoom extends cc.Component {

    @property(cc.Label)
    public lbValMoneyRoom: cc.Label = null;

    @property(cc.Label)
    public lbValNumberPlayer: cc.Label = null;

    @property(cc.Label)
    public lbValMoneyLevel: cc.Label = null;

    @property(cc.Sprite)
    public spBackground: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    public spBgAtlas: cc.SpriteAtlas = null;

    @property(cc.Font)
    public arrayFont: cc.Font[] = [];

    @property(cc.Sprite)
    public chipIcon: cc.Sprite = null;

    @property(cc.SpriteFrame)
    public arrayChipFrame: cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    public userIcon: cc.Sprite = null;

    @property(cc.SpriteFrame)
    public arrayAddUserFrame: cc.SpriteFrame[] = [];

    public roomInfo = null;

    public renderRoom(roomInfo: any): void {
        this.roomInfo = roomInfo;
        // cc.error("INFO ROOM", this.roomInfo);
        let playerMoney = BGUI.UserManager.instance.mainUserInfo.vinTotal;

        let strBg = "pok_room_" + this.roomInfo.bg;

        this.spBackground.spriteFrame = this.spBgAtlas.getSpriteFrame(strBg);
        this.lbValMoneyRoom.getComponent(cc.Label).font = this.arrayFont[0];

        this.chipIcon.spriteFrame = this.arrayChipFrame[0];
        this.lbValMoneyLevel.getComponent(cc.Label).font = this.arrayFont[2];

        this.userIcon.spriteFrame = this.arrayAddUserFrame[0];
        this.lbValNumberPlayer.getComponent(cc.Label).font = this.arrayFont[3];

        this.node.getComponent(cc.Button).interactable = true;

        // if (playerMoney < this.roomInfo.maxJoin[0] || playerMoney > this.roomInfo.maxJoin[1]) {
        //     let strBg = "pok_room_off";
        //     this.spBackground.spriteFrame = this.spBgAtlas.getSpriteFrame(strBg);
        //     this.lbValMoneyRoom.getComponent(cc.Label).font = this.arrayFont[1];
        //     this.chipIcon.spriteFrame = this.arrayChipFrame[1];
        //     this.lbValMoneyLevel.getComponent(cc.Label).font = this.arrayFont[2];
        //     this.userIcon.spriteFrame = this.arrayAddUserFrame[1];
        //     this.lbValNumberPlayer.getComponent(cc.Label).font = this.arrayFont[4];
        //     this.node.getComponent(cc.Button).interactable = false;
        // } else {
        //     let strBg = "pok_room_" + this.roomInfo.bg;
        //     this.spBackground.spriteFrame = this.spBgAtlas.getSpriteFrame(strBg);
        //     this.lbValMoneyRoom.getComponent(cc.Label).font = this.arrayFont[0];
        //     this.chipIcon.spriteFrame = this.arrayChipFrame[0];
        //     this.lbValMoneyLevel.getComponent(cc.Label).font = this.arrayFont[2];
        //     this.userIcon.spriteFrame = this.arrayAddUserFrame[0];
        //     this.lbValNumberPlayer.getComponent(cc.Label).font = this.arrayFont[3];
        //     this.node.getComponent(cc.Button).interactable = true;
        // }

        this.lbValNumberPlayer.string = this.roomInfo.userCount;
        this.lbValMoneyRoom.string = this.convert2Label(this.roomInfo.moneyBet);
        this.lbValMoneyLevel.string = this.convert2Label(this.roomInfo.requiredMoney);

        if (this.roomInfo.buyInRanger) {
            this.lbValMoneyLevel.string = this.convert2Label(this.roomInfo.buyInRanger[0]) + "-" + this.convert2Label(this.roomInfo.buyInRanger[1]);
        }
    }

    public convert2Label(num) {
        if (!num) {
            return "0";
        }

        let data = num;
        let returnKey = '';
        if ((data / 1000) >= 1) {
            data = data / 1000
            returnKey = "K";
            if ((data / 1000) >= 1) {
                data = data / 1000
                returnKey = "M";
                if ((data / 1000) >= 1) {
                    data = data / 1000
                    returnKey = "B";
                    if ((data / 1000) >= 1) {
                        data = data / 1000
                        returnKey = "T";
                    }
                }
            }
        }

        if (!this.isInt(data)) {
            if (data > 100) {
                data = data.toFixed(1)
            } else if (data > 10) {
                data = data.toFixed(2)
            } else {
                data = data.toFixed(2);
            }
        }
        return data + returnKey;
    }

    public isInt(num) {
        return num % 1 === 0;
    }

    public chooseRoom() {
        // console.log("JOIN ROOM", this.roomInfo);
        // if (this.roomInfo["requiredMoney"] > BGUI.UserManager.instance.mainUserInfo.vinTotal) {
        //     BGUI.UIPopupManager.instance.showPopup(LanguageMgr.getString("boogyi.not_enough_gold_please_deposit"));
        //     return;
        // }
        Poker.Send.sendJoinRoom(this.roomInfo, this.roomInfo.buyInRanger[0], true);
    }
}
