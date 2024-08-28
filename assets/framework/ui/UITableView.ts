import UIScrollBar from "./UIScrollBar";
import UIScrollView from "./UIScrollView";


const { ccclass, property } = cc._decorator;
@ccclass
export default class UITableView extends BGUI.UITableView{

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
  
    @property({
        type: cc.Enum(BGUI.UITableViewFillOrder)
    })
    fillOrder: BGUI.UITableViewFillOrder = BGUI.UITableViewFillOrder.LEFT_TO_RIGHT__TOP_TO_BOTTOM;

    @property({
        type: cc.Enum(BGUI.UITableViewInteractionMode)
    })

    interactionMode: BGUI.UITableViewInteractionMode = BGUI.UITableViewInteractionMode.NONE;

    @property(cc.Boolean)
    cellPagingEnabled: boolean = false;

    @property(cc.Integer)
    numberOfPagingCell: number = 1;

    @property(cc.Prefab)
    tableCell: cc.Prefab = null;

    @property(cc.Node)
    nEmpty: cc.Node = null;
}
