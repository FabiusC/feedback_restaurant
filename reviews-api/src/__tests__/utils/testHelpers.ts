import { Request, Response } from "express";
import { ReviewDTO } from "../../dto/ReviewDTO";
import { Review } from "../../entities/Review";
import { Employee } from "../../entities/Employee";

/**
 * Helper para crear un mock de Request de Express
 */
export const createMockRequest = (
  body: any = {},
  params: any = {},
  query: any = {}
): Partial<Request> => ({
  body,
  params,
  query,
  headers: {
    "content-type": "application/json",
  },
});

/**
 * Helper para crear un mock de Response de Express
 */
export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Helper para crear un ReviewDTO válido para pruebas
 */
export const createValidReviewDTO = (
  overrides: Partial<ReviewDTO> = {}
): ReviewDTO => {
  const dto = new ReviewDTO();
  dto.setSpeedRating(4);
  dto.setFoodRating(5);
  dto.setIdEmployeeSelected(1);
  dto.setEmployeeRating(4);
  dto.setComment("Great service!");
  dto.setIsPublic(true);

  // Aplicar overrides
  Object.entries(overrides).forEach(([key, value]) => {
    const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
    if (typeof dto[setterName as keyof ReviewDTO] === "function") {
      (dto as any)[setterName](value);
    }
  });

  return dto;
};

/**
 * Helper para crear un ReviewDTO sin empleado para pruebas
 */
export const createReviewDTOWithoutEmployee = (
  overrides: Partial<ReviewDTO> = {}
): ReviewDTO => {
  const dto = new ReviewDTO();
  dto.setSpeedRating(4);
  dto.setFoodRating(5);
  dto.setIdEmployeeSelected(null);
  dto.setEmployeeRating(null);
  dto.setComment("Great food!");
  dto.setIsPublic(true);

  // Aplicar overrides
  Object.entries(overrides).forEach(([key, value]) => {
    const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
    if (typeof dto[setterName as keyof ReviewDTO] === "function") {
      (dto as any)[setterName](value);
    }
  });

  return dto;
};

/**
 * Helper para crear una entidad Review válida para pruebas
 */
export const createValidReview = (overrides: Partial<Review> = {}): Review => {
  const review = new Review(1, 4, 5, 1, 4, "Great service!", true);

  // Aplicar overrides
  Object.entries(overrides).forEach(([key, value]) => {
    const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
    if (typeof review[setterName as keyof Review] === "function") {
      (review as any)[setterName](value);
    }
  });

  return review;
};

/**
 * Helper para crear una entidad Employee válida para pruebas
 */
export const createValidEmployee = (
  overrides: Partial<Employee> = {}
): Employee => {
  const employee = new Employee(1, "Juan Pérez", "true");

  // Aplicar overrides
  Object.entries(overrides).forEach(([key, value]) => {
    const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
    if (typeof employee[setterName as keyof Employee] === "function") {
      (employee as any)[setterName](value);
    }
  });

  return employee;
};

/**
 * Helper para crear datos de review para requests HTTP
 */
export const createReviewRequestData = (overrides: any = {}) => ({
  speedRating: 4,
  foodRating: 5,
  idEmployeeSelected: 1,
  employeeRating: 4,
  comment: "Great service!",
  isPublic: true,
  ...overrides,
});

/**
 * Helper para crear datos de review sin empleado para requests HTTP
 */
export const createReviewRequestDataWithoutEmployee = (
  overrides: any = {}
) => ({
  speedRating: 4,
  foodRating: 5,
  idEmployeeSelected: null,
  employeeRating: null,
  comment: "Great food!",
  isPublic: true,
  ...overrides,
});

/**
 * Helper para crear estadísticas de empleado para pruebas
 */
export const createEmployeeStats = (overrides: any = {}) => ({
  totalReviews: 10,
  averageRating: 4.2,
  speedRating: 4.0,
  foodRating: 4.5,
  employeeRating: 4.1,
  publicReviews: 8,
  privateReviews: 2,
  ...overrides,
});

/**
 * Helper para crear estadísticas vacías de empleado
 */
export const createEmptyEmployeeStats = () => ({
  totalReviews: 0,
  averageRating: 0,
  speedRating: 0,
  foodRating: 0,
  employeeRating: 0,
  publicReviews: 0,
  privateReviews: 0,
});

/**
 * Helper para crear una respuesta exitosa del servicio
 */
export const createSuccessServiceResponse = (data: any = {}) => ({
  success: true,
  message: "Operación exitosa",
  data,
});

/**
 * Helper para crear una respuesta de error del servicio
 */
export const createErrorServiceResponse = (message: string, error: string) => ({
  success: false,
  message,
  error,
});

/**
 * Helper para validar que una respuesta HTTP tenga el formato correcto
 */
export const validateHttpResponse = (
  response: any,
  expectedStatus: number,
  expectedSuccess: boolean
) => {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty("success", expectedSuccess);
  expect(response.body).toHaveProperty("message");

  if (expectedSuccess) {
    expect(response.body).toHaveProperty("data");
  } else {
    expect(response.body).toHaveProperty("error");
  }
};

/**
 * Helper para crear un array de reviews para pruebas
 */
export const createMockReviews = (count: number = 2): Review[] => {
  const reviews: Review[] = [];

  for (let i = 1; i <= count; i++) {
    reviews.push(
      new Review(
        i,
        3 + (i % 3), // 3, 4, 5
        4 + (i % 2), // 4, 5
        i % 2 === 0 ? i : null, // Alternar empleados
        i % 2 === 0 ? 4 : null,
        `Review ${i} - Great service!`,
        i % 3 !== 0 // 2/3 públicas
      )
    );
  }

  return reviews;
};

/**
 * Helper para limpiar todos los mocks de Jest
 */
export const clearAllMocks = () => {
  jest.clearAllMocks();
  jest.clearAllTimers();
};

/**
 * Helper para esperar que una promesa se resuelva
 */
export const waitForPromise = (ms: number = 100) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Helper para crear un error personalizado
 */
export const createCustomError = (
  message: string,
  statusCode: number = 500
) => {
  const error = new Error(message);
  (error as any).statusCode = statusCode;
  return error;
};
