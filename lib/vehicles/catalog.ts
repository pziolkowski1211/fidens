// lib/vehicles/catalog.ts
export type VehicleCategory = 'osobowe_dostawcze' | 'ciezki_transport' | 'maszyna' | 'maszyna_przemyslowa' | 'maszyna_przemyslowa'

export interface VehicleSuggestion {
  brand: string
  model?: string
  category: VehicleCategory
  label: string
  searchKey: string
}

function s(brand: string, models: string[], category: VehicleCategory): VehicleSuggestion[] {
  const brandSuggestion: VehicleSuggestion = {
    brand,
    category,
    label: brand,
    searchKey: brand.toLowerCase(),
  }
  const modelSuggestions = models.map((model) => ({
    brand,
    model,
    category,
    label: brand + ' ' + model,
    searchKey: (brand + ' ' + model).toLowerCase(),
  }))
  return [brandSuggestion, ...modelSuggestions]
}

const LEKKIE: VehicleSuggestion[] = [
  ...s('Audi',       ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron'], 'osobowe_dostawcze'),
  ...s('BMW',        ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X6', 'X7', 'iX'], 'osobowe_dostawcze'),
  ...s('Mercedes',   ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'CLA', 'CLS', 'GLA', 'GLC', 'GLE', 'GLS', 'EQC', 'EQE', 'EQS'], 'osobowe_dostawcze'),
  ...s('Volkswagen', ['Golf', 'Passat', 'Arteon', 'Tiguan', 'Touareg', 'T-Roc', 'ID.3', 'ID.4', 'ID.5'], 'osobowe_dostawcze'),
  ...s('Skoda',      ['Octavia', 'Superb', 'Kodiaq', 'Karoq', 'Kamiq', 'Enyaq'], 'osobowe_dostawcze'),
  ...s('Toyota',     ['Corolla', 'Camry', 'RAV4', 'C-HR', 'Highlander', 'Land Cruiser', 'Yaris'], 'osobowe_dostawcze'),
  ...s('Lexus',      ['IS', 'ES', 'LS', 'NX', 'RX', 'UX'], 'osobowe_dostawcze'),
  ...s('Volvo',      ['XC40', 'XC60', 'XC90', 'S60', 'S90', 'V60', 'V90'], 'osobowe_dostawcze'),
  ...s('Porsche',    ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan'], 'osobowe_dostawcze'),
  ...s('Tesla',      ['Model 3', 'Model Y', 'Model S', 'Model X'], 'osobowe_dostawcze'),
  ...s('Ford',       ['Focus', 'Mondeo', 'Kuga', 'Mustang', 'Mustang Mach-E', 'Puma'], 'osobowe_dostawcze'),
  ...s('Opel',       ['Astra', 'Insignia', 'Mokka', 'Grandland', 'Crossland'], 'osobowe_dostawcze'),
  ...s('Peugeot',    ['208', '308', '508', '2008', '3008', '5008'], 'osobowe_dostawcze'),
  ...s('Renault',    ['Clio', 'Megane', 'Captur', 'Kadjar', 'Talisman', 'Arkana'], 'osobowe_dostawcze'),
  ...s('Hyundai',    ['i30', 'Tucson', 'Santa Fe', 'Kona', 'Ioniq 5', 'Ioniq 6'], 'osobowe_dostawcze'),
  ...s('Kia',        ['Ceed', 'Sportage', 'Sorento', 'Niro', 'EV6'], 'osobowe_dostawcze'),
  ...s('Mazda',      ['CX-3', 'CX-5', 'CX-30', 'CX-60', 'Mazda 3', 'Mazda 6'], 'osobowe_dostawcze'),
  ...s('Honda',      ['Civic', 'CR-V', 'HR-V', 'Jazz'], 'osobowe_dostawcze'),
  ...s('Jeep',       ['Compass', 'Renegade', 'Grand Cherokee', 'Wrangler'], 'osobowe_dostawcze'),
  ...s('Land Rover', ['Discovery', 'Defender', 'Range Rover', 'Range Rover Sport', 'Range Rover Velar', 'Range Rover Evoque'], 'osobowe_dostawcze'),
  ...s('Jaguar',     ['XE', 'XF', 'F-Pace', 'E-Pace', 'I-Pace'], 'osobowe_dostawcze'),
  ...s('Mini',       ['Cooper', 'Countryman', 'Clubman'], 'osobowe_dostawcze'),
  ...s('Cupra',      ['Leon', 'Formentor', 'Ateca', 'Born'], 'osobowe_dostawcze'),
  ...s('Seat',       ['Leon', 'Ateca', 'Arona', 'Ibiza'], 'osobowe_dostawcze'),
  ...s('Nissan',     ['Qashqai', 'X-Trail', 'Juke', 'Leaf', 'Ariya'], 'osobowe_dostawcze'),
  ...s('Dacia',      ['Duster', 'Sandero', 'Jogger', 'Spring'], 'osobowe_dostawcze'),
  ...s('Fiat',       ['500', 'Tipo', 'Panda', '500X'], 'osobowe_dostawcze'),
  ...s('Citroen',    ['C3', 'C4', 'C5 Aircross', 'Berlingo'], 'osobowe_dostawcze'),
  ...s('Mercedes-Benz', ['Sprinter', 'Vito'], 'osobowe_dostawcze'),
  ...s('Ford',          ['Transit', 'Transit Custom', 'Ranger'], 'osobowe_dostawcze'),
  ...s('Volkswagen',    ['Crafter', 'Transporter', 'Caddy'], 'osobowe_dostawcze'),
  ...s('Peugeot',       ['Boxer', 'Expert', 'Partner'], 'osobowe_dostawcze'),
  ...s('Citroen',       ['Jumper', 'Jumpy', 'Berlingo'], 'osobowe_dostawcze'),
  ...s('Fiat',          ['Ducato', 'Doblo', 'Talento'], 'osobowe_dostawcze'),
  ...s('Opel',          ['Movano', 'Vivaro', 'Combo'], 'osobowe_dostawcze'),
  ...s('Renault',       ['Master', 'Trafic', 'Kangoo'], 'osobowe_dostawcze'),
  ...s('Iveco',         ['Daily'], 'osobowe_dostawcze'),
  ...s('MAN',           ['TGE'], 'osobowe_dostawcze'),
]

const CIEZKI_TRANSPORT: VehicleSuggestion[] = [
  ...s('Mercedes-Benz', ['Actros', 'Atego', 'Arocs'], 'ciezki_transport'),
  ...s('Volvo',         ['FH', 'FH 460', 'FH 500', 'FM', 'FE'], 'ciezki_transport'),
  ...s('Scania',        ['R 450', 'R 500', 'R 540', 'S 500', 'S 540', 'P 280'], 'ciezki_transport'),
  ...s('MAN',           ['TGX', 'TGS', 'TGM', 'TGL'], 'ciezki_transport'),
  ...s('DAF',           ['XF', 'XG', 'CF', 'LF'], 'ciezki_transport'),
  ...s('Renault Trucks',['T 480', 'T 520', 'C', 'K', 'D'], 'ciezki_transport'),
  ...s('Iveco',         ['Eurocargo', 'Stralis', 'S-Way'], 'ciezki_transport'),
  ...s('Wielton',           ['Naczepa plandekowana', 'Naczepa chłodnia', 'Naczepa wywrotka', 'Naczepa niskopodwoziowa'], 'ciezki_transport'),
  ...s('Krone',             ['Naczepa plandekowana', 'Naczepa chłodnia', 'Naczepa typu Mega'], 'ciezki_transport'),
  ...s('Schmitz Cargobull', ['Naczepa plandekowana', 'Naczepa chłodnia', 'Naczepa typu Mega'], 'ciezki_transport'),
  ...s('Kögel',             ['Naczepa plandekowana', 'Naczepa chłodnia'], 'ciezki_transport'),
  ...s('Kässbohrer',        ['Naczepa niskopodwoziowa', 'Naczepa wywrotka', 'Naczepa do przewozu kontenerów'], 'ciezki_transport'),
]

const MASZYNY: VehicleSuggestion[] = [
  ...s('Caterpillar',  ['320', '323', '330', '336', '950', '966', '980', 'D6', 'D8'], 'maszyna'),
  ...s('Komatsu',      ['PC210', 'PC240', 'PC290', 'PC360', 'WA320', 'WA470'], 'maszyna'),
  ...s('Volvo CE',     ['EC220', 'EC250', 'EC300', 'EC380', 'L60', 'L90', 'L120'], 'maszyna'),
  ...s('Hitachi',      ['ZX 210', 'ZX 250', 'ZX 290', 'ZX 350'], 'maszyna'),
  ...s('JCB',          ['3CX', '4CX', '5CX', 'JS220', 'JS260', 'JS330'], 'maszyna'),
  ...s('Liebherr',     ['R 920', 'R 924', 'R 926', 'L 538', 'L 550', 'L 566'], 'maszyna'),
  ...s('Hyundai CE',   ['HX220', 'HX260', 'HX300', 'HX330'], 'maszyna'),
  ...s('Doosan',       ['DX225', 'DX255', 'DX300', 'DX380'], 'maszyna'),
  ...s('Bobcat',       ['S570', 'S650', 'T590', 'T770', 'E35', 'E50'], 'maszyna'),
  ...s('Manitou',      ['MT 625', 'MT 732', 'MT 1840', 'MLT 625', 'MLT 737'], 'maszyna'),
  ...s('Kubota',       ['KX 016', 'KX 027', 'KX 030', 'U 27', 'U 36'], 'maszyna'),
  ...s('Wacker Neuson',['ET 16', 'ET 20', 'EZ 17', 'EZ 28', 'EZ 38'], 'maszyna'),
]

export const VEHICLE_CATALOG: VehicleSuggestion[] = [
  ...LEKKIE,
  ...CIEZKI_TRANSPORT,
  ...MASZYNY,
]

export function searchVehicles(query: string, limit = 8): VehicleSuggestion[] {
  const q = query.trim().toLowerCase()
  if (q.length < 1) return []

  const startsWith: VehicleSuggestion[] = []
  const includes: VehicleSuggestion[] = []

  for (const item of VEHICLE_CATALOG) {
    if (item.searchKey.startsWith(q)) {
      startsWith.push(item)
    } else if (item.searchKey.includes(q)) {
      includes.push(item)
    }
    if (startsWith.length >= limit) break
  }

  return [...startsWith, ...includes].slice(0, limit)
}