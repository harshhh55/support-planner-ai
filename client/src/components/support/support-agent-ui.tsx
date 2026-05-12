import { useCallback, useRef, useState } from "react";
import type { Provider, ResultState } from "@/lib/support.types";

/* ── Constants ─────────────────────────────────────────────── */

const DRAFT_STORAGE_KEY = "support-desk-draft";
const FEEDBACK_DURATION_MS = 2000;
const OUTLOOK_COMPOSE_URL = "https://outlook.office.com/mail/deeplink/compose";

/* ── Helpers ───────────────────────────────────────────────── */

/** Extract a reasonable subject line from a reply (first non-empty line, capped). */
function extractSubject(reply: string): string {
  const firstLine = reply
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.length > 0);

  if (!firstLine) return "AI Drafted Support Reply";

  // Strip common salutation prefixes so the subject is more useful
  const cleaned = firstLine
    .replace(/^(hi|hello|hey|dear)\b[^,]*,?\s*/i, "")
    .trim();

  if (!cleaned) return "AI Drafted Support Reply";

  return cleaned.length > 80 ? cleaned.slice(0, 77) + "…" : cleaned;
}

/* ── Types ─────────────────────────────────────────────────── */

type Props = {
  provider: Provider;
  onProviderChange: (p: Provider) => void;

  ticket: string;
  onTicketChange: (val: string) => void;

  loading: boolean;

  result: ResultState | null;

  onAgentRun: () => void;
};

type FeedbackState = {
  key: string;
  message: string;
} | null;

/* ── Component ─────────────────────────────────────────────── */

function SupportAgentUi(props: Props) {
  const {
    result,
    provider,
    loading,
    onProviderChange,
    ticket,
    onTicketChange,
    onAgentRun,
  } = props;

  /* Transient feedback for action buttons */
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showFeedback = useCallback((key: string, message: string) => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setFeedback({ key, message });
    feedbackTimer.current = setTimeout(() => {
      setFeedback(null);
      feedbackTimer.current = null;
    }, FEEDBACK_DURATION_MS);
  }, []);

  /* ── Action Handlers ─────────────────────────────────────── */

  const handleCopy = useCallback(async () => {
    if (!result?.reply) return;
    try {
      await navigator.clipboard.writeText(result.reply);
      showFeedback("copy", "Copied");
    } catch {
      showFeedback("copy", "Copy failed");
    }
  }, [result, showFeedback]);

  const handleMailto = useCallback(() => {
    if (!result?.reply) return;
    const subject = encodeURIComponent(extractSubject(result.reply));
    const body = encodeURIComponent(result.reply);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
    showFeedback("mailto", "Opening mail client…");
  }, [result, showFeedback]);

  const handleOutlook = useCallback(() => {
    if (!result?.reply) return;
    const subject = encodeURIComponent(extractSubject(result.reply));
    const body = encodeURIComponent(result.reply);
    window.open(
      `${OUTLOOK_COMPOSE_URL}?subject=${subject}&body=${body}`,
      "_blank",
      "noopener"
    );
    showFeedback("outlook", "Opening Outlook…");
  }, [result, showFeedback]);

  const handleSaveDraft = useCallback(() => {
    if (!result?.reply) return;
    try {
      const draft = {
        reply: result.reply,
        sources: result.sources,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      showFeedback("draft", "Draft saved");
    } catch {
      showFeedback("draft", "Save failed");
    }
  }, [result, showFeedback]);

  /* ── Action button definitions ───────────────────────────── */

  const actions = [
    { key: "copy", label: "Copy Reply", handler: handleCopy },
    { key: "mailto", label: "Send via Email", handler: handleMailto },
    { key: "outlook", label: "Open in Outlook", handler: handleOutlook },
    { key: "draft", label: "Save as Draft", handler: handleSaveDraft },
  ] as const;

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10 md:px-12 lg:px-20">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
          Live Agent Console
        </p>
        <h1 className="font-serif-display mt-3 text-4xl font-normal tracking-tight text-neutral-900 md:text-5xl">
          Support Desk
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Provide the ticket below — the agent will draft a reply and surface
          relevant sources.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-5">
        {/* ── Left: Input Panel ── */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Provider */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500">
                Model Provider
              </label>
              <select
                value={provider}
                onChange={(event) =>
                  onProviderChange(event.target.value as Provider)
                }
                disabled={loading}
                className="h-11 w-full border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-400"
              >
                <option value={"openai"}>OpenAI</option>
                <option value={"gemini"}>Gemini</option>
              </select>
            </div>

            {/* Ticket */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500">
                Customer Ticket / Email
              </label>
              <textarea
                value={ticket}
                disabled={loading}
                onChange={(e) => onTicketChange(e.target.value)}
                placeholder="Paste the customer ticket here..."
                className="min-h-[200px] w-full resize-y border border-neutral-200 bg-white px-4 py-3 text-sm leading-relaxed text-neutral-900 placeholder:text-neutral-300 outline-none transition-colors focus:border-neutral-400"
              />
            </div>

            {/* Run button */}
            <button
              onClick={onAgentRun}
              disabled={loading}
              className="group flex w-full cursor-pointer items-center justify-center gap-2 bg-neutral-900 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Running Agent…
                </>
              ) : (
                <>
                  Run Agent
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                    →
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Right: Results Panel ── */}
        <div className="lg:col-span-3">
          <div className="border border-neutral-200 bg-neutral-50/50 p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-400">
              Agent Output
            </p>

            {!result ? (
              <div className="mt-8 flex flex-col items-center justify-center py-12 text-center">
                <div className="font-serif-display text-5xl text-neutral-200">
                  ✦
                </div>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-400">
                  Nothing yet. Run the agent to generate a polished, sourced
                  reply.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-8">
                {/* Sources */}
                {result.sources.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500">
                      Sources
                      <span className="ml-2 inline-flex h-5 w-5 items-center justify-center bg-neutral-900 text-[10px] font-bold text-white">
                        {result.sources.length}
                      </span>
                    </h3>
                    <ul className="mt-3 space-y-1.5">
                      {result.sources.map((source, i) => (
                        <li key={i} className="break-all text-sm">
                          <a
                            href={source}
                            target="_blank"
                            rel="noreferrer"
                            className="text-neutral-600 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-neutral-900 hover:decoration-neutral-900"
                          >
                            {source}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Reply */}
                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500">
                    Drafted Reply
                  </h3>
                  <div className="mt-3 border-l-2 border-neutral-300 pl-5 text-sm leading-relaxed text-neutral-800">
                    <div className="whitespace-pre-wrap">{result.reply}</div>
                  </div>
                </div>

                {/* ── Action Bar ── */}
                <div
                  className="border-t border-neutral-200 pt-5"
                  role="toolbar"
                  aria-label="Reply actions"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {actions.map(({ key, label, handler }) => {
                      const isActive = feedback?.key === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={handler}
                          aria-label={label}
                          className="relative cursor-pointer border border-neutral-200 bg-white px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-500 transition-all duration-200 hover:border-neutral-400 hover:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 active:scale-[0.98]"
                        >
                          {isActive ? feedback.message : label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportAgentUi;
