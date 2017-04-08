import buildMatchSnapshot from "./buildMatchSnapshot";

var internalConfig = {
  snapshotFileName: undefined,
  snapshotNameTemplate: undefined,
};

const chaiJestSnapshot = function(chai, utils) {
  chai.Assertion.addMethod("matchSnapshot", buildMatchSnapshot(utils, internalConfig));
};

chaiJestSnapshot.registerSnapshotFileName = buildMatchSnapshot.registerSnapshotFileName;
chaiJestSnapshot.registerSnapshotNameTemplate = buildMatchSnapshot.registerSnapshotNameTemplate;
chaiJestSnapshot.registerMochaContext = buildMatchSnapshot.registerMochaContext;

module.exports = chaiJestSnapshot;
