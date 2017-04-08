module.exports = function buildGetNameForSnapshotUsingTemplate(snapshotNameRegistry) {
  return function getNameForSnapshotUsingTemplate(snapshotFileName, snapshotNameTemplate) {
    if (snapshotNameRegistry[snapshotFileName] == null) {
      snapshotNameRegistry[snapshotFileName] = {};
    }
    const nextCounter = (snapshotNameRegistry[snapshotFileName][snapshotNameTemplate] || 0) + 1;
    snapshotNameRegistry[snapshotFileName][snapshotNameTemplate] = nextCounter;

    return `${snapshotNameTemplate} ${nextCounter}`;
  }
}