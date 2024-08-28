import Chat_Emo from "./Chat.Emo";
import Chat_Text from "./Chat.Text";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Chat_Manager extends cc.Component {

    onEnable() {
        BGUI.EventDispatch.instance.add("SHOW_CHAT_EMO", this.showChatEmo, this);
        BGUI.EventDispatch.instance.add("SHOW_CHAT_TEXT", this.showChatText, this);
    }

    onDisable() {
        BGUI.EventDispatch.instance.remove("SHOW_CHAT_EMO", this.showChatEmo, this);
        BGUI.EventDispatch.instance.remove("SHOW_CHAT_TEXT", this.showChatText, this);
    }

    showChatText(dataChat) {
        let nodeP = dataChat.node
        this.hideAllEffectChat(nodeP);

        let bundle = "Chat";
        let prfChat = "prefabs/CHAT_TEXT";
        BGUI.BundleManager.instance.getPrefabFromBundle(prfChat, bundle, (prf: cc.Prefab) => {
            let chatText = cc.instantiate(prf);
            chatText.name = 'CHAT_TEXT'
            let comp = chatText.getComponent(Chat_Text)
            comp.setDataChat(dataChat.content, dataChat.vt);

            chatText.y = 100;
            if (dataChat.vt === 0) {
                chatText.x = 180;
            } else {
                chatText.x = -180;
            }

            nodeP.addChild(chatText, 999);
        })

        cc.tween(nodeP)
            .delay(3)
            .call(() => {
                if (nodeP.getChildByName('CHAT_TEXT')) {
                    nodeP.getChildByName('CHAT_TEXT').removeFromParent();
                }
            })
            .start();
    }

    showChatEmo(dataChat) {

        let nodeP = dataChat.node
        this.hideAllEffectChat(nodeP);

        let bundle = "Chat";
        let prfChat = "prefabs/CHAT_EMO";
        BGUI.BundleManager.instance.getPrefabFromBundle(prfChat, bundle, (prf: cc.Prefab) => {
            let chatEmo = cc.instantiate(prf);
            chatEmo.name = 'CHAT_EMO'
            let comp = chatEmo.getComponent(Chat_Emo)
            comp.setDataEmo(dataChat.content);
            nodeP.addChild(chatEmo, 999);
        })

        cc.tween(nodeP)
            .delay(3)
            .call(() => {
                if (nodeP.getChildByName('CHAT_EMO')) {
                    nodeP.getChildByName('CHAT_EMO').removeFromParent();
                }
            })
            .start();
    }

    hideAllEffectChat(nodeP: cc.Node) {
        nodeP.stopAllActions()
        if (nodeP.getChildByName('CHAT_EMO')) {
            nodeP.getChildByName('CHAT_EMO').removeFromParent()
        }
        if (nodeP.getChildByName('CHAT_TEXT')) {
            nodeP.getChildByName('CHAT_TEXT').removeFromParent()
        }
    }
}
