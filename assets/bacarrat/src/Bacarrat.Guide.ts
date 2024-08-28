import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import Bacarrat_GameManager from "./Bacarrat.GameManager";
import { SOUNDTYPE } from "./Bacarrat.SoundManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bacarrat_Guide extends cc.Component {

    @property(cc.WebView)
    webView: cc.WebView = null;

    linkGuide = 'https://media-global-boss.wiwatech.com/html/baccarat/guide_baccarat_'
    // https://media-global-boss.wiwatech.com/html/baccarat/guide_baccarat_en.html

    onEnable() {
        let lang = LanguageMgr.instance.getCurrentLanguage()
        const url = window.location.href;
        let urlSearchParams = new URLSearchParams(url.split('?')[1]);
        if (url && url.includes('?') && urlSearchParams && urlSearchParams.get("lang")) {
            lang = urlSearchParams.get("lang")
        }

        let link = this.linkGuide + lang + '.html';
        BGUI.ZLog.log('linkkkkkk-----> ', link);
        this.webView.url = "";
        this.webView.url = link;
    }

    onClosePopup() {
        Bacarrat_GameManager.instance.soundManager.playMusicByType(SOUNDTYPE.CLICK);
        this.node.removeFromParent();
    }
}
