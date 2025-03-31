class Singleton {
  private static instance: Singleton;

  // Private constructor to disallow instantiation of the class using `new` operator
  private constructor() {
    console.log("Singleton instance created!");
  }

  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }

    return Singleton.instance;
  }

  sayHello(): void {
    console.log("Hello from Singleton!");
  }
}

Singleton.getInstance();
