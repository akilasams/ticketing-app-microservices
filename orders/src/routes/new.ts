import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@akilaticketstest/common";
import { body } from "express-validator";
import Ticket from "../models/ticket";
import Order from "../models/order";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      // Checking for valid mongoId couples the orders service with the tickets service in a slight way, remove if not needed
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("ticketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the DB
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) throw new NotFoundError();

    // Make sure that the ticket is not already reserved
    // Run query to look at all orders. Find an order where the ticket is the ticket we just found and the orderStatus != cancelled
    // If we find an order under this criteria -> ticket is reserved
    const existingOrder = await Order.findOne({
      ticket: ticket,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete,
        ],
      },
    });

    if (existingOrder) throw new BadRequestError("Ticket is already reserved");

    // Calculate an expiration date for this order

    // Build the order and save it to the DB

    // Publish an event saying that an order was created

    res.send({});
  }
);

export { router as createOrderRouter };
