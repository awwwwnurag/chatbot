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

// --- VERCEL DIAGNOSTICS ---
process.on('uncaughtException', (err) => {
    console.error('CRITICAL: Uncaught Exception:', err.message);
    console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

if (!process.env.MONGODB_URI) {
    console.error('FATAL ERROR: MONGODB_URI is not defined in Environment Variables.');
}
// --------------------------

console.log('INITIALIZING SERVER...');
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || true, // Reflects the request origin for credentials Support
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request Logger (Helpful for Vercel debugging)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.options('/:path*', cors());

// Special handling for Stripe webhooks (must be BEFORE express.json)
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

app.use(express.json());

// Middleware to ensure database connection
const ensureDBConnection = async (req, res, next) => {
    try {
        console.log(`[${new Date().toISOString()}] Connecting to MongoDB for ${req.path}...`);
        await connectDB();
        next();
    } catch (error) {
        console.error('DATABASE CONNECTION ERROR:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Database connection failed. Check Vercel Environment Variables.',
            error: process.env.NODE_ENV === 'production' ? null : error.message
        });
    }
};

app.use('/api', (req, res, next) => {
    if (req.path === '/stripe') return next();
    return ensureDBConnection(req, res, next);
});

// Health Checks
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', time: new Date().toISOString() });
});

app.get('/', (req, res) => {
    res.status(200).send('API is running...');
});

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRouter)
app.use('/api/credit', creditRouter)

app.all('/api/:path*', (req, res) => {
    res.status(404).json({ success: false, message: 'API endpoint not found' });
});

app.all('/:path*', (req, res) => {
    res.status(200).send('API is running...');
});

// Export for Vercel
export default app;

// Only listen locally
const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL || process.env.NODE_ENV === 'production';
console.log('Vercel environment detected:', isVercel);

if (!isVercel) {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server running at: http://localhost:${PORT}`);
    });
}
