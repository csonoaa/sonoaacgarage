// Base prices for different makes and body types
const basePrices = {
    toyota: {
        sedan: 15000,
        suv: 25000,
        truck: 30000,
        coupe: 20000,
        convertible: 25000,
        hatchback: 18000,
        van: 22000,
        wagon: 20000,
        other: 15000
    },
    honda: {
        sedan: 14000,
        suv: 24000,
        truck: 28000,
        coupe: 19000,
        convertible: 24000,
        hatchback: 17000,
        van: 21000,
        wagon: 19000,
        other: 14000
    },
    // Add more makes and their base prices
};

// Year depreciation factors
const yearDepreciation = {
    '2025': 1.0,
    '2024': 0.95,
    '2023': 0.9,
    '2022': 0.85,
    '2021': 0.8,
    '2020': 0.75,
    '2019': 0.7,
    '2018': 0.65,
    '2017': 0.6,
    '2016': 0.55,
    '2015': 0.5,
    '2014': 0.45,
    '2013': 0.4,
    '2012': 0.35,
    '2011': 0.3,
    '2010': 0.25,
    '2009': 0.2,
    '2008': 0.15,
    '2007': 0.1,
    '2006': 0.05,
    '2005': 0.02
};

// Mileage depreciation factors
const mileageDepreciation = {
    '0-50000': 1.0,
    '50001-100000': 0.8,
    '100001-150000': 0.6,
    '150001-200000': 0.4,
    '200001+': 0.2
};

// US States
const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Populate year dropdown
    const yearSelect = document.getElementById('year');
    if (yearSelect) {
        for (let year = 2025; year >= 1990; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
    }

    // Populate state dropdown
    const stateSelect = document.getElementById('state');
    if (stateSelect) {
        usStates.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateSelect.appendChild(option);
        });
    }

    // Handle form submission
    const valuationForm = document.getElementById('carValuationForm');
    if (valuationForm) {
        valuationForm.addEventListener('submit', handleValuationForm);
    }

    // Handle listings filters
    const filterMake = document.getElementById('filterMake');
    const filterBodyType = document.getElementById('filterBodyType');
    const filterState = document.getElementById('filterState');
    
    if (filterMake && filterBodyType && filterState) {
        filterMake.addEventListener('change', filterListings);
        filterBodyType.addEventListener('change', filterListings);
        filterState.addEventListener('change', filterListings);
    }

    // Load listings
    loadListings();
});

// Calculate car value
function calculateCarValue(formData) {
    const make = formData.get('make');
    const bodyType = formData.get('bodyType');
    const year = formData.get('year');
    const mileage = parseInt(formData.get('mileage'));
    const condition = formData.get('condition');
    const catalyticConverter = formData.get('catalyticConverter');

    // Get base price
    let basePrice = basePrices[make]?.[bodyType] || 15000;

    // Apply year depreciation
    const yearFactor = yearDepreciation[year] || 0.02;
    basePrice *= yearFactor;

    // Apply mileage depreciation
    let mileageFactor = 1.0;
    if (mileage <= 50000) mileageFactor = 1.0;
    else if (mileage <= 100000) mileageFactor = 0.8;
    else if (mileage <= 150000) mileageFactor = 0.6;
    else if (mileage <= 200000) mileageFactor = 0.4;
    else mileageFactor = 0.2;
    basePrice *= mileageFactor;

    // Apply condition adjustments
    if (condition === 'nondrivable') {
        basePrice = Math.min(basePrice, 900);
    } else if (condition === 'bad') {
        basePrice -= 500;
    }

    // Apply catalytic converter adjustment
    if (catalyticConverter === 'missing') {
        basePrice -= 300;
    }

    // Apply platform fee (30%)
    const platformFee = basePrice * 0.3;
    const finalOffer = basePrice - platformFee;

    return {
        estimatedValue: basePrice,
        platformFee: platformFee,
        finalOffer: finalOffer
    };
}

// Handle valuation form submission
function handleValuationForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const valuation = calculateCarValue(formData);

    // Display results
    const resultDiv = document.getElementById('valuationResult');
    const estimatedValue = document.getElementById('estimatedValue');
    const platformFee = document.getElementById('platformFee');
    const finalOffer = document.getElementById('finalOffer');

    if (resultDiv && estimatedValue && platformFee && finalOffer) {
        estimatedValue.textContent = `$${valuation.estimatedValue.toFixed(2)}`;
        platformFee.textContent = `$${valuation.platformFee.toFixed(2)}`;
        finalOffer.textContent = `$${valuation.finalOffer.toFixed(2)}`;
        resultDiv.classList.remove('hidden');

        // Save listing if user clicks "List for Sale"
        const listButton = document.getElementById('listForSale');
        if (listButton) {
            listButton.onclick = function() {
                saveListing(formData, valuation.finalOffer);
                window.location.href = 'listings.html';
            };
        }
    }
}

// Save car listing to localStorage
function saveListing(formData, price) {
    const listing = {
        make: formData.get('make'),
        model: formData.get('model'),
        year: formData.get('year'),
        color: formData.get('color'),
        transmission: formData.get('transmission'),
        bodyType: formData.get('bodyType'),
        condition: formData.get('condition'),
        mileage: formData.get('mileage'),
        state: formData.get('state'),
        price: price,
        date: new Date().toISOString()
    };

    let listings = JSON.parse(localStorage.getItem('carListings') || '[]');
    listings.push(listing);
    localStorage.setItem('carListings', JSON.stringify(listings));
}

// Load and display listings
function loadListings() {
    const listingsContainer = document.getElementById('carListings');
    if (!listingsContainer) return;

    let listings = JSON.parse(localStorage.getItem('carListings') || '[]');
    
    // Apply filters
    const makeFilter = document.getElementById('filterMake')?.value;
    const bodyTypeFilter = document.getElementById('filterBodyType')?.value;
    const stateFilter = document.getElementById('filterState')?.value;

    listings = listings.filter(listing => {
        if (makeFilter && listing.make !== makeFilter) return false;
        if (bodyTypeFilter && listing.bodyType !== bodyTypeFilter) return false;
        if (stateFilter && listing.state !== stateFilter) return false;
        return true;
    });

    // Display listings
    listingsContainer.innerHTML = listings.map(listing => `
        <div class="car-card">
            <h3>${listing.year} ${listing.make} ${listing.model}</h3>
            <p>Color: ${listing.color}</p>
            <p>Body Type: ${listing.bodyType}</p>
            <p>Mileage: ${listing.mileage}</p>
            <p>Condition: ${listing.condition}</p>
            <p>Location: ${listing.state}</p>
            <p class="price">$${listing.price.toFixed(2)}</p>
        </div>
    `).join('');
}

// Filter listings
function filterListings() {
    loadListings();
} 