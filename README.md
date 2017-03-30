# chai-jest-snapshot

Chai assertion for [jest-snapshot](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html).

## Installation
On the command line:
```
$ npm install --save-dev chai-jest-snapshot
```

In your test setup file:
```js
import chai from "chai";
import chaiJestSnapshot from "chai-jest-snapshot";

chai.use(chaiJestSnapshot);

// if you want to use simple interface
chaiJestSnapshot.registerSnapshotFileName(__filename + ".snap");
// \

```

## Usage
```js
import path from "path";
import React from "react";
import renderer from "react-test-renderer";
import { expect } from "chai";
import Link from "./Link";

describe("Link", function() {
  // if you want to use simple interface
  beforeEach(function(){
    // `this.currentTest.fullTitle()` assumes you are using mocha test runner
    chaiJestSnapshot.registerSnapshotNameTemplate(this.currentTest.fullTitle());
  });
  // \
  it("renders correctly", () => {
    const tree = renderer.create(
      <Link page="http://www.facebook.com">Facebook</Link>
    ).toJSON();
    let snapshotFileName = path.join(__dirname, "Link.spec.js.snap");
    let snapshotName = "Link renders correctly";
    expect(tree).to.matchSnapshot(snapshotFileName, snapshotName);
    // or, if you already set up #registerSnapshotFileName and #registerSnapshotNameTemplate
    expect(tree).to.matchSnapshot();
  });
});
```

To update snapshot (similar to `jest -u`):

```js
expect(tree).to.matchSnapshot(snapshotFileName, snapshotName, true);
```

Unlike `jest -u`, it doesn't update all snapshots, only the one you added `true` to.
If you want to update all snapshots without adding `true` to each one, set the environment variable `CHAI_JEST_SNAPSHOT_UPDATE_ALL` to "true":

```shell
# assuming `npm test` runs your tests (which it should):
# sh/bash/zsh
$ CHAI_JEST_SNAPSHOT_UPDATE_ALL=true npm test
# fish
$ env CHAI_JEST_SNAPSHOT_UPDATE_ALL=true npm test
```

See [Jest 14.0: React Snapshot Testing](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html) for more info.

## Tips
* If you write your tests in ES2015, you will probably want to use [babel-plugin-transform-dirname-filename](https://github.com/TooTallNate/babel-plugin-transform-dirname-filename) to ensure your snapshots end up in your source directory instead of the directory where your tests were built (ie `dist` or `build`).

## Contributing
```
$ npm install
$ npm test
```
Pull Requests and Issues welcome
