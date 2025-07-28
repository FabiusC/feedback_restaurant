// Import modules
import SpeedServiceModule from './modules/speedService.js';
import FoodSatisfactionModule from './modules/foodSatisfaction.js';
import EmployeePerformanceModule from './modules/employeePerformance.js';
import RecentReviewsModule from './modules/recentReviews.js';

// Global variables
let reviews = [];
let employees = [];

// Initialize modules
const speedServiceModule = new SpeedServiceModule();
const foodSatisfactionModule = new FoodSatisfactionModule();
const employeePerformanceModule = new EmployeePerformanceModule();
const recentReviewsModule = new RecentReviewsModule();

// DOM Elements
const loading = document.getElementById('loading');
const toggleReviewsBtn = document.getElementById('toggle-reviews');
const reviewsContainer = document.getElementById('reviews-container');

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    loadDashboardData();
    initializeToggleButton();
    recentReviewsModule.initializeFilterControls();
});

// Toggle button functionality
function initializeToggleButton() {
    if (toggleReviewsBtn) {
        toggleReviewsBtn.addEventListener('click', function () {
            const isCollapsed = reviewsContainer.classList.contains('collapsed');

            if (isCollapsed) {
                // Expand
                reviewsContainer.classList.remove('collapsed');
                toggleReviewsBtn.classList.remove('collapsed');
                toggleReviewsBtn.innerHTML = '<i class="fas fa-chevron-down"></i>Show Less';
            } else {
                // Collapse
                reviewsContainer.classList.add('collapsed');
                toggleReviewsBtn.classList.add('collapsed');
                toggleReviewsBtn.innerHTML = '<i class="fas fa-chevron-down"></i>Show All';
            }
        });
    }
}

// API calls
async function fetchPublicReviews() {
    try {
        const response = await fetch('http://localhost:3000/api/reviews/reviews/public');
        if (!response.ok) {
            throw new Error('Failed to fetch reviews');
        }
        reviews = await response.json();
        return reviews;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}

async function fetchEmployees() {
    try {
        const response = await fetch('http://localhost:3000/api/employees/employees');
        if (!response.ok) {
            throw new Error('Failed to fetch employees');
        }
        employees = await response.json();
        return employees;
    } catch (error) {
        console.error('Error fetching employees:', error);
        return [];
    }
}

async function fetchEmployeeStats(employeeId) {
    try {
        const response = await fetch(`http://localhost:3000/api/employees/employees/${employeeId}/stats`);
        if (!response.ok) {
            throw new Error('Failed to fetch employee stats');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching employee stats:', error);
        return null;
    }
}

// Data loading functions
async function loadDashboardData() {
    showLoading();

    try {
        await Promise.all([
            fetchPublicReviews(),
            fetchEmployees()
        ]);

        // Update modules with fresh data
        updateModulesData();

        // Update all dashboard components
        updateAllCharts();

    } catch (error) {
        console.error('Error loading dashboard data:', error);
    } finally {
        hideLoading();
    }
}

// Update modules with fresh data
function updateModulesData() {
    speedServiceModule.setReviews(reviews);
    foodSatisfactionModule.setReviews(reviews);
    employeePerformanceModule.setData(reviews, employees);
    recentReviewsModule.setData(reviews, employees);
}

// Update all dashboard components
function updateAllCharts() {
    speedServiceModule.updateSpeedServiceChart();
    foodSatisfactionModule.updateFoodSatisfactionChart();
    employeePerformanceModule.updateEmployeeChart();
    recentReviewsModule.updateRecentReviews();
}

// Utility functions
function showLoading() {
    if (loading) {
        loading.style.display = 'flex';
    }
}

function hideLoading() {
    if (loading) {
        loading.style.display = 'none';
    }
}

// Auto-refresh dashboard data every 30 seconds
setInterval(() => {
    loadDashboardData();
}, 30000); 