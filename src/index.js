import buildMatchSnapshot from "./buildMatchSnapshot";

var internalConfig = {
  snapshotFileName: void 0,
  snapshotNameTemplate: void 0,
}

const chaiJestSnapshot = function(chai, utils) {
  chai.Assertion.addMethod("matchSnapshot", buildMatchSnapshot(utils, internalConfig));
};

chaiJestSnapshot.registerSnapshotFileName = buildMatchSnapshot.registerSnapshotFileName;
chaiJestSnapshot.registerSnapshotNameTemplate = buildMatchSnapshot.registerSnapshotNameTemplate;
chaiJestSnapshot.registerMochaContext = buildMatchSnapshot.registerMochaContext;

module.exports = chaiJestSnapshot;
