Object.defineProperty(exports, '__esModule', {
  value: true,
});

function findKey(object, predicate) {
  Object.keys(object).forEach((key) => {
    if (predicate(object[key])) {
      return key;
    }
    return null;
  }).filter(key => !!key);
}

function buildMatchFn(args) {
  return function build(dirtyString, dirtyOptions) {
    const string = String(dirtyString);
    const options = dirtyOptions || {};
    const { width } = options;
    const matchPattern = (width) ? args[width] : args[args.defaultMatchWidth];
    const matchResult = string.match(matchPattern);
    if (!matchResult) {
      return null;
    }
    const matchedString = matchResult[0];

    const parsePatterns = (width) ? args[width] : args[args.defaultParseWidth];
    let value;
    if (Object.prototype.toString.call(parsePatterns) === '[object Array]') {
      value = parsePatterns.findIndex(pattern => pattern.test(string));
    } else {
      value = findKey(parsePatterns, pattern => pattern.test(string));
    }
    value = args.valueCallback ? args.valueCallback(value) : value;
    value = options.valueCallback ? options.valueCallback(value) : value;

    return {
      value,
      rest: string.slice(matchedString.length),
    };
  };
}

module.exports = buildMatchFn;
