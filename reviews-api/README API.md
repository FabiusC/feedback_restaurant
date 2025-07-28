# Reviews API

## Description

This API provides endpoints for submitting restaurant reviews and analyzing employee performance. The system tracks multiple rating categories including speed of service, food satisfaction, and employee ratings.

## Features

- Submit restaurant reviews with multiple rating categories
- Retrieve public reviews
- Employee performance analytics
- PostgreSQL database integration
- Input validation and error handling

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd feedback_restaurant
   ```

2. **Install dependencies**

   ```bash
   cd reviews-api
   npm install
   ```

3. **Database Setup**

   Create a PostgreSQL database and run the SQL scripts:

   ```bash
   # Create database
   createdb feedback_restaurant

   # Run table creation script
   psql -d feedback_restaurant -f database/createTables.sql

   # (Optional) Insert sample data
   psql -d feedback_restaurant -f database/data.sql
   ```

4. **Environment Configuration**

   Create a `.env` file in the `reviews-api` directory:

   ```env
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=feedback_restaurant
   DB_PORT=5432
   JWT_SECRET=your_secret_key
   PORT=3000
   ```

## Running the Application

### Development Mode

```bash
cd reviews-api
npm run dev
```

### Production Mode

```bash
cd reviews-api
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your environment variables).

## API Endpoints

### Reviews

#### Submit a Review

- **POST** `/reviews/reviews`
- **Description**: Submit a new restaurant review
- **Body**:
  ```json
  {
    "idemployee": 1,
    "ratespeedservice": 5,
    "ratesatisfactionfood": 4,
    "rateemployee": 5,
    "comment": "Excellent service and delicious food!",
    "ispublic": true
  }
  ```
- **Response**: Returns the created review object

#### Get Public Reviews

- **GET** `/reviews/reviews/public`
- **Description**: Retrieve all public reviews
- **Response**: Array of public review objects
- **Example Response**:
  ```json
  [
    {
      "idreview": 1,
      "idemployee": 1,
      "date": "2025-07-27T21:14:36.152673-05:00",
      "ratespeedservice": 4,
      "ratesatisfactionfood": 5,
      "rateemployee": 5,
      "comment": "The chef prepared an exceptional meal!",
      "ispublic": true
    }
  ]
  ```

### Analytics

#### Get Employee Statistics

- **GET** `/employees/employees/:id/stats`
- **Description**: Get performance statistics for a specific employee
- **Parameters**: `id` - Employee ID
- **Response**: Employee performance metrics
- **Example Response**:
  ```json
  {
    "averageemployeerating": 4.5,
    "averagespeedservice": 4.2,
    "averagefoodsatisfaction": 4.8,
    "reviewcount": 10
  }
  ```

## Database Schema

### Review Table

| Column                 | Type                     | Description                    |
| ---------------------- | ------------------------ | ------------------------------ |
| `idreview`             | SERIAL PRIMARY KEY       | Unique review identifier       |
| `idemployee`           | INTEGER                  | Employee ID (foreign key)      |
| `date`                 | TIMESTAMP WITH TIME ZONE | Review submission date         |
| `ratespeedservice`     | SMALLINT                 | Speed of service rating (1-5)  |
| `ratesatisfactionfood` | SMALLINT                 | Food satisfaction rating (1-5) |
| `rateemployee`         | SMALLINT                 | Employee rating (1-5)          |
| `comment`              | VARCHAR(500)             | Review comment                 |
| `ispublic`             | BOOLEAN                  | Whether review is public       |

### Employee Table

| Column       | Type                     | Description                |
| ------------ | ------------------------ | -------------------------- |
| `idemployee` | SERIAL PRIMARY KEY       | Unique employee identifier |
| `name`       | VARCHAR(35)              | Employee name              |
| `email`      | VARCHAR(255)             | Employee email             |
| `isactive`   | BOOLEAN                  | Employee active status     |
| `createdat`  | TIMESTAMP WITH TIME ZONE | Employee creation date     |

## Validation Rules

- **Ratings**: Must be numbers between 1 and 5
- **Comments**: Must be strings between 10 and 500 characters
- **Employee ID**: Must be a positive number (if provided)
- **Employee Rating**: Required if employee ID is provided

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (validation errors)
- `500` - Internal Server Error (server/database errors)

Error response format:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Validation error message"
}
```
