import { Message } from "./message";

export interface ContactUsPayload {
  to: Array<string>;
  from: string;
  message: Message;
}
