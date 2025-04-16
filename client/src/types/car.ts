export interface CarMake {
  id: string;
  name: string;
}

export interface CarModel {
  id: string;
  makeId: string;
  name: string;
}

export interface CarTrim {
  id: string;
  modelId: string;
  name: string;
}

export interface CarFormData {
  make: string;
  model: string;
  year: string;
  trim: string;
  bodyType: string;
  mileage: string;
  transmission: string;
  drivetrain: string;
  exteriorColor: string;
  vin: string;
}

export interface CarConditionData {
  drivable: string;
  condition: string;
  additionalInfo: string;
  photos?: File[];
}

export interface ContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  termsAgreed: boolean;
}

export interface FullCarData extends CarFormData, CarConditionData, ContactData {}

export interface CarOffer {
  offerAmount: number;
  offerValidDays: number;
  carDetails: {
    year: string;
    make: string;
    model: string;
    mileage: string;
    color: string;
    condition: string;
    transmission: string;
  };
}
