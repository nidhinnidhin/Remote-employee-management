import { useState, useEffect } from "react";
import { 
  SubscriptionPlan, 
  CreateSubscriptionPlanDto, 
  UpdateSubscriptionPlanDto 
} from "@/shared/types/superadmin/subscription/subscription.type";
import { 
  getSubscriptionPlansAction,
  createSubscriptionPlanAction, 
  updateSubscriptionPlanAction, 
  deleteSubscriptionPlanAction 
} from "@/actions/super-admin/subscription/subscription.actions";
import { toast } from "sonner";

export const useSubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPlans = async () => {
    try {
      setIsLoading(true);
      const result = await getSubscriptionPlansAction();
      if (result.success) {
        setPlans(result.data || []);
      } else {
        toast.error(result.error || "Failed to fetch subscription plans");
      }
    } catch (error) {
      toast.error("Failed to fetch subscription plans");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleCreatePlan = async (data: CreateSubscriptionPlanDto) => {
    try {
      setIsSubmitting(true);
      const result = await createSubscriptionPlanAction(data);
      if (result.success) {
        toast.success("Subscription plan created successfully");
        await loadPlans();
        return true;
      } else {
        toast.error(result.error || "Failed to create plan");
        return false;
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePlan = async (id: string, data: UpdateSubscriptionPlanDto) => {
    try {
      setIsSubmitting(true);
      const result = await updateSubscriptionPlanAction(id, data);
      if (result.success) {
        toast.success("Subscription plan updated successfully");
        await loadPlans();
        return true;
      } else {
        toast.error(result.error || "Failed to update plan");
        return false;
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    try {
      setIsSubmitting(true);
      const result = await deleteSubscriptionPlanAction(id);
      if (result.success) {
        toast.success("Subscription plan deleted successfully");
        await loadPlans();
        return true;
      } else {
        toast.error(result.error || "Failed to delete plan");
        return false;
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    plans,
    isLoading,
    isSubmitting,
    handleCreatePlan,
    handleUpdatePlan,
    handleDeletePlan,
    refreshPlans: loadPlans,
  };
};
