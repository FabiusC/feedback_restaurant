// Import modules
import SpeedServiceModule from './modules/speedService.js';
import FoodSatisfactionModule from './modules/foodSatisfaction.js';
import EmployeePerformanceModule from './modules/employeePerformance.js';
import RecentReviewsModule from './modules/recentReviews.js';
import { config } from '../config.js';

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
    const url = `${config.api.baseUrl}${config.api.endpoints.reviews.public}`;
    console.log(url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch reviews');
        }
        const result = await response.json();
        console.log('Reviews API response:', result);
        // Extract the data array from the API response
        reviews = result.data || result;
        console.log('Extracted reviews:', reviews);
        return reviews;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}

async function fetchEmployees() {
    const url = `${config.api.baseUrl}${config.api.endpoints.employees.all}`;
    console.log(url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch employees');
        }
        const result = await response.json();
        console.log('Employees API response:', result);
        // Extract the data array from the API response
        employees = result.data || result;
        console.log('Extracted employees:', employees);
        return employees;
    } catch (error) {
        console.error('Error fetching employees:', error);
        return [];
    }
}

async function fetchEmployeeStats(employeeId) {
    const url = `${config.api.baseUrl}${config.api.endpoints.employees.stats(employeeId)}`;
    console.log(url);
    try {
        const response = await fetch(url);
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
    console.log('Updating modules with data:', { reviewsCount: reviews.length, employeesCount: employees.length });
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
}, config.app.autoRefreshInterval); 