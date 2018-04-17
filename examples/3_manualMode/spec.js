const expect = require("chai").expect;
const chaiJestSnapshot = require("../../dist/");

describe("using chaiJestSnapshot in manual mode", function() {
  const snapshotFilename = __filename + ".snap";

  beforeEach(function() {
    chaiJestSnapshot.createState(snapshotFilename);
  });

  it("takes the snapshot filename and name as arguments", function() {
    expect({ foo: "bar" }).to.matchSnapshot(snapshotFilename, "snapshot 1");
  });

  it("uses an optional third argument to update a snapshot", function() {
    expect({ foo: "not bar" }).to.matchSnapshot(snapshotFilename, "snapshot 2", true);
  });

  it("can use an environment variable to update the snapshot instead", function() {
    process.env.CHAI_JEST_SNAPSHOT_UPDATE_ALL = "true";
    expect({ foo: "something else" }).to.matchSnapshot(snapshotFilename, "snapshot 3");
    delete process.env.CHAI_JEST_SNAPSHOT_UPDATE_ALL;
  });
});
