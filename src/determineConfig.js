module.exports = function determineConfig(args, config, getNameForSnapshotUsingTemplate) {
  let snapshotFileName;
  let snapshotName;
  let update;

  if (config.snapshotFileName && !config.snapshotNameTemplate) {
    throw new Error("You called `registerSnapshotFileName` without calling `registerSnapshotNameTemplate`. This is not supported.");
  }

  if (!config.snapshotFileName && config.snapshotNameTemplate) {
    throw new Error("You called `registerSnapshotNameTemplate` without calling `registerSnapshotFileName`. This is not supported.");
  }

  // Possible call signatures:
  // If snapshotFileName and snapshotNameTemplate are both unset:
  //   matchSnapshot(string, string, boolean);
  //   matchSnapshot(string, string); // acts like matchSnapshot(string, string, false);
  // If snapshotFileName and snapshotNameTemplate are both set:
  //   matchSnapshot(true); // uses filename and name from config;
  //   matchSnapshot(); // uses filename and name from config

  if (config.snapshotFileName && config.snapshotNameTemplate) {
    snapshotFileName = config.snapshotFileName;
    snapshotName = getNameForSnapshotUsingTemplate(snapshotFileName, config.snapshotNameTemplate);
    update = args[0] || false;
  } else {
    if (args.length < 2) {
      throw new Error("`matchSnapshot` cannot be called without a filename and snapshot name unless `registerSnapshotFileName` and `registerSnapshotNameTemplate` have been called");
    }
    snapshotFileName = args[0];
    snapshotName = args[1];
    update = args[2] || false;
  }

  if (typeof process !== "undefined" && process.env && process.env.CHAI_JEST_SNAPSHOT_UPDATE_ALL) {
    update = true;
  }

  return {
    snapshotFileName,
    snapshotName,
    update,
  };
}
