import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from "@akilaticketstest/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
