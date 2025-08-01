import { EmployeeRepository } from "../../data/repositories/EmployeeRepository";
import { Employee } from "../../entities/Employee";
import DatabaseConnection from "../../data/database/connection";

// Mock the database connection
jest.mock("../../data/database/connection");

describe("EmployeeRepository", () => {
  let employeeRepository: EmployeeRepository;
  let mockDb: any;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create mock database connection
    mockDb = {
      query: jest.fn(),
    };

    // Mock the singleton instance
    (DatabaseConnection.getInstance as jest.Mock).mockReturnValue(mockDb);

    // Create repository
    employeeRepository = new EmployeeRepository();
  });

  describe("findActiveEmployees", () => {
    it("should return active employees successfully", async () => {
      // Arrange
      const mockRows = [
        {
          idemployee: 1,
          name: "Juan Pérez",
          email: "juan@example.com",
          isactive: true,
          createdat: "2024-01-01T00:00:00.000Z",
        },
        {
          idemployee: 2,
          name: "María García",
          email: "maria@example.com",
          isactive: true,
          createdat: "2024-01-02T00:00:00.000Z",
        },
      ];

      mockDb.query.mockResolvedValue({ rows: mockRows });

      // Act
      const result = await employeeRepository.findActiveEmployees();

      // Assert
      expect(mockDb.query).toHaveBeenCalledWith(
        "SELECT idemployee, name, email, isactive, createdat FROM employee WHERE isactive = true ORDER BY name"
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Employee);
      expect(result[0].getId()).toBe(1);
      expect(result[0].getName()).toBe("Juan Pérez");
      expect(result[0].getEmail()).toBe("juan@example.com");
      expect(result[0].getIsActive()).toBe(true);
      expect(result[1].getId()).toBe(2);
      expect(result[1].getName()).toBe("María García");
    });

    it("should return empty array when no active employees exist", async () => {
      // Arrange
      mockDb.query.mockResolvedValue({ rows: [] });

      // Act
      const result = await employeeRepository.findActiveEmployees();

      // Assert
      expect(mockDb.query).toHaveBeenCalledWith(
        "SELECT idemployee, name, email, isactive, createdat FROM employee WHERE isactive = true ORDER BY name"
      );
      expect(result).toHaveLength(0);
    });

    it("should handle database errors", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockDb.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(employeeRepository.findActiveEmployees()).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockDb.query).toHaveBeenCalledWith(
        "SELECT idemployee, name, email, isactive, createdat FROM employee WHERE isactive = true ORDER BY name"
      );
    });
  });

  describe("findById", () => {
    it("should return employee when found", async () => {
      // Arrange
      const employeeId = 1;
      const mockRow = {
        idemployee: 1,
        name: "Juan Pérez",
        email: "juan@example.com",
        isactive: true,
        createdat: "2024-01-01T00:00:00.000Z",
      };

      mockDb.query.mockResolvedValue({ rows: [mockRow] });

      // Act
      const result = await employeeRepository.findById(employeeId);

      // Assert
      expect(mockDb.query).toHaveBeenCalledWith(
        "SELECT idemployee, name, email, isactive, createdat FROM employee WHERE idemployee = $1",
        [employeeId]
      );
      expect(result).toBeInstanceOf(Employee);
      expect(result!.getId()).toBe(1);
      expect(result!.getName()).toBe("Juan Pérez");
      expect(result!.getEmail()).toBe("juan@example.com");
      expect(result!.getIsActive()).toBe(true);
    });

    it("should return null when employee not found", async () => {
      // Arrange
      const employeeId = 999;
      mockDb.query.mockResolvedValue({ rows: [] });

      // Act
      const result = await employeeRepository.findById(employeeId);

      // Assert
      expect(mockDb.query).toHaveBeenCalledWith(
        "SELECT idemployee, name, email, isactive, createdat FROM employee WHERE idemployee = $1",
        [employeeId]
      );
      expect(result).toBeNull();
    });

    it("should handle database errors", async () => {
      // Arrange
      const employeeId = 1;
      const dbError = new Error("Database connection failed");
      mockDb.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(employeeRepository.findById(employeeId)).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockDb.query).toHaveBeenCalledWith(
        "SELECT idemployee, name, email, isactive, createdat FROM employee WHERE idemployee = $1",
        [employeeId]
      );
    });
  });

  describe("save", () => {
    it("should save employee successfully", async () => {
      // Arrange
      const employee = new Employee(0, "Juan Pérez", "juan@example.com", true);
      const mockRow = {
        idemployee: 1,
        createdat: "2024-01-01T00:00:00.000Z",
      };

      mockDb.query.mockResolvedValue({ rows: [mockRow] });

      // Act
      const result = await employeeRepository.save(employee);

      // Assert
      expect(mockDb.query).toHaveBeenCalledWith(
        "INSERT INTO employee (name, email, isactive) VALUES ($1, $2, $3) RETURNING idemployee, createdat",
        ["Juan Pérez", "juan@example.com", true]
      );
      expect(result).toBeInstanceOf(Employee);
      expect(result.getId()).toBe(1);
      expect(result.getName()).toBe("Juan Pérez");
      expect(result.getEmail()).toBe("juan@example.com");
      expect(result.getIsActive()).toBe(true);
    });

    it("should handle database errors", async () => {
      // Arrange
      const employee = new Employee(0, "Juan Pérez", "juan@example.com", true);
      const dbError = new Error("Database connection failed");
      mockDb.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(employeeRepository.save(employee)).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockDb.query).toHaveBeenCalledWith(
        "INSERT INTO employee (name, email, isactive) VALUES ($1, $2, $3) RETURNING idemployee, createdat",
        ["Juan Pérez", "juan@example.com", true]
      );
    });
  });

  describe("update", () => {
    it("should update employee successfully", async () => {
      // Arrange
      const employee = new Employee(
        1,
        "Juan Pérez Updated",
        "juan.updated@example.com",
        false
      );

      mockDb.query.mockResolvedValue({ rows: [] });

      // Act
      const result = await employeeRepository.update(employee);

      // Assert
      expect(mockDb.query).toHaveBeenCalledWith(
        "UPDATE employee SET name = $1, email = $2, isactive = $3 WHERE idemployee = $4",
        ["Juan Pérez Updated", "juan.updated@example.com", false, 1]
      );
      expect(result).toBe(employee);
    });

    it("should handle database errors", async () => {
      // Arrange
      const employee = new Employee(
        1,
        "Juan Pérez Updated",
        "juan.updated@example.com",
        false
      );
      const dbError = new Error("Database connection failed");
      mockDb.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(employeeRepository.update(employee)).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockDb.query).toHaveBeenCalledWith(
        "UPDATE employee SET name = $1, email = $2, isactive = $3 WHERE idemployee = $4",
        ["Juan Pérez Updated", "juan.updated@example.com", false, 1]
      );
    });
  });

  describe("deactivate", () => {
    it("should deactivate employee successfully", async () => {
      // Arrange
      const employeeId = 1;

      mockDb.query.mockResolvedValue({ rows: [] });

      // Act
      await employeeRepository.deactivate(employeeId);

      // Assert
      expect(mockDb.query).toHaveBeenCalledWith(
        "UPDATE employee SET isactive = false WHERE idemployee = $1",
        [employeeId]
      );
    });

    it("should handle database errors", async () => {
      // Arrange
      const employeeId = 1;
      const dbError = new Error("Database connection failed");
      mockDb.query.mockRejectedValue(dbError);

      // Act & Assert
      await expect(employeeRepository.deactivate(employeeId)).rejects.toThrow(
        "Database connection failed"
      );
      expect(mockDb.query).toHaveBeenCalledWith(
        "UPDATE employee SET isactive = false WHERE idemployee = $1",
        [employeeId]
      );
    });
  });
});
