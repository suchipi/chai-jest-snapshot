import mochaBuildMatchSnapshot from "./mochaBuildMatchSnapshot";

module.exports = function (context) {
  return function (chai, utils) {
    chai.Assertion.addMethod("matchSnapshot", mochaBuildMatchSnapshot(utils, context));
  }
}
