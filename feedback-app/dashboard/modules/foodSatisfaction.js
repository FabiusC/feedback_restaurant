class FoodSatisfactionModule {
    constructor() {
        this.reviews = [];
    }

    setReviews(reviews) {
        this.reviews = reviews;
    }

    getFoodSatisfactionData() {
        const foodRatings = this.reviews
            .map(review => review.ratesatisfactionfood)
            .filter(rating => rating !== null && rating !== undefined && rating > 0);

        if (foodRatings.length === 0) {
            return {
                average: 0,
                count: 0,
                percentage: 0
            };
        }

        const average = foodRatings.reduce((sum, rating) => sum + rating, 0) / foodRatings.length;
        const percentage = (average / 5) * 180; // 180 degrees for half circle

        return {
            average: average.toFixed(1),
            count: foodRatings.length,
            percentage: percentage
        };
    }

    updateFoodSatisfactionChart() {
        const data = this.getFoodSatisfactionData();

        // Update gauge fill
        const gaugeFill = document.getElementById('food-gauge-fill');
        if (gaugeFill) {
            gaugeFill.style.setProperty('--percentage', `${data.percentage}deg`);
        }

        // Update gauge text
        const gaugeText = document.getElementById('food-gauge-text');
        if (gaugeText) {
            gaugeText.textContent = data.average;
        }

        // Update stat details
        const averageElement = document.getElementById('food-average');
        if (averageElement) {
            averageElement.textContent = data.average;
        }

        const countElement = document.getElementById('food-count');
        if (countElement) {
            countElement.textContent = data.count;
        }
    }
}

export default FoodSatisfactionModule; 