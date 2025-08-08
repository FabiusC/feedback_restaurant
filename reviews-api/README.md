# Restaurant Feedback API

A RESTful API built with Node.js, TypeScript, and PostgreSQL to manage customer feedback for a restaurant. This project is part of a full-stack application that includes a web frontend.

## 🏗️ Architecture

The application follows a layered architecture:

### Architecture Layers

1. **Domain Entities** - Business domain entities

   - `Employee` - Restaurant employee
   - `Review` - Customer review/feedback
   - `Report` - Analysis report

2. **Data Transfer Objects (DTOs)** - Data transfer objects

   - `ReviewDTO` - For transferring review data
   - `EmployeeStatsDTO` - For employee statistics

3. **Data Access Layer** - Data access layer

   - `EmployeeRepository` - CRUD operations for employees
   - `ReviewRepository` - CRUD operations for reviews
   - `DatabaseConnection` - PostgreSQL connection

4. **Service Layer** - Business service layer
   - `FeedbackService` - Business logic for feedback
   - `AnalyticsService` - Business logic for analytics

## 🚀 Features

- ✅ Well-defined layered architecture
- ✅ TypeScript for static typing
- ✅ PostgreSQL as database
- ✅ Data validation
- ✅ Robust error handling
- ✅ Request logging
- ✅ Automatic API documentation
- ✅ Health checks
- ✅ CORS enabled
- ✅ Security with Helmet

## 📋 Implemented User Stories

### Rating Functionalities

- ✅ Rate Speed Service from 1 to 5 stars
- ✅ Rate the level of Satisfaction with Food from 1 to 5 stars
- ✅ Select Employee to Rate (optional)
- ✅ Rate Employee Attitude from 1 to 5 stars (when employee is selected)

### Comment Functionalities

- ✅ Leave a comment about our service (maximum 500 characters)
- ✅ Read Customer Comments
- ✅ Sort or filter comments by date
- ✅ Sort or filter reviews by date

### Analytics Functionalities

- ✅ View Average Ratings per Category
- ✅ Press "Submit" Button

### Business Validations

- ✅ If an employee is selected, the employee must be rated
- ✅ If no employee is selected, employee cannot be rated
- ✅ Public comments cannot be empty
- ✅ 500 character limit on comments

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd reviews-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp env.example .env
   ```

   Edit the `.env` file with your configurations:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=feedback_restaurant
   DB_USER=postgres
   DB_PASSWORD=server
   PORT=3000
   NODE_ENV=development
   ```

4. **Create the database**

   ```sql
   CREATE DATABASE feedback_restaurant;
   ```

5. **Compile TypeScript**

   ```bash
   npm run build
   ```

6. **Run the application**

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 📚 API Endpoints

### Health Check

- `GET /health` - Check server status

### Feedback

- `POST /reviews` - Submit a new review
- `GET /reviews/public` - Get public reviews

### Analytics

- `GET /employees` - Get rating averages
- `GET /employees/:id/stats` - Employee performance
- `GET /employees/:id` - Employee details

## 📝 Usage Examples

### Submit a Review

```bash
curl -X POST http://localhost:3000/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "ratespeedservice": 4,
    "ratesatisfactionfood": 5,
    "idemployee": 1,
    "rateemployee": 4,
    "comment": "Excellent service and delicious food",
    "ispublic": true
  }'
```

**Note:** Previous field names are also accepted for compatibility:

```bash
curl -X POST http://localhost:3000/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "speedRating": 4,
    "foodRating": 5,
    "idEmployeeSelected": 1,
    "employeeRating": 4,
    "comment": "Excellent service and delicious food",
    "isPublic": true
  }'
```

### Get Public Reviews

```bash
curl http://localhost:3000/reviews/public
```

## 🧪 Available Scripts

- `npm run dev` - Run in development mode with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Run in production mode
- `npm test` - Run tests
- `npm run lint` - Check code with ESLint
- `npm run lint:fix` - Automatically fix ESLint errors

## 🗄️ Database Structure

### Table: employee

- `idemployee` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(35) NOT NULL)
- `email` (VARCHAR(255) CHECK regex)
- `isactive` (BOOLEAN DEFAULT true)
- `createdat` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)

### Table: review

- `idreview` (SERIAL PRIMARY KEY)
- `idemployee` (INTEGER REFERENCES employee(idemployee) ON DELETE SET NULL)
- `date` (TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)
- `ratespeedservice` (SMALLINT NOT NULL CHECK 1-5)
- `ratesatisfactionfood` (SMALLINT NOT NULL CHECK 1-5)
- `rateemployee` (SMALLINT CHECK 1-5)
- `comment` (VARCHAR(500))
- `ispublic` (BOOLEAN DEFAULT false)

**Constraints:**

- If `idemployee` is NULL, `rateemployee` must be NULL
- If `idemployee` is not NULL, `rateemployee` must have a value between 1-5

## 🔧 Development Configuration

### Environment Variables

- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_NAME` - Database name
- `DB_USER` - PostgreSQL user
- `DB_PASSWORD` - PostgreSQL password
- `PORT` - Server port
- `NODE_ENV` - Environment (development/production)

### Project Structure

```
src/
├── controllers/          # HTTP controllers
├── data/                # Data access layer
│   ├── database/        # Database configuration
│   └── repositories/    # Repositories
├── domain/              # Domain layer
│   └── entities/        # Business entities
├── dto/                 # Data Transfer Objects
├── routes/              # Route definitions
├── services/            # Service layer
└── index.ts            # Entry point
```
