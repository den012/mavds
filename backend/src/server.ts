import express from 'express';
import cors from 'cors';

import { config } from './config/index';

//database connection 
import { db } from './db/database';

import registerUser from './routes/userRoutes';
import courtRoutes from './routes/courtRoutes';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = config.PORT;

app.use('/api', registerUser);
app.use('/api', courtRoutes);

app.get('/health', async (req, res) => {
    try {
        await db.query('SELECT 1');

        res.send({
            status: 'ok',
            databsae: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch(error) {
        res.status(503).send({
            status: 'error',
            database: 'disconnected',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on localhost:${PORT}`);
})
