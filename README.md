1. Go to your project on [Filebase Console](https://console.firebase.google.com).
2. On the side bar on the left, click on the :gear: icon next to Project Overview.
3. Select Users and permissions
4. Click on the Service accounts tab.
5. Under Firebase Admin SDK, choose Node.js. Generate new private key. Download it.
6. Move it to `functions`. Rename to `service_account.json`.
7. In `functions`, run `npm install`
8. `./run.sh`

For more info, see [DESIGN.md](https://github.com/GetBallot/mobile/blob/master/DESIGN.md) in the [mobile](https://github.com/GetBallot/mobile) repo
