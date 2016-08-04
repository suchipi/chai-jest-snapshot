import path from "path";
import fs from "fs";
import rimraf from "rimraf";
import React from "react";
import renderer from "react/lib/ReactTestRenderer";
import { expect } from "chai";
import sinon from "sinon";
import SnapshotFile from "../SnapshotFile";
import matchSnapshot from "../matchSnapshot";

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
const EXISTING_SNAPSHOT_NAME = "ExampleComponent renders properly";
const NONEXISTANT_SNAPSHOT_PATH = workspacePath("SomeOtherComponent.js.snap");
const NONEXISTANT_SNAPSHOT_NAME = "ExampleComponent throws rubber chickens";

describe("matchSnapshot", function() {
  let object;
  let snapshotFileName;
  let snapshotName;
  let update;

  // Creates object with shape: { run, assert }
  // `run` will call matchSnapshot with its value of `this` stubbed appropriately
  // `assert` is a sinon.spy() that was made available to matchSnapshot as `this.assert`
  const createMatchOperation = () => {
    let assert = sinon.spy();
    return {
      run() {
        matchSnapshot.call({
          _obj: object,
          assert
        }, snapshotFileName, snapshotName, update);
      },
      assert
    }
  };

  function expectPass() {
    let matchOperation = createMatchOperation();
    matchOperation.run();
    expect(matchOperation.assert).to.have.been.calledWith(true);
  }

  beforeEach(function() {
    // clear out workspace
    rimraf.sync(workspacePath("*"));
    // create the snapshot file that is considered "existing" by these tests
    const existingSnapshotFile = new SnapshotFile(EXISTING_SNAPSHOT_PATH);
    existingSnapshotFile.add(EXISTING_SNAPSHOT_NAME, tree);
    existingSnapshotFile.save();

    object = undefined;
    snapshotFileName = undefined;
    snapshotName = undefined;
    update = false;
  });

  afterEach(function() {
    rimraf.sync(workspacePath("*"));
  });

  describe("when the snapshot file exists", function() {
    beforeEach(function() {
      snapshotFileName = EXISTING_SNAPSHOT_PATH;
    });

    describe("and the snapshot file has the snapshot", function() {
      beforeEach(function() {
        snapshotName = EXISTING_SNAPSHOT_NAME;
      });

      describe("and the content matches", function() {
        beforeEach(function() {
          object = tree;
        });

        it("the assertion passes", expectPass);
      });
      describe("and the content does not match", function() {
        beforeEach(function() {
          object = "something other than tree";
        });

        it("does not overwrite the snapshot with the new content", function() {
          createMatchOperation().run();
          let snapshotFileContent = fs.readFileSync(snapshotFileName, 'utf8');
          let expectedContent = `exports[\`${EXISTING_SNAPSHOT_NAME}\`] = \`\n${prettyTree}\n\`;\n`;
          expect(snapshotFileContent).to.equal(expectedContent);
        });

        it("the assertion does not pass", function() {
          let matchOperation = createMatchOperation();
          matchOperation.run();
          expect(matchOperation.assert).to.have.been.calledWith(
            false,
            `expected value to match snapshot ${snapshotName}`,
            `expected value to not match snapshot ${snapshotName}`,
            prettyTree,
            '"something other than tree"',
            true
          );
        });

        describe("and the 'update' flag set to true", function() {
          beforeEach(function() {
            update = true;
          });

          it("overwrites the snapshot with the new content", function() {
            createMatchOperation().run();
            let snapshotFileContent = fs.readFileSync(snapshotFileName, 'utf8');
            let expectedContent = `exports[\`${EXISTING_SNAPSHOT_NAME}\`] = \`"something other than tree"\`;\n`;
            expect(snapshotFileContent).to.equal(expectedContent);
          });

          it("the assertion passes", expectPass)
        })
      });
    });

    describe("and the snapshot file does not have the snapshot", function() {
      beforeEach(function() {
        snapshotName = NONEXISTANT_SNAPSHOT_NAME;
        object = tree;
      });

      it("adds the snapshot to the file", function() {
        createMatchOperation().run();
        let snapshotFileContent = fs.readFileSync(snapshotFileName, 'utf8');
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
      snapshotFileName = NONEXISTANT_SNAPSHOT_PATH;
      snapshotName = NONEXISTANT_SNAPSHOT_NAME;
      object = tree;
    });

    it("a new snapshot file is created with the snapshot content", function() {
      createMatchOperation().run();
      let snapshotFileContent = fs.readFileSync(snapshotFileName, 'utf8');
      let expectedContent = `exports[\`${NONEXISTANT_SNAPSHOT_NAME}\`] = \`\n` +
        prettyTree +
        `\n\`;\n`;
      expect(snapshotFileContent).to.equal(expectedContent);
    });

    it("the assertion passes", expectPass);
  });
});
