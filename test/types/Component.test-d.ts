import Component from "../../src/Component";

const test = (testName: string, func: (...args: any[]) => any) => {}

class TestClass extends Component<{
  evt1: {
    a: number;
  };
  evt2: (arg0: {
    b: string;
  }, arg1: boolean) => void;
  evt3: (arg0: {
    c: boolean;
  }) => any;
  evt4: void;
  evt5: {
    a: 1;
    stop(): void;
  }
}> {
  testMethod() {}
};

const component = new TestClass();

// ✅
test("Correct event definitions", () => {
  // $ExpectType SomeCorrectClass
  class SomeCorrectClass extends Component<{
    evt1: {
      prop0: number;
      prop1: string;
      prop2: object;
      prop3: {
        nested0: number;
        nested1: string;
      };
      prop4: (arg0: number) => void;
    };
    evt2: (arg0: {
      b: string;
    }, arg1: boolean) => any;
    evt3: (arg0: {
      c: boolean;
    }) => any;
    evt4: void;
    evt5: null;
    evt6: undefined;
    evt7: never;
    evt8: {
      a: 1,
      stop(): void,
    }
  }> {};
});

test("Can make component with no event definitions", () => {
  // $ExpectType SomeCorrectClass
  class SomeCorrectClass extends Component {
    // NOTHING
  }
});

test("Can make component with no event definitions and call methods of it", () => {
  class SomeCorrectClass2 extends Component {};

  // $ExpectType boolean
  new SomeCorrectClass2().trigger("a");

  // $ExpectType SomeCorrectClass2
  new SomeCorrectClass2().on("a", e => {});

  // $ExpectType SomeCorrectClass2
  new SomeCorrectClass2().once("a", e => {});

  // $ExpectType SomeCorrectClass2
  new SomeCorrectClass2().off("a", e => {});
});

test("Correct trigger() usage", () => {
  // $ExpectType boolean
  component.trigger("evt1", { a : 1 });

  // $ExpectType boolean
  component.trigger("evt2", { b : "" }, true);

  // $ExpectType boolean
  component.trigger("evt3", { c : true });

  // $ExpectType boolean
  component.trigger("evt4");

  // skip stop function
  // $ExpectType boolean
  component.trigger("evt5", {
    a: 1,
  });
});
test("Even if the event type is not set, there is no type error.", () => {
  const defaultComponent = new Component();

  // Any event passes.
  defaultComponent.on("a", e => {
    // $ExpectType any
    e.a;
    // $ExpectType any
    e.b;
  });

  // Any parameters passes.
  defaultComponent.trigger("a");
  defaultComponent.trigger("a", { a: 1 });
  defaultComponent.trigger("a", { a: 1 }, 1);
});
test("Correct on, once usage", () => {
  ["on", "once"].forEach((method: "on" | "once") => {
    // $ExpectType TestClass
    component[method]("evt1", e => {
      // $ExpectType number
      e.a;
    });

    // $ExpectType TestClass
    component[method]("evt2", (arg0, arg1) => {
      // $ExpectType string
      arg0.b

      // $ExpectType boolean
      arg1
    });

    // $ExpectType TestClass
    component[method]("evt3", e => {
      // $ExpectType boolean
      e.c
    });

    // $ExpectType TestClass
    component[method]({
      evt1: e => {
        // $ExpectType number
        e.a;
      },
      evt2: (arg0, arg1) => {
        // $ExpectType string
        arg0.b

        // $ExpectType boolean
        arg1
      },
    })
  });
});

test("Correct off() usage", () => {
  // $ExpectType TestClass
  component.off();

  // $ExpectType TestClass
  component.off("evt1");

  // $ExpectType TestClass
  component.off("evt1", e => {
    // $ExpectType number
    e.a;
  });

  // $ExpectType TestClass
  component.off({
    evt1: e => {
      // $ExpectType number
      e.a;
    },
    evt2: (arg0, arg1) => {
      // $ExpectType string
      arg0.b

      // $ExpectType boolean
      arg1
    },
  })
});

test("Default props check", () => {
  ["on", "once"].forEach((method: "on" | "once") => {
    // $ExpectType TestClass
    component[method]("evt1", () => {});

    // $ExpectType TestClass
    component[method]("evt1", e => {
      // $ExpectType TestClass
      e.currentTarget

      // $ExpectType string
      e.eventType

      // $ExpectType () => void
      e.stop
    });

    // $ExpectType TestClass
    component[method]("evt2", (arg0) => {});

    // $ExpectType TestClass
    component[method]("evt2", (arg0, arg1) => {
      // $ExpectType TestClass
      arg0.currentTarget

      // $ExpectType string
      arg0.eventType

      // $ExpectType () => void
      arg0.stop
    });

    // $ExpectType TestClass
    component[method]("evt3", () => {});

    // $ExpectType TestClass
    component[method]("evt3", e => {
      // $ExpectType TestClass
      e.currentTarget

      // $ExpectType string
      e.eventType

      // $ExpectType () => void
      e.stop

      return false;
    });

    // $ExpectType TestClass
    component[method]("evt4", e => {
      // $ExpectType TestClass
      e.currentTarget
    });
  });
});

test("hasOn has correct type", () => {
  // $ExpectType boolean
  component.hasOn("evt1");

  // $ExpectType boolean
  component.hasOn("evt2");

  // $ExpectType boolean
  component.hasOn("evt3");
});

// ❌
test("Wrong event definitions", () => {
  // $ExpectError
  class SomeWrongClass extends Component<{
    evt1: number;
  }> {};

  // $ExpectError
  class SomeWrongClass2 extends Component<{
    evt1: (arg0: number) => void;
  }> {};
});

test("Should show error when calling method with not defined event name", () => {
  class NotDefinedClass extends Component<{ b: { prop: number } }> {};

  // $ExpectError
  new NotDefinedClass().trigger("a");

  // $ExpectError
  new NotDefinedClass().on("a", e => {});

  // $ExpectError
  new NotDefinedClass().once("a", e => {});

  // $ExpectError
  new NotDefinedClass().off("a", e => {});
});

test("Wrong trigger() usage", () => {
  // $ExpectError
  component.trigger();

  // $ExpectError
  component.trigger("evt1");

  // $ExpectError
  component.trigger("evt1", 1);

  // $ExpectError
  component.trigger("evt2", { b: "" });

  // $ExpectError
  component.trigger("evt3", { c: true }, 123);

  // $ExpectError
  component.trigger("evt4", { a : 1 });

  // $ExpectError
  component.trigger("evt4", 1);
});

test("Wrong on, once usage", () => {
  ["on", "once"].forEach((method: "on" | "once") => {
    // $ExpectError
    component[method]();

    component[method]("evt1", e => {
      // $ExpectError
      e.propThatNotExist;
    });

    // $ExpectError
    component[method]("evt1", (e, argThatNotExist) => {});

    // $ExpectError
    component[method]("evt2", (arg0, arg1, argThatNotExist) => {});

    // $ExpectError
    component[method]("evt3");
  });
});

test("Wrong off usage", () => {
  // $ExpectError
  component.off("event-that-not-exist");

  // $ExpectError
  component.off("evt1", (e, argThatNotExist) => {});
});

test("Wrong hasOn() usage", () => {
  // $ExpectError
  component.hasOn();

  // $ExpectError
  component.hasOn("evt-that-dont-exist");
});
