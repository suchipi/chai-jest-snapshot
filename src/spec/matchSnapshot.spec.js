import path from "path";
import fs from "fs";
import rimraf from "rimraf";
import React from "react";
import renderer from "react/lib/ReactTestRenderer";
import { expect } from "chai";
import sinon from "sinon";
import SnapshotFile from "../SnapshotFile";
import buildMatchSnapshot from "../buildMatchSnapshot";

const ExampleComponent = () => (
  <div>
    <h1>
      Hi!
    </h1>
  </div>
);
const tree = renderer.create(<ExampleComponent />).toJSON()
const prettyTree = `<div>
  <h1>
    Hi!
  </h1>
</div>`;

const workspacePath = (...args) => path.join(__dirname, "matchSnapshot.spec.workspace", ...args);

const EXISTING_SNAPSHOT_PATH = workspacePath("ExampleComponent.js.snap");
const EXISTING_SNAPSHOT_RELATIVE_PATH = "src/spec/matchSnapshot.spec.workspace/ExampleComponent.js.snap";
const EXISTING_SNAPSHOT_NAME = "ExampleComponent renders properly";
const NONEXISTANT_SNAPSHOT_PATH = workspacePath("SomeOtherComponent.js.snap");
const NONEXISTANT_SNAPSHOT_NAME = "ExampleComponent throws rubber chickens";

describe("matchSnapshot", function() {
  let object;
  let snapshotFilename;
  let snapshotName;
  let update;
  let utils;

  const parseArgs = () => ({
    snapshotFilename,
    snapshotName,
    update,
  });

  // Creates object with shape: { run, assert }
  // `run` will call matchSnapshot with its value of `this` stubbed appropriately
  // `assert` is a sinon.spy() that was made available to matchSnapshot as `this.assert`
  // `internal` is an object that contains any variables that were published by the match operation
  // for testing purposes.
  const createMatchOperation = () => {
    let assert = sinon.spy();
    let internal = {};
    let timesRan = 0;
    const matchSnapshot = buildMatchSnapshot(utils, parseArgs);

    return {
      run() {
        matchSnapshot.call({
          _obj: object,
          assert,
          _publishInternalVariableForTesting: (name, value) => {
            internal[name] = internal[name] || [];
            internal[name][timesRan] = value;
          }
        });
        timesRan++;
      },
      assert,
      internal,
    };
  };

  function expectPass() {
    let matchOperation = createMatchOperation();
    matchOperation.run();
    expect(matchOperation.assert).to.have.been.calledWith(true);
  }

  const expectFailure = (actual) => () => {
    let matchOperation = createMatchOperation();
    matchOperation.run();
    expect(matchOperation.assert).to.have.been.calledWith(
      false,
      `expected value to match snapshot ${snapshotName}`,
      `expected value to not match snapshot ${snapshotName}`,
      prettyTree,
      actual,
      true
    );
  };

  beforeEach(function() {
    // clear out workspace
    rimraf.sync(workspacePath("*"));
    // create the snapshot file that is considered "existing" by these tests
    const existingSnapshotFile = new SnapshotFile(EXISTING_SNAPSHOT_PATH);
    existingSnapshotFile.add(EXISTING_SNAPSHOT_NAME, tree);
    existingSnapshotFile.save();

    object = undefined;
    snapshotFilename = undefined;
    snapshotName = undefined;
    update = false;
    utils = { flag: () => undefined };
  });

  afterEach(function() {
    rimraf.sync(workspacePath("*"));
  });

  const expectUsesSameInstance = () => {
    object = "whatever";
    const operation = createMatchOperation();
    snapshotName = "first";
    operation.run();
    snapshotName = "second";
    operation.run();
    expect(operation.internal.snapshotFile[0]).to.be.an.instanceof(SnapshotFile);
    expect(operation.internal.snapshotFile[1]).to.be.an.instanceof(SnapshotFile);
    expect(operation.internal.snapshotFile[0] === operation.internal.snapshotFile[1]).to.be.true;
  };

  describe("when the snapshot file exists", function() {
    beforeEach(function() {
      snapshotFilename = EXISTING_SNAPSHOT_PATH;
    });

    it("uses the same snapshotFile instance across multiple runs (#2)", expectUsesSameInstance);

    describe("and the snapshot file has the snapshot", function() {
      beforeEach(function() {
        snapshotName = EXISTING_SNAPSHOT_NAME;
      });

      describe("and the content matches", function() {
        beforeEach(function() {
          object = tree;
        });

        it("the assertion passes", expectPass);

        describe("and the assertion is made with `.not` in the chain", function() {
          beforeEach(function() {
            utils = { flag: (_, name) => name === 'negate' ? true : undefined };
          });

          it("throws an error", function() {
            expect(createMatchOperation().run).to.throw(Error, "`matchSnapshot` cannot be used with `.not`.");
          });
        });
      });

      describe("and the content does not match", function() {
        beforeEach(function() {
          object = "something other than tree";
        });

        function doesNotOverwriteSnapshot() {
          createMatchOperation().run();
          let snapshotFileContent = fs.readFileSync(snapshotFilename, 'utf8');
          let expectedContent = `exports[\`${EXISTING_SNAPSHOT_NAME}\`] = \`\n${prettyTree}\n\`;\n`;
          expect(snapshotFileContent).to.equal(expectedContent);
        }

        it("does not overwrite the snapshot with the new content", doesNotOverwriteSnapshot);

        it("the assertion does not pass", expectFailure('"something other than tree"'));

        describe("and the 'update' flag set to true", function() {
          beforeEach(function() {
            update = true;
          });

          it("overwrites the snapshot with the new content", function() {
            createMatchOperation().run();
            let snapshotFileContent = fs.readFileSync(snapshotFilename, 'utf8');
            let expectedContent = `exports[\`${EXISTING_SNAPSHOT_NAME}\`] = \`"something other than tree"\`;\n`;
            expect(snapshotFileContent).to.equal(expectedContent);
          });

          it("the assertion passes", expectPass)
        });

        describe("and the 'update' flag not set to true", function() {
          beforeEach(function() {
            update = undefined;
          });
        });

        describe("and a relative path is used (#1)", function() {
          beforeEach(function() {
            snapshotFilename = EXISTING_SNAPSHOT_RELATIVE_PATH;
          });

          it("does not overwrite the snapshot with the new content", doesNotOverwriteSnapshot);

          it("the assertion does not pass", expectFailure('"something other than tree"'));
        });
      });
    });

    describe("and the snapshot file does not have the snapshot", function() {
      beforeEach(function() {
        snapshotName = NONEXISTANT_SNAPSHOT_NAME;
        object = tree;
      });

      it("adds the snapshot to the file", function() {
        createMatchOperation().run();
        let snapshotFileContent = fs.readFileSync(snapshotFilename, 'utf8');
        let expectedContent = `exports[\`${EXISTING_SNAPSHOT_NAME}\`] = \`\n` +
          prettyTree +
          `\n\`;\n\n` +
          `exports[\`${NONEXISTANT_SNAPSHOT_NAME}\`] = \`\n` +
          prettyTree +
          `\n\`;\n`;
        expect(snapshotFileContent).to.equal(expectedContent);
      });

      it("the assertion passes", expectPass);
    });
  });

  describe("when the snapshot file does not exist", function() {
    beforeEach(function() {
      snapshotFilename = NONEXISTANT_SNAPSHOT_PATH;
      snapshotName = NONEXISTANT_SNAPSHOT_NAME;
      object = tree;
    });

    it("uses the same snapshotFile instance across multiple runs (#2)", expectUsesSameInstance);

    it("a new snapshot file is created with the snapshot content", function() {
      createMatchOperation().run();
      let snapshotFileContent = fs.readFileSync(snapshotFilename, 'utf8');
      let expectedContent = `exports[\`${NONEXISTANT_SNAPSHOT_NAME}\`] = \`\n` +
        prettyTree +
        `\n\`;\n`;
      expect(snapshotFileContent).to.equal(expectedContent);
    });

    it("the assertion passes", expectPass);
  });
});