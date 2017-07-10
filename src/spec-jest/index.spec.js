import chai, { expect } from "chai";
import React from "react";
import renderer from "react/lib/ReactTestRenderer";

chai.use(require("../../dist/"))

const ExampleComponent = () => (
  <div>
    <h1>
      Hi!
    </h1>
  </div>
);
const tree = renderer.create(<ExampleComponent />).toJSON();

describe("matchSnapshot", () => {

  describe("when running inside Jest", () => {

    it("should delegate to Jest’s built-in matcher", () => {
      expect(tree).to.matchSnapshot()
    })

  })
});
