// Data Processing Module
export class DataProcessor {
    constructor() {
        this.employees = [];
    }

    setEmployees(employees) {
        this.employees = employees;
    }

    getEmployeesData() {
        console.log('getEmployeesData called, employees length:', this.employees.length);

        if (this.employees.length === 0) {
            console.log('No employees from API, using fallback');
            return {
                hasData: false,
                employees: this.getFallbackEmployees()
            };
        }

        console.log('Using employees from API');
        return {
            hasData: true,
            employees: this.employees.map(employee => ({
                id: employee.idemployee,
                name: employee.name,
                email: employee.email
            }))
        };
    }

    getFallbackEmployees() {
        return [
            { id: 1, name: 'John Smith', email: 'john@restaurant.com' },
            { id: 2, name: 'Sarah Johnson', email: 'sarah@restaurant.com' },
            { id: 3, name: 'Mike Davis', email: 'mike@restaurant.com' }
        ];
    }

    processFormData(formData) {
        return {
            idemployee: formData.idemployee ? parseInt(formData.idemployee) : null,
            ratespeedservice: parseInt(formData.ratespeedservice),
            ratesatisfactionfood: parseInt(formData.ratesatisfactionfood),
            rateemployee: formData.rateemployee ? parseInt(formData.rateemployee) : null,
            comment: formData.comment,
            ispublic: formData.ispublic
        };
    }
} 