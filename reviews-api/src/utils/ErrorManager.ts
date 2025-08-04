export interface ValidationError {
  field: string;
  value: any;
  expectedType: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export class ErrorManager {
  private static instance: ErrorManager;

  private constructor() {}

  public static getInstance(): ErrorManager {
    if (!ErrorManager.instance) {
      ErrorManager.instance = new ErrorManager();
    }
    return ErrorManager.instance;
  }

  /**
   * Validates data types for review submission
   */
  public validateReviewDataTypes(data: any): ValidationResult {
    const errors: ValidationError[] = [];

    // Validate ratespeedservice
    if (data.ratespeedservice !== undefined) {
      if (typeof data.ratespeedservice !== "number") {
        errors.push({
          field: "ratespeedservice",
          value: data.ratespeedservice,
          expectedType: "number",
          message: "Speed service rating must be a number",
          code: "INVALID_SPEED_RATING_TYPE",
        });
      } else if (!Number.isInteger(data.ratespeedservice)) {
        errors.push({
          field: "ratespeedservice",
          value: data.ratespeedservice,
          expectedType: "integer",
          message: "Speed service rating must be an integer",
          code: "INVALID_SPEED_RATING_FORMAT",
        });
      }
    }

    // Validate ratesatisfactionfood
    if (data.ratesatisfactionfood !== undefined) {
      if (typeof data.ratesatisfactionfood !== "number") {
        errors.push({
          field: "ratesatisfactionfood",
          value: data.ratesatisfactionfood,
          expectedType: "number",
          message: "Food satisfaction rating must be a number",
          code: "INVALID_FOOD_RATING_TYPE",
        });
      } else if (!Number.isInteger(data.ratesatisfactionfood)) {
        errors.push({
          field: "ratesatisfactionfood",
          value: data.ratesatisfactionfood,
          expectedType: "integer",
          message: "Food satisfaction rating must be an integer",
          code: "INVALID_FOOD_RATING_FORMAT",
        });
      }
    }

    // Validate idemployee
    if (data.idemployee !== undefined && data.idemployee !== null) {
      if (typeof data.idemployee !== "number") {
        errors.push({
          field: "idemployee",
          value: data.idemployee,
          expectedType: "number",
          message: "Employee ID must be a number",
          code: "INVALID_EMPLOYEE_ID_TYPE",
        });
      } else if (!Number.isInteger(data.idemployee)) {
        errors.push({
          field: "idemployee",
          value: data.idemployee,
          expectedType: "integer",
          message: "Employee ID must be an integer",
          code: "INVALID_EMPLOYEE_ID_FORMAT",
        });
      } else if (data.idemployee <= 0) {
        errors.push({
          field: "idemployee",
          value: data.idemployee,
          expectedType: "positive integer",
          message: "Employee ID must be a positive integer",
          code: "INVALID_EMPLOYEE_ID_RANGE",
        });
      }
    }

    // Validate rateemployee
    if (data.rateemployee !== undefined && data.rateemployee !== null) {
      if (typeof data.rateemployee !== "number") {
        errors.push({
          field: "rateemployee",
          value: data.rateemployee,
          expectedType: "number",
          message: "Employee rating must be a number",
          code: "INVALID_EMPLOYEE_RATING_TYPE",
        });
      } else if (!Number.isInteger(data.rateemployee)) {
        errors.push({
          field: "rateemployee",
          value: data.rateemployee,
          expectedType: "integer",
          message: "Employee rating must be an integer",
          code: "INVALID_EMPLOYEE_RATING_FORMAT",
        });
      }
    }

    // Validate comment
    if (data.comment !== undefined) {
      if (typeof data.comment !== "string") {
        errors.push({
          field: "comment",
          value: data.comment,
          expectedType: "string",
          message: "Comment must be a string",
          code: "INVALID_COMMENT_TYPE",
        });
      }
    }

    // Validate ispublic
    if (data.ispublic !== undefined) {
      if (typeof data.ispublic !== "boolean") {
        errors.push({
          field: "ispublic",
          value: data.ispublic,
          expectedType: "boolean",
          message: "Is public flag must be a boolean",
          code: "INVALID_ISPUBLIC_TYPE",
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates business rules for review submission
   */
  public validateReviewBusinessRules(data: any): ValidationResult {
    const errors: ValidationError[] = [];

    // Validate rating ranges (1-5)
    if (typeof data.ratespeedservice === "number") {
      if (data.ratespeedservice < 1 || data.ratespeedservice > 5) {
        errors.push({
          field: "ratespeedservice",
          value: data.ratespeedservice,
          expectedType: "number between 1 and 5",
          message: "Speed service rating must be between 1 and 5",
          code: "INVALID_SPEED_RATING_RANGE",
        });
      }
    }

    if (typeof data.ratesatisfactionfood === "number") {
      if (data.ratesatisfactionfood < 1 || data.ratesatisfactionfood > 5) {
        errors.push({
          field: "ratesatisfactionfood",
          value: data.ratesatisfactionfood,
          expectedType: "number between 1 and 5",
          message: "Food satisfaction rating must be between 1 and 5",
          code: "INVALID_FOOD_RATING_RANGE",
        });
      }
    }

    if (typeof data.rateemployee === "number") {
      if (data.rateemployee < 1 || data.rateemployee > 5) {
        errors.push({
          field: "rateemployee",
          value: data.rateemployee,
          expectedType: "number between 1 and 5",
          message: "Employee rating must be between 1 and 5",
          code: "INVALID_EMPLOYEE_RATING_RANGE",
        });
      }
    }

    // Validate comment length
    if (typeof data.comment === "string") {
      if (data.comment.trim().length === 0) {
        errors.push({
          field: "comment",
          value: data.comment,
          expectedType: "non-empty string",
          message: "Comment cannot be empty",
          code: "EMPTY_COMMENT",
        });
      } else if (data.comment.length > 500) {
        errors.push({
          field: "comment",
          value: data.comment.length,
          expectedType: "string with max 500 characters",
          message: "Comment cannot exceed 500 characters",
          code: "COMMENT_TOO_LONG",
        });
      }
    }

    // Validate employee rating consistency
    if (data.idemployee !== null && data.idemployee !== undefined) {
      if (data.rateemployee === null || data.rateemployee === undefined) {
        errors.push({
          field: "rateemployee",
          value: data.rateemployee,
          expectedType: "number (required when employee is selected)",
          message: "Employee rating is required when an employee is selected",
          code: "MISSING_EMPLOYEE_RATING",
        });
      }
    }

    if (data.idemployee === null || data.idemployee === undefined) {
      if (data.rateemployee !== null && data.rateemployee !== undefined) {
        errors.push({
          field: "rateemployee",
          value: data.rateemployee,
          expectedType: "null (not allowed when no employee is selected)",
          message:
            "Employee rating cannot be provided when no employee is selected",
          code: "UNEXPECTED_EMPLOYEE_RATING",
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Creates a formatted error response
   */
  public createErrorResponse(
    errors: ValidationError[],
    message: string = "Validation failed"
  ): any {
    return {
      success: false,
      message,
      error: "Data validation error",
      validationErrors: errors,
      errorCount: errors.length,
    };
  }

  /**
   * Logs validation errors for debugging
   */
  public logValidationErrors(errors: ValidationError[]): void {
    console.error("Validation errors detected:");
    errors.forEach((error, index) => {
      console.error(`${index + 1}. Field: ${error.field}`);
      console.error(`   Value: ${error.value} (${typeof error.value})`);
      console.error(`   Expected: ${error.expectedType}`);
      console.error(`   Message: ${error.message}`);
      console.error(`   Code: ${error.code}`);
      console.error("---");
    });
  }

  /**
   * Gets HTTP status code based on error type
   */
  public getStatusCode(errors: ValidationError[]): number {
    // If there are type errors, return 400 Bad Request
    const hasTypeErrors = errors.some(
      (error) =>
        error.code.includes("TYPE") ||
        error.code.includes("FORMAT") ||
        error.code.includes("RANGE")
    );

    if (hasTypeErrors) {
      return 400;
    }

    // For business rule violations, return 422 Unprocessable Entity
    return 422;
  }
}
