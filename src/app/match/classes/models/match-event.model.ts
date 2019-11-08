import { MatchEventType } from '../match-event-type.enum';

export class MatchEvent {
  constructor(type: MatchEventType, msg: string) {
    this.eventType = type;
    this.message = msg;
  }
  eventType: MatchEventType;
  message: string;
}
