import buildGetNameForSnapshotUsingTemplate from "./buildGetNameForSnapshotUsingTemplate";

module.exports = function buildConfigState(determineConfig) {
  const config = {
    snapshotFileName: undefined,
    snapshotNameTemplate: undefined,
  };

  function registerSnapshotFileName(snapshotFileName) {
    config.snapshotFileName = snapshotFileName
  }

  function registerSnapshotNameTemplate(snapshotNameTemplate) {
    config.snapshotNameTemplate = snapshotNameTemplate
  }

  function registerMochaContext(mochaContext) {
    const { currentTest } = mochaContext;
    registerSnapshotFileName(currentTest.file + ".snap");
    registerSnapshotNameTemplate(currentTest.fullTitle());
  }

  const snapshotNameRegistry = {}; // snapshotNameRegistry[filename][name] => number
  const getNameForSnapshotUsingTemplate = buildGetNameForSnapshotUsingTemplate(snapshotNameRegistry);

  function parseArgs(args) {
    return determineConfig(args, config, getNameForSnapshotUsingTemplate);
  }

  return {
    registerSnapshotFileName,
    registerSnapshotNameTemplate,
    registerMochaContext,
    parseArgs,
  };
}