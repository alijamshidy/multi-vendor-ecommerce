import ChatPageContent from "@/components/pages/ChatPageContent";
import { Suspense } from "react";

function ChatPageFallback() {
  return (
    <div className="py-12 text-center text-sm text-muted-foreground">
      Loading chat...
    </div>
  );
}

export default function SellerChatPage() {
  return (
    <Suspense fallback={<ChatPageFallback />}>
      <ChatPageContent role="seller" />
    </Suspense>
  );
}
