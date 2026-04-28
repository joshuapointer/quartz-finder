import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import TierBadge from "@/components/TierBadge";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";

describe("TierBadge", () => {
  it("labels US-made tier", () => {
    render(<TierBadge tier="usmade" />);
    expect(screen.getByText(/US-Made/i)).toBeInTheDocument();
  });

  it("labels import tier", () => {
    render(<TierBadge tier="import" />);
    expect(screen.getByText(/Import/i)).toBeInTheDocument();
  });
});

describe("StatusBadge", () => {
  it("shows sold out when soldOut prop true", () => {
    render(<StatusBadge status="active" soldOut />);
    expect(screen.getByText(/Sold Out/i)).toBeInTheDocument();
  });

  it("shows status_label for inactive brands", () => {
    render(<StatusBadge status="dead" label="Domain Expired" />);
    expect(screen.getByText(/Domain Expired/i)).toBeInTheDocument();
  });

  it("falls back to Active for active brands", () => {
    render(<StatusBadge status="active" />);
    expect(screen.getByText(/Active/i)).toBeInTheDocument();
  });
});

describe("EmptyState", () => {
  it("renders title and body", () => {
    render(<EmptyState title="Nothing here" body="Try again" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(screen.getByText("Try again")).toBeInTheDocument();
  });
});
