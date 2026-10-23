// =============================================================================
// Cross-instance Private Access
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/classes.html#cross-instance-private-access

// `private` hides a class's internal state from the code that uses it. Callers
// cannot depend on a field they cannot reach, so the class can rename or
// restructure it later without breaking anyone. Reach for it on state that
// callers have no business reading or writing; what they do need, expose through
// a method.

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
