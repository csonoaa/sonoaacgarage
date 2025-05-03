document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const carForm = document.getElementById('car-form');
    const modal = document.getElementById('offer-modal');
    const closeButton = document.querySelector('.close-button');
    
    // Car make and models database
    const carModels = {
        toyota: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', 'Tundra', 'Prius', '4Runner', 'Sienna', 'Avalon'],
        honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V', 'Odyssey', 'Ridgeline', 'Fit', 'Insight', 'Passport'],
        ford: ['F-150', 'Escape', 'Explorer', 'Mustang', 'Edge', 'Ranger', 'Expedition', 'Bronco', 'Fusion', 'Focus'],
        bmw: ['3 Series', '5 Series', 'X3', 'X5', 'X1', '7 Series', 'X7', '4 Series', '8 Series', 'Z4'],
        mercedes: ['C-Class', 'E-Class', 'GLC', 'GLE', 'A-Class', 'S-Class', 'GLA', 'CLA', 'G-Class', 'GLB'],
        audi: ['A4', 'Q5', 'A6', 'Q7', 'A3', 'Q3', 'Q8', 'A5', 'A7', 'A8'],
        chevrolet: ['Silverado', 'Equinox', 'Tahoe', 'Traverse', 'Malibu', 'Suburban', 'Colorado', 'Blazer', 'Camaro', 'Trax'],
        nissan: ['Altima', 'Rogue', 'Sentra', 'Murano', 'Pathfinder', 'Frontier', 'Maxima', 'Kicks', 'Armada', 'Titan'],
        hyundai: ['Elantra', 'Tucson', 'Santa Fe', 'Sonata', 'Kona', 'Palisade', 'Venue', 'Accent', 'Ioniq', 'Veloster'],
        kia: ['Forte', 'Sportage', 'Sorento', 'Telluride', 'Soul', 'Seltos', 'K5', 'Carnival', 'Niro', 'Rio']
    };
    
    // Base values for car models (in USD)
    const baseValues = {
        // Toyota
        'camry': 24000,
        'corolla': 20000,
        'rav4': 26000,
        'highlander': 34000,
        'tacoma': 28000,
        'tundra': 35000,
        'prius': 25000,
        
        // Honda
        'civic': 21000,
        'accord': 25000,
        'cr-v': 26000,
        'pilot': 33000,
        'odyssey': 31000,
        
        // Ford
        'f-150': 38000,
        'escape': 25000,
        'explorer': 33000,
        'mustang': 27000,
        'bronco': 30000,
        
        // Luxury cars
        '3 series': 41000,
        '5 series': 54000,
        'c-class': 43000,
        'e-class': 55000,
        'a4': 40000,
        'q5': 43000,
        
        // Default
        'default': 20000
    };
    
    // Add Make dropdown event listener
    const makeSelect = document.getElementById('car-make');
    const modelInput = document.getElementById('car-model');
    
    makeSelect.addEventListener('change', function() {
        const selectedMake = this.value;
        
        if (selectedMake && carModels[selectedMake]) {
            // Create datalist for autocomplete
            let datalistId = 'model-options';
            let existingDatalist = document.getElementById(datalistId);
            
            if (!existingDatalist) {
                existingDatalist = document.createElement('datalist');
                existingDatalist.id = datalistId;
                document.body.appendChild(existingDatalist);
                modelInput.setAttribute('list', datalistId);
            } else {
                existingDatalist.innerHTML = '';
            }
            
            // Add options to datalist
            carModels[selectedMake].forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                existingDatalist.appendChild(option);
            });
        }
    });
    
    // Form submission
    carForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const make = document.getElementById('car-make').value;
        const model = document.getElementById('car-model').value;
        const year = parseInt(document.getElementById('car-year').value);
        const mileage = parseInt(document.getElementById('car-mileage').value);
        const condition = document.getElementById('car-condition').value;
        const color = document.getElementById('car-color').value;
        const bodyType = document.getElementById('car-body').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        
        // Calculate car value
        const offerAmount = calculateCarValue(make, model, year, mileage, condition, bodyType);
        
        // Update modal with values
        document.getElementById('result-make').textContent = make;
        document.getElementById('result-model').textContent = model;
        document.getElementById('result-year').textContent = year;
        document.getElementById('result-mileage').textContent = numberWithCommas(mileage) + ' miles';
        document.getElementById('result-condition').textContent = condition;
        document.getElementById('result-amount').textContent = '$' + numberWithCommas(offerAmount);
        
        // Show modal
        modal.style.display = 'flex';
        
        // Store data in localStorage for usage on other pages
        const valuation = {
            make, model, year, mileage, condition, color, bodyType,
            customerName: name,
            email, phone,
            offerAmount,
            offerDate: new Date().toISOString(),
            offerExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        localStorage.setItem('carValuation', JSON.stringify(valuation));
    });
    
    // Close modal when clicking the X
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside the content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Function to calculate car value
    function calculateCarValue(make, model, year, mileage, condition, bodyType) {
        // Get base value
        const modelLower = model.toLowerCase();
        let baseValue = baseValues[modelLower] || baseValues.default;
        
        // Year multipliers
        let yearMultiplier = 0.2; // Default for very old cars
        const currentYear = new Date().getFullYear();
        const age = currentYear - year;
        
        if (age <= 1) yearMultiplier = 1.0;
        else if (age <= 3) yearMultiplier = 0.9;
        else if (age <= 5) yearMultiplier = 0.8;
        else if (age <= 7) yearMultiplier = 0.7;
        else if (age <= 10) yearMultiplier = 0.6;
        else if (age <= 15) yearMultiplier = 0.4;
        else if (age <= 20) yearMultiplier = 0.3;
        
        // Mileage multipliers
        let mileageMultiplier = 1.0;
        
        if (mileage < 10000) mileageMultiplier = 1.1;
        else if (mileage < 30000) mileageMultiplier = 1.0;
        else if (mileage < 60000) mileageMultiplier = 0.9;
        else if (mileage < 90000) mileageMultiplier = 0.8;
        else if (mileage < 120000) mileageMultiplier = 0.7;
        else if (mileage < 150000) mileageMultiplier = 0.6;
        else if (mileage < 180000) mileageMultiplier = 0.5;
        else mileageMultiplier = 0.4;
        
        // Condition multipliers
        let conditionMultiplier = 1.0;
        switch (condition) {
            case 'excellent': conditionMultiplier = 1.1; break;
            case 'good': conditionMultiplier = 1.0; break;
            case 'fair': conditionMultiplier = 0.8; break;
            case 'poor': conditionMultiplier = 0.6; break;
            default: conditionMultiplier = 1.0;
        }
        
        // Body type multipliers
        let bodyTypeMultiplier = 1.0;
        switch (bodyType) {
            case 'suv': bodyTypeMultiplier = 1.05; break;
            case 'truck': bodyTypeMultiplier = 1.1; break;
            case 'coupe': bodyTypeMultiplier = 0.95; break;
            case 'convertible': bodyTypeMultiplier = 1.05; break;
            case 'hatchback': bodyTypeMultiplier = 0.9; break;
            default: bodyTypeMultiplier = 1.0;
        }
        
        // Calculate offer
        let offerAmount = baseValue * yearMultiplier * mileageMultiplier * conditionMultiplier * bodyTypeMultiplier;
        
        // Market adjustments (e.g., brand premium)
        if (['bmw', 'mercedes', 'audi'].includes(make.toLowerCase())) {
            offerAmount *= 1.1; // Luxury brand premium
        }
        
        // Round to nearest hundred
        return Math.round(offerAmount / 100) * 100;
    }
    
    // Helper function to format numbers with commas
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}); 