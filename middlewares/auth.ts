import { Request, Response, NextFunction } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
  // @ts-expect-error not declared
  if (req.session.user) {
    return next();
  }

  return res.redirect("/");
}
