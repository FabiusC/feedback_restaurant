# API Test Suite

This directory contains comprehensive tests for the Reviews API, covering all endpoints, middleware, and services.

## Test Structure

```
tests/
├── setup.js                    # Test environment configuration
├── helpers/
│   └── database.js            # Database helper functions for tests
├── integration/               # Integration tests
│   ├── api.test.js           # General API and documentation tests
│   ├── reviews.test.js       # Reviews endpoint tests
│   ├── employees.test.js     # Employees endpoint tests
│   └── analytics.test.js     # Analytics endpoint tests
└── unit/                     # Unit tests
    ├── middleware/
    │   ├── validation.test.js    # Validation middleware tests
    │   └── errorHandler.test.js  # Error handler middleware tests
    └── services/
        └── analyticsService.test.js  # Analytics service tests
```

## Test Categories

### Integration Tests
- **API Tests**: Test general API functionality, CORS headers, error handling, and documentation
- **Reviews Tests**: Test review submission, validation, and retrieval
- **Employees Tests**: Test employee CRUD operations and validation
- **Analytics Tests**: Test employee statistics calculation and edge cases

### Unit Tests
- **Middleware Tests**: Test validation and error handling middleware in isolation
- **Service Tests**: Test business logic services with mocked dependencies

## Running Tests

### Prerequisites
1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up test database:
   - Create a test database
   - Run the database schema from `database/createTables.sql`
   - Configure test database connection in `.env.test`

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- tests/integration/reviews.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="should submit a valid review"
```

## Test Environment Setup

The test suite uses:
- **Jest** as the testing framework
- **Supertest** for HTTP assertions
- **PostgreSQL** for test database
- **ESM modules** support

### Environment Variables
Create a `.env.test` file with test database configuration:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=feedback_restaurant_test
DB_USER=your_test_user
DB_PASSWORD=your_test_password
```

## Test Data Management

### Database Helpers
The `tests/helpers/database.js` file provides:
- `clearDatabase()`: Cleans all test data
- `seedTestData()`: Creates test employees and reviews
- `closeDatabase()`: Closes database connection

### Test Data
Each integration test suite:
1. Clears the database before running
2. Seeds test data (employees and reviews)
3. Runs tests against the seeded data
4. Cleans up after completion

## Test Coverage

### Reviews API (`/api/reviews`)
- ✅ POST `/api/reviews` - Submit new review
- ✅ GET `/api/reviews/public` - Get public reviews
- ✅ Validation for all review fields
- ✅ Error handling for invalid data
- ✅ Edge cases (null values, boundary conditions)

### Employees API (`/api/employees`)
- ✅ GET `/api/employees` - Get all active employees
- ✅ GET `/api/employees/:id` - Get employee by ID
- ✅ POST `/api/employees` - Create new employee
- ✅ PUT `/api/employees/:id` - Update employee
- ✅ DELETE `/api/employees/:id` - Deactivate employee
- ✅ Email validation
- ✅ Required field validation
- ✅ Error handling for non-existent employees

### Analytics API (`/api/analytics`)
- ✅ GET `/api/analytics/employees/:id/stats` - Get employee statistics
- ✅ Average calculations for all rating types
- ✅ Handling of null employee ratings
- ✅ Public vs private review counts
- ✅ Edge cases (no reviews, single review)

### Middleware
- ✅ Review validation middleware
- ✅ Error handler middleware
- ✅ CORS headers
- ✅ Request logging

### Services
- ✅ Analytics service calculations
- ✅ Database error handling
- ✅ Edge case handling

## Test Patterns

### Integration Test Pattern
```javascript
describe('Endpoint Name', () => {
  let testData;

  beforeAll(async () => {
    await clearDatabase();
    testData = await seedTestData();
  });

  afterAll(async () => {
    await clearDatabase();
  });

  describe('HTTP Method /endpoint', () => {
    it('should do something specific', async () => {
      const response = await request(app)
        .method('/endpoint')
        .send(data)
        .expect(statusCode);

      expect(response.body).toHaveProperty('expectedField');
    });
  });
});
```

### Unit Test Pattern
```javascript
describe('Component Name', () => {
  let mockDependencies;

  beforeEach(() => {
    mockDependencies = {
      // Setup mocks
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('function name', () => {
    it('should handle specific scenario', () => {
      // Test implementation
    });
  });
});
```

## Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Cleanup**: Always clean up test data after tests
3. **Descriptive Names**: Use descriptive test names that explain the scenario
4. **Edge Cases**: Test boundary conditions and error scenarios
5. **Mocking**: Mock external dependencies in unit tests
6. **Assertions**: Use specific assertions that test the exact behavior

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure test database is running
   - Check `.env.test` configuration
   - Verify database user permissions

2. **Import Errors**
   - Ensure Jest is configured for ESM modules
   - Check file extensions in imports

3. **Test Timeouts**
   - Increase timeout in `setup.js` if needed
   - Check for hanging database connections

4. **Mock Issues**
   - Clear mocks between tests
   - Ensure mocks are properly configured

### Debug Mode
Run tests with verbose output:
```bash
npm test -- --verbose
```

## Contributing

When adding new tests:
1. Follow the existing test patterns
2. Add tests for both success and error scenarios
3. Include edge cases and boundary conditions
4. Update this README if adding new test categories
5. Ensure all tests pass before committing 