Object.defineProperty(exports, '__esModule', {
  value: true,
});

const index = require('../buildFormatLongFn/index.js');

function interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
const index2 = interopRequireDefault(index);

const formatLong = (0, index2.default)({
  LT: 'h:mm aa',
  LTS: 'h:mm:ss aa',
  L: 'MM/DD/YYYY',
  LL: 'MMMM D YYYY',
  LLL: 'MMMM D YYYY h:mm aa',
  LLLL: 'dddd, MMMM D YYYY h:mm aa',
  defaultWidth: 'LLLL',
});

exports.default = formatLong;
