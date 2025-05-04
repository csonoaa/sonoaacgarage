export const carPrices: { [make: string]: { [model: string]: number } } = {
    "Toyota": {
        "Camry": 7000,
        "Corolla": 6500,
        "RAV4": 8000,
        "Highlander": 9000,
        "Tacoma": 8500,
        "Tundra": 10000,
        "Sienna": 9500
    },
    "Hyundai": {
        "Elantra": 6000,
        "Sonata": 6500,
        "Tucson": 7500,
        "Santa Fe": 8000,
        "Kona": 7000,
        "Palisade": 9000,
        "Venue": 6500
    },
    "Honda": {
        "Civic": 6800,
        "Accord": 7200,
        "CR-V": 7900,
        "Pilot": 8500,
        "Odyssey": 9000,
        "HR-V": 7500,
        "Ridgeline": 9500
    },
    "Ford": {
        "Focus": 6000,
        "Fusion": 6500,
        "Escape": 7500,
        "Explorer": 8500,
        "F-150": 9500,
        "Mustang": 8000,
        "Edge": 7800
    },
    "Chevrolet": {
        "Malibu": 6500,
        "Cruze": 6000,
        "Equinox": 7500,
        "Silverado": 9000,
        "Tahoe": 9500,
        "Traverse": 8500,
        "Camaro": 8000
    }
};

export const carData: { [make: string]: string[] } = {
    "Hyundai": ["Elantra", "Sonata", "Tucson", "Santa Fe", "Kona", "Palisade", "Venue"],
    "Toyota": ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma", "Tundra", "Sienna"],
    "Honda": ["Civic", "Accord", "CR-V", "Pilot", "Odyssey", "HR-V", "Ridgeline"],
    "Ford": ["Focus", "Fusion", "Escape", "Explorer", "F-150", "Mustang", "Edge"],
    "Chevrolet": ["Malibu", "Cruze", "Equinox", "Silverado", "Tahoe", "Traverse", "Camaro"],
    "Nissan": ["Altima", "Sentra", "Rogue", "Murano", "Pathfinder", "Frontier", "Titan"],
    "Kia": ["Forte", "Optima", "Sorento", "Telluride", "Sportage", "Soul", "Stinger"],
    "BMW": ["3 Series", "5 Series", "X3", "X5", "7 Series", "X1", "X7"],
    "Mercedes": ["C-Class", "E-Class", "GLC", "GLE", "S-Class", "A-Class", "GLA"],
    "Audi": ["A4", "A6", "Q5", "Q7", "A3", "Q3", "A5"],
    "Tesla": ["Model 3", "Model S", "Model X", "Model Y"],
    "Volkswagen": ["Jetta", "Passat", "Tiguan", "Atlas", "Golf", "Arteon", "ID.4"],
    "Subaru": ["Outback", "Forester", "Crosstrek", "Ascent", "Impreza", "Legacy", "WRX"],
    "Mazda": ["Mazda3", "Mazda6", "CX-5", "CX-9", "CX-30", "MX-5 Miata", "CX-3"],
    "Jeep": ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Renegade", "Gladiator"],
    "Lexus": ["ES", "RX", "NX", "GX", "LX", "IS", "UX"],
    "Dodge": ["Charger", "Challenger", "Durango", "Journey", "Grand Caravan"],
    "GMC": ["Sierra", "Yukon", "Acadia", "Terrain", "Canyon"],
    "Volvo": ["S60", "S90", "XC40", "XC60", "XC90", "V60", "V90"],
    "Land Rover": ["Range Rover", "Range Rover Sport", "Range Rover Velar", "Range Rover Evoque", "Discovery"]
}; 