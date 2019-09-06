import { addSerializer } from "jest-snapshot";

import buildConfigState from "./buildConfigState";
import buildMatchSnapshot from "./buildMatchSnapshot";
import determineConfig from "./determineConfig";

let hasChaiJestSnapshotBeenUsed = false;
let configuredSetFilename;
let configuredSetTestName;
let configuredConfigureUsingMochaContext;
let configuredResetSnapshotRegistry;

function chaiJestSnapshot(chai, utils) {
  if (hasChaiJestSnapshotBeenUsed) {
    throw new Error("Running `chai.use(chaiJestSnapshot)` more than once is not supported.");
  }

  const {
    setFilename,
    setTestName,
    configureUsingMochaContext,
    parseArgs,
    resetSnapshotRegistry,
  } = buildConfigState(determineConfig);

  const matchSnapshot = buildMatchSnapshot(utils, parseArgs);
  chai.Assertion.addMethod("matchSnapshot", matchSnapshot);

  configuredSetFilename = setFilename;
  configuredSetTestName = setTestName;
  configuredConfigureUsingMochaContext = configureUsingMochaContext;
  configuredResetSnapshotRegistry = resetSnapshotRegistry;

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

chaiJestSnapshot.resetSnapshotRegistry = function resetSnapshotRegistry() {
  if (configuredResetSnapshotRegistry) {
    configuredResetSnapshotRegistry.apply(this, arguments);
  } else {
    throw new Error("Please run `chai.use(chaiJestSnapshot)` before using `chaiJestSnapshot.resetSnapshotRegistry`.");
  }
}

chaiJestSnapshot.addSerializer = addSerializer;

module.exports = chaiJestSnapshot;
