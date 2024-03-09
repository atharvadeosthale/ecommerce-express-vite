import "dotenv/config";
import express from "express";
import auth from "./routes/auth";
import product from "./routes/product";
import user from "./routes/user";
import { User as AuthUser } from "./database/schemas/user";
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
app.use("/product", product);
app.use("/user", user);

app.get("/", (req, res) => {
  res.json({ message: "It works" });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

declare global {
  namespace Express {
    interface User extends AuthUser {}
  }
}
