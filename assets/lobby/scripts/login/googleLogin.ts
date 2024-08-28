// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class GoogleSignIn extends cc.Component {
    private auth2: gapi.auth2.GoogleAuth | null = null;

    start() {
        gapi.load('auth2', () => {
            this.auth2 = gapi.auth2.init({
                client_id: 'YOUR_CLIENT_ID',
            });
        });
    }

    signIn() {
        if (this.auth2) {
            this.auth2.signIn().then((googleUser) => {
                const idToken = googleUser.getAuthResponse().id_token;
                // Use idToken for authentication or send it to server for verification
            });
        }
    }
}
