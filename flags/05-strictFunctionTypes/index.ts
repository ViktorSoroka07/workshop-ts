// =============================================================================
// strictFunctionTypes (part of `strict`)
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#strictFunctionTypes

// When one function type is assigned to another, the parameters are compared the
// opposite way round from everything else: a function may stand in for another only
// if it accepts at least what the other accepts. Without the flag, TypeScript compares
// them both ways and lets an unsafe assignment through.

// ---------------------------------------------------------------------------
// The problem it catches
// ---------------------------------------------------------------------------

class Animal {
  name = 'Rex';
}

class Dog extends Animal {
  breed = 'labrador';
}

// Every Dog is an Animal, so a Dog fits where an Animal is expected. That direction is
// the one value assignments use (`const pet: Animal = new Dog()`).

// A function that handles any Animal:
type AnimalHandler = (animal: Animal) => void;

// A function that handles only Dogs and reads a Dog-only property:
const dogHandler = (dog: Dog) => {
  console.log(dog.breed);
};

// @ts-expect-error
const handler: AnimalHandler = dogHandler; // Error: Type '(dog: Dog) => void' is not assignable to type 'AnimalHandler'.

// Whoever holds `handler` may call it with any Animal: `handler(new Animal())`.
// `dog.breed` would read a property that is not there. The assignment is refused
// before that call can be written.

// For functions the safe direction reverses. A handler that accepts any Animal
// can stand in where a Dog handler is wanted, because every Dog is an Animal:
const animalHandler = (animal: Animal) => {
  console.log(animal.name);
};

const safeHandler: (dog: Dog) => void = animalHandler; // OK

//   value:      Dog  ──fits into──▶  Animal
//   handler:    (Animal) => void  ──fits into──▶  (Dog) => void
//
// This reversal is called contravariance: a parameter's allowed types run the
// opposite way to the values it receives.

safeHandler(new Dog()); // prints Rex

// 🎓 On your own: the rule has a hole by design, and it is harder because it depends on
// *how the type is written*. The flag checks function types and function-typed
// properties. A method declared with method syntax is exempt and compares both ways:
interface HandlerProperty {
  handle: (animal: Animal) => void;
}

interface HandlerMethod {
  handle(animal: Animal): void;
}

// @ts-expect-error
const strictOne: HandlerProperty = { handle: dogHandler }; // Error: Type '(dog: Dog) => void' is not assignable to type '(animal: Animal) => void'.

const looseOne: HandlerMethod = { handle: dogHandler }; // OK -- the same unsafe assignment, now allowed

// The exemption is deliberate: it keeps `Array<Dog>` assignable to `Array<Animal>`,
// as JavaScript programmers expect, at the price of this one unsafe spot.
const dogs: Dog[] = [new Dog()];
const pets: Animal[] = dogs; // OK

// ✅ Best practice: declare callbacks and handlers as properties with a function type
// (`handle: (animal: Animal) => void`) so the check applies to them.

console.log(strictOne, looseOne, pets, handler);
