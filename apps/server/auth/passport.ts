import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { emailAndPassword } from "../zod/auth";
import { db } from "../database/db";
import { userTable } from "../database/schemas/user";
import { eq } from "drizzle-orm";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import bcrypt from "bcrypt";

export function setupPassport() {
  passport.use(
    "signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, a, b, done) => {
        console.log("inside passport authenticate");
        const email: string = req.body.email;
        const password: string = req.body.password;
        const parsed = emailAndPassword.safeParse({ email, password });

        if (!parsed.success) {
          return done(null, false, { message: parsed.error.errors[0].message });
        }

        console.log("before fetching");
        const result = await db
          .select()
          .from(userTable)
          .where(eq(userTable.email, email));

        if (result.length > 0) {
          return done(null, false, { message: "Email already exists" });
        }
        console.log("after fetching");

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await db
          .insert(userTable)
          .values({
            email,
            hashedPassword: hashedPassword,
          })
          .returning();

        return done(null, user[0]);
      }
    )
  );

  passport.use(
    "signin",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        const parsed = emailAndPassword.safeParse({ email, password });

        if (!parsed.success) {
          return done(null, false, { message: parsed.error.errors[0].message });
        }

        const result = await db
          .select()
          .from(userTable)
          .where(eq(userTable.email, email));

        if (result.length === 0) {
          return done(null, false, { message: "User not found" });
        }

        if (!(await bcrypt.compare(password, result[0].hashedPassword))) {
          return done(null, false, { message: "Password is incorrect" });
        }

        return done(null, result[0]);
      }
    )
  );

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET as string,
      },
      async function (jwtPayload: { id: number; email: string }, cb) {
        const userResponse = await db
          .select()
          .from(userTable)
          .where(eq(userTable.id, jwtPayload.id));

        if (userResponse.length === 0) {
          return cb("User not found", null);
        }

        return cb(null, userResponse[0]);
      }
    )
  );
}
