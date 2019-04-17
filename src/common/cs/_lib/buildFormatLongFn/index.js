Object.defineProperty(exports, '__esModule', {
  value: true,
});

function buildFormatLongFn(args) {
  return function build(dirtyOptions) {
    const options = dirtyOptions || {};
    const width = options.width ? String(options.width) : args.defaultWidth;
    const format = args[width] || args[args.defaultWidth];
    return format;
  };
}
module.exports = buildFormatLongFn;
