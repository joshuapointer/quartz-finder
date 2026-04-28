interface Props {
  title: string;
  body?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ title, body, action }: Props) {
  return (
    <div className="border-y border-[var(--color-line)] py-24 text-center">
      {/* 1px-stroke SVG diamond — replaces ⌬ glyph */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        aria-hidden="true"
        className="mx-auto ink-faint"
      >
        <path
          d="M20 4 36 20 20 36 4 20 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
      <h3 className="font-display text-3xl ink mt-6">{title}</h3>
      {body ? (
        <p className="prose-measure mx-auto text-sm ink-soft mt-4">{body}</p>
      ) : null}
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  );
}
