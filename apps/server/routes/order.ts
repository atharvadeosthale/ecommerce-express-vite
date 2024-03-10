import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "It works" });
});

export default router;
