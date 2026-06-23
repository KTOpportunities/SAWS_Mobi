import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
interface DecodedTAF {
  station: string;
  observationTime?: string;
  validFrom?: string;
  validTo?: string;
  wind?: string;
  visibility?: string;
  clouds?: string;
  weather?: string;
  maxTemp?: string;
  minTemp?: string;
  changes?: {
    type: string; // BECMG / FM / TEMPO / PROB
    from?: string;
    to?: string;
    wind?: string;
    visibility?: string;
    clouds?: string;
    weather?: string;
    probability?: string;
  }[];
}
interface DecodedMETAR {
  station: string;
  observationTime?: string;
  windSpeed?: string;
  windDirection?: string;
  windVariation?: string;
  windGusts?: string;
  visibility?: string;
  clouds?: string;
  weather?: string;
  temperature?: string;
  dewPoint?: string;
  qnh?: string;
  trend?: string;
}

@Component({
  selector: 'app-view-decoded',
  templateUrl: './view-decoded.page.html',
  styleUrls: ['./view-decoded.page.scss'],
})
export class ViewDecodedPage implements OnInit {
decodedTAF!: DecodedTAF;
decodedMETAR!: DecodedMETAR;
  constructor(
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<ViewDecodedPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
   
    console.log('MAT_DIALOG_DATA:', this.data);
   let text = '';

  // Handle both cases
  if (typeof data?.item === 'string') {
    text = data.item;
  } else if (typeof data?.item === 'object' && data.item.filecontent) {
    text = data.item.filecontent;
  }

  if (text.startsWith('METAR')|| text.startsWith('SPECI')) {
    this.decodedMETAR = this.parseMETAR(text);
    console.log('Decoded METAR:', this.decodedMETAR);
  } else if (text.startsWith('TAF')) {
    this.decodedTAF = this.parseTAF(text);
    console.log('Decoded TAF:', this.decodedTAF);
  } else {
    console.error('Unsupported format:', text);
  }

  }

  ngOnInit() {}

  closeImageDialog() {
    this.dialogRef.close('close');
  }

 parseTAF(taf: string): DecodedTAF {
  if (!taf) return { station: '', changes: [] };

  const tokens = taf.replace(/\r?\n/g, ' ').split(/\s+/).filter(t => t);

  // Station
  const station = tokens[1] || '';
    const stations: { [icao: string]: string } = {
  // Gauteng
  FAOR: 'O R Tambo Intl, South Africa 2609S 0281348E',
  FALA: 'Lanseria Intl, South Africa 2640S 02756E',
  FAJB: 'Barberspan, South Africa',
  FAIR: 'Randfontein, South Africa',
  FAWB: 'Wonderboom Airport, South Africa 253914S 0281327E',
  FAWK: 'Krugersdorp Airfield, South Africa 2624S 02743E',
  FAGC: 'Germiston, South Africa',
  FAGM: 'Magaliesburg, South Africa',
  FASI: 'Siyabuswa, South Africa',
  FAVV: 'Vereeniging, South Africa',

  // Limpopo
  FAPP: 'Polokwane Intl, South Africa 2325S 02925E',
  FALM: 'Lephalale, South Africa 2347S 02741E',
  FAHS: 'Hoedspruit, South Africa 2475S 03104E',
  FATH: 'Thohoyandou, South Africa',
  FATV: 'Tzaneen, South Africa',
  FAER: 'Ellisras, South Africa',
  FATZ: 'Tzaneen/Zebediela, South Africa',
  FATI: 'Thabazimbi Airport, South Africa 243458S 02725E',
  FAVM: 'Vhembe, South Africa',

  // Mpumalanga
  FAKN: 'Nelspruit/Kruger Mpumalanga Intl, South Africa 2502S 03106E',
  FANS: 'Nooitgedacht, South Africa',
  FAEO: 'Ermelo, South Africa',
  FASR: 'Secunda, South Africa',
  FAWI: 'Witbank, South Africa',
  FAKP: 'Kaapmuiden, South Africa',
  FASZ: 'Standerton, South Africa',

  // Northwest Province
  FAMM: 'Mafikeng, South Africa 2534S 02636E',
  FALI: 'Lichtenburg, South Africa',
  FAKD: 'Klerksdorp, South Africa',
  FARG: 'Rustenburg, South Africa',
  FAPN: 'Pilanesberg, South Africa 2554S 02703E',
  FAPS: 'Potchefstroom, South Africa',
  FAMK: 'Mahikeng, South Africa',

  // Western Cape
  FACT: 'Cape Town Intl, South Africa 3357S 01835E',
  FAGG: 'George, South Africa 3340S 02203E',
  FALW: 'Langebaanweg, South Africa',
  FAOB: 'Oudtshoorn, South Africa',
  FABY: 'Barrydale, South Africa',
  FAPG: 'Piketberg, South Africa',
  FAYP: 'Yzerfontein, South Africa',
  FAOH: 'Oudshoorn, South Africa',

  // Eastern Cape
  FAPE: 'Port Elizabeth Intl, South Africa 3350S 02536E',
  FAEL: 'East London Intl, South Africa 3313S 02753E',
  FAUT: 'Mthatha, South Africa 3105S 02848E',
  FABE: 'Bisho, South Africa',

  // KwaZulu Natal
  FALE: 'King Shaka Intl, South Africa 2955S 03105E',
  FAPM: 'Pietermaritzburg, South Africa 2937S 03024E',
  FARB: 'Richards Bay, South Africa 2839S 03205E',
  FAMG: 'Margate, South Africa',
  FAVG: 'Vryheid, South Africa',
  FAGY: 'Empangeni, South Africa',
  FAUL: 'Ulundi, South Africa',
  FALY: 'Ladysmith, South Africa',
  FANC: 'Newcastle, South Africa',
  FAMX: 'Madadeni, South Africa',

  // Freestate
  FABL: 'Bloemfontein, South Africa 2928S 02615E',
  FABM: 'Bethlehem, South Africa',
  FAWM: 'Welkom, South Africa',
  FAHV: 'Harrismith, South Africa',
  FAKS: 'Kroonstad, South Africa',
  FAFB: 'Frankfort, South Africa',

  // Northern Cape
  FAUP: 'Upington, South Africa 2815S 02114E',
  FAKM: 'Kuruman, South Africa 2717S 02327E',
  FADY: 'De Aar, South Africa',
  FACV: 'Carnavon, South Africa',
  FASB: 'Springbok, South Africa',
  FAAB: 'Alexander Bay, South Africa',
  FASS: 'Sutherland, South Africa',

  // Lesotho
  FXMM: 'Maseru, Lesotho 2928S 02730E',

  // Eswatini
  FDMS: 'Matsapha, Eswatini 2652S 03133E',
  FDSK: 'Sikhuphe, Eswatini 2654S 03138E',

  // Botswana
  FBSK: 'Sir Seretse Khama Intl, Botswana 2439S 02555E',
  FBMN: 'Maun, Botswana 1921S 02326E',
  FBFT: 'Francistown, Botswana',
  FBGZ: 'Ghanzi, Botswana',
  FBJW: 'Jwaneng, Botswana',
  FBKE: 'Kasane, Botswana 1726S 02510E',
  FBMP: 'Mapoka, Botswana',
  FBPA: 'Palapye, Botswana',
  FBTE: 'Tsabong, Botswana',
  FBTS: 'Tshane, Botswana',
  FBSN: 'Shakawe, Botswana',
  FBSP: 'Sowa, Botswana',
  FBSW: 'Selibe Phikwe, Botswana',
  FBLT: 'Letlhakane, Botswana',

  // Namibia
  FYWH: 'Windhoek, Namibia 2240S 01706E',
  FYWE: 'Walvis Bay, Namibia 2233S 01430E',
  FYKM: 'Keetmanshoop, Namibia 2720S 01803E',
  FYKT: 'Katima Mulilo, Namibia 1735S 02417E',
  FYWB: 'Witbank, Namibia 2502S 03103E',
  FYGF: 'Grunau, Namibia 2833S 01852E',
  FYLZ: 'Lüderitz, Namibia 2643S 01514E',
  FYOA: 'Oranjemund, Namibia 2642S 01628E',
  FYOG: 'Ongwediva, Namibia 1731S 01642E',
  FYRU: 'Rundu, Namibia 1739S 01955E',

  // Mozambique
  FQMA: 'Maputo Intl, Mozambique 2555S 03234E',
  FQBR: 'Beira, Mozambique 1931S 03451E',
  FQNP: 'Nampula, Mozambique 1501S 03915E',
  FQIN: 'Inhambane, Mozambique 2332S 03523E',
  FQLC: 'Lichinga, Mozambique 1345S 03640E',
  FQPB: 'Pemba, Mozambique 1229S 04032E',
  FQQL: 'Quelimane, Mozambique 1757S 03652E',
  FQTE: 'Tete, Mozambique',
  FQTT: 'Tete, Mozambique',
  FQVL: 'Vilanculos, Mozambique',

  // Zimbabwe
  FVRG: 'Harare, Zimbabwe 1750S 03105E',
  FVJN: 'Jwaneng, Zimbabwe 2000S 02800E',
  FVKB: 'Kariba, Zimbabwe',
  FVFA: 'Victoria Falls, Zimbabwe 1750S 02550E',
  FVCZ: 'Cecil Z., Zimbabwe',
  FVTL: 'Tuli Lodge, Zimbabwe',
  FVWN: 'Hwange, Zimbabwe',

  // Other Regions
  FWKI: 'Kigali, Rwanda 0139S 03005E',
  FWCL: 'Cape Town Intl, South Africa 3357S 01835E',
  FLKK: 'Kasane, Botswana 1726S 02510E',
  FLSK: 'Skukuza, South Africa 2505S 03133E',
  FNLU: 'Lusaka, Zambia 1528S 02817E',
  FLHN: 'Hondeklip Bay, South Africa 2921S 01710E',
  FLND: 'No data station',
  FAME: 'No data station',
};

  // Observation time: 031000Z
  const obsToken = tokens.find(t => /^\d{6}Z$/.test(t)) || '';
  const observationTime = obsToken
    ? `[Day ${obsToken.substr(0, 2)} ${obsToken.substr(2, 2)}:${obsToken.substr(4, 2)}]`
    : '';

  // Valid period: 0312/0418
  const validToken = tokens.find(t => /^\d{4}\/\d{4}$/.test(t)) || '';
  const validFrom = validToken
    ? `[Day ${validToken.substr(0, 2)} ${validToken.substr(2, 2)}:00]`
    : '';
  const validTo = validToken
    ? `[Day ${validToken.substr(5, 2)} ${validToken.substr(7, 2)}:00]`
    : '';

  // Decode wind
  const windToken = tokens.find(t => /^(\d{3}|VRB)\d{2}KT$/.test(t)) || '';
  let windDirection = '';
  let windSpeed = '';
  if (windToken) {
    const dir = windToken.substr(0, 3);
    const spd = parseInt(windToken.substr(3, 2), 10);
    windDirection = `${dir} degrees`;
    windSpeed = `${(spd * 0.51444).toFixed(1)} m/s (${spd}KT)`;
  }

  // Visibility
  let visibility = '';
  if (tokens.includes('CAVOK')) {
    visibility = '10km or more (CAVOK)';
  } else {
    const visToken = tokens.find(t => /^\d{4}$/.test(t));
    if (visToken) visibility = visToken === '9999' ? '10km or more' : `${parseInt(visToken, 10)}m`;
  }

  // Clouds
  const cloudToken = tokens.find(t => /^(FEW|SCT|BKN|OVC)\d{3}/.test(t)) || '';
  const clouds = cloudToken
    ? `${cloudToken.substr(0, 3)} at ${parseInt(cloudToken.substr(3), 10) * 100}ft`
    : (tokens.includes('CAVOK') ? 'No cloud of operational significance' : '');

  // Weather phenomena
  const weatherToken = tokens.find(t => /^(DZ|RA|SN|TS|FG|BR|HZ|SA|DU|SS|DS)$/.test(t)) || '';
  let weather = 'No weather of significance to aviation';
  if (weatherToken) {
    const weatherMap: { [key: string]: string } = {
      DZ: 'Drizzle', RA: 'Rain', SN: 'Snow', TS: 'Thunderstorm',
      FG: 'Fog', BR: 'Mist', HZ: 'Haze', SA: 'Sand',
      DU: 'Dust', SS: 'Sandstorm', DS: 'Duststorm'
    };
    weather = weatherMap[weatherToken] || `Weather: ${weatherToken}`;
  }

  // Max/Min temps
  const txToken = tokens.find(t => t.startsWith('TX')) || '';
  const tnToken = tokens.find(t => t.startsWith('TN')) || '';
  let maxTemp = '';
  let minTemp = '';
  if (txToken) {
    const match = txToken.match(/^TX(\d{2})\/(\d{2})(\d{2})Z$/);
    if (match) maxTemp = `${match[1]} at Day ${match[2]} ${match[3]}:00`;
  }
  if (tnToken) {
    const match = tnToken.match(/^TN(\d{2})\/(\d{2})(\d{2})Z$/);
    if (match) minTemp = `${match[1]} at Day ${match[2]} ${match[3]}:00`;
  }

  // Handle change groups (FM, BECMG, TEMPO, PROB)
  const changes: any[] = [];
  let current: any = null;

  tokens.forEach(token => {
    if (/^(FM|BECMG|TEMPO|PROB\d{2})$/.test(token)) {
      if (current) changes.push(current);
      current = { type: token };
      return;
    }
    if (!current) return;

    if (!current.from && /^(\d{6}Z|\d{4})$/.test(token)) {
      // FM041500 -> from Day 04 15:00
      if (current.type.startsWith('FM')) {
        current.from = `[Day ${token.substr(2, 2)} ${token.substr(4, 2)}:00]`;
      }
    } else if (!current.wind && /^(\d{3}|VRB)\d{2}KT$/.test(token)) {
      const dir = token.substr(0, 3);
      const spd = parseInt(token.substr(3, 2), 10);
      current.wind = `Wind direction: ${dir} degrees, Wind speed: ${(spd * 0.51444).toFixed(1)} m/s (${spd}KT)`;
    } else if (!current.visibility && (token === 'CAVOK' || /^\d{4}$/.test(token))) {
      current.visibility = token === 'CAVOK' ? '10km or more (CAVOK)' : `${parseInt(token, 10)}m`;
    } else if (!current.clouds && /^(FEW|SCT|BKN|OVC)\d{3}/.test(token)) {
      current.clouds = `${token.substr(0, 3)} at ${parseInt(token.substr(3), 10) * 100}ft`;
    }
  });

  if (current) changes.push(current);

  // Stations lookup
  const stationFull = `${station} ${stations[station] || ''}`;

  return {
    station: stationFull,
    observationTime,
    validFrom,
    validTo,
    wind: windDirection && windSpeed ? `${windDirection}, ${windSpeed}` : '',
    visibility,
    clouds,
    weather,
    maxTemp,
    minTemp,
    changes,
  };
}


  parseMETAR(metar: string): DecodedMETAR {
    if (!metar) return { station: '' };

    const tokens = metar.replace(/\r?\n/g, ' ').split(/\s+/).filter(t => t);

    const station = tokens[1] || '';

   const stations: { [icao: string]: string } = {
  // Gauteng
  FAOR: 'O R Tambo Intl, South Africa 2609S 0281348E',
  FALA: 'Lanseria Intl, South Africa 2640S 02756E',
  FAJB: 'Barberspan, South Africa',
  FAIR: 'Randfontein, South Africa',
  FAWB: 'Wonderboom Airport, South Africa 253914S 0281327E',
  FAWK: 'Krugersdorp Airfield, South Africa 2624S 02743E',
  FAGC: 'Germiston, South Africa',
  FAGM: 'Magaliesburg, South Africa',
  FASI: 'Siyabuswa, South Africa',
  FAVV: 'Vereeniging, South Africa',

  // Limpopo
  FAPP: 'Polokwane Intl, South Africa 2325S 02925E',
  FALM: 'Lephalale, South Africa 2347S 02741E',
  FAHS: 'Hoedspruit, South Africa 2475S 03104E',
  FATH: 'Thohoyandou, South Africa',
  FATV: 'Tzaneen, South Africa',
  FAER: 'Ellisras, South Africa',
  FATZ: 'Tzaneen/Zebediela, South Africa',
  FATI: 'Thabazimbi Airport, South Africa 243458S 02725E',
  FAVM: 'Vhembe, South Africa',

  // Mpumalanga
  FAKN: 'Nelspruit/Kruger Mpumalanga Intl, South Africa 2502S 03106E',
  FANS: 'Nooitgedacht, South Africa',
  FAEO: 'Ermelo, South Africa',
  FASR: 'Secunda, South Africa',
  FAWI: 'Witbank, South Africa',
  FAKP: 'Kaapmuiden, South Africa',
  FASZ: 'Standerton, South Africa',

  // Northwest Province
  FAMM: 'Mafikeng, South Africa 2534S 02636E',
  FALI: 'Lichtenburg, South Africa',
  FAKD: 'Klerksdorp, South Africa',
  FARG: 'Rustenburg, South Africa',
  FAPN: 'Pilanesberg, South Africa 2554S 02703E',
  FAPS: 'Potchefstroom, South Africa',
  FAMK: 'Mahikeng, South Africa',

  // Western Cape
  FACT: 'Cape Town Intl, South Africa 3357S 01835E',
  FAGG: 'George, South Africa 3340S 02203E',
  FALW: 'Langebaanweg, South Africa',
  FAOB: 'Oudtshoorn, South Africa',
  FABY: 'Barrydale, South Africa',
  FAPG: 'Piketberg, South Africa',
  FAYP: 'Yzerfontein, South Africa',
  FAOH: 'Oudshoorn, South Africa',

  // Eastern Cape
  FAPE: 'Port Elizabeth Intl, South Africa 3350S 02536E',
  FAEL: 'East London Intl, South Africa 3313S 02753E',
  FAUT: 'Mthatha, South Africa 3105S 02848E',
  FABE: 'Bisho, South Africa',

  // KwaZulu Natal
  FALE: 'King Shaka Intl, South Africa 2955S 03105E',
  FAPM: 'Pietermaritzburg, South Africa 2937S 03024E',
  FARB: 'Richards Bay, South Africa 2839S 03205E',
  FAMG: 'Margate, South Africa',
  FAVG: 'Vryheid, South Africa',
  FAGY: 'Empangeni, South Africa',
  FAUL: 'Ulundi, South Africa',
  FALY: 'Ladysmith, South Africa',
  FANC: 'Newcastle, South Africa',
  FAMX: 'Madadeni, South Africa',

  // Freestate
  FABL: 'Bloemfontein, South Africa 2928S 02615E',
  FABM: 'Bethlehem, South Africa',
  FAWM: 'Welkom, South Africa',
  FAHV: 'Harrismith, South Africa',
  FAKS: 'Kroonstad, South Africa',
  FAFB: 'Frankfort, South Africa',

  // Northern Cape
  FAUP: 'Upington, South Africa 2815S 02114E',
  FAKM: 'Kuruman, South Africa 2717S 02327E',
  FADY: 'De Aar, South Africa',
  FACV: 'Carnavon, South Africa',
  FASB: 'Springbok, South Africa',
  FAAB: 'Alexander Bay, South Africa',
  FASS: 'Sutherland, South Africa',

  // Lesotho
  FXMM: 'Maseru, Lesotho 2928S 02730E',

  // Eswatini
  FDMS: 'Matsapha, Eswatini 2652S 03133E',
  FDSK: 'Sikhuphe, Eswatini 2654S 03138E',

  // Botswana
  FBSK: 'Sir Seretse Khama Intl, Botswana 2439S 02555E',
  FBMN: 'Maun, Botswana 1921S 02326E',
  FBFT: 'Francistown, Botswana',
  FBGZ: 'Ghanzi, Botswana',
  FBJW: 'Jwaneng, Botswana',
  FBKE: 'Kasane, Botswana 1726S 02510E',
  FBMP: 'Mapoka, Botswana',
  FBPA: 'Palapye, Botswana',
  FBTE: 'Tsabong, Botswana',
  FBTS: 'Tshane, Botswana',
  FBSN: 'Shakawe, Botswana',
  FBSP: 'Sowa, Botswana',
  FBSW: 'Selibe Phikwe, Botswana',
  FBLT: 'Letlhakane, Botswana',

  // Namibia
  FYWH: 'Windhoek, Namibia 2240S 01706E',
  FYWE: 'Walvis Bay, Namibia 2233S 01430E',
  FYKM: 'Keetmanshoop, Namibia 2720S 01803E',
  FYKT: 'Katima Mulilo, Namibia 1735S 02417E',
  FYWB: 'Witbank, Namibia 2502S 03103E',
  FYGF: 'Grunau, Namibia 2833S 01852E',
  FYLZ: 'Lüderitz, Namibia 2643S 01514E',
  FYOA: 'Oranjemund, Namibia 2642S 01628E',
  FYOG: 'Ongwediva, Namibia 1731S 01642E',
  FYRU: 'Rundu, Namibia 1739S 01955E',

  // Mozambique
  FQMA: 'Maputo Intl, Mozambique 2555S 03234E',
  FQBR: 'Beira, Mozambique 1931S 03451E',
  FQNP: 'Nampula, Mozambique 1501S 03915E',
  FQIN: 'Inhambane, Mozambique 2332S 03523E',
  FQLC: 'Lichinga, Mozambique 1345S 03640E',
  FQPB: 'Pemba, Mozambique 1229S 04032E',
  FQQL: 'Quelimane, Mozambique 1757S 03652E',
  FQTE: 'Tete, Mozambique',
  FQTT: 'Tete, Mozambique',
  FQVL: 'Vilanculos, Mozambique',

  // Zimbabwe
  FVRG: 'Harare, Zimbabwe 1750S 03105E',
  FVJN: 'Jwaneng, Zimbabwe 2000S 02800E',
  FVKB: 'Kariba, Zimbabwe',
  FVFA: 'Victoria Falls, Zimbabwe 1750S 02550E',
  FVCZ: 'Cecil Z., Zimbabwe',
  FVTL: 'Tuli Lodge, Zimbabwe',
  FVWN: 'Hwange, Zimbabwe',

  // Other Regions
  FWKI: 'Kigali, Rwanda 0139S 03005E',
  FWCL: 'Cape Town Intl, South Africa 3357S 01835E',
  FLKK: 'Kasane, Botswana 1726S 02510E',
  FLSK: 'Skukuza, South Africa 2505S 03133E',
  FNLU: 'Lusaka, Zambia 1528S 02817E',
  FLHN: 'Hondeklip Bay, South Africa 2921S 01710E',
  FLND: 'No data station',
  FAME: 'No data station',
};
    const stationFull = `${station}: ${stations[station] || ''}`;

    const obsToken = tokens.find(t => /^\d{6}Z$/.test(t)) || '';
    const day = obsToken ? obsToken.substr(0, 2) : '';
    const hour = obsToken ? obsToken.substr(2, 2) : '';
    const minute = obsToken ? obsToken.substr(4, 2) : '';
    const observationTime = obsToken ? `[Day: ${day}] [Time: ${hour}${minute}]` : '';

    // ✅ Fix: Support gusts
    const windToken = tokens.find(t => /^(\d{3}|VRB)\d{2}(G\d{2})?KT$/.test(t)) || '';
    let windSpeed = '';
    let windDirection = '';
    let windGusts = '';
    if (windToken) {
      const dir = windToken.substr(0, 3);
      const spd = parseInt(windToken.substr(3, 2), 10);
      const gustMatch = windToken.match(/G(\d{2})/);
      windDirection = `${dir} degrees`;
      windSpeed = `${(spd * 0.51444).toFixed(1)} m/s (${spd}KT)`;
      if (gustMatch) {
        windGusts = `${(parseInt(gustMatch[1], 10) * 0.51444).toFixed(1)} m/s (${gustMatch[1]}KT)`;
      }
    }

    const windVarToken = tokens.find(t => /^\d{3}V\d{3}$/.test(t)) || '';
    const windVariation = windVarToken
      ? `in past 10 minutes varied between ${windVarToken.substr(0, 3)} and ${windVarToken.substr(4, 3)} degrees`
      : '';

    const visibility = tokens.includes('CAVOK')
      ? '10km or more (CAVOK)'
      : (tokens.find(t => /^\d{4}$/.test(t)) || 'Not recorded (Automatic Station)');

    const cloudToken = tokens.find(t => /^(FEW|SCT|BKN|OVC)\d{3}/.test(t)) || '';
    const clouds = cloudToken
      ? `${cloudToken.substr(0, 3)} at ${parseInt(cloudToken.substr(3), 10) * 100}ft`
      : (tokens.includes('CAVOK') ? 'No cloud of operational significance' : '');

    const tempToken = tokens.find(t => /^M?\d{2}\/M?\d{2}$/.test(t)) || '';
    let temperature = '';
    let dewPoint = '';
    if (tempToken) {
      const [temp, dew] = tempToken.split('/');
      temperature = temp.replace('M', '-') + ' Degrees C';
      dewPoint = dew.replace('M', '-') + ' Degrees C';
    }

    const qnhToken = tokens.find(t => /^Q\d{4}$/.test(t)) || '';
    const qnh = qnhToken ? `${qnhToken.substr(1)} hPa` : '';
   const trendToken = tokens.find(t => t.replace(/=+$/, '') === 'NOSIG');
const trend = trendToken ? 'No significant change is expected' : '';
const weatherToken = tokens.find(t => /^(DZ|RA|SN|TS|FG|BR|HZ|SA|DU|SS|DS)$/.test(t)) || '';
let weather = 'No weather of significance to aviation';
if (weatherToken) {
  const weatherMap: { [key: string]: string } = {
    DZ: 'Drizzle',
    RA: 'Rain',
    SN: 'Snow',
    TS: 'Thunderstorm',
    FG: 'Fog',
    BR: 'Mist',
    HZ: 'Haze',
    SA: 'Sand',
    DU: 'Dust',
    SS: 'Sandstorm',
    DS: 'Duststorm',
  };
  weather = weatherMap[weatherToken] || `Weather: ${weatherToken}`;
}

    return {
      station: stationFull,
      observationTime,
      windSpeed,
      windDirection,
      windVariation,
      windGusts,
      visibility,
      clouds,
      temperature,
      dewPoint,
      qnh,
      weather,
      trend,
    };
  }

}
