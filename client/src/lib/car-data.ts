import { CarMake, CarModel, CarTrim } from "@/types/car";

export const carMakes: CarMake[] = [
  { id: "toyota", name: "Toyota" },
  { id: "honda", name: "Honda" },
  { id: "ford", name: "Ford" },
  { id: "chevrolet", name: "Chevrolet" },
  { id: "bmw", name: "BMW" },
  { id: "mercedes", name: "Mercedes-Benz" },
  { id: "audi", name: "Audi" },
  { id: "hyundai", name: "Hyundai" },
  { id: "kia", name: "Kia" },
  { id: "nissan", name: "Nissan" },
  { id: "subaru", name: "Subaru" },
  { id: "volkswagen", name: "Volkswagen" },
  { id: "lexus", name: "Lexus" },
  { id: "mazda", name: "Mazda" },
  { id: "jeep", name: "Jeep" },
];

export const carModels: CarModel[] = [
  // Toyota
  { id: "camry", makeId: "toyota", name: "Camry" },
  { id: "corolla", makeId: "toyota", name: "Corolla" },
  { id: "rav4", makeId: "toyota", name: "RAV4" },
  { id: "highlander", makeId: "toyota", name: "Highlander" },
  { id: "tacoma", makeId: "toyota", name: "Tacoma" },
  { id: "4runner", makeId: "toyota", name: "4Runner" },
  { id: "prius", makeId: "toyota", name: "Prius" },
  
  // Honda
  { id: "accord", makeId: "honda", name: "Accord" },
  { id: "civic", makeId: "honda", name: "Civic" },
  { id: "cr-v", makeId: "honda", name: "CR-V" },
  { id: "pilot", makeId: "honda", name: "Pilot" },
  { id: "odyssey", makeId: "honda", name: "Odyssey" },
  { id: "hr-v", makeId: "honda", name: "HR-V" },
  { id: "fit", makeId: "honda", name: "Fit" },
  
  // Ford
  { id: "f-150", makeId: "ford", name: "F-150" },
  { id: "escape", makeId: "ford", name: "Escape" },
  { id: "explorer", makeId: "ford", name: "Explorer" },
  { id: "edge", makeId: "ford", name: "Edge" },
  { id: "mustang", makeId: "ford", name: "Mustang" },
  { id: "bronco", makeId: "ford", name: "Bronco" },
  { id: "ranger", makeId: "ford", name: "Ranger" },
  
  // Chevrolet
  { id: "silverado", makeId: "chevrolet", name: "Silverado" },
  { id: "equinox", makeId: "chevrolet", name: "Equinox" },
  { id: "malibu", makeId: "chevrolet", name: "Malibu" },
  { id: "tahoe", makeId: "chevrolet", name: "Tahoe" },
  { id: "traverse", makeId: "chevrolet", name: "Traverse" },
  { id: "camaro", makeId: "chevrolet", name: "Camaro" },
  { id: "blazer", makeId: "chevrolet", name: "Blazer" },
  
  // BMW
  { id: "3-series", makeId: "bmw", name: "3 Series" },
  { id: "5-series", makeId: "bmw", name: "5 Series" },
  { id: "x3", makeId: "bmw", name: "X3" },
  { id: "x5", makeId: "bmw", name: "X5" },
  { id: "7-series", makeId: "bmw", name: "7 Series" },
  { id: "x1", makeId: "bmw", name: "X1" },
  { id: "x7", makeId: "bmw", name: "X7" },
  
  // Mercedes-Benz
  { id: "c-class", makeId: "mercedes", name: "C-Class" },
  { id: "e-class", makeId: "mercedes", name: "E-Class" },
  { id: "glc", makeId: "mercedes", name: "GLC" },
  { id: "gle", makeId: "mercedes", name: "GLE" },
  { id: "s-class", makeId: "mercedes", name: "S-Class" },
  { id: "a-class", makeId: "mercedes", name: "A-Class" },
  { id: "cla", makeId: "mercedes", name: "CLA" },
  
  // Continue with other makes...
  // Hyundai
  { id: "tucson", makeId: "hyundai", name: "Tucson" },
  { id: "santa-fe", makeId: "hyundai", name: "Santa Fe" },
  { id: "elantra", makeId: "hyundai", name: "Elantra" },
  { id: "sonata", makeId: "hyundai", name: "Sonata" },
];

export const carTrims: CarTrim[] = [
  // Toyota Camry trims
  { id: "camry-le", modelId: "camry", name: "LE" },
  { id: "camry-se", modelId: "camry", name: "SE" },
  { id: "camry-xle", modelId: "camry", name: "XLE" },
  { id: "camry-xse", modelId: "camry", name: "XSE" },
  { id: "camry-trd", modelId: "camry", name: "TRD" },
  
  // Honda Accord trims
  { id: "accord-lx", modelId: "accord", name: "LX" },
  { id: "accord-sport", modelId: "accord", name: "Sport" },
  { id: "accord-ex", modelId: "accord", name: "EX" },
  { id: "accord-exl", modelId: "accord", name: "EX-L" },
  { id: "accord-touring", modelId: "accord", name: "Touring" },
  
  // Ford F-150 trims
  { id: "f150-xl", modelId: "f-150", name: "XL" },
  { id: "f150-xlt", modelId: "f-150", name: "XLT" },
  { id: "f150-lariat", modelId: "f-150", name: "Lariat" },
  { id: "f150-king-ranch", modelId: "f-150", name: "King Ranch" },
  { id: "f150-platinum", modelId: "f-150", name: "Platinum" },
  { id: "f150-limited", modelId: "f-150", name: "Limited" },
  { id: "f150-raptor", modelId: "f-150", name: "Raptor" },
];

export const years = Array.from({ length: 26 }, (_, i) => (2023 - i).toString());

export const bodyTypes = [
  { id: "sedan", name: "Sedan" },
  { id: "suv", name: "SUV" },
  { id: "coupe", name: "Coupe" },
  { id: "truck", name: "Truck" },
  { id: "hatchback", name: "Hatchback" },
  { id: "convertible", name: "Convertible" },
  { id: "wagon", name: "Wagon" },
  { id: "van", name: "Van/Minivan" },
];

export const transmissions = [
  { id: "automatic", name: "Automatic" },
  { id: "manual", name: "Manual" },
  { id: "cvt", name: "CVT" },
  { id: "semi-auto", name: "Semi-Automatic" },
];

export const drivetrains = [
  { id: "fwd", name: "Front-Wheel Drive (FWD)" },
  { id: "rwd", name: "Rear-Wheel Drive (RWD)" },
  { id: "awd", name: "All-Wheel Drive (AWD)" },
  { id: "4wd", name: "Four-Wheel Drive (4WD)" },
];

export const colors = [
  { id: "black", name: "Black" },
  { id: "white", name: "White" },
  { id: "silver", name: "Silver" },
  { id: "gray", name: "Gray" },
  { id: "red", name: "Red" },
  { id: "blue", name: "Blue" },
  { id: "green", name: "Green" },
  { id: "brown", name: "Brown" },
  { id: "gold", name: "Gold" },
  { id: "other", name: "Other" },
];

export const getModelsByMake = (makeId: string): CarModel[] => {
  return carModels.filter(model => model.makeId === makeId);
};

export const getTrimsByModel = (modelId: string): CarTrim[] => {
  return carTrims.filter(trim => trim.modelId === modelId);
};

export const getMakeName = (makeId: string): string => {
  const make = carMakes.find(make => make.id === makeId);
  return make ? make.name : "";
};

export const getModelName = (modelId: string): string => {
  const model = carModels.find(model => model.id === modelId);
  return model ? model.name : "";
};

export const getTrimName = (trimId: string): string => {
  const trim = carTrims.find(trim => trim.id === trimId);
  return trim ? trim.name : "";
};
