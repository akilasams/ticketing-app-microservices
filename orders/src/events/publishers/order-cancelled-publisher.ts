import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@akilaticketstest/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
