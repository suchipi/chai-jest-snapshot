import path from "path";
import values from "lodash.values";
import { SnapshotState } from "jest-snapshot";

const buildMatchSnapshot = (utils, parseArgs) => {
  if (thisRunsInJest()) {
    const jestExpect = safeRequireJestExpect();
    if (jestExpect) {
      return function matchSnapshot(...args) {
        return jestExpect(this._obj).toMatchSnapshot(...args);
      }
    }
  }

  return function matchSnapshot(...args) {
    const { snapshotFilename, snapshotName, update, ci } = parseArgs(args);

    if (utils.flag(this, 'negate')) {
      throw new Error("`matchSnapshot` cannot be used with `.not`.");
    }

    const obj = this._obj;
    const absolutePathToSnapshot = path.resolve(snapshotFilename);
    const snapshotState = new SnapshotState(undefined, {
      updateSnapshot: ci ? "none" : (update ? "all" : "new"),
      snapshotPath: absolutePathToSnapshot,
    });

    const match = snapshotState.match(snapshotName, obj, snapshotName);
    const actual = match.actual || "";
    const expected = match.expected || "";
    snapshotState.save();

    this.assert(
      match.pass,
      `expected value to match snapshot ${snapshotName}`,
      `expected value to not match snapshot ${snapshotName}`,
      expected.trim(),
      actual.trim(),
      true
    );
  };
};

const safeRequireJestExpect = () => {
  try {
    return require("jest-matchers");
  } catch (e) {
    return null;
  }
};

const JEST_MARKERS = ["enableAutomock", "genMockFromModule", "clearAllMocks", "runAllTicks"];

const thisRunsInJest = () => (
  typeof jest === "object" &&
  JEST_MARKERS.every((marker) => typeof jest[marker] === "function")
);

export default buildMatchSnapshot;
