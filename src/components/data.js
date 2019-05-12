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

// Localisation of Yup validation errors in components with Formik forms
export const validationErrorsLocale = {
  en: {
    invalidEmail: 'You must provide a valid email address.', // Authenticate
    emailRequired: 'You must provide an email address.', // Authenticate
    passwordLength: 'Your password must be at least 8 characters long.', // Authenticate
    passwordRequired: 'A password is required.', // Authenticate
    eventNameRequired: 'You must provide a name for the event.', // EventEdit
    invalidLatLow: 'Not a valid latitude (<-90°)', // EventEdit
    invalidLatHigh: 'Not a valid latitude (>90°)', // EventEdit
    invalidLongLow: 'Not a valid longitude (<-180°)', // EventEdit
    invalidLongHigh: 'Not a valid longitude (>180°)', // EventEdit
    invalidUrl: 'You must provide a valid URL (including http(s)://).', // EventEdit
    eventLinkNameRequired: 'You must provide a name for the event link.', // EventLinkedEdit
  },
  cs: {
    invalidEmail: 'TRANSLATE You must provide a valid email address.',
    emailRequired: 'TRANSLATE You must provide an email address.',
    passwordLength: 'TRANSLATE Your password must be at least 8 characters long.',
    passwordRequired: 'TRANSLATE A password is required.',
    eventNameRequired: 'TRANSLATE You must provide a name for the event.',
    invalidLatLow: 'TRANSLATE Not a valid latitude (<-90°)',
    invalidLatHigh: 'TRANSLATE Not a valid latitude (>90°)',
    invalidLongLow: 'TRANSLATE Not a valid longitude (<-180°)',
    invalidLongHigh: 'TRANSLATE Not a valid longitude (>180°)',
    invalidUrl: 'TRANSLATE You must provide a valid URL (including http(s)://).',
    eventLinkNameRequired: 'TRANSLATE You must provide a name for the event link.',
  },
};

// this avoids repeatedly calling the ORIS API for exactly the same response!
export const testOrisList = JSON.parse('[{"orisEntryId":"745556","orisClassId":"77154","orisEventId":"3714","date":"2017-04-14","class":"H40A","name":"Velikonoce ve skalách 2017","place":"Nedamov, Jestřebí","includedEvents":["3715","3716","3717"]},{"orisEntryId":"745557","orisClassId":"77260","orisEventId":"3716","date":"2017-04-15","class":"H40A","name":"Velikonoce ve skalách 2017 - E2","place":"Jestřebí"},{"orisEntryId":"750125","orisClassId":"79403","orisEventId":"4018","date":"2017-03-05","class":"ABC","name":"Praga Magica","place":""},{"orisEntryId":"764848","orisClassId":"79939","orisEventId":"3758","date":"2017-03-31","class":"H35","name":"Mistrovství oblasti v nočním OB","place":"Restaurace KLUB ŠKOLKA, Hrabákova 2001/21, Praha 4"},{"orisEntryId":"764850","orisClassId":"80506","orisEventId":"3771","date":"2017-04-02","class":"H35","name":"Mistrovství oblasti ve sprintu","place":"Mšeno"},{"orisEntryId":"779066","orisClassId":"81939","orisEventId":"3789","date":"2017-04-22","class":"H35","name":"Mistrovství oblasti na krátké trati","place":"Týnec nad Sázavou"},{"orisEntryId":"905810","orisClassId":"87449","orisEventId":"3863","date":"2017-09-30","class":"H35L","name":"Oblastní žebříček","place":"Jíloviště, Cinema Palace Hotel"},{"orisEntryId":"918468","orisClassId":"87351","orisEventId":"3871","date":"2017-10-01","class":"H35","name":"Oblastní žebříček","place":"Stochov"},{"orisEntryId":"918469","orisClassId":"87363","orisEventId":"4218","date":"2017-10-01","class":"O3","name":"Odpolední sprint","place":"Stochov"},{"orisEntryId":"961164","orisClassId":"88336","orisEventId":"4233","date":"2017-10-21","class":"H35","name":"Oblastní žebříček","place":"Babice, Vavřetice"},{"orisEntryId":"961165","orisClassId":"88306","orisEventId":"3890","date":"2017-10-22","class":"H35","name":"Oblastní žebříček","place":"Babice, Vavřetice"},{"orisEntryId":"975002","orisClassId":"88797","orisEventId":"4261","date":"2017-12-05","class":"LUCIFEŘI","name":"Mikulášův kufr","place":"Srub Gizela, Krčský les"},{"orisEntryId":"975003","orisClassId":"88789","orisEventId":"4221","date":"2017-12-17","class":"A","name":"Večerník Praha","place":"centrum Prahy"},{"orisEntryId":"980700","orisClassId":"89831","orisEventId":"4507","date":"2018-02-01","class":"UNI","name":"PZL - Mosty IV","place":"Údolí Rokytky (Hloubětín - Černý Most - Dolní Počernice - Běchovice)"},{"orisEntryId":"988187","orisClassId":"91737","orisEventId":"4608","date":"2018-03-10","class":"ABC","name":"Praga Magica","place":"Praha"},{"orisEntryId":"991938","orisClassId":"90088","orisEventId":"4322","date":"2018-03-25","class":"H35L","name":"Oblastní žebříček","place":"Červený mlýn u Rakovníka"},{"orisEntryId":"991940","orisClassId":"90032","orisEventId":"4319","date":"2018-03-24","class":"H35","name":"Oblastní žebříček","place":"Červený mlýn u Rakovníka"},{"orisEntryId":"991941","orisClassId":"90060","orisEventId":"4320","date":"2018-03-24","class":"H35","name":"Oblastní žebříček","place":"Sokolovna Rakovník"},{"orisEntryId":"1005038","orisClassId":"92118","orisEventId":"4333","date":"2018-04-08","class":"H35L","name":"Oblastní žebříček","place":"Malíkovice"},{"orisEntryId":"1005040","orisClassId":"91946","orisEventId":"4342","date":"2018-04-14","class":"H35","name":"Mistrovství oblasti na krátké trati","place":"Konojedy"},{"orisEntryId":"1021220","orisClassId":"93698","orisEventId":"4350","date":"2018-04-21","class":"H35","name":"Mistrovství oblasti ve sprintu","place":"Slaný - letní kino"},{"orisEntryId":"1021222","orisClassId":"92297","orisEventId":"4353","date":"2018-04-22","class":"H35","name":"Oblastní žebříček","place":"Chyňava"},{"orisEntryId":"1029819","orisClassId":"95937","orisEventId":"4378","date":"2018-05-13","class":"H35L","name":"Mistrovství oblasti na klasické trati","place":"Kytín"},{"orisEntryId":"1040565","orisClassId":"91768","orisEventId":"4115","date":"2018-06-09","class":"H40B","name":"Žebříček B-Čechy východ, oblastní žebříček","place":"Číměř, LDT Bílá Skála"},{"orisEntryId":"1040572","orisClassId":"91887","orisEventId":"4116","date":"2018-06-10","class":"H40B","name":"Žebříček B-Čechy východ, oblastní žebříček","place":"Číměř, LDT Bílá Skála"},{"orisEntryId":"1046291","orisClassId":"91987","orisEventId":"4423","date":"2018-08-11","class":"H40","name":"Rumcajsovy míle","place":"Valečov - amfiteátr"},{"orisEntryId":"1046910","orisClassId":"92697","orisEventId":"3909","date":"2018-05-26","class":"H35","name":"Manufaktura Český pohár, WRE, INOV-8 CUP - žebříček A, oblastní žebříček","place":"Plzeň – nádvoří pivovaru Prazdroj / Pilsner Urquell brewery"},{"orisEntryId":"1066348","orisClassId":"95563","orisEventId":"3907","date":"2018-05-26","class":"H105","name":"Český pohár štafet (B), Česká liga klubů (B), mistrovství oblasti","place":"louka u Bílého potoka, Třemošná"},{"orisEntryId":"1071778","orisClassId":"96491","orisEventId":"4387","date":"2018-06-02","class":"H35","name":"Oblastní žebříček","place":"Ondřejov, Astronomický ústav"},{"orisEntryId":"1082694","orisClassId":"95580","orisEventId":"3908","date":"2018-05-27","class":"H105","name":"Český pohár štafet (B), Česká liga klubů (B), mistrovství oblasti","place":"louka u Bílého potoka, Třemošná"},{"orisEntryId":"1121859","orisClassId":"97954","orisEventId":"4720","date":"2018-06-20","class":"DH21","name":"KLACKY [9] OPEN - závod ŠTAFET","place":"Praha 3, Pražačka"},{"orisEntryId":"1148487","orisClassId":"96360","orisEventId":"4442","date":"2018-09-22","class":"H35","name":"Oblastní žebříček","place":"Nový Knín"},{"orisEntryId":"1148488","orisClassId":"100965","orisEventId":"4451","date":"2018-09-23","class":"H35L","name":"Oblastní žebříček","place":"Krňany"},{"orisEntryId":"1149047","orisClassId":"101607","orisEventId":"4777","date":"2018-10-05","class":"Dlouhá","name":"Petřín OPEN","place":"Praha – Petřín"},{"orisEntryId":"1153388","orisClassId":"101554","orisEventId":"4465","date":"2018-10-07","class":"H40","name":"Oblastní žebříček","place":"Mladá Boleslav – Staroměstské náměstí"},{"orisEntryId":"1155366","orisClassId":"101665","orisEventId":"4781","date":"2018-09-26","class":"T3","name":"Podvečerní O-běh Folimankou","place":"Na Folimance 2, Praha 2"},{"orisEntryId":"1202840","orisClassId":"102455","orisEventId":"4473","date":"2018-10-20","class":"H35","name":"Oblastní žebříček","place":"louka mezi obcemi Lojovice a Brtnice"},{"orisEntryId":"1202842","orisClassId":"102489","orisEventId":"4476","date":"2018-10-21","class":"H35L","name":"Oblastní žebříček","place":"louka mezi obcemi Lojovice a Brtnice"},{"orisEntryId":"1219010","orisClassId":"98979","orisEventId":"3984","date":"2018-10-13","class":"H105","name":"Mistrovství a Veteraniáda ČR štafet","place":"Krajníčko, louka na západním okraji obce"},{"orisEntryId":"1232933","orisClassId":"98991","orisEventId":"3985","date":"2018-10-14","class":"DH225","name":"Mistrovství a Veteraniáda ČR klubů a oblastních výběrů žactva","place":"Krajníčko, louka na západním okraji obce"},{"orisEntryId":"1240491","orisClassId":"102394","orisEventId":"4793","date":"2018-11-17","class":"H","name":"SMIK - 25.Mistrovství světa ve SMIKu","place":"Řitka, restaurace Panský dvůr"},{"orisEntryId":"1240720","orisClassId":"102883","orisEventId":"4484","date":"2018-11-04","class":"H35","name":"Oblastní žebříček","place":"Louka u sportovního centra Olympia Wellness, Květoslava Mašity 409, Všenory"},{"orisEntryId":"1247602","orisClassId":"102972","orisEventId":"4798","date":"2018-12-09","class":"B","name":"Tour de Prague","place":""},{"orisEntryId":"1254354","orisClassId":"103961","orisEventId":"5085","date":"2019-01-27","class":"U","name":"Opět na Kozla 1-X-2","place":"Pyšely"},{"orisEntryId":"1254355","orisClassId":"104588","orisEventId":"5159","date":"2019-01-31","class":"UNI","name":"PZL Mosty V","place":"Černý Most a okolí"},{"orisEntryId":"1261993","orisClassId":"106534","orisEventId":"5205","date":"2019-03-09","class":"ABC","name":"PRAGA MAGICA","place":"Praha"},{"orisEntryId":"1275829","orisClassId":"107685","orisEventId":"4961","date":"2019-04-06","class":"H35","name":"Mistrovství oblasti ve sprintu","place":"Vršovice (Praha 10) a Vinohrady (Praha 2)"},{"orisEntryId":"1285182","orisClassId":"107582","orisEventId":"4959","date":"2019-03-30","class":"H35","name":"Mistrovství oblasti v nočním OB","place":"Libovice"},{"orisEntryId":"1285184","orisClassId":"107616","orisEventId":"4960","date":"2019-03-31","class":"H35","name":"Oblastní žebříček","place":"Kvílice"},{"orisEntryId":"1285189","orisClassId":"108073","orisEventId":"4962","date":"2019-04-07","class":"H35","name":"Oblastní žebříček","place":"Týnec nad Sázavou"},{"orisEntryId":"1287857","orisClassId":"106198","orisEventId":"4291","date":"2019-03-23","class":"H105","name":"Český pohár štafet (C), Česká liga klubů (C)","place":"Stříbrný rybník - Hradec Králové"},{"orisEntryId":"1317358","orisClassId":"107489","orisEventId":"4963","date":"2019-04-13","class":"H135","name":"Mistrovství oblasti štafet","place":"Košátky"},{"orisEntryId":"1319361","orisClassId":"108515","orisEventId":"4964","date":"2019-04-28","class":"H35L","name":"Oblastní žebříček","place":"Chyňava"},{"orisEntryId":"1319795","orisClassId":"107981","orisEventId":"4965","date":"2019-05-01","class":"H35","name":"Oblastní žebříček","place":"Čelákovice"}]');
