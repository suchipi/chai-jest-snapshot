module.exports = function buildGetNameForSnapshotUsingTemplate(snapshotNameRegistry) {
  return function getNameForSnapshotUsingTemplate(snapshotFilename, snapshotNameTemplate, isNewRun = false, setIsNewRun) {
    if (snapshotNameRegistry[snapshotFilename] == null) {
      snapshotNameRegistry[snapshotFilename] = {};
    }

    if (isNewRun) {
      setIsNewRun(snapshotFilename, snapshotNameTemplate, false);
      snapshotNameRegistry[snapshotFilename][snapshotNameTemplate] = 0;
    }

    const nextCounter = (snapshotNameRegistry[snapshotFilename][snapshotNameTemplate] || 0) + 1;
    snapshotNameRegistry[snapshotFilename][snapshotNameTemplate] = nextCounter;

    return `${snapshotNameTemplate} ${nextCounter}`;
  }
}
