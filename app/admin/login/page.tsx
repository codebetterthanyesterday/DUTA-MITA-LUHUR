"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        // Derive dashboard URL relatively: remove "/login" from the current secret path
        const currentPath = window.location.pathname;
        const dashboardPath = currentPath.replace(/\/login$/, "");
        router.push(dashboardPath);
        router.refresh(); // Ensure the dashboard receives fresh auth state
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-deep px-space-4">
      <div className="bg-ivory w-full max-w-md p-space-6 sm:p-space-8 rounded-radius-md shadow-card-hover border border-slate/10">
        <div className="text-center mb-space-6">
          <h1 className="font-display font-medium text-display-md text-navy-deep">
            Admin Login
          </h1>
          <p className="font-body text-body-sm text-slate mt-space-1">
            PT Duta Mitra Luhur Management
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-signal border border-red-200 text-body-sm p-space-3 rounded-radius-sm mb-space-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-space-4">
          <div>
            <label
              htmlFor="email"
              className="block font-body text-body-sm font-medium text-navy-deep mb-space-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-space-3 py-space-2 rounded-radius-sm border border-border-hairline bg-white text-navy-deep focus:outline-none focus:ring-1 focus:ring-navy-deep focus:border-navy-deep transition-colors"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-body text-body-sm font-medium text-navy-deep mb-space-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-space-3 py-space-2 rounded-radius-sm border border-border-hairline bg-white text-navy-deep focus:outline-none focus:ring-1 focus:ring-navy-deep focus:border-navy-deep transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-navy-deep hover:bg-navy-deep/90 text-ivory py-space-2 rounded-radius-sm font-body font-medium transition-colors disabled:opacity-50 mt-space-2"
          >
            {isLoading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
