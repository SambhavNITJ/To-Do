import "dotenv/config";
import express from 'express';
import authRoutes from './Routes/auth.js';
import todoRoutes from './Routes/todo.js';
import connectDB from './db/index.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
}));

// Routes
app.use('/api/user', authRoutes);
app.use('/api/todo', todoRoutes);
app.get('/', (req, res) => res.send('Hello World'));


// Connect to MongoDB and start the server
connectDB()
    .then(() => {
        const PORT = 3000 || process.env.PORT;
        app.listen(PORT, () => {
            console.log(`✅ Server is running on ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Server failed to start:", err);
        process.exit(1);
    });
