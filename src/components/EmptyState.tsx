import { QuartzOrb } from "./editorial";

interface Props {
  title: string;
  body?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ title, body, action }: Props) {
  return (
    <div
      style={{
        padding: "96px 24px",
        textAlign: "center",
        borderTop: "1px solid var(--color-hairline)",
        borderBottom: "1px solid var(--color-hairline)",
      }}
    >
      <div style={{ display: "inline-flex", opacity: 0.7 }} aria-hidden>
        <QuartzOrb size={96} intensity={0.6} />
      </div>
      <h3
        className="font-display ink"
        style={{
          fontSize: 36,
          fontStyle: "italic",
          fontWeight: 300,
          letterSpacing: "-0.02em",
          marginTop: 28,
        }}
      >
        {title}
      </h3>
      {body ? (
        <p
          className="ink-soft"
          style={{
            fontSize: 14,
            lineHeight: 1.65,
            maxWidth: 440,
            margin: "16px auto 0",
          }}
        >
          {body}
        </p>
      ) : null}
      {action ? <div style={{ marginTop: 32 }}>{action}</div> : null}
    </div>
  );
}
