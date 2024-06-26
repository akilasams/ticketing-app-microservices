import express, { Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@akilaticketstest/common";
import { Order, OrderStatus } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    order.status = OrderStatus.Cancelled;
    await order.save();

    // Publish an evnt saying the order was cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.__v,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.send(order);
  }
);

export { router as cancelOrderRouter };
