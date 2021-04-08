// Single source for constants used to prompt/validate form input

export type Option = {
  value: string;
  label: string;
};
export type LocaleOptions = {
  [key: string]: Option[];
};

export const countryCodesConversion: { [key: string]: string } = { // for flag icons
  AUS: 'au',
  AUT: 'at',
  BEL: 'be',
  BGR: 'bg',
  CAN: 'ca',
  CZE: 'cz',
  DEN: 'dk',
  ESP: 'es',
  EST: 'ee',
  FIN: 'fi',
  FRA: 'fr',
  GBR: 'uk',
  GER: 'de',
  HRV: 'hr',
  HUN: 'hu',
  IRL: 'ie',
  ITA: 'it',
  LAT: 'lv',
  LTU: 'lt',
  NED: 'nl',
  NOR: 'no',
  NZL: 'nz',
  POL: 'pl',
  POR: 'pt',
  ROU: 'ro',
  RSA: 'za',
  RUS: 'ru',
  SLO: 'si',
  SUI: 'ch',
  SRB: 'rs',
  SVK: 'sk',
  UKR: 'ua',
  SWE: 'se',
  USA: 'us',
};

export const countryOptions: Option[] = [ // limited set of IOF member countries for now
  { value: 'AUS', label: 'AUS: Australia' },
  { value: 'AUT', label: 'AUT: Austria' },
  { value: 'BEL', label: 'BEL: Belgium' },
  { value: 'BGR', label: 'BUL: Bulgaria' }, // ISO is BGR but BUL is used for sport
  { value: 'CAN', label: 'CAN: Canada' },
  { value: 'HRV', label: 'CRO: Croatia' }, // ISO is HRV but CRO is used for sport
  { value: 'CZE', label: 'CZE: Czech Republic' },
  { value: 'DEN', label: 'DEN: Denmark' },
  { value: 'ESP', label: 'ESP: Spain' },
  { value: 'EST', label: 'EST: Estonia' },
  { value: 'FIN', label: 'FIN: Finland' },
  { value: 'FRA', label: 'FRA: France' },
  { value: 'GBR', label: 'GBR: United Kingdom' },
  { value: 'GER', label: 'GER: Germany' },
  { value: 'HUN', label: 'HUN: Hungary' },
  { value: 'IRL', label: 'IRL: Ireland' },
  { value: 'ITA', label: 'ITA: Italy' },
  { value: 'LAT', label: 'LAT: Latvia' },
  { value: 'LTU', label: 'LTU: Lithuania' },
  { value: 'NED', label: 'NED: Netherlands' },
  { value: 'NOR', label: 'NOR: Norway' },
  { value: 'NZL', label: 'NZL: New Zealand' },
  { value: 'POL', label: 'POL: Poland' },
  { value: 'POR', label: 'POR: Portugal' },
  { value: 'ROU', label: 'ROU: Romania' },
  { value: 'RSA', label: 'RSA: South Africa' },
  { value: 'RUS', label: 'RUS: Russia' },
  { value: 'SRB', label: 'SRB: Serbia' },
  { value: 'SLO', label: 'SLO: Slovenia' },
  { value: 'SUI', label: 'SUI: Switzerland' },
  { value: 'SVK', label: 'SVK: Slovakia' },
  { value: 'SWE', label: 'SWE: Sweden' },
  { value: 'UKR', label: 'UKR: Ukraine' },
  { value: 'USA', label: 'USA: United States of America' },
];
export const countryOptionsLocale: LocaleOptions = {
  en: countryOptions,
  cs: [
    { value: 'AUS', label: 'AUS: Austrálie' },
    { value: 'AUT', label: 'AUT: Rakousko' },
    { value: 'BEL', label: 'BEL: Belgie' },
    { value: 'BGR', label: 'BUL: Bulharsko' },
    { value: 'CAN', label: 'CAN: Kanada' },
    { value: 'HRV', label: 'CRO: Chorvatsko' },
    { value: 'CZE', label: 'CZE: Česká Republika' },
    { value: 'DEN', label: 'DEN: Dánsko' },
    { value: 'ESP', label: 'ESP: Španělsko' },
    { value: 'EST', label: 'EST: Estonsko' },
    { value: 'FIN', label: 'FIN: Finsko' },
    { value: 'FRA', label: 'FRA: Francie' },
    { value: 'GBR', label: 'GBR: Spojené Království' },
    { value: 'GER', label: 'GER: Německo' },
    { value: 'HUN', label: 'HUN: Maďarsko' },
    { value: 'IRL', label: 'IRL: Irsko' },
    { value: 'ITA', label: 'ITA: Itálie' },
    { value: 'LAT', label: 'LAT: Lotyšsko' },
    { value: 'LTU', label: 'LTU: Litva' },
    { value: 'NED', label: 'NED: Nizozemsko' },
    { value: 'NOR', label: 'NOR: Norsko' },
    { value: 'NZL', label: 'NZL: Nový Zéland' },
    { value: 'POL', label: 'POL: Polsko' },
    { value: 'POR', label: 'POR: Portugalsko' },
    { value: 'ROU', label: 'ROU: Rumunsko' },
    { value: 'RSA', label: 'RSA: Jihoafrická republika' },
    { value: 'RUS', label: 'RUS: Rusko' },
    { value: 'SRB', label: 'SRB: Srbsko' },
    { value: 'SLO', label: 'SLO: Slovinsko' },
    { value: 'SUI', label: 'SUI: Switzerland' },
    { value: 'SVK', label: 'SVK: Slovensko' },
    { value: 'SWE', label: 'SWE: Švédsko' },
    { value: 'UKR', label: 'UKR: Ukrajina' },
    { value: 'USA', label: 'USA: Spojené státy americké' },
  ],
};

export const regionOptionSets = { // keys to match countryOptions
  // complete as required and if appropriate to the country concerned
  AUS: [],
  AUT: [ // aligned with national provinces
    { value: 'BOLV', label: 'Burgenländischer OL-Verband (BOLV)' },
    { value: 'KOLV', label: 'Kärntner OL-Verband (KOLV)' },
    { value: 'NOLV', label: 'Niederösterreichischer OL-Verband (NOLV)' },
    { value: 'OÖ-OLV', label: 'Oberösterreichischer OL-Verband (OÖ-OLV)' },
    { value: 'SOLV', label: 'Salzburger OL-Verband (SOLV)' },
    { value: 'STOVL', label: 'Steirischer OL-Verband (STOLV)' },
    { value: 'TIFOL', label: 'Tiroler Fachverband f. OL (TIFOL)' },
    { value: 'V', label: 'Vorarlberg' }, // separate small province, joined with TIFOL
    { value: 'WOLV', label: 'Wiener OL-Verband (WOLV)' },
  ],
  BEL: [],
  BUL: [],
  CAN: [],
  CRO: [],
  CZE: [ // three levels - national, Čechy/Morava, kraj/adjacent kraje
    { value: 'Č', label: 'Čechy (Č)' },
    { value: 'ČR', label: 'Česká Republika (ČR)' },
    { value: 'HA', label: 'Hanácká (HA)' }, // Olomoucký +Bruntál (MS)
    { value: 'JČ', label: 'Jihočeská (JČ)' },
    { value: 'JE', label: 'Ještědská (JE)' }, // Liberecký, Ústecký
    { value: 'JM', label: 'Jihomoravská (JM)' },
    { value: 'M', label: 'Morava (M)' },
    { value: 'MSK', label: 'Moravskoslezský kraj (MSK)' },
    { value: 'P', label: 'Pražská (P)' },
    { value: 'StČ', label: 'Středočeská (StČ)' },
    { value: 'VA', label: 'Valašská (VA)' }, // Zlínský
    { value: 'VČ', label: 'Východočeská (VČ)' }, // Královéhradecký, Pardubický
    { value: 'VY', label: 'Vysočina (VY)' },
    { value: 'ZČ', label: 'Západočeská (ZČ)' }, // Karlovarský, Plzeňský
  ],
  DEN: [],
  ESP: [],
  EST: [],
  FIN: [],
  FRA: [],
  GBR: [ // NI, Scotland, Wales as complete home nations, England divided into regions
    { value: 'EAOA', label: 'East Anglia (EAOA)' },
    { value: 'EMOA', label: 'East Midlands (EMOA)' },
    { value: 'NEOA', label: 'North East (NEOA)' },
    { value: 'NIOA', label: 'Northern Ireland (NIOA)' },
    { value: 'NWOA', label: 'North West (NWOA)' },
    { value: 'SCOA', label: 'South Central (SCOA)' },
    { value: 'SEOA', label: 'South East (SEOA)' },
    { value: 'SOA', label: 'Scotland (SOA)' },
    { value: 'SWOA', label: 'South West (SWOA)' },
    { value: 'WMOA', label: 'West Midlands (WMOA)' },
    { value: 'WOA', label: 'Wales (WOA)' },
    { value: 'YHOA', label: 'Yorkshire & Humberside (YHOA)' },
  ],
  GER: [],
  HUN: [],
  IRL: [],
  ITA: [],
  LAT: [],
  LTU: [],
  NED: [],
  NOR: [],
  NZL: [],
  POL: [],
  POR: [],
  ROU: [],
  RSA: [],
  RUS: [],
  SRB: [],
  SLO: [],
  SUI: [],
  SVK: [],
  SWE: [],
  UKR: [],
  USA: [],
};
// no localisation necessary, region names are already in local language

export const roleOptions: Option[] = [
  { value: 'admin', label: 'Administrator' },
  { value: 'guest', label: 'Guest' },
  { value: 'standard', label: 'Standard' },
];
export const roleOptionsLocale: LocaleOptions = {
  en: roleOptions,
  cs: [
    { value: 'admin', label: 'Správce' },
    { value: 'guest', label: 'Host' },
    { value: 'standard', label: 'Standard' },
  ],
};

export const visibilityOptions: Option[] = [
  { value: 'public', label: 'public' },
  { value: 'all', label: 'all registered users' },
  { value: 'club', label: 'club members only' },
  { value: 'private', label: 'private' },
];
export const visibilityOptionsLocale: LocaleOptions = {
  en: visibilityOptions,
  cs: [
    { value: 'public', label: 'veřejnost' },
    { value: 'all', label: 'všichni uživateli' },
    { value: 'club', label: 'jenom členi klubů' },
    { value: 'private', label: 'soukromý' },
  ],
};

export const typesOptions: Option[] = [
  { value: 'Sprint', label: 'Sprint' }, // ORIS SP Sprint Sprint
  { value: 'Middle', label: 'Middle' }, // ORIS KT Middle Krátká trať
  { value: 'Long', label: 'Long' }, // ORIS KL Long Klasická trať
  { value: 'Ultra-Long', label: 'Ultra-Long' }, // ORIS DT Ultra-Long Dlouhá trať
  { value: 'Relay', label: 'Relay' }, // ORIS ST Relay Štafety
  { value: 'Night', label: 'Night' }, // ORIS NOB Night Noční (not combined with distance in ORIS)
  { value: 'Mass start', label: 'Mass start' }, // ORIS MS Mass start Hromadný start
  { value: 'Score', label: 'Score' },
  { value: 'Spanish Score', label: 'Spanish Score' },
  { value: 'MTBO', label: 'MTBO' }, // ORIS MTBO MTBO
  { value: 'SkiO', label: 'SkiO' }, // ORIS LOB SkiO
  { value: 'TrailO', label: 'TrailO' }, // ORIS TRAIL TrailO
  { value: 'TempO', label: 'TempO' }, // ORIS TeO TempO TempO
  { value: 'non-standard', label: 'non-standard' },
  // i.e. either training or an event with an unusual format (e.g. some EPOs)
];
export const typesOptionsLocale: LocaleOptions = {
  en: typesOptions,
  cs: [
    { value: 'Sprint', label: 'Sprint' }, // ORIS SP Sprint Sprint
    { value: 'Middle', label: 'Krátká trať' }, // ORIS KT Middle Krátká trať
    { value: 'Long', label: 'Klasická trať' }, // ORIS KL Long Klasická trať
    { value: 'Ultra-Long', label: 'Dlouhá trať' }, // ORIS DT Ultra-Long Dlouhá trať
    { value: 'Relay', label: 'Štafety' }, // ORIS ST Relay Štafety
    { value: 'Night', label: 'Noční' }, // ORIS NOB Night Noční (not combined with distance in ORIS)
    { value: 'Mass start', label: 'Hromadný start' }, // ORIS MS Mass start Hromadný start
    { value: 'Score', label: 'Scorelauf' },
    { value: 'Spanish Score', label: 'Volné pořadí' },
    { value: 'MTBO', label: 'MTBO' }, // ORIS MTBO MTBO
    { value: 'SkiO', label: 'SkiO' }, // ORIS LOB SkiO
    { value: 'TrailO', label: 'TrailO' }, // ORIS TRAIL TrailO
    { value: 'TempO', label: 'TempO' }, // ORIS TeO TempO TempO
    { value: 'non-standard', label: 'nestandardní' },
  ],
};

type ValidationErrorMessages = {
  invalidEmail: string;
  emailRequired: string;
  passwordLength: string;
  passwordCurrentRequired: string;
  passwordRequired: string;
  eventNameRequired: string;
  clubShortNameRequired: string;
  clubFullNameRequired: string;
  invalidLatLow: string;
  invalidLatHigh: string;
  invalidLongLow: string;
  invalidLongHigh: string;
  invalidUrl: string;
  eventLinkNameRequired: string;
};

// Localisation of Yup validation errors in components with Formik forms
export const validationErrorsLocale: { [key: string]: ValidationErrorMessages } = {
  en: {
    invalidEmail: 'You must provide a valid email address.', // Authenticate
    emailRequired: 'You must provide an email address.', // Authenticate
    passwordLength: 'Your password must be at least 8 characters long.', // Authenticate, UserChangePassword
    passwordCurrentRequired: 'You must confirm your current password.', // UserChangePassword
    passwordRequired: 'A password is required.', // Authenticate, UserChangePassword
    eventNameRequired: 'You must provide a name for the event.', // EventEdit
    clubShortNameRequired: 'You must provide the club\'s abbreviation or short name.', // ClubEdit
    clubFullNameRequired: 'You must provide the club\'s full name.', // ClubEdit
    invalidLatLow: 'Not a valid latitude (<-90°)', // EventEdit
    invalidLatHigh: 'Not a valid latitude (>90°)', // EventEdit
    invalidLongLow: 'Not a valid longitude (<-180°)', // EventEdit
    invalidLongHigh: 'Not a valid longitude (>180°)', // EventEdit
    invalidUrl: 'You must provide a valid URL (including http(s)://).', // EventEdit, ClubEdit
    eventLinkNameRequired: 'You must provide a name for the event link.', // EventLinkedEdit
  },
  cs: {
    invalidEmail: 'Musíte zadat platnou emailovou adresu.',
    emailRequired: 'Musíte zadat emailovou adresu.',
    passwordLength: 'Vaše heslo musí mít minimálně 8 znaků.',
    passwordCurrentRequired: '*** TODO You must confirm your current password ***',
    eventNameRequired: 'Musíte zadat název závodu.',
    passwordRequired: 'Heslo je povinné.',
    clubShortNameRequired: 'Musíte zadat zkratku klubu.',
    clubFullNameRequired: 'Musíte zadat jméno klubu.',
    invalidLatLow: 'Není platná zeměpisná šířka (<-90°)',
    invalidLatHigh: 'Není platná zeměpisná šířka (>90°)',
    invalidLongLow: 'Není platná zeměpisná délka (<-180°)',
    invalidLongHigh: 'Není platná zeměpisná délka (>180°)',
    invalidUrl: 'Musíte zadat platný URL (včetně http(s)://).',
    eventLinkNameRequired: 'Musíte zadat název spojení mezi závody.',
  },
};

export const tableAllLocale = {
  en: 'all',
  cs: 'vše',
};
