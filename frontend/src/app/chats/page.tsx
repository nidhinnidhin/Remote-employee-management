import { requireRole } from "@/lib/auth/unified-auth";
import { ChatLayout } from "@/components/employees/chats/ChatLayout";
import ChatPageClient from "@/components/employees/chats/ChatPageClient";

export const metadata = {
  title: "Chats | Nexus Portal",
  description: "Communicate with your teammates in real-time.",
};

export default async function ChatsPage() {
  await requireRole("EMPLOYEE");

  return (
    <ChatLayout>
      <ChatPageClient />
    </ChatLayout>
  );
}
