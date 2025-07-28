export default {
    PORT: process.env.PORT || 3000,
    DB: {
        HOST: process.env.DB_HOST || 'localhost',
        USER: process.env.DB_USER || 'postgres',
        PASSWORD: process.env.DB_PASSWORD || 'server',
        DATABASE: process.env.DB_NAME || 'feedback_restaurant',
        PORT: process.env.DB_PORT || 5432,
    },
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    NODE_ENV: process.env.NODE_ENV || 'development',
};