"use client";
import { useState, type CSSProperties, type FormEvent } from "react";

type Variant = "footer" | "hero";

interface Props {
  variant?: Variant;
}

type State = "idle" | "submitting" | "ok" | "error";

const BASE_BUTTON: CSSProperties = {
  background: "transparent",
  border: "none",
  color: "var(--color-brass-light)",
  fontFamily: "var(--font-display)",
  fontStyle: "italic",
  fontWeight: 400,
};

export default function SubscribeForm({ variant = "footer" }: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [msg, setMsg] = useState<string | null>(null);
  const submitting = state === "submitting";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setState("submitting");
    setMsg(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setState("ok");
        setMsg("Subscribed.");
        setEmail("");
      } else {
        setState("error");
        setMsg(typeof data?.error === "string" ? data.error : "Try again");
      }
    } catch {
      setState("error");
      setMsg("Network error");
    }
  }

  const statusColor =
    state === "ok" ? "var(--color-brass-light)" : "var(--color-smoke)";

  if (variant === "hero") {
    return (
      <>
        <form
          onSubmit={onSubmit}
          style={{
            display: "flex",
            gap: 6,
            maxWidth: 480,
            margin: "28px auto 0",
            borderBottom: "1px solid var(--color-brass-2)",
            paddingBottom: 8,
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.address@dispatch"
            aria-label="Email address"
            disabled={submitting}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              padding: "6px 0",
              color: "var(--color-pearl)",
              fontFamily: "var(--font-display)",
              fontSize: 20,
              outline: "none",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          />
          <button
            type="submit"
            aria-label="Subscribe"
            disabled={submitting}
            style={{
              ...BASE_BUTTON,
              fontSize: 24,
              padding: "0 6px",
              cursor: submitting ? "wait" : "pointer",
              opacity: submitting ? 0.6 : 1,
            }}
          >
            →
          </button>
        </form>
        {msg ? (
          <p
            role="status"
            aria-live="polite"
            className="font-mono"
            style={{
              marginTop: 12,
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: statusColor,
              textAlign: "center",
            }}
          >
            {msg}
          </p>
        ) : null}
      </>
    );
  }

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="mt-4 flex gap-2 md:justify-end"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Address"
          aria-label="Email address"
          disabled={submitting}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            borderBottom: "1px solid var(--color-brass-2)",
            padding: "8px 0",
            color: "var(--color-pearl)",
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            outline: "none",
          }}
        />
        <button
          type="submit"
          aria-label="Subscribe"
          disabled={submitting}
          style={{
            ...BASE_BUTTON,
            fontSize: 22,
            padding: "0 4px",
            cursor: submitting ? "wait" : "pointer",
            opacity: submitting ? 0.6 : 1,
          }}
        >
          →
        </button>
      </form>
      {msg ? (
        <p
          role="status"
          aria-live="polite"
          className="font-mono"
          style={{
            marginTop: 10,
            fontSize: 9,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: statusColor,
          }}
        >
          {msg}
        </p>
      ) : null}
    </>
  );
}
