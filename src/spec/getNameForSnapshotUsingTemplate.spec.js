import buildGetNameForSnapshotUsingTemplate from "../buildGetNameForSnapshotUsingTemplate";

describe("getNameForSnapshotUsingTemplate", function() {
  let snapshotNameRegistry;
  let snapshotFileName;
  let snapshotNameTemplate;
  beforeEach(function() {
    snapshotNameRegistry = {};
    snapshotFileName = "filename";
    snapshotNameTemplate = "name";
  });

  const getNameForSnapshotUsingTemplate = (...args) => buildGetNameForSnapshotUsingTemplate(snapshotNameRegistry)(...args);
  const expectRegistryCounter = (number) => expect(snapshotNameRegistry[snapshotFileName][snapshotNameTemplate]).to.equal(number);

  describe("when the snapshot name registry is empty", function() {
    it("appends a 1 to the name template", function() {
      const result = getNameForSnapshotUsingTemplate(snapshotFileName, snapshotNameTemplate);
      expect(result).to.equal("name 1");
    });

    it("updates the registry", function() {
      getNameForSnapshotUsingTemplate(snapshotFileName, snapshotNameTemplate);
      expectRegistryCounter(1);
    });
  });

  describe("when the snapshot name registry has unrelated data", function() {
    beforeEach(function() {
      snapshotNameRegistry = {
        someOtherFilename: {
          someOtherName: 2,
        },
      };
    });

    it("appends a 1 to the name template", function() {
      const result = getNameForSnapshotUsingTemplate(snapshotFileName, snapshotNameTemplate);
      expect(result).to.equal("name 1");
    });

    it("updates the registry", function() {
      getNameForSnapshotUsingTemplate(snapshotFileName, snapshotNameTemplate);
      expectRegistryCounter(1);
    });
  });

  describe("when the snapshot name registry has another file with the same snapshot name", function() {
    beforeEach(function() {
      snapshotNameRegistry = {
        someOtherFilename: {
          name: 2,
        },
      };
    });

    it("ignores it and (still) appends 1 to the name", function() {
      const result = getNameForSnapshotUsingTemplate(snapshotFileName, snapshotNameTemplate);
      expect(result).to.equal("name 1");
    });
  });

  describe("when the snapshot name registry has data for the name already", function() {
    beforeEach(function() {
      snapshotNameRegistry = {
        [snapshotFileName]: {
          [snapshotNameTemplate]: 3,
        },
      };
    });

    it("adds 1 to the value and returns a new name using the new value", function() {
      const result = getNameForSnapshotUsingTemplate(snapshotFileName, snapshotNameTemplate);
      expect(result).to.equal("name 4");
      expectRegistryCounter(4);
    });
  });
});