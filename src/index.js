import buildMatchSnapshot from "./buildMatchSnapshot";

module.exports = function(chai, utils) {
  chai.Assertion.addMethod("matchSnapshot", buildMatchSnapshot(utils));
};
