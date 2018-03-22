import { SnapshotState } from "jest-snapshot";

let states = {};

module.exports = {
    create: ({snapshotPath, ci, update}) => {
        if (!states[snapshotPath]) {
            states[snapshotPath] = new SnapshotState(undefined, {
                updateSnapshot: ci ? "none" : (update ? "all" : "new"),
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
