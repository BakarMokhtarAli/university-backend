import express from "express";
import cors from "cors";

// global error handler
import globalErrorHandler from "./controllers/error.controller";
import AppError from "./utils/AppError";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

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
