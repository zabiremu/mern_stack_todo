import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import cookieParser from "cookie-parser";
import router from './routes/api.js';
import { MAX_JSON_SIZE, MONGODB_CONNECTION, PORT, REQUEST_LIMIT_NUMBER, REQUEST_LIMIT_TIME, URL_ENCODED, WEB_CACHE } from "./app/config/config.js";

const app = express();

// Security Apply
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(cookieParser())

// Request Size Limit
app.use(express.json({ limit: MAX_JSON_SIZE }));

// URL Encode
app.use(express.urlencoded({ extended: URL_ENCODED }));

// Request Rate Limit
const limiter = rateLimit({ windowMs: REQUEST_LIMIT_TIME, max: REQUEST_LIMIT_NUMBER })
app.use(limiter)

// Web cache
app.set('etag', WEB_CACHE)

// MongoDB connection
// mongoose.connect(MONGODB_CONNECTION, { autoIndex: true })
//     .then(() => {
//         console.log("Database Connected")
//     }).catch((err) => {
//         console.log("Database Error", err)
//     })

// Add App Router
app.use("/api", router)

// App Run
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})