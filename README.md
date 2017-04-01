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

// if you want to use simple interface, but want to take control of snapshot filename
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
    // \

    /**
     * or you can use #registerMochaContext, which is a short hand for both
     * `chaiJestSnapshot.registerSnapshotNameTemplate(this.currentTest.fullTitle());`
     * and
     * `chaiJestSnapshot.registerSnapshotFileName(this.currentTest.file + ".snap")`;
     * be careful that if you transpile your spec file (with webpack/gulp/babel, etc.),
     * `__filename` and `this.currentTest.file` will not be the same
     * `__filename` refers to your source file (if your transpiler is smart enough, I - @truongsinh - tested with webpack)
     * while `this.currentTest.file` refers your built/dist file.
     *
     * `#registerMochaContext` can overide the other 2 methods, and vice versa, `last-write-wins`
     */
    chaiJestSnapshot.registerMochaContext(this);
    // \
});
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
