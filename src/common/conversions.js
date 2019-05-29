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

// convert YYYY-MM-DD to DD/MM/YYYY
export const reformatDate = (dateString) => {
  const reformattedDate = dateString.slice(8)
    .concat('/')
    .concat(dateString.slice(5, 7))
    .concat('/')
    .concat(dateString.slice(0, 4));
  return reformattedDate;
};

// convert YYYY-MM-DDThh:mm:ss.xxxZ to DD/MM/YYYY hh:mm
// e.g. '2019-05-15T05:41:44.478Z' to '15/05/2019 07:41'
export const reformatTimestamp = (timestamp) => {
  const newDate = new Date(timestamp);
  const reformattedTimestamp = newDate.toLocaleString().split(',').join('').slice(0, -3);
  // console.log('newDate:', newDate, 'from', timestamp);
  // console.log('reformattedTimestamp:', reformattedTimestamp);
  return reformattedTimestamp;
};

// convert YYYY-MM-DDThh:mm:ss.xxxZ to DD/MM/YYYY
// e.g. '2019-05-15T05:41:44.478Z' to '15/05/2019'
export const reformatTimestampDateOnly = (timestamp) => {
  const newDate = new Date(timestamp);
  const reformattedTimestamp = newDate.toLocaleString().split(',')[0];
  return reformattedTimestamp;
};
