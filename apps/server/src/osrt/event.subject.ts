import { Subject } from "rxjs";

export interface IEvent {
  jobId: string;
  msg: string;
}

export const eventSubject = new Subject<IEvent>();
