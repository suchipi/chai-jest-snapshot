import path from "path";
import SnapshotFile from "./SnapshotFile";
import values from "lodash.values";

export default function matchSnapshot(snapshotFiles, snapshotFileName, snapshotName, update) {
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
    )
  };