import express from "express";
import morgan from "morgan";
import indexRoutes from "./routes/index.routes";

const app = express();

app.use(morgan("dev"));

// routes
app.use(indexRoutes);

export default app;
