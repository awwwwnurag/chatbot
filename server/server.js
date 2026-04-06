
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import connectDB from './configs/db.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import creditRouter from './routes/creditRoutes.js';
import { stripeWebhooks } from './controllers/webhooks.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


await connectDB();


app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Server is running');
});
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRouter)
app.use('/api/credit', creditRouter)


// SERVE CLIENT SIDE FILES
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Triggering restart to load new .env variables
server.listen(PORT, () => {
    console.log(`
    ==================================================
    🚀 SERVER UPDATED & RESTARTED SUCCESSFULLY 🚀
    Image Generation Fix: APPLIED (Direct Pollinations URL)
    Current Time: ${new Date().toLocaleTimeString()}
    ==================================================
    `);
    console.log(`Server running at: http://localhost:${PORT}`);
});
