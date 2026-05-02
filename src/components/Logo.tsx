import { PPMark } from "./editorial";

interface Props {
  className?: string;
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
}

export default function Logo({
  className = "",
  size = "sm",
  showSubtitle = false,
}: Props) {
  const dim = size === "lg" ? 32 : size === "md" ? 28 : 24;
  const titleSize = size === "lg" ? 26 : size === "md" ? 22 : 18;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <PPMark size={dim} />
      <div className="flex flex-col items-start leading-none">
        <span
          className="font-display ink"
          style={{
            fontSize: titleSize,
            fontWeight: 400,
            letterSpacing: "-0.01em",
          }}
        >
          Pillar{" "}
          <em
            className="ink-brass-l"
            style={{ fontStyle: "italic", fontWeight: 300 }}
          >
            &amp;
          </em>{" "}
          Pearl
        </span>
        {showSubtitle ? (
          <span
            className="font-mono ink-faint"
            style={{
              fontSize: 8,
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              marginTop: 4,
            }}
          >
            The Quartz Index
          </span>
        ) : null}
      </div>
    </div>
  );
}
