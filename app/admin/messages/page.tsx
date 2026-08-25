import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getAdminSlug } from "@/lib/admin-routes";
import { MessageList } from "./message-list";

export default async function AdminMessagesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect(`/${getAdminSlug()}/login`);
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: [{ isRead: "asc" }, { createdAt: "desc" }],
  });

  const unreadCount = messages.filter((message) => !message.isRead).length;

  return (
    <div className="p-space-4 md:p-space-8 max-w-5xl mx-auto">
      <header className="border-b border-border-hairline pb-space-4 mb-space-6">
        <h1 className="font-display font-medium text-display-lg text-navy-deep">
          Pesan Kontak
        </h1>
        <p className="font-body text-body-sm text-slate mt-1">
          {unreadCount > 0
            ? `${unreadCount} pesan belum dibaca dari total ${messages.length}.`
            : `${messages.length} pesan, semuanya sudah dibaca.`}
        </p>
      </header>

      <MessageList messages={messages} />
    </div>
  );
}
