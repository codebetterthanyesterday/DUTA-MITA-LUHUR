"use client";

import { useState } from "react";
import { Edit3 } from "lucide-react";
import { HeaderModal } from "./header-modal";
import { useEditMode } from "@/components/admin/edit-mode";

interface HeaderProps {
  header: {
    title: string;
    subtitle: string;
  };
}

export function Header({ header }: HeaderProps) {
  const { enabled: isAdmin } = useEditMode();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative bg-navy-deep text-ivory py-space-8 px-space-4 md:px-space-6 border-b border-slate/20 group">
      {isAdmin && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all flex items-center gap-2"
          title="Edit Header"
        >
          <Edit3 size={18} />
          <span className="text-body-sm font-medium pr-1">Edit Header</span>
        </button>
      )}

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <span className="font-mono text-caption text-gold-hairline uppercase tracking-wider mb-space-3">
          TENTANG KAMI
        </span>
        <h1 className="font-display font-medium text-display-lg text-ivory max-w-4xl leading-tight">
          {header.title}
        </h1>
        <p className="font-body text-body-lg text-ivory/80 max-w-2xl mt-space-3 whitespace-pre-wrap">
          {header.subtitle}
        </p>
      </div>

      {isAdmin && (
        <HeaderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={{
            title: header.title,
            subtitle: header.subtitle,
          }}
        />
      )}
    </section>
  );
}
