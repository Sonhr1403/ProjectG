import { DragonTiger_Const } from "./DragonTiger.Const";
import DragonTiger_GameManager from "./DragonTiger.GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonTiger_ColliderTouch extends cc.Component {

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
                let collider = this.node.getComponents(cc.BoxCollider).find(element => {
                    return cc.Intersection.pointInPolygon(touchLoc, element.world.points)
                });
                if (collider) this.onColliderTouchEvent(collider);
                return true;
            }, this);
    }

    onColliderTouchEvent(collider) {
        let divId = collider.tag;
        // let offset = collider.offset;

        switch (divId) {
            case DragonTiger_Const.BET_SIDE.DRAGON:
                BGUI.ZLog.log('BET SIDE -->  DRAGON ==>  ', divId);
                break;
            case DragonTiger_Const.BET_SIDE.TIGER:
                BGUI.ZLog.log('BET SIDE -->  TIGER ===> ', divId);
                break;
            case DragonTiger_Const.BET_SIDE.SHAN:
                BGUI.ZLog.log('BET SIDE -->  SHAN ===> ', divId);
                break;
            case DragonTiger_Const.BET_SIDE.STRAIGHT:
                BGUI.ZLog.log('BET SIDE -->  STRAIGHT= ==> ', divId);
                break;
            case DragonTiger_Const.BET_SIDE.STRAIGHTFLUSH:
                BGUI.ZLog.log('BET SIDE -->  STRAIGHTFLUSH= ==> ', divId);
                break;
        }

        DragonTiger_GameManager.instance.sendBetPotOnTable(divId);
    }
}
