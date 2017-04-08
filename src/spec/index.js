import chai from "chai";
import sinonChai from "sinon-chai";
chai.use(sinonChai);

import { expect } from "chai";
import sinon from "sinon";

global.expect = expect;
global.sinon = sinon;
