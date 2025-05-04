document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('sellForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const carInfo = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            make: formData.get('make'),
            model: formData.get('model'),
            year: parseInt(formData.get('year')),
            mileage: parseInt(formData.get('mileage')),
            condition: formData.get('condition'),
            converter: formData.get('converter'),
            drivable: formData.get('drivable'),
            marketPrice: parseFloat(formData.get('marketPrice')),
            location: formData.get('location'),
            description: formData.get('description')
        };

        // Save the submission to localStorage
        saveSubmission(carInfo);
        
        // Show success message
        showSuccessMessage();
    });

    function saveSubmission(carInfo) {
        // Get existing submissions or create new array
        const submissions = JSON.parse(localStorage.getItem('carSubmissions') || '[]');
        
        // Add timestamp
        carInfo.submissionDate = new Date().toISOString();
        
        // Add to submissions
        submissions.push(carInfo);
        
        // Save back to localStorage
        localStorage.setItem('carSubmissions', JSON.stringify(submissions));
    }

    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <h3>Thank You!</h3>
            <p>Your car information has been submitted successfully.</p>
            <p>We will review your submission and contact you within 24 hours.</p>
            <button onclick="window.location.href='index.html'">Back to Home</button>
        `;

        // Clear the form
        form.reset();
        
        // Replace form with success message
        form.parentNode.replaceChild(successMessage, form);
    }
}); 