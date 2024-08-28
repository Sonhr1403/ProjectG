// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import SHWESHANController from "./SHWESHAN.Controller";
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
  CLICK = 9,
}
@ccclass
export default class SoundController extends cc.Component {
  public static instance: SoundController = null;
  @property(cc.AudioClip)
  audioClips: cc.AudioClip[] = [];
  private isTurnOffSound = 0;
  private sfxVolume = null;
  private musicVolume = null;
  private _bgMusicId = -1;
  private _sfxOn = true;
  _oldAudioPath: "";
  _init = false;
  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start() {
    SoundController.instance = this;
  }
  playMusicByType(type) {
    if (this.isTurnOffSound) {
      switch (type) {
        case SOUNDTYPE.BACKGROUND:
          this.playBackground();
          break;
        default:
          this.playType(type);
          break;
      }
    }
  }

  playBackground() {
    if (this.audioClips[SOUNDTYPE.BACKGROUND]) {
      // this.playMusic(this.audioClips[SOUNDTYPE.CLICK])
      this.playMusic(this.audioClips[SOUNDTYPE.BACKGROUND]);
    }
  }

  playType(type) {
    if (this._sfxOn == true) {
      if (this.audioClips[type]) {
        this.playSfx(this.audioClips[type]);
      }
    }
  }

  stopMusicByType(type) {
    switch (type) {
      case SOUNDTYPE.BACKGROUND:
        this.stopBackground();
        break;
      default:
        this.stopType(type);
        break;
    }
  }
  stopBackground() {
    this.pauseMusic();
  }
  stopType(type) {
    this.pauseMusic();
  }
  setVolume(volume) {
    cc.sys.localStorage.setItem(
      "volume" + BGUI.UserManager.instance.mainUserInfo["id"],
      volume
    );
    this.sfxVolume = volume;
    this.musicVolume = volume;
    cc.audioEngine.setMusicVolume(volume);
    cc.audioEngine.setEffectsVolume(volume);
    if (this._bgMusicId > -1) {
      cc.audioEngine.setVolume(this._bgMusicId, volume);
    }
  }
  getVolume() {
    return cc.sys.localStorage.getItem(
      "volume" + BGUI.UserManager.instance.mainUserInfo["id"]
    )
      ? cc.sys.localStorage.getItem(
          "volume" + BGUI.UserManager.instance.mainUserInfo["id"]
        )
      : 0.5;
  }
  setOnVolume(on = 0) {
    this.isTurnOffSound = on == 0 ? 0 : 1;
    cc.log("setOnVolume", this.isTurnOffSound);
    cc.sys.localStorage.setItem(
      "onvolume" + BGUI.UserManager.instance.mainUserInfo["id"],
      this.isTurnOffSound ? 1 : 0
    );
    if (this.isTurnOffSound == 0) {
      this.pauseMusic();
    } else {
      this.resumePlay();
    }
  }

  getOnVolume() {
    return this.isTurnOffSound;
  }
  initData() {
    let volume = this.getVolume();
    let onVolume = cc.sys.localStorage.getItem(
      "onvolume" + BGUI.UserManager.instance.mainUserInfo["id"]
    )
      ? cc.sys.localStorage.getItem(
          "onvolume" + BGUI.UserManager.instance.mainUserInfo["id"]
        )
      : 1;
    this.setVolume(volume);
    this.setOnVolume(onVolume);
    this._init = true;
  }

  playSfx(res) {
    cc.audioEngine.play(res, false, this.sfxVolume);
  }

  toggleSfx() {
    this._sfxOn = !this._sfxOn;
    console.log("toggle",this._sfxOn)
  }

  playMusic(res) {
    cc.log("setOnVolume", this.isTurnOffSound);
    cc.log("this.musicVolume", this.musicVolume);
    if (this._bgMusicId > -1) {
      cc.audioEngine.stop(this._bgMusicId);
    }
    if (this.isTurnOffSound) {
      this._bgMusicId = cc.audioEngine.play(res, true, this.musicVolume);
    }
  }

  pauseMusic() {
    if (this._bgMusicId > -1) {
      cc.audioEngine.pause(this._bgMusicId);
    }
    this.stopAll();
    this.uncacheAll();
  }
  uncacheAll() {
    cc.audioEngine.uncacheAll();
  }

  stopAll() {
    cc.audioEngine.stopAll();
    this._bgMusicId = -1;
  }
  resumePlay() {
    if (this._bgMusicId > -1) {
      cc.audioEngine.resume(this._bgMusicId);
    } else {
      if (this._init) {
        var soundVolumn = this.getVolume();
        this._bgMusicId = cc.audioEngine.play(
          this.audioClips[SOUNDTYPE.BACKGROUND],
          true,
          soundVolumn
        );
      }
    }
  }
  stop() {
    if (this._bgMusicId > -1) {
      cc.audioEngine.stop(this._bgMusicId);
      this._bgMusicId = -1;
    }
    this._oldAudioPath = "";
  }
  play(res) {
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
  // update (dt) {}
}
