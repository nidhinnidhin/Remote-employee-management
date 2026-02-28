import { toast } from "@/hooks/use-toast";

interface ActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

export function showActionToast(result: ActionResult) {
  if (!result) return;

  if (result.success) {
    toast({
      title: "Success",
      description: result.message || "Successful",
    });
  } else {
    toast({
      title: "Error",
      description: result.error || "Something went wrong",
      variant: "destructive",
    });
  }
}
