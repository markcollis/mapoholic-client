// Set global configuration variables that can not be changed by users
// *** configuration that can be changed by users (e.g. language) is managed
// in the config reducer ***

// console.logs server response to every API call made
export const LOG_API_CALLS = true;

// API
// export const MAPOHOLIC_SERVER = 'https://mapoholic-api.markcollis.dev';

// crius on Wifi (Seven)
// export const MAPOHOLIC_SERVER = 'https://192.168.0.15:3090';
// export const MAPOHOLIC_SERVER = 'http://192.168.0.15:3090';

// crius as localhost if no internet connection and using a local test DB
export const MAPOHOLIC_SERVER = 'http://localhost:3090';

// Tile set and credit for Leaflet maps (OpenStreetMap)
// (used in EventMap, EventLocationMap, EventEditLocationMap components)
export const MAP_TILES = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const MAP_CREDIT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// another alternative map source
// export const MAP_TILES = 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png';
// export const MAP_CREDIT = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

// Number of activities to show in HomeRecent
export const DEFAULT_ACTIVITY_LENGTH = 10;
