import { Request, Response } from "express";
import { stripe } from "../stripe/stripe";
import { db } from "../database/db";
import { userTable } from "../database/schemas/user";
import { eq } from "drizzle-orm";

export async function createAccount(req: Request, res: Response) {
  if (!req.user) return;

  const { stripeAccountId, id, fullName, email } = req.user;

  if (stripeAccountId !== "") {
    return res.status(400).json({ error: "Account already created" });
  }

  const account = await stripe.accounts.create({
    email,
    business_type: "individual",
    individual: {
      full_name_aliases: [fullName],
    },
  });

  await db
    .update(userTable)
    .set({ stripeAccountId: account.id })
    .where(eq(userTable.id, id));

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    type: "account_onboarding",
  });

  return res.json({
    message: "Account created successfully",
    onboardingLink: accountLink.url,
  });
}

export async function checkAccount(req: Request, res: Response) {
  if (!req.user) return;

  return res.json({ message: "Account ready", ready: true });
}

export async function updateAccount(req: Request, res: Response) {
  if (!req.user) return;

  const { stripeAccountId } = req.user;

  if (stripeAccountId === "") {
    return res.status(400).json({ error: "Account not created" });
  }

  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountId,
    type: "account_update",
  });

  return res.json({ onboardingLink: accountLink.url });
}
