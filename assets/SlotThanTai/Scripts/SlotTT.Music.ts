import SlotTTSetting from "./SlotTT.Setting";

const { ccclass, property } = cc._decorator;

export enum SLOT_MUSIC_TYPE {
  MAIN_MUSIC = 0,
}
export enum SLOT_SOUND_TYPE {
  BTN_CLICK = 0,
  BW_END = 1,
  BW_LOOP = 2,
  BW_START = 3,
  EXPAND_WILD = 4,
  EXPAND_WILD_PREMOVE = 5,
  EXPAND_WILD_VOICE_1 = 6,
  EXPAND_WILD_VOICE_2 = 7,
  EXPAND_WILD_VOICE_3 = 8,
  JP_END = 9,
  JP_LOOP = 10,
  JP_START = 11,
  JPRACE_BASIC_TICKING_1 = 12,
  JPRACE_BASIC_TICKING_2 = 13,
  JPRACE_BASIC_TICKING_3 = 14,
  JPRACE_COUNT_FULL_60 = 15,
  JPRACE_FINAL_TICKING_1 = 16,
  JPRACE_FINAL_TICKING_2 = 17,
  JPRACE_FINAL_TICKING_3 = 18,
  JPRACE_JINGLE_3 = 19,
  LINEWIN_LOOP = 20,
  LINEWIN_SINGLE_LINE_1 = 21,
  LINEWIN_SINGLE_LINE_2 = 22,
  LINEWIN_SINGLE_LINE_3 = 23,
  REEL_INTERUPT = 24,
  REEL_SPIN = 25,
  REEL_START = 26,
  REEL_STOP_1 = 27,
  REEL_STOP_2 = 28,
  REEL_STOP_3 = 29,
  SCORE_1A = 30,
  SCORE_1B = 31,
  SCORE_1C = 32,
  SCORE_2A = 33,
  SCORE_2B = 34,
  SCORE_2C = 35,
  SCORE_3 = 36,
  SCORE_4 = 37,
  WIN_ROLLUP = 38,
  WIN_ROLLUP_END = 39,
}

@ccclass
export default class SlotTTMusicManager extends cc.Component {
  public static instance: SlotTTMusicManager = null;
  @property(cc.AudioClip)
  public mainBGM: cc.AudioClip[] = [];

  @property(cc.AudioClip)
  public listAuds: cc.AudioClip[] = [];

  @property(cc.Node)
  public musicBtn: cc.Node = null;

  private _audioId: number = -1;
  private _fxId: number = -1;
  private _volume: number = 1;

  private musicStatus: boolean = true;

  onLoad() {
    SlotTTMusicManager.instance = this;
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
