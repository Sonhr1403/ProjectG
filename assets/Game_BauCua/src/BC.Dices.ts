const {ccclass, property} = cc._decorator;
import cmd from "./BauCua.Cmd";
import BCSoundControler, { BC_SOUND_TYPE } from "./BC.SoundControler";
@ccclass
export default class BCDices extends cc.Component {

    @property(cc.Node)
    public nDish: cc.Node = null;

    @property(cc.Node)
    public nBowl: cc.Node = null;

    @property(cc.Node)
    public nDides: cc.Node = null;

    @property(cc.SpriteAtlas)
    public spriteAtlasDices: cc.SpriteAtlas = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.nBowl.active = true;
    }

    ////
    public setFaceOfDices() {
        // TODO
    }
    // update (dt) {}

    public setFaceDices(dices: Array<number>) {
        let dice1 = this.setNameDice(dices[0]);
        let dice2 = this.setNameDice(dices[1]);
        let dice3 = this.setNameDice(dices[2]);
        this.nDides.getChildByName("Dice1").getComponent(sp.Skeleton).setSkin(dice1.skin);
        this.nDides.getChildByName("Dice2").getComponent(sp.Skeleton).setSkin(dice2.skin);
        this.nDides.getChildByName("Dice3").getComponent(sp.Skeleton).setSkin(dice3.skin);
        this.nDides.getChildByName("Dice1").getComponent(sp.Skeleton).setAnimation(0, dice1.animation, true);
        this.nDides.getChildByName("Dice2").getComponent(sp.Skeleton).setAnimation(0, dice2.animation, true);
        this.nDides.getChildByName("Dice3").getComponent(sp.Skeleton).setAnimation(0, dice3.animation, true);
    }

    private setNameDice(val: number) {
        let result = {skin:"", animation: ""};
        switch (val) {
            case cmd.Config.FACE_TOM:
                result = { skin: "tom", animation: "tom-anim" };
                break;

            case cmd.Config.FACE_CA:
                result = { skin: "ca", animation: "ca-anim" };
                break;

            case cmd.Config.FACE_GA:
                result = { skin: "ga", animation: "ga-anim" };
                break;

            case cmd.Config.FACE_HO:
                result = { skin: "ho", animation: "ho-anim" };
                break;

            case cmd.Config.FACE_VOI:
                result = { skin: "voi", animation: "voi-anim" };
                break;

            case cmd.Config.FACE_RUA:
                result = { skin: "rua", animation: "rua-anim" };
                break;
        }
        return result;

    }

    private getSpriteDices(val: number): cc.SpriteFrame {
        let sprite: cc.SpriteFrame = null;
        switch (val) {
            case cmd.Config.FACE_TOM:
                sprite = this.spriteAtlasDices.getSpriteFrame("bc_face_shrimp");
                break;
            case cmd.Config.FACE_RUA:
                sprite = this.spriteAtlasDices.getSpriteFrame("bc_face_turtle");
                break;
            case cmd.Config.FACE_CA:
                sprite = this.spriteAtlasDices.getSpriteFrame("bc_face_fish");
                break;
            case cmd.Config.FACE_HO:
                sprite = this.spriteAtlasDices.getSpriteFrame("bc_face_tiger");
                break;
            case cmd.Config.FACE_VOI:
                sprite = this.spriteAtlasDices.getSpriteFrame("bc_face_elephant");
                break;
            case cmd.Config.FACE_GA:
                sprite = this.spriteAtlasDices.getSpriteFrame("bc_face_rooster");
                break;
        }
        return sprite;
    }

    public setRollDices(res) {
        // TODO
    }

    public hideBowl() {
        this.nBowl.active = false;
    }

    public showBowl() {
        this.nBowl.getComponent(cc.Animation).stop();
        this.nBowl.active = true;
        this.nBowl.rotation = 0;
        this.nBowl.opacity = 255;
        this.nBowl.position = cc.v3(0, 320, 0);
    }

    public openBowl() {
        BCSoundControler.instance.playSoundByType(BC_SOUND_TYPE.OPEN_BOWL);
        this.nBowl.active = true;
        this.nBowl.getComponent(cc.Animation).play("EffectOpenBowl");
        // this.nBowl.getComponent(cc.Animation).stop();
    }

    public hideDish() {
        this.nDish.active = false;
    }
}
