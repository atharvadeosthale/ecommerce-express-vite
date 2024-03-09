import { Router } from "express";
import { signup } from "../functions/signup";
import { signin } from "../functions/signin";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);

export default router;
