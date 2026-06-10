import { Controller, Post, Body, BadRequestException, Inject, Get, Param } from '@nestjs/common';
import { IPAYMENT_SERVICE } from 'src/shared/services/payment/interfaces/ipayment.service';
import type { IPaymentService } from 'src/shared/services/payment/interfaces/ipayment.service';
import type { ISubscriptionRepository } from '../../domain/repositories/isubscription.repository';
import type { ISubscriptionPlanRepository } from '../../domain/repositories/isubscription-plan.repository';
import type { ICompanyRepository } from '../../../auth/domain/repositories/icompany.repository';
import type { IUserRepository } from '../../../auth/domain/repositories/iuser.repository';
import { OnboardingStep } from 'src/shared/enums/company/onboarding-step.enum';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    @Inject(IPAYMENT_SERVICE)
    private readonly paymentService: IPaymentService,
    @Inject('ISubscriptionRepository')
    private readonly _subscriptionRepository: ISubscriptionRepository,
    @Inject('ISubscriptionPlanRepository')
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    @Inject('ICompanyRepository')
    private readonly _companyRepository: ICompanyRepository,
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) { }

  @Get('current/:companyId')
  async getCurrentSubscription(@Param('companyId') companyId: string) {
    const subscription = await this._subscriptionRepository.findByCompanyId(companyId);
    if (!subscription) return null;

    const plan = await this._subscriptionPlanRepository.findById(subscription.planId);
    return { ...subscription, plan };
  }

  @Post('create-order')
  async createOrder(@Body() body: { planId: string; companyId: string }) {
    const plan = await this._subscriptionPlanRepository.findById(body.planId);
    if (!plan) throw new BadRequestException('Plan not found');

    if (plan.price === 0) {
      // For Free plan, activate immediately
      return { isFree: true, planId: plan.id };
    }

    const order = await this.paymentService.createOrder(
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
      const isValid = this.paymentService.verifyPayment(body.orderId, body.paymentId, body.signature);
      if (!isValid) throw new BadRequestException('Invalid payment signature');
    }

    // Mark existing active subscriptions as CANCELLED
    const existingSubscription = await this._subscriptionRepository.findByCompanyId(body.companyId);
    if (existingSubscription) {
      const currentPlan = await this._subscriptionPlanRepository.findById(existingSubscription.planId);
      if (currentPlan && plan.price < currentPlan.price) {
        throw new BadRequestException('Degrading plan is not allowed');
      }

      const existingSubId = existingSubscription as unknown as { _id?: { toString(): string }; id?: string };
      if (existingSubId._id || existingSubId.id) {
        const idToUpdate = existingSubId.id || existingSubId._id?.toString() || '';
        await this._subscriptionRepository.updateById(idToUpdate, {
          status: 'CANCELLED',
        });
      }
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

    // Update Company Onboarding Step (if it was in a previous step)
    const company = await this._companyRepository.findById(body.companyId);
    if (company && company.onboardingStep !== OnboardingStep.CONFIRMATION) {
      await this._companyRepository.updateById(body.companyId, {
        onboardingStep: OnboardingStep.CONFIRMATION,
      });
    }

    return { success: true, message: 'Subscription activated successfully' };
  }
}
