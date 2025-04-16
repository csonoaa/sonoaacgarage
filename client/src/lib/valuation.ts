import { CarFormData, CarConditionData, CarOffer } from "@/types/car";

// Base values for popular models (in USD)
const baseValues: Record<string, number> = {
  // Toyota
  "camry": 18000,
  "corolla": 15000,
  "rav4": 20000,
  "tacoma": 25000,
  
  // Honda
  "accord": 17500,
  "civic": 14500,
  "cr-v": 19000,
  
  // Ford
  "f-150": 30000,
  "escape": 18000,
  "mustang": 26000,
  
  // Chevrolet
  "silverado": 28000,
  "malibu": 16000,
  "equinox": 17000,
  
  // Default for other models
  "default": 12000
};

// Year multipliers
const getYearMultiplier = (year: string): number => {
  const yearNum = parseInt(year);
  if (yearNum >= 2020) return 1.2;
  if (yearNum >= 2018) return 1.0;
  if (yearNum >= 2015) return 0.8;
  if (yearNum >= 2012) return 0.6;
  if (yearNum >= 2010) return 0.5;
  if (yearNum >= 2005) return 0.3;
  return 0.2;
};

// Mileage multipliers
const getMileageMultiplier = (mileage: string): number => {
  const mileageNum = parseInt(mileage);
  if (mileageNum <= 10000) return 1.2;
  if (mileageNum <= 30000) return 1.1;
  if (mileageNum <= 60000) return 1.0;
  if (mileageNum <= 100000) return 0.8;
  if (mileageNum <= 150000) return 0.6;
  if (mileageNum <= 200000) return 0.4;
  return 0.25;
};

// Condition multipliers
const getConditionMultiplier = (condition: string, drivable: string): number => {
  if (!drivable || drivable === "no") return 0.2;
  
  switch (condition) {
    case "excellent":
      return 1.1;
    case "good":
      return 1.0;
    case "fair":
      return 0.8;
    case "poor":
      return 0.6;
    default:
      return 1.0;
  }
};

// Body type multipliers
const getBodyTypeMultiplier = (bodyType: string): number => {
  switch (bodyType) {
    case "suv":
      return 1.1;
    case "truck":
      return 1.15;
    case "sedan":
      return 1.0;
    case "coupe":
      return 1.05;
    case "convertible":
      return 1.1;
    case "hatchback":
      return 0.95;
    case "wagon":
      return 0.9;
    case "van":
      return 0.85;
    default:
      return 1.0;
  }
};

// Calculate car valuation
export const calculateCarValuation = (
  carData: CarFormData,
  conditionData: CarConditionData
): CarOffer => {
  // Get base value for the model or use default
  let baseValue = baseValues[carData.model] || baseValues.default;
  
  // Apply multipliers
  const yearMultiplier = getYearMultiplier(carData.year);
  const mileageMultiplier = getMileageMultiplier(carData.mileage);
  const conditionMultiplier = getConditionMultiplier(conditionData.condition, conditionData.drivable);
  const bodyTypeMultiplier = getBodyTypeMultiplier(carData.bodyType);
  
  // Calculate offer
  let offerAmount = baseValue * yearMultiplier * mileageMultiplier * conditionMultiplier * bodyTypeMultiplier;
  
  // Round to nearest hundred
  offerAmount = Math.round(offerAmount / 100) * 100;
  
  return {
    offerAmount,
    offerValidDays: 7,
    carDetails: {
      year: carData.year,
      make: carData.make,
      model: carData.model,
      mileage: carData.mileage,
      color: carData.exteriorColor,
      condition: conditionData.condition,
      transmission: carData.transmission
    }
  };
};
