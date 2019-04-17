// extracted from non-functioning date-fns locale, edited for understanding,
// cut down to what I need (essentially for DatePicker to work!)
// likely to be a lot more cutting down I can do now it works

import formatDistance from './_lib/formatDistance/index';
import formatLong from './_lib/formatLong/index';
import formatRelative from './_lib/formatRelative/index';
import localize from './_lib/localize/index';
import match from './_lib/match/index';

/**
 * @type {Locale}
 * @category Locales
 * @summary Czech locale.
 * @language Czech
 * @iso-639-2 ces
 * @author David Rus [@davidrus]{@link https://github.com/davidrus}
 * @author Pavel Hrách [@SilenY]{@link https://github.com/SilenY}
 */

const locale = {
  formatDistance,
  formatLong,
  formatRelative,
  localize,
  match,
  options: {
    weekStartsOn: 1, /* Monday */
    firstWeekContainsDate: 4,
  },
};

export default locale;
