import request from "supertest";
import app from "../../app";
import Ticket from "../../models/ticket";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "Concert",
    price: 20,
  });
  await ticket.save();
  return ticket;
};

it("fetches orders for a particular user", async () => {
  // Create 3 tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = getAuthCookie(); // Sign in
  const userTwo = getAuthCookie();

  // Create one order as User #1
  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Create two order as User #2
  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: orderThree } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // Make requests to get orders for User #2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .expect(200);

  // Make sure we only got the orders for User #2
  expect(response.body).toHaveLength(2);
  expect(response.body[0].id).toEqual(orderTwo.id);
  expect(response.body[1].id).toEqual(orderThree.id);
});