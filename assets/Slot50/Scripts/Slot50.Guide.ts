import Slot50SoundControler, { SLOT_SOUND_TYPE } from "./Slot50.SoundControler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot50Guide extends cc.Component {

    @property(cc.Node)
    private nSlide1: cc.Node = null;

    @property(cc.Node)
    private nSlide2: cc.Node = null;

    @property(cc.Node)
    private nSlide3: cc.Node = null;

    @property(cc.Node)
    private nSlide4: cc.Node = null;

    @property(cc.Node)
    private nSlide5: cc.Node = null;

    @property(cc.Node)
    private nSlide6: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private currentPage: number = 1;
    start() {

    }

    // update (dt) {}

    public show(page: number) {
        this.node.active = true;
        this.currentPage = (page > 0 && page < 7) ? page : 1;
        this.resetAllSlide();
        switch (this.currentPage) {
            case 1:
                this.nSlide1.active = true;
                break;

            case 2:
                this.nSlide2.active = true;
                break;

            case 3:
                this.nSlide3.active = true;
                break;
            case 4:
                this.nSlide4.active = true;
                break;

            case 5:
                this.nSlide5.active = true;
                break;

            case 6:
                this.nSlide6.active = true;
                break;

            default:
                this.nSlide1.active = true;
                break;
        }
    }

    private resetAllSlide() {
        this.nSlide1.active = false;
        this.nSlide2.active = false;
        this.nSlide3.active = false;
        this.nSlide4.active = false;
        this.nSlide5.active = false;
        this.nSlide6.active = false;
    }

    protected onClickClose() {
        Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
        this.node.active = false;
    }

    protected onClickNext() {
        Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
        if (this.currentPage < 6) {
            this.currentPage++;
            this.show(this.currentPage)
        } else {
            this.currentPage = 1;
            this.show(this.currentPage)
        }
    }

    protected onClickPrev() {
        Slot50SoundControler.instance.playSlotAudio(SLOT_SOUND_TYPE.SLOT_CLICK);
        if (this.currentPage > 1) {
            this.currentPage--;
            this.show(this.currentPage)
        } else {
            this.currentPage = 6;
            this.show(this.currentPage)
        }
    }

}
