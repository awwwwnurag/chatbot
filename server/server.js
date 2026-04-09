import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import http from 'http';
import connectDB from './configs/db.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import creditRouter from './routes/creditRoutes.js';
import { stripeWebhooks } from './controllers/webhooks.js';

const app = express();

// MIDDLEWARE
// Simpler CORS for Vercel
app.use(cors({
    origin: '*', // Start with this to ensure connectivity, then restrict if needed
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Manual handle for pre-flight (OPTIONS) requests
app.options('*', cors());

// Special handling for Stripe webhooks (must be BEFORE express.json)
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

// Global JSON parser
app.use(express.json());

// Middleware to ensure database connection
const ensureDBConnection = async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('DATABASE CONNECTION ERROR:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Database connection failed. Check your MONGODB_URI and IP whitelist.',
            error: process.env.NODE_ENV === 'production' ? null : error.message
        });
    }
};

// Use database connection middleware for all API routes
app.use('/api', (req, res, next) => {
    if (req.path === '/stripe') return next();
    return ensureDBConnection(req, res, next);
});

// Health Checks
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', time: new Date().toISOString() });
});

app.get('/', (req, res) => {
    res.send('Athena AI API is active. Proceed to frontend.');
});

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRouter)
app.use('/api/credit', creditRouter)

// Fallback for undefined API routes
app.all('/api/*', (req, res) => {
    res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Export app for Vercel
export default app;

// Only listen if NOT on Vercel
const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL;
if (!isVercel) {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server running at: http://localhost:${PORT}`);
    });
}
