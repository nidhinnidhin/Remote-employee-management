import SuperAdminLayout from "@/components/super-admin/layout/SuperAdminLayout";
import { SubscriptionPlans } from "@/components/super-admin/subscriptions/SubscriptionPlans";
import { requireSuperAdminAuth } from "@/lib/auth/super-admin-auth";

export default async function SubscriptionsPage() {
  await requireSuperAdminAuth();

  return (
    <SuperAdminLayout>
      <SubscriptionPlans />
    </SuperAdminLayout>
  );
}
