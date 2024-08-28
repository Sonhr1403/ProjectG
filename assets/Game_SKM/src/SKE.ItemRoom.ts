import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import SKEController from "./SKE.Controller";

const { ccclass, property } = cc._decorator;
@ccclass
export default class SKMItemRoom extends cc.Component {
    @property(cc.Label)
    public lbIdRoom: cc.Label = null;

    @property(cc.Label)
    public lbNameRoom: cc.Label = null;

    @property(cc.Label)
    public lbValMoneyRoomActive: cc.Label = null;

    @property(cc.Label)
    public lbValMoneyRoomInActive: cc.Label = null;

    @property(cc.Label)
    public lbValNumberPlayerActive: cc.Label = null;

    @property(cc.Label)
    public lbValNumberPlayerInActive: cc.Label = null;

    @property(cc.Node)
    public nodeUserActive: cc.Node = null;

    @property(cc.Node)
    public nodeUserInActive: cc.Node = null;

    @property(cc.Label)
    public lbValMoneyLevel: cc.Label = null;

    @property(cc.SpriteAtlas)
    public spBgAtlas: cc.SpriteAtlas = null;

    @property(cc.Sprite)
    public spBackground: cc.Sprite = null;

    public roomInfo = null;

    public renderRoom(roomInfo: any): void {
        this.roomInfo = roomInfo;
        let strBg = "skm_room_off";
        if(roomInfo.allowJoin){
            strBg = "skm_room_" + roomInfo.bg;
            this.lbValMoneyRoomActive.node.active = true;
            this.lbValMoneyRoomInActive.node.active = false;
            this.lbValNumberPlayerActive.node.active = true;
            this.lbValNumberPlayerInActive.node.active = false;
            this.nodeUserInActive.active = false;
            this.nodeUserActive.active = true;
        } else {
            strBg = "skm_room_off";
            this.lbValMoneyRoomActive.node.active = false;
            this.lbValMoneyRoomInActive.node.active = true;
            this.lbValNumberPlayerActive.node.active = false;
            this.lbValNumberPlayerInActive.node.active = true;
            this.nodeUserInActive.active = true;
            this.nodeUserActive.active = false;
        }
       
        this.spBackground.spriteFrame = this.spBgAtlas.getSpriteFrame(strBg);
        this.lbIdRoom.string = "#" + this.roomInfo.id;
        // this.lbValNumberPlayerActive.string = this.roomInfo.userCount + "/" + this.roomInfo.maxUserPerRoom;
        this.lbValNumberPlayerActive.string = this.roomInfo.userCount;
        this.lbValNumberPlayerInActive.string = this.roomInfo.userCount;
        
        this.lbValMoneyRoomActive.string = this.convert2Label(this.roomInfo.moneyBet).toString();
        this.lbValMoneyRoomInActive.string = this.convert2Label(this.roomInfo.moneyBet).toString();
        this.lbValMoneyLevel.string = this.convert2Label(this.roomInfo.requiredMoney).toString();

        if (this.roomInfo.maxJoin) {
            if (this.roomInfo.maxJoin.length == 1) {
                this.lbValMoneyLevel.string = this.convert2Label(this.roomInfo.maxJoin[0]) + "+";
            }
            if (this.roomInfo.maxJoin.length == 2) {
                this.lbValMoneyLevel.string = this.convert2Label(this.roomInfo.maxJoin[0]) + "-" + this.convert2Label(this.roomInfo.maxJoin[1]);
            }
        }
    }

    public convert2Label(num) {
        if (!num) {
            return 0;
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
        if (this.roomInfo["requiredMoney"] > BGUI.UserManager.instance.mainUserInfo.vinTotal) {
            BGUI.UIPopupManager.instance.showPopup(LanguageMgr.getString("shankoemee.not_enough_gold_please_deposit"));
            return;
        }
        if (this.roomInfo.allowJoin) {
            if (this.roomInfo.key) {
                // SKEController.instance.joinRoomPass(this.roomInfo);
            } else {
                SKEController.instance.sendJoinRoomType(this.roomInfo);
            }
        }
    }
    // update (dt) {}
}
