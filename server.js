import app from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception. Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
    console.log(`App is running at http://localhost:${port} ...`);
});

mongoose
.connect(process.env.DATABASE)
.then(() => {
    console.log('Connected to DB successfully');
}).catch(err => {
    console.log('Failed to connect DB!');
});

process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection. Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});