import snapshotFileExport from "jest-snapshot/build/SnapshotFile";

const SnapshotFile = snapshotFileExport.forFile(__filename).constructor;

export default SnapshotFile;
