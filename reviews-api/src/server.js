import express from 'express';
import app from './app.js';
import config from './config/config.js';

const PORT = config.PORT || 3000;

app.listen(PORT, (err) => {
    if (err) {
        console.error('Error starting the server:', err);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});