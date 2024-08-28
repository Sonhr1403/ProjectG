import PandaController from "./Panda.Controller";
import { PandaLanguageMgr } from "./Panda.LanguageMgr";
import PandaSoundControler, { SLOT_SOUND_TYPE } from "./Panda.SoundControler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PandaBullet extends cc.Component {
    public static instance: PandaBullet = null;

    @property(cc.Prefab)
    private prfBullet: cc.Prefab = null;

    private listPosBullets = {
        "0": [cc.v3(-580, 140, 0), cc.v3(-580, -110, 0), cc.v3(-580, -360, 0)],
        "1": [cc.v3(-280, 140, 0), cc.v3(-280, -110, 0), cc.v3(-280, -360, 0)],
        "2": [cc.v3(0, 140, 0), cc.v3(0, -110, 0), cc.v3(0, -360, 0)],
        "3": [cc.v3(300, 140, 0), cc.v3(300, -110, 0), cc.v3(300, -360, 0)],
        "4": [cc.v3(600, 140, 0), cc.v3(600, -110, 0), cc.v3(600, -360, 0)],
    };

    onLoad() {
        PandaBullet.instance = this;
    }

    start() {
        // TODO
    }

    public shoot(from: { x: number, y: number }, to: { x: number, y: number }) {
        let nBullet = cc.instantiate(this.prfBullet);
        nBullet.setPosition(this.listPosBullets[from.x][from.y]);
        this.node.addChild(nBullet);
        let timer = this.setTimerByX(to.x);
        cc.tween(nBullet).to(timer, { position: this.listPosBullets[to.x][to.y] }).delay(0.25).call(() => {
            nBullet.removeFromParent();
        }).start();
    }

    private setTimerByX(x: number) {
        let timer = 0.05;
        switch (x) {
            case 4:
                timer = 0.1;
                break;

            case 3:
                timer = 0.15;
                break;
            case 2:
                timer = 0.2;
                break;
            case 1:
                timer = 0.25;
                break;
            case 0:
                timer = 0.3;
                break;
        }
        return timer;
    }

    // update (dt) {}
}
