import { Request } from "express";

export interface IUserContext {
  id: number;
  username: string;
  email: string;
  role: "super" | "admin" | "cashier";
}

export interface AuthRequest extends Request {
  user?: IUserContext;
}
