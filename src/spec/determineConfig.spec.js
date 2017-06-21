import determineConfig from "../determineConfig";

describe("determineConfig", function() {
  const getNameForSnapshotUsingTemplate = (filename, name) => `getNameForSnapshotUsingTemplate("${filename}", "${name}")`;

  describe("has the expected behavior for all examples", function() {
    const examples = [
      // Invalid cases; not enough info defined
      {
        args: [],
        config: {},
        envUpdateFlag: false,
        envCiFlag: false,
        expected: Error,
      },
      {
        args: [],
        config: {},
        envUpdateFlag: true,
        envCiFlag: false,
        expected: Error,
      },
      {
        args: [true],
        config: {},
        envUpdateFlag: false,
        envCiFlag: false,
        expected: Error,
      },
      {
        args: [false],
        config: {},
        envUpdateFlag: true,
        envCiFlag: false,
        expected: Error,
      },
      // Normal cases when not using config
      {
        args: ["filename", "name"],
        config: {},
        envUpdateFlag: false,
        envCiFlag: false,
        expected: {
          snapshotFilename: "filename",
          snapshotName: "name",
          update: false,
          ci: false
        },
      },
      {
        args: ["filename", "name"],
        config: {},
        envUpdateFlag: true,
        envCiFlag: false,
        expected: {
          snapshotFilename: "filename",
          snapshotName: "name",
          update: true,
          ci: false
        },
      },
      {
        args: ["filename", "name", true],
        config: {},
        envUpdateFlag: false,
        envCiFlag: false,
        expected: {
          snapshotFilename: "filename",
          snapshotName: "name",
          update: true,
          ci: false
        },
      },
      {
        args: ["filename", "name", true],
        config: {},
        envUpdateFlag: true,
        envCiFlag: false,
        expected: {
          snapshotFilename: "filename",
          snapshotName: "name",
          update: true,
          ci: false
        },
      },
      // Invalid configuration cases
      // * filename determined but not snapshot name
      {
        args: [],
        config: { snapshotFilename: "filename" },
        envUpdateFlag: false,
        envCiFlag: false,
        expected: Error,
      },
      {
        args: [],
        config: { snapshotFilename: "filename" },
        envUpdateFlag: true,
        envCiFlag: false,
        expected: Error,
      },
      {
        args: [true],
        config: { snapshotFilename: "filename" },
        envUpdateFlag: false,
        envCiFlag: false,
        expected: Error,
      },
      {
        args: [false],
        config: { snapshotFilename: "filename" },
        envUpdateFlag: false,
        envCiFlag: false,
        expected: Error,
      },
      // * snapshot name determined but not filename
      {
        args: [],
        config: { snapshotName: "name" },
        envUpdateFlag: false,
        envCiFlag: false,
        expected: Error,
      },
      {
        args: [],
        config: { snapshotName: "name" },
        envUpdateFlag: true,
        envCiFlag: false,
        expected: Error,
      },
      {
        args: [true],
        config: { snapshotName: "name" },
        envUpdateFlag: false,
        envCiFlag: false,
        expected: Error,
      },
      {
        args: [false],
        config: { snapshotName: "name" },
        envUpdateFlag: false,
        envCiFlag: false,
        expected: Error,
      },
      // valid cases using configuration
      {
        args: [],
        config: {
          snapshotFilename: "filename",
          snapshotNameTemplate: "name",
        },
        envUpdateFlag: false,
        envCiFlag: false,
        expected: {
          snapshotFilename: "filename",
          snapshotName: getNameForSnapshotUsingTemplate("filename", "name"),
          update: false,
          ci: false
        },
      },
      {
        args: [],
        config: {
          snapshotFilename: "filename",
          snapshotNameTemplate: "name",
        },
        envUpdateFlag: true,
        envCiFlag: false,
        expected: {
          snapshotFilename: "filename",
          snapshotName: getNameForSnapshotUsingTemplate("filename", "name"),
          update: true,
          ci: false
        },
      },
      {
        args: [true],
        config: {
          snapshotFilename: "filename",
          snapshotNameTemplate: "name",
        },
        envUpdateFlag: false,
        envCiFlag: false,
        expected: {
          snapshotFilename: "filename",
          snapshotName: getNameForSnapshotUsingTemplate("filename", "name"),
          update: true,
          ci: false
        },
      },
      {
        args: [false],
        config: {
          snapshotFilename: "filename",
          snapshotNameTemplate: "name",
        },
        envUpdateFlag: true,
        envCiFlag: true,
        expected: {
          snapshotFilename: "filename",
          snapshotName: getNameForSnapshotUsingTemplate("filename", "name"),
          update: true,
          ci: true
        },
      },
    ];

    examples.forEach((example) => {
      describe(
        `when args is ${JSON.stringify(example.args)} ` +
        `and config is ${JSON.stringify(example.config)} ` +
        `and CHAI_JEST_SNAPSHOT_UPDATE_ALL is ${example.envUpdateFlag ? "set" : "not set"} `+
        `and CHAI_JEST_CI is ${example.envCiFlag ? "set" : "not set"}`
      , function() {

        const run = () => {
          delete process.env.CHAI_JEST_SNAPSHOT_UPDATE_ALL;
          if (example.envUpdateFlag) {
            process.env.CHAI_JEST_SNAPSHOT_UPDATE_ALL = "true";
          }
          if (example.envCiFlag) {
            process.env.CHAI_JEST_CI = "true";
          }
          return determineConfig(example.args, example.config, getNameForSnapshotUsingTemplate);
        };

        if (example.expected === Error) {
          it("throws an Error", function() {
            expect(run).to.throw(Error);
          });
        } else {
          it("returns the expected values", function() {
            const actual = run();
            const { expected } = example;
            expect(actual.snapshotFilename).to.equal(expected.snapshotFilename);
            expect(actual.snapshotName).to.equal(expected.snapshotName);
            expect(actual.update).to.equal(expected.update);
            expect(actual.ci).to.equal(expected.ci);
          });
        }
      });
    });
  });
});