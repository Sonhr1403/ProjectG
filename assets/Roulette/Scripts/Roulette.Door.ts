// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { RouletteNetwork } from "./Roulette.Cmd";
import RLTCommon from "./Roulette.Common";
import RouletteController from "./Roulette.Controller";
import RLTPhinh from "./Roulette.Phinh";
import { RLT_SOUND_TYPE } from "./Roulette.SoundControler";

const { ccclass, property } = cc._decorator;

const RLT_DOOR_CONFIG = cc.Enum({
  T_0: RouletteNetwork.Config.T_0,
  T_1: RouletteNetwork.Config.T_1,
  T_2: RouletteNetwork.Config.T_2,
  T_3: RouletteNetwork.Config.T_3,
  T_4: RouletteNetwork.Config.T_4,
  T_5: RouletteNetwork.Config.T_5,
  T_6: RouletteNetwork.Config.T_6,
  T_7: RouletteNetwork.Config.T_7,
  T_8: RouletteNetwork.Config.T_8,
  T_9: RouletteNetwork.Config.T_9,
  T_10: RouletteNetwork.Config.T_10,
  T_11: RouletteNetwork.Config.T_11,
  T_12: RouletteNetwork.Config.T_12,
  T_13: RouletteNetwork.Config.T_13,
  T_14: RouletteNetwork.Config.T_14,
  T_15: RouletteNetwork.Config.T_15,
  T_16: RouletteNetwork.Config.T_16,
  T_17: RouletteNetwork.Config.T_17,
  T_18: RouletteNetwork.Config.T_18,
  T_19: RouletteNetwork.Config.T_19,
  T_20: RouletteNetwork.Config.T_20,
  T_21: RouletteNetwork.Config.T_21,
  T_22: RouletteNetwork.Config.T_22,
  T_23: RouletteNetwork.Config.T_23,
  T_24: RouletteNetwork.Config.T_24,
  T_25: RouletteNetwork.Config.T_25,
  T_26: RouletteNetwork.Config.T_26,
  T_27: RouletteNetwork.Config.T_27,
  T_28: RouletteNetwork.Config.T_28,
  T_29: RouletteNetwork.Config.T_29,
  T_30: RouletteNetwork.Config.T_30,
  T_31: RouletteNetwork.Config.T_31,
  T_32: RouletteNetwork.Config.T_32,
  T_33: RouletteNetwork.Config.T_33,
  T_34: RouletteNetwork.Config.T_34,
  T_35: RouletteNetwork.Config.T_35,
  T_36: RouletteNetwork.Config.T_36,
  EVEN: RouletteNetwork.Config.EVEN,
  ODD: RouletteNetwork.Config.ODD,
  RED: RouletteNetwork.Config.RED,
  BLACK: RouletteNetwork.Config.BLACK,
  T_1_TO_18: RouletteNetwork.Config.T_1_TO_18,
  T_19_TO_36: RouletteNetwork.Config.T_19_TO_36,
  T_1_TO_12: RouletteNetwork.Config.T_1_TO_12,
  T_13_TO_24: RouletteNetwork.Config.T_13_TO_24,
  T_25_TO_36: RouletteNetwork.Config.T_25_TO_36,
  T_ROW_1: RouletteNetwork.Config.T_ROW_1,
  T_ROW_2: RouletteNetwork.Config.T_ROW_2,
  T_ROW_3: RouletteNetwork.Config.T_ROW_3,
  T0_1: RouletteNetwork.Config.T0_1,
  T0_2: RouletteNetwork.Config.T0_2,
  T0_3: RouletteNetwork.Config.T0_3,
  T1_2: RouletteNetwork.Config.T1_2,
  T1_4: RouletteNetwork.Config.T1_4,
  T2_3: RouletteNetwork.Config.T2_3,
  T2_5: RouletteNetwork.Config.T2_5,
  T3_6: RouletteNetwork.Config.T3_6,
  T4_5: RouletteNetwork.Config.T4_5,
  T4_7: RouletteNetwork.Config.T4_7,
  T5_6: RouletteNetwork.Config.T5_6,
  T5_8: RouletteNetwork.Config.T5_8,
  T6_9: RouletteNetwork.Config.T6_9,
  T7_8: RouletteNetwork.Config.T7_8,
  T7_10: RouletteNetwork.Config.T7_10,
  T8_9: RouletteNetwork.Config.T8_9,
  T8_11: RouletteNetwork.Config.T8_11,
  T9_12: RouletteNetwork.Config.T9_12,
  T10_11: RouletteNetwork.Config.T10_11,
  T10_13: RouletteNetwork.Config.T10_13,
  T11_12: RouletteNetwork.Config.T11_12,
  T11_14: RouletteNetwork.Config.T11_14,
  T12_15: RouletteNetwork.Config.T12_15,
  T13_14: RouletteNetwork.Config.T13_14,
  T13_16: RouletteNetwork.Config.T13_16,
  T14_15: RouletteNetwork.Config.T14_15,
  T14_17: RouletteNetwork.Config.T14_17,
  T15_18: RouletteNetwork.Config.T15_18,
  T16_17: RouletteNetwork.Config.T16_17,
  T16_19: RouletteNetwork.Config.T16_19,
  T17_18: RouletteNetwork.Config.T17_18,
  T17_20: RouletteNetwork.Config.T17_20,
  T18_21: RouletteNetwork.Config.T18_21,
  T19_20: RouletteNetwork.Config.T19_20,
  T19_22: RouletteNetwork.Config.T19_22,
  T20_21: RouletteNetwork.Config.T20_21,
  T20_23: RouletteNetwork.Config.T20_23,
  T21_24: RouletteNetwork.Config.T21_24,
  T22_23: RouletteNetwork.Config.T22_23,
  T22_25: RouletteNetwork.Config.T22_25,
  T23_24: RouletteNetwork.Config.T23_24,
  T23_26: RouletteNetwork.Config.T23_26,
  T24_27: RouletteNetwork.Config.T24_27,
  T25_26: RouletteNetwork.Config.T25_26,
  T25_28: RouletteNetwork.Config.T25_28,
  T26_27: RouletteNetwork.Config.T26_27,
  T26_29: RouletteNetwork.Config.T26_29,
  T27_30: RouletteNetwork.Config.T27_30,
  T28_29: RouletteNetwork.Config.T28_29,
  T28_31: RouletteNetwork.Config.T28_31,
  T29_30: RouletteNetwork.Config.T29_30,
  T29_32: RouletteNetwork.Config.T29_32,
  T30_33: RouletteNetwork.Config.T30_33,
  T31_32: RouletteNetwork.Config.T31_32,
  T31_34: RouletteNetwork.Config.T31_34,
  T32_33: RouletteNetwork.Config.T32_33,
  T32_35: RouletteNetwork.Config.T32_35,
  T33_36: RouletteNetwork.Config.T33_36,
  T34_35: RouletteNetwork.Config.T34_35,
  T35_36: RouletteNetwork.Config.T35_36,
  T0_1_2: RouletteNetwork.Config.T0_1_2,
  T0_2_3: RouletteNetwork.Config.T0_2_3,
  T1_2_3: RouletteNetwork.Config.T1_2_3,
  T4_5_6: RouletteNetwork.Config.T4_5_6,
  T7_8_9: RouletteNetwork.Config.T7_8_9,
  T10_11_12: RouletteNetwork.Config.T10_11_12,
  T13_14_15: RouletteNetwork.Config.T13_14_15,
  T16_17_18: RouletteNetwork.Config.T16_17_18,
  T19_20_21: RouletteNetwork.Config.T19_20_21,
  T22_23_24: RouletteNetwork.Config.T22_23_24,
  T25_26_27: RouletteNetwork.Config.T25_26_27,
  T28_29_30: RouletteNetwork.Config.T28_29_30,
  T31_32_33: RouletteNetwork.Config.T31_32_33,
  T34_35_36: RouletteNetwork.Config.T34_35_36,
  T0_1_2_3: RouletteNetwork.Config.T0_1_2_3,
  T1_2_4_5: RouletteNetwork.Config.T1_2_4_5,
  T2_3_5_6: RouletteNetwork.Config.T2_3_5_6,
  T4_5_7_8: RouletteNetwork.Config.T4_5_7_8,
  T5_6_8_9: RouletteNetwork.Config.T5_6_8_9,
  T7_8_10_11: RouletteNetwork.Config.T7_8_10_11,
  T8_9_11_12: RouletteNetwork.Config.T8_9_11_12,
  T10_11_13_14: RouletteNetwork.Config.T10_11_13_14,
  T11_12_14_15: RouletteNetwork.Config.T11_12_14_15,
  T13_14_16_17: RouletteNetwork.Config.T13_14_16_17,
  T14_15_17_18: RouletteNetwork.Config.T14_15_17_18,
  T16_17_19_20: RouletteNetwork.Config.T16_17_19_20,
  T17_18_20_21: RouletteNetwork.Config.T17_18_20_21,
  T19_20_22_23: RouletteNetwork.Config.T19_20_22_23,
  T20_21_23_24: RouletteNetwork.Config.T20_21_23_24,
  T22_23_25_26: RouletteNetwork.Config.T22_23_25_26,
  T23_24_26_27: RouletteNetwork.Config.T23_24_26_27,
  T25_26_28_29: RouletteNetwork.Config.T25_26_28_29,
  T26_27_29_30: RouletteNetwork.Config.T26_27_29_30,
  T28_29_31_32: RouletteNetwork.Config.T28_29_31_32,
  T29_30_32_33: RouletteNetwork.Config.T29_30_32_33,
  T31_32_34_35: RouletteNetwork.Config.T31_32_34_35,
  T32_33_35_36: RouletteNetwork.Config.T32_33_35_36,
  T1_2_3_4_5_6: RouletteNetwork.Config.T1_2_3_4_5_6,
  T4_5_6_7_8_9: RouletteNetwork.Config.T4_5_6_7_8_9,
  T7_8_9_10_11_12: RouletteNetwork.Config.T7_8_9_10_11_12,
  T10_11_12_13_14_15: RouletteNetwork.Config.T10_11_12_13_14_15,
  T13_14_15_16_17_18: RouletteNetwork.Config.T13_14_15_16_17_18,
  T16_17_18_19_20_21: RouletteNetwork.Config.T16_17_18_19_20_21,
  T19_20_21_22_23_24: RouletteNetwork.Config.T19_20_21_22_23_24,
  T22_23_24_25_26_27: RouletteNetwork.Config.T22_23_24_25_26_27,
  T25_26_27_28_29_30: RouletteNetwork.Config.T25_26_27_28_29_30,
  T28_29_30_31_32_33: RouletteNetwork.Config.T28_29_30_31_32_33,
  T31_32_33_34_35_36: RouletteNetwork.Config.T31_32_33_34_35_36,
});

const RLT_BET_CHIP = [
  1000000000, 100000000, 10000000, 2000000, 1000000, 500000, 100000, 50000,
  20000, 10000, 5000, 1000,
];

@ccclass
export default class RLTDoor extends cc.Component {
  @property({ type: RLT_DOOR_CONFIG })
  public door: number = 0;

  @property(cc.Node)
  public nChips: cc.Node = null;

  @property(cc.Node)
  public moneyInDoor: cc.Node = null;

  @property(cc.Node)
  public hl: cc.Node = null;

  private chipPos = cc.v2(0, -2);

  private testAnim = null;

  /////////////////////////////////////////////////////////

  private onClickBet() {
    RouletteController.instance.nSoundControler.playType(
      RLT_SOUND_TYPE.BTN_CLICK
    );
    RouletteController.instance.onSubmitBet(this.door);
  }

  public removeAllChipInDoor() {
    this.nChips.removeAllChildren();
  }

  public addChip(Chip: cc.Node, auraOn: boolean) {
    Chip.getChildByName("Aura").active = auraOn;
    Chip.getChildByName("Aura").width = 92;
    Chip.getChildByName("Aura").height = 48;
    Chip.getChildByName("Phinh").width = 80;
    Chip.getChildByName("Phinh").height = 42;
    Chip.getChildByName("LbMoney").active = false;
    this.nChips.addChild(Chip);
  }

  public setMoneyInDoor(money: number) {
    if (money > 0) {
      this.moneyInDoor.active = true;
      this.moneyInDoor.getComponent(cc.Label).string =
        RLTCommon.convert2Label(money);
      let pos = cc.v2(this.moneyInDoor.x, this.chipPos.y + 1);
      this.moneyInDoor.setPosition(pos);
    } else {
      this.moneyInDoor.active = false;
    }
  }

  public resetNewSession() {
    this.setMoneyInDoor(0);
    this.chipPos = cc.v2(0, -2);
    this.highlight(false);
  }

  public highlight(status: boolean) {
    switch (this.door) {
      case RLT_DOOR_CONFIG.BLACK:
        RouletteController.instance.highLightBlack(status);
        break;

      case RLT_DOOR_CONFIG.RED:
        RouletteController.instance.highLightRed(status);
        break;

      case RLT_DOOR_CONFIG.EVEN:
        RouletteController.instance.highLightEven(status);
        break;

      case RLT_DOOR_CONFIG.ODD:
        RouletteController.instance.highLightOdd(status);
        break;

      default:
        this.hl.active = status;
        if (status) {
          this.hl
            .getComponent(sp.Skeleton)
            .setAnimation(0, this.hl.getComponent(sp.Skeleton).animation, true);
        }
        break;
    }
  }

  public getPosOfChip(): cc.Vec2 {
    this.chipPos.y += 3;
    return this.chipPos;
  }

  public countBetChip(money: number, auraOn: boolean) {
    let moneyTemp = money;
    this.removeAllChipInDoor();
    this.chipPos = cc.v2(0, -3);
    for (let i of RLT_BET_CHIP) {
      let count = Math.floor(money / i);
      if (count > 0) {
        money -= count * i;
        for (let index = 0; index < count; index++) {
          let nChipBet = cc.instantiate(RouletteController.instance.prfChip);
          nChipBet.getComponent(RLTPhinh).setFaceMoney(i);
          let pos = this.getPosOfChip();
          nChipBet.setPosition(pos);
          this.addChip(nChipBet, auraOn);
        }
      }
    }
    this.setMoneyInDoor(moneyTemp);
  }

  public getAllChipInDoor(): Array<cc.Node> {
    return this.nChips.children;
  }
}
