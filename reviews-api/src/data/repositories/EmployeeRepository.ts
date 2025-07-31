import { Employee } from "../../entities/Employee";
import DatabaseConnection from "../database/connection";

export class EmployeeRepository {
  private db: DatabaseConnection;

  constructor() {
    this.db = DatabaseConnection.getInstance();
  }

  public async findActiveEmployees(): Promise<Employee[]> {
    try {
      const result = await this.db.query(
        "SELECT idemployee, name, email, isactive, createdat FROM employee WHERE isactive = true ORDER BY name"
      );

      return result.rows.map(
        (row: any) =>
          new Employee(
            row.idemployee,
            row.name,
            row.email,
            row.isactive,
            new Date(row.createdat)
          )
      );
    } catch (error) {
      console.error("Error finding active employees:", error);
      throw error;
    }
  }

  public async findById(id: number): Promise<Employee | null> {
    try {
      const result = await this.db.query(
        "SELECT idemployee, name, email, isactive, createdat FROM employee WHERE idemployee = $1",
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return new Employee(
        row.idemployee,
        row.name,
        row.email,
        row.isactive,
        new Date(row.createdat)
      );
    } catch (error) {
      console.error("Error finding employee by ID:", error);
      throw error;
    }
  }

  public async save(employee: Employee): Promise<Employee> {
    try {
      const result = await this.db.query(
        "INSERT INTO employee (name, email, isactive) VALUES ($1, $2, $3) RETURNING idemployee, createdat",
        [employee.getName(), employee.getEmail(), employee.getIsActive()]
      );

      const row = result.rows[0];
      return new Employee(
        row.idemployee,
        employee.getName(),
        employee.getEmail(),
        employee.getIsActive(),
        new Date(row.createdat)
      );
    } catch (error) {
      console.error("Error saving employee:", error);
      throw error;
    }
  }

  public async update(employee: Employee): Promise<Employee> {
    try {
      await this.db.query(
        "UPDATE employee SET name = $1, email = $2, isactive = $3 WHERE idemployee = $4",
        [
          employee.getName(),
          employee.getEmail(),
          employee.getIsActive(),
          employee.getId(),
        ]
      );

      return employee;
    } catch (error) {
      console.error("Error updating employee:", error);
      throw error;
    }
  }

  public async deactivate(id: number): Promise<void> {
    try {
      await this.db.query(
        "UPDATE employee SET isactive = false WHERE idemployee = $1",
        [id]
      );
    } catch (error) {
      console.error("Error deactivating employee:", error);
      throw error;
    }
  }
}
