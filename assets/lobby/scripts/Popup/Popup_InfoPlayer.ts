// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { LobbyCmdId, LobbyConst } from "../../LobbyConst";
import AvatarsCtrl from "../AvatarsCtrl";
import HeaderCtrl from "../HeaderCtrl";
import LobbyCtrl from "../LobbyCtrl";
import { cmdReceive } from "../network/LobbyReceive";
import { LobbySend } from "../network/LobbySend";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Popup_InfoPlayer extends cc.Component {
  public static instance: Popup_InfoPlayer = null;

  @property(cc.Label)
  private playerName: cc.Label = null;

  @property(cc.Label)
  private playerId: cc.Label = null;

  @property(cc.Sprite)
  private playerVipLvl: cc.Sprite = null;

  @property(cc.Label)
  private playerVintotal: cc.Label = null;

  @property(cc.Label)
  private playerMatchPlayed: cc.Label = null;

  @property(cc.Label)
  private playerWinrate: cc.Label = null;

  @property(cc.Sprite)
  private playerAvatar: cc.Sprite = null;

  @property(cc.EditBox)
  private editBox: cc.EditBox = null;

  // LIFE-CYCLE CALLBACKS:

  updateInfo(res) {
    this.playerName.string =
      "Player name: " + this.displayName(res.displayName);
    this.playerVipLvl.spriteFrame = LobbyCtrl.instance.vipSF[res.viplvl];
    this.playerId.string = "ID: " + res.id;
    this.playerVintotal.string =
      BGUI.Utils.formatMoneyWithCommaOnly(res.vinTotal) + " Chips";
    this.playerMatchPlayed.string = this.convert2Label(res.totalMatch);
    this.playerWinrate.string = res.winRate.toFixed(2) + "%";
    this.updateAvatar(res.avatar);
  }

  updateAvatar(avaUrl: string) {
    cc.log(
      avaUrl,
      BGUI.UserManager.instance.mainUserInfo.avatar,
      avaUrl === BGUI.UserManager.instance.mainUserInfo.avatar
    );
    let avaDownload =  HeaderCtrl.instance.avaDownload;
    let defaultAva = AvatarsCtrl.instance.defaultAvatars;
    if (avaUrl !== "0") {
      if (avaUrl !== BGUI.UserManager.instance.mainUserInfo.avatar) {
        cc.assetManager.loadRemote(avaUrl, (err, texture) => {
          if (err) {
            console.error("Failed to load image: ", err);
            this.playerAvatar.spriteFrame = avaDownload;
            return;
          }

          if (texture instanceof cc.Texture2D) {
            HeaderCtrl.instance.avaDownload = new cc.SpriteFrame(texture);
            this.playerAvatar.spriteFrame = HeaderCtrl.instance.avaDownload;
            HeaderCtrl.instance.spAvatar.spriteFrame =
              HeaderCtrl.instance.avaDownload;
            BGUI.UserManager.instance.mainUserInfo.avatar = avaUrl;
          } else {
            console.error("Loaded asset is not a Texture2D");
            this.playerAvatar.spriteFrame = avaDownload;
            return;
          }
        });
      } else {
        this.playerAvatar.spriteFrame = avaDownload;
      }
    } else {
      this.playerAvatar.spriteFrame = defaultAva;
    }
  }

  onClickChangeDisplayName() {
    try {
      let pk = new LobbySend.SendChangeDisplayName();
      pk.nickName = this.editBox.string;
      BGUI.NetworkPortal.instance.sendPacket(pk);
    } catch (error) {
      console.error("Change DN Error: ", error);
    }
  }

  receiveChangeDisplayName(cmdId: any, data: Uint8Array) {
    let res = new cmdReceive.ReceivedChangeDisplayName();
    res.unpackData(data);
    console.error("HHHHH CHANGE_DISPLAYNAME", res);

    let error = res.error;

    switch (error) {
      case 0:
        BGUI.UserManager.instance.mainUserInfo.displayName =
          this.editBox.string;
        this.playerName.string = this.editBox.string;
        HeaderCtrl.instance.lbDisplayName.string = this.editBox.string;
        break;

      default:
        console.error("receiveChangeDisplayName", error);
        break;
    }

    this.editBoxHide();
  }

  resizeImage(file: File, targetSizeMB: number): Promise<File> {
    return new Promise((resolve, reject) => {
      let maxSizeBytes = targetSizeMB * 1024 * 1024; // Convert target size to bytes
      let image = new Image();

      // Load the image
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target && event.target.result) {
          image.src = event.target.result as string;
        }
      };
      reader.onerror = (event: ProgressEvent<FileReader>) => {
        reject(new Error("Failed to read the image file."));
      };
      reader.readAsDataURL(file);

      // Resize the image once it's loaded
      image.onload = () => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d")!;

        // Calculate the new width and height based on the target size
        let width = image.width;
        let height = image.height;
        let quality = 1; // Adjust the quality factor as needed

        while (width * height * 4 > maxSizeBytes) {
          width *= 0.9; // Reduce the width by 10%
          height *= 0.9; // Reduce the height by 10%
          quality *= 0.9; // Reduce the quality by 10%
        }

        // Set the canvas size to the new dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw the resized image on the canvas
        ctx.drawImage(image, 0, 0, width, height);

        // Convert the canvas content to a Blob
        canvas.toBlob(
          (blob: Blob | null) => {
            if (blob) {
              // Create a new File from the Blob
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: file.lastModified,
              });
              resolve(resizedFile);
            } else {
              reject(new Error("Failed to resize the image."));
            }
          },
          file.type,
          quality
        );
      };

      image.onerror = () => {
        reject(new Error("Failed to load the image."));
      };
    });
  }

  convertImageToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      // Gắn sự kiện hoàn thành việc đọc tệp
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        resolve(arrayBuffer);
      };

      // Gắn sự kiện lỗi khi đọc tệp
      reader.onerror = () => {
        reject(reader.error);
      };

      // Đọc tệp dưới dạng ArrayBuffer
      reader.readAsArrayBuffer(file);
    });
  }

  convertImgType(type: string) {
    switch (type) {
      case "image/jpg":
        return "jpg";

      case "image/jpeg":
        return "jpeg";

      case "image/png":
        return "png";

      default:
        break;
    }
  }

  async prepareImg(file, type) {
    try {
      let resizedFile = await this.resizeImage(file, 10); // Resize to 10 MB
      // Use the resized file as needed
      console.log(file, resizedFile);
      this.convertImageToArrayBuffer(resizedFile)
        .then((binaryData) => {
          console.log(binaryData);
          // Dữ liệu tệp ảnh đã được chuyển đổi thành ArrayBuffer
          let avaUrl =
            LobbyConst.BASE_URL +
            "c=125&nn=" +
            BGUI.UserManager.instance.mainUserInfo.username +
            "&it=" +
            type;
          this.uploadImageToBE(avaUrl, binaryData);
        })
        .catch((error) => {
          // Xảy ra lỗi khi chuyển đổi tệp ảnh
          console.error(error);
        });
    } catch (error) {
      console.error("Failed to resize the image:", error);
    }
  }

  uploadImageToBE(url: string, fileData: ArrayBuffer) {
    let headers = new Headers();
    headers.append("Content-Type", "application/octet-stream");

    fetch(url, {
      method: "POST",
      headers: headers,
      body: fileData,
    })
      .then((response) => {
        if (response.ok) {
          // console.log("Yêu cầu thành công", response.json());
          return response.json();
        } else {
          console.error("Yêu cầu thất bại");
        }
      })
      .then((data) => {
        console.error(data);
        let error = Number(data.errorCode);
        console.log(error);
        switch (error) {
          case 1001:
            console.log("Server error");
            break;
          case 1002:
            console.log("User not found");
            break;
          case 1003:
            console.log("Invalid data");
            break;
          case 1004:
            console.log("Bucket not found");
            break;
          case 1005:
            console.log("Not valid format");
            break;
          case 1006:
            console.log("Exceed the maximum capacity");
            break;
          case 1007:
            console.log("Error when upload");
            break;
          case 1008:
            console.log("Error when save to db");
            break;

          case 0:
            this.updateAvatar(data.avatarUrl);
            break;
        }
      })
      .catch((error) => {
        console.error("Lỗi kết nối:", error);
      });
  }

  openFileBrowser(callback: (filePath: string | null) => void) {
    // if (cc.sys.isNative) {
    //   // Mở cửa sổ tìm file trên hệ điều hành nền tảng
    //   let { remote } = require("electron");
    //   let dialog = remote.dialog;
    //   let options = {
    //     properties: ["openFile"],
    //     filters: [
    //       { name: "Images", extensions: ["png", "jpg", "jpeg"] },
    //       { name: "All Files", extensions: ["*"] },
    //     ],
    //   };

    //   dialog.showOpenDialog(options).then(async (result: any) => {
    //     let filePaths = result.filePaths;
    //     if (filePaths && filePaths.length > 0) {
    //       let file = filePaths.files[0];
    //       let type = this.convertImgType(file.type);
    //       if (file) {
    //         this.prepareImg(file, type);
    //       } else {
    //         callback(null);
    //       }
    //     } else {
    //       callback(null);
    //     }
    //   });
    // } else {
      // Hiển thị input type file trong trình duyệt web
      let fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".png,.jpg,.jpeg";
      fileInput.addEventListener("change", async (event: Event) => {
        let input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
          let file = input.files[0];
          let type = this.convertImgType(file.type);
          if (file) {
            this.prepareImg(file, type);
          } else {
            callback(null);
          }
        }
      });
      fileInput.click();
    // }
  }

  displayName(name) {
    if (name === undefined) return "";
    name = name.trim();
    return name;
  }

  onClickHide() {
    this.node.active = false;
  }

  openEditBox() {
    this.editBox.node.width = this.playerName.node.width;
    this.editBox.node.active = true;
    this.editBox.string = BGUI.UserManager.instance.mainUserInfo.displayName;
  }

  logOut() {
    this.onClickHide();
    LobbyCtrl.instance.logOut();
  }

  onLoad() {
    Popup_InfoPlayer.instance = this;
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    BGUI.NetworkPortal.instance.addCmdListener(
      LobbyCmdId.CHANGE_DISPLAYNAME,
      this.receiveChangeDisplayName,
      this
    );
  }

  editBoxHide() {
    this.editBox.node.active = false;
  }

  public onKeyUp(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.enter:
        this.onClickChangeDisplayName();
        break;
    }
  }

  convert2Label(num) {
    let data = num;
    let returnKey = "";
    if (data / 1000 >= 1) {
      data = data / 1000;
      returnKey = "K";
      if (data / 1000 >= 1) {
        data = data / 1000;
        returnKey = "M";
        if (data / 1000 >= 1) {
          data = data / 1000;
          returnKey = "B";
          if (data / 1000 >= 1) {
            data = data / 1000;
            returnKey = "T";
          }
        }
      }
    }
    if (!this.isInt(data)) {
      if (data > 100) {
        data = data.toFixed(1);
      } else if (data > 10) {
        data = data.toFixed(2);
      } else {
        data = data.toFixed(2);
      }
    }
    return data + returnKey;
  }

  isInt(num) {
    return num % 1 === 0;
  }

  // offTouch() {
  //   this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
  //   this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
  //   this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
  //   this.node.off(cc.Node.EventType.MOUSE_DOWN, this.onTouchStart, this);
  //   this.node.off(cc.Node.EventType.MOUSE_MOVE, this.onTouchMove, this);
  //   this.node.off(cc.Node.EventType.MOUSE_UP, this.onTouchEnd, this);
  // }

  // onTouch() {
  //   this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
  //   this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
  //   this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
  //   this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onTouchStart, this);
  //   this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onTouchMove, this);
  //   this.node.on(cc.Node.EventType.MOUSE_UP, this.onTouchEnd, this);
  // }

  // private isMoving: boolean = false;
  // private touchStartPosition: cc.Vec2 = cc.Vec2.ZERO;

  // onTouchStart(event: cc.Event.EventMouse | cc.Event.EventTouch) {
  //   console.log("start");
  //   // Lấy vị trí bắt đầu của sự kiện
  //   let touchPosition: cc.Vec2 =
  //   this.node.convertToWorldSpaceAR(
  //     this.node.convertToNodeSpaceAR(
  //       event.getLocation()
  //       )
  //   )
  //   ;
  //   this.touchStartPosition = touchPosition;

  //   // Kiểm tra xem sự kiện có liên quan đến sprite không
  //   if (
  //     this.playerAvatar.node.getBoundingBoxToWorld().contains(touchPosition)
  //   ) {
  //     this.isMoving = true;
  //   }
  // }

  // onTouchMove(event: cc.Event.EventMouse | cc.Event.EventTouch) {
  //   console.log("move", this.isMoving);

  //   if (!this.isMoving) return;

  //   // Lấy vị trí di chuyển
  //   let touchPosition: cc.Vec2 =
  //   this.node.convertToWorldSpaceAR(
  //     this.node.convertToNodeSpaceAR(
  //       event.getLocation()
  //       )
  //   )
  //   ;

  //   // Tính toán khoảng cách di chuyển
  //   let delta: cc.Vec2 = touchPosition.sub(this.touchStartPosition);

  //   // Tính toán vị trí mới dựa trên khoảng cách di chuyển
  //   let newPosition: cc.Vec3 = this.playerAvatar.node.position.add(
  //     new cc.Vec3(delta.x, delta.y, 0)
  //   );

  //   // Kiểm tra giới hạn của sprite trong khung
  //   let spriteBoundingBox: cc.Rect =
  //     this.playerAvatar.node.getBoundingBoxToWorld();
  //   let containerBoundingBox: cc.Rect = this.playerAvatar.node.getBoundingBoxToWorld();

  //   // Xác định giới hạn tối đa và tối thiểu
  //   let minX: number = containerBoundingBox.xMin + spriteBoundingBox.width / 2;
  //   let maxX: number = containerBoundingBox.xMax - spriteBoundingBox.width / 2;
  //   let minY: number = containerBoundingBox.yMin + spriteBoundingBox.height / 2;
  //   let maxY: number = containerBoundingBox.yMax - spriteBoundingBox.height / 2;

  // // Kiểm tra xem vị trí mới có vượt quá giới hạn không
  // if (newPosition.x < minX) {
  //   newPosition.x = minX;
  // } else if (newPosition.x > maxX) {
  //   newPosition.x = maxX;
  // }

  // if (newPosition.y < minY) {
  //   newPosition.y = minY;
  // } else if (newPosition.y > maxY) {
  //   newPosition.y = maxY;
  // }

//   // Di chuyển sprite đến vị trí mới
//   this.playerAvatar.node.setPosition(newPosition);

//     // Cập nhật vị trí bắt đầu của sự kiện
//     this.touchStartPosition = touchPosition;
//   }

//   onTouchEnd(event: cc.Event.EventMouse | cc.Event.EventTouch) {
//     console.log("end");

//     this.isMoving = false;
//   }

//   protected onDestroy(): void {
//     // this.offTouch();
//     cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
//     BGUI.NetworkPortal.instance.removeCmdListener(
//       this,
//       LobbyCmdId.CHANGE_DISPLAYNAME
//     );
//     BGUI.NetworkPortal.instance.removeCmdListener(
//       this,
//       LobbyCmdId.CHANGE_AVATAR
//     );
//   }
}

// export function __nodeVersion(__nodeVersion: any) {
//   throw new Error("Function not implemented.");
// }
