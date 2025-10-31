class Singleton {
  private static instance: Singleton;

  static {
    console.log('hi from static block'); // runs once when the class is first accessed
  }

  // Private constructor to disallow instantiation of the class using `new` operator
  private constructor() {
    console.log('Singleton instance created!');
  }

  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }

    return Singleton.instance;
  }

  sayHello(): void {
    console.log('Hello from Singleton!');
  }
}

Singleton.getInstance(); // First call, creates the instance
Singleton.getInstance(); // Subsequent call, returns the existing instance
