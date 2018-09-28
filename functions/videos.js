const path = require('path');
const nconf = require('nconf');

nconf.argv().env().file(path.join(__dirname, 'config.json'));

var admin = require("firebase-admin");
var serviceAccount = require("./service_account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: nconf.get('databaseURL')
});

function _updateVideo(ref, url, thumbnail, audio) {
  return ref.get()
    .then(snapshot => {
      const candidate = snapshot.exists ? snapshot.data() : null;
      if (!candidate) {
        return Promise.resolve();
      }
      candidate.video = {
        url: url, thumbnail: thumbnail, audio: audio
      };
      return ref.set(candidate);
    });
}
const ocd = process.argv[2];
const electionDay = process.argv[3];
const contestId = process.argv[4];
const candidateId = process.argv[5];
const url = process.argv[6];
const thumbnail = process.argv[7];
const audio = process.argv[8];

const ref = admin.firestore()
  .collection('divisions').doc(ocd)
  .collection('langs').doc('en')
  .collection('elections').doc(electionDay)
  .collection('contests').doc(contestId)
  .collection('candidates').doc(candidateId);

_updateVideo(ref, url, thumbnail, audio);
