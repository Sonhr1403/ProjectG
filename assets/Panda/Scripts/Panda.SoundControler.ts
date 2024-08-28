
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
    SLOT_RUN_COIN = 12
};

@ccclass
export default class PandaSoundControler extends cc.Component {
    public static instance: PandaSoundControler = null;

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

    private _volumeMusic: number = 1;
    private _volumeSound: number = 1;
    private soundStatus: boolean = true;

    start() {
        PandaSoundControler.instance = this;
        this.setSystemVolume(1);
        this.playSlotAudio(SLOT_SOUND_TYPE.SLOT_BACKGROUND);
    }

    public init() {

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
            case SLOT_SOUND_TYPE.SLOT_COIN_DOWN_UP:
                this.playCoinDownUp();
                break;

            case SLOT_SOUND_TYPE.SLOT_BACKGROUND:
                this.playBackgroundMusic();
                break;

            case SLOT_SOUND_TYPE.SLOT_BIG_WIN:
                this.playBigWin();
                break;

            case SLOT_SOUND_TYPE.SLOT_MEGA_WIN:
                this.playMegaWin();
                break;

            case SLOT_SOUND_TYPE.SLOT_ULTRA_WIN:
                this.playUltraWin();
                break;

            case SLOT_SOUND_TYPE.SLOT_EPIC_WIN:
                this.playEpicWin();
                break;

            case SLOT_SOUND_TYPE.SLOT_CLICK:
                this.playClick();
                break;

            case SLOT_SOUND_TYPE.SLOT_JACKPOT:
                this.playPrizeJackpot();
                break;

            case SLOT_SOUND_TYPE.SLOT_FLY_COIN:
                this.playFlyCoin();
                break;

            case SLOT_SOUND_TYPE.SLOT_SHOOT_FREE_GAME:
                this.playShootFreeGame();
                break;

            case SLOT_SOUND_TYPE.SLOT_SHOW_FREE_GAME:
                this.playShowFreeGame();
                break;

            case SLOT_SOUND_TYPE.SLOT_SPIN:
                this.playSpin();
                break;

            case SLOT_SOUND_TYPE.SLOT_RUN_COIN:
                this.playFlyCoin();
                break;
        }
    }

    private idSpin = null;
    private playSpin() {
        this.idSpin = cc.audioEngine.play(this.mp3Spin, false, this._volumeSound);
    }

    private idShowFreeGame = null;
    private playShowFreeGame() {
        this.idShowFreeGame = cc.audioEngine.play(this.mp3ShowFreeGame, false, this._volumeSound);
    }

    private idShootFreeGame = null;
    private playShootFreeGame() {
        this.idShootFreeGame = cc.audioEngine.play(this.mp3ShootFreeGame, false, this._volumeSound);
    }

    private idFlyCoin = null;
    private playFlyCoin() {
        this.idFlyCoin = cc.audioEngine.play(this.mp3FlyCoin, false, this._volumeSound);
    }

    private idCoinDownUp = null;
    private playCoinDownUp() {
        this.idCoinDownUp = cc.audioEngine.play(this.mp3CoinDownUp, false, this._volumeSound);
    }

    private idClick = null;
    private playClick() {
        this.idClick = cc.audioEngine.play(this.mp3BtnClick, false, this._volumeSound);
    }

    private idBigWin = null;
    private playBigWin() {
        this.idBigWin = cc.audioEngine.play(this.mp3BigWin, false, this._volumeSound);
    }

    private idMegaWin = null;
    private playMegaWin() {
        this.idMegaWin = cc.audioEngine.play(this.mp3MegaWin, false, this._volumeSound);
    }

    private idUltraWin = null;
    private playUltraWin() {
        this.idUltraWin = cc.audioEngine.play(this.mp3UltraWin, false, this._volumeSound);
    }

    private idEpicWin = null;
    private playEpicWin() {
        this.idEpicWin = cc.audioEngine.play(this.mp3EpicWin, false, this._volumeSound);
    }

    private idPrizeJackpot = null;
    private playPrizeJackpot() {
        this.idPrizeJackpot = cc.audioEngine.play(this.mp3Jackpot, false, this._volumeSound);
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
