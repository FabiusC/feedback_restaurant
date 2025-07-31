// API Calls Module
import { config } from '../../config.js';

export class ApiService {
    constructor() {
        this.baseUrl = config.api.baseUrl;
    }

    async fetchEmployees() {
        try {
            const response = await fetch(`${this.baseUrl}${config.api.endpoints.employees.all}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                return data;
            } else {
                console.warn('No employees returned from API, using fallback');
                return [];
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            return [];
        }
    }

    async submitReview(reviewData) {
        try {
            console.log('Submitting review data:', reviewData);
            const response = await fetch(`${this.baseUrl}${config.api.endpoints.reviews.submit}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Server error response:', errorData);
                throw new Error(`Failed to submit review: ${errorData.error || response.statusText}`);
            }

            const result = await response.json();
            return { success: true, data: result };
        } catch (error) {
            console.error('Error submitting review:', error);
            return { success: false, error: error.message };
        }
    }
} 