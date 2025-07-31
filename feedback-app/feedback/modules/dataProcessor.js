// Data Processing Module
export class DataProcessor {
    constructor() {
        this.employees = [];
    }

    setEmployees(employees) {
        this.employees = employees;
    }

    getEmployeesData() {
        if (this.employees.length === 0) {
            return {
                hasData: false
            };
        }
        return {
            hasData: true,
            employees: this.employees.map(employee => ({
                id: employee.idemployee,
                name: employee.name,
                email: employee.email
            }))
        };
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