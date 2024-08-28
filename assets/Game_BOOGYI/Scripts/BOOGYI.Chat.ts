import BOOGYIConnector from "../../lobby/scripts/network/wss/BOOGYIConnector";
import BOOGYICmd from "./BOOGYI.Cmd";
import BOOGYIController from "./BOOGYI.Controller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BOOGYIChat extends cc.Component {

    @property(cc.EditBox)
    public edtInputChat: cc.EditBox = null;

    @property(cc.Node)
    public viewEmotion: cc.Node = null;

    @property(cc.Node)
    public viewQuickChat: cc.Node = null;

    @property(cc.Node)
    public emotionChatContent: cc.Node = null;

    private readonly arrQuickChatLang = [
        "boogyi.quick_chat_1",
        "boogyi.quick_chat_2",
        "boogyi.quick_chat_3",
        "boogyi.quick_chat_4",
        "boogyi.quick_chat_5",
        "boogyi.quick_chat_6",
        "boogyi.quick_chat_7",
        "boogyi.quick_chat_8",
        "boogyi.quick_chat_9",
        "boogyi.quick_chat_10",
        "boogyi.quick_chat_11",
        "boogyi.quick_chat_12"
    ];

    private arrayEmotion: Array<cc.Node> = [];

    onLoad() {
        // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.emotionChatContent.removeAllChildren();
        let emotemp = BOOGYIController.instance.emo;
        for (let i = 1; i <= 16; i++) {

            let btnEmotion = this.createButton(emotemp, i);
            this.arrayEmotion.push(btnEmotion);
            this.emotionChatContent.addChild(btnEmotion);
        }
        this.switchPnChat("EMOTION");
    }

    onDestroy() {
        // cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        for(let btnEmotion of this.arrayEmotion) {
            btnEmotion.off("click", this.onClickChatEmotion, this);
        }
    }

    // start() {}

    private createButton(skeleton: sp.SkeletonData, customEventData: number) :cc.Node {
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
        node.addChild(spriteNode);

        spriteNode.position = cc.v3(0, 0,0);
        spriteNode.anchorX = 0.5;
        spriteNode.anchorY = 0.5;
        spriteNode.setScale(0.5);
        
        node.on("click", this.onClickChatEmotion, this);
        return node;
    }

    public switchQuickChat() {
        this.switchPnChat("QUICK");
    }

    public switchEmotionChatContent() {
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
            let pk = new BOOGYICmd.SendChatRoom();
            pk.a = 0;
            let str = this.edtInputChat.string.trim();
            str = str.replace(/(\r\n?|\n){1,}/g, ' ');
            pk.b = str;
            BOOGYIConnector.instance.sendPacket(pk);
            this.edtInputChat.string = "";
            this.closeUIChat();
        }
    }

    public onClickChatQuick(event, id) {
        try {
            let pk = new BOOGYICmd.SendChatRoom()
            pk.a = 0;
            pk.b = this.arrQuickChatLang[id];
            BOOGYIConnector.instance.sendPacket(pk);
            this.closeUIChat();

            if(!BOOGYIController.instance.isPlayerInteract){
              BOOGYIController.instance.isPlayerInteract = true;
            }

        } catch (error) {
            console.error("Error:", error);
        }
    }

    public onClickChatEmotion(event) {
        try {
            let pk = new BOOGYICmd.SendChatRoom()
            pk.a = 1;
            pk.b = event.node.ID_EMOIJI;
            BOOGYIConnector.instance.sendPacket(pk);
            this.closeUIChat();

            if(!BOOGYIController.instance.isPlayerInteract){
              BOOGYIController.instance.isPlayerInteract = true;
            }

        } catch (error) {
            console.error("Error", error);
        }
    }

    // public onKeyUp(event) {
    //     switch (event.keyCode) {
    //         case cc.macro.KEY.enter:
    //             this.sendChatText();
    //             break;
    //     }
    // }

    public closeUIChat() {
        this.node.active = false;
        if(!BOOGYIController.instance.isPlayerInteract){
            BOOGYIController.instance.isPlayerInteract = true;
          }
    }

}
