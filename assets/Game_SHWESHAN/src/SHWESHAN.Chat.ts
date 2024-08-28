import SHWESHANConnector from "../../lobby/scripts/network/wss/SHWESHANConnector";
import SHWESHANCmd from "./SHWESHAN.Cmd";
import SHWESHANController from "./SHWESHAN.Controller";
const { ccclass, property } = cc._decorator;
 
@ccclass
export default class SHWESHANChat extends cc.Component {
    public static instance: SHWESHANChat = null;

    @property(cc.EditBox)
    public edtInputChat: cc.EditBox = null;
 
    @property(cc.Node)
    public viewEmotion: cc.Node = null;
 
    @property(cc.Node)
    public viewQuickChat: cc.Node = null;
 
    @property(cc.Node)
    public emotionChat: cc.Node = null;
 
    @property(sp.SkeletonData)
    public emo: sp.SkeletonData = null;

    private readonly arrQuickChatLang = [
        "shweshan.quick_chat_1",
        "shweshan.quick_chat_2",
        "shweshan.quick_chat_3",
        "shweshan.quick_chat_4",
        "shweshan.quick_chat_5",
        "shweshan.quick_chat_6",
        "shweshan.quick_chat_7",
        "shweshan.quick_chat_8",
        "shweshan.quick_chat_9",
        "shweshan.quick_chat_10",
        "shweshan.quick_chat_11",
        "shweshan.quick_chat_12"
    ];
 
    private arrayEmotion: Array<cc.Node> = [];
 
    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.emotionChat.removeAllChildren();
        let emotemp = this.emo;
            console.log(emotemp)
        for (let i = 1; i <= 16; i++) {
            // let spriteFrame = SHWESHANController.instance.spriteAtlasEmos.getSpriteFrame("emotion_" + i)
            // let btnEmotion = this.createButton(spriteFrame, i);
            // this.arrayEmotion.push(btnEmotion);
            // this.emotionChat.addChild(btnEmotion);

            let btnEmotion = this.createButton(emotemp, i);
            this.arrayEmotion.push(btnEmotion);
            this.emotionChat.addChild(btnEmotion);
            btnEmotion.setScale(0.5,0.5)
        }
    }
 
    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        for(let btnEmotion of this.arrayEmotion) {
            btnEmotion.off("click", this.onClickChatEmotion, this);
        }
    }
 
    // start() {
    //     this.switchPnChat("EMOTION");
    // }
 
    private createButton(skeleton: sp.SkeletonData, customEventData: number) {
        let node = new cc.Node();
        node.width = 80;
        node.height = 80;
        node.anchorX = 0.5;
        node.anchorY = 0.5;
        node.ID_EMOIJI = customEventData;
        node.addComponent(cc.Button);
        let spriteNode = new cc.Node();
        let sprite = spriteNode.addComponent(sp.Skeleton);
        sprite.skeletonData = skeleton;
        sprite.setSkin("default");
        sprite.setAnimation(0, customEventData.toString(), true);
        sprite.defaultAnimation = customEventData.toString();
        console.log(spriteNode);
        node.addChild(spriteNode);

        spriteNode.position = cc.v3(0, 0,0);
        spriteNode.anchorX = 0.5;
        spriteNode.anchorY = 0.5;
        
        node.on("click", this.onClickChatEmotion, this);
        return node;
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
            let pk = new SHWESHANCmd.SendChatRoom()
            pk.a = 0;
            pk.b = this.edtInputChat.string.trim();
            pk.b = pk.b.replace(/(\r\n?|\n){1,}/g, ' ');
            SHWESHANConnector.instance.sendPacket(pk);
            this.edtInputChat.string = "";

            this.closeUIChat();
        }
    }
 
    public onClickChatQuick(event, id) {
        try {
            let pk = new SHWESHANCmd.SendChatRoom()
            pk.a = 0;
            pk.b = this.arrQuickChatLang[id];
            SHWESHANConnector.instance.sendPacket(pk);
            this.closeUIChat();
        } catch (error) {
            console.error("Error:", error);
        }
    }
 
    public onClickChatEmotion(event) {
        try {
            let pk = new SHWESHANCmd.SendChatRoom()
            pk.a = 1;
            pk.b = event.node.ID_EMOIJI;
            SHWESHANConnector.instance.sendPacket(pk);
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
 
}
 
