const path = require('path');
const nconf = require('nconf');

nconf.argv().env().file(path.join(__dirname, 'config.json'));

let admin = require("firebase-admin");
let serviceAccount = require("./service_account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: nconf.get('databaseURL')
});

let duplicate = false;
const fromVoterInfo = {};
const fromRepresentatives = {};

function _storeFavIds(contests, map) {
  contests.forEach(contest => {
    if (contest.candidates && !contest.referendumTitle) {
      contest.candidates.forEach(candidate => {
        if (candidate.name in map) {
          console.error(`${candidate.name} maps to:\n  ${candidate.favId}\n  ${map[candidate.name]}`);
          duplicate = true;
        } else {
          map[candidate.name] = candidate.favId;
        }
      });
    }
 });
}
function _mapFavIds(voterInfoRef, representativesRef) {
  const promises = [voterInfoRef.get(), representativesRef.get()];
  return Promise.all(promises)
    .then(results => {
      const electionFromVoterInfo = results[0].exists ? results[0].data() : null;
      if (!electionFromVoterInfo || !electionFromVoterInfo.contests) {
        return Promise.resolve();
      }
      _storeFavIds(electionFromVoterInfo.contests, fromVoterInfo);

      const electionFromRepresentatives = results[1].exists ? results[1].data() : null;
      if (!electionFromRepresentatives || !electionFromRepresentatives.contests) {
        return Promise.resolve();
      }
      _storeFavIds(electionFromRepresentatives.contests, fromRepresentatives);

      if (duplicate) {
        return Promise.resolve();
      }

      const favIdMap = {};

      Object.keys(fromVoterInfo).forEach(name => {
        if (name in fromRepresentatives &&
            fromVoterInfo[name] != fromRepresentatives[name]) {
          favIdMap[fromVoterInfo[name]] = fromRepresentatives[name];
          console.log(`${fromVoterInfo[name]}\t${fromRepresentatives[name]}`);
        }
      })

      return admin.firestore()
        .collection('elections').doc(electionFromVoterInfo.election.id)
        .set({favIdMap: favIdMap});
    });
}

const userId = process.argv[2];

const voterInfoRef = admin.firestore()
  .collection('users').doc(userId)
  .collection('elections').doc('fromVoterInfo');

const representativesRef = admin.firestore()
  .collection('users').doc(userId)
  .collection('elections').doc('fromRepresentatives');

_mapFavIds(voterInfoRef, representativesRef);
