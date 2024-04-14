import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", getAuthCookie())
    .send({ title: "test_title", price: 20 })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "test_title", price: 20 })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", getAuthCookie())
    .send({ title: "test_title", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", getAuthCookie())
    .send({ title: "new_title", price: 100 })
    .expect(401);
});

it("returns a 401 if the user provides an invalid title or price", async () => {
  const cookie = getAuthCookie();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "test_title", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 20 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "new_title", price: -20 })
    .expect(400);
});

it("updates the ticket if valid inputs provided", async () => {
  const cookie = getAuthCookie();

  const newTitle = "new_title";
  const newPrice = 100;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "test_title", price: 20 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: newTitle, price: newPrice });

  const updatedTicketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(updatedTicketResponse.body.title).toEqual(newTitle);
  expect(updatedTicketResponse.body.price).toEqual(newPrice);
});
