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

export async function getSubscriptionPlansAction(activeOnly = false) {
  try {
    const data = await fetchSubscriptionPlans(activeOnly);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    console.error("Error fetching subscription plans:", err);
    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch subscription plans",
    };
  }
}

export async function createSubscriptionPlanAction(data: CreateSubscriptionPlanDto) {
  try {
    const result = await createSubscriptionPlan(data);
    revalidatePath("/super-admin/subscriptions");
    return { success: true, data: result };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    console.error("Error creating subscription plan:", err);
    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.message ||
        "Failed to create subscription plan",
    };
  }
}

export async function updateSubscriptionPlanAction(id: string, data: UpdateSubscriptionPlanDto) {
  try {
    const result = await updateSubscriptionPlan(id, data);
    revalidatePath("/super-admin/subscriptions");
    return { success: true, data: result };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    console.error("Error updating subscription plan:", err);
    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.message ||
        "Failed to update subscription plan",
    };
  }
}

export async function deleteSubscriptionPlanAction(id: string) {
  try {
    await deleteSubscriptionPlan(id);
    revalidatePath("/super-admin/subscriptions");
    return { success: true };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    console.error("Error deleting subscription plan:", err);
    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.message ||
        "Failed to delete subscription plan",
    };
  }
}
