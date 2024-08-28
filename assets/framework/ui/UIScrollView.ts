import UIScrollBar from "./UIScrollBar";

const { ccclass, property} = cc._decorator;

@ccclass
export default class UIScrollView extends BGUI.UIScrollView {
    @property({
        type: cc.Enum(BGUI.UIScrollDirection)
    })
    direction: BGUI.UIScrollDirection = BGUI.UIScrollDirection.BOTH;

    @property
    zoomScaleEnabled: boolean = false;

    @property
    maxScale: number = 1.0;

    @property
    minScale: number = 1.0;

    @property(cc.Node)
    content: cc.Node = null;

    @property
    scrollEnabled: boolean = true;

    @property
    touchEnabled: boolean = true;

    @property
    dragChildrenEnabled: boolean = false;

    @property
    easingAutoScroll: boolean = true;

    @property
    movementFactor: number = 0.64;

    @property(UIScrollBar)
    horizontalScrollBar: UIScrollBar = null;

    @property(UIScrollBar)
    verticalScrollBar: UIScrollBar = null;

    @property
    autoClearAutoScroll: boolean = false;

    @property
    autoClearAutoZoomScale: boolean = false;

  


}
