interface Props {
  title: string;
  body?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ title, body, action }: Props) {
  return (
    <div className="surface flex flex-col items-center rounded-2xl px-6 py-16 text-center">
      <div className="font-display text-5xl text-[var(--color-amber-soft)]/60" aria-hidden="true">
        ⌬
      </div>
      <h3 className="font-display mt-5 text-2xl">{title}</h3>
      {body ? (
        <p className="mt-3 max-w-sm text-sm text-[var(--color-ink-soft)]">{body}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
