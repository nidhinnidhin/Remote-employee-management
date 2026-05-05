"use server";

import { revalidatePath } from "next/cache";
import { 
  fetchSubscriptionPlans,
  createSubscriptionPlan, 
  updateSubscriptionPlan, 
  deleteSubscriptionPlan 
} from "@/services/super-admin/subscription/subscription.service";
import { 
  CreateSubscriptionPlanDto, 
  UpdateSubscriptionPlanDto 
} from "@/shared/types/superadmin/subscription/subscription.type";

export async function getSubscriptionPlansAction() {
  try {
    const data = await fetchSubscriptionPlans();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch subscription plans" };
  }
}

export async function createSubscriptionPlanAction(data: CreateSubscriptionPlanDto) {
  try {
    const result = await createSubscriptionPlan(data);
    revalidatePath("/super-admin/subscriptions");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create subscription plan" };
  }
}

export async function updateSubscriptionPlanAction(id: string, data: UpdateSubscriptionPlanDto) {
  try {
    const result = await updateSubscriptionPlan(id, data);
    revalidatePath("/super-admin/subscriptions");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update subscription plan" };
  }
}

export async function deleteSubscriptionPlanAction(id: string) {
  try {
    await deleteSubscriptionPlan(id);
    revalidatePath("/super-admin/subscriptions");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete subscription plan" };
  }
}
