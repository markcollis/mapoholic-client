export const countryOptions = [ // limited set of IOF member countries for now
  { value: 'AUS', label: 'AUS: Australia' },
  { value: 'AUT', label: 'AUT: Austria' },
  { value: 'BEL', label: 'BEL: Belgium' },
  { value: 'BUL', label: 'BUL: Bulgaria' },
  { value: 'CAN', label: 'CAN: Canada' },
  { value: 'CRO', label: 'CRO: Croatia' },
  { value: 'CZE', label: 'CZE: Czech Republic' },
  { value: 'DEN', label: 'DEN: Denmark' },
  { value: 'ESP', label: 'ESP: Spain' },
  { value: 'EST', label: 'EST: Estonia' },
  { value: 'FIN', label: 'FIN: Finland' },
  { value: 'FRA', label: 'FRA: France' },
  { value: 'GBR', label: 'GBR: Great Britain' },
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
export const countryOptionsLocale = {
  en: countryOptions,
  cs: [ // all except CZE and GBR to do later!
    { value: 'AUS', label: 'AUS: Australia' },
    { value: 'AUT', label: 'AUT: Austria' },
    { value: 'BEL', label: 'BEL: Belgium' },
    { value: 'BUL', label: 'BUL: Bulgaria' },
    { value: 'CAN', label: 'CAN: Canada' },
    { value: 'CRO', label: 'CRO: Croatia' },
    { value: 'CZE', label: 'CZE: Česká Republika' },
    { value: 'DEN', label: 'DEN: Denmark' },
    { value: 'ESP', label: 'ESP: Spain' },
    { value: 'EST', label: 'EST: Estonia' },
    { value: 'FIN', label: 'FIN: Finland' },
    { value: 'FRA', label: 'FRA: France' },
    { value: 'GBR', label: 'GBR: Velká Británie' },
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
  ],
};

export const regionOptionSets = { // keys to match countryOptions
  AUS: [],
  AUT: [],
  BEL: [],
  BUL: [],
  CAN: [],
  CRO: [],
  CZE: [
    { value: 'Č', label: 'Čechy (Č)' },
    { value: 'ČR', label: 'Česká Republika (ČR)' },
    { value: 'HA', label: 'Hanácká (HA)' },
    { value: 'JČ', label: 'Jihočeská (JČ)' },
    { value: 'JE', label: 'Ještědská (JE)' },
    { value: 'JM', label: 'Jihomoravská (JM)' },
    { value: 'M', label: 'Morava (M)' },
    { value: 'MSK', label: 'Moravskoslezský kraj (MSK)' },
    { value: 'P', label: 'Pražská (P)' },
    { value: 'StČ', label: 'Středočeská (StČ)' },
    { value: 'VA', label: 'Valašská (VA)' },
    { value: 'VČ', label: 'Východočeská (VČ)' },
    { value: 'VY', label: 'Vysočina (VY)' },
    { value: 'ZČ', label: 'Západočeská (ZČ)' },
  ],
  DEN: [],
  ESP: [],
  EST: [],
  FIN: [],
  FRA: [],
  GBR: [
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

export const roleOptions = [
  { value: 'admin', label: 'Administrator' },
  { value: 'guest', label: 'Guest' },
  { value: 'standard', label: 'Standard' },
];
export const roleOptionsLocale = {
  en: roleOptions,
  cs: [
    { value: 'admin', label: 'správce' },
    { value: 'guest', label: 'host' },
    { value: 'standard', label: 'standard' },
  ],
};

export const visibilityOptions = [
  { value: 'public', label: 'public' },
  { value: 'all', label: 'all' },
  { value: 'club', label: 'club' },
  { value: 'private', label: 'private' },
];
export const visibilityOptionsLocale = {
  en: visibilityOptions,
  cs: [
    { value: 'public', label: 'veřejnost' },
    { value: 'all', label: 'všichni' },
    { value: 'club', label: 'klub' },
    { value: 'private', label: 'soukromý' },
  ],
};

export const typesOptions = [
  { value: 'Sprint', label: 'Sprint' }, // ORIS SP Sprint Sprint
  { value: 'Middle', label: 'Middle' }, // ORIS KT Middle Krátká trať
  { value: 'Long', label: 'Long' }, // ORIS KL Long Klasická trať
  { value: 'Ultra-Long', label: 'Ultra-Long' }, // ORIS DT Ultra-Long Dlouhá trať
  { value: 'Relay', label: 'Relay' }, // ORIS ST Relay Štafety
  { value: 'Night', label: 'Night' }, // ORIS NOB Night Noční (not combined with distance in ORIS)
  { value: 'TempO', label: 'TempO' }, // ORIS TeO TempO TempO
  { value: 'Mass start', label: 'Mass start' }, // ORIS MS Mass start Hromadný start
  { value: 'MTBO', label: 'MTBO' }, // ORIS MTBO MTBO
  { value: 'SkiO', label: 'SkiO' }, // ORIS LOB SkiO
  { value: 'TrailO', label: 'TrailO' }, // ORIS TRAIL TrailO
  { value: 'Score', label: 'Score' },
  { value: 'Spanish Score', label: 'Spanish Score' },
  { value: 'non-standard', label: 'non-standard' },
  // i.e. either training or an event with an unusual format (e.g. some EPOs)
];
export const typesOptionsLocale = {
  en: typesOptions,
  cs: [
    { value: 'Sprint', label: 'Sprint' }, // ORIS SP Sprint Sprint
    { value: 'Middle', label: 'Krátká trať' }, // ORIS KT Middle Krátká trať
    { value: 'Long', label: 'Klasická trať' }, // ORIS KL Long Klasická trať
    { value: 'Ultra-Long', label: 'Dlouhá trať' }, // ORIS DT Ultra-Long Dlouhá trať
    { value: 'Relay', label: 'Štafety' }, // ORIS ST Relay Štafety
    { value: 'Night', label: 'Noční' }, // ORIS NOB Night Noční (not combined with distance in ORIS)
    { value: 'TempO', label: 'TempO' }, // ORIS TeO TempO TempO
    { value: 'Mass start', label: 'Hromadný start' }, // ORIS MS Mass start Hromadný start
    { value: 'MTBO', label: 'MTBO' }, // ORIS MTBO MTBO
    { value: 'SkiO', label: 'SkiO' }, // ORIS LOB SkiO
    { value: 'TrailO', label: 'TrailO' }, // ORIS TRAIL TrailO
    { value: 'Score', label: 'Scorelauf' },
    { value: 'Spanish Score', label: 'Volné pořadí' },
    { value: 'non-standard', label: 'nestandardní' },
  ],
};
