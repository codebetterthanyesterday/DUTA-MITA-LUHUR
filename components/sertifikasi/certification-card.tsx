"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Certification } from "@prisma/client";
import { CertificationModal } from "./certification-modal";
import { deleteCertification, toggleCertificationActive } from "@/app/(public)/sertifikasi/actions";
import { Trash2, Edit2, Eye, EyeOff } from "lucide-react";

type CertificationCardProps = {
  cert: Certification;
  isAdmin?: boolean;
};

export function CertificationCard({ cert, isAdmin = false }: CertificationCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus sertifikasi ini?")) {
      startTransition(async () => {
        try {
          await deleteCertification(cert.id);
        } catch (err) {
          alert("Gagal menghapus sertifikasi.");
          console.error(err);
        }
      });
    }
  };

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await toggleCertificationActive(cert.id, !cert.isActive);
      } catch (err) {
        alert("Gagal memperbarui status sertifikasi.");
        console.error(err);
      }
    });
  };

  const modalData = {
    id: cert.id,
    name: cert.name,
    issuingBody: cert.issuingBody,
    validUntil: cert.validUntil ? cert.validUntil.toISOString() : null,
    description: cert.description,
    logoUrl: cert.logoUrl,
    certificateUrl: cert.certificateUrl,
    isActive: cert.isActive,
  };

  return (
    <>
      <div
        className={`relative group bg-white rounded-radius-md shadow-card border-l-4 ${cert.isActive ? 'border-red-signal' : 'border-slate/30 opacity-70'} flex flex-col p-space-4 md:p-space-5 overflow-hidden transition-all`}
      >
        {isAdmin && (
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isPending}
              className="p-2 bg-ivory text-navy-deep rounded shadow hover:bg-slate/10 transition-colors"
              title="Edit Sertifikasi"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggle}
              disabled={isPending}
              className="p-2 bg-ivory text-navy-deep rounded shadow hover:bg-slate/10 transition-colors"
              title={cert.isActive ? "Sembunyikan" : "Tampilkan"}
            >
              {cert.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="p-2 bg-red-signal text-white rounded shadow hover:bg-red-signal/80 transition-colors"
              title="Hapus"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Logo Area */}
        <div className="h-12 w-32 mb-space-4 relative shrink-0">
          {cert.logoUrl ? (
            <Image
              src={cert.logoUrl}
              alt={`${cert.issuingBody} logo`}
              fill
              sizes="128px"
              className="object-contain object-left transition-opacity duration-300 opacity-0 animate-[fadeIn_300ms_ease-in-out_forwards]"
            />
          ) : (
            <div className="w-full h-full bg-slate/10 rounded-sm flex items-center px-2">
              <span className="text-caption text-slate/50 font-mono text-[10px]">NO LOGO</span>
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 flex flex-col">
          <h2 className="font-display font-medium text-display-md text-navy-deep leading-tight mb-space-1">
            {cert.name}
          </h2>
          <span className="font-mono text-caption text-slate uppercase mb-space-3 block">
            {cert.issuingBody}
          </span>
          <p
            className="text-body-sm text-slate mb-space-4"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {cert.description}
          </p>
        </div>

        {/* Footer Meta & Button */}
        <div className="mt-auto pt-space-4 border-t border-slate/10 flex flex-col items-start gap-space-3">
          {cert.validUntil && (
            <span className="text-body-sm text-slate">
              Berlaku hingga:{" "}
              {new Date(cert.validUntil).toLocaleDateString("id-ID", {
                month: "long",
                year: "numeric",
              })}
            </span>
          )}
          {cert.certificateUrl && (
            <a
              href={cert.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex border border-navy-deep/30 text-navy-deep text-body-sm font-medium rounded-radius-sm px-space-3 py-1.5 hover:bg-navy-base/5 transition-colors"
            >
              Lihat Sertifikat &rarr;
            </a>
          )}
        </div>
      </div>

      {isAdmin && (
        <CertificationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={modalData}
        />
      )}
    </>
  );
}
