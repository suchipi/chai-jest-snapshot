import path from "path";
import jsonPath from "jsonpath";
import values from "lodash.values";
import cloneDeep from "lodash.clonedeep";
import clone from "lodash.clone";
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

    // Treat property matchers as jsonpath queries
    // if they start with a $ and contain a dot.
    const isJsonPath = it => it[0] === '$' && it.indexOf(".") > -1;

    // If we have property matchers, we have to reassign the value (pattern)
    // from the matcher into the data being snapshotted, so that that data
    // _with the matcher applied_ gets compared to the existing snapshot.
    // We don't want to mutate the user's data, though, so we have to clone.
    // And, if some of our matchers are jsonpath matchers, though, we have to
    // do a deep clone, because the jsonpath could match a deep property.
    const toMatch = (() => {
      // No matchers == no cloning required
      if(typeof propertyMatchers !== 'object') {
        return obj;
      }

      const hasJsonPathMatchers = Object.keys(propertyMatchers).some(isJsonPath);
      return hasJsonPathMatchers ? cloneDeep(obj) : clone(obj);
    })();

    if(typeof propertyMatchers === 'object') {
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

    // If some custom serializers apply to our original data to snapshot,
    // the cloning that we do to apply property matchers could break the
    // custom serializer (e.g., by removing unenumerable properties from the
    // data that the custom serializer is relying on). If we're in such a case,
    // we log a warning.
    //
    // Note: we only test the top-level data for cusotm serializers
    // (jest might look for them recursively).
    const logCustomSerializerWarning = obj !== toMatch // we cloned
      && getSerializers().some(it => it.test(obj)); // has custom serializers

    if(logCustomSerializerWarning) {
      console.warn(
        "Using property matchers may change how your object is serialized for snapshotting."
      );
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
