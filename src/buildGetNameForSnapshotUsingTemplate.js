module.exports = function buildGetNameForSnapshotUsingTemplate(snapshotNameRegistry) {
  return function getNameForSnapshotUsingTemplate(snapshotFilename, snapshotNameTemplate) {
    if (snapshotNameRegistry[snapshotFilename] == null) {
      snapshotNameRegistry[snapshotFilename] = {};
    }
    const nextCounter = (snapshotNameRegistry[snapshotFilename][snapshotNameTemplate] || 0) + 1;
    snapshotNameRegistry[snapshotFilename][snapshotNameTemplate] = nextCounter;

    return `${snapshotNameTemplate} ${nextCounter}`;
  }
}