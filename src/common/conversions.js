// Utility functions related to converting data (mostly date and time formats)

const isValidDate = (date) => {
  return Boolean(date && Object.prototype.toString.call(date) === '[object Date]' && !Number.isNaN(date));
};

// For event dates - does not need to take timezones into account as only the
// date is stored (as a string). Do not use for timestamps (create/update).
// convert JS Date to YYYY-MM-DD
export const dateToDateString = (date) => {
  if (!isValidDate(date)) return 'invalid date';
  // console.log('date:', date);
  const yyyy = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString(); // correct for zero-base
  const mm = (month.length === 1) ? `0${month}` : month;
  const day = date.getDate().toString();
  const dd = (day.length === 1) ? `0${day}` : day;
  const dateString = `${yyyy}-${mm}-${dd}`;
  // console.log('dateString from date:', dateString, date);
  return dateString;
};

// For event dates - does not need to take timezones into account as only the
// date is stored (as a string). Do not use for timestamps (create/update).
// convert YYYY-MM-DD to JS Date
export const dateStringToDate = (dateString) => {
  // console.log('dateString:', dateString);
  const year = parseInt(dateString.slice(0, 4), 10);
  const month = parseInt(dateString.slice(5, 7), 10);
  const day = parseInt(dateString.slice(-2), 10);
  const date = new Date(year, month - 1, day);
  // console.log('date from dateString:', date, dateString);
  return date;
};

// convert YYYY-MM-DDThh:mm:ss.xxxZ to DD/MM/YYYY
// e.g. '2019-05-15T05:41:44.478Z' to '15/05/2019' (en-GB) or '15. 5. 2019' (cs)
export const reformatTimestampDateOnly = (timestamp, locale = 'default') => {
  if (!timestamp) return null;
  let localeToUse = locale;
  if (locale === 'en') localeToUse = 'en-GB';
  const newDate = new Date(timestamp);
  // const locale = 'default';
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };
  let reformattedTimestamp = new Intl.DateTimeFormat(localeToUse, options).format(newDate);
  // strip leading 0 from day and month which en-GB locale provides
  if (locale === 'en') {
    // console.log('reformattedTimestamp', reformattedTimestamp);
    const parts = reformattedTimestamp.split('/');
    // console.log('parts', parts);
    const newParts = parts.map(part => part.replace(/^0+/, ''));
    // console.log('newParts', newParts);
    reformattedTimestamp = newParts.join('/');
  }
  return reformattedTimestamp;
};

// convert YYYY-MM-DDThh:mm:ss.xxxZ to locale version
// e.g. en-GB '2019-05-15T05:41:44.478Z' to '15/05/2019, 07:41'
// e.g. cs '2019-05-15T05:41:44.478Z' to '15. 5. 2019 07:41'
export const reformatTimestamp = (timestamp, locale = 'default') => {
  if (!timestamp) return null;
  let localeToUse = locale;
  if (locale === 'en') localeToUse = 'en-GB';
  const newDate = new Date(timestamp);
  const options = {
    hour: '2-digit',
    minute: '2-digit',
  };
  const time = new Intl.DateTimeFormat(localeToUse, options).format(newDate);
  const date = reformatTimestampDateOnly(timestamp, locale);
  // console.log('time, date', time, date);
  const reformattedTimestamp = date.concat(' ').concat(time);
  return reformattedTimestamp;
};

// simplify a string for more effective filtering (eliminate upper case and diacritics)
export const simplifyString = (string) => {
  let newString = string.toLowerCase();
  // covers Czech, French, German, Norwegian, Swedish, Welsh for now
  newString = newString.replace(new RegExp('[áàäåâ]', 'g'), 'a');
  newString = newString.replace(new RegExp('[čç]', 'g'), 'c');
  newString = newString.replace(new RegExp('ď', 'g'), 'd');
  newString = newString.replace(new RegExp('[éěèêë]', 'g'), 'e');
  newString = newString.replace(new RegExp('[íìîï]', 'g'), 'i');
  newString = newString.replace(new RegExp('ň', 'g'), 'n');
  newString = newString.replace(new RegExp('[óöøòô]', 'g'), 'o');
  newString = newString.replace(new RegExp('ř', 'g'), 'r');
  newString = newString.replace(new RegExp('š', 'g'), 's');
  newString = newString.replace(new RegExp('ť', 'g'), 't');
  newString = newString.replace(new RegExp('[úůùüû]', 'g'), 'u');
  newString = newString.replace(new RegExp('[ŵẃẁẅ]', 'g'), 'w');
  newString = newString.replace(new RegExp('[ýŷỳÿ]', 'g'), 'y');
  newString = newString.replace(new RegExp('ž', 'g'), 'z');
  return newString;
};
