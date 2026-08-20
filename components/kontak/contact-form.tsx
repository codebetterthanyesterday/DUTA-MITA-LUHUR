"use client";

import { useActionState } from "react";
import { submitContactMessage, ContactActionState } from "@/app/(public)/kontak/actions";
import React from "react";

const initialState: ContactActionState = {};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactMessage, initialState);

  // Success State Transition
  if (state.success) {
    return (
      <div className="bg-white rounded-radius-md shadow-card p-space-6 md:p-space-8 flex flex-col items-center justify-center text-center h-full min-h-[400px] animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-navy-base/5 text-red-signal rounded-full flex items-center justify-center mb-space-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display font-medium text-display-md text-navy-deep mb-space-2">
          Pesan Terkirim
        </h3>
        <p className="font-body text-slate text-body-md max-w-sm mb-space-6">
          Terima kasih telah menghubungi kami. Tim kami akan segera menindaklanjuti pesan Anda.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-navy-deep hover:bg-navy-base text-ivory px-space-4 py-space-2 rounded-radius-sm font-body font-medium transition-colors"
        >
          Kirim Pesan Lain
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-radius-md shadow-card p-space-6 md:p-space-8 h-full">
      <div className="mb-space-6">
        <h2 className="font-display font-medium text-display-md text-navy-deep mb-space-2">
          Kirim Pesan
        </h2>
        <p className="font-body text-body-sm text-slate">
          Isi form di bawah ini dan perwakilan kami akan segera menghubungi Anda.
        </p>
      </div>

      <form action={formAction} className="space-y-space-4">
        {state.error && (
          <div className="p-space-3 bg-red-signal/10 border border-red-signal/20 text-red-signal text-body-sm rounded-radius-sm">
            {state.error}
          </div>
        )}

        {/* Honeypot field - visually hidden accessibly */}
        <div
          className="absolute left-[-9999px] top-[-9999px]"
          aria-hidden="true"
        >
          <label htmlFor="companyWebsite">Website Perusahaan</label>
          <input
            type="text"
            id="companyWebsite"
            name="companyWebsite"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor="name" className="block font-body font-medium text-navy-deep text-body-sm mb-1">
            Nama Lengkap <span className="text-red-signal">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={"" /* In standard usage the browser preserves values natively on re-render unless controlled */}
            disabled={isPending}
            className="w-full bg-ivory/50 border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body transition-colors disabled:opacity-50 outline-none"
          />
          {state.fieldErrors?.name && (
            <p className="text-red-signal text-body-sm mt-1">{state.fieldErrors.name[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block font-body font-medium text-navy-deep text-body-sm mb-1">
            Email <span className="text-red-signal">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            disabled={isPending}
            className="w-full bg-ivory/50 border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body transition-colors disabled:opacity-50 outline-none"
          />
          {state.fieldErrors?.email && (
            <p className="text-red-signal text-body-sm mt-1">{state.fieldErrors.email[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="subject" className="block font-body font-medium text-navy-deep text-body-sm mb-1">
            Subjek (opsional)
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            disabled={isPending}
            className="w-full bg-ivory/50 border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body transition-colors disabled:opacity-50 outline-none"
          />
        </div>

        <div>
          <label htmlFor="message" className="block font-body font-medium text-navy-deep text-body-sm mb-1">
            Pesan <span className="text-red-signal">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            disabled={isPending}
            className="w-full bg-ivory/50 border border-slate/30 focus:border-red-signal focus:ring-1 focus:ring-red-signal rounded-radius-sm px-space-3 py-2 text-navy-deep font-body transition-colors disabled:opacity-50 outline-none resize-y"
          ></textarea>
          {state.fieldErrors?.message && (
            <p className="text-red-signal text-body-sm mt-1">{state.fieldErrors.message[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center bg-red-signal hover:bg-red-signal/90 disabled:bg-red-signal/60 disabled:cursor-not-allowed text-ivory font-body font-medium rounded-radius-sm py-3 transition-colors mt-space-2"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-ivory" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Mengirim...
            </span>
          ) : (
            "Kirim Pesan"
          )}
        </button>
      </form>
    </div>
  );
}
