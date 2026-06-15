export interface IPaymentService {
  createOrder(amount: number, currency: string, receipt: string): Promise<unknown>;
  verifyPayment(orderId: string, paymentId: string, signature: string): boolean;
}

export const IPAYMENT_SERVICE = Symbol('IPaymentService');
