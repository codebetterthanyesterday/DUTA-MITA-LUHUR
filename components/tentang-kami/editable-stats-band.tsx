"use client";

import { useState } from "react";
import { CompanyProfile } from "@/lib/content/company-profile";
import { StatsBand } from "@/components/shared/stats-band";
import { SectionEditButton } from "@/components/admin/section-edit-button";
import { FacilityStatsModal } from "@/components/tentang-kami/modals/facility-stats-modal";
import { useEditMode } from "@/components/admin/edit-mode";

type EditableStatsBandProps = {
  stats: CompanyProfile["facilityStats"];
  className?: string;
};

export function EditableStatsBand({ stats, className }: EditableStatsBandProps) {
  const { enabled: isAdmin } = useEditMode();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isAdmin) {
    return <StatsBand stats={stats} className={className} />;
  }

  return (
    <div className="relative group">
      <SectionEditButton 
        onClick={() => setIsModalOpen(true)} 
        label="Edit Statistik" 
        className="" 
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
