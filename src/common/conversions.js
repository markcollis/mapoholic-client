// convert JS Date to YYYY-MM-DD
export const dateToDateString = (date) => {
  console.log('date:', date);
  const yyyy = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString(); // correct for zero-base
  const mm = (month.length === 1) ? `0${month}` : month;
  const day = date.getDate().toString();
  const dd = (day.length === 1) ? `0${day}` : day;
  const dateString = `${yyyy}-${mm}-${dd}`;
  console.log('dateString:', dateString);
  return dateString;
};

// convert YYYY-MM-DD to JS Date
export const dateStringToDate = (dateString) => {
  console.log('dateString:', dateString);
  const year = parseInt(dateString.slice(0, 4), 10);
  const month = parseInt(dateString.slice(5, 7), 10);
  const day = parseInt(dateString.slice(-2), 10);
  const date = new Date(year, month - 1, day);
  console.log('date:', date);
  return date;
};
