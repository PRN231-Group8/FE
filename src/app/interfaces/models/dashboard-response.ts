export interface DashboardResponse {
  getTotalCompletedAmount: number;
  successfulPaymentsCount: number;
  approvedPostsCount: number;
  pendingPostsCount: number;
  rejectedPostsCount: number;
  activeUsersCount: number;
  totalPassengers: number;
  activeTransportationsCount: number;
  moodUsage: Array<{ moodTag: string; count: number }>;
  earningsByDay: Array<{ date: string; totalEarnings: number }>;
  earningsByMonth: Array<{
    year: number;
    month: number;
    totalEarnings: number;
  }>;
  orderHistory: Array<{
    orderId: string;
    userId: string;
    amount: number;
    status: string;
    createdDate: string;
  }>;
}
