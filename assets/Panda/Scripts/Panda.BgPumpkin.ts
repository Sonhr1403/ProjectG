const { ccclass, property } = cc._decorator;
import { PandaCmd } from "./Panda.Cmd";
import { PandaLanguageMgr } from "./Panda.LanguageMgr";
import PandaSoundControler, { SLOT_SOUND_TYPE } from "./Panda.SoundControler";

@ccclass
export default class PandaBgPumpkin extends cc.Component {
    public static instance: PandaBgPumpkin = null;

    @property(sp.Skeleton)
    private skeletonPumpkin: sp.Skeleton = null;

    @property(cc.Prefab)
    public prfCoin: cc.Prefab = null;

    private indexOldPumpkin: number = 0;
    private indexPumpkin: number = 0;

    private skin = "Pumkin";

    private animation = [
        "Pumkin_idle_empty", //0 trang thai binh thuong
        "Pumkin_idle_small",//1
        "Pumkin_idle_half",//2
        "Pumkin_idle_full",//0
        "Pumkin_reward_empty", // 0 trang thai khi co xu bay vao
        "Pumkin_reward_small", // 1
        "Pumkin_reward_half", // 2
        "Pumkin_reward_full", // 3
    ];

    onLoad() {
        PandaBgPumpkin.instance = this;
    }

    private listPosCoin = {
        "0": [cc.v2(-590, -140), cc.v2(-590, -390), cc.v2(-590, -670)],
        "1": [cc.v2(-295, -140), cc.v2(-295, -390), cc.v2(-295, -670)],
        "2": [cc.v2(10, -140), cc.v2(10, -390), cc.v2(10, -670)],
        "3": [cc.v2(310, -140), cc.v2(310, -390), cc.v2(310, -670)],
        "4": [cc.v2(600, -140), cc.v2(600, -390), cc.v2(600, -670)],
    };

    start() {
        this.skeletonPumpkin.setSkin(this.skin);
        this.skeletonPumpkin.setAnimation(0, this.animation[0], true);
    }

    public resetNewGame() {
        this.node.removeAllChildren();
    }

    public collectionCoin(x: number, y: number) {
        if (x >= 0 && x <= 4 && y >= 0 && y <= 2) {
            let nCoin: cc.Node = cc.instantiate(this.prfCoin);
            nCoin.scale = 1.25;
            nCoin.setPosition(this.listPosCoin[x][y]);
            this.node.addChild(nCoin);
            cc.tween(nCoin).to(0.5, { position: cc.v3(0, 35, 0), scale: 0.25 }).delay(0.2).call(() => { nCoin.removeFromParent(); }).start();
        }
    }

    public changeJackpot(data: PandaCmd.ImpItemJackpot): void {
        let key = this.setIndex(data);
        if(this.indexOldPumpkin != key) {
            this.indexOldPumpkin = key;
            this.setAnimIdle();
        }
    }

    public setAnimReward() {
        switch (this.indexPumpkin) {
            case 0:
                this.setPumpkinRewardEmpty();
                break;

            case 1:
                this.setPumpkinRewardSmall();
                break;

            case 2:
                this.setPumpkinRewardHalf();
                break;

            case 3:
                this.setPumpkinRewardFull();
                break;
        }
    }

    public setAnimIdle() {
        switch (this.indexPumpkin) {
            case 0:
                this.setPumpkinIdleEmpty();
                break;

            case 1:
                this.setPumpkinIdleSmall();
                break;

            case 2:
                this.setPumpkinIdleHalf();
                break;

            case 3:
                this.setPumpkinIdleFull();
                break;
        }
    }

    private setIndex(data: PandaCmd.ImpItemJackpot): number {
        let totalMoney = data.minorJackpot + data.miniJackpot + data.majorJackpot + data.grandJackpot;
        if (totalMoney > 100 * 1000000) {
            this.indexPumpkin = 3;
        } else if (totalMoney > 10 * 1000000) {
            this.indexPumpkin = 2;
        } else if (totalMoney > 1 * 1000000) {
            this.indexPumpkin = 1;
        } else if (totalMoney > 0 * 1000000) {
            this.indexPumpkin = 0;
        }
        return this.indexPumpkin;
    }

    private setPumpkinIdleEmpty() {
        this.skeletonPumpkin.setSkin(this.skin);
        this.skeletonPumpkin.setAnimation(0, this.animation[0], true);
    }

    private setPumpkinIdleSmall() {
        this.skeletonPumpkin.setSkin(this.skin);
        this.skeletonPumpkin.setAnimation(0, this.animation[1], true);
    }

    private setPumpkinIdleHalf() {
        this.skeletonPumpkin.setSkin(this.skin);
        this.skeletonPumpkin.setAnimation(0, this.animation[2], true);
    }

    private setPumpkinIdleFull() {
        this.skeletonPumpkin.setSkin(this.skin);
        this.skeletonPumpkin.setAnimation(0, this.animation[3], true);
    }

    private setPumpkinRewardEmpty() {
        this.skeletonPumpkin.setSkin(this.skin);
        this.skeletonPumpkin.setAnimation(0, this.animation[4], true);
    }

    private setPumpkinRewardSmall() {
        this.skeletonPumpkin.setSkin(this.skin);
        this.skeletonPumpkin.setAnimation(0, this.animation[5], true);
    }

    private setPumpkinRewardHalf() {
        this.skeletonPumpkin.setSkin(this.skin);
        this.skeletonPumpkin.setAnimation(0, this.animation[6], true);
    }

    private setPumpkinRewardFull() {
        this.skeletonPumpkin.setSkin(this.skin);
        this.skeletonPumpkin.setAnimation(0, this.animation[7], true);
    }
}
