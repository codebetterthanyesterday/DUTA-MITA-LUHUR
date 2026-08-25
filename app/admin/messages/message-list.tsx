"use client";

import { useState, useTransition } from "react";
import { Mail, MailOpen, Trash2, ChevronDown } from "lucide-react";
import { deleteMessage, markAllMessagesRead, setMessageRead } from "./actions";

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function MessageList({ messages }: { messages: Message[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const unreadCount = messages.filter((message) => !message.isRead).length;

  const toggleOpen = (message: Message) => {
    const nextId = openId === message.id ? null : message.id;
    setOpenId(nextId);
    // Opening an unread message marks it read, the way an inbox behaves.
    if (nextId && !message.isRead) {
      startTransition(() => {
        setMessageRead(message.id, true);
      });
    }
  };

  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-radius-md shadow-card border border-border-hairline p-space-8 text-center">
        <Mail className="w-10 h-10 text-slate/40 mx-auto mb-space-3" aria-hidden="true" />
        <h2 className="font-display font-medium text-display-md text-navy-deep mb-space-1">
          Belum ada pesan
        </h2>
        <p className="font-body text-body-sm text-slate max-w-md mx-auto">
          Pesan yang dikirim melalui formulir di halaman Kontak akan muncul di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-space-3">
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => { markAllMessagesRead(); })}
            className="font-body text-body-sm text-slate hover:text-red-signal transition-colors disabled:opacity-50 min-h-[44px] px-space-2"
          >
            Tandai semua sudah dibaca
          </button>
        </div>
      )}

      <ul className="bg-white rounded-radius-md shadow-card border border-border-hairline divide-y divide-border-hairline overflow-hidden">
        {messages.map((message) => {
          const isOpen = openId === message.id;
          return (
            <li key={message.id} className={message.isRead ? "" : "bg-ivory/50"}>
              <div className="flex items-start gap-space-3 p-space-4">
                <span className="mt-1 shrink-0" aria-hidden="true">
                  {message.isRead ? (
                    <MailOpen className="w-5 h-5 text-slate/60" />
                  ) : (
                    <Mail className="w-5 h-5 text-red-signal" />
                  )}
                </span>

                <button
                  type="button"
                  onClick={() => toggleOpen(message)}
                  aria-expanded={isOpen}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="flex items-baseline gap-space-2 flex-wrap">
                    <span
                      className={`font-body text-body-md text-navy-deep ${
                        message.isRead ? "" : "font-semibold"
                      }`}
                    >
                      {message.name}
                    </span>
                    {!message.isRead && (
                      <span className="font-mono text-caption uppercase tracking-wider text-red-signal">
                        Baru
                      </span>
                    )}
                  </span>
                  <span className="block font-body text-body-sm text-navy-deep mt-0.5 truncate">
                    {message.subject || "Tanpa subjek"}
                  </span>
                  {!isOpen && (
                    <span className="block font-body text-body-sm text-slate mt-0.5 truncate">
                      {message.message}
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-space-1 shrink-0">
                  <time
                    dateTime={message.createdAt.toISOString()}
                    className="font-body text-caption text-slate hidden sm:block"
                  >
                    {formatDate(message.createdAt)}
                  </time>
                  <ChevronDown
                    className={`w-4 h-4 text-slate transition-transform ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {isOpen && (
                <div className="px-space-4 pb-space-4 pl-[calc(1.25rem+var(--space-3,24px))]">
                  <p className="font-body text-body-md text-navy-deep whitespace-pre-wrap border-l-2 border-border-hairline pl-space-3">
                    {message.message}
                  </p>
                  <div className="flex flex-wrap items-center gap-space-3 mt-space-4">
                    <a
                      href={`mailto:${message.email}?subject=${encodeURIComponent(
                        `Re: ${message.subject || "Pesan Anda"}`
                      )}`}
                      className="inline-flex items-center gap-space-2 bg-red-signal hover:bg-red-signal/90 text-ivory px-space-3 py-space-1 rounded-radius-sm font-body font-medium text-body-sm transition-colors min-h-[44px]"
                    >
                      Balas via Email
                    </a>
                    <span className="font-body text-body-sm text-slate">{message.email}</span>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(() => {
                          setMessageRead(message.id, !message.isRead);
                        })
                      }
                      className="font-body text-body-sm text-slate hover:text-navy-deep transition-colors disabled:opacity-50 min-h-[44px] px-space-2"
                    >
                      {message.isRead ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => {
                        if (!confirm("Hapus pesan ini secara permanen?")) return;
                        startTransition(() => {
                          deleteMessage(message.id);
                        });
                      }}
                      className="inline-flex items-center gap-1 font-body text-body-sm text-slate hover:text-red-signal transition-colors disabled:opacity-50 min-h-[44px] px-space-2 ml-auto"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                      Hapus
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
