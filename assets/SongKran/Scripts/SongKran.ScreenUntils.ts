export class StretchingType {
  static HORIZONTAL = 0;
  static VERTICAL = 1;
  static FULL = 2;
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScreenUtils extends cc.Component {
  @property({ type: cc.Integer })
  public _stretching = -1;

  @property({ type: cc.Integer, range: [0, 2], slide: true })
  get stretching(): number {
    return this._stretching;
  }

  set stretching(newNumber: number) {
    this._stretching = newNumber;
  }

  private isSpine: boolean = false;
  /////////////////////////////////////////////////////////////////////////

  protected onLoad(): void {
    if (this.node.getComponent(sp.Skeleton)) {
      this.isSpine = true;
    } else {
      this.isSpine = false;
    }
    if (!this.isSpine) {
      this.updateStretching();
    } else {
      this.updateSpine();
    }
    cc.view.setResizeCallback(() => {
      if (!this.isSpine) {
        this.updateStretching();
      } else {
        this.updateSpine();
      }
    });
  }

  private calcResolutionRatio(): number {
    const design: cc.Size = cc.view.getDesignResolutionSize();
    const frame: cc.Size = cc.view.getFrameSize();
    if (frame.height / frame.width < design.height / design.width) {
      return frame.height / design.height;
    } else {
      return frame.width / design.width;
    }
  }

  private updateStretching(): void {
    const screenRatio: number = this.calcResolutionRatio();
    switch (this.stretching) {
      case StretchingType.HORIZONTAL:
        this.node.width = cc.view.getFrameSize().width / screenRatio;
        break;
      case StretchingType.VERTICAL:
        this.node.height = cc.view.getFrameSize().height / screenRatio;
        break;
      case StretchingType.FULL:
        this.node.width = cc.view.getFrameSize().width / screenRatio;
        this.node.height = cc.view.getFrameSize().height / screenRatio;
        break;
      default:
        break;
    }
  }
  
  private updateSpine() {
    const screenRatio = this.calcResolutionRatio();
    switch (this.stretching) {
      case StretchingType.HORIZONTAL:
        this.node.scaleX =
          cc.view.getFrameSize().width / screenRatio / this.node.width + 0.1;
        break;
      case StretchingType.VERTICAL:
        this.node.scaleY =
          cc.view.getFrameSize().height / screenRatio / this.node.height + 0.1;
        // this.node.y = -cc.view.getFrameSize().height / screenRatio / 2;
        break;
      case StretchingType.FULL:
        if (
          cc.view.getFrameSize().width / screenRatio / this.node.width + 0.1 >
          cc.view.getFrameSize().height / screenRatio / this.node.height + 0.1
        ) {
          this.node.scaleX =
            cc.view.getFrameSize().width / screenRatio / this.node.width + 0.1;
          this.node.scaleY =
            cc.view.getFrameSize().width / screenRatio / this.node.width + 0.1;
        } else {
          this.node.scaleX =
            cc.view.getFrameSize().height / screenRatio / this.node.height + 0.1;
          this.node.scaleY =
            cc.view.getFrameSize().height / screenRatio / this.node.height +
            0.1;
        }
        // this.node.y = -cc.view.getFrameSize().height / screenRatio / 2;
        break;
      default:
        break;
    }
  }
}
