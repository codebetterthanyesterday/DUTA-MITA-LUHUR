"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, ShieldAlert, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Email atau password salah.");
        setIsLoading(false);
      } else {
        const currentPath = window.location.pathname;
        const dashboardPath = currentPath.replace(/\/login$/, "");
        router.push(dashboardPath);
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-deep px-space-4 py-space-8 relative overflow-hidden">
      {/* Ambient brand accents — decorative, no data */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-red-signal/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gold-hairline/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md animate-admin-pop">
        <div className="bg-ivory rounded-radius-lg shadow-card-hover border border-white/10 p-space-6 sm:p-space-8">
          <div className="text-center mb-space-8">
            <div className="w-14 h-14 rounded-full bg-navy-deep flex items-center justify-center mx-auto mb-space-4">
              <span className="font-display font-medium text-display-sm text-ivory">DML</span>
            </div>
            <h1 className="font-display font-medium text-display-md text-navy-deep">
              Admin Portal
            </h1>
            <p className="font-body text-body-sm text-slate mt-1">
              PT Duta Mitra Luhur
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-space-2 bg-red-signal/10 text-red-signal border border-red-signal/20 text-body-sm p-space-3 rounded-radius-md mb-space-5"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-space-4">
            <div>
              <label
                htmlFor="email"
                className="block font-body text-body-sm font-medium text-navy-deep mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate/50 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-space-3 py-space-2 min-h-[48px] rounded-radius-md border border-border-hairline bg-white text-navy-deep focus:outline-none focus:ring-2 focus:ring-navy-deep/15 focus:border-navy-deep transition-all"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-body text-body-sm font-medium text-navy-deep mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate/50 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-space-2 min-h-[48px] rounded-radius-md border border-border-hairline bg-white text-navy-deep focus:outline-none focus:ring-2 focus:ring-navy-deep/15 focus:border-navy-deep transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-slate/50 hover:text-navy-deep rounded-full hover:bg-navy-deep/5 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-navy-deep hover:bg-navy-deep/90 text-ivory py-space-3 min-h-[48px] rounded-radius-md font-body font-medium transition-all active:scale-[0.98] duration-150 disabled:opacity-60 disabled:pointer-events-none mt-space-2 shadow-sm"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
              {isLoading ? "Memverifikasi..." : "Masuk"}
            </button>
          </form>
        </div>

        <p className="text-center text-ivory/40 text-caption mt-space-6">
          Akses terbatas untuk personel yang berwenang.
        </p>
      </div>
    </div>
  );
}
