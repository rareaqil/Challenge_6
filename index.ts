import express, { Express } from "express";
import { UsersController } from "./controllers/users";
import Knex from "knex";
import { Model } from "objection";
import session from "express-session";

const knexInstance = Knex({
  client: "postgresql",
  connection: {
    database: "my_db",
    user: "username",
    password: "password",
  },
});

Model.knex(knexInstance);

const app: Express = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "kucing",
    cookie: { secure: false },
  })
);

new UsersController(app).init();

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
