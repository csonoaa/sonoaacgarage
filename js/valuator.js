document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('carForm');
    const resultElement = document.getElementById('offerResult');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const carInfo = {
            make: formData.get('make'),
            model: formData.get('model'),
            year: parseInt(formData.get('year')),
            mileage: parseInt(formData.get('mileage')),
            condition: formData.get('condition'),
            converter: formData.get('converter'),
            drivable: formData.get('drivable'),
            marketPrice: parseFloat(formData.get('marketPrice'))
        };

        const offer = calculateOffer(carInfo);
        displayResult(offer);
    });

    function calculateOffer(carInfo) {
        let offer = carInfo.marketPrice;

        // Condition adjustments
        switch (carInfo.condition) {
            case 'Good':
                offer *= 0.95;
                break;
            case 'Fair':
                offer *= 0.85;
                break;
            case 'Bad':
                offer *= 0.70;
                break;
            case 'Non-Drivable':
                offer *= 0.50;
                break;
        }

        // Mileage adjustments
        if (carInfo.mileage > 200000) {
            offer *= 0.70;
        } else if (carInfo.mileage > 150000) {
            offer *= 0.80;
        } else if (carInfo.mileage > 100000) {
            offer *= 0.90;
        } else if (carInfo.mileage > 50000) {
            offer *= 0.95;
        }

        // Additional factors
        if (carInfo.converter === 'no') {
            offer -= 1000;
        }

        if (carInfo.drivable === 'no') {
            offer *= 0.80;
        }

        // Ensure offer is not negative
        offer = Math.max(0, offer);

        return {
            basePrice: carInfo.marketPrice,
            finalOffer: Math.round(offer),
            deductions: {
                condition: carInfo.condition,
                mileage: carInfo.mileage,
                converter: carInfo.converter,
                drivable: carInfo.drivable
            }
        };
    }

    function displayResult(offer) {
        const deductions = [];
        
        if (offer.deductions.condition !== 'Great') {
            deductions.push(`Condition (${offer.deductions.condition})`);
        }
        
        if (offer.deductions.mileage > 50000) {
            deductions.push(`Mileage (${offer.deductions.mileage} miles)`);
        }
        
        if (offer.deductions.converter === 'no') {
            deductions.push('Missing Catalytic Converter');
        }
        
        if (offer.deductions.drivable === 'no') {
            deductions.push('Non-Drivable');
        }

        const resultHTML = `
            <div class="offer-result">
                <p>Base Price: $${offer.basePrice.toLocaleString()}</p>
                <p>Final Offer: $${offer.finalOffer.toLocaleString()}</p>
                ${deductions.length > 0 ? `
                    <p>Deductions Applied:</p>
                    <ul>
                        ${deductions.map(deduction => `<li>${deduction}</li>`).join('')}
                    </ul>
                ` : ''}
                <p>This offer is valid for 7 days.</p>
            </div>
        `;

        resultElement.innerHTML = resultHTML;
    }
}); 