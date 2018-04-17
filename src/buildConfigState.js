import path from "path";
import snapshotStateHandler from "./snapshotStateHandler";
import buildGetNameForSnapshotUsingTemplate from "./buildGetNameForSnapshotUsingTemplate";

module.exports = function buildConfigState(determineConfig) {
  const config = {
    snapshotFilename: undefined,
    snapshotNameTemplate: undefined,
  };

  function setFilename(snapshotFilename) {
    config.snapshotFilename = snapshotFilename
  }

  function setTestName(snapshotNameTemplate) {
    config.snapshotNameTemplate = snapshotNameTemplate
  }

  function configureUsingMochaContext({ currentTest }) {
    const snapshotFilename = currentTest.file + ".snap";

    setFilename(snapshotFilename);
    setTestName(currentTest.fullTitle());

    snapshotStateHandler.create(path.resolve(snapshotFilename));
  }

  const snapshotNameRegistry = {}; // snapshotNameRegistry[filename][name] => number
  const getNameForSnapshotUsingTemplate = buildGetNameForSnapshotUsingTemplate(snapshotNameRegistry);

  function parseArgs(args) {
    return determineConfig(args, config, getNameForSnapshotUsingTemplate);
  }

  function resetSnapshotRegistry() {
    for (let filename in snapshotNameRegistry) {
      delete snapshotNameRegistry[filename];
    }
  }

  return {
    setFilename,
    setTestName,
    configureUsingMochaContext,
    parseArgs,
    resetSnapshotRegistry,
  };
}