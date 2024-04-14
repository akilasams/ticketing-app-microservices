import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@akilaticketstest/common";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { getTicketsRouter } from "./routes/get";
import { updateTicketRouter } from "./routes/update";

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
app.use(showTicketRouter);
app.use(getTicketsRouter);
app.use(updateTicketRouter);

// Send a 404 if route doesnt exist
app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
