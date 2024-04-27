import request from "supertest";
import app from "../../app";
import Ticket from "../../models/ticket";

it("fetches the order", async () => {
  const authCookie = getAuthCookie();

  // Create a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", authCookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", authCookie)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if one user tries to fetch another users order", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  // Make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", getAuthCookie())
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", getAuthCookie())
    .send()
    .expect(401);
});
