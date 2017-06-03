import buildGetNameForSnapshotUsingTemplate from "./buildGetNameForSnapshotUsingTemplate";

module.exports = function buildConfigState(determineConfig) {
  const config = {
    snapshotFilename: undefined,
    snapshotNameTemplate: undefined,
    snapshotNameRegistry: {}, // snapshotNameRegistry[name] => number
  };

  function setFilename(snapshotFilename) {
    config.snapshotFilename = snapshotFilename
  }

  function setTestName(snapshotNameTemplate) {
    config.snapshotNameTemplate = snapshotNameTemplate
    config.snapshotNameRegistry[snapshotNameTemplate] = 0;
  }

  function configureUsingMochaContext(mochaContext) {
    const { currentTest } = mochaContext;
    setFilename(currentTest.file + ".snap");
    setTestName(currentTest.fullTitle());
  }

  const getNameForSnapshotUsingTemplate = buildGetNameForSnapshotUsingTemplate(config.snapshotNameRegistry);

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