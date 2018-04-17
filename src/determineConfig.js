module.exports = function determineConfig(args, config, getNameForSnapshotUsingTemplate) {
  let snapshotFilename;
  let snapshotName;

  if (config.snapshotFilename && !config.snapshotNameTemplate) {
    throw new Error("Using `setFilename` without also using `setTestName` is not supported.");
  }

  if (!config.snapshotFilename && config.snapshotNameTemplate) {
    throw new Error("Using `setTestName` without also using `setFilename` is not supported.");
  }

  // Possible call signatures:
  // If snapshotFilename and snapshotNameTemplate are both unset:
  //   matchSnapshot(string, string);
  // If snapshotFilename and snapshotNameTemplate are both set:
  //   matchSnapshot(); // uses filename and name from config

  if (config.snapshotFilename && config.snapshotNameTemplate) {
    snapshotFilename = config.snapshotFilename;
    snapshotName = getNameForSnapshotUsingTemplate(snapshotFilename, config.snapshotNameTemplate);
  } else {
    if (args.length < 2) {
      throw new Error("`matchSnapshot` cannot be called without a filename and snapshot name unless `setFilename` and `setTestName` have been called previously.");
    }
    snapshotFilename = args[0];
    snapshotName = args[1];
  }

  return {
    snapshotFilename,
    snapshotName
  };
}
