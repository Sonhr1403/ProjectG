import SKMConnector from "../../lobby/scripts/network/wss/SKMConnector";
import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import SKMCmd from "./SKE.Cmd";
import SKEController from "./SKE.Controller";
const { ccclass, property } = cc._decorator;

@ccclass
export default class SKMChat extends cc.Component {

    @property(cc.EditBox)
    public edtInputChat: cc.EditBox = null;

    @property(cc.Node)
    public viewEmotion: cc.Node = null;

    @property(cc.Node)
    public viewQuickChat: cc.Node = null;

    @property(cc.Node)
    public contentEmotionChat: cc.Node = null;

    @property(cc.Node)
    public contentMessageChat: cc.Node = null;


    private spSkeletonData: sp.SkeletonData = null;
    private readonly arrQuickChatLang = [
        "shankoemee.quick_chat_1",
        "shankoemee.quick_chat_2",
        "shankoemee.quick_chat_3",
        "shankoemee.quick_chat_4",
        "shankoemee.quick_chat_5",
        "shankoemee.quick_chat_6",
        "shankoemee.quick_chat_7",
        "shankoemee.quick_chat_8",
        "shankoemee.quick_chat_9",
        "shankoemee.quick_chat_10",
        "shankoemee.quick_chat_11",
        "shankoemee.quick_chat_12"
    ];

    private arrayEmotion: Array<cc.Node> = [];

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.initTempChat();
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        for(let btnEmotion of this.arrayEmotion) {
            btnEmotion.off("click", this.onClickChatEmotion, this);
        }
    }

    start() {
        // this.initTempChat();
    }

    private initTempChat() {
        this.contentEmotionChat.removeAllChildren();
        this.contentMessageChat.removeAllChildren();
        this.spSkeletonData = SKEController.instance.emosSkeletonData;

        for (let i = 1; i < 17; i++) {
            let btnEmotion = this.createSkeletonButton(i);
            this.arrayEmotion.push(btnEmotion);
            this.contentEmotionChat.addChild(btnEmotion);
        }
        for (let k = 0; k < this.arrQuickChatLang.length; k++) {
            let btnMessage = this.createMessageButton(this.arrQuickChatLang[k], k);
            this.arrayEmotion.push(btnMessage);
            this.contentMessageChat.addChild(btnMessage);
        }
        this.switchPnChat("EMOTION");
    }

    private createSkeletonButton(index: number): cc.Node {
        let node = new cc.Node();
        node.width = 80;
        node.height = 80;
        node.anchorX = 0.5;
        node.anchorY = 0.5;
        node.ID_EMOIJI = index;
        node.addComponent(cc.Button);

        let skeletonNode = new cc.Node();
        let skeleton = skeletonNode.addComponent(sp.Skeleton);
        skeleton.skeletonData = this.spSkeletonData;
        skeleton.setSkin("default");
        skeleton.setAnimation(0, index.toString(), true);
        skeleton.defaultAnimation = index.toString();
        node.addChild(skeletonNode);

        skeletonNode.position = cc.v3(0, 0, 0);
        skeletonNode.anchorX = 0.5;
        skeletonNode.anchorY = 0.5;
        skeletonNode.setScale(0.5);

        node.on("click", this.onClickChatEmotion, this);
        return node;
    }

    private createMessageButton(keyMes: string, idMes: number): cc.Node {
        let nodeBtn = new cc.Node();
        nodeBtn.width = 420;
        nodeBtn.height = 60;
        nodeBtn.anchorX = 0.5;
        nodeBtn.anchorY = 0.5;
        nodeBtn.idMes = idMes;
        nodeBtn.addComponent(cc.Button);
        let lbNode = new cc.Node();
        lbNode.setPosition(cc.v2(0, 0));
        lbNode.anchorX = 0.5;
        lbNode.anchorY = 0.5;
        let objLabel = lbNode.addComponent(cc.Label);
        objLabel.string = LanguageMgr.getString(keyMes);
        objLabel.fontSize = 24;

        nodeBtn.addChild(lbNode);

        nodeBtn.on("click", this.onClickChatMessage, this);
        return nodeBtn;
    }

    public showQuickChat() {
        this.switchPnChat("QUICK");
    }

    public showEmotionChat() {
        this.switchPnChat("EMOTION");
    }

    private switchPnChat(pnName: string) {
        switch (pnName) {
            case "QUICK":
                this.viewEmotion.active = false;
                this.viewQuickChat.active = true;
                break;

            case "EMOTION":
                this.viewQuickChat.active = false;
                this.viewEmotion.active = true;
                break;
        }
    }

    public sendChatText() {
        if (this.edtInputChat.string.trim().length > 0) {
            let pk = new SKMCmd.SendChatRoom()
            pk.a = 0;
            pk.b = this.edtInputChat.string;
            SKMConnector.instance.sendPacket(pk);
            this.cleanEditbox();
            this.closeUIChat();
        }
    }

    public onClickChatQuick(event, id) {
        // TODO
    }

    public onClickChatEmotion(event) {
        try {
            let pk = new SKMCmd.SendChatRoom()
            pk.a = 1;
            pk.b = event.node.ID_EMOIJI;
            SKMConnector.instance.sendPacket(pk);
            this.closeUIChat();
        } catch (error) {
            console.error("Error", error);
        }
    }

    
    public onClickChatMessage(event) {
        try {
            let pk = new SKMCmd.SendChatRoom()
            pk.a = 0;
            pk.b = this.arrQuickChatLang[event.node.idMes];
            SKMConnector.instance.sendPacket(pk);
            this.closeUIChat();
        } catch (error) {
            console.error("Error", error);
        }
    }

    public onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.enter:
                this.sendChatText();
                break;
        }
    }

    public closeUIChat() {
        this.node.active = false;
    }

    public cleanEditbox() {
        this.edtInputChat.string = "";
    }
}
