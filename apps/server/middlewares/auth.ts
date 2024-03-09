import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { User } from "../database/schemas/user";

export const authenticatedUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: string | null, user: User, info: { message: string }) => {
      if (err) {
        return res.status(400).json({ error: err });
      }

      if (!user) {
        return res.status(400).json({ error: info.message });
      }

      req.user = user;
      next();
    }
  );
};
