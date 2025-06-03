import dotenv from "dotenv";
dotenv.config({path:'./env'});
import db from "./db.js";
import express from "express";
import cors from "cors";
import sessionMiddleware from "./middleware/session.js";
import authRoutes from "./routes/auth.js";
const app = express();

const port = process.env.PORT || 5000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(sessionMiddleware);

app.use("/", authRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
