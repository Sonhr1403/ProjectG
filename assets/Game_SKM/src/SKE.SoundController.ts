const { ccclass, property } = cc._decorator;

export enum SOUNDTYPE {
    BACKGROUND = 0,
    DEALCARDS = 1,
    BET = 2,
    RUNMONEY = 3,
    NEWGAME = 4,
    WIN = 5,
    LOSE = 6,
    CHANGEBANKER = 6,
    START_COMPARE = 7,
    SHAN = 8,
    CLICK = 9
};

@ccclass
export default class SKESoundController extends cc.Component {
    public static instance: SKESoundController = null;

    @property(cc.AudioClip)
    public audioClips: cc.AudioClip[] = [];

    private isTurnOffSound = 0;
    private musicVolume = null;
    private _bgMusicId = -1;
    public _oldAudioPath = "";
    public _init: boolean = false
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        SKESoundController.instance = this
    }

    public playMusicByType(type) {
        if (this.isTurnOffSound) {
            switch (type) {
                case SOUNDTYPE.BACKGROUND: this.playBackground()
                    break;

                default:
                    this.playType(type)
                    break;
            }
        }
    }

    public playBackground() {
        if (this.audioClips[SOUNDTYPE.BACKGROUND]) {
            this.playMusic(this.audioClips[SOUNDTYPE.BACKGROUND])
        }
    }

    public playType(type) {
        if (this.audioClips[type]) {
            this.playSfx(this.audioClips[type])
        }
    }

    public stopMusicByType(type) {
        switch (type) {
            case SOUNDTYPE.BACKGROUND:
                this.stopBackground()
                break;

            default: this.stopType(type)
                break;
        }
    }

    public stopBackground() {
        this.pauseMusic()
    }

    public stopType(type) {
        this.pauseMusic()
    }

    public setVolume(volume) {
        cc.sys.localStorage.setItem("volume" + BGUI.UserManager.instance.mainUserInfo["id"], volume)
        this.musicVolume = volume;
        cc.audioEngine.setMusicVolume(volume)
        cc.audioEngine.setEffectsVolume(volume)
        if (this._bgMusicId > -1) {
            cc.audioEngine.setVolume(this._bgMusicId, volume);
        }
    }

    public getVolume() {
        return cc.sys.localStorage.getItem("volume" + BGUI.UserManager.instance.mainUserInfo["id"]) ? cc.sys.localStorage.getItem("volume" + BGUI.UserManager.instance.mainUserInfo["id"]) : 0.5;
    }

    public setOnVolume(on = 0) {
        this.isTurnOffSound = (on == 0) ? 0 : 1;
        cc.sys.localStorage.setItem("onvolume" + BGUI.UserManager.instance.mainUserInfo["id"], this.isTurnOffSound ? 1 : 0)
        if (this.isTurnOffSound == 0) {
            this.pauseMusic()
        } else {
            this.resumePlay();
        }

    }

    public getOnVolume() {
        return this.isTurnOffSound;
    }

    public initData() {
        let volume = this.getVolume()
        let onVolume = cc.sys.localStorage.getItem("onvolume" + BGUI.UserManager.instance.mainUserInfo["id"]) ? cc.sys.localStorage.getItem("onvolume" + BGUI.UserManager.instance.mainUserInfo["id"]) : 1;
        this.setVolume(volume)
        this.setOnVolume(onVolume)
        this._init = true;
    }

    public playSfx(res) {
        cc.audioEngine.play(res, false, this.musicVolume);
    }

    public playMusic(res) {
        if (this._bgMusicId > -1) {
            cc.audioEngine.stop(this._bgMusicId);
        }
        if (this.isTurnOffSound) {
            this._bgMusicId = cc.audioEngine.play(res, true, this.musicVolume);
        }
    }

    public pauseMusic() {
        if (this._bgMusicId > -1) {
            cc.audioEngine.pause(this._bgMusicId);
        }
        this.stopAll()
        this.uncacheAll()
    }

    public uncacheAll() {
        cc.audioEngine.uncacheAll();
    }

    public stopAll() {
        cc.audioEngine.stopAll();
        this._bgMusicId = -1;
    }

    public resumePlay() {
        if (this._bgMusicId > -1) {
            cc.audioEngine.resume(this._bgMusicId);
        } else {
            if (this._init) {
                var soundVolumn = this.getVolume();
                this._bgMusicId = cc.audioEngine.play(this.audioClips[SOUNDTYPE.BACKGROUND], true, soundVolumn);
            }
        }
    }

    public stop() {
        if (this._bgMusicId > -1) {
            cc.audioEngine.stop(this._bgMusicId);
            this._bgMusicId = -1;
        }
        this._oldAudioPath = "";
    }

    public play(res) {
        if (this._oldAudioPath == res) {
            return;
        }
        this._oldAudioPath = res;
        if (this.getVolume()) {
            return;
        }
        if (this._bgMusicId > -1) {
            cc.audioEngine.stop(this._bgMusicId);
        }
        this._bgMusicId = cc.audioEngine.play(res, true, this.getVolume());
    }
}
