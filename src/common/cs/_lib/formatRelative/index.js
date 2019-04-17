Object.defineProperty(exports, '__esModule', {
  value: true,
});

const formatRelativeLocale = {
  lastWeek: '[last] dddd [at] LT',
  yesterday: '[yesterday at] LT',
  today: '[today at] LT',
  tomorrow: '[tomorrow at] LT',
  nextWeek: 'dddd [at] LT',
  other: 'L',
};

function formatRelative(token) {
  return formatRelativeLocale[token];
}

module.exports = formatRelative;
