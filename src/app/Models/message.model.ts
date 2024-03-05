export interface Feedback {
  feebackId: number;
  fullname: string;
  senderId: string;
  senderEmail: string;
  responderId: string;
  responderEmail: string;
  isresponded: boolean;
  title: string;
  FeedbackMessages: FeedbackMessage[];
}

export interface FeedbackMessage {
  senderId: string;
  senderEmail: string;
  responderId: string;
  responderEmail: string;
  feedback: string;
  response: string;
}
