// Utility Functions Module
export class Utils {
    constructor() {
        this.loading = document.getElementById('loading');
    }

    // Loading functionality
    showLoading() {
        if (this.loading) {
            this.loading.style.display = 'flex';
        }
    }

    hideLoading() {
        if (this.loading) {
            this.loading.style.display = 'none';
        }
    }

    // Form data extraction
    getFormData(form) {
        const formData = new FormData(form);
        return {
            idemployee: formData.get('idemployee') || null,
            ratespeedservice: parseInt(formData.get('ratespeedservice')) || 0,
            ratesatisfactionfood: parseInt(formData.get('ratesatisfactionfood')) || 0,
            rateemployee: formData.get('rateemployee') ? parseInt(formData.get('rateemployee')) : null,
            comment: formData.get('comment') || '',
            ispublic: formData.get('ispublic') === 'on'
        };
    }

    // Rating label updates
    updateRatingLabel(label, rating) {
        const labels = {
            1: 'Poor',
            2: 'Fair',
            3: 'Good',
            4: 'Very Good',
            5: 'Excellent'
        };
        label.textContent = labels[rating] || 'Select rating';
    }

    // Validation helpers
    validateRating(rating, fieldName) {
        if (!rating) {
            alert(`Please rate the ${fieldName}`);
            return false;
        }
        return true;
    }

    validateComment(comment) {
        if (!comment) {
            alert('Please provide a comment');
            return false;
        }

        if (comment.length < 10) {
            alert('Comment must be at least 10 characters long');
            return false;
        }

        if (comment.length > 500) {
            alert('Comment must be less than 500 characters');
            return false;
        }

        return true;
    }
} 