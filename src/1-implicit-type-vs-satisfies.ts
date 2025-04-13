// 1. TypeScript does an amazing job at inferring types for variables

const config = {
  apiUrl: { host: "/api", port: 8080 },
  retryCount: 3,
  debugMode: true, // ✅ No error (extra property)
};

// will be inferred with following type

/*
{
  apiUrl: {
    host: string
    port: number
  }
  retryCount: number
  debugMode: boolean
}
*/

const palette1 = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255],
};

// will be inferred with following type

/*
{
  red: number[]
  green: string
  blue: number[]
}
*/

// and each key has its own type based dictated by value

palette1.red; // has type `number[]` - `palette.red.forEach` exists
palette1.green; // has type `string` - `palette.red.toUpperCase` exists

// 2. Also, it protects against unknown properties

// @ts-expect-error
config.id = 2; // ❌ Error (unknown property)

// 3. At the same time implicit type can lead to mistakes because of types or incorrect data at all

const palette2 = {
  red: [255, 0, 0],
  green: 255, // it should be of type `string`
  bleu: [0, 0, 255], // it should be `blue`
};

// The new satisfies operator lets us validate that the type of an expression matches some type, without changing the resulting type of that expression

type Colors = "red" | "green" | "blue"; // protected against typos
type RGB = [red: number, green: number, blue: number]; // used tuple instead of `number[]` to enforce only three colors in specified order

const palette3 = {
  red: [255, 0, 0],
  green: "#00ff00",
  // @ts-expect-error
  bleu: [0, 0, 255], // ❌ Error (unknown color)
} satisfies Record<Colors, string | RGB>;

const palette4 = {
  // @ts-expect-error
  blue: [0, 0, 255, 0], // ❌ Error (wrong format)
} satisfies Record<Colors, string | RGB>;

const validPalette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255],
} satisfies Record<Colors, string | RGB>;

// and each key still has its own type based dictated by value

validPalette.red; // has type `[number, number, number]` - `palette.red.forEach` exists
validPalette.green; // has type `string` - `palette.red.toUpperCase` exists
