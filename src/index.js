import buildMatchSnapshot from "./buildMatchSnapshot";
import buildConfigState from "./buildConfigState";
import determineConfig from "./determineConfig";

let hasChaiJestSnapshotBeenUsed = false;
let configuredSetFilename;
let configuredSetTestName;
let configuredConfigureUsingMochaContext;

function chaiJestSnapshot(chai, utils) {
  if (hasChaiJestSnapshotBeenUsed) {
    throw new Error("Running `chai.use(chaiJestSnapshot)` more than once is not supported.");
  }

  const {
    setFilename,
    setTestName,
    configureUsingMochaContext,
    parseArgs,
  } = buildConfigState(determineConfig);

  const matchSnapshot = buildMatchSnapshot(utils, parseArgs);
  chai.Assertion.addMethod("matchSnapshot", matchSnapshot);

  configuredSetFilename = setFilename;
  configuredSetTestName = setTestName;
  configuredConfigureUsingMochaContext = configureUsingMochaContext;

  hasChaiJestSnapshotBeenUsed = true;
};

chaiJestSnapshot.setFilename = function setFilename() {
  if (configuredSetFilename) {
    configuredSetFilename.apply(this, arguments);
  } else {
    throw new Error("Please run `chai.use(chaiJestSnapshot)` before using `chaiJestSnapshot.setFilename`.");
  }
}

chaiJestSnapshot.setTestName = function setTestName() {
  if (configuredSetTestName) {
    configuredSetTestName.apply(this, arguments);
  } else {
    throw new Error("Please run `chai.use(chaiJestSnapshot)` before using `chaiJestSnapshot.setTestName`.");
  }
}

chaiJestSnapshot.configureUsingMochaContext = function configureUsingMochaContext() {
  if (configuredConfigureUsingMochaContext) {
    configuredConfigureUsingMochaContext.apply(this, arguments);
  } else {
    throw new Error("Please run `chai.use(chaiJestSnapshot)` before using `chaiJestSnapshot.configureUsingMochaContext`.");
  }
}

module.exports = chaiJestSnapshot;
