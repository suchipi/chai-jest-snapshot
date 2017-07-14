require("./helper");
const expect = require("chai").expect;

describe("using chaiJestSnapshot in Jest mode (i.e. within Jest)", function() {
  it("delegates to Jest’s built-in snapshot ability", function() {
    expect({ foo: "bar" }).to.matchSnapshot();
  });
});
