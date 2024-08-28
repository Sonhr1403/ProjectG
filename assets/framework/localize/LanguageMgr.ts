export const COUNTRY = {
  VIETNAM: "vn",
  THAILAND: "tl",
  ENGLAND: "en",
  INDO: "id",
  MALAYSIA: "my",
  MYANMAR: "mm",
  GOFA: "gofa",
  INTERNATIONAL: "international",
};

export const LANGUAGE = {
  VIETNAMESE: "vn",
  ENGLISH: "en",
  MYANMAR: "mm",
  THAILAN: "tl",
  CAMBODIA: "cam",
};

export enum LABEL_FONT_SIZE_CONFIG {
  TITLE_POPUP,
  CONTENT_POPUP,
  BUTTON_POPUP,
  TITLE_MENU,
  CONTENT_MENU,
  NORMAL,
}

const Polyglot = require("polyglot");

const language = require("en"); // update this to set your default displaying language in editor
// const language = require(UserData.getString(UserDataKey.LANGUAGE, "") || (CC_DEV ? LANGUAGE.ENGLISH : LANGUAGE.ENGLISH));

let polyglot = new Polyglot({ phrases: language });

// BGUI.ZLog.log("polyglot ====" + polyglot);

export class LanguageMgr extends BGUI.LanguageMgr {
  public static init() {
    BGUI.ZLog.log("BGUI.ClientDataKey.LANGUAGE", BGUI.ClientDataKey.LANGUAGE);
    let data = BGUI.ClientData.getString(BGUI.ClientDataKey.LANGUAGE, "");
    if (!data) data = LanguageMgr.instance.getCurrentLanguage();
    polyglot.replace(data);
  }

  public static getString(key, opt: object = {}) {
    return polyglot.t(key, opt);
  }

  public static updateLocalization(language: string) {
    let data = require(language);
    BGUI.ZLog.log("language =========" + language);
    BGUI.ZLog.log("data =========" + JSON.stringify(data));
    polyglot.replace(data);
  }

  public static updateLang(fromIp: string = COUNTRY.VIETNAM) {
    var defaultLang = BGUI.ClientData.getString(
      BGUI.ClientDataKey.LANGUAGE,
      ""
    );
    BGUI.ZLog.log("defaultLang ==------------------" + defaultLang);
    if (!defaultLang) {
      switch (fromIp) {
        case COUNTRY.VIETNAM:
          defaultLang = LANGUAGE.VIETNAMESE;
          break;
        case COUNTRY.ENGLAND:
          defaultLang = LANGUAGE.ENGLISH;
          break;
        case COUNTRY.MYANMAR:
          defaultLang = LANGUAGE.MYANMAR;
          break;
        default:
          defaultLang = LANGUAGE.ENGLISH;
      }
      // defaultLang.toLocaleLowerCase();
      BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, defaultLang);
    }
    cc.error(defaultLang);
    this.updateLocalization(defaultLang);
  }

  public static upLang(key: string) {
    let lang = "";
    switch (key) {
      case COUNTRY.VIETNAM:
        lang = LANGUAGE.VIETNAMESE;
        break;
      case COUNTRY.ENGLAND:
        lang = LANGUAGE.ENGLISH;
        break;
      case COUNTRY.MYANMAR:
        lang = LANGUAGE.MYANMAR;
        break;
      case COUNTRY.THAILAND:
        lang = LANGUAGE.THAILAN;
        break;
      default:
        lang = LANGUAGE.ENGLISH;
    }
    BGUI.ClientData.setString(BGUI.ClientDataKey.LANGUAGE, lang);
    this.updateLocalization(lang);
  }
}
