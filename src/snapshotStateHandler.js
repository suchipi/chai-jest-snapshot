import { SnapshotState } from "jest-snapshot";

let states = {};

module.exports = {
    create: (snapshotPath) => {
        if (!states[snapshotPath]) {
            states[snapshotPath] = new SnapshotState(undefined, {
                updateSnapshot: process.env.CI ? "none" : (process.env.CHAI_JEST_SNAPSHOT_UPDATE_ALL ? "all" : "new"),
                snapshotPath,
            });
        }
    },
    get: (snapshotPath) => {
        return states[snapshotPath];
    },
    removeUncheckedKeys: () => {
        for (let state in states) {
            states[state].removeUncheckedKeys();
            states[state].save();
        }
        states = {};
    }
};
