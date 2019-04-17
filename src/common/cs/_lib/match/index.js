Object.defineProperty(exports, '__esModule', {
  value: true,
});

const index = require('../buildMatchFn/index.js');
const index3 = require('../buildParseFn/index.js');
const index5 = require('../buildMatchPatternFn/index.js');
const index7 = require('../parseDecimal/index.js');

function interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
const index2 = interopRequireDefault(index);
const index4 = interopRequireDefault(index3);
const index6 = interopRequireDefault(index5);
const index8 = interopRequireDefault(index7);

const matchOrdinalNumbersPattern = /^(\d+)(th|st|nd|rd)?/i;

const matchWeekdaysPatterns = {
  narrow: /^(su|mo|tu|we|th|fr|sa)/i,
  short: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  long: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i,
  defaultMatchWidth: 'short',
};

const parseWeekdayPatterns = {
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i],
  defaultParseWidth: 'any',
};

const matchMonthsPatterns = {
  short: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  long: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i,
  defaultMatchWidth: 'short',
};

const parseMonthPatterns = {
  any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i],
  defaultParseWidth: 'any',
};

const matchTimesOfDayPatterns = {
  short: /^(am|pm)/i,
  long: /^([ap]\.?\s?m\.?)/i,
  defaultMatchWidth: 'short',
};

const parseTimeOfDayPatterns = {
  any: [/^a/i, /^p/i],
  defaultParseWidth: 'any',
};

const match = {
  ordinalNumbers: (0, index6.default)(matchOrdinalNumbersPattern),
  ordinalNumber: index8.default,
  weekdays: (0, index2.default)(matchWeekdaysPatterns, 'long'),
  weekday: (0, index4.default)(parseWeekdayPatterns, 'any'),
  months: (0, index2.default)(matchMonthsPatterns, 'long'),
  month: (0, index4.default)(parseMonthPatterns, 'any'),
  timesOfDay: (0, index2.default)(matchTimesOfDayPatterns, 'long'),
  timeOfDay: (0, index4.default)(parseTimeOfDayPatterns, 'any'),
};

module.exports = match;
