import path from "path";
import values from "lodash.values";
import snapshotStateHandler from "./snapshotStateHandler";

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
    if (utils.flag(this, 'negate')) {
      throw new Error("`matchSnapshot` cannot be used with `.not`.");
    }
    const { snapshotFilename, snapshotName } = parseArgs(args);

    const snapshotState = snapshotStateHandler.get(path.resolve(snapshotFilename));

    const match = snapshotState.match(snapshotName, this._obj, snapshotName);
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
  // Jest might rename its "jest-matchers" module to "expect", so let's
  // avoid an actual require and bank on the global expect here.
  // (see https://github.com/facebook/jest/issues/1679#issuecomment-282478002)
  return (typeof expect === 'undefined') ? null : expect;
};

const JEST_MARKERS = ["enableAutomock", "genMockFromModule", "clearAllMocks", "runAllTicks"];

const thisRunsInJest = () => (
  typeof jest === "object" &&
  JEST_MARKERS.every((marker) => typeof jest[marker] === "function")
);

export default buildMatchSnapshot;
