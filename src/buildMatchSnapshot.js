import path from "path";
import SnapshotFile from "./SnapshotFile";
import values from "lodash.values";

const buildMatchSnapshot = (utils) => {
  const snapshotFiles = {};
  const snapshotNameCounter = {};
  const internalConfig = {
    snapshotFileName: undefined,
    snapshotNameTemplate: undefined,
  };

  function matchSnapshot(snapshotFileName, snapshotName, update) {
    snapshotFileName = snapshotFileName || internalConfig.snapshotFileName;
    if (!snapshotFileName) {
      throw new Error("Snapshot file name must be defined by #registerSnapshotFileName or as a param to #matchJson.");
    }
    if (!snapshotName) {
      const snapshotNameTemplate = internalConfig.snapshotNameTemplate;
      if (!snapshotNameTemplate) {
        throw new Error("Snapshot name must be available as a param to #matchJson, or be defined with auto-increase counter by #registerSnapshotNameTemplate.");
      }
      const nextCounter = (snapshotNameCounter[snapshotNameTemplate] || 0 ) + 1;
      snapshotNameCounter[snapshotNameTemplate] = nextCounter;
      snapshotName = `${snapshotNameTemplate} ${nextCounter}`;
    }

    if (utils.flag(this, 'negate')) {
      throw new Error("`matchSnapshot` cannot be used with `.not`.");
    }

    const obj = this._obj;
    const absolutePathToSnapshot = path.resolve(snapshotFileName);
    let snapshotFile;
    if (snapshotFiles[absolutePathToSnapshot]) {
      snapshotFile = snapshotFiles[absolutePathToSnapshot];
    } else {
      snapshotFiles[absolutePathToSnapshot] = new SnapshotFile(absolutePathToSnapshot);
      snapshotFile = snapshotFiles[absolutePathToSnapshot];
    }

    if (this._publishInternalVariableForTesting) {
      this._publishInternalVariableForTesting("snapshotFile", snapshotFile);
    }

    let matches;
    let pass;

    if (snapshotFile.fileExists() && snapshotFile.has(snapshotName)) {
      matches = snapshotFile.matches(snapshotName, obj);
      pass = matches.pass;
    } else {
      snapshotFile.add(snapshotName, obj);
      snapshotFile.save();
      pass = true;
    }

    const shouldUpdate = update || (typeof process !== "undefined" && process.env && process.env.CHAI_JEST_SNAPSHOT_UPDATE_ALL);

    if (!pass && shouldUpdate) {
      snapshotFile.add(snapshotName, obj);
      snapshotFile.save();
      pass = true;
    }

    this.assert(
      pass,
      `expected value to match snapshot ${snapshotName}`,
      `expected value to not match snapshot ${snapshotName}`,
      matches && matches.expected && matches.expected.trim(),
      matches && matches.actual && matches.actual.trim(),
      matches && true
    );
  };

  function registerSnapshotFileName(snapshotFileName) {
    internalConfig.snapshotFileName = snapshotFileName
  };

  function registerSnapshotNameTemplate(snapshotNameTemplate) {
    internalConfig.snapshotNameTemplate = snapshotNameTemplate
  };

  function registerMochaContext(mochaContext) {
    const { currentTest } = mochaContext;
    registerSnapshotFileName(currentTest.file + ".snap");
    registerSnapshotNameTemplate(currentTest.fullTitle());
  };

  return {
    matchSnapshot,
    registerSnapshotFileName,
    registerSnapshotNameTemplate,
    registerMochaContext,
  };
};

export default buildMatchSnapshot;
