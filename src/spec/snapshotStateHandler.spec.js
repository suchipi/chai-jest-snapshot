import snapshotStateHandler from "../snapshotStateHandler";

describe("snapshotStateHandler", function() {
  beforeEach(function() {
    snapshotStateHandler.create("somePath");
  });

  afterEach(function() {
    delete process.env.CI;
    delete process.env.CHAI_JEST_SNAPSHOT_UPDATE_ALL;
  });

  describe("create()", function() {
    it("does nothing when snapshot state with given path already exists", function() {
      // changing this so we could check whether _updateSnapshot value changes or not.
      process.env.CI = "true";
      snapshotStateHandler.create("somePath");

      expect(snapshotStateHandler.get("somePath")._updateSnapshot).to.equal("new");
    });

    it("creates snapshot state with updateSnapshot='none' when CI flag is set to 'true'", function() {
      process.env.CI = "true";
      snapshotStateHandler.create("anotherPath");

      expect(snapshotStateHandler.get("anotherPath")._updateSnapshot).to.equal("none");
    });

    it("creates snapshot state with updateSnapshot='all' when CHAI_JEST_SNAPSHOT_UPDATE_ALL flag is set to 'true'", function() {
      process.env.CHAI_JEST_SNAPSHOT_UPDATE_ALL = "true";
      snapshotStateHandler.create("differentPath");

      expect(snapshotStateHandler.get("differentPath")._updateSnapshot).to.equal("all");
    });
  });

  describe("get()", function() {
    it("returns snapshot state for given path", function() {
      const state = snapshotStateHandler.get("somePath");

      expect(state._snapshotPath).to.equal("somePath");
      expect(state._updateSnapshot).to.equal("new");
    });
  });

  describe("removeUncheckedKeys()", function() {
    it("clears the state", function() {
      snapshotStateHandler.removeUncheckedKeys();

      expect(snapshotStateHandler.get("somePath")).to.be.undefined;
      expect(snapshotStateHandler.get("anotherPath")).to.be.undefined;
      expect(snapshotStateHandler.get("differentPath")).to.be.undefined;
    });
  });
});
