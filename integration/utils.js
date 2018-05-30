const fs = require("fs");
const path = require("path");
const spawn = require("spawndamnit");
const pify = require("pify");
const rimraf = require("rimraf");

const fsp = pify(fs);
const rimrafp = pify(rimraf);

function workspaceDir(workspaceName) {
  return path.resolve(__dirname, "workspace", workspaceName);
}

async function readSnapshots(pair) {
  const [workspaceName, filename = "code.js"] = pair.split("/");
  const code = await fsp.readFile(
    path.resolve(workspaceDir(workspaceName), filename + ".snap"),
    "utf-8",
  );
  const exports = {};
  eval(code);
  return exports;
}

function wrapCode(workspaceName, code) {
  return `
      const chai = require("chai");
      const chaiJestSnapshot = require(${JSON.stringify(
        path.resolve(__dirname, "..", "dist"),
      )});
      chai.use(chaiJestSnapshot);
      const expect = chai.expect;

      describe(${JSON.stringify(workspaceName)}, function() {
        ${code}
      });
    `;
}

async function clearWorkspace(name) {
  const dir = workspaceDir(name);
  await rimrafp(dir);
  await fsp.mkdir(dir);
}

async function runMocha(pair, code) {
  const [workspaceName, filename = "code.js"] = pair.split("/");
  const dir = workspaceDir(workspaceName);
  const codePath = path.join(dir, filename);
  const mochaPath = path.resolve(__dirname, "node_modules", ".bin", "mocha");

  await fsp.writeFile(codePath, wrapCode(workspaceName, code));
  const results = await spawn(mochaPath, [filename], { cwd: dir });
  if (results.code !== 0) {
    throw new Error(results.stderr);
  } else {
    return results;
  }
}

module.exports = {
  readSnapshots,
  clearWorkspace,
  runMocha,
};
