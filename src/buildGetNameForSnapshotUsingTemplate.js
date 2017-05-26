module.exports = function buildGetNameForSnapshotUsingTemplate(snapshotNameRegistry) {
  return function getNameForSnapshotUsingTemplate(snapshotFilename, snapshotNameTemplate) {
    const nextCounter = snapshotNameRegistry[snapshotNameTemplate] + 1;
    snapshotNameRegistry[snapshotNameTemplate] = nextCounter;

    return `${snapshotNameTemplate} ${nextCounter}`;
  }
}