import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import postRoute from "./routes/post.route.js";
const app = express();

app.use(express.json());
app.use(cookieParser());
dotenv.config();

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch((error) => {
    console.log("MongoDb Connection failed!!", error);
  });

// 0BnpAsfYyGEDktHg

// 115.96.218.166/32

// hermanos1@hermanos.com

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
