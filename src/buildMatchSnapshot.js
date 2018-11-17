import path from "path";
import jsonPath from "jsonpath";
import values from "lodash.values";
import set from "lodash.set";
import { SnapshotState, getSerializers } from "jest-snapshot";

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
    // support passing a property matcher object as first argument.
    // This is backwards compatible, as all the prior args were strings or bools.
    const propertyMatchers = (typeof args[0] === 'object') ? args.shift() : undefined;
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

    // In certain cases, we can't apply jsonpath property matchers against our
    // snapshotted data, either because the data isn't an object (e.g., running
    // a jsonpath against a string makes no sense) or because the data being
    // snapshotted has a custom serializers, and cloning it with Object.assign
    // (which we need to do to use jsonpath queries), might break the custom
    // serializer (e.g., by removing unenumerable properties from the napshotted
    // data that the custom serializer is relying on). Test if we're in such a case.
    const skipJsonPathMatchers =
      typeof obj !== "object" || obj == null
        || getSerializers().some(it => it.test(obj)); // has custom serializers

    const toMatch = skipJsonPathMatchers ? obj : Object.assign({}, obj);

    // Treat property matchers as jsonpath queries
    // if they start with a $ and contain a dot.
    if(skipJsonPathMatchers && typeof propertyMatchers === 'object') {
      const isJsonPath = it => it[0] === '$' && it.indexOf(".") > -1;

      Object.keys(propertyMatchers).forEach(k => {
        if(isJsonPath(k)) {
          jsonPath.paths(obj, k).forEach(path => {
            const lodashPath = path.slice(1);
            set(toMatch, lodashPath, propertyMatchers[k]);
          });
        } else {
          toMatch[k] = propertyMatchers[k];
        }
      });
    }

    const match = snapshotState.match({
      testName: snapshotName,
      received: toMatch,
      key: snapshotName
    });

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
