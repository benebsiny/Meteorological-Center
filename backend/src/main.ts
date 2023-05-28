import express, { Express, Request, Response } from 'express';
import apiHandler from './api';

const app: Express = express();
const port = 5000;

export const initialize = () => {

    // app.get('/', ());

    app.get('/api', apiHandler);

    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}


export default app;
