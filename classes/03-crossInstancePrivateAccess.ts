// =============================================================================
// Cross-instance Private Access
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/classes.html#cross-instance-private-access

// TypeScript's `private` keyword is a compile-time-only check. Instances of the
// same class CAN access each other's private members — this is by design and
// matches the behavior of Java and C#. It enables patterns like equality checks
// without exposing internals via public getters.

export class EnvironmentConfig {
  constructor(
    private region: string,
    private tier: string
  ) {}

  isSameEnvironment(other: EnvironmentConfig) {
    // No error — `other.region` and `other.tier` are private, but accessible
    // because `other` is the same class as `this`:
    return other.region === this.region && other.tier === this.tier;
  }
}

const staging = new EnvironmentConfig('us-east-1', 'staging');
const alsoStaging = new EnvironmentConfig('us-east-1', 'staging');
const prod = new EnvironmentConfig('us-east-1', 'production');

console.log(staging.isSameEnvironment(alsoStaging)); // true
console.log(staging.isSameEnvironment(prod)); // false
