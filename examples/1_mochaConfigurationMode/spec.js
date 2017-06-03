const expect = require("chai").expect;

describe("using chaiJestSnapshot in mocha-specific configuration mode", function() {
  it("does not require any arguments", function() {
    expect({ foo: "bar" }).to.matchSnapshot();
  });

  it("appends a number to the end of each snapshot name so that if you call matchSnapshot more than once, there isn't a conflict", function() {
    expect({ first: "thing" }).to.matchSnapshot();
    expect({ second: "thing" }).to.matchSnapshot();
  });

  it("uses an optional first argument to update a snapshot", function() {
    expect({ foo: "not bar" }).to.matchSnapshot(true);
  });

  it("can use an environment variable to update the snapshot instead", function() {
    process.env.CHAI_JEST_SNAPSHOT_UPDATE_ALL = "true";
    expect({ foo: "something else" }).to.matchSnapshot();
    delete process.env.CHAI_JEST_SNAPSHOT_UPDATE_ALL;
  });
});
