// lib/vehicles/catalog.ts
export type VehicleCategory = 'osobowe' | 'ciezarowe' | 'maszyna'

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

const OSOBOWE: VehicleSuggestion[] = [
  ...s('Audi',       ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron'], 'osobowe'),
  ...s('BMW',        ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X6', 'X7', 'iX'], 'osobowe'),
  ...s('Mercedes',   ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'CLA', 'CLS', 'GLA', 'GLC', 'GLE', 'GLS', 'EQC', 'EQE', 'EQS'], 'osobowe'),
  ...s('Volkswagen', ['Golf', 'Passat', 'Arteon', 'Tiguan', 'Touareg', 'T-Roc', 'ID.3', 'ID.4', 'ID.5'], 'osobowe'),
  ...s('Skoda',      ['Octavia', 'Superb', 'Kodiaq', 'Karoq', 'Kamiq', 'Enyaq'], 'osobowe'),
  ...s('Toyota',     ['Corolla', 'Camry', 'RAV4', 'C-HR', 'Highlander', 'Land Cruiser', 'Yaris'], 'osobowe'),
  ...s('Lexus',      ['IS', 'ES', 'LS', 'NX', 'RX', 'UX'], 'osobowe'),
  ...s('Volvo',      ['XC40', 'XC60', 'XC90', 'S60', 'S90', 'V60', 'V90'], 'osobowe'),
  ...s('Porsche',    ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan'], 'osobowe'),
  ...s('Tesla',      ['Model 3', 'Model Y', 'Model S', 'Model X'], 'osobowe'),
  ...s('Ford',       ['Focus', 'Mondeo', 'Kuga', 'Mustang', 'Mustang Mach-E', 'Puma'], 'osobowe'),
  ...s('Opel',       ['Astra', 'Insignia', 'Mokka', 'Grandland', 'Crossland'], 'osobowe'),
  ...s('Peugeot',    ['208', '308', '508', '2008', '3008', '5008'], 'osobowe'),
  ...s('Renault',    ['Clio', 'Megane', 'Captur', 'Kadjar', 'Talisman', 'Arkana'], 'osobowe'),
  ...s('Hyundai',    ['i30', 'Tucson', 'Santa Fe', 'Kona', 'Ioniq 5', 'Ioniq 6'], 'osobowe'),
  ...s('Kia',        ['Ceed', 'Sportage', 'Sorento', 'Niro', 'EV6'], 'osobowe'),
  ...s('Mazda',      ['CX-3', 'CX-5', 'CX-30', 'CX-60', 'Mazda 3', 'Mazda 6'], 'osobowe'),
  ...s('Honda',      ['Civic', 'CR-V', 'HR-V', 'Jazz'], 'osobowe'),
  ...s('Jeep',       ['Compass', 'Renegade', 'Grand Cherokee', 'Wrangler'], 'osobowe'),
  ...s('Land Rover', ['Discovery', 'Defender', 'Range Rover', 'Range Rover Sport', 'Range Rover Velar', 'Range Rover Evoque'], 'osobowe'),
  ...s('Jaguar',     ['XE', 'XF', 'F-Pace', 'E-Pace', 'I-Pace'], 'osobowe'),
  ...s('Mini',       ['Cooper', 'Countryman', 'Clubman'], 'osobowe'),
  ...s('Cupra',      ['Leon', 'Formentor', 'Ateca', 'Born'], 'osobowe'),
  ...s('Seat',       ['Leon', 'Ateca', 'Arona', 'Ibiza'], 'osobowe'),
  ...s('Nissan',     ['Qashqai', 'X-Trail', 'Juke', 'Leaf', 'Ariya'], 'osobowe'),
  ...s('Dacia',      ['Duster', 'Sandero', 'Jogger', 'Spring'], 'osobowe'),
  ...s('Fiat',       ['500', 'Tipo', 'Panda', '500X'], 'osobowe'),
  ...s('Citroen',    ['C3', 'C4', 'C5 Aircross', 'Berlingo'], 'osobowe'),
]

const CIEZAROWE: VehicleSuggestion[] = [
  ...s('Mercedes-Benz', ['Sprinter', 'Vito', 'Actros', 'Atego', 'Arocs'], 'ciezarowe'),
  ...s('Volvo',         ['FH', 'FH 460', 'FH 500', 'FM', 'FE'], 'ciezarowe'),
  ...s('Scania',        ['R 450', 'R 500', 'R 540', 'S 500', 'S 540', 'P 280'], 'ciezarowe'),
  ...s('MAN',           ['TGX', 'TGS', 'TGM', 'TGL', 'TGE'], 'ciezarowe'),
  ...s('DAF',           ['XF', 'XG', 'CF', 'LF'], 'ciezarowe'),
  ...s('Renault Trucks',['T 480', 'T 520', 'C', 'K', 'D'], 'ciezarowe'),
  ...s('Iveco',         ['Daily', 'Eurocargo', 'Stralis', 'S-Way'], 'ciezarowe'),
  ...s('Ford',          ['Transit', 'Transit Custom', 'Ranger'], 'ciezarowe'),
  ...s('Volkswagen',    ['Crafter', 'Transporter', 'Caddy'], 'ciezarowe'),
  ...s('Peugeot',       ['Boxer', 'Expert', 'Partner'], 'ciezarowe'),
  ...s('Citroen',       ['Jumper', 'Jumpy', 'Berlingo'], 'ciezarowe'),
  ...s('Fiat',          ['Ducato', 'Doblo', 'Talento'], 'ciezarowe'),
  ...s('Opel',          ['Movano', 'Vivaro', 'Combo'], 'ciezarowe'),
  ...s('Renault',       ['Master', 'Trafic', 'Kangoo'], 'ciezarowe'),
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
  ...OSOBOWE,
  ...CIEZAROWE,
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
