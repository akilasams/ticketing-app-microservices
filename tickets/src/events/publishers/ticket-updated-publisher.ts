import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@akilaticketstest/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
