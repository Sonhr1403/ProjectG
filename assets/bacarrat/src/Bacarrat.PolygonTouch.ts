import GameCoreManager from "../../framework/manager/GameCoreManager";
import { Bacarrat_Const } from "./Bacarrat.Const";
import Bacarrat_GameManager from "./Bacarrat.GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bacarrat_PolygonTouch extends cc.Component {


    colliderTouchEvent = null;
    onLoad() {
        this.colliderTouchEvent = null;
        this.initColliderTouch();
    }

    initColliderTouch() {
        if (this.colliderTouchEvent) return;
        cc.director.getCollisionManager().enabled = true;
        this.colliderTouchEvent = this.node.on(
            cc.Node.EventType.TOUCH_START,
            function (touch, event) {
                let touchLoc = touch.getLocation();
                let collider = this.node.getComponents(cc.PolygonCollider).find(element => {
                    return cc.Intersection.pointInPolygon(touchLoc, element.world.points)
                });
                if (collider) this.onColliderTouchEvent(collider);
                return true;
            }, this);
    }
    onColliderTouchEvent(collider) {
        let divId = collider.tag;
        // let offset = collider.offset;
        // BGUI.ZLog.log('divId = ', divId);
        // BGUI.ZLog.log('offset = ', offset);
        switch (divId) {
            case Bacarrat_Const.TAG_POT.PLAYER:
                BGUI.ZLog.log('BET SIDE -->  PLAYER ==>  ', divId);
                break;
            case Bacarrat_Const.TAG_POT.PLAYER_PAIR:
                BGUI.ZLog.log('BET SIDE -->  PLAYER_PAIR= ==> ', divId);
                break;
            case Bacarrat_Const.TAG_POT.TIE:
                BGUI.ZLog.log('BET SIDE -->  TIE / DRAW= ==> ', divId);
                break;
            case Bacarrat_Const.TAG_POT.BANKER:
                BGUI.ZLog.log('BET SIDE -->  BANKER= ==> ', divId);
                break;
            case Bacarrat_Const.TAG_POT.BANKER_PAIR:
                BGUI.ZLog.log('BET SIDE -->  BANKER_PAIR= ==> ', divId);
                break;
            case Bacarrat_Const.TAG_POT.SUPER_6:
                BGUI.ZLog.log('BET SIDE -->  SUPER_6= ==> ', divId);
                break;
        }

        Bacarrat_GameManager.instance.sendBetPotOnTable(divId);

    }

}
