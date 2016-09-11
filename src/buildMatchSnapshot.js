import path from "path";
import SnapshotFile from "./SnapshotFile";
import values from "lodash.values";

const buildMatchSnapshot = (utils) => {
  const snapshotFiles = {};

  return function matchSnapshot(snapshotFileName, snapshotName, update) {
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

    if (!pass && update) {
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
    )
  };
};

export default buildMatchSnapshot;
