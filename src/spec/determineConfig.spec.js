import determineConfig from "../determineConfig";

describe("determineConfig", function() {
  const getNameForSnapshotUsingTemplate = (filename, name) => `getNameForSnapshotUsingTemplate("${filename}", "${name}")`;

  describe("has the expected behavior for all examples", function() {
    const examples = [
      // Invalid cases; not enough info defined
      {
        args: [],
        config: {},
        envFlag: false,
        expected: Error,
      },
      {
        args: [],
        config: {},
        envFlag: true,
        expected: Error,
      },
      {
        args: [true],
        config: {},
        envFlag: false,
        expected: Error,
      },
      {
        args: [false],
        config: {},
        envFlag: true,
        expected: Error,
      },
      // Normal cases when not using config
      {
        args: ["filename", "name"],
        config: {},
        envFlag: false,
        expected: {
          snapshotFilename: "filename",
          snapshotName: "name",
          update: false,
        },
      },
      {
        args: ["filename", "name"],
        config: {},
        envFlag: true,
        expected: {
          snapshotFilename: "filename",
          snapshotName: "name",
          update: true,
        },
      },
      {
        args: ["filename", "name", true],
        config: {},
        envFlag: false,
        expected: {
          snapshotFilename: "filename",
          snapshotName: "name",
          update: true,
        },
      },
      {
        args: ["filename", "name", true],
        config: {},
        envFlag: true,
        expected: {
          snapshotFilename: "filename",
          snapshotName: "name",
          update: true,
        },
      },
      // Invalid configuration cases
      // * filename determined but not snapshot name
      {
        args: [],
        config: { snapshotFilename: "filename" },
        envFlag: false,
        expected: Error,
      },
      {
        args: [],
        config: { snapshotFilename: "filename" },
        envFlag: true,
        expected: Error,
      },
      {
        args: [true],
        config: { snapshotFilename: "filename" },
        envFlag: false,
        expected: Error,
      },
      {
        args: [false],
        config: { snapshotFilename: "filename" },
        envFlag: false,
        expected: Error,
      },
      // * snapshot name determined but not filename
      {
        args: [],
        config: { snapshotName: "name" },
        envFlag: false,
        expected: Error,
      },
      {
        args: [],
        config: { snapshotName: "name" },
        envFlag: true,
        expected: Error,
      },
      {
        args: [true],
        config: { snapshotName: "name" },
        envFlag: false,
        expected: Error,
      },
      {
        args: [false],
        config: { snapshotName: "name" },
        envFlag: false,
        expected: Error,
      },
      // valid cases using configuration
      {
        args: [],
        config: {
          snapshotFilename: "filename",
          snapshotNameTemplate: "name",
        },
        envFlag: false,
        expected: {
          snapshotFilename: "filename",
          snapshotName: getNameForSnapshotUsingTemplate("filename", "name"),
          update: false,
        },
      },
      {
        args: [],
        config: {
          snapshotFilename: "filename",
          snapshotNameTemplate: "name",
        },
        envFlag: true,
        expected: {
          snapshotFilename: "filename",
          snapshotName: getNameForSnapshotUsingTemplate("filename", "name"),
          update: true,
        },
      },
      {
        args: [true],
        config: {
          snapshotFilename: "filename",
          snapshotNameTemplate: "name",
        },
        envFlag: false,
        expected: {
          snapshotFilename: "filename",
          snapshotName: getNameForSnapshotUsingTemplate("filename", "name"),
          update: true,
        },
      },
      {
        args: [false],
        config: {
          snapshotFilename: "filename",
          snapshotNameTemplate: "name",
        },
        envFlag: true,
        expected: {
          snapshotFilename: "filename",
          snapshotName: getNameForSnapshotUsingTemplate("filename", "name"),
          update: true,
        },
      },
    ];

    examples.forEach((example) => {
      describe(
        `when args is ${JSON.stringify(example.args)} ` +
        `and config is ${JSON.stringify(example.config)} ` +
        `and CHAI_JEST_SNAPSHOT_UPDATE_ALL is ${example.envFlag ? "set" : "not set"}`
      , function() {

        const run = () => {
          delete process.env.CHAI_JEST_SNAPSHOT_UPDATE_ALL;
          if (example.envFlag) {
            process.env.CHAI_JEST_SNAPSHOT_UPDATE_ALL = "true";
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
          });
        }
      });
    });
  });
});