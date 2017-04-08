const chai = require("chai");
const chaiJestSnapshot = require("../../dist/");
chai.use(chaiJestSnapshot);

beforeEach(function() {
  // There is a shortcut for calling setFilename and setTestName in Mocha
  // that you can call once in a global beforeEach in your test helper file.
  // It will use the current file + ".spec" as the filename and the current
  // test name as the test name.
  chaiJestSnapshot.setFilenameAndTestNameUsingMochaContext(this);
  // With that in place, you don't need to do any additional configuration in your spec files.
  //
  // Make sure not to use an arrow function in the beforeEach, or you won't
  // be able to access the special value of `this` mocha calls the beforeEach with.
});
