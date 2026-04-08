// =============================================================================
// strictFunctionTypes
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#strictFunctionTypes

// Enforces stricter checking of function parameter types (contravariance).
// Without this, TS allows unsafe assignments between function types.

// ---------------------------------------------------------------------------
// The classic Animal/Dog example
// ---------------------------------------------------------------------------

class Animal {
  name = 'animal';
}

class Dog extends Animal {
  breed = 'labrador';
}

// A function that handles any Animal:
type AnimalHandler = (animal: Animal) => void;

// A function that only handles Dogs (accesses Dog-specific properties):
const dogHandler = (dog: Dog) => {
  console.log(dog.breed); // needs `breed` — only exists on Dog
};

// @ts-expect-error
const handler: AnimalHandler = dogHandler; // ❌ Type '(dog: Dog) => void' is not assignable

// Why? If we could assign dogHandler to AnimalHandler, someone could call:
//   handler(new Animal()) — passing an Animal where a Dog is expected.
//   `dog.breed` would be `undefined` — runtime crash.

// The safe direction is the opposite — a handler that accepts Animal
// can safely handle Dog (since Dog extends Animal):
const animalHandler = (animal: Animal) => {
  console.log(animal.name);
};

const safeHandler: (dog: Dog) => void = animalHandler; // ✅ Animal handler can handle Dogs
