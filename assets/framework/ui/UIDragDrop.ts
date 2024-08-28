
const { ccclass, property } = cc._decorator;

export interface UIDragDropDelegate {
    itemShouldDrag(drag: UIDragDrop): boolean;
}

@ccclass
export default class UIDragDrop extends BGUI.UIDragDrop  {

    @property
    dragAlwaysCenter: boolean = true;

    @property
    backToStartPosition: boolean = false;

    @property
    stickyDrag: boolean = false;

    @property
    propagateTouchEvent: boolean = true;

    @property
    dragScale: number = 1;

    @property
    disableScrollViewWhileDrag: boolean = true;

   
}
