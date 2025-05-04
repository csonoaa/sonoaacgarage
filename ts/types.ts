export enum Condition {
    Great = "Great",
    Good = "Good",
    Fair = "Fair",
    Bad = "Bad",
    NonDrivable = "Non-Drivable"
}

export enum Transmission {
    Automatic = "Automatic",
    Manual = "Manual"
}

export enum BodyType {
    Sedan = "Sedan",
    SUV = "SUV",
    Truck = "Truck",
    Coupe = "Coupe",
    Wagon = "Wagon",
    Convertible = "Convertible",
    Van = "Van",
    Other = "Other"
}

export enum State {
    AL = "Alabama",
    AK = "Alaska",
    AZ = "Arizona",
    AR = "Arkansas",
    CA = "California",
    CO = "Colorado",
    CT = "Connecticut",
    DE = "Delaware",
    FL = "Florida",
    GA = "Georgia",
    HI = "Hawaii",
    ID = "Idaho",
    IL = "Illinois",
    IN = "Indiana",
    IA = "Iowa",
    KS = "Kansas",
    KY = "Kentucky",
    LA = "Louisiana",
    ME = "Maine",
    MD = "Maryland",
    MA = "Massachusetts",
    MI = "Michigan",
    MN = "Minnesota",
    MS = "Mississippi",
    MO = "Missouri",
    MT = "Montana",
    NE = "Nebraska",
    NV = "Nevada",
    NH = "New Hampshire",
    NJ = "New Jersey",
    NM = "New Mexico",
    NY = "New York",
    NC = "North Carolina",
    ND = "North Dakota",
    OH = "Ohio",
    OK = "Oklahoma",
    OR = "Oregon",
    PA = "Pennsylvania",
    RI = "Rhode Island",
    SC = "South Carolina",
    SD = "South Dakota",
    TN = "Tennessee",
    TX = "Texas",
    UT = "Utah",
    VT = "Vermont",
    VA = "Virginia",
    WA = "Washington",
    WV = "West Virginia",
    WI = "Wisconsin",
    WY = "Wyoming"
}

export enum Color {
    Black = "Black",
    White = "White",
    Silver = "Silver",
    Gray = "Gray",
    Blue = "Blue",
    Red = "Red",
    Brown = "Brown",
    Green = "Green",
    Gold = "Gold",
    Other = "Other"
}

export interface CarInfo {
    make: string;
    model: string;
    year: number;
    mileage: number;
    color: Color;
    transmission: Transmission;
    catalyticConverterPresent: boolean;
    bodyType: BodyType;
    condition: Condition;
    state: State;
    photos: File[];
}

export interface OfferCalculation {
    basePrice: number;
    companyCut: number;
    mileageDeduction: number;
    conditionDeduction: number;
    catalyticConverterDeduction: number;
    finalOffer: number;
}

export interface FormElements {
    make: HTMLSelectElement;
    model: HTMLInputElement;
    year: HTMLSelectElement;
    mileage: HTMLInputElement;
    color: HTMLSelectElement;
    transmission: HTMLSelectElement;
    catalyticConverter: HTMLSelectElement;
    bodyType: HTMLSelectElement;
    condition: HTMLSelectElement;
    form: HTMLFormElement;
    result: HTMLDivElement;
}

export interface Deduction {
    description: string;
    amount: number;
    isPercentage?: boolean;
}

export interface ResultDisplay {
    offer: number;
    carInfo: CarInfo;
    deductions: Deduction[];
}

export interface FormValidation {
    isValid: boolean;
    errors: string[];
} 