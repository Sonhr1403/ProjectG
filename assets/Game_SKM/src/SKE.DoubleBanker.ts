import SKMConnector from "../../lobby/scripts/network/wss/SKMConnector";
import SKMCmd from "./SKE.Cmd";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SKMDoubleBanker extends cc.Component {
    public exceptDoubleBanker() {
        let pk = new SKMCmd.SendDoubleBanker();
        pk.confirm = 1;
        SKMConnector.instance.sendPacket(pk);
        this.closePopUp();
    }

    public cancelDoubleBanker() {
        let pk = new SKMCmd.SendDoubleBanker();
        pk.confirm = 0;
        SKMConnector.instance.sendPacket(pk);
        this.closePopUp();
    }

    public closePopUp() {
        this.node.active = false;
    }
}
