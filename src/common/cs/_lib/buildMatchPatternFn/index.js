Object.defineProperty(exports, '__esModule', {
  value: true,
});
function buildMatchPatternFn(args) {
  return function build(dirtyString, dirtyOptions) {
    const string = String(dirtyString);
    const options = dirtyOptions || {};

    const matchResult = string.match(args.matchPattern);
    if (!matchResult) {
      return null;
    }
    const matchedString = matchResult[0];

    const parseResult = string.match(args.parsePattern);
    if (!parseResult) {
      return null;
    }
    let value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;

    return {
      value,
      rest: string.slice(matchedString.length),
    };
  };
}
module.exports = buildMatchPatternFn;
