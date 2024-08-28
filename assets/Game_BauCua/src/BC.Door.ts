const {ccclass, property} = cc._decorator;
import BCController from "./BC.Controller";
import cmd from "./BauCua.Cmd";;
import BCCommon from "./BC.Common";

const BC_DOOR_CONFIG = cc.Enum({
    TOM_0: cmd.Config.TOM,
    CA_1: cmd.Config.CA,
    GA_2: cmd.Config.GA,
    HO_3: cmd.Config.HO,
    VOI_4: cmd.Config.VOI,
    RUA_5: cmd.Config.RUA,
    TOM_GA_6: cmd.Config.TOM_GA,
    TOM_VOI_7: cmd.Config.TOM_VOI,
    TOM_CA_8: cmd.Config.TOM_CA,
    HO_RUA_9: cmd.Config.HO_RUA,
    HO_CA_10: cmd.Config.HO_CA,
    GA_HO_11: cmd.Config.GA_HO,
    GA_RUA_12: cmd.Config.GA_RUA,
    CA_VOI_13: cmd.Config.CA_VOI,
    HO_TOM_14: cmd.Config.HO_TOM,
    TOM_RUA_15: cmd.Config.TOM_RUA,
    RUA_CA_16: cmd.Config.RUA_CA,
    CA_GA_17: cmd.Config.CA_GA,
    GA_VOI_18: cmd.Config.GA_VOI,
    VOI_HO_19: cmd.Config.VOI_HO,
    VOI_RUA_20: cmd.Config.VOI_RUA,
});

const BC_DOOR_TYPE = cc.Enum({
    DOOR_SINGLE: 1,
    DOOR_COUPLE_SHOW: 2,
    DOOR_COUPLE_HIDE: 3
});

@ccclass
export default class BCDoor extends cc.Component {

    @property({ type: BC_DOOR_CONFIG })
    public door: number = 0;

    @property({ type: BC_DOOR_TYPE })
    public doorType: number = BC_DOOR_TYPE.DOOR_SINGLE;

    @property(cc.Boolean)
    public isBlinkAura: boolean = true;

    @property(cc.Button)
    public btnAction: cc.Button = null;

    @property(cc.Label)
    public lbTotalMoney: cc.Label = null;

    @property(cc.Node)
    public nMyMoney: cc.Node = null;

    @property(cc.Node)
    public spDoorAura: cc.Node = null;

    @property(cc.Node)
    public nChips: cc.Node = null;

    @property(cc.Node)
    public lbMyWin: cc.Node = null;

    private rangePos = {
        [cmd.Config.TOM]: { xMax: 100, xMin: -100, yMax: 15, yMin: -15 },
        [cmd.Config.CA]: { xMax: 100, xMin: -100, yMax: 15, yMin: -15 },
        [cmd.Config.GA]: { xMax: 100, xMin: -100, yMax: 15, yMin: -15 },
        [cmd.Config.HO]: { xMax: 100, xMin: -100, yMax: 15, yMin: -15 },
        [cmd.Config.VOI]: { xMax: 100, xMin: -100, yMax: 15, yMin: -15 },
        [cmd.Config.RUA]: { xMax: 100, xMin: -100, yMax: 15, yMin: -15 },
        [cmd.Config.TOM_GA]: { xMax: 90, xMin: -90, yMax: 5, yMin: -5 },
        [cmd.Config.TOM_VOI]: { xMax: 90, xMin: -90, yMax: 5, yMin: -5 },
        [cmd.Config.TOM_CA]: { xMax: 90, xMin: -90, yMax: 5, yMin: -5 },
        [cmd.Config.HO_RUA]: { xMax: 90, xMin: -90, yMax: 5, yMin: -5 },
        [cmd.Config.HO_CA]: { xMax: 90, xMin: -90, yMax: 5, yMin: -5 },
        [cmd.Config.GA_HO]: { xMax: 90, xMin: -90, yMax: 5, yMin: -5 },
        [cmd.Config.GA_RUA]: { xMax: 90, xMin: -90, yMax: 5, yMin: -5 },
        [cmd.Config.CA_VOI]: { xMax: 90, xMin: -90, yMax: 5, yMin: -5 },
        [cmd.Config.HO_TOM]: { xMax: 105, xMin: 80, yMax: 3, yMin: -3 },
        [cmd.Config.TOM_RUA]: { xMax: 3, xMin: -3, yMax: 90, yMin: 40 },
        [cmd.Config.RUA_CA]: { xMax: 3, xMin: -3, yMax: 90, yMin: 40 },
        [cmd.Config.CA_GA]: { xMax: 105, xMin: 80, yMax: 3, yMin: -3 },
        [cmd.Config.GA_VOI]: { xMax: 3, xMin: -3, yMax: 90, yMin: 40 },
        [cmd.Config.VOI_HO]: { xMax: 3, xMin: -3, yMax: 90, yMin: 40 },
        [cmd.Config.VOI_RUA]: { xMax: 105, xMin: 80, yMax: 3, yMin: -3 },
    };

    protected onLoad(): void {
        this.node.zIndex = 0;
        this.nChips.zIndex = 999;
        this.stopAura();
    }

    start () {
        this.activelbMyWin(false);
    }

    // update (dt) {}

    public getDoorId() {
        return this.door;
    }

    public setInteractable(isActive: boolean) {
        // TODO
    }

    public resetNewSession() {
        this.setTotalMoneyInDoor(0);
        this.setMoneyOfMeInDoor(0);
        this.activelbMyWin(false);
    }

    public setTotalMoneyInDoor(totalMoney: number) {
        if(!(this.doorType == BC_DOOR_TYPE.DOOR_COUPLE_HIDE) && totalMoney > 0) {
            this.lbTotalMoney.node.active = true;
            this.lbTotalMoney.string = BCCommon.convert2Label(totalMoney);
        } else {
            this.lbTotalMoney.node.active = false;
        }
    }

    public setMoneyOfMeInDoor(money: number) {
        if (money > 0) {
            this.nMyMoney.active = true;
            this.nMyMoney.getChildByName("LbMyMoney").getComponent(cc.Label).string = BCCommon.convert2Label(money);
        } else {
            this.nMyMoney.active = false;
        }
    }

    public addChip(nChip: cc.Node) {
        this.nChips.addChild(nChip);
    }

    public getRandomPosOfChip(): cc.Vec3 {
        let temp = this.rangePos[this.door];
        let xPos = BCCommon.getRandomNumber(temp.xMax, temp.xMin);
        let yPos = BCCommon.getRandomNumber(temp.yMax, temp.yMin);
        return cc.v3(xPos, yPos, 0);
    }

    public getAllChipInDoor():Array<cc.Node> {
        return this.nChips.children;
    }

    public removeAllChipInDoor(): void {
        this.nChips.removeAllChildren();
    }

    public getNumberChipInDoor(): number {
        return this.nChips.children.length;
    }

    public onClickBet(event, data) {
        BCController.instance.countDoNotInteract = 0;
        BCController.instance.onSubmitBet(this.door);
    }

    public stopAura() {
        cc.tween(this.spDoorAura).stop();
        this.spDoorAura.active = false;
    }

    public showAura() {
        if(this.isBlinkAura) {
            this.spDoorAura.active = this.isBlinkAura;
            cc.tween(this.spDoorAura).sequence(
                cc.tween(this.spDoorAura).to(0.5, {scale: 1.025}),
                cc.tween(this.spDoorAura).to(0.5, {scale: 0.975})
            ).repeatForever().start();
        }
    }

    public showMoneyWinOfMe(money: number) {
        if(money > 0) {
            this.lbMyWin.getComponent(cc.Label).string = BCCommon.convert2Label(money);
            this.activelbMyWin(true);
        }
    }

    private activelbMyWin(isActive: boolean) {
        this.lbMyWin.active = isActive;
    }
}
