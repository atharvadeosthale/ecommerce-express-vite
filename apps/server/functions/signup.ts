import { NextFunction, Request, Response } from "express";
import {
  EmailPasswordAndNameSchema,
  emailPasswordAndNameSchema,
} from "../zod/auth";
import { User } from "../database/schemas/user";
import passport from "passport";
import jwt from "jsonwebtoken";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, fullName }: EmailPasswordAndNameSchema = req.body;

  const parsed = emailPasswordAndNameSchema.safeParse({
    email,
    password,
    fullName,
  });

  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.errors });
  }

  console.log("before passport authenticate");

  await passport.authenticate(
    "signup",
    { session: false },
    async (err: string | null, user: User, info: { message: string }) => {
      console.log("inside passport authenticate");

      if (err) {
        return res.status(400).json({ error: err });
      }

      if (!user) {
        return res.status(400).json({ error: info.message });
      }

      const jwtData = {
        id: user.id,
        email: user.email,
      };

      const token = await jwt.sign(jwtData, process.env.JWT_SECRET as string);
      return res.json({ user: jwtData, token });
    }
  )(req, res, next);
};
