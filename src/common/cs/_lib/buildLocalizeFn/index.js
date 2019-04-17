Object.defineProperty(exports, '__esModule', {
  value: true,
});

function buildLocalizeFn(args) {
  return function build(dirtyIndex, dirtyOptions) {
    // console.log('dirtyOptions:', dirtyOptions);
    const options = dirtyOptions || {};
    const width = options.width ? String(options.width) : args.defaultWidth;
    // const width = options.width ? String(options.width) : 'long';
    const context = options.context ? String(options.context) : 'standalone';

    let valuesArray;
    if (context === 'formatting' && args.formattingValues) {
      valuesArray = args.formattingValues[width]
        || args.formattingValues[args.defaultFormattingWidth];
    } else {
      // console.log('args:', args);
      valuesArray = (args[width]) ? args[width] : args[args.defaultWidth];
      // ? args.values[width] || args.values[args.defaultWidth]
      // : ['temp'];
    }
    const index = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex;
    return valuesArray[index];
  };
}
module.exports = buildLocalizeFn;
