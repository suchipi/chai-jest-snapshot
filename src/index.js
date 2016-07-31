import matchSnapshot from "./matchSnapshot";

module.exports = function(chai, utils) {
  chai.Assertion.addMethod("matchSnapshot", matchSnapshot);
};
