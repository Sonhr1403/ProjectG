import Chat_Popup from "../../chat/scripts/Chat.Popup";
import DragonTiger_GameManager from "./DragonTiger.GameManager";
import { SOUNDTYPE } from "./DragonTiger.SoundManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonTiger_Popup extends cc.Component {

    onEnable() {
        this.showGUIChat();
    }

    onClickMenu() {
        DragonTiger_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        let bundle = "GameLongHo";
        let prfAttendance = "prefabs/GUI_MENU";
        BGUI.BundleManager.instance.getPrefabFromBundle(prfAttendance, bundle, (prf: cc.Prefab) => {
            let guiComp = cc.instantiate(prf);
            this.node.addChild(guiComp)
        })
    }

    onClickRank() {
        DragonTiger_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        let bundle = "GameLongHo";
        let prfAttendance = "prefabs/GUI_RANK";
        BGUI.BundleManager.instance.getPrefabFromBundle(prfAttendance, bundle, (prf: cc.Prefab) => {
            let guiComp = cc.instantiate(prf);
            this.node.addChild(guiComp)
        })
    }

    onClickGuide() {
        DragonTiger_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        let bundle = "GameLongHo";
        let prfAttendance = "prefabs/GUI_GUIDE";
        BGUI.BundleManager.instance.getPrefabFromBundle(prfAttendance, bundle, (prf: cc.Prefab) => {
            let guiComp = cc.instantiate(prf);
            this.node.addChild(guiComp)
        })
    }

    onClickHistory() {
        DragonTiger_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        let bundle = "GameLongHo";
        let prfAttendance = "prefabs/GUI_HISTORY";
        BGUI.BundleManager.instance.getPrefabFromBundle(prfAttendance, bundle, (prf: cc.Prefab) => {
            let guiComp = cc.instantiate(prf);
            this.node.addChild(guiComp)
        })
    }

    onClickSetting() {
        DragonTiger_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        let bundle = "GameLongHo";
        let prfAttendance = "prefabs/GUI_SETTING";
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
            guiComp.getComponent(Chat_Popup).setPosUICHAT(0);
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
        DragonTiger_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        let bundle = "GameLongHo";
        let prfAttendance = "prefabs/GUI_SOI_CAU";
        BGUI.BundleManager.instance.getPrefabFromBundle(prfAttendance, bundle, (prf: cc.Prefab) => {
            let guiComp = cc.instantiate(prf);
            this.node.addChild(guiComp)
        })
    }

    onClickMorePlayer() {

        DragonTiger_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK)
        let bundle = "GameLongHo";
        let prfAttendance = "prefabs/GUI_MORE_PLAYER";
        BGUI.BundleManager.instance.getPrefabFromBundle(prfAttendance, bundle, (prf: cc.Prefab) => {
            let guiComp = cc.instantiate(prf);
            this.node.addChild(guiComp)
        })
    }

    onClosePopup() {
        this.node.removeFromParent();
    }
}
