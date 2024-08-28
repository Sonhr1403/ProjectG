const { ccclass, property } = cc._decorator;

export enum SLOT_SOUND_TYPE {
  BACKGROUND = 0,
  START_SPIN = 1,
  SCATTER = 3,
  PILLAR_APPEAR = 4,
  PILLAR_BREAK = 5,
  JACKPOT_WIN_MINOR = 6,
  JACKPOT_WIN_MINI = 7,
  JACKPOT_WIN_MAJOR = 8,
  NORMAL_WIN = 9,
  WIN_BIG = 10,
  WIN_MEGA = 11,
  WIN_SUPER_MEGA = 12,
  BTN_CLICK = 12,
  STOP_SPIN = 13,
  REEL_START = 14,
  REEL_END = 15,
  WIN_BIG_END = 16,
  WIN_MEGA_END = 17,
  WIN_SUPER_MEGA_END = 18,
  LIGHT_EFFECT = 19,
  LIGHT_EFFECT_END = 20,
  FREESPIN_NUMBER_1 = 21,
  FREESPIN_NUMBER_2 = 22,
  FREESPIN_NUMBER_3 = 23,
  WILD_X2 = 22,
  WILD_X3 = 23,
  FLEX_MARK_APPEAR = 24,
  FLEX_MARK_END = 25,
  FREESPIN_NUMBER_1_APPEAR = 26,
  FREESPIN_NUMBER_2_APPEAR = 27,
  FREESPIN_NUMBER_3_APPEAR = 28,
  FREESPIN_REEL_APPEAR = 29,
  FREESPIN_BGM = 30,
  WIN_LIGHT_EFFECT = 31,
}

@ccclass
export default class GenZMusicManager extends cc.Component {
  public static instance: GenZMusicManager = null;
  @property(cc.AudioClip)
  public mainBGM: cc.AudioClip = null;
  @property(cc.AudioClip)
  public freeSpinStart: cc.AudioClip = null;
  @property(cc.AudioClip)
  public freeSpinEnd: cc.AudioClip = null;
  @property(cc.AudioClip)
  public scatterIconAppear: cc.AudioClip = null;
  @property(cc.AudioClip)
  public btnClick: cc.AudioClip = null;
  @property(cc.AudioClip)
  public btnSpinClick: cc.AudioClip = null;
  @property(cc.AudioClip)
  public columnDrop: cc.AudioClip = null;
  @property(cc.AudioClip)
  public columnDropFree: cc.AudioClip = null;
  @property(cc.AudioClip)
  public bgmFreeSpin: cc.AudioClip = null;
  @property(cc.AudioClip)
  public winLine: cc.AudioClip = null;
  @property(cc.AudioClip)
  public winDefault: cc.AudioClip = null;
  @property(cc.AudioClip)
  public lightEffect: cc.AudioClip = null;
  @property(cc.AudioClip)
  public lightEffectEnd: cc.AudioClip = null;
  @property(cc.AudioClip)
  public winStart: cc.AudioClip[] = [];
  @property(cc.AudioClip)
  public winLoop: cc.AudioClip[] = [];
  @property(cc.AudioClip)
  public winEnd: cc.AudioClip[] = [];
  @property(cc.AudioClip)
  public flexMarkAppear: cc.AudioClip = null;
  @property(cc.AudioClip)
  public flexMarkEnd: cc.AudioClip = null;
  @property(cc.AudioClip)
  public freespinNumberUp: cc.AudioClip[] = [];

  @property(cc.AudioClip)
  public wildX2: cc.AudioClip = null;
  @property(cc.AudioClip)
  public wildX3: cc.AudioClip = null;
  @property(cc.AudioClip)
  public freespinNumberUpAppear: cc.AudioClip[] = [];
  @property(cc.AudioClip)
  public reelFreespinAppear: cc.AudioClip = null;
  private _audioId: number = -1;
  private _fxId: number = -1;
  private _volume: number = 1;

  private musicStatus: boolean = true;

  onLoad() {
    GenZMusicManager.instance = this;
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
      case SLOT_SOUND_TYPE.BTN_CLICK:
        audioClip = this.btnClick;
        break;
      case SLOT_SOUND_TYPE.START_SPIN:
        audioClip = this.btnSpinClick;
        break;
      case SLOT_SOUND_TYPE.STOP_SPIN:
        audioClip = this.columnDrop;
        break;
      case SLOT_SOUND_TYPE.START_SPIN:
        audioClip = this.btnSpinClick;
        break;
      case SLOT_SOUND_TYPE.NORMAL_WIN:
        audioClip = this.winDefault;
        break;
      case SLOT_SOUND_TYPE.WIN_BIG:
        audioClip = this.winStart[0];
        this.scheduleOnce(() => {
          audioClip = this.winLoop[0];
        }, 1);
        break;
      case SLOT_SOUND_TYPE.WIN_MEGA:
        audioClip = this.winStart[1];
        this.scheduleOnce(() => {
          audioClip = this.winLoop[1];
        }, 1);
        break;
      case SLOT_SOUND_TYPE.WIN_SUPER_MEGA:
        audioClip = this.winStart[2];
        this.scheduleOnce(() => {
          audioClip = this.winLoop[2];
        }, 1);
        break;
      case SLOT_SOUND_TYPE.SCATTER:
        audioClip = this.scatterIconAppear;
        break;
      case SLOT_SOUND_TYPE.REEL_START:
        audioClip = this.freeSpinStart;
        break;
      case SLOT_SOUND_TYPE.REEL_END:
        audioClip = this.freeSpinEnd;
        break;
      case SLOT_SOUND_TYPE.WIN_BIG_END:
        audioClip = this.winEnd[0];
        break;
      case SLOT_SOUND_TYPE.WIN_MEGA_END:
        audioClip = this.winEnd[1];
        break;
      case SLOT_SOUND_TYPE.WIN_SUPER_MEGA_END:
        audioClip = this.winEnd[2];
        break;
      case SLOT_SOUND_TYPE.LIGHT_EFFECT:
        audioClip = this.lightEffect;
        break;
      case SLOT_SOUND_TYPE.LIGHT_EFFECT_END:
        audioClip = this.lightEffectEnd;
        break;
      case SLOT_SOUND_TYPE.WIN_LIGHT_EFFECT:
        audioClip = this.winLine;
        break;
      case SLOT_SOUND_TYPE.FLEX_MARK_APPEAR:
        audioClip = this.flexMarkAppear;
        break;
      case SLOT_SOUND_TYPE.FLEX_MARK_END:
        audioClip = this.flexMarkEnd;
        break;
      case SLOT_SOUND_TYPE.WILD_X2:
        audioClip = this.wildX2;
        break;
      case SLOT_SOUND_TYPE.WILD_X3:
        audioClip = this.wildX3;
        break;
      case SLOT_SOUND_TYPE.FREESPIN_NUMBER_1:
        audioClip = this.freespinNumberUp[0];
        break;
      case SLOT_SOUND_TYPE.FREESPIN_NUMBER_2:
        audioClip = this.freespinNumberUp[1];
        break;
      case SLOT_SOUND_TYPE.FREESPIN_NUMBER_3:
        audioClip = this.freespinNumberUp[2];
        break;
      case SLOT_SOUND_TYPE.FREESPIN_NUMBER_1_APPEAR:
        audioClip = this.freespinNumberUpAppear[0];
        break;
      case SLOT_SOUND_TYPE.FREESPIN_NUMBER_2_APPEAR:
        audioClip = this.freespinNumberUpAppear[1];
        break;
      case SLOT_SOUND_TYPE.FREESPIN_NUMBER_3_APPEAR:
        audioClip = this.freespinNumberUpAppear[2];
        break;
      case SLOT_SOUND_TYPE.FREESPIN_REEL_APPEAR:
        audioClip = this.reelFreespinAppear;
        break;
      case SLOT_SOUND_TYPE.FREESPIN_BGM:
        audioClip = this.bgmFreeSpin;
        break;
    }
    if (audioClip && this.musicStatus) {
      this.playActionMusic(audioClip);
    }
  }

  private playActionMusic(audioClip: cc.AudioClip) {
    if (this._volume > 0) {
      this._fxId = cc.audioEngine.play(audioClip, false, this._volume);
    }
  }

  public playSlotMusic(audioClip: cc.AudioClip) {
    cc.audioEngine.stop(this._audioId);
    this._audioId = cc.audioEngine.play(audioClip, true, this._volume);
  }

  public stopSlotMusic() {
    cc.audioEngine.stop(this._audioId);
  }

  // public playTypeLoop(audioClip: cc.AudioClip) {
  //   cc.audioEngine.stop(this._fxId);
  //   this._fxId = cc.audioEngine.play(audioClip, true, this._volume);
  // }

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
