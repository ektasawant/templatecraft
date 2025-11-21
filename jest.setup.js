if (typeof window !== "undefined") {
  Object.defineProperty(window, "localStorage", {
    value: window.localStorage,
    configurable: true,
  });
}
