const makeCancellable = (anyFunction) => {
  let cancelled = false;
  return {
    promise: inputs => new Promise((resolve, reject) => {
      if (cancelled) {
        anyFunction = null;
      } else {
        anyFunction(inputs);
        resolve(inputs);
      }
    }),
    cancel() {
      cancelled = true;
    },
  };
};

export default makeCancellable;
