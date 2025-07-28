// Recent Reviews Module
class RecentReviewsModule {
    constructor() {
        this.reviews = [];
        this.employees = [];
        this.filteredReviews = [];
        this.currentFilters = {
            dateFrom: '',
            dateTo: '',
            sortBy: 'recent', // 'recent', 'oldest', 'positive', 'negative'
            showAll: true
        };
    }

    // Set data
    setData(reviews, employees) {
        this.reviews = reviews;
        this.employees = employees;
        this.applyFilters();
    }

    // Calculate positivity score (average of all ratings)
    calculatePositivityScore(review) {
        const ratings = [
            review.ratespeedservice || 0,
            review.ratesatisfactionfood || 0,
            review.rateemployee || 0
        ].filter(rating => rating > 0);

        return ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;
    }

    // Apply filters and sorting
    applyFilters() {
        let filtered = [...this.reviews];

        // Filter by date range
        if (this.currentFilters.dateFrom) {
            const fromDate = new Date(this.currentFilters.dateFrom);
            filtered = filtered.filter(review => new Date(review.date) >= fromDate);
        }

        if (this.currentFilters.dateTo) {
            const toDate = new Date(this.currentFilters.dateTo);
            toDate.setHours(23, 59, 59, 999); // End of day
            filtered = filtered.filter(review => new Date(review.date) <= toDate);
        }

        // Sort reviews
        filtered.sort((a, b) => {
            switch (this.currentFilters.sortBy) {
                case 'recent':
                    return new Date(b.date) - new Date(a.date);
                case 'oldest':
                    return new Date(a.date) - new Date(b.date);
                case 'positive':
                    return this.calculatePositivityScore(b) - this.calculatePositivityScore(a);
                case 'negative':
                    return this.calculatePositivityScore(a) - this.calculatePositivityScore(b);
                default:
                    return new Date(b.date) - new Date(a.date);
            }
        });

        this.filteredReviews = filtered;
    }

    // Update filters
    updateFilters(newFilters) {
        this.currentFilters = { ...this.currentFilters, ...newFilters };
        this.applyFilters();
        this.updateRecentReviews();
    }

    // Get recent reviews data
    getRecentReviewsData() {
        if (this.filteredReviews.length === 0) {
            return {
                hasData: false,
                reviews: [],
                filterInfo: this.getFilterInfo()
            };
        }

        const reviewsData = this.filteredReviews.map(review => {
            const date = new Date(review.date).toLocaleDateString();
            const employee = this.employees.find(emp => emp.idemployee === review.idemployee);
            const employeeName = employee ? employee.name : `Employee ${review.idemployee}`;
            const positivityScore = this.calculatePositivityScore(review);

            return {
                date: date,
                employeeName: employeeName,
                employeeId: review.idemployee,
                speedRating: review.ratespeedservice,
                foodRating: review.ratesatisfactionfood,
                employeeRating: review.rateemployee,
                comment: review.comment,
                positivityScore: positivityScore,
                originalDate: review.date
            };
        });

        return {
            hasData: true,
            reviews: reviewsData,
            filterInfo: this.getFilterInfo()
        };
    }

    // Get filter information for display
    getFilterInfo() {
        const totalReviews = this.reviews.length;
        const filteredCount = this.filteredReviews.length;
        const sortLabels = {
            'recent': 'Most Recent',
            'oldest': 'Oldest First',
            'positive': 'Most Positive',
            'negative': 'Most Negative'
        };

        return {
            totalReviews,
            filteredCount,
            sortLabel: sortLabels[this.currentFilters.sortBy] || 'Most Recent',
            hasDateFilter: this.currentFilters.dateFrom || this.currentFilters.dateTo
        };
    }

    // Update recent reviews in DOM
    updateRecentReviews() {
        const data = this.getRecentReviewsData();
        const reviewsContainer = document.getElementById('reviews-container');
        const filterInfo = document.getElementById('filter-info');

        if (!reviewsContainer) return;

        // Update filter info
        if (filterInfo) {
            filterInfo.innerHTML = this.createFilterInfoHTML(data.filterInfo);
        }

        // Clear existing content
        reviewsContainer.innerHTML = '';

        if (!data.hasData) {
            // Create no reviews element
            const noReviewsItem = document.createElement('div');
            noReviewsItem.className = 'review-item';
            noReviewsItem.innerHTML = `
                <div class="review-header">
                    <span class="review-date">No reviews found</span>
                </div>
                <div class="review-comment" style="text-align: center; color: #999; font-style: italic;">
                    ${data.filterInfo.hasDateFilter ? 'No reviews match your date filter' : 'Be the first to leave a review! 🍽️'}
                </div>
            `;
            reviewsContainer.appendChild(noReviewsItem);
            return;
        }

        // Create review items
        data.reviews.forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';

            // Add positivity indicator
            const positivityClass = review.positivityScore >= 4 ? 'positive' :
                review.positivityScore >= 2.5 ? 'neutral' : 'negative';

            reviewItem.innerHTML = `
                <div class="review-header">
                    <span class="review-date">${review.date}</span>
                    <div class="review-badges">
                        ${review.employeeId ? `<span class="employee-badge">${review.employeeName}</span>` : ''}
                        <span class="positivity-badge ${positivityClass}">
                            ${review.positivityScore.toFixed(1)}/5
                        </span>
                    </div>
                </div>
                <div class="review-ratings">
                    <span class="rating-badge">Speed: ${review.speedRating}/5</span>
                    <span class="rating-badge">Food: ${review.foodRating}/5</span>
                    ${review.employeeRating ? `<span class="rating-badge">Employee: ${review.employeeRating}/5</span>` : ''}
                </div>
                <div class="review-comment">${review.comment}</div>
            `;
            reviewsContainer.appendChild(reviewItem);
        });
    }

    // Create filter info HTML
    createFilterInfoHTML(filterInfo) {
        return `
            <div class="filter-summary">
                <span class="filter-count">Showing ${filterInfo.filteredCount} of ${filterInfo.totalReviews} reviews</span>
                ${filterInfo.hasDateFilter ? '<span class="filter-active">• Date filtered</span>' : ''}
                <span class="filter-sort">• Sorted by ${filterInfo.sortLabel}</span>
            </div>
        `;
    }

    // Initialize filter controls
    initializeFilterControls() {
        const dateFromInput = document.getElementById('date-from');
        const dateToInput = document.getElementById('date-to');
        const sortSelect = document.getElementById('sort-select');
        const clearFiltersBtn = document.getElementById('clear-filters');

        if (dateFromInput) {
            dateFromInput.addEventListener('change', (e) => {
                this.updateFilters({ dateFrom: e.target.value });
            });
        }

        if (dateToInput) {
            dateToInput.addEventListener('change', (e) => {
                this.updateFilters({ dateTo: e.target.value });
            });
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.updateFilters({ sortBy: e.target.value });
            });
        }

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.updateFilters({
                    dateFrom: '',
                    dateTo: '',
                    sortBy: 'recent'
                });

                // Clear form inputs
                if (dateFromInput) dateFromInput.value = '';
                if (dateToInput) dateToInput.value = '';
                if (sortSelect) sortSelect.value = 'recent';
            });
        }
    }
}

export default RecentReviewsModule; 