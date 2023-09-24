import { Subject } from "rxjs";

interface IEvent {
  jobId: string;
  msg: string;
}

export const eventSubject = new Subject<IEvent>();
