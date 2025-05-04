type Condition = "Great" | "Good" | "Fair" | "Bad" | "Non-Drivable";

interface CarInfo {
    marketPrice: number;
    condition: Condition;
    isDrivable: boolean;
    catalyticConverterPresent: boolean;
    mileage: number;
}

function calculateOffer(car: CarInfo): number {
    let offer = car.marketPrice * 0.63; // 37% cut applied

    switch (car.condition) {
        case "Fair":
            offer -= 300;
            break;
        case "Bad":
            offer -= 500;
            break;
        case "Non-Drivable":
            break;
    }

    if (!car.catalyticConverterPresent) {
        offer -= 300;
    }

    if (car.mileage >= 150000) {
        offer -= 600;
    } else if (car.mileage >= 120000) {
        offer -= 300;
    }

    if (car.condition === "Non-Drivable" || !car.isDrivable) {
        offer = Math.min(offer, 900);
    }

    return Math.max(offer, 0);
}

// Hook to form
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("carForm");
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            const form = e.target as HTMLFormElement;

            const car: CarInfo = {
                marketPrice: parseFloat(form.marketPrice.value),
                condition: form.condition.value as Condition,
                isDrivable: form.drivable.value === "yes",
                catalyticConverterPresent: form.converter.value === "yes",
                mileage: parseInt(form.mileage.value)
            };

            const offer = calculateOffer(car);
            const offerResult = document.getElementById("offerResult");
            if (offerResult) {
                offerResult.textContent = `Your offer is: $${offer.toFixed(2)}`;
            }
        });
    }
}); 