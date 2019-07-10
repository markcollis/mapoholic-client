export const FILETYPE_ACCEPT = {
  image: '.jpg, .jpeg, .png, image/jpeg, image/png',
  results: '.csv, .json, text/csv, application/json',
};

export const FILETYPE_MIME = {
  image: ['image/jpeg', 'image/png'],
  results: ['text/csv', 'application/vnd.ms-excel', 'application/json'],
};
// application/vnd.ms-excel is reported for CSV files by Windows...

export const TEMPLATE = [
  {
    place: '1.',
    sort: '1',
    name: 'The Winner',
    regNumber: 'ABC1111',
    clubShort: 'ABC',
    // club: 'ABC Orienteers',
    time: '13:31',
    loss: '',
  },
  {
    place: '2.',
    sort: '2',
    name: 'Runner Up',
    regNumber: 'ABC2222',
    clubShort: 'ABC',
    // club: 'ABC Orienteers',
    time: '13:58',
    loss: '+ 0:27',
  },
  {
    place: '3.',
    sort: '3',
    name: 'Third Place',
    regNumber: 'XYZ3333',
    clubShort: 'XYZ',
    // club: 'XYZ Orienteering Club',
    time: '14:44',
    loss: '+ 1:13',
  },
  {
    place: '4.',
    sort: '4',
    name: 'Got Lost',
    regNumber: 'NSF4444',
    clubShort: 'NSF',
    // club: 'Not So Fast',
    time: '23:39',
    loss: '+ 10:08',
  },
];
