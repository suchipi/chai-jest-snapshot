import buildGetNameForSnapshotUsingTemplate from "./buildGetNameForSnapshotUsingTemplate";

module.exports = function buildConfigState(determineConfig) {
  const config = {
    snapshotFilename: undefined,
    snapshotNameTemplate: undefined,
  };

  function registerSnapshotFilename(snapshotFilename) {
    config.snapshotFilename = snapshotFilename
  }

  function registerSnapshotNameTemplate(snapshotNameTemplate) {
    config.snapshotNameTemplate = snapshotNameTemplate
  }

  function registerMochaContext(mochaContext) {
    const { currentTest } = mochaContext;
    registerSnapshotFilename(currentTest.file + ".snap");
    registerSnapshotNameTemplate(currentTest.fullTitle());
  }

  const snapshotNameRegistry = {}; // snapshotNameRegistry[filename][name] => number
  const getNameForSnapshotUsingTemplate = buildGetNameForSnapshotUsingTemplate(snapshotNameRegistry);

  function parseArgs(args) {
    return determineConfig(args, config, getNameForSnapshotUsingTemplate);
  }

  return {
    registerSnapshotFilename,
    registerSnapshotNameTemplate,
    registerMochaContext,
    parseArgs,
  };
}