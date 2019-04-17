Object.defineProperty(exports, '__esModule', {
  value: true,
});

const index = require('../buildLocalizeFn/index.js');
const index3 = require('../buildLocalizeArrayFn/index.js');

function interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
const index2 = interopRequireDefault(index);
const index4 = interopRequireDefault(index3);

const weekdayValues = {
  narrow: ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'],
  short: ['ned', 'pon', 'úte', 'stř', 'čtv', 'pát', 'sob'],
  long: ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'],
  defaultWidth: 'short',
};

const monthValues = {
  short: ['led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro'],
  long: ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'],
  defaultWidth: 'long',
};

const timeOfDayValues = {
  uppercase: ['DOP.', 'ODP.'],
  lowercase: ['dop.', 'odp.'],
  long: ['dopoledne', 'odpoledne'],
  defaultWidth: 'lowercase',
};

function ordinalNumber(dirtyNumber) {
  const number = Number(dirtyNumber);
  return `${number}.`;
}

const localize = {
  ordinalNumber,
  day: (0, index2.default)(weekdayValues, 'long'),
  days: (0, index4.default)(weekdayValues, 'long'),
  weekday: (0, index2.default)(weekdayValues, 'long'),
  weekdays: (0, index4.default)(weekdayValues, 'long'),
  month: (0, index2.default)(monthValues, 'long'),
  months: (0, index4.default)(monthValues, 'long'),
  timeOfDay: (0, index2.default)(timeOfDayValues, 'long', (hours) => {
    return hours / 12 >= 1 ? 1 : 0;
  }),
  timesOfDay: (0, index4.default)(timeOfDayValues, 'long'),
};

module.exports = localize;
