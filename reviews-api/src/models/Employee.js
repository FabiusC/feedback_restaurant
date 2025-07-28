class Employee {
    constructor(idemployee, name, email, isactive, createdat) {
        this.idemployee = idemployee;
        this.name = name;
        this.email = email;
        this.isactive = isactive;
        this.createdat = createdat;
    }

    static getAllEmployeesQuery() {
        return `
            SELECT * FROM employee
            WHERE isactive = true
            ORDER BY name ASC;
        `;
    }

    static getEmployeeByIdQuery() {
        return `
            SELECT * FROM employee
            WHERE idemployee = $1;
        `;
    }

    static getActiveEmployeesQuery() {
        return `
            SELECT * FROM employee
            WHERE isactive = true
            ORDER BY name ASC;
        `;
    }

    static createEmployeeQuery() {
        return `
            INSERT INTO employee (name, email, isactive)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
    }

    static updateEmployeeQuery() {
        return `
            UPDATE employee
            SET name = $2, email = $3, isactive = $4
            WHERE idemployee = $1
            RETURNING *;
        `;
    }

    static deleteEmployeeQuery() {
        return `
            UPDATE employee
            SET isactive = false
            WHERE idemployee = $1
            RETURNING *;
        `;
    }
}

export default Employee; 