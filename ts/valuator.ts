import { Condition, State, CarInfo, FormValidation, Color } from './types.js';
import { carData, carPrices, colors } from './data.js';

// DOM Elements
const makeSelect = document.getElementById('make') as HTMLSelectElement;
const modelSelect = document.getElementById('model') as HTMLSelectElement;
const stateSelect = document.getElementById('state') as HTMLSelectElement;
const colorSelect = document.getElementById('color') as HTMLSelectElement;
const yearSelect = document.getElementById('year') as HTMLSelectElement;
const conditionSelect = document.getElementById('condition') as HTMLSelectElement;
const mileageInput = document.getElementById('mileage') as HTMLInputElement;
const catalyticConverterCheckbox = document.getElementById('catalyticConverter') as HTMLInputElement;
const drivableCheckbox = document.getElementById('drivable') as HTMLInputElement;
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

    // Populate Color dropdown
    colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = color;
        colorSelect.appendChild(option);
    });

    // Populate Year dropdown (2000 to current year)
    const currentYear = new Date().getFullYear();
    for (let year = 2000; year <= currentYear; year++) {
        const option = document.createElement('option');
        option.value = year.toString();
        option.textContent = year.toString();
        yearSelect.appendChild(option);
    }

    // Populate Condition dropdown
    Object.values(Condition).forEach(condition => {
        const option = document.createElement('option');
        option.value = condition;
        option.textContent = condition;
        conditionSelect.appendChild(option);
    });
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
    let offer = basePrice * 0.63; // Apply 37% cut

    // Apply condition penalties
    switch (car.condition) {
        case Condition.Fair:
            offer -= 300;
            break;
        case Condition.Bad:
            offer -= 500;
            break;
        case Condition.NonDrivable:
            // No immediate penalty, handled by cap rule
            break;
        // Great & Good have no penalty
    }

    // Catalytic converter penalty
    if (!car.catalyticConverterPresent) {
        offer -= 300;
    }

    // Mileage rule
    if (car.mileage >= 150000) {
        offer -= 600;
    } else if (car.mileage >= 120000) {
        offer -= 300;
    }

    // Non-drivable cap rule
    if (car.condition === Condition.NonDrivable || !car.isDrivable) {
        offer = Math.min(offer, 900);
    }

    // Never return less than $0
    return Math.max(offer, 0);
}

// Display offer result
function displayResult(car: CarInfo, offer: number): void {
    const deductions = [];
    
    // Base price and 37% cut
    const basePrice = carPrices[car.make][car.model];
    deductions.push(`Base Price: $${basePrice.toLocaleString()}`);
    deductions.push(`37% Cut: -$${(basePrice * 0.37).toLocaleString()}`);
    
    // Condition deduction
    switch (car.condition) {
        case Condition.Fair:
            deductions.push('Condition (Fair): -$300');
            break;
        case Condition.Bad:
            deductions.push('Condition (Bad): -$500');
            break;
        case Condition.NonDrivable:
            deductions.push('Condition (Non-Drivable): Cap Applied');
            break;
    }
    
    // Catalytic converter deduction
    if (!car.catalyticConverterPresent) {
        deductions.push('Missing Catalytic Converter: -$300');
    }
    
    // Mileage deduction
    if (car.mileage >= 150000) {
        deductions.push('Mileage (150,000+): -$600');
    } else if (car.mileage >= 120000) {
        deductions.push('Mileage (120,000+): -$300');
    }
    
    // Non-drivable cap
    if (car.condition === Condition.NonDrivable || !car.isDrivable) {
        deductions.push('Non-Drivable Cap: $900 Maximum');
    }
    
    // Create result HTML
    let resultHTML = `
        <div class="result-card">
            <h3>Your Offer: $${offer.toLocaleString()}</h3>
            <div class="car-details">
                <p><strong>${car.year} ${car.make} ${car.model}</strong></p>
                <p>Color: ${car.color}</p>
                <p>Mileage: ${car.mileage.toLocaleString()} miles</p>
                <p>Condition: ${car.condition}</p>
                <p>Location: ${car.state}</p>
            </div>
            <div class="deductions">
                <h4>Price Breakdown:</h4>
                <ul>
                    ${deductions.map(d => `<li>${d}</li>`).join('')}
                </ul>
            </div>
            <div class="photo-preview-container">
                <h4>Uploaded Photos:</h4>
                <div class="photo-grid">
                    ${Array.from(car.photos || []).map(photo => `
                        <img src="${URL.createObjectURL(photo)}" alt="Car photo" class="photo-preview">
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    resultElement.innerHTML = resultHTML;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeDropdowns();

    makeSelect.addEventListener('change', () => {
        const selectedMake = makeSelect.value;
        modelSelect.innerHTML = '<option value="">Select Model</option>';
        modelSelect.disabled = !selectedMake;

        if (selectedMake) {
            carData[selectedMake].forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                modelSelect.appendChild(option);
            });
        }
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
            color: (form.color as any).value as Color,
            photos: photoInput.files ? Array.from(photoInput.files) : undefined
        };

        const offer = calculateOffer(car);
        displayResult(car, offer);
    });
}); 