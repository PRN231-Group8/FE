export interface CallbackResponse {
  success: boolean;
  orderDescription: string;
  orderId: string;
  token: string;
  amount: number;
  message: string;
  transactionId: string;
  paymentMethod: string;
  paymentId: string;
  vnPayResponseCode: string;
}
