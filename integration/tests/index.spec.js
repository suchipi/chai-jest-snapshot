const path = require("path");
const { runMocha, readSnapshots, clearWorkspace } = require("../utils");

describe("chai-jest-snapshot", () => {
  beforeEach(async () => {
    await clearWorkspace("index");
  });

  afterEach(async () => {
    await clearWorkspace("index");
  });

  it("saves a snapshot", async () => {
    await runMocha(
      "index",
      `
      beforeEach(function() {
        chaiJestSnapshot.configureUsingMochaContext(this);
      });

      afterEach(function() {
        chaiJestSnapshot.resetSnapshotRegistry();
      });

      it("works as expected", () => {
        expect("foo").to.matchSnapshot();
      });
    `,
    );
    const snapshots = await readSnapshots("index");
    expect(snapshots["index works as expected 1"]).toBe('"foo"');
  });

  it("cleans up snapshots from across runs", async () => {
    await runMocha(
      "index",
      `
      beforeEach(function() {
        chaiJestSnapshot.configureUsingMochaContext(this);
      });

      afterEach(function() {
        chaiJestSnapshot.resetSnapshotRegistry();
      });

      it("first", () => {
        expect("foo").to.matchSnapshot();
      });
    `,
    );
    await runMocha(
      "index",
      `
      beforeEach(function() {
        chaiJestSnapshot.configureUsingMochaContext(this);
      });

      afterEach(function() {
        chaiJestSnapshot.resetSnapshotRegistry();
      });

      it("second", () => {
        expect("foo").to.matchSnapshot();
      });
    `,
    );
    const snapshots = await readSnapshots("index");
    expect(Object.values(snapshots).length).toBe(1);
  });
});
