import { Controller, Post, Body, BadRequestException, Inject } from '@nestjs/common';
import { RazorpayService } from 'src/shared/services/payment/razorpay.service';
import type { ISubscriptionRepository } from '../../domain/repositories/isubscription.repository';
import type { ISubscriptionPlanRepository } from '../../domain/repositories/isubscription-plan.repository';
import type { ICompanyRepository } from '../../../auth/domain/repositories/icompany.repository';
import type { IUserRepository } from '../../../auth/domain/repositories/iuser.repository';
import { OnboardingStep } from 'src/shared/enums/company/onboarding-step.enum';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    private readonly razorpayService: RazorpayService,
    @Inject('ISubscriptionRepository')
    private readonly _subscriptionRepository: ISubscriptionRepository,
    @Inject('ISubscriptionPlanRepository')
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    @Inject('ICompanyRepository')
    private readonly _companyRepository: ICompanyRepository,
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) { }

  @Post('create-order')
  async createOrder(@Body() body: { planId: string; companyId: string }) {
    const plan = await this._subscriptionPlanRepository.findById(body.planId);
    if (!plan) throw new BadRequestException('Plan not found');

    if (plan.price === 0) {
      // For Free plan, activate immediately
      return { isFree: true, planId: plan.id };
    }

    const order = await this.razorpayService.createOrder(
      plan.price,
      'INR',
      `receipt_${Date.now()}`,
    );

    return { order, isFree: false };
  }

  @Post('verify-payment')
  async verifyPayment(@Body() body: {
    orderId?: string;
    paymentId?: string;
    signature?: string;
    planId: string;
    companyId: string;
    userId: string;
    isFree?: boolean;
  }) {
    const plan = await this._subscriptionPlanRepository.findById(body.planId);
    if (!plan) throw new BadRequestException('Plan not found');

    if (!body.isFree) {
      if (!body.orderId || !body.paymentId || !body.signature) {
        throw new BadRequestException('Payment details missing');
      }
      const isValid = this.razorpayService.verifyPayment(body.orderId, body.paymentId, body.signature);
      if (!isValid) throw new BadRequestException('Invalid payment signature');
    }

    // Create Subscription record
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

    await this._subscriptionRepository.save({
      companyId: body.companyId,
      planId: body.planId,
      status: 'ACTIVE',
      razorpayPaymentId: body.paymentId,
      startDate,
      endDate,
    });

    // Update Company Onboarding Step
    await this._companyRepository.updateById(body.companyId, {
      onboardingStep: OnboardingStep.CONFIRMATION,
    });

    return { success: true, message: 'Subscription activated successfully' };
  }
}
