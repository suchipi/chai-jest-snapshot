import chai from "chai";
import sinonChai from "sinon-chai";
chai.use(sinonChai);

import sinon from "sinon";

global.expect = chai.expect;
global.sinon = sinon;
