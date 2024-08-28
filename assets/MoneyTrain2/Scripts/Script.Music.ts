
const { ccclass, property } = cc._decorator;

export enum SLOT_MUSIC_TYPE {
  BASEGAME_BGM = 0,
  FREEGAME_BGM = 1
}
export enum SLOT_SOUND_TYPE {
  BIGWIN = 0,
  BOOKING_LOOG1 = 1,
  BUTTON = 2,
  BW_BIGWIN = 3,
  BW_MEGABIGWIN = 4,
  BW_SUPPERBIGWIN = 5,
  COLLECTION = 6,
  EFTCHARGING = 7,
  FEATURETENSIONSOUND_1 = 8,
  FEATURETENSIONSOUND_2 = 9,
  FEATURETENSIONSOUND_3 = 10,
  FEATURETENSIONSOUND_4 = 11,
  FEATURETENSIONSOUND_5 = 12,
  FEATURETRIGGERSOUND = 13,
  FIREWORKS = 14,
  JACKPOT = 15,
  JACKPOT_NOTICE = 16,
  REALNUDGE = 17,
  REALSPINNING = 18,
  REALSTOPSOUND = 19,
  SCATTER_1S = 20,
  SCATTER_2S = 21,
  SCATTER_4S = 22,
  SPINNINGSOUND = 23,
  SPINNINGSOUNDWATER = 24,
  TRANSITIONTOFREE = 25,
  WILDMULTIPLIER_OPENX2 = 26,
  WILDMULTIPLIER_OPENX3 = 27,
  WINNINGSOUND_1 = 28,
  WINSUMMARY_1 = 29
}

@ccclass
export default class MoneyTrain2MusicManager extends cc.Component {
  public static instance: MoneyTrain2MusicManager = null;
  @property(cc.AudioClip)
  public mainBGM: cc.AudioClip[] = [];

  @property(cc.AudioClip)
  public listAuds: cc.AudioClip[] = [];

  private _audioId: number = -1;
  private _fxId: number = -1;
  private _volume: number = 1;

  private musicStatus: boolean = true;

  onLoad() {
    MoneyTrain2MusicManager.instance = this;
  }

  onDestroy() {}

  public init() {
    this.setSystemVolume(1);
  }

  public getSystemVolume() {
    return this._volume;
  }

  public setSystemVolume(volume: number) {
    this._volume = volume;
    cc.audioEngine.setVolume(this._audioId, volume);
  }

  public playType(type: number) {
    let audioClip = this.listAuds[type];
    if (audioClip && this.musicStatus) {
      this.playActionMusic(audioClip);
    }
  }

  private playActionMusic(audioClip: cc.AudioClip) {
    cc.audioEngine.play(audioClip, false, this._volume);
  }

  public playSlotMusic(id: number) {
    cc.audioEngine.stop(this._audioId);
    let audioClip = this.mainBGM[id];
    if (audioClip && this.musicStatus) {
      this._audioId = cc.audioEngine.play(audioClip, true, this._volume);
    }
  }

  public playLoop(id: number) {
    cc.audioEngine.stop(this._fxId);
    let audioClip = this.listAuds[id];
    if (audioClip && this.musicStatus) {
      this._fxId = cc.audioEngine.play(audioClip, true, this._volume);
    }
  }

  public stopPlayLoop() {
    cc.audioEngine.stop(this._fxId);
  }

  public stopSlotMusic() {
    cc.audioEngine.stop(this._audioId);
  }

  public pauseSlotMusic() {
    cc.audioEngine.pause(this._audioId);
  }

  public resumeSlotMusic() {
    cc.audioEngine.resume(this._audioId);
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
