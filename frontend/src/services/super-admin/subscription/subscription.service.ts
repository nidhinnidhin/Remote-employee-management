import { getServerApi } from "@/lib/axios/axiosServer";
import { 
  SubscriptionPlan, 
  CreateSubscriptionPlanDto, 
  UpdateSubscriptionPlanDto 
} from "@/shared/types/superadmin/subscription/subscription.type";
import { API_ROUTES } from "@/constants/api.routes";

export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const api = await getServerApi();
  const res = await api.get(API_ROUTES.SUPER_ADMIN.SUBSCRIPTIONS.BASE);
  return res.data;
}

export async function createSubscriptionPlan(data: CreateSubscriptionPlanDto): Promise<SubscriptionPlan> {
  const api = await getServerApi();
  const res = await api.post(API_ROUTES.SUPER_ADMIN.SUBSCRIPTIONS.BASE, data);
  return res.data;
}

export async function updateSubscriptionPlan(id: string, data: UpdateSubscriptionPlanDto): Promise<SubscriptionPlan> {
  const api = await getServerApi();
  const res = await api.patch(API_ROUTES.SUPER_ADMIN.SUBSCRIPTIONS.BY_ID(id), data);
  return res.data;
}

export async function deleteSubscriptionPlan(id: string): Promise<void> {
  const api = await getServerApi();
  await api.delete(API_ROUTES.SUPER_ADMIN.SUBSCRIPTIONS.BY_ID(id));
}
