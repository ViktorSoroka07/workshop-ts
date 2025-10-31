import { identity } from 'lodash';

// Generics in TypeScript are a way to make code reusable and flexible by allowing functions, classes, or types to work with different data types without losing type safety.
// They act as placeholders for types that are specified when the function or class is used.

// Generic functions

function getIdentity<T>(value: T): T {
  return value;
}

// T is a type variable (it stands for “Type”). It can be replaced with any type when the function is called.

const numIdentity = getIdentity<number>(42);
const strIdentity = getIdentity('Hello, world!'); // Did not provide type argument, TypeScript infers it as string literal type

// `getIdentity` analog of `identity` function in `lodash`
const boolIdentity = identity(true);

function getFirstElement<T>(arr: T[]): T {
  return arr[0];
}

const firstNumberElement = getFirstElement([1, 2, 3]);
const firstStringElement = getFirstElement(['apple', 'banana', 'cherry']);

// ----------------------------------------------------------------------------

// Define a generic API fetch function
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const data = await response.json();

  return data as T; // Tell TypeScript: “data will look like type T”
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
}

// Use the same function for different APIs
async function main() {
  const user = await fetchData<User>('https://api.example.com/user/1');
  const product = await fetchData<Product>('https://api.example.com/product/1');

  console.log(user.name); // ✅ TypeScript knows it's a string
  console.log(product.price); // ✅ TypeScript knows it's a number
}

// In fact popular libraries like Axios use generics for type-safe API responses
/**
  axios.get<User>('/user/123')
    .then(response => {
      const user = response.data; // TypeScript now knows 'user' is of type User
      console.log(user.name);
    });
 */
