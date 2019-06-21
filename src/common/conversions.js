// For event dates - does not need to take timezones into account as only the
// date is stored (as a string). Do not use for timestamps (create/update).
// convert JS Date to YYYY-MM-DD
export const dateToDateString = (date) => {
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

// convert YYYY-MM-DD to (D)D/(M)M/YYYY
export const reformatDate = (dateString) => {
  const day = (dateString.charAt(8) === '0') ? dateString.charAt(9) : dateString.slice(8);
  const month = (dateString.charAt(5) === '0') ? dateString.charAt(6) : dateString.slice(5, 7);
  const year = dateString.slice(0, 4);
  const reformattedDate = day.concat('/').concat(month).concat('/').concat(year);
  return reformattedDate;
};

// convert YYYY-MM-DDThh:mm:ss.xxxZ to DD/MM/YYYY
// e.g. '2019-05-15T05:41:44.478Z' to '15/05/2019' (en-GB) or '15. 5. 2019' (cs)
export const reformatTimestampDateOnly = (timestamp, locale = 'default') => {
  const newDate = new Date(timestamp);
  // const locale = 'default';
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };
  const reformattedTimestamp = new Intl.DateTimeFormat(locale, options).format(newDate);
  return reformattedTimestamp;
  // const today = new Date();
  // const yesterday = (new Date()).setDate(today.getDate() - 1);
  // const todayString = <Trans>today</Trans>;
  // const yesterdayString = <Trans>yesterday</Trans>;
  // const reformattedToday = new Intl.DateTimeFormat(locale, options).format(today);
  // const reformattedYesterday = new Intl.DateTimeFormat(locale, options).format(yesterday);
  // let output = reformattedTimestamp;
  // if (reformattedTimestamp === reformattedToday) output = todayString;
  // if (reformattedTimestamp === reformattedYesterday) output = yesterdayString;
  // return output;
};

// convert YYYY-MM-DDThh:mm:ss.xxxZ to locale version
// e.g. en-GB '2019-05-15T05:41:44.478Z' to '15/05/2019, 07:41'
// e.g. cs '2019-05-15T05:41:44.478Z' to '15. 5. 2019 07:41'
export const reformatTimestamp = (timestamp, locale = 'default') => {
  const newDate = new Date(timestamp);
  const options = {
    hour: '2-digit',
    minute: '2-digit',
  };
  const time = new Intl.DateTimeFormat(locale, options).format(newDate);
  const date = reformatTimestampDateOnly(timestamp, locale);
  // console.log('time, date', time, date);
  const reformattedTimestamp = date.concat(' ').concat(time);
  return reformattedTimestamp;

  // if (navigator.language === 'en-GB') { // manual adjustment as en-GB doesn't have the exact format I want...
  //   const day = (intlTimestamp.charAt(0) === '0') ? intlTimestamp.charAt(1) : intlTimestamp.slice(0, 2);
  //   const month = (intlTimestamp.charAt(3) === '0') ? intlTimestamp.charAt(4) : intlTimestamp.slice(3, 5);
  //   const year = intlTimestamp.slice(6, 10);
  //   const time = intlTimestamp.slice(-6);
  //   reformattedTimestamp = day
  //     .concat('/')
  //     .concat(month)
  //     .concat('/')
  //     .concat(year)
  //     .concat(time);
  // } else {
  //   reformattedTimestamp = intlTimestamp;
  // }
};

// convert YYYY-MM-DDThh:mm:ss.xxxZ to locale version
// e.g. en-GB '2019-05-15T05:41:44.478Z' to '15/05/2019, 07:41'
// e.g. cs '2019-05-15T05:41:44.478Z' to '15. 5. 2019 07:41'
// export const reformatTimestamp = (timestamp) => {
//   const newDate = new Date(timestamp);
//   const options = {
//     year: 'numeric',
//     month: 'numeric',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//   };
//   const intlTimestamp = new Intl.DateTimeFormat('default', options).format(newDate);
//   let reformattedTimestamp;
//   if (navigator.language === 'en-GB') { // manual adjustment as en-GB doesn't have the exact format I want...
//     const day = (intlTimestamp.charAt(0) === '0') ? intlTimestamp.charAt(1) : intlTimestamp.slice(0, 2);
//     const month = (intlTimestamp.charAt(3) === '0') ? intlTimestamp.charAt(4) : intlTimestamp.slice(3, 5);
//     const year = intlTimestamp.slice(6, 10);
//     const time = intlTimestamp.slice(-6);
//     reformattedTimestamp = day
//       .concat('/')
//       .concat(month)
//       .concat('/')
//       .concat(year)
//       .concat(time);
//   } else {
//     reformattedTimestamp = intlTimestamp;
//   }
//   return reformattedTimestamp;
// };


// convert YYYY-MM-DDThh:mm:ss.xxxZ to DD/MM/YYYY
// e.g. '2019-05-15T05:41:44.478Z' to '15/05/2019'
// export const reformatTimestampDateOnly = (timestamp) => {
//   const newDate = new Date(timestamp);
//   const reformattedTimestamp = newDate.toLocaleString().split(',')[0];
//   return reformattedTimestamp;
// };
