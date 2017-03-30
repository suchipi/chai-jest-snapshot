import buildMatchSnapshot from "./buildMatchSnapshot";

var internalConfig = {
	snapshotFileName: void 0,
	snapshotNameTemplate: void 0,
}

module.exports = function(chai, utils) {
  chai.Assertion.addMethod("matchSnapshot", buildMatchSnapshot(utils, internalConfig));
};

module.exports.registerSnapshotFileName = function(snapshotFileName) {
	internalConfig.snapshotFileName = snapshotFileName
}

module.exports.registerSnapshotNameTemplate = function(snapshotNameTemplate) {
	internalConfig.snapshotNameTemplate = snapshotNameTemplate
}
