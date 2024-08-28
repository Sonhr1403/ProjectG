import { LanguageMgr } from "../../framework/localize/LanguageMgr";
import SlotKKController from "./SlotKK.Controller";
import SlotKKMusicManager, { SLOT_SOUND_TYPE } from "./SlotKK.Music";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotKKInfo extends cc.Component {
  @property(cc.Node)
  private pageNode: cc.Node = null;

  @property(cc.Button)
  private listBtn: cc.Button[] = [];

  @property(cc.Node)
  private coin: cc.Node = null;

  @property(cc.Label)
  private listLbl: cc.Label[] = [];

  ////////////////////////////////////////////////////

  private page = 0;

  private listX = [-2500, 0, 2500];

  private currentPage: cc.Node = null;

  private listValue = [3.75, 2.25, 1.5, 1.25, 2.00, 1.50, 1.25, 1.00, 1.75, 1.25, 1.00, 0.50, 1.50, 1.00, 0.75, 0.40, 0.75, 0.60, 0.50, 0.30, 0.75, 0.60, 0.50, 0.30, 0.50, 0.40, 0.30, 0.20, 0.50, 0.40, 0.30, 0.20, 0.20, 0.15, 0.10, 0.05, 0.20, 0.15, 0.10, 0.05, 0.20, 0.15, 0.10, 0.05];

  // LIFE-CYCLE CALLBACKS:

  public onOpen() {
    let lang = SlotKKController.instance.lang;
    if (lang === "mm") {
      this.coin.active = false;
    }
    cc.tween(this.node).to(0.25, { scale: 1 }).start();
    this.page = 0;
    this.currentPage = this.pageNode.getChildByName(this.page.toString());
    this.pageNode
      .getChildByName(this.page.toString())
      .setPosition(cc.v2(this.listX[1], 0));
    for (let i = 1; i < this.pageNode.childrenCount; i++) {
      this.pageNode
        .getChildByName(i.toString())
        .setPosition(cc.v2(this.listX[2], 0));
    }
    this.updateLabel();
  }

  private updateLabel(){
    let bet = SlotKKController.instance.listBet[SlotKKController.instance.betAmount];
    for (let i = 0; i < this.listLbl.length; i++) {
      this.listLbl[i].string = BGUI.Utils.formatMoneyWithCommaOnly(this.listValue[i] * bet);
    }
  }

  private close() {
    SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    cc.tween(this.node).to(0.25, { scale: 0 }).start();
  }

  private onClickLeft() {
    SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.page -= 1;
    if (this.page < 0) {
      this.page = 13;
      this.currentPage = this.pageNode.getChildByName(this.page.toString());
      for (let btn of this.listBtn) {
        btn.interactable = false;
      }
      cc.tween(this.pageNode.getChildByName("0"))
        .to(0.03, { position: cc.v3(this.listX[0], 0, 0) }, { easing: "" })
        .call(() => {
          cc.tween(this.pageNode.getChildByName("1"))
            .to(0.03, { position: cc.v3(this.listX[0], 0, 0) }, { easing: "" })
            .call(() => {
              cc.tween(this.pageNode.getChildByName("2"))
                .to(
                  0.03,
                  { position: cc.v3(this.listX[0], 0, 0) },
                  { easing: "" }
                )
                .call(() => {
                  cc.tween(this.pageNode.getChildByName("3"))
                    .to(
                      0.03,
                      { position: cc.v3(this.listX[0], 0, 0) },
                      { easing: "" }
                    )
                    .call(() => {
                      cc.tween(this.pageNode.getChildByName("4"))
                        .to(
                          0.03,
                          { position: cc.v3(this.listX[0], 0, 0) },
                          { easing: "" }
                        )
                        .call(() => {
                          cc.tween(this.pageNode.getChildByName("5"))
                            .to(
                              0.03,
                              { position: cc.v3(this.listX[0], 0, 0) },
                              { easing: "" }
                            )
                            .call(() => {
                              cc.tween(this.pageNode.getChildByName("6"))
                                .to(
                                  0.03,
                                  { position: cc.v3(this.listX[0], 0, 0) },
                                  { easing: "" }
                                )
                                .call(() => {
                                  cc.tween(this.pageNode.getChildByName("7"))
                                    .to(
                                      0.03,
                                      { position: cc.v3(this.listX[0], 0, 0) },
                                      { easing: "" }
                                    )
                                    .call(() => {
                                      cc.tween(
                                        this.pageNode.getChildByName("8")
                                      )
                                        .to(
                                          0.03,
                                          {
                                            position: cc.v3(
                                              this.listX[0],
                                              0,
                                              0
                                            ),
                                          },
                                          { easing: "" }
                                        )
                                        .call(() => {
                                          cc.tween(
                                            this.pageNode.getChildByName("9")
                                          )
                                            .to(
                                              0.03,
                                              {
                                                position: cc.v3(
                                                  this.listX[0],
                                                  0,
                                                  0
                                                ),
                                              },
                                              { easing: "" }
                                            )
                                            .call(() => {
                                              cc.tween(
                                                this.pageNode.getChildByName(
                                                  "10"
                                                )
                                              )
                                                .to(
                                                  0.03,
                                                  {
                                                    position: cc.v3(
                                                      this.listX[0],
                                                      0,
                                                      0
                                                    ),
                                                  },
                                                  { easing: "" }
                                                )
                                                .call(() => {
                                                  cc.tween(
                                                    this.pageNode.getChildByName(
                                                      "11"
                                                    )
                                                  )
                                                    .to(
                                                      0.03,
                                                      {
                                                        position: cc.v3(
                                                          this.listX[0],
                                                          0,
                                                          0
                                                        ),
                                                      },
                                                      { easing: "" }
                                                    )
                                                    .call(() => {
                                                      cc.tween(
                                                        this.pageNode.getChildByName(
                                                          "12"
                                                        )
                                                      )
                                                        .to(
                                                          0.03,
                                                          {
                                                            position: cc.v3(
                                                              this.listX[0],
                                                              0,
                                                              0
                                                            ),
                                                          },
                                                          { easing: "" }
                                                        )
                                                        .call(() => {
                                                          cc.tween(
                                                            this.pageNode.getChildByName(
                                                              "13"
                                                            )
                                                          )
                                                            .to(
                                                              0.03,
                                                              {
                                                                position: cc.v3(
                                                                  this.listX[1],
                                                                  0,
                                                                  0
                                                                ),
                                                              },
                                                              { easing: "" }
                                                            )
                                                            .call(() => {
                                                              // this.checkPage();
                                                              for (let btn of this
                                                                .listBtn) {
                                                                btn.interactable =
                                                                  true;
                                                              }
                                                            })
                                                            .start();
                                                        })
                                                        .start();
                                                    })
                                                    .start();
                                                })
                                                .start();
                                            })
                                            .start();
                                        })
                                        .start();
                                    })
                                    .start();
                                })
                                .start();
                            })
                            .start();
                        })
                        .start();
                    })
                    .start();
                })
                .start();
            })
            .start();
        })
        .start();
    } else {
      for (let btn of this.listBtn) {
        btn.interactable = false;
      }
      cc.tween(this.currentPage)
        .to(0.2, { position: cc.v3(this.listX[2], 0, 0) }, { easing: "" })
        .call(() => {
          this.currentPage = this.pageNode.getChildByName(this.page.toString());
          cc.tween(this.currentPage)
            .to(0.2, { position: cc.v3(this.listX[1], 0, 0) }, { easing: "" })
            .call(() => {
              for (let btn of this.listBtn) {
                btn.interactable = true;
              }
            })
            .start();
        })
        .start();
    }
  }

  private onClickRight() {
    SlotKKMusicManager.instance.playType(SLOT_SOUND_TYPE.BTN_CLICK);
    this.page += 1;
    if (this.page > 13) {
      this.page = 0;
      this.currentPage = this.pageNode.getChildByName(this.page.toString());
      for (let btn of this.listBtn) {
        btn.interactable = false;
      }

      cc.tween(this.pageNode.getChildByName("13"))
        .to(0.03, { position: cc.v3(this.listX[2], 0, 0) }, { easing: "" })
        .call(() => {
          cc.tween(this.pageNode.getChildByName("12"))
            .to(0.03, { position: cc.v3(this.listX[2], 0, 0) }, { easing: "" })
            .call(() => {
              cc.tween(this.pageNode.getChildByName("11"))
                .to(
                  0.03,
                  { position: cc.v3(this.listX[2], 0, 0) },
                  { easing: "" }
                )
                .call(() => {
                  cc.tween(this.pageNode.getChildByName("10"))
                    .to(
                      0.03,
                      { position: cc.v3(this.listX[2], 0, 0) },
                      { easing: "" }
                    )
                    .call(() => {
                      cc.tween(this.pageNode.getChildByName("9"))
                        .to(
                          0.03,
                          { position: cc.v3(this.listX[2], 0, 0) },
                          { easing: "" }
                        )
                        .call(() => {
                          cc.tween(this.pageNode.getChildByName("8"))
                            .to(
                              0.03,
                              { position: cc.v3(this.listX[2], 0, 0) },
                              { easing: "" }
                            )
                            .call(() => {
                              cc.tween(this.pageNode.getChildByName("7"))
                                .to(
                                  0.03,
                                  { position: cc.v3(this.listX[2], 0, 0) },
                                  { easing: "" }
                                )
                                .call(() => {
                                  cc.tween(this.pageNode.getChildByName("6"))
                                    .to(
                                      0.03,
                                      { position: cc.v3(this.listX[2], 0, 0) },
                                      { easing: "" }
                                    )
                                    .call(() => {
                                      cc.tween(
                                        this.pageNode.getChildByName("5")
                                      )
                                        .to(
                                          0.03,
                                          {
                                            position: cc.v3(
                                              this.listX[2],
                                              0,
                                              0
                                            ),
                                          },
                                          { easing: "" }
                                        )
                                        .call(() => {
                                          cc.tween(
                                            this.pageNode.getChildByName("4")
                                          )
                                            .to(
                                              0.03,
                                              {
                                                position: cc.v3(
                                                  this.listX[2],
                                                  0,
                                                  0
                                                ),
                                              },
                                              { easing: "" }
                                            )
                                            .call(() => {
                                              cc.tween(
                                                this.pageNode.getChildByName(
                                                  "3"
                                                )
                                              )
                                                .to(
                                                  0.03,
                                                  {
                                                    position: cc.v3(
                                                      this.listX[2],
                                                      0,
                                                      0
                                                    ),
                                                  },
                                                  { easing: "" }
                                                )
                                                .call(() => {
                                                  cc.tween(
                                                    this.pageNode.getChildByName(
                                                      "2"
                                                    )
                                                  )
                                                    .to(
                                                      0.03,
                                                      {
                                                        position: cc.v3(
                                                          this.listX[2],
                                                          0,
                                                          0
                                                        ),
                                                      },
                                                      { easing: "" }
                                                    )
                                                    .call(() => {
                                                      cc.tween(
                                                        this.pageNode.getChildByName(
                                                          "1"
                                                        )
                                                      )
                                                        .to(
                                                          0.03,
                                                          {
                                                            position: cc.v3(
                                                              this.listX[2],
                                                              0,
                                                              0
                                                            ),
                                                          },
                                                          { easing: "" }
                                                        )
                                                        .call(() => {
                                                          cc.tween(
                                                            this.pageNode.getChildByName(
                                                              "0"
                                                            )
                                                          )
                                                            .to(
                                                              0.03,
                                                              {
                                                                position: cc.v3(
                                                                  this.listX[1],
                                                                  0,
                                                                  0
                                                                ),
                                                              },
                                                              { easing: "" }
                                                            )
                                                            .call(() => {
                                                              // this.checkPage();
                                                              for (let btn of this
                                                                .listBtn) {
                                                                btn.interactable =
                                                                  true;
                                                              }
                                                            })
                                                            .start();
                                                        })
                                                        .start();
                                                    })
                                                    .start();
                                                })
                                                .start();
                                            })
                                            .start();
                                        })
                                        .start();
                                    })
                                    .start();
                                })
                                .start();
                            })
                            .start();
                        })
                        .start();
                    })
                    .start();
                })
                .start();
            })
            .start();
        })
        .start();
    } else {
      for (let btn of this.listBtn) {
        btn.interactable = false;
      }
      cc.tween(this.currentPage)
        .to(0.2, { position: cc.v3(this.listX[0], 0, 0) }, { easing: "" })
        .call(() => {
          this.currentPage = this.pageNode.getChildByName(this.page.toString());
          cc.tween(this.currentPage)
            .to(0.2, { position: cc.v3(this.listX[1], 0, 0) }, { easing: "" })
            .call(() => {
              for (let btn of this.listBtn) {
                btn.interactable = true;
              }
            })
            .start();
        })
        .start();
    }
  }

  private checkPage() {
    for (let page of this.pageNode.children) {
      if (page.name !== this.page.toString() && page.x === this.listX[1]) {
        if (parseInt(page.name) < this.page) {
          page.x = this.listX[0];
        } else if (parseInt(page.name) > this.page) {
          page.x = this.listX[2];
        }
      }
    }
  }
}
