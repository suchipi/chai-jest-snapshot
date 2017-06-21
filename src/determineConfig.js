module.exports = function determineConfig(args, config, getNameForSnapshotUsingTemplate) {
  let snapshotFilename;
  let snapshotName;
  let update;
  let ci = false;

  if (config.snapshotFilename && !config.snapshotNameTemplate) {
    throw new Error("Using `setFilename` without also using `setTestName` is not supported.");
  }

  if (!config.snapshotFilename && config.snapshotNameTemplate) {
    throw new Error("Using `setTestName` without also using `setFilename` is not supported.");
  }

  // Possible call signatures:
  // If snapshotFilename and snapshotNameTemplate are both unset:
  //   matchSnapshot(string, string, boolean);
  //   matchSnapshot(string, string); // acts like matchSnapshot(string, string, false);
  // If snapshotFilename and snapshotNameTemplate are both set:
  //   matchSnapshot(true); // uses filename and name from config;
  //   matchSnapshot(); // uses filename and name from config

  if (config.snapshotFilename && config.snapshotNameTemplate) {
    snapshotFilename = config.snapshotFilename;
    snapshotName = getNameForSnapshotUsingTemplate(snapshotFilename, config.snapshotNameTemplate);
    update = args[0] || false;
  } else {
    if (args.length < 2) {
      throw new Error("`matchSnapshot` cannot be called without a filename and snapshot name unless `setFilename` and `setTestName` have been called previously.");
    }
    snapshotFilename = args[0];
    snapshotName = args[1];
    update = args[2] || false;
  }

  if (typeof process !== "undefined" && process.env && process.env.CHAI_JEST_SNAPSHOT_UPDATE_ALL) {
    update = true;
  }

  if (typeof process !== "undefined" && process.env && process.env.CI) {
    ci = true;
  }

  return {
    snapshotFilename,
    snapshotName,
    update,
    ci
  };
}
