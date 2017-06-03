import path from "path";
import values from "lodash.values";
import { SnapshotState } from "jest-snapshot";

const buildMatchSnapshot = (utils, parseArgs) => {
  return function matchSnapshot(...args) {
    const { snapshotFilename, snapshotName, update } = parseArgs(args);

    if (utils.flag(this, 'negate')) {
      throw new Error("`matchSnapshot` cannot be used with `.not`.");
    }

    const obj = this._obj;
    const absolutePathToSnapshot = path.resolve(snapshotFilename);

    const snapshotState = new SnapshotState(undefined, {
      updateSnapshot: update ? "all" : "new",
      snapshotPath: absolutePathToSnapshot,
    });

    const {
      actual,
      expected,
      pass,
    } = snapshotState.match(snapshotName, obj, snapshotName);
    snapshotState.save();

    this.assert(
      pass,
      `expected value to match snapshot ${snapshotName}`,
      `expected value to not match snapshot ${snapshotName}`,
      expected.trim(),
      actual.trim(),
      true
    );
  };
};

export default buildMatchSnapshot;
