import { Request, Response } from "express";

export async function createAccount(req: Request, res: Response) {
  return res.json({ message: "Account created successfully" });
}

export async function checkAccount(req: Request, res: Response) {
  return res.json({ message: "Login successful" });
}
