import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import SHWESHANController from "./SHWESHAN.Controller";

const { ccclass, property } = cc._decorator;
@ccclass
export default class SHWESHANItemRoom extends cc.Component {
    @property(cc.Label)
    labelRef: cc.Label = null;

    @property(cc.Label)
    labelName: cc.Label = null;

    @property(cc.Label)
    labelBet: cc.Label = null;

    @property(cc.Label)
    labelBetMin: cc.Label = null;

    @property(cc.Label)
    labelNumPlayers: cc.Label = null;


    @property(cc.SpriteFrame)
    sprBg: cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    bg: cc.Sprite = null;

    @property(cc.Node)
    public nodebtmright: cc.Node = null;
    @property(cc.SpriteFrame)
    sprChips: cc.SpriteFrame[] = [];
    @property(cc.Font)
    enabledFont: cc.Font = null
    @property(cc.Sprite)
    chips: cc.Sprite = null;

    @property(cc.Node)
    mucvao: cc.Node = null;
    @property(cc.Node)
    muccuoc: cc.Node = null;
    @property(cc.SpriteFrame)
    disabledRoom: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    disabledChip: cc.SpriteFrame = null
    @property(cc.Font)
    disabledFont: cc.Font = null
    
    public roomInfo = null;
    // fontColorMucCuoc = [cc.color(8,107,42), cc.color(168,142,91), cc.color(83,23,136), cc.color(20,136,175), cc.color(8,107,42), cc.color(168,142,91), cc.color(83,23,136), cc.color(83,23,136)]
    fontColorMucVao = [cc.color(1,51,22), cc.color(163,79,6), cc.color(54,3,82), cc.color(14,102,140), cc.color(54,3,82), cc.color(14,102,140), cc.color(163,79,6)]

    initItem(info, idx = 0) {
  
        this.roomInfo = info;
        let playerMoney = BGUI.UserManager.instance.mainUserInfo.vinTotal;
        // id: 72
        // key: false
        // limitPlayer: 9
        // maxUserPerRoom: 9 
        // moneyBet: 10000
        // moneyType: 1
        // nameRoom: "San Bang Tat Ca"
        // quyban: 0
        // requiredMoney: 400000
        // rule: 0
        // userCount: 0
        // console.log("info.maxJoin:", info)
        this.labelRef.string = "#" + info["id"];
        this.labelName.string = info["nameRoom"];
        this.labelBet.string = this.convert2Label(info["moneyBet"]);
        this.labelBetMin.string = this.convert2Label(info["requiredMoney"]);
        this.labelNumPlayers.string = info["totalUser"];
        if(info.maxJoin){
            if(info.maxJoin.length == 2){
                this.labelBetMin.string = this.convert2Label(info.maxJoin[0]) + "-" +this.convert2Label(info.maxJoin[1]);
            }else if(info.maxJoin.length == 1){
                this.labelBetMin.string = this.convert2Label(info.maxJoin[0]) + "+";
            }
        }
        if (playerMoney < this.roomInfo.maxJoin[0] || playerMoney > this.roomInfo.maxJoin[1]) {
            this.bg.spriteFrame = this.disabledRoom;
            this.chips.spriteFrame = this.disabledChip
            this.mucvao.color = cc.color(108, 119, 132)
            this.muccuoc.getComponent(cc.Label).font = this.disabledFont
            // this.node.getComponent(cc.Button).interactable = false;
        } else {
            this.muccuoc.getComponent(cc.Label).font = this.enabledFont
            this.bg.spriteFrame = this.sprBg[idx]
            this.chips.spriteFrame = this.sprChips[idx]
            this.mucvao.color = this.fontColorMucVao[idx]
            // this.muccuoc.color = this.fontColorMucCuoc[idx]
        }
  
    }


    convert2Label(num){
        let data = num;
        let returnKey = '';
        if((data/1000) >= 1){
            data = data/1000
            returnKey = "K";
            if((data/1000) >= 1){
                data = data/1000
                returnKey = "M";
                if((data/1000) >= 1){
                    data = data/1000
                    returnKey = "B";
                    if((data/1000) >= 1){
                        data = data/1000
                        returnKey = "T";
                    }
                }
            }
        }
        if(!this.isInt(data)){
            if(data > 100){
                data = data.toFixed(1)
            }else if(data > 10){
                data = data.toFixed(2)
            }else {
                data = data.toFixed(2);
            }
        }
        return data+returnKey;
    }
    isInt(num){
        return num % 1 === 0;
    }

    chooseRoom() {
        if (this.roomInfo["requiredMoney"] > BGUI.UserManager.instance.mainUserInfo.vinTotal) {
            BGUI.UIPopupManager.instance.showPopup(LanguageMgr.getString("shweshan.not_enough_gold_please_deposit"));
            return;
        }
        if (this.roomInfo.key) {
            // SHWESHANController.instance.joinRoomPass(this.roomInfo);
        } else
            SHWESHANController.instance.joinRoom(this.roomInfo);
    }

    // update (dt) {}
}
