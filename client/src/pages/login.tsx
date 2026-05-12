import { useAuth } from "@/context/auth";
import { BACKEND_URL } from "@/lib/api";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/support", { replace: true });
    }
  }, [loading, user, navigate]);

  function onLogin() {
    window.location.href = `${BACKEND_URL}/auth/login`;
  }

  if (loading)
    return (
      <div className="flex min-h-[80vh] items-center justify-center text-sm text-neutral-400">
        Checking session...
      </div>
    );

  if (user) return null;

  return (
    <div className="relative min-h-[calc(100vh-57px)] bg-white px-6 md:px-12 lg:px-20">
      <div className="mx-auto max-w-[1200px] pt-10 md:pt-16">
        {/* Subtle label */}
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
          AI Support Desk · 2025
        </p>

        {/* Hero Typography */}
        <div className="mt-8 md:mt-10">
          <h1 className="font-serif-display text-[clamp(3.5rem,10vw,8rem)] font-normal leading-[0.9] tracking-tight text-neutral-900">
            Triage.
          </h1>
          <h2 className="font-serif-display text-[clamp(3.5rem,10vw,8rem)] font-normal italic leading-[0.95] tracking-tight text-neutral-800">
            Reply.
          </h2>
        </div>

        {/* Description + Button — positioned with comfortable spacing, not pinned to bottom */}
        <div className="mt-12 flex flex-col items-start justify-between gap-8 md:mt-16 md:flex-row md:items-end">
          {/* Description */}
          <p className="max-w-md text-[15px] leading-relaxed text-neutral-500">
            Paste a customer ticket. Get a polished, sourced reply drafted by
            AI&nbsp;— backed by OpenAI or Gemini, augmented with live
            documentation search.
          </p>

          {/* Sign In Button */}
          <button
            data-testid="login-btn"
            onClick={onLogin}
            className="group flex shrink-0 cursor-pointer items-center gap-2 bg-neutral-900 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-neutral-800 hover:gap-3"
          >
            Sign In
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
