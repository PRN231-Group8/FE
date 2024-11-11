import { TourResponse } from './tourResponse';

export interface BookingHistoryResponse{
  id: string;
  transactionAmount: number;
  transactionStatus: PaymentTransactionStatus;
  paymentMethod: string;
  numberOfPassengers: number;
  tourTripDate: Date;
  tour: TourResponse;
}
export type PaymentTransactionStatus = 'SUCCESSFUL' | 'FAILED' | 'PENDING';