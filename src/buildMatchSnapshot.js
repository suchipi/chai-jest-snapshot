import rawMatchSnapshot from "./matchSnapshot";

const buildMatchSnapshot = (utils) => {
  const snapshotFiles = {};
  return function matchSnapshot(snapshotFileName, snapshotName, update) {
    if (utils.flag(this, 'negate')) {
      throw new Error("`matchSnapshot` cannot be used with `.not`.");
    }
    
    rawMatchSnapshot.apply(this, [snapshotFiles, snapshotFileName, snapshotName, update]);
  };
};

export default buildMatchSnapshot;
