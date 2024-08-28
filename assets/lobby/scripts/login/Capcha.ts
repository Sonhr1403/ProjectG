import { LobbyConst } from "../../LobbyConst";


let API_CAPCHA = {
  Login: "",
  Telco: "",
}
const { ccclass, property } = cc._decorator;

@ccclass
export default class CapchaF extends cc.Component {
  @property(cc.Sprite)
  capcha: cc.Sprite = null;

  @property(cc.Boolean)
  isTelco: boolean = false;

  private capchaId: string = "";

  private mUrl: string = "";

  start() {
    this.refreshCapcha();
  }

  public refreshCapcha(): void {
  
    let accessTokenUrl = '';
    let BASE_URL = LobbyConst.BASE_URL;
    let url = BASE_URL + 'c=124' + '&at=' + accessTokenUrl;
    if (this.isTelco) url = API_CAPCHA.Telco;

    this.sendGetCaptcha(url);
  }

  public getCapChaId(): string {
    return this.capchaId;
  }

  public resetCapcha() {
    this.capcha.node.active = false;
  }

  public sendGetCaptcha(pUrl: string) {
    this.mUrl = pUrl;
    let self = this;

    BGUI.Https.get(pUrl, (response) => {
      BGUI.ZLog.log(response);
      let userConfig = response;
      self.capchaId = userConfig['id'];
      let dataImg = userConfig['img'];
      dataImg = dataImg.replace(/\r\n/g, "");
      self.loadImgBinary(dataImg);
    });
  }

  private loadImgBinary(pBinary: any) {
    let base64Data = "data:image/png;base64," + pBinary; //btoa(String.fromCharCode.apply(null, pBinary));
    let imgElement = new Image();
    imgElement.width = 130;
    imgElement.height = 60;

    let self = this;
    imgElement.onload = function () {
      let sprite = new cc.Texture2D();
      sprite.initWithElement(imgElement);
      sprite.handleLoadedTexture();
      let spriteFrame = new cc.SpriteFrame(sprite);
      self.capcha.node.active = true;
      self.capcha.spriteFrame = spriteFrame;
    };
    imgElement.src = base64Data;
  }
}
