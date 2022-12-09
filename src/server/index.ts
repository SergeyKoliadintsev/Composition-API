import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import jsonwebtoken from "jsonwebtoken";

import { DateTime } from "luxon";
import { INewUser, IUser } from "../user";

interface Post {
  id: string;
  title: string;
  created: string;
  markdown: string;
  html: string;
}

interface TimeLinePost extends Omit<Post, "created"> {
  created: DateTime;
}

export const today: Post = {
  id: "1",
  title: "Today",
  created: DateTime.now().toISO(),
  markdown: "",
  html: "",
};

export const thisWeek: Post = {
  id: "2",
  title: "This week",
  created: DateTime.now().minus({ days: 5 }).toISO(),
  markdown: "",
  html: "",
};

export const thisMonth: Post = {
  id: "3",
  title: "This month",
  created: DateTime.now().minus({ weeks: 3 }).toISO(),
  markdown: "",
  html: "",
};

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

const allPosts = [today, thisWeek, thisMonth];
const allUsers: IUser[] = [];

app.get("/posts", (req: any, res: any) => {
  res.json(allPosts);
});

app.post<{}, {}, Post>("/posts", (req: any, res: any) => {
  const post = { ...req.body, id: (Math.random() * 100000).toFixed() };
  allPosts.push(post);
  res.json(post);
});

const SECRET = "my-secret";
const COOKIE = "vuejs-jwt";

function authenticate(id: string, req: Request, res: Response) {
  const token = jsonwebtoken.sign({ id }, SECRET, {
    issuer: "vuejs-course",
    expiresIn: "30 days",
  });
  res.cookie(COOKIE, token, { httpOnly: true });
}

app.get("/current-user", (req, res) => {
  try {
    const token = req.cookies[COOKIE];
    const result = jsonwebtoken.verify(token, SECRET) as { id: string };
    res.json({ id: result.id });
  } catch (e) {
    res.status(404).end();
  }
});

app.post("/logout", (req, res) => {
  res.cookie(COOKIE, "", { httpOnly: true });
  res.status(200).end();
});

app.post<{}, {}, INewUser>("/login", (req: any, res: any) => {
  const targetUser = allUsers.find((x) => x.username === req.body.username);

  if (!targetUser || targetUser?.password !== req.body.password) {
    res.status(401).end();
  } else {
    authenticate(targetUser.id, req, res);
    res.status(200).end();
  }
});

app.post<{}, {}, INewUser>("/users", (req: any, res: any) => {
  const user = { ...req.body, id: (Math.random() * 100000).toFixed() };
  allUsers.push(user);
  authenticate(user.id, req, res);
  const { password, ...rest } = user;
  res.json(rest);
});

app.listen(8000, () => {
  console.log("Listening on port 8000");
});
