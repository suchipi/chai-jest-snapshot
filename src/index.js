import buildMatchSnapshot from "./buildMatchSnapshot";
import buildConfigState from "./buildConfigState";
import determineConfig from "./determineConfig";

function chaiJestSnapshot(chai, utils) {
  const {
    registerSnapshotFileName,
    registerSnapshotNameTemplate,
    registerMochaContext,
    parseArgs,
  } = buildConfigState(determineConfig);

  const matchSnapshot = buildMatchSnapshot(utils, parseArgs);
  chai.Assertion.addMethod("matchSnapshot", matchSnapshot);

  // Kinda weird; mutates the exports to have the configuration functions on it
  // once you've calles this once (by passing it into chai.use). Until you have,
  // the template methods defined below are called instead.
  chaiJestSnapshot.registerSnapshotFileName = registerSnapshotFileName;
  chaiJestSnapshot.registerSnapshotNameTemplate = registerSnapshotNameTemplate;
  chaiJestSnapshot.registerMochaContext = registerMochaContext;
};

chaiJestSnapshot.registerSnapshotFileName = function() {
  throw new Error("Please call `chai.use(chaiJestSnapshot)` before calling `registerSnapshotFileName`");
}

chaiJestSnapshot.registerSnapshotNameTemplate = function() {
  throw new Error("Please call `chai.use(chaiJestSnapshot)` before calling `registerSnapshotNameTemplate`");
}

chaiJestSnapshot.registerMochaContext = function() {
  throw new Error("Please call `chai.use(chaiJestSnapshot)` before calling `registerMochaContext`");
}

module.exports = chaiJestSnapshot;
