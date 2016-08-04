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
```

## Usage
```js
import path from "path";
import React from "react";
import renderer from "react-test-renderer";
import { expect } from "chai";
import Link from "./Link";

describe("Link", function() {
  it("renders correctly", () => {
    const tree = renderer.create(
      <Link page="http://www.facebook.com">Facebook</Link>
    ).toJSON();
    let snapshotFileName = path.join(__dirname, "Link.spec.js.snap");
    let snapshotName = "Link renders correctly";
    expect(tree).to.matchSnapshot(snapshotFileName, snapshotName);
  });
});
```

To update snapshot (similar to `jest -u`):
```js
expect(tree).to.matchSnapshot(snapshotFileName, snapshotName, true);
```
Unlike `jest -u`, it doesn't update all snapshots, only the one you added `true` to.

See [Jest 14.0: React Snapshot Testing](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html) for more info.

## Tips
* If you write your tests in ES2015, you will probably want to use [babel-plugin-transform-dirname-filename](https://github.com/TooTallNate/babel-plugin-transform-dirname-filename) to ensure your snapshots end up in your source directory instead of the directory where your tests were built (ie `dist` or `build`).

## Future Work Ideas
* Babel plugin for mocha that transforms:
  ```js
  expect(tree).to.matchSnapshot();
  expect(tree).to.matchSnapshot(true);
  ```
  into
  ```js
  expect(tree).to.matchSnapshot(__filename + ".snap", this.test.fullTitle());
  expect(tree).to.matchSnapshot(__filename + ".snap", this.test.fullTitle(), true);
  ```
* Additional babel plugins for other test frameworks

## Contributing
```
$ npm install
$ npm test
```
Pull Requests and Issues welcome
