import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Breadcrumb from "../components/Breadcrumb";

describe("Breadcrumb", () => {
  it("renders nothing when there is one step", () => {
    const { container } = render(
      <Breadcrumb
        history={[{ kind: "word", value: "dog" }]}
        onNavigate={vi.fn()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders each step with a separator", () => {
    render(
      <Breadcrumb
        history={[
          { kind: "word", value: "dog" },
          { kind: "relation", value: "hyponym" },
          { kind: "word", value: "poodle" },
        ]}
        onNavigate={vi.fn()}
      />,
    );

    expect(screen.getByText("dog")).toBeInTheDocument();
    expect(screen.getByText("hyponym")).toBeInTheDocument();
    expect(screen.getByText("poodle")).toBeInTheDocument();
  });

  it("disables the last step", () => {
    render(
      <Breadcrumb
        history={[
          { kind: "word", value: "dog" },
          { kind: "word", value: "poodle" },
        ]}
        onNavigate={vi.fn()}
      />,
    );

    expect(screen.getByText("poodle")).toBeDisabled();
    expect(screen.getByText("dog")).not.toBeDisabled();
  });

  it("calls onNavigate with the correct index when a step is clicked", async () => {
    const onNavigate = vi.fn();
    render(
      <Breadcrumb
        history={[
          { kind: "word", value: "dog" },
          { kind: "relation", value: "hyponym" },
          { kind: "word", value: "poodle" },
        ]}
        onNavigate={onNavigate}
      />,
    );

    await userEvent.click(screen.getByText("dog"));
    expect(onNavigate).toHaveBeenCalledWith(0);

    await userEvent.click(screen.getByText("hyponym"));
    expect(onNavigate).toHaveBeenCalledWith(1);
  });
});
