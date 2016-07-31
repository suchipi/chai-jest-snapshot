import SnapshotFile from "./SnapshotFile";

export default function matchSnapshot(snapshotFileName, snapshotName, update) {
  const obj = this._obj;
  const snapshotFile = new SnapshotFile(snapshotFileName);
  let matches;
  let pass;

  if (snapshotFile.fileExists() && snapshotFile.has(snapshotName)) {
    matches = snapshotFile.matches(snapshotName, obj);
    pass = matches.pass;
  } else {
    snapshotFile.add(snapshotName, obj);
    snapshotFile.save();
    pass = true;
  }

  if (!pass && update) {
    snapshotFile.add(snapshotName, obj);
    snapshotFile.save();
    pass = true;
  }

  this.assert(
    pass,
    `expected value to match snapshot ${snapshotName}`,
    `expected value to not match snapshot ${snapshotName}`,
    matches && matches.expected && matches.expected.trim(),
    matches && matches.actual && matches.actual.trim(),
    matches && true
  )
}
