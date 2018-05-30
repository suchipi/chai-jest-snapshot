module.exports = {
  extends: ["unobtrusive", "unobtrusive/import", "unobtrusive/react"],
  env: {
    node: true,
    mocha: true
  },
  globals: {
    expect: false,
    sinon: false
  }
};
