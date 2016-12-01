import path from "path";
import fs from "fs";
import rawMatchSnapshot from "./matchSnapshot";

const snapshotFiles = {};

const buildMatchSnapshot = (utils, mochaContext) => {
    const snapshots = {};

    return function matchSnapshot(update) {
        if (utils.flag(this, 'negate')) {
            throw new Error("`matchSnapshot` cannot be used with `.not`.");
        }
        if (!mochaContext) {
            throw new Error("Incorrect mocha context");
        }
        const filePath = mochaContext.file;
        const title = mochaContext.title;
        const ctx = mochaContext.ctx;
        
        // Track number of matchSnapshot() calls with same title
        if (!snapshots[title]) {
            snapshots[title] = 1;
        } else {
            snapshots[title]++;
        }
        
        const SNAPSHOT_DIR_NAME = "__snapshots__";
        const snapshotAbsoluteDir = path.join(path.dirname(filePath), SNAPSHOT_DIR_NAME);
        if (!fs.existsSync(snapshotAbsoluteDir)) {
            fs.mkdirSync(snapshotAbsoluteDir);
        }
        // Replace last extension with '.snap' rather than append it
        const snapshotFileName = path.join(snapshotAbsoluteDir, path.basename(filePath, path.extname(filePath)) + ".snap");
        const snapshotName = `${title} ${snapshots[title]}`;

        rawMatchSnapshot.apply(this, [snapshotFiles, snapshotFileName, snapshotName, update]);
    };
};

export default buildMatchSnapshot;
