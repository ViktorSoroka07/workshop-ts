// =============================================================================
// Constructor Overloads
// =============================================================================

// TypeScript supports constructor overloading through multiple signatures followed
// by a single implementation. Unlike Java/C#, you write one body that handles all
// cases — the overload signatures exist only for the caller's type checking.
//
// Use overloads when only some argument combinations are valid, as in `createDate` in
// ../types/06-functionTypes.ts. If a single signature with optional parameters accepts
// exactly the same calls, use that instead.
//
// This example also demonstrates `readonly` properties that can only be assigned
// in the constructor (similar to Java's `final` fields).

export class Duration {
  private readonly totalSeconds: number;

  // Overload signatures — only for the caller's type checking. Two shapes are valid,
  // a total in seconds or hours, minutes and seconds; two arguments is neither:
  constructor(totalSeconds: number);
  constructor(hours: number, minutes: number, seconds: number);

  // Single implementation handles all cases:
  constructor(hoursOrTotal: number, minutes?: number, seconds?: number) {
    if (minutes !== undefined && seconds !== undefined) {
      this.totalSeconds = hoursOrTotal * 3600 + minutes * 60 + seconds;
    } else {
      this.totalSeconds = hoursOrTotal;
    }

    console.log(`${this.totalSeconds} seconds`);
  }

  // `readonly` prevents reassignment after construction:
  extend(extraSeconds: number) {
    // @ts-expect-error
    this.totalSeconds += extraSeconds; // Error: Cannot assign to 'totalSeconds' because it is a read-only property.
  }
}

new Duration(5400); // 5400 seconds
new Duration(1, 30, 0); // 5400 seconds

// Callers see only the overload signatures, not the implementation's optional parameters:
// @ts-expect-error
new Duration(1, 30); // Error: No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.

/*
Java version — each overload has its own body (true method overloading):

public class Duration {
    private final int totalSeconds;

    public Duration(int totalSeconds) {
        this.totalSeconds = totalSeconds;

        System.out.println(this.totalSeconds + " seconds");
    }

    public Duration(int hours, int minutes, int seconds) {
        this.totalSeconds = hours * 3600 + minutes * 60 + seconds;

        System.out.println(this.totalSeconds + " seconds");
    }

    public static void main(String[] args) {
        new Duration(5400);
        new Duration(1, 30, 0);
    }
}
*/
