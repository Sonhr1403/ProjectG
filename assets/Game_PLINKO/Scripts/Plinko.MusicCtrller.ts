const { ccclass, property } = cc._decorator;

export enum PLINKO_SOUND_TYPE {
  BACKGROUND = 0,
  START_DROP = 1,
  COLLIDE_PIN = 2,
  WIN = 3,
  LOSE = 4,
}

@ccclass
export default class PlinkoMusicCtrler extends cc.Component {
  public static instance: PlinkoMusicCtrler = null;
  @property(cc.AudioClip)
  public mainBGM: cc.AudioClip = null;
  @property(cc.AudioClip)
  public startDrop: cc.AudioClip = null;
  @property(cc.AudioClip)
  public collidePin: cc.AudioClip = null;
  @property(cc.AudioClip)
  public winSFX: cc.AudioClip = null;
  @property(cc.AudioClip)
  public loseSFX: cc.AudioClip = null;

  private _audioId: number = -1;
  private _fxId: number = -1;
  private _volume: number = 1;

  private musicStatus: boolean = true;

  onLoad() {
    PlinkoMusicCtrler.instance = this;
  }

  public init() {
    this.setSystemVolume(0.5);
  }

  public getSystemVolume() {
    return this._volume;
  }

  public setSystemVolume(volume: number) {
    this._volume = volume;
  }

  public playType(type: number) {
    let audioClip: cc.AudioClip = null;
    switch (type) {
      case PLINKO_SOUND_TYPE.BACKGROUND:
        audioClip = this.mainBGM;
        this.setSystemVolume(1);
        break;
      case PLINKO_SOUND_TYPE.START_DROP:
        audioClip = this.startDrop;
        this.setSystemVolume(1);
        break;
      case PLINKO_SOUND_TYPE.COLLIDE_PIN:
        audioClip = this.collidePin;
        // this.setSystemVolume(0.15);
        break;
      case PLINKO_SOUND_TYPE.WIN:
        audioClip = this.winSFX;
        this.setSystemVolume(0.3);
        break;
      case PLINKO_SOUND_TYPE.LOSE:
        audioClip = this.loseSFX;
        this.setSystemVolume(0.3);
        break;
    }
    if (audioClip && this.musicStatus) {
      this.playActionMusic(audioClip);
    }
  }

  private playActionMusic(audioClip: cc.AudioClip) {
    if (audioClip == this.collidePin) {
        cc.audioEngine.play(audioClip, false, 0.2)
    } else {
      cc.audioEngine.play(audioClip, false, this._volume);
    }
  }

  public playBGMusic(audioClip: cc.AudioClip) {
    // cc.audioEngine.stop(this._audioId);
    this._audioId = cc.audioEngine.play(audioClip, true, this._volume);
  }

  public playTypeLoop(audioClip: cc.AudioClip) {
    cc.audioEngine.stop(this._fxId);
    this._fxId = cc.audioEngine.play(audioClip, true, this._volume);
  }

  public stopPlayLoop() {
    cc.audioEngine.stop(this._fxId);
  }

  public setMusicStatus(status: boolean) {
    this.musicStatus = status;
  }

  public getMusicStatus() {
    return this.musicStatus;
  }

  public stopAll() {
    cc.audioEngine.stopAll();
  }
}
