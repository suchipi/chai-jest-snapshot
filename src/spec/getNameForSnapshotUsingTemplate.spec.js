import buildGetNameForSnapshotUsingTemplate from "../buildGetNameForSnapshotUsingTemplate";

describe("getNameForSnapshotUsingTemplate", function() {
  let snapshotNameRegistry;
  let snapshotFilename;
  let snapshotNameTemplate;
  beforeEach(function() {
    snapshotNameRegistry = {};
    snapshotFilename = "filename";
    snapshotNameTemplate = "name";
  });

  const getNameForSnapshotUsingTemplate = (...args) => buildGetNameForSnapshotUsingTemplate(snapshotNameRegistry)(...args);
  const expectRegistryCounter = (number) => expect(snapshotNameRegistry[snapshotNameTemplate]).to.equal(number);

  describe("when the snapshot name registry has data for the name already", function() {
    beforeEach(function() {
      snapshotNameRegistry = {
          [snapshotNameTemplate]: 3,
      };
    });

    it("adds 1 to the value and returns a new name using the new value", function() {
      const result = getNameForSnapshotUsingTemplate(snapshotFilename, snapshotNameTemplate);
      expect(result).to.equal("name 4");
      expectRegistryCounter(4);
    });
  });
});