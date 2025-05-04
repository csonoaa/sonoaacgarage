document.addEventListener('DOMContentLoaded', () => {
    // Add any interactive elements or animations to the rules sections
    const rulesSections = document.querySelectorAll('.rules-section');
    
    rulesSections.forEach(section => {
        section.addEventListener('mouseenter', () => {
            section.style.transform = 'scale(1.02)';
            section.style.transition = 'transform 0.3s ease';
        });
        
        section.addEventListener('mouseleave', () => {
            section.style.transform = 'scale(1)';
        });
    });

    // Add a button to calculate example offers
    const main = document.querySelector('main');
    const exampleButton = document.createElement('button');
    exampleButton.className = 'example-button';
    exampleButton.textContent = 'See Example Calculations';
    main.appendChild(exampleButton);

    exampleButton.addEventListener('click', () => {
        showExampleCalculations();
    });

    function showExampleCalculations() {
        const examples = [
            {
                make: 'Toyota',
                model: 'Camry',
                year: 2020,
                mileage: 50000,
                condition: 'Great',
                converter: 'yes',
                drivable: 'yes',
                marketPrice: 25000
            },
            {
                make: 'Honda',
                model: 'Civic',
                year: 2018,
                mileage: 120000,
                condition: 'Good',
                converter: 'yes',
                drivable: 'yes',
                marketPrice: 18000
            },
            {
                make: 'Ford',
                model: 'F-150',
                year: 2015,
                mileage: 180000,
                condition: 'Fair',
                converter: 'no',
                drivable: 'yes',
                marketPrice: 15000
            }
        ];

        const examplesContainer = document.createElement('div');
        examplesContainer.className = 'examples-container';
        
        examples.forEach(example => {
            const offer = calculateExampleOffer(example);
            const exampleElement = document.createElement('div');
            exampleElement.className = 'example-offer';
            exampleElement.innerHTML = `
                <h4>${example.year} ${example.make} ${example.model}</h4>
                <ul>
                    <li>Mileage: ${example.mileage.toLocaleString()} miles</li>
                    <li>Condition: ${example.condition}</li>
                    <li>Catalytic Converter: ${example.converter === 'yes' ? 'Present' : 'Missing'}</li>
                    <li>Drivable: ${example.drivable === 'yes' ? 'Yes' : 'No'}</li>
                    <li>Market Price: $${example.marketPrice.toLocaleString()}</li>
                    <li>Final Offer: $${offer.finalOffer.toLocaleString()}</li>
                </ul>
            `;
            examplesContainer.appendChild(exampleElement);
        });

        // Remove any existing examples
        const existingExamples = document.querySelector('.examples-container');
        if (existingExamples) {
            existingExamples.remove();
        }

        main.appendChild(examplesContainer);
    }

    function calculateExampleOffer(carInfo) {
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
            finalOffer: Math.round(offer)
        };
    }
}); 