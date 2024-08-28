
const { ccclass, property } = cc._decorator;

export enum SLOT_SOUND_TYPE {
    SLOT_BACKGROUND = 0,
    SLOT_BIG_WIN = 1,
    SLOT_MEGA_WIN = 2,
    SLOT_ULTRA_WIN = 3,
    SLOT_EPIC_WIN = 4,
    SLOT_CLICK = 5,
    SLOT_JACKPOT = 6,
    SLOT_COIN_DOWN_UP = 7,
    SLOT_FLY_COIN = 8,
    SLOT_SHOOT_FREE_GAME = 9,
    SLOT_SHOW_FREE_GAME = 10,
    SLOT_SPIN = 11,
    SLOT_APEAR_JACKPOT_1 = 12,
    SLOT_APEAR_JACKPOT_2 = 13,
    SLOT_APEAR_JACKPOT_3 = 14,
    SLOT_RUN_COIN = 15
};

@ccclass
export default class Slot50SoundControler extends cc.Component {
    public static instance: Slot50SoundControler = null;

    @property(cc.AudioClip)
    public mp3Background: cc.AudioClip = null;

    @property(cc.AudioClip)
    public mp3BigWin: cc.AudioClip = null;

    @property(cc.AudioClip)
    public mp3MegaWin: cc.AudioClip = null;

    @property(cc.AudioClip)
    public mp3EpicWin: cc.AudioClip = null;

    @property(cc.AudioClip)
    public mp3UltraWin: cc.AudioClip = null;

    @property(cc.AudioClip)
    public mp3BtnClick: cc.AudioClip = null;

    @property(cc.AudioClip)
    public mp3Jackpot: cc.AudioClip = null;

    @property(cc.AudioClip)
    public mp3CoinDownUp: cc.AudioClip = null;

    @property(cc.AudioClip)
    public mp3FlyCoin: cc.AudioClip = null;

    @property(cc.AudioClip)
    public mp3ShootFreeGame: cc.AudioClip = null;

    @property(cc.AudioClip)
    public mp3ShowFreeGame: cc.AudioClip = null;

    @property(cc.AudioClip)
    public mp3Spin: cc.AudioClip = null;

    @property(cc.AudioClip)
    public mp3ApearJackpot1: cc.AudioClip = null;

    @property(cc.AudioClip)
    public mp3ApearJackpot2: cc.AudioClip = null;

    @property(cc.AudioClip)
    public mp3ApearJackpot3: cc.AudioClip = null;

    private _volumeMusic: number = 1;
    private _volumeSound: number = 1;
    private soundStatus: boolean = true;

    start() {
        Slot50SoundControler.instance = this;
        this.setSystemVolume(1);
        this.playSlotAudio(SLOT_SOUND_TYPE.SLOT_BACKGROUND);
    }

    public getSoundVolume() {
        return this._volumeSound;
    }

    public setSoundVolume(volume: number) {
        this._volumeSound = volume;
    }

    public getSystemVolume() {
        return this._volumeMusic;
    }

    public setSystemVolume(volume: number) {
        this._volumeMusic = volume;
        cc.audioEngine.setVolume(this.idBackground, this._volumeMusic);
    }

    private idBackground = null;
    private playBackgroundMusic() {
        this.idBackground = cc.audioEngine.play(this.mp3Background, true, this._volumeMusic);
    }

    public playSlotAudio(type: number) {
        switch (type) {
            case SLOT_SOUND_TYPE.SLOT_BACKGROUND:
                this.playBackgroundMusic();
                break;

            case SLOT_SOUND_TYPE.SLOT_COIN_DOWN_UP:
                cc.audioEngine.play(this.mp3CoinDownUp, false, this._volumeSound);
                break;

            case SLOT_SOUND_TYPE.SLOT_BIG_WIN:
                cc.audioEngine.play(this.mp3BigWin, false, this._volumeSound);
                break;

            case SLOT_SOUND_TYPE.SLOT_MEGA_WIN:
                cc.audioEngine.play(this.mp3MegaWin, false, this._volumeSound);
                break;

            case SLOT_SOUND_TYPE.SLOT_ULTRA_WIN:
                cc.audioEngine.play(this.mp3UltraWin, false, this._volumeSound);
                break;

            case SLOT_SOUND_TYPE.SLOT_EPIC_WIN:
                cc.audioEngine.play(this.mp3EpicWin, false, this._volumeSound);
                break;

            case SLOT_SOUND_TYPE.SLOT_CLICK:
                cc.audioEngine.play(this.mp3BtnClick, false, this._volumeSound);
                break;

            case SLOT_SOUND_TYPE.SLOT_JACKPOT:
                cc.audioEngine.play(this.mp3Jackpot, false, this._volumeSound);
                break;

            case SLOT_SOUND_TYPE.SLOT_FLY_COIN:
                cc.audioEngine.play(this.mp3FlyCoin, false, this._volumeSound);
                break;

            case SLOT_SOUND_TYPE.SLOT_SHOOT_FREE_GAME:
                cc.audioEngine.play(this.mp3ShootFreeGame, false, this._volumeSound);
                break;

            case SLOT_SOUND_TYPE.SLOT_SHOW_FREE_GAME:
                cc.audioEngine.play(this.mp3ShowFreeGame, false, this._volumeSound);
                break;

            case SLOT_SOUND_TYPE.SLOT_SPIN:
                cc.audioEngine.play(this.mp3Spin, false, this._volumeSound);
                break;

            case SLOT_SOUND_TYPE.SLOT_RUN_COIN:
                cc.audioEngine.play(this.mp3FlyCoin, false, this._volumeSound);
                break;

            case SLOT_SOUND_TYPE.SLOT_APEAR_JACKPOT_1:
                cc.audioEngine.play(this.mp3ApearJackpot1, false, this._volumeSound);
                break;

            case SLOT_SOUND_TYPE.SLOT_APEAR_JACKPOT_2:
                cc.audioEngine.play(this.mp3ApearJackpot2, false, this._volumeSound);
                break;

            case SLOT_SOUND_TYPE.SLOT_APEAR_JACKPOT_3:
                cc.audioEngine.play(this.mp3ApearJackpot3, false, this._volumeSound);
                break;
        }
    }

    public setsoundStatus(status: boolean) {
        this.soundStatus = status;
    }

    public getsoundStatus() {
        return this.soundStatus;
    }

    public stopAll() {
        cc.audioEngine.stopAll();
    }
}
