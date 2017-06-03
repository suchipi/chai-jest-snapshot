const expect = require("chai").expect;

describe("using chaiJestSnapshot in manual mode", function() {
  it("takes the snapshot filename and name as arguments", function() {
    expect({ foo: "bar" }).to.matchSnapshot(__filename + ".snap", "snapshot 1");
  });

  it("uses an optional third argument to update a snapshot", function() {
    expect({ foo: "not bar" }).to.matchSnapshot(__filename + ".snap", "snapshot 2", true);
  });

  it("can use an environment variable to update the snapshot instead", function() {
    process.env.CHAI_JEST_SNAPSHOT_UPDATE_ALL = "true";
    expect({ foo: "something else" }).to.matchSnapshot(__filename + ".snap", "snapshot 3");
    delete process.env.CHAI_JEST_SNAPSHOT_UPDATE_ALL;
  });
});
