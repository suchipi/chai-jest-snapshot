declare namespace Chai {
  interface Assertion {
    matchSnapshot(update?: boolean): void;
    matchSnapshot(propertyMatchers?: object): void;
    matchSnapshot(propertyMatchers: object, update: boolean): void;
  }
}
