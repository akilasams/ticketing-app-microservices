import request from "supertest";
import Ticket from "../../models/ticket";
import app from "../../app";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const cookie = getAuthCookie();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  const cookie = getAuthCookie();
  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "", price: 10 })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ price: 10 })
    .expect(400);
});

it("returns an error in an invalid price in provided", async () => {
  const cookie = getAuthCookie();
  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "test_title", price: -10 })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "test_title" })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  const cookie = getAuthCookie();

  const title = "test_title";
  const price = 20;

  let tickets = await Ticket.find({}); // gets all tickets inside the collection which is 0 because of beforeEach setup
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(201);

  tickets = await Ticket.find({}); // Now a ticket should exist since the request has been sent to create one
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
});

it("publishes an event", async () => {
  const cookie = getAuthCookie();

  const title = "test_title";
  const price = 20;

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
