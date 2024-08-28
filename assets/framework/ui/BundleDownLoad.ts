const { ccclass, property } = cc._decorator;

enum BundleGameID {
  UNKNOWN = -1,
  GAME_ID_LONG_HO = 40,
  GAME_ID_BAU_CUA = 41,
  GAME_ID_SHANKOEMEE = 42,
  GAME_ID_BOOGYI = 43,
  GAME_ID_SHWESHAN = 44,
  GAME_ID_BACARRAT = 45,
  GAME_ID_ROULLETE = 46,
  GAME_ID_POKER = 47,
  GAME_ID_SLOT = 48,
  GAME_ID_BO = 49,
  GAME_ID_PLINKO = 50,
  GAME_ID_WUKONG = 51,
  GAME_ID_KINGKONG = 52,
  GAME_ID_PANDA = 53,
  GAME_ID_GENZ = 54,
  GAME_ID_WEALTHINN = 55,
  GAME_ID_TAMQUOC = 56,
  GAME_ID_ASTROS = 57,
  GAME_ID_VANESSA = 58,
  GAME_ID_SONGKRAN = 59,
  GAME_ID_ONEPIECE = 60,
  GAME_ID_THANHGIONG = 61,
  GAME_ID_MONEYTRAIN2 = 62,
}
@ccclass
export default class BundleDownLoad extends BGUI.BundleDownLoad {
  @property
  isDownloadLocal: boolean = false;

  @property({
    visible: function (this: BundleDownLoad) {
      return this.isDownloadLocal;
    },
  })
  linkUrl: string = "";

  @property({
    visible: function (this: BundleDownLoad) {
      return this.isDownloadLocal;
    },
  })
  bundleName: string = "";

  @property({
    visible: function (this: BundleDownLoad) {
      return this.isDownloadLocal;
    },
  })
  prefabMainNameURL: string = "";

  @property(cc.ProgressBar)
  prgLoadGame: cc.ProgressBar = null;

  @property(cc.Label)
  lbMsg: cc.Label = null;

  @property({
    visible: function (this: BundleDownLoad) {
      return !this.isDownloadBundleNotLoad;
    },
  })
  autoDownload: boolean = false;

  @property({
    visible: function (this: BundleDownLoad) {
      return !this.isDownloadBundleNotLoad;
    },
  })
  isClicked: boolean = false;

  @property({
    type: cc.Enum(BundleGameID),
    tooltip: "Bundle Game ID",
    visible: function (this: BundleDownLoad) {
      return !this.autoDownload;
    },
  })
  gameID: BundleGameID = BundleGameID.UNKNOWN;

  @property({
    visible: function (this: BundleDownLoad) {
      return !this.autoDownload;
    },
  })
  isDownloadBundleNotLoad: boolean = false;
}
