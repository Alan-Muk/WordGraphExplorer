import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Legend from "../components/Legend";

describe("Legend", () => {
  const groups = [
    {
      relation: "hypernym",
      total: 2,
      top: { id: "1", label: "a", rank: 0 },
      nodes: [
        { id: "1", label: "a", rank: 0 },
        { id: "2", label: "b", rank: 0 },
      ],
    },
    {
      relation: "hyponym",
      total: 142,
      top: { id: "h0", label: "h0", rank: 0 },
      nodes: Array.from({ length: 30 }, (_, i) => ({
        id: `h${i}`,
        label: `h${i}`,
        rank: 0,
      })),
    },
  ];

  it("renders nothing when there are no groups", () => {
    const { container } = render(
      <Legend groups={[]} active={null} onSelect={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows 'N' for uncapped groups and 'N/M' for capped", () => {
    render(<Legend groups={groups} active={null} onSelect={vi.fn()} />);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("30/142")).toBeInTheDocument();
  });

  it("calls onSelect with the relation name on click", async () => {
    const onSelect = vi.fn();
    render(<Legend groups={groups} active={null} onSelect={onSelect} />);

    await userEvent.click(screen.getByText("hypernym"));
    expect(onSelect).toHaveBeenCalledWith("hypernym");
  });

  it("highlights the active group", () => {
    render(<Legend groups={groups} active="hyponym" onSelect={vi.fn()} />);
    const active = screen.getByText("hyponym").closest(".legend-row");
    expect(active).toHaveClass("active");
  });
});
