// Employee Performance Module
import { config } from '../../config.js';

class EmployeePerformanceModule {
    constructor() {
        this.reviews = [];
        this.employees = [];
    }

    // Set data
    setData(reviews, employees) {
        this.reviews = Array.isArray(reviews) ? reviews : [];
        this.employees = Array.isArray(employees) ? employees : [];
        console.log('EmployeePerformanceModule setData:', {
            reviewsCount: this.reviews.length,
            employeesCount: this.employees.length,
            reviewsType: typeof reviews,
            employeesType: typeof employees
        });
    }

    // Get employee performance data
    getEmployeePerformanceData() {
        const employeesWithReviews = [...new Set(this.reviews.filter(r => r.idemployee).map(r => r.idemployee))];

        if (employeesWithReviews.length === 0) {
            return {
                hasData: false,
                employees: []
            };
        }

        const employeeData = employeesWithReviews.map(employeeId => {
            const employeeReviews = this.reviews.filter(r => r.idemployee === employeeId && r.rateemployee);
            if (employeeReviews.length === 0) return null;

            const averageRating = employeeReviews.reduce((sum, r) => sum + r.rateemployee, 0) / employeeReviews.length;
            const percentage = (averageRating / 5) * 100;

            // Get employee name
            const employee = this.employees.find(emp => emp.idemployee === employeeId);
            const employeeName = employee ? employee.name : `Employee ${employeeId}`;

            return {
                id: employeeId,
                name: employeeName,
                averageRating: averageRating.toFixed(1),
                percentage: percentage,
                initial: employeeName.charAt(0).toUpperCase()
            };
        }).filter(emp => emp !== null);

        return {
            hasData: true,
            employees: employeeData
        };
    }

    // Update employee performance chart in DOM
    updateEmployeeChart() {
        const data = this.getEmployeePerformanceData();
        const employeeChart = document.getElementById('employee-chart');

        if (!employeeChart) return;

        // Clear existing content
        employeeChart.innerHTML = '';

        if (!data.hasData) {
            // Create no data element
            const noDataItem = document.createElement('div');
            noDataItem.className = 'employee-item';
            noDataItem.innerHTML = `
                <div class="employee-avatar">📊</div>
                <div class="employee-info">
                    <div class="employee-name">No employee reviews yet</div>
                    <div class="employee-progress">
                        <div class="employee-progress-bar" style="width: 0%"></div>
                    </div>
                </div>
                <div class="employee-rating">-</div>
            `;
            employeeChart.appendChild(noDataItem);
            return;
        }

        // Create employee items
        data.employees.forEach(employee => {
            const employeeItem = document.createElement('div');
            employeeItem.className = 'employee-item';
            employeeItem.innerHTML = `
                <div class="employee-avatar">${employee.initial}</div>
                <div class="employee-info">
                    <div class="employee-name">${employee.name}</div>
                    <div class="employee-progress">
                        <div class="employee-progress-bar" style="width: ${employee.percentage}%"></div>
                    </div>
                </div>
                <div class="employee-rating">${employee.averageRating}</div>
            `;
            employeeChart.appendChild(employeeItem);
        });
    }
}

export default EmployeePerformanceModule; 