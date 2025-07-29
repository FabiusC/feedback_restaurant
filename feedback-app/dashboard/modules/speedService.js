// Speed Service Module
import { config } from '../../config.js';

class SpeedServiceModule {
    constructor() {
        this.reviews = [];
    }

    setReviews(reviews) {
        this.reviews = reviews;
    }

    getSpeedServiceData() {
        const speedRatings = this.reviews
            .map(review => review.ratespeedservice)
            .filter(rating => rating !== null && rating !== undefined && rating > 0);

        if (speedRatings.length === 0) {
            return {
                average: 0,
                count: 0,
                percentage: 0
            };
        }

        const average = speedRatings.reduce((sum, rating) => sum + rating, 0) / speedRatings.length;
        const percentage = (average / 5) * 180; // 180 degrees for half circle

        return {
            average: average.toFixed(1),
            count: speedRatings.length,
            percentage: percentage
        };
    }

    updateSpeedServiceChart() {
        const data = this.getSpeedServiceData();

        // Update gauge fill
        const gaugeFill = document.getElementById('speed-gauge-fill');
        if (gaugeFill) {
            gaugeFill.style.setProperty('--percentage', `${data.percentage}deg`);
        }

        // Update gauge text
        const gaugeText = document.getElementById('speed-gauge-text');
        if (gaugeText) {
            gaugeText.textContent = data.average;
        }

        // Update stat details
        const averageElement = document.getElementById('speed-average');
        if (averageElement) {
            averageElement.textContent = data.average;
        }

        const countElement = document.getElementById('speed-count');
        if (countElement) {
            countElement.textContent = data.count;
        }
    }
}

export default SpeedServiceModule; 