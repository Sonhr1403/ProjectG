const { ccclass, property } = cc._decorator;

export enum SLOT_MUSIC_TYPE {
  INTRO_MUSIC = 0,
  MAIN_MUSIC = 1,
  FREEGAME_MUSIC = 2,
}
export enum SLOT_SOUND_TYPE {
  BIG_WIN_CHANGE_LVL = 0,
  BTN_BUYFEATURE = 1,
  BTN_CLICK = 2,
  BUYFEATURE_POPUP = 3,
  FREE_GAME_COIN_FLY = 4,
  FREE_GAME_COIN_HIT = 5,
  FREE_GAME_SELECTION = 6,
  FREE_GAME_TOTAL_WIN = 7,
  KINGKONG_POPOUT = 8,
  MEGA_WIN = 19,
  REEL_FASTSPIN = 10,
  REEL_SPEEDUP = 11,
  REEL_SPIN = 12,
  REEL_STOP1 = 13,
  REEL_STOP2 = 14,
  REEL_STOP3 = 15,
  REEL_STOP4 = 16,
  REEL_STOP5 = 17,
  REEL_STOP6 = 18,
  REEL_STOP7 = 19,
  SPIN_BTN = 20,
  SYMBOL_EXPLODE = 21,
  SYMBOL_SCATTERHIT1 = 22,
  SYMBOL_SCATTERHIT2 = 23,
  SYMBOL_SCATTERHIT3 = 24,
  SYMBOL_SCATTERHIT4 = 25,
  SYMBOL_SCATTERHIT5 = 26,
  SYMBOL_SCATTERHIT6 = 27,
  SYMBOL_SCATTERTRIGGER = 28,
  SYMBOL_WILDTRANSFORM = 29,
  TAKE_WIN = 30,
  TRIGGER_DROP = 31,
  ULTRA_COUNTING = 32,
  ULTRA_FIRE = 33,
  ULTRA_TAKEWIN = 34,
  ULTRA_WINNING = 35,
  WIN_LVL1 = 36,
  WIN_LVL2 = 37,
  WIN_LVL3 = 38,
}

@ccclass
export default class SlotKKMusicManager extends cc.Component {
  public static instance: SlotKKMusicManager = null;
  @property(cc.AudioClip)
  public mainBGM: cc.AudioClip[] = [];

  @property(cc.AudioClip)
  public listAuds: cc.AudioClip[] = [];

  @property(cc.Node)
  public musicBtn: cc.Node[] = [];

  private _audioId: number = -1;
  private _fxId: number = -1;
  private _volume: number = 1;

  private musicStatus: boolean = true;

  onLoad() {
    SlotKKMusicManager.instance = this;
  }

  public init() {
    this.setSystemVolume(1);
  }

  public getSystemVolume() {
    return this._volume;
  }

  public setSystemVolume(volume: number) {
    this._volume = volume;
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

  public playTypeLoop(id: number) {
    cc.audioEngine.stop(this._fxId);
    let audioClip = this.listAuds[id];
    if (audioClip && this.musicStatus) {
      this._fxId = cc.audioEngine.play(audioClip, false, this._volume);
    }
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

  private onClickMusic() {
    this.musicStatus = !this.musicStatus;
    this.updateMusicBtn();
  }

  private updateMusicBtn() {
    if (this.musicStatus) {
      this.musicBtn[0].active = true;
      this.musicBtn[1].active = false;
      this.playSlotMusic(SLOT_MUSIC_TYPE.MAIN_MUSIC);
    } else {
      this.musicBtn[0].active = false;
      this.musicBtn[1].active = true;
      this.stopAll();
    }
  }
}
