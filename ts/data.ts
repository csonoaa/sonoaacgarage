import { Color, Transmission, BodyType, Condition } from './types';

export const CAR_MAKES = [
    'Toyota', 'Honda', 'Hyundai', 'Ford', 'Chevrolet', 'Nissan',
    'BMW', 'Mercedes-Benz', 'Audi', 'Kia', 'Subaru', 'Volkswagen',
    'Jeep', 'Dodge', 'Chrysler', 'GMC', 'Ram', 'Acura', 'Infiniti',
    'Lexus', 'Mazda', 'Mitsubishi', 'Cadillac', 'Buick', 'Lincoln',
    'Volvo', 'Tesla'
];

export const COLORS = Object.values(Color);
export const TRANSMISSIONS = Object.values(Transmission);
export const BODY_TYPES = Object.values(BodyType);
export const CONDITIONS = Object.values(Condition);

// Base market prices for common makes/models (in USD)
export const MARKET_PRICES: Record<string, Record<string, number>> = {
    'Toyota': {
        'Camry': 15000,
        'Corolla': 12000,
        'RAV4': 18000,
        'Highlander': 25000,
        'Tacoma': 22000,
        'Tundra': 30000
    },
    'Honda': {
        'Civic': 12000,
        'Accord': 15000,
        'CR-V': 18000,
        'Pilot': 25000,
        'Odyssey': 22000
    },
    'Hyundai': {
        'Elantra': 10000,
        'Sonata': 12000,
        'Tucson': 15000,
        'Santa Fe': 18000
    },
    'Ford': {
        'F-150': 25000,
        'Escape': 15000,
        'Explorer': 20000,
        'Mustang': 22000,
        'Focus': 10000
    },
    'Chevrolet': {
        'Silverado': 25000,
        'Equinox': 15000,
        'Malibu': 12000,
        'Tahoe': 30000
    },
    'Nissan': {
        'Altima': 12000,
        'Rogue': 15000,
        'Sentra': 10000,
        'Pathfinder': 20000
    }
};

// Year depreciation factor (percentage of base price per year)
export const YEAR_DEPRECIATION = 0.05; // 5% per year

// Get base price for a make/model/year
export function getBasePrice(make: string, model: string, year: number): number {
    const currentYear = new Date().getFullYear();
    const yearsOld = currentYear - year;
    const basePrice = MARKET_PRICES[make]?.[model] || 10000; // Default to $10,000 if not found
    
    // Apply year depreciation
    return basePrice * Math.pow(1 - YEAR_DEPRECIATION, yearsOld);
}

export const carPrices: { [make: string]: { [model: string]: number } } = {
    "Toyota": {
        "Camry": 7000,
        "Corolla": 6500,
        "RAV4": 8000,
        "Highlander": 9000,
        "Tacoma": 8500
    },
    "Honda": {
        "Civic": 6800,
        "Accord": 7200,
        "CR-V": 7900,
        "Pilot": 8500,
        "Fit": 6000
    },
    "Hyundai": {
        "Elantra": 6000,
        "Sonata": 6500,
        "Tucson": 7500,
        "Santa Fe": 8000,
        "Accent": 5500
    },
    "Nissan": {
        "Altima": 6500,
        "Sentra": 6000,
        "Rogue": 7500,
        "Pathfinder": 8500,
        "Maxima": 7000
    },
    "Ford": {
        "F-150": 9500,
        "Escape": 7500,
        "Fusion": 7000,
        "Explorer": 8500,
        "Mustang": 8000
    },
    "Chevrolet": {
        "Silverado": 9000,
        "Equinox": 7500,
        "Malibu": 6500,
        "Traverse": 8500,
        "Cruze": 6000
    },
    "Kia": {
        "Optima": 6500,
        "Sorento": 7500,
        "Soul": 6000,
        "Sportage": 7000,
        "Forte": 6000
    },
    "Volkswagen": {
        "Jetta": 6500,
        "Passat": 7000,
        "Tiguan": 7500,
        "Golf": 6000,
        "Atlas": 8500
    },
    "Mazda": {
        "Mazda3": 6000,
        "Mazda6": 6500,
        "CX-5": 7500,
        "CX-9": 8500,
        "MX-5": 7000
    },
    "Subaru": {
        "Outback": 8000,
        "Forester": 7500,
        "Impreza": 6000,
        "Crosstrek": 7000,
        "Legacy": 6500
    },
    "Jeep": {
        "Grand Cherokee": 8500,
        "Wrangler": 9000,
        "Compass": 7000,
        "Renegade": 6500
    },
    "BMW": {
        "3 Series": 8000,
        "5 Series": 9000,
        "X3": 8500,
        "X5": 10000,
        "7 Series": 12000
    },
    "Mercedes-Benz": {
        "C-Class": 8500,
        "E-Class": 9500,
        "GLC": 9000,
        "GLE": 10000,
        "S-Class": 12000
    },
    "Audi": {
        "A3": 7500,
        "A4": 8000,
        "A6": 9000,
        "Q5": 8500,
        "Q7": 10000
    },
    "Lexus": {
        "RX": 9000,
        "ES": 8000,
        "NX": 8500,
        "IS": 7500,
        "GX": 10000
    },
    "Acura": {
        "MDX": 8500,
        "RDX": 8000,
        "TLX": 7500,
        "ILX": 7000
    },
    "Dodge": {
        "Charger": 7500,
        "Challenger": 8000,
        "Durango": 8500,
        "Journey": 7000
    },
    "Ram": {
        "1500": 9000,
        "2500": 10000,
        "ProMaster": 8500
    },
    "GMC": {
        "Sierra": 9000,
        "Terrain": 7500,
        "Acadia": 8500,
        "Yukon": 10000
    },
    "Tesla": {
        "Model 3": 12000,
        "Model S": 15000,
        "Model X": 16000,
        "Model Y": 13000
    },
    "Infiniti": {
        "Q50": 8000,
        "QX60": 8500,
        "QX80": 10000
    },
    "Volvo": {
        "S60": 7500,
        "XC60": 8500,
        "XC90": 9500
    },
    "Mitsubishi": {
        "Outlander": 7000,
        "Eclipse Cross": 6500,
        "Mirage": 5500
    },
    "Cadillac": {
        "Escalade": 12000,
        "XT5": 8500,
        "CT5": 8000,
        "CT4": 7500
    },
    "Buick": {
        "Encore": 6500,
        "Enclave": 8000,
        "Regal": 7000
    },
    "Lincoln": {
        "Navigator": 10000,
        "MKX": 8500,
        "MKZ": 7500
    },
    "Chrysler": {
        "300": 7000,
        "Pacifica": 8000
    },
    "Mini": {
        "Cooper": 6000,
        "Clubman": 6500,
        "Countryman": 7000
    },
    "Porsche": {
        "Cayenne": 12000,
        "Macan": 10000,
        "Panamera": 13000
    },
    "Land Rover": {
        "Range Rover": 15000,
        "Discovery": 10000,
        "Defender": 12000
    },
    "Jaguar": {
        "XE": 8000,
        "XF": 9000,
        "F-Pace": 9500
    },
    "Alfa Romeo": {
        "Giulia": 8000,
        "Stelvio": 8500
    },
    "Fiat": {
        "500": 5500,
        "500X": 6000
    }
};

export const carData: { [make: string]: string[] } = {
    "Toyota": ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma"],
    "Honda": ["Civic", "Accord", "CR-V", "Pilot", "Fit"],
    "Hyundai": ["Elantra", "Sonata", "Tucson", "Santa Fe", "Accent"],
    "Nissan": ["Altima", "Sentra", "Rogue", "Pathfinder", "Maxima"],
    "Ford": ["F-150", "Escape", "Fusion", "Explorer", "Mustang"],
    "Chevrolet": ["Silverado", "Equinox", "Malibu", "Traverse", "Cruze"],
    "Kia": ["Optima", "Sorento", "Soul", "Sportage", "Forte"],
    "Volkswagen": ["Jetta", "Passat", "Tiguan", "Golf", "Atlas"],
    "Mazda": ["Mazda3", "Mazda6", "CX-5", "CX-9", "MX-5"],
    "Subaru": ["Outback", "Forester", "Impreza", "Crosstrek", "Legacy"],
    "Jeep": ["Grand Cherokee", "Wrangler", "Compass", "Renegade"],
    "BMW": ["3 Series", "5 Series", "X3", "X5", "7 Series"],
    "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE", "S-Class"],
    "Audi": ["A3", "A4", "A6", "Q5", "Q7"],
    "Lexus": ["RX", "ES", "NX", "IS", "GX"],
    "Acura": ["MDX", "RDX", "TLX", "ILX"],
    "Dodge": ["Charger", "Challenger", "Durango", "Journey"],
    "Ram": ["1500", "2500", "ProMaster"],
    "GMC": ["Sierra", "Terrain", "Acadia", "Yukon"],
    "Tesla": ["Model 3", "Model S", "Model X", "Model Y"],
    "Infiniti": ["Q50", "QX60", "QX80"],
    "Volvo": ["S60", "XC60", "XC90"],
    "Mitsubishi": ["Outlander", "Eclipse Cross", "Mirage"],
    "Cadillac": ["Escalade", "XT5", "CT5", "CT4"],
    "Buick": ["Encore", "Enclave", "Regal"],
    "Lincoln": ["Navigator", "MKX", "MKZ"],
    "Chrysler": ["300", "Pacifica"],
    "Mini": ["Cooper", "Clubman", "Countryman"],
    "Porsche": ["Cayenne", "Macan", "Panamera"],
    "Land Rover": ["Range Rover", "Discovery", "Defender"],
    "Jaguar": ["XE", "XF", "F-Pace"],
    "Alfa Romeo": ["Giulia", "Stelvio"],
    "Fiat": ["500", "500X"]
};

export const colors: string[] = [
    "White",
    "Black",
    "Silver",
    "Gray",
    "Red",
    "Blue",
    "Green",
    "Brown",
    "Beige",
    "Gold",
    "Orange",
    "Yellow"
]; 