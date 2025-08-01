import { Request, Response } from 'express';
import { AnalyticsController } from '../../controllers/AnalyticsController';
import { AnalyticsService } from '../../services/AnalyticsService';
import { EmployeeRepository } from '../../data/repositories/EmployeeRepository';
import { Employee } from '../../entities/Employee';
import { EmployeeStatsDTO } from '../../dto/EmployeeStatsDTO';

// Mock the services and repositories
jest.mock('../../services/AnalyticsService');
jest.mock('../../data/repositories/EmployeeRepository');

const MockedAnalyticsService = AnalyticsService as jest.MockedClass<typeof AnalyticsService>;
const MockedEmployeeRepository = EmployeeRepository as jest.MockedClass<typeof EmployeeRepository>;

describe('AnalyticsController', () => {
  let analyticsController: AnalyticsController;
  let mockAnalyticsService: jest.Mocked<AnalyticsService>;
  let mockEmployeeRepository: jest.Mocked<EmployeeRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create mock services
    mockAnalyticsService = new MockedAnalyticsService() as jest.Mocked<AnalyticsService>;
    mockEmployeeRepository = new MockedEmployeeRepository() as jest.Mocked<EmployeeRepository>;
    
    // Create controller
    analyticsController = new AnalyticsController();
    (analyticsController as any).analyticsService = mockAnalyticsService;
    (analyticsController as any).employeeRepository = mockEmployeeRepository;
    
    // Setup mock response
    mockJson = jest.fn().mockReturnThis();
    mockStatus = jest.fn().mockReturnThis();
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };
  });

  describe('getEmployees', () => {
    it('should return active employees successfully', async () => {
      // Arrange
      const mockEmployees = [
        new Employee(1, 'Juan Pérez', 'juan@example.com', true),
        new Employee(2, 'María García', 'maria@example.com', true),
      ];

      mockEmployeeRepository.findActiveEmployees.mockResolvedValue(mockEmployees);

      // Act
      await analyticsController.getEmployees(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockEmployeeRepository.findActiveEmployees).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith([
        {
          idemployee: 1,
          name: 'Juan Pérez',
          email: 'juan@example.com',
          isactive: true,
          createdat: expect.any(Date),
        },
        {
          idemployee: 2,
          name: 'María García',
          email: 'maria@example.com',
          isactive: true,
          createdat: expect.any(Date),
        },
      ]);
    });

    it('should return empty array when no active employees exist', async () => {
      // Arrange
      mockEmployeeRepository.findActiveEmployees.mockResolvedValue([]);

      // Act
      await analyticsController.getEmployees(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockEmployeeRepository.findActiveEmployees).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith([]);
    });

    it('should handle repository errors', async () => {
      // Arrange
      mockEmployeeRepository.findActiveEmployees.mockRejectedValue(
        new Error('Database connection failed')
      );

      // Act
      await analyticsController.getEmployees(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockEmployeeRepository.findActiveEmployees).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Error interno del servidor',
        error: 'Ocurrió un error al obtener los empleados',
      });
    });
  });

  describe('getEmployeePerformance', () => {
    it('should return employee performance successfully', async () => {
      // Arrange
      const employeeId = 1;
      const mockStats = new EmployeeStatsDTO(1);
      mockStats.setStats({
        averageemployeerating: 4.0,
        averagespeedservice: 4.2,
        averagefoodsatisfaction: 4.5,
        reviewcount: 10,
      });
      
      mockRequest = {
        params: { id: employeeId.toString() },
      };

      mockAnalyticsService.getEmployeePerformance.mockResolvedValue(mockStats);

      // Act
      await analyticsController.getEmployeePerformance(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockAnalyticsService.getEmployeePerformance).toHaveBeenCalledWith(employeeId);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockStats.toJSON());
    });

    it('should return 400 for invalid employee ID', async () => {
      // Arrange
      mockRequest = {
        params: { id: 'invalid' },
      };

      // Act
      await analyticsController.getEmployeePerformance(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockAnalyticsService.getEmployeePerformance).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'ID de empleado inválido',
        error: 'El ID debe ser un número válido',
      });
    });

    it('should return 404 when employee not found', async () => {
      // Arrange
      const employeeId = 999;
      mockRequest = {
        params: { id: employeeId.toString() },
      };

      mockAnalyticsService.getEmployeePerformance.mockRejectedValue(
        new Error('Employee not found')
      );

      // Act
      await analyticsController.getEmployeePerformance(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockAnalyticsService.getEmployeePerformance).toHaveBeenCalledWith(employeeId);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Empleado no encontrado',
        error: 'El empleado especificado no existe',
      });
    });

    it('should handle other service errors', async () => {
      // Arrange
      const employeeId = 1;
      mockRequest = {
        params: { id: employeeId.toString() },
      };

      mockAnalyticsService.getEmployeePerformance.mockRejectedValue(
        new Error('Database error')
      );

      // Act
      await analyticsController.getEmployeePerformance(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockAnalyticsService.getEmployeePerformance).toHaveBeenCalledWith(employeeId);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Error interno del servidor',
        error: 'Ocurrió un error al obtener el rendimiento del empleado',
      });
    });

    it('should handle missing employee ID parameter', async () => {
      // Arrange
      mockRequest = {
        params: {},
      };

      // Act
      await analyticsController.getEmployeePerformance(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockAnalyticsService.getEmployeePerformance).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'ID de empleado inválido',
        error: 'El ID debe ser un número válido',
      });
    });
  });
}); 