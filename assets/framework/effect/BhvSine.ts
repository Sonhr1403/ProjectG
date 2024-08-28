

const { ccclass, property, menu } = cc._decorator;



let _2pi: number = 2 * Math.PI;
let _pi_2: number = Math.PI / 2;
let _3pi_2: number = (3 * Math.PI) / 2;


@ccclass
@menu("BGUI/Movement/Sine (Chức năng chuyển động)")
export default class BhvSine extends BGUI.BhvSine {


    @property({ tooltip: "Được kích hoạt ở chức năng bắt đầu" })
    activeAtStart: boolean = true;

    @property({
        type: cc.Enum(BGUI.MOVEMENT),
        tooltip: "Loại thuộc tính nào được sử dụng cho chuyển động chu kỳ sin"
    })
    movement: BGUI.MOVEMENT = BGUI.MOVEMENT.vertical;

    @property({
        type: cc.Enum(BGUI.WAVE),
        tooltip: "Dạng Sóng"
    })
    wave: BGUI.WAVE = BGUI.WAVE.sine;


    @property({ tooltip: "" })
    period: number = 4;

    @property({ tooltip: "Khoảng thời gian ngẫu nhiên" })
    periodRandom: number = 0;


    @property({ tooltip: "Chu kỳ bù đắp" })
    periodOffset: number = 0;


    @property({ tooltip: "Giá trị bù chu kỳ Ngẫu nhiên" })
    periodOffsetRandom: number = 0;


    @property({ tooltip: "Phạm vi dao động" })
    magnitude: number = 50

    @property({ tooltip: "Giá trị ngẫu nhiên của biên độ dao động" })
    magnitudeRandom: number = 0;



}
