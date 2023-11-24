import "express-session";
import { Express, Request, Response } from "express";
import { UsersModel, Users } from "../models/users";
import argon2 from "argon2";
import AuthMiddleware from "../middlewares/auth";

export class UsersController {
  app: Express;

  constructor(app: Express) {
    this.app = app;
  }

  init() {
    this.app.get("/", (req, res) => this.index(req, res));
    this.app.post("/login", (req, res) => this.login(req, res));
    this.app.get("/protected", AuthMiddleware, (req, res) =>
      this.protected(req, res)
    );
  }

  index(_req: Request, res: Response) {
    res.render("index");
  }

  protected(req: Request, res: Response) {
    // @ts-expect-error not declared
    const user = req.session.user;
    return res.render("protected", { user });
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as Omit<Users, "id">;
      const user = await UsersModel.query()
        .select("*")
        .where("email", email)
        .first()
        .throwIfNotFound();

      if (await argon2.verify(user.password, password)) {
        // @ts-expect-error not declared
        req.session.user = user;
        return res.redirect("/protected");
      }

      return res.redirect("/");
    } catch (error) {
      console.error(error);
      return res.redirect("/");
    }
  }
}
