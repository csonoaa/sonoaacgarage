export enum Condition {
    Great = "Great",
    Good = "Good",
    Fair = "Fair",
    Bad = "Bad",
    NonDrivable = "Non-Drivable"
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
    White = "White",
    Black = "Black",
    Silver = "Silver",
    Gray = "Gray",
    Red = "Red",
    Blue = "Blue",
    Green = "Green",
    Brown = "Brown",
    Beige = "Beige",
    Gold = "Gold",
    Orange = "Orange",
    Yellow = "Yellow"
}

export interface CarInfo {
    make: string;
    model: string;
    year: number;
    mileage: number;
    condition: Condition;
    color: Color;
    catalyticConverterPresent: boolean;
    isDrivable: boolean;
    state: State;
    photos: File[];
}

export interface OfferCalculation {
    basePrice: number;
    cutAmount: number;
    conditionDeduction: number;
    catalyticConverterDeduction: number;
    mileageDeduction: number;
    nonDrivableCap: number | null;
    finalOffer: number;
}

export interface FormElements {
    make: HTMLSelectElement;
    model: HTMLSelectElement;
    year: HTMLSelectElement;
    condition: HTMLSelectElement;
    mileage: HTMLInputElement;
    state: HTMLSelectElement;
    color: HTMLSelectElement;
    catalyticConverter: HTMLInputElement;
    drivable: HTMLInputElement;
    photos: HTMLInputElement;
    photoPreview: HTMLDivElement;
    result: HTMLDivElement;
    form: HTMLFormElement;
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