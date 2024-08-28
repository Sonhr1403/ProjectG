import SHWESHANConnector from "../../lobby/scripts/network/wss/SHWESHANConnector";
import SHWESHANCmd from "./SHWESHAN.Cmd";
import SHWESHANDialog from "./SHWESHAN.Dialog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SHWESHANCreateRoom extends SHWESHANDialog {

    @property(cc.Label)
    lbMucCuoc: cc.Label = null;

    @property(cc.Label)
    lbPlayer: cc.Label = null;

    @property(cc.EditBox)
    nameRoom: cc.EditBox = null;

    @property(cc.EditBox)
    matkhau: cc.EditBox = null;


    @property(cc.Node)
    nChonMuc: cc.Node = null;

    onEnable() {
        this.lbPlayer.string = '2';
        this.nameRoom.string = 'Pro vào đây'
        this.lbMucCuoc.string = '100';
    }

    onBtn6() {
        this.lbPlayer.string = '2';
    }

    onBtn9() {
        this.lbPlayer.string = '4';
    }

    onBtnMuc() {
        this.nChonMuc.active = !this.nChonMuc.active;
    }

    onBtnChonMuc(event, data) {
        this.lbMucCuoc.string = BGUI.Utils.formatMoneyWithCommaOnly(parseInt(data));
        this.nChonMuc.active = false;
    }

    onBtnOK() {
        let pk = new SHWESHANCmd.SendCreateRoom();
        pk.roomName = this.nameRoom.string == "" ? "Pro vào đây" : this.nameRoom.string;
        pk.password = this.matkhau.string;
        pk.moneyBet = parseInt(this.lbMucCuoc.string);
        pk.limitPlayer = parseInt(this.lbPlayer.string);
        console.log(pk);
        
        SHWESHANConnector.instance.sendPacket(pk);
        this.dismiss();
    }

    dismiss() {
        this.nChonMuc.active = false;
        super.dismiss()
    }
}
