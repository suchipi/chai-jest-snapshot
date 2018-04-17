import determineConfig from "../determineConfig";

describe("determineConfig", function() {
  const getNameForSnapshotUsingTemplate = (filename, name) => `getNameForSnapshotUsingTemplate("${filename}", "${name}")`;

  describe("has the expected behavior for all examples", function() {
    const examples = [
      // Invalid cases:
      // not enough info defined
      {
        args: [],
        config: {},
        expected: Error,
      },
      // filename determined but snapshot name is not
      {
        args: [],
        config: { snapshotFilename: "filename" },
        expected: Error,
      },
      // snapshot name determined but filename is not
      {
        args: [],
        config: { snapshotName: "name" },
        expected: Error,
      },
      // Normal cases:
      // when using arguments
      {
        args: ["filename", "name"],
        config: {},
        expected: {
          snapshotFilename: "filename",
          snapshotName: "name",
        },
      },
      // when using configuration
      {
        args: [],
        config: {
          snapshotFilename: "filename",
          snapshotNameTemplate: "name",
        },
        expected: {
          snapshotFilename: "filename",
          snapshotName: getNameForSnapshotUsingTemplate("filename", "name"),
        },
      },
    ];

    examples.forEach(({args, config, expected}) => {
      describe(`when args is ${JSON.stringify(args)} and config is ${JSON.stringify(config)}`, function() {
        const run = () => determineConfig(args, config, getNameForSnapshotUsingTemplate);

        if (expected === Error) {
          it("throws an Error", function() {
            expect(run).to.throw(Error);
          });
        } else {
          it("returns the expected values", function() {
            const actual = run();

            expect(actual.snapshotFilename).to.equal(expected.snapshotFilename);
            expect(actual.snapshotName).to.equal(expected.snapshotName);
          });
        }
      });
    });
  });
});
