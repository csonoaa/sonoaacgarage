interface SellFormData {
    fullName: string;
    phone: string;
    email: string;
    location: string;
    message: string;
}

class SellForm {
    private form: HTMLFormElement;
    private carDescription: HTMLElement;
    private offerAmount: HTMLElement;

    constructor() {
        this.form = document.getElementById('sellForm') as HTMLFormElement;
        this.carDescription = document.getElementById('carDescription') as HTMLElement;
        this.offerAmount = document.getElementById('offerAmount') as HTMLElement;

        this.initializeForm();
        this.loadOfferDetails();
    }

    private initializeForm(): void {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    private loadOfferDetails(): void {
        // Get offer details from URL parameters or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const carDetails = urlParams.get('carDetails');
        const offer = urlParams.get('offer');

        if (carDetails && offer) {
            this.carDescription.textContent = carDetails;
            this.offerAmount.textContent = `$${offer}`;
        } else {
            // Fallback to default values if no parameters are present
            this.carDescription.textContent = '2010 Hyundai Elantra, 100,000 miles, Great Condition';
            this.offerAmount.textContent = '$3,400';
        }
    }

    private getFormData(): SellFormData {
        return {
            fullName: (document.getElementById('fullName') as HTMLInputElement).value,
            phone: (document.getElementById('phone') as HTMLInputElement).value,
            email: (document.getElementById('email') as HTMLInputElement).value,
            location: (document.getElementById('location') as HTMLInputElement).value,
            message: (document.getElementById('message') as HTMLTextAreaElement).value
        };
    }

    private validateFormData(data: SellFormData): boolean {
        // Basic validation
        if (!data.fullName.trim()) {
            alert('Please enter your full name');
            return false;
        }

        if (!data.phone.trim()) {
            alert('Please enter your phone number');
            return false;
        }

        if (!data.email.trim() || !this.isValidEmail(data.email)) {
            alert('Please enter a valid email address');
            return false;
        }

        if (!data.location.trim()) {
            alert('Please enter a pickup location');
            return false;
        }

        return true;
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private async handleSubmit(): Promise<void> {
        const formData = this.getFormData();

        if (!this.validateFormData(formData)) {
            return;
        }

        try {
            // Here you would typically send the data to your backend
            // For now, we'll just show a success message
            alert('Thank you for your submission! We will contact you within 24 hours to arrange pickup.');
            this.form.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting your form. Please try again later.');
        }
    }
}

// Initialize the form when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SellForm();
}); 