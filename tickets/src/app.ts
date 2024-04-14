import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUser,
  requireAuth,
} from "@akilaticketstest/common";
import { createTicketRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true); // Traffic is being proxied to the app thrugh ingress nginx, to make express aware that its behind a proxy
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", // true - Only for https
  })
);

app.use(currentUser);

app.use(createTicketRouter);

// Send a 404 if route doesnt exist
app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
