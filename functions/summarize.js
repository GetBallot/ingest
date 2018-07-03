const path = require('path');
const nconf = require('nconf');

nconf.argv().env().file(path.join(__dirname, 'config.json'));

var admin = require("firebase-admin");
var serviceAccount = require("./service_account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: nconf.get('databaseURL')
});

function _summarizeArray(collectionRef, parts, itemsKey) {
  return collectionRef.get()
    .then(querySnapshot => {
      const items = [];
      querySnapshot.forEach(itemSnap => {
        const item = itemSnap.data();
        item.id = itemSnap.ref.id;

        parts.push(item.id);
        item.canonicalId = _sanitize(parts.join('|'));

        items.push(item);
      });
      const data = {};
      data[itemsKey] = items.sort((a, b) => a.orderOnBallot - b.orderOnBallot);
      console.log('Summarizing ' + collectionRef.parent.path);
      return collectionRef.parent.set(data, {merge: true});
    });
}

function _sanitize(id) {
  return id.split('/').join(',')
}

const ocd = process.argv[2];
const electionDay = process.argv[3];

if (process.argv.length == 4) {
  const ref = admin.firestore()
    .collection('divisions').doc(ocd)
    .collection('langs').doc('en')
    .collection('elections').doc(electionDay)
    .collection('contests');
  _summarizeArray(ref, [electionDay, ocd], 'contests');
}

if (process.argv.length == 5) {
  const contestId = process.argv[4];
  const ref = admin.firestore()
    .collection('divisions').doc(ocd)
    .collection('langs').doc('en')
    .collection('elections').doc(electionDay)
    .collection('contests').doc(contestId)
    .collection('candidates');
  _summarizeArray(ref, [electionDay, ocd, contestId], 'candidates');
}
