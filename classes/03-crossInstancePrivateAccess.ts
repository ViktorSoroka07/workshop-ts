// =============================================================================
// Cross-instance Private Access
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/classes.html#cross-instance-private-access

// `private` marks the implementation details of a class: the parts outsiders are not
// expected to touch, because changing them from outside could break the class. Callers
// change them through methods instead, so the class stays in control.

export class EnvironmentConfig {
  private region: string;
  private tier: string;

  constructor(region: string, tier: string) {
    this.region = region;
    this.tier = tier;
  }

  // ⚠️ Gotcha: `private` limits access per class, not per instance. Code inside
  // `EnvironmentConfig` can read the private fields of ANY `EnvironmentConfig`,
  // not only `this`. Java and C# work the same way, and it lets a method compare
  // two objects without public getters for their internals:
  isSameEnvironment(other: EnvironmentConfig) {
    // No error — `other.region` and `other.tier` are private, but `other` is the
    // same class as `this`:
    return other.region === this.region && other.tier === this.tier;
  }
}

const staging = new EnvironmentConfig('us-east-1', 'staging');
const alsoStaging = new EnvironmentConfig('us-east-1', 'staging');
const prod = new EnvironmentConfig('us-east-1', 'production');

console.log(staging.isSameEnvironment(alsoStaging)); // true
console.log(staging.isSameEnvironment(prod)); // false

// Outside the class, the very same read is an error:
// @ts-expect-error
console.log(staging.region); // Error: Property 'region' is private and only accessible within class 'EnvironmentConfig'.

// A subclass is a different class, so the same read fails there too:
class RegionalConfig extends EnvironmentConfig {
  isInUsEast(other: EnvironmentConfig) {
    // @ts-expect-error
    return other.region === 'us-east-1'; // Error: Property 'region' is private and only accessible within class 'EnvironmentConfig'.
  }
}
