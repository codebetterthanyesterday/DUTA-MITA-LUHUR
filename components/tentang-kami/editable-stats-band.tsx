"use client";

import { useState } from "react";
import { CompanyProfile } from "@/lib/content/company-profile";
import { StatsBand } from "@/components/shared/stats-band";
import { SectionEditButton } from "@/components/admin/section-edit-button";
import { FacilityStatsModal } from "@/components/tentang-kami/modals/facility-stats-modal";

type EditableStatsBandProps = {
  stats: CompanyProfile["facilityStats"];
  className?: string;
  isAdmin?: boolean;
};

export function EditableStatsBand({ stats, className, isAdmin = false }: EditableStatsBandProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isAdmin) {
    return <StatsBand stats={stats} className={className} />;
  }

  return (
    <div className="relative group">
      <SectionEditButton 
        onClick={() => setIsModalOpen(true)} 
        label="Edit Statistik" 
        className="opacity-0 group-hover:opacity-100 focus:opacity-100" 
      />
      <StatsBand stats={stats} className={className} />
      <FacilityStatsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={stats}
      />
    </div>
  );
}
