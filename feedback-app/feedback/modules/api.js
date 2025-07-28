// API Calls Module
export class ApiService {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api';
    }

    async fetchEmployees() {
        try {
            console.log('Fetching employees from API...');
            const response = await fetch(`${this.baseUrl}/employees/employees`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Employees fetched successfully:', data);

            if (Array.isArray(data) && data.length > 0) {
                console.log('Employees loaded:', data.length, 'employees');
                return data;
            } else {
                console.warn('No employees returned from API, using fallback');
                return [];
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            console.log('Using fallback employees due to API error');
            return [];
        }
    }

    async submitReview(reviewData) {
        try {
            console.log('Submitting review data:', reviewData);
            const response = await fetch(`${this.baseUrl}/reviews/reviews`, {
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