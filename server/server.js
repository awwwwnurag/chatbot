
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
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MIDDLEWARE
// More robust CORS for Vercel
app.use(cors({
    origin: true, // Allow all origins in dev, or specify your vercel domain here
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Manual handle for pre-flight (OPTIONS) requests - CRITICAL for some Vercel setups
app.options('*', cors());

// Special handling for Stripe webhooks (must be BEFORE express.json)
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

// Global JSON parser for all other routes
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



// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', time: new Date().toISOString() });
});

app.get('/', (req, res) => {
    res.send('Athena AI API is running');
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRouter)
app.use('/api/credit', creditRouter)


// For Vercel deployment, serve the React app
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the client build
    const distPath = path.join(__dirname, '../client/dist');
    app.use(express.static(distPath));
    
    // Fallback for SPA routing
    app.get('*', (req, res) => {
        if (req.path.startsWith('/api')) {
            return res.status(404).json({ success: false, message: 'API endpoint not found' });
        }
        res.sendFile(path.join(distPath, 'index.html'));
    });
} else {
    // Development fallback
    app.get('*', (req, res) => {
        if (req.path.startsWith('/api')) {
            return res.status(404).json({ success: false, message: 'API endpoint not found' });
        }
        res.status(200).send('Athena AI API is active. Please use the frontend to interact.');
    });
}

const PORT = process.env.PORT || 4000;

// Export app for Vercel
export default app;

// Only listen if not running as a Vercel function
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const server = http.createServer(app);
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
}

