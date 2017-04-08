import buildMatchSnapshot from "./buildMatchSnapshot";
import buildConfigState from "./buildConfigState";
import determineConfig from "./determineConfig";

let hasChaiJestSnapshotBeenUsed = false;
let configuredSetFilename;
let configuredSetTestName;
let configuredSetFilenameAndTestNameUsingMochaContext;

function chaiJestSnapshot(chai, utils) {
  if (hasChaiJestSnapshotBeenUsed) {
    throw new Error("Running `chai.use(chaiJestSnapshot)` more than once is not supported.");
  }

  const {
    setFilename,
    setTestName,
    setFilenameAndTestNameUsingMochaContext,
    parseArgs,
  } = buildConfigState(determineConfig);

  const matchSnapshot = buildMatchSnapshot(utils, parseArgs);
  chai.Assertion.addMethod("matchSnapshot", matchSnapshot);

  configuredSetFilename = setFilename;
  configuredSetTestName = setTestName;
  configuredSetFilenameAndTestNameUsingMochaContext;

  hasChaiJestSnapshotBeenUsed = true;
};

chaiJestSnapshot.setFilename = function setFilename() {
  if (configuredSetFilename) {
    configuredSetFilename.call(this, arguments);
  } else {
    throw new Error("Please run `chai.use(chaiJestSnapshot)` before using `chaiJestSnapshot.setFilename`.");
  }
}

chaiJestSnapshot.setTestName = function setTestName() {
  if (configuredSetTestName) {
    configuredSetTestName.call(this, arguments);
  } else {
    throw new Error("Please run `chai.use(chaiJestSnapshot)` before using `chaiJestSnapshot.setTestName`.");
  }
}

chaiJestSnapshot.setFilenameAndTestNameUsingMochaContext = function setFilenameAndTestNameUsingMochaContext() {
  if (configuredSetFilenameAndTestNameUsingMochaContext) {
    configuredSetFilenameAndTestNameUsingMochaContext.call(this, arguments);
  } else {
    throw new Error("Please run `chai.use(chaiJestSnapshot)` before using `chaiJestSnapshot.setFilenameAndTestNameUsingMochaContext`.");
  }
}

module.exports = chaiJestSnapshot;
