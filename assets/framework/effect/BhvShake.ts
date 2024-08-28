
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("BGUI/Movement/Shake")
export default class BhvShake extends BGUI.BhvShake {

    @property({
        tooltip: 'Chế độ chuyển động, chế độ di chuyển sẽ không khôi phục tọa độ của đối tượng trở lại trạng thái trước khi xảy ra rung lắc, thích hợp cho các đối tượng chuyển động'
    })
    movingMode: boolean = false;

    @property({
        tooltip: 'Chế độ phân rã, sẽ giảm dần theo cường độ của thời gian rung'
    })
    decayMode: boolean = false;

    @property({
        visible: function () { return this.decayMode === true },
        tooltip: 'Giảm chấn, tốc độ tại đó bán kính giảm dần trong quá trình rung'
    })
    damping: number = 0.01;

    @property({
        tooltip: 'Thời gian rung'
    })
    shakeTime: number = 0.5;

    /**初始值 */
    @property({
        tooltip: 'Sự bù trừ của rung động x, y'
    })
    intensity: cc.Vec2 = cc.v2(5, 5);

    
}

