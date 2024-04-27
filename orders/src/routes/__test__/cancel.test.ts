import request from "supertest";
import app from "../../app";
import Ticket from "../../models/ticket";
import { OrderStatus } from "@akilaticketstest/common";

it("marks an order as cancelled", async () => {
  const authCookie = getAuthCookie();
  // Create a ticket
  const ticket = Ticket.build({ title: "concert", price: 20 });
  await ticket.save();

  // Make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", authCookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make a request to cancel the order
  const { body: cancelledOrder } = await request(app)
    .put(`/api/orders/${order.id}`)
    .set("Cookie", authCookie)
    .send()
    .expect(200);

  // Make sure the order is cancelled
  expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled);
});

it.todo("emits a order cancelled event");
