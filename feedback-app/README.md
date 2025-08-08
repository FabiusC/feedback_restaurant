# Restaurant Feedback System - Frontend

A modern, responsive web application for collecting and displaying restaurant feedback and analytics, built with vanilla HTML, CSS, and JavaScript.

## 📁 Project Structure

```
feedback-app/
├── index.html              # Main entry point (redirects to dashboard)
├── styles.css              # Shared CSS styles
├── README.md               # This file
├── dashboard/              # Dashboard application
│   ├── index.html         # Dashboard page with charts and analytics
│   └── dashboard.js       # Dashboard logic and API integration
└── feedback/              # Feedback form application
    ├── index.html         # Feedback form page with star ratings
    └── feedback.js        # Feedback form logic and API integration
```

## 🚀 Getting Started

### Prerequisites

- Backend API running on `http://localhost:3000`
- Modern web browser
- Local HTTP server

### Running the Application

1. **Start the backend API** (if not already running):

   ```bash
   cd ../reviews-api
   npm start
   ```

2. **Start a local HTTP server** in the feedback-app directory:

   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Python 2
   python -m SimpleHTTPServer 8000

   # Using Node.js (if you have http-server installed)
   npx http-server -p 8000
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:8000
   ```

## 📱 Features

### Dashboard (`/dashboard/`)

- **Review Management**: View all public reviews with scrolling functionality
- **Auto-refresh**: Data updates every 30 seconds
- **Responsive Design**: Works on desktop, tablet, and mobile

### Feedback Form (`/feedback/`)

- **Star Rating System**: Interactive 5-star ratings for all categories
- **Employee Selection**: Dropdown populated from backend API
- **Form Validation**: Client-side validation with helpful messages
- **Success Animation**: Celebratory modal with confetti and waving hands
- **Public/Private Toggle**: Choose review visibility
- **Mobile-First Design**: Optimized for mobile devices

## 🔧 Technical Details

### Architecture

- **Vanilla JavaScript**: No frameworks, pure ES6+
- **Modular Structure**: Separated concerns between dashboard and feedback
- **API Integration**: RESTful API consumption with fetch
- **Error Handling**: Graceful error handling with user feedback

### Key Components

- **Star Rating System**: Custom implementation with radio buttons
- **Gauge Charts**: CSS-based circular progress indicators
- **Modal System**: Custom modal implementation with animations
- **Form Validation**: Client-side validation with custom logic

## 📊 API Endpoints Used

- `GET /reviews/public` - Fetch public reviews
- `POST /reviews` - Submit new review
- `GET /employees` - Fetch employee list
- `GET /employees/:id/stats` - Employee statistics

## 🛠️ Development

### File Organization

- **HTML**: Complete structure in HTML files
- **JavaScript**: Pure logic, no HTML strings
- **CSS**: Shared styles with component-specific rules

### Code Quality

- **Error Handling**: Try-catch blocks with user-friendly messages
- **Performance**: Efficient DOM manipulation and API calls
- **Accessibility**: Semantic HTML and keyboard navigation

## 📱 Mobile Responsiveness

The application is designed with a mobile-first approach:

- **Touch-friendly**: Large touch targets and smooth interactions
- **Responsive Grid**: Adapts to different screen sizes
- **Optimized Forms**: Easy-to-use on mobile devices
- **Fast Loading**: Optimized for mobile networks

### Feedback Form

- ✅ **Star Ratings**: Interactive 5-star system for all categories
- ✅ **Employee Dropdown**: Populated from API
- ✅ **Form Validation**: Client-side validation with helpful messages
- ✅ **Success Animation**: Celebratory modal with confetti

**Authors**: Fabio Hurtado - Juan Garnica
