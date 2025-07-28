// Import modules
import { Utils } from './modules/utils.js';
import { ModalManager } from './modules/modal.js';
import { ApiService } from './modules/api.js';
import { DataProcessor } from './modules/dataProcessor.js';
import { EmployeeDropdown } from './modules/employeeDropdown.js';

// Initialize modules
const utils = new Utils();
const modalManager = new ModalManager();
const apiService = new ApiService();
const dataProcessor = new DataProcessor();
const employeeDropdown = new EmployeeDropdown();

// DOM Elements
const feedbackForm = document.getElementById('feedback-form');

// Initialize the application
document.addEventListener('DOMContentLoaded', async function () {
    initializeStarRatings();
    initializeFormValidation();

    // Fetch and load employees
    const employees = await apiService.fetchEmployees();
    dataProcessor.setEmployees(employees);
    loadEmployees();
});

// Star rating functionality
function initializeStarRatings() {
    const ratingGroups = ['speed', 'food', 'employee'];

    ratingGroups.forEach(group => {
        const ratingContainer = document.getElementById(`${group}-rating`);
        const label = document.getElementById(`${group}-label`);

        if (ratingContainer && label) {
            const stars = ratingContainer.querySelectorAll('input[type="radio"]');

            stars.forEach((star, index) => {
                star.addEventListener('change', () => {
                    // Since visual order is reversed, we need to map the index correctly
                    // Visual: [5★] [4★] [3★] [2★] [1★] (left to right)
                    // DOM:   [1★] [2★] [3★] [4★] [5★] (left to right)
                    // So index 0 (leftmost visual) = value 5, index 4 (rightmost visual) = value 1
                    const rating = 5 - index; // Reverse the mapping
                    utils.updateRatingLabel(label, rating);
                });
            });
        }
    });
}

// Form validation
function initializeFormValidation() {
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFormSubmission);
    }
}

function handleFormSubmission(event) {
    event.preventDefault();

    if (validateForm()) {
        submitReview();
    }
}

function validateForm() {
    const speedRating = document.querySelector('input[name="ratespeedservice"]:checked');
    const foodRating = document.querySelector('input[name="ratesatisfactionfood"]:checked');
    const employeeRating = document.querySelector('input[name="rateemployee"]:checked');
    const employeeSelect = document.getElementById('employee-select');
    const comment = document.getElementById('comment').value.trim();

    if (!utils.validateRating(speedRating, 'speed of service')) return false;
    if (!utils.validateRating(foodRating, 'food satisfaction')) return false;

    // Employee rating validation: only required if employee is selected
    if (employeeSelect.value && !employeeRating) {
        alert('Please rate the employee service');
        return false;
    }

    if (!utils.validateComment(comment)) return false;

    return true;
}

// Form reset
function resetStarRatings() {
    const ratingGroups = ['speed', 'food', 'employee'];

    ratingGroups.forEach(group => {
        const ratingContainer = document.getElementById(`${group}-rating`);
        const label = document.getElementById(`${group}-label`);

        if (ratingContainer) {
            const stars = ratingContainer.querySelectorAll('input[type="radio"]');
            stars.forEach(star => star.checked = false);
        }

        if (label) {
            label.textContent = 'Select rating';
        }
    });

    document.getElementById('comment').value = '';
    document.getElementById('ispublic').checked = true;
    employeeDropdown.resetDropdown();
}

// Employee dropdown population
function loadEmployees() {
    console.log('loadEmployees called');
    const data = dataProcessor.getEmployeesData();
    employeeDropdown.populateDropdown(data.employees);
}

// Review submission
async function submitReview() {
    utils.showLoading();

    const formData = utils.getFormData(feedbackForm);
    const processedData = dataProcessor.processFormData(formData);

    const result = await apiService.submitReview(processedData);

    if (result.success) {
        modalManager.showSuccessModal();
        resetStarRatings();
    } else {
        alert('Failed to submit review. Please try again.');
    }

    utils.hideLoading();
} 