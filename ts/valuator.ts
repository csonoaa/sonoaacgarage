import { Condition, State, CarInfo, FormValidation } from './types.js';
import { carData, carPrices } from './data.js';

// DOM Elements
const makeSelect = document.getElementById('make') as HTMLSelectElement;
const modelSelect = document.getElementById('model') as HTMLSelectElement;
const stateSelect = document.getElementById('state') as HTMLSelectElement;
const photoInput = document.getElementById('photos') as HTMLInputElement;
const photoPreview = document.getElementById('photoPreview') as HTMLDivElement;
const form = document.getElementById('carForm') as HTMLFormElement;
const resultElement = document.getElementById('offerResult') as HTMLDivElement;

// Initialize dropdowns
function initializeDropdowns(): void {
    // Populate Make dropdown
    Object.keys(carData).forEach(make => {
        const option = document.createElement('option');
        option.value = make;
        option.textContent = make;
        makeSelect.appendChild(option);
    });

    // Populate State dropdown
    Object.entries(State).forEach(([code, name]) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = name;
        stateSelect.appendChild(option);
    });
}

// Update Model dropdown based on selected Make
function updateModelDropdown(make: string): void {
    modelSelect.innerHTML = '<option value="">Select Model</option>';
    if (make && carData[make]) {
        carData[make].forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            modelSelect.appendChild(option);
        });
        modelSelect.disabled = false;
    } else {
        modelSelect.disabled = true;
    }
}

// Handle photo upload preview
function handlePhotoUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    photoPreview.innerHTML = '';
    
    if (input.files && input.files.length > 0) {
        Array.from(input.files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target?.result as string;
                    img.className = 'photo-preview';
                    photoPreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Validate form inputs
function validateForm(form: HTMLFormElement): FormValidation {
    const errors: string[] = [];
    const year = parseInt((form.year as any).value);
    const mileage = parseInt((form.mileage as any).value);

    if (year < 1990 || year > new Date().getFullYear()) {
        errors.push('Please enter a valid year between 1990 and the current year.');
    }

    if (mileage < 0 || mileage > 300000) {
        errors.push('Please enter a valid mileage between 0 and 300,000.');
    }

    if (!form.make.value) {
        errors.push('Please select a car make.');
    }

    if (!form.model.value) {
        errors.push('Please select a car model.');
    }

    if (!form.state.value) {
        errors.push('Please select your state.');
    }

    if (!photoInput.files || photoInput.files.length === 0) {
        errors.push('Please upload at least one photo of your car.');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Calculate offer based on car info
function calculateOffer(car: CarInfo): number {
    // Get base price from pricing table
    const basePrice = carPrices[car.make][car.model];
    let offer = basePrice;

    // Year depreciation (2% per year)
    const currentYear = new Date().getFullYear();
    const yearsOld = currentYear - car.year;
    offer *= Math.pow(0.98, yearsOld);

    // Condition adjustments
    switch (car.condition) {
        case Condition.Good:
            offer *= 0.95;
            break;
        case Condition.Fair:
            offer *= 0.85;
            break;
        case Condition.Bad:
            offer *= 0.70;
            break;
        case Condition.NonDrivable:
            offer *= 0.50;
            break;
    }

    // Mileage adjustments
    if (car.mileage > 200000) {
        offer *= 0.70;
    } else if (car.mileage > 150000) {
        offer *= 0.80;
    } else if (car.mileage > 100000) {
        offer *= 0.90;
    } else if (car.mileage > 50000) {
        offer *= 0.95;
    }

    // Additional factors
    if (!car.catalyticConverterPresent) {
        offer -= 1000;
    }

    if (!car.isDrivable) {
        offer *= 0.80;
    }

    // State-specific adjustments
    const highValueStates = [State.CA, State.NY, State.TX, State.FL];
    if (highValueStates.includes(car.state)) {
        offer *= 1.05; // 5% premium for high-value states
    }

    return Math.max(0, Math.round(offer));
}

// Display offer result
function displayResult(car: CarInfo, offer: number): void {
    const deductions = [];
    
    if (car.condition !== Condition.Great) {
        deductions.push(`Condition (${car.condition})`);
    }
    
    if (car.mileage > 50000) {
        deductions.push(`Mileage (${car.mileage.toLocaleString()} miles)`);
    }
    
    if (!car.catalyticConverterPresent) {
        deductions.push('Missing Catalytic Converter');
    }
    
    if (!car.isDrivable) {
        deductions.push('Non-Drivable');
    }

    resultElement.innerHTML = `
        <div class="result-card">
            <h3>Your Offer: $${offer.toLocaleString()}</h3>
            <p>For your ${car.year} ${car.make} ${car.model} in ${car.condition} condition.</p>
            ${deductions.length > 0 ? `
                <p>Deductions Applied:</p>
                <ul>
                    ${deductions.map(deduction => `<li>${deduction}</li>`).join('')}
                </ul>
            ` : ''}
            <p>This offer is valid for 7 days.</p>
            <div class="photo-preview-container">
                ${Array.from(photoInput.files || []).map(file => `
                    <img src="${URL.createObjectURL(file)}" class="photo-preview" alt="Car photo">
                `).join('')}
            </div>
        </div>
    `;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeDropdowns();

    makeSelect.addEventListener('change', () => {
        updateModelDropdown(makeSelect.value);
    });

    photoInput.addEventListener('change', handlePhotoUpload);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const validation = validateForm(form);
        if (!validation.isValid) {
            alert(validation.errors.join('\n'));
            return;
        }

        const car: CarInfo = {
            make: (form.make as any).value,
            model: (form.model as any).value,
            year: parseInt((form.year as any).value),
            mileage: parseInt((form.mileage as any).value),
            condition: (form.condition as any).value as Condition,
            catalyticConverterPresent: (form.converter as any).value === 'yes',
            isDrivable: (form.drivable as any).value === 'yes',
            state: (form.state as any).value as State,
            photos: photoInput.files ? Array.from(photoInput.files) : undefined
        };

        const offer = calculateOffer(car);
        displayResult(car, offer);
    });
}); 