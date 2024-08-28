import { LanguageMgr } from "../../framework/localize/LanguageMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Chat_Popup extends cc.Component {

    @property(cc.Node)
    UI_CHAT: cc.Node = null

    @property(cc.EditBox)
    public edtInputChat: cc.EditBox = null;

    @property(cc.Node)
    public viewEmotion: cc.Node = null;

    @property(cc.Node)
    public viewQuickChat: cc.Node = null;

    @property(sp.SkeletonData)
    public emo: sp.SkeletonData = null;

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
        let emotemp = this.emo;
        for (let i = 1; i <= 16; i++) {
            let btnEmotion = this.createButton(emotemp, i);
            this.arrayEmotion.push(btnEmotion);
            this.emotionChatContent.addChild(btnEmotion);
        }
        this.switchPnChat("EMOTION");
    }

    onDestroy() {
        // cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        for (let btnEmotion of this.arrayEmotion) {
            btnEmotion.off("click", this.onClickChatEmotion, this);
        }
    }

    // start() {}

    setPosUICHAT(type: number) {
        console.log('setPosUICHAT = ', type)
        switch (type) {
            case 0:
                this.UI_CHAT.getComponent(cc.Widget).isAlignLeft = true
                this.UI_CHAT.getComponent(cc.Widget).left = 20
                break;
            case 1:
                this.UI_CHAT.getComponent(cc.Widget).isAlignRight = true
                this.UI_CHAT.getComponent(cc.Widget).right = 20
                break;
            default:
                break;
        }

        console.log("this.UI_CHAT.position.x = ", this.UI_CHAT.position.x)
    }

    private createButton(skeleton: sp.SkeletonData, customEventData: number): cc.Node {
        let node = new cc.Node();
        node.width = 80;
        node.height = 80;
        node.anchorX = 0.5;
        node.anchorY = 0.5;
        node.name = customEventData.toString();
        node.addComponent(cc.Button);
        let spriteNode = new cc.Node();
        let sprite = spriteNode.addComponent(sp.Skeleton);
        sprite.skeletonData = skeleton;
        sprite.premultipliedAlpha = false
        sprite.setSkin("default");
        sprite.setAnimation(0, customEventData.toString(), true);
        sprite.defaultAnimation = customEventData.toString();
        node.addChild(spriteNode);

        spriteNode.position = cc.v3(0, 0, 0);
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
        BGUI.ZLog.log("switchPnChat...............-> ");
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
        BGUI.ZLog.log("sendChatText...............-> ");
        if (this.edtInputChat.string.trim().length > 0) {
            let str = this.edtInputChat.string.trim();
            str = str.replace(/(\r\n?|\n){1,}/g, ' ');
            this.edtInputChat.string = "";

            BGUI.EventDispatch.instance.emit("SEND_CHAT_TEXT", str);
            this.onClosePopup();
        }
    }

    public onClickChatQuick(event, id) {
        BGUI.ZLog.log("onClickChatQuick...............-> ");

        BGUI.EventDispatch.instance.emit("SEND_CHAT_TEXT", LanguageMgr.getString(this.arrQuickChatLang[id]));
        this.onClosePopup();
    }

    public onClickChatEmotion(event) {
        BGUI.ZLog.log("onClickChatEmotion...............-> ");

        BGUI.EventDispatch.instance.emit("SEND_CHAT_EMO", event.node.name);
        this.onClosePopup();
    }

    onClosePopup() {
        this.node.getChildByName('mask').active = false;
        this.node.getChildByName('UI_CHAT').active = false;
    }

    onEditingReturn(event) {
        this.sendChatText();
    }
}
