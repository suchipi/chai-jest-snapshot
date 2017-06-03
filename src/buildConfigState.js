import buildGetNameForSnapshotUsingTemplate from "./buildGetNameForSnapshotUsingTemplate";

module.exports = function buildConfigState(determineConfig) {
  const config = {
    snapshotFilename: undefined,
    snapshotNameTemplate: undefined,
    isNewRun: undefined,
  };

  function setFilename(snapshotFilename) {
    config.snapshotFilename = snapshotFilename
  }

  function setTestName(snapshotNameTemplate) {
    config.snapshotNameTemplate = snapshotNameTemplate
    _setIsNewRun();
  }

  /**
   * isNewRun relates to whether the test suite is a new run or not. This is needed to track when
   * a test runner runs in watch mode - we don't want to incremenet snapshots for every test run,
   *  only incremenet within a run and reset for in the next run.
   *  This function should only be called once per "it" test.
   */
  function _setIsNewRun() {
    config.isNewRun = config.isNewRun || {};
    config.isNewRun[config.snapshotFilename] = config.isNewRun[config.snapshotFilename] || {};
    config.isNewRun[config.snapshotFilename][config.snapshotNameTemplate] = true;
  }

  function configureUsingMochaContext(mochaContext) {
    const { currentTest } = mochaContext;
    setFilename(currentTest.file + ".snap");
    setTestName(currentTest.fullTitle());
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
