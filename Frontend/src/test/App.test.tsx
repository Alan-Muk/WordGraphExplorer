import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../App";
import * as api from "../api/graph";

// Mock the Cytoscape component — jsdom has no canvas.
vi.mock("../components/GroupedGraphCanvas", () => ({
  default: ({
    data,
    onSelectNode,
  }: {
    data: { word: string };
    onSelectNode: (node: { id: string; label: string }) => void;
  }) => (
    <div data-testid="canvas">
      <span data-testid="canvas-word">{data.word}</span>
      <button onClick={() => onSelectNode({ id: "x", label: "poodle" })}>
        click-poodle
      </button>
    </div>
  ),
}));

// Mock the API module with vi.fn()s.
vi.mock("../api/graph", () => ({
  fetchGraph: vi.fn(),
  fetchGroupedGraph: vi.fn(),
  fetchPath: vi.fn(),
  fetchSimilarity: vi.fn(),
  searchWord: vi.fn(),
}));

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(api.fetchGroupedGraph).mockImplementation(
      async (word: string) => ({
        word,
        root: { id: "1", label: word },
        groups: [
          {
            relation: "hypernym",
            total: 1,
            nodes: [{ id: "2", label: "canine" }],
          },
          {
            relation: "hyponym",
            total: 18,
            nodes: [{ id: "3", label: "poodle" }],
          },
        ],
      }),
    );
  });

  it("loads 'dog' on mount", async () => {
    render(<App />);
    await waitFor(() =>
      expect(api.fetchGroupedGraph).toHaveBeenCalledWith("dog"),
    );
  });

  it("appends a relation step to history when a legend row is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => screen.getByText("hyponym"));

    await user.click(screen.getByText("hyponym"));

    // The breadcrumb should now show 'dog › hyponym'.
    // Use a query scoped to the breadcrumb container to avoid matching
    // the word "dog" that appears elsewhere (canvas, etc.).
    const breadcrumb = document.querySelector(".breadcrumb");
    expect(breadcrumb).not.toBeNull();
    if (breadcrumb) {
      expect(breadcrumb.textContent).toContain("dog");
      expect(breadcrumb.textContent).toContain("hyponym");
    }
  });

  it("loads a new word when a node is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => screen.getByTestId("canvas"));
    await user.click(screen.getByText("click-poodle"));

    await waitFor(() =>
      expect(api.fetchGroupedGraph).toHaveBeenCalledWith("poodle"),
    );
  });
});
