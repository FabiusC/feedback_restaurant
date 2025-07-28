import express from 'express';
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler.js';
import setupRoutes from './routes/index.js';

const app = express();

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(express.json());
app.use(morgan('dev'));

setupRoutes(app);

app.use(errorHandler);

export default app;