import buildMatchSnapshot from "./buildMatchSnapshot";
import buildConfigState from "./buildConfigState";
import determineConfig from "./determineConfig";

function chaiJestSnapshot(chai, utils) {
  const {
    setFilename,
    setTestName,
    setFilenameAndTestNameUsingMochaContext,
    parseArgs,
  } = buildConfigState(determineConfig);

  const matchSnapshot = buildMatchSnapshot(utils, parseArgs);
  chai.Assertion.addMethod("matchSnapshot", matchSnapshot);

  // Kinda weird; mutates the exports to have the configuration functions on it
  // once you've calles this once (by passing it into chai.use). Until you have,
  // the template methods defined below are called instead.
  chaiJestSnapshot.setFilename = setFilename;
  chaiJestSnapshot.setTestName = setTestName;
  chaiJestSnapshot.setFilenameAndTestNameUsingMochaContext = setFilenameAndTestNameUsingMochaContext;
};

chaiJestSnapshot.setFilename = function() {
  throw new Error("Please call `chai.use(chaiJestSnapshot)` before calling `setFilename`");
}

chaiJestSnapshot.setTestName = function() {
  throw new Error("Please call `chai.use(chaiJestSnapshot)` before calling `setTestName`");
}

chaiJestSnapshot.setFilenameAndTestNameUsingMochaContext = function() {
  throw new Error("Please call `chai.use(chaiJestSnapshot)` before calling `setFilenameAndTestNameUsingMochaContext`");
}

module.exports = chaiJestSnapshot;
