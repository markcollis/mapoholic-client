Object.defineProperty(exports, '__esModule', {
  value: true,
});

function declensionGroup(scheme, count) {
  if (count === 1) {
    return scheme.one;
  }

  if (count >= 2 && count <= 4) {
    return scheme.twoFour;
  }

  // if count === null || count === 0 || count >= 5
  return scheme.other;
}

function declension(scheme, count, time) {
  const group = declensionGroup(scheme, count);
  const finalText = group[time] || group;
  return finalText.replace('{{count}}', count);
}

function extractPreposition(token) {
  const result = ['lessThan', 'about', 'over', 'almost'].filter((preposition) => {
    return !!token.match(new RegExp(`^${preposition}`));
  });
  return result[0];
}

function prefixPreposition(preposition) {
  let translation = '';
  if (preposition === 'almost') {
    translation = 'skoro';
  }
  if (preposition === 'about') {
    translation = 'přibližně';
  }
  return (translation.length > 0) ? `${translation} ` : '';
}

function suffixPreposition(preposition) {
  let translation = '';
  if (preposition === 'lessThan') {
    translation = 'méně než';
  }
  if (preposition === 'over') {
    translation = 'více než';
  }
  return (translation.length) > 0 ? `${translation} ` : '';
}

function lowercaseFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

const formatDistanceLocale = {
  xSeconds: {
    one: {
      regular: 'vteřina',
      past: 'vteřinou',
      future: 'vteřinu',
    },
    twoFour: {
      regular: '{{count}} vteřiny',
      past: '{{count}} vteřinami',
      future: '{{count}} vteřiny',
    },
    other: {
      regular: '{{count}} vteřin',
      past: '{{count}} vteřinami',
      future: '{{count}} vteřin',
    },
  },
  halfAMinute: {
    other: {
      regular: 'půl minuty',
      past: 'půl minutou',
      future: 'půl minuty',
    },
  },
  xMinutes: {
    one: {
      regular: 'minuta',
      past: 'minutou',
      future: 'minutu',
    },
    twoFour: {
      regular: '{{count}} minuty',
      past: '{{count}} minutami',
      future: '{{count}} minuty',
    },
    other: {
      regular: '{{count}} minut',
      past: '{{count}} minutami',
      future: '{{count}} minut',
    },
  },
  xHours: {
    one: {
      regular: 'hodina',
      past: 'hodinou',
      future: 'hodinu',
    },
    twoFour: {
      regular: '{{count}} hodiny',
      past: '{{count}} hodinami',
      future: '{{count}} hodiny',
    },
    other: {
      regular: '{{count}} hodin',
      past: '{{count}} hodinami',
      future: '{{count}} hodin',
    },
  },
  xDays: {
    one: {
      regular: 'den',
      past: 'dnem',
      future: 'den',
    },
    twoFour: {
      regular: '{{count}} dni',
      past: '{{count}} dny',
      future: '{{count}} dny',
    },
    other: {
      regular: '{{count}} dní',
      past: '{{count}} dny',
      future: '{{count}} dní',
    },
  },
  xMonths: {
    one: {
      regular: 'měsíc',
      past: 'měsícem',
      future: 'měsíc',
    },
    twoFour: {
      regular: '{{count}} měsíce',
      past: '{{count}} měsíci',
      future: '{{count}} měsíce',
    },
    other: {
      regular: '{{count}} měsíců',
      past: '{{count}} měsíci',
      future: '{{count}} měsíců',
    },
  },
  xYears: {
    one: {
      regular: 'rok',
      past: 'rokem',
      future: 'rok',
    },
    twoFour: {
      regular: '{{count}} roky',
      past: '{{count}} roky',
      future: '{{count}} roky',
    },
    other: {
      regular: '{{count}} roků',
      past: '{{count}} roky',
      future: '{{count}} roků',
    },
  },
};

function formatDistance(token, count, options = {}) {
  const preposition = extractPreposition(token) || '';
  const key = lowercaseFirstLetter(token.substring(preposition.length));
  const scheme = formatDistanceLocale[key];
  if (!options.addSuffix) {
    return prefixPreposition(preposition) + suffixPreposition(preposition) + declension(scheme, count, 'regular');
  }
  if (options.comparison > 0) {
    return `${prefixPreposition(preposition)}za ${suffixPreposition(preposition)}${declension(scheme, count, 'future')}`;
  }
  return `${prefixPreposition(preposition)}před ${suffixPreposition(preposition)}${declension(scheme, count, 'past')}`;
}
module.exports = formatDistance;
