import express from "express";
import cors from "cors";

// global error handler
import globalErrorHandler from "./controllers/error.controller";
import AppError from "./utils/AppError";

// import routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

const app = express();
app.use(express.json());
app.use(cors());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// 404 no route found
app.use((req, res, next) => {
  next(
    new AppError(
      `The requested URL ${req.originalUrl} was not found on the server.`,
      404
    )
  );
});

app.use(globalErrorHandler);

export default app;
