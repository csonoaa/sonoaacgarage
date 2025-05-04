import { 
    CarInfo, 
    Condition, 
    State, 
    Color, 
    OfferCalculation, 
    FormElements, 
    Deduction, 
    ResultDisplay 
} from './types.js';
import { carData, carPrices, colors } from './data.js';

class CarValuator {
    private elements: FormElements;
    private readonly CUT_PERCENTAGE = 0.37;
    private readonly NON_DRIVABLE_CAP = 900;

    constructor() {
        this.elements = this.initializeElements();
        this.initializeDropdowns();
        this.setupEventListeners();
    }

    private initializeElements(): FormElements {
        return {
            make: document.getElementById('make') as HTMLSelectElement,
            model: document.getElementById('model') as HTMLSelectElement,
            year: document.getElementById('year') as HTMLSelectElement,
            condition: document.getElementById('condition') as HTMLSelectElement,
            mileage: document.getElementById('mileage') as HTMLInputElement,
            state: document.getElementById('state') as HTMLSelectElement,
            color: document.getElementById('color') as HTMLSelectElement,
            catalyticConverter: document.getElementById('catalyticConverter') as HTMLInputElement,
            drivable: document.getElementById('drivable') as HTMLInputElement,
            photos: document.getElementById('photos') as HTMLInputElement,
            photoPreview: document.getElementById('photoPreview') as HTMLDivElement,
            result: document.getElementById('result') as HTMLDivElement,
            form: document.getElementById('carForm') as HTMLFormElement
        };
    }

    private initializeDropdowns(): void {
        this.populateMakeDropdown();
        this.populateYearDropdown();
        this.populateConditionDropdown();
        this.populateStateDropdown();
        this.populateColorDropdown();
    }

    private populateMakeDropdown(): void {
        Object.keys(carData).forEach(make => {
            const option = document.createElement('option');
            option.value = make;
            option.textContent = make;
            this.elements.make.appendChild(option);
        });
    }

    private populateYearDropdown(): void {
        const currentYear = new Date().getFullYear();
        for (let year = 2000; year <= currentYear; year++) {
            const option = document.createElement('option');
            option.value = year.toString();
            option.textContent = year.toString();
            this.elements.year.appendChild(option);
        }
    }

    private populateConditionDropdown(): void {
        Object.values(Condition).forEach(condition => {
            const option = document.createElement('option');
            option.value = condition;
            option.textContent = condition;
            this.elements.condition.appendChild(option);
        });
    }

    private populateStateDropdown(): void {
        Object.values(State).forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            this.elements.state.appendChild(option);
        });
    }

    private populateColorDropdown(): void {
        colors.forEach(color => {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = color;
            this.elements.color.appendChild(option);
        });
    }

    private setupEventListeners(): void {
        this.elements.make.addEventListener('change', () => this.handleMakeChange());
        this.elements.photos.addEventListener('change', (e) => this.handlePhotoUpload(e));
        this.elements.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    private handleMakeChange(): void {
        const selectedMake = this.elements.make.value;
        this.elements.model.innerHTML = '<option value="">Select Model</option>';
        this.elements.model.disabled = !selectedMake;

        if (selectedMake) {
            carData[selectedMake].forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                this.elements.model.appendChild(option);
            });
        }
    }

    private handlePhotoUpload(event: Event): void {
        this.elements.photoPreview.innerHTML = '';
        const files = (event.target as HTMLInputElement).files;
        
        if (files) {
            Array.from(files).forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = document.createElement('img');
                        img.src = e.target?.result as string;
                        img.classList.add('photo-preview');
                        this.elements.photoPreview.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    private handleFormSubmit(event: Event): void {
        event.preventDefault();
        
        const carInfo = this.getCarInfo();
        if (this.validateForm(carInfo)) {
            const offer = this.calculateOffer(carInfo);
            this.displayResult(offer);
        }
    }

    private getCarInfo(): CarInfo {
        return {
            make: this.elements.make.value,
            model: this.elements.model.value,
            year: parseInt(this.elements.year.value),
            condition: this.elements.condition.value as Condition,
            mileage: parseInt(this.elements.mileage.value),
            state: this.elements.state.value as State,
            color: this.elements.color.value as Color,
            catalyticConverterPresent: this.elements.catalyticConverter.checked,
            isDrivable: this.elements.drivable.checked,
            photos: Array.from(this.elements.photos.files || [])
        };
    }

    private validateForm(carInfo: CarInfo): boolean {
        if (!carInfo.make || !carInfo.model || !carInfo.year || !carInfo.condition || 
            !carInfo.mileage || !carInfo.state || !carInfo.color || !carInfo.photos.length) {
            alert('Please fill in all required fields and upload at least one photo.');
            return false;
        }
        return true;
    }

    private calculateOffer(carInfo: CarInfo): OfferCalculation {
        const basePrice = carPrices[carInfo.make][carInfo.model];
        const cutAmount = basePrice * this.CUT_PERCENTAGE;
        let offer = basePrice - cutAmount;

        // Calculate condition deduction
        const conditionDeduction = this.calculateConditionDeduction(carInfo.condition);
        offer -= conditionDeduction;

        // Calculate catalytic converter deduction
        const catalyticConverterDeduction = !carInfo.catalyticConverterPresent ? 300 : 0;
        offer -= catalyticConverterDeduction;

        // Calculate mileage deduction
        const mileageDeduction = this.calculateMileageDeduction(carInfo.mileage);
        offer -= mileageDeduction;

        // Apply non-drivable cap if needed
        const nonDrivableCap = this.shouldApplyNonDrivableCap(carInfo) ? this.NON_DRIVABLE_CAP : null;
        if (nonDrivableCap !== null) {
            offer = Math.min(offer, nonDrivableCap);
        }

        return {
            basePrice,
            cutAmount,
            conditionDeduction,
            catalyticConverterDeduction,
            mileageDeduction,
            nonDrivableCap,
            finalOffer: Math.max(offer, 0)
        };
    }

    private calculateConditionDeduction(condition: Condition): number {
        switch (condition) {
            case Condition.Fair:
                return 300;
            case Condition.Bad:
                return 500;
            default:
                return 0;
        }
    }

    private calculateMileageDeduction(mileage: number): number {
        if (mileage >= 150000) {
            return 600;
        } else if (mileage >= 120000) {
            return 300;
        }
        return 0;
    }

    private shouldApplyNonDrivableCap(carInfo: CarInfo): boolean {
        return carInfo.condition === Condition.NonDrivable || !carInfo.isDrivable;
    }

    private displayResult(calculation: OfferCalculation): void {
        const deductions: Deduction[] = [
            { description: 'Base Price', amount: calculation.basePrice },
            { description: '37% Cut', amount: calculation.cutAmount },
            { description: 'Condition Deduction', amount: calculation.conditionDeduction },
            { description: 'Catalytic Converter Deduction', amount: calculation.catalyticConverterDeduction },
            { description: 'Mileage Deduction', amount: calculation.mileageDeduction }
        ];

        if (calculation.nonDrivableCap !== null) {
            deductions.push({ 
                description: 'Non-Drivable Cap', 
                amount: calculation.nonDrivableCap 
            });
        }

        const result: ResultDisplay = {
            offer: calculation.finalOffer,
            carInfo: this.getCarInfo(),
            deductions
        };

        this.elements.result.innerHTML = this.generateResultHTML(result);
    }

    private generateResultHTML(result: ResultDisplay): string {
        return `
            <div class="result-card">
                <h3>Your Offer: $${result.offer.toLocaleString()}</h3>
                <div class="car-details">
                    <p><strong>${result.carInfo.year} ${result.carInfo.make} ${result.carInfo.model}</strong></p>
                    <p>Color: ${result.carInfo.color}</p>
                    <p>Mileage: ${result.carInfo.mileage.toLocaleString()} miles</p>
                    <p>Condition: ${result.carInfo.condition}</p>
                    <p>Location: ${result.carInfo.state}</p>
                </div>
                <div class="deductions">
                    <h4>Price Breakdown:</h4>
                    <ul>
                        ${result.deductions.map(d => `
                            <li>${d.description}: ${d.isPercentage ? 
                                `${(d.amount * 100).toFixed(0)}%` : 
                                `-$${d.amount.toLocaleString()}`}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="photo-preview-container">
                    <h4>Uploaded Photos:</h4>
                    <div class="photo-grid">
                        ${result.carInfo.photos.map(photo => `
                            <img src="${URL.createObjectURL(photo)}" alt="Car photo" class="photo-preview">
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize the valuator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CarValuator();
}); 