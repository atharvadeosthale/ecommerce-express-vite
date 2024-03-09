import "dotenv/config";
import express from "express";
import auth from "./routes/auth";
import cors from "cors";
import { connectToDb } from "./database/db";
import { setupPassport } from "./auth/passport";

connectToDb();
setupPassport();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", auth);

app.get("/", (req, res) => {
  res.json({ message: "It works" });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
