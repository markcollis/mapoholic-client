// Set global configuration variables that can not be changed by users
// *** configuration that can be changed by users (e.g. language) is managed
// in the config reducer ***

// API
export const MAPOHOLIC_SERVER = 'https://mapoholic-api.markcollis.dev';

// Tile set and credit for Leaflet maps (OpenStreetMap)
// (used in EventMap, EventLocationMap, EventEditLocationMap components)
export const MAP_TILES = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const MAP_CREDIT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// another alternative map source
// export const MAP_TILES = 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png';
// export const MAP_CREDIT = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

// Number of activities to show in HomeRecent
export const DEFAULT_ACTIVITY_LENGTH = 10;

// current version number (update with every release)
export const MAPOHOLIC_VERSION = '1.0.0';
// year current version created (update as required)
export const MAPOHOLIC_VERSION_YEAR = '2019';
