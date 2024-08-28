import Chat_Popup from "../../chat/scripts/Chat.Popup";
import Bacarrat_GameManager from "./Bacarrat.GameManager";
import { SOUNDTYPE } from "./Bacarrat.SoundManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bacarrat_Popup extends cc.Component {

    onEnable() {
        this.showGUIChat();
    }

    onClickMenu() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        let bundle = "bacarrat";
        let prfAttendance = "res/prefabs/GUI_MENU";
        BGUI.BundleManager.instance.getPrefabFromBundle(prfAttendance, bundle, (prf: cc.Prefab) => {
            let guiComp = cc.instantiate(prf);
            this.node.addChild(guiComp)
        })
    }

    onClickHistory() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        let bundle = "bacarrat";
        let prfAttendance = "res/prefabs/GUI_HISTORY";
        BGUI.BundleManager.instance.getPrefabFromBundle(prfAttendance, bundle, (prf: cc.Prefab) => {
            let guiComp = cc.instantiate(prf);
            this.node.addChild(guiComp)
        })
    }
    onClickGuide() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        let bundle = "bacarrat";
        let prfAttendance = "res/prefabs/GUI_GUIDE";
        BGUI.BundleManager.instance.getPrefabFromBundle(prfAttendance, bundle, (prf: cc.Prefab) => {
            let guiComp = cc.instantiate(prf);
            this.node.addChild(guiComp)
        })
    }
    onClickSetting() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        let bundle = "bacarrat";
        let prfAttendance = "res/prefabs/GUI_SETTING";
        BGUI.BundleManager.instance.getPrefabFromBundle(prfAttendance, bundle, (prf: cc.Prefab) => {
            let guiComp = cc.instantiate(prf);
            this.node.addChild(guiComp)
        })
    }

    showGUIChat() {
        let bundle = "Chat";
        let prfAttendance = "prefabs/GUI_CHAT";
        BGUI.BundleManager.instance.getPrefabFromBundle(prfAttendance, bundle, (prf: cc.Prefab) => {
            let guiComp = cc.instantiate(prf);
            guiComp.name = "GUI_CHAT"
            guiComp.getComponent(Chat_Popup).setPosUICHAT(1);
            this.node.addChild(guiComp)
        })
    }

    onClickChat() {
        let chat = this.node.getChildByName('GUI_CHAT');
        if (!chat) {
            this.showGUIChat();
            chat = this.node.getChildByName('GUI_CHAT');
        }

        chat.getChildByName('mask').active = true;
        chat.getChildByName('UI_CHAT').active = true;
    }

    onClickSoiCau() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        let bundle = "bacarrat";
        let prfAttendance = "res/prefabs/GUI_SOI_CAU";
        BGUI.BundleManager.instance.getPrefabFromBundle(prfAttendance, bundle, (prf: cc.Prefab) => {
            let guiComp = cc.instantiate(prf);
            this.node.addChild(guiComp)
        })
    }

    onClickSoiCauExtend() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        let bundle = "bacarrat";
        let prfAttendance = "res/prefabs/GUI_SOI_CAU_EXTEND";
        BGUI.BundleManager.instance.getPrefabFromBundle(prfAttendance, bundle, (prf: cc.Prefab) => {
            let guiComp = cc.instantiate(prf);
            this.node.addChild(guiComp)
        })
    }

    onClickMorePlayer() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        let bundle = "bacarrat";
        let prfAttendance = "res/prefabs/GUI_MORE_PLAYER";
        BGUI.BundleManager.instance.getPrefabFromBundle(prfAttendance, bundle, (prf: cc.Prefab) => {
            let guiComp = cc.instantiate(prf);
            this.node.addChild(guiComp)
        })
    }

    onClosePopup() {
        this.node.removeFromParent();
    }
}
