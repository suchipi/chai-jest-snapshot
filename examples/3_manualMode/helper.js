const chai = require("chai");
const chaiJestSnapshot = require("../../dist/");
chai.use(chaiJestSnapshot);

before(function() {
  // In order for watch mode to work correctly, the snapshot registry needs to
  // be reset at the beginning of each suite run. In mocha, `before` callbacks
  // are called before the whole suite runs, but in other test runners you may
  // need to run this somewhere else; for example, in jasmine, you'd put it in a
  // `beforeAll` instead of `before`.
  chaiJestSnapshot.resetSnapshotRegistry();
});
