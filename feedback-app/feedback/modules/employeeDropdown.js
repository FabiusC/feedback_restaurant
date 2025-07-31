// Employee Dropdown Module
export class EmployeeDropdown {
    constructor() {
        this.employeeSelect = document.getElementById('employee-select');
    }

    populateDropdown(employees) {
        if (!this.employeeSelect) {
            console.error('Employee select element not found');
            return;
        }
        // Clear existing options except the first one
        while (this.employeeSelect.children.length > 1) {
            this.employeeSelect.removeChild(this.employeeSelect.lastChild);
        }

        // Add employee options
        employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.id;
            option.textContent = employee.name;
            this.employeeSelect.appendChild(option);
        });
    }

    resetDropdown() {
        if (this.employeeSelect) {
            this.employeeSelect.value = '';
        }
    }
} 