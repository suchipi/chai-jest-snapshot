declare global {
  namespace Chai {
    interface Assertion {
      matchSnapshot(update?: boolean): void;
      matchSnapshot(propertyMatchers?: object): void;
      matchSnapshot(propertyMatchers: object, update: boolean): void;
    }
  }
}
  
export = chaiJestSnapshot;

declare function chaiJestSnapshot(chai: any, utils: any): void;

declare namespace chaiJestSnapshot {
  export function setFileName(fileName: string): void;
  export function setTestName(testName: string): void;
  export function resetSnapshotRegistry(): void;
  export function configureUsingMochaContext(ctx: Mocha.Context): void;
}
