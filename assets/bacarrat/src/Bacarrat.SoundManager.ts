
const { ccclass, property } = cc._decorator;
export enum SOUNDTYPE {
  BACKGROUND = 0,
  BET = 1,
  DEALCARDS = 2,
  FLIPCARDS = 3,
  WIN = 4,
  LOSE = 5,
  RUNMONEY = 6,
  CLICK = 7,
}
@ccclass
export default class Bacarrat_SoundManager extends cc.Component {

  @property(cc.AudioClip)
  public audioClips: cc.AudioClip[] = [];

  public isTurnOffSound = 1;
  public isTurnOffMusic = 1;
  private sfxVolume = 1;
  private musicVolume = 1;
  private _bgMusicId = -1;
  _oldAudioPath: "";
  _init = false;
  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    // TODO
  }

  public initData() {
    this.isTurnOffMusic = 1;
    this.isTurnOffSound = 1;
    this.setVolume(.5);
    this.setOnVolume(.5);
    this._init = true;

    this.playBackground();
  }

  public playMusicByType(type) {
    BGUI.ZLog.log('playMusicByType = ', type, this.isTurnOffSound)
    if (this.isTurnOffSound == 1) {
      this.playType(type);
    }
  }

  public playBackground() {
    BGUI.ZLog.log("playBackground = = ", this.isTurnOffSound);
    BGUI.ZLog.log("isTurnOffMusic = ", this.isTurnOffMusic);
    if (this.isTurnOffMusic == 1) {
      this.playMusic(this.audioClips[SOUNDTYPE.BACKGROUND]);
    }
  }

  public stopMusicByType(type) {
    switch (type) {
      case SOUNDTYPE.BACKGROUND:
        this.stopBackground();
        break;
      default:
        this.stopType(type);
        break;
    }
  }

  public stopBackground() {
    this.pauseMusic();
  }

  public pauseMusic() {
    if (this._bgMusicId > -1) {
      cc.audioEngine.pause(this._bgMusicId);
    }
    this.stopAll();
    this.uncacheAll();
  }

  public playType(type) {
    if (this.audioClips[type]) {
      this.playSfx(this.audioClips[type]);
    }
  }

  public stopType(type) {
    this.pauseMusic();
  }


  public setVolume(volume) {
    this.sfxVolume = volume;
    this.musicVolume = volume;
    cc.audioEngine.setMusicVolume(volume);
    cc.audioEngine.setEffectsVolume(volume);
    if (this._bgMusicId > -1) {
      cc.audioEngine.setVolume(this._bgMusicId, volume);
    }
  }

  public getVolume() {
    return this.musicVolume;
  }

  public setOnVolume(on = 0) {
    this.isTurnOffMusic = on == 0 ? 0 : 1;

    if (this.isTurnOffMusic == 0) {
      this.pauseMusic();
    } else {
      this.resumePlay();
    }
  }

  public getOnVolume() {
    return this.isTurnOffMusic;
  }

  public playSfx(res) {
    BGUI.ZLog.log('playSfx = ', this.musicVolume)
    cc.audioEngine.play(res, false, this.musicVolume);
  }

  public playMusic(res) {
    if (this._bgMusicId > -1) {
      cc.audioEngine.stop(this._bgMusicId);
    }

    if (this.isTurnOffMusic) {
      this._bgMusicId = cc.audioEngine.play(res, true, this.musicVolume);
    }
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
        this._bgMusicId = cc.audioEngine.play(
          this.audioClips[SOUNDTYPE.BACKGROUND],
          true,
          soundVolumn
        );
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
