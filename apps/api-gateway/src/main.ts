/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
// This will work for as a middleware API gateway. Each service can be accessed via /service-name/endpoint

import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import axios from "axios";
import cookieParser from "cookie-parser";

import * as path from "path";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());
app.set("trust proxy", 1);

// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req: any) => (req.user ? 1000 : 100), // limit each IP to 100 requests per windowMs for unauthenticated users, 1000 for authenticated
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any) => req.ip,
});
app.use(limiter); //  apply to all requests




app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/gateway-health", (req, res) => {
  res.send({ message: "Welcome to api-gateway!" });
});



// Connect our services
app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:6001",
    changeOrigin: true,
    // preserve original host header if needed:
    // xfwd: true,
  })
);




const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on("error", console.error);
