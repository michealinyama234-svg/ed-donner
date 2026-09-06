import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useKanban } from "./useKanban";
import { KanbanBoardState } from "@/types/kanban";

const testInitialState: KanbanBoardState = {
  columns: [
    { id: "col-1", title: "Column 1", cardIds: ["c1", "c2"] },
    { id: "col-2", title: "Column 2", cardIds: ["c3"] },
    { id: "col-3", title: "Column 3", cardIds: [] },
    { id: "col-4", title: "Column 4", cardIds: [] },
    { id: "col-5", title: "Column 5", cardIds: [] },
  ],
  cards: {
    c1: { id: "c1", title: "Card 1", details: "Detail 1" },
    c2: { id: "c2", title: "Card 2", details: "Detail 2" },
    c3: { id: "c3", title: "Card 3", details: "Detail 3" },
  },
};

describe("useKanban Hook", () => {
  it("initializes with provided state or default state", () => {
    const { result } = renderHook(() => useKanban(testInitialState));
    expect(result.current.boardState.columns).toHaveLength(5);
    expect(Object.keys(result.current.boardState.cards)).toHaveLength(3);
  });

  it("renames a column correctly", () => {
    const { result } = renderHook(() => useKanban(testInitialState));

    act(() => {
      result.current.renameColumn("col-1", "Updated Backlog");
    });

    const col1 = result.current.boardState.columns.find((c) => c.id === "col-1");
    expect(col1?.title).toBe("Updated Backlog");
  });

  it("ignores column rename when title is empty or whitespace only", () => {
    const { result } = renderHook(() => useKanban(testInitialState));

    act(() => {
      result.current.renameColumn("col-1", "   ");
    });

    const col1 = result.current.boardState.columns.find((c) => c.id === "col-1");
    expect(col1?.title).toBe("Column 1");
  });

  it("adds a new card to a specific column", () => {
    const { result } = renderHook(() => useKanban(testInitialState));

    act(() => {
      result.current.addCard("col-2", "New Task", "Detailed task notes");
    });

    const col2 = result.current.boardState.columns.find((c) => c.id === "col-2");
    expect(col2?.cardIds).toHaveLength(2);

    const newCardId = col2?.cardIds[1];
    expect(newCardId).toBeDefined();

    const createdCard = result.current.boardState.cards[newCardId!];
    expect(createdCard.title).toBe("New Task");
    expect(createdCard.details).toBe("Detailed task notes");
  });

  it("does not add a card if title is blank", () => {
    const { result } = renderHook(() => useKanban(testInitialState));

    act(() => {
      result.current.addCard("col-2", "   ", "Notes");
    });

    const col2 = result.current.boardState.columns.find((c) => c.id === "col-2");
    expect(col2?.cardIds).toHaveLength(1);
  });

  it("deletes a card and removes it from column cardIds", () => {
    const { result } = renderHook(() => useKanban(testInitialState));

    act(() => {
      result.current.deleteCard("c1");
    });

    const col1 = result.current.boardState.columns.find((c) => c.id === "col-1");
    expect(col1?.cardIds).not.toContain("c1");
    expect(col1?.cardIds).toEqual(["c2"]);
    expect(result.current.boardState.cards["c1"]).toBeUndefined();
  });

  it("moves a card from one column to another", () => {
    const { result } = renderHook(() => useKanban(testInitialState));

    act(() => {
      result.current.moveCard("c1", "col-2");
    });

    const col1 = result.current.boardState.columns.find((c) => c.id === "col-1");
    const col2 = result.current.boardState.columns.find((c) => c.id === "col-2");

    expect(col1?.cardIds).toEqual(["c2"]);
    expect(col2?.cardIds).toContain("c1");
  });

  it("reorders cards within the same column", () => {
    const { result } = renderHook(() => useKanban(testInitialState));

    act(() => {
      result.current.moveCard("c2", "c1");
    });

    const col1 = result.current.boardState.columns.find((c) => c.id === "col-1");
    expect(col1?.cardIds).toEqual(["c2", "c1"]);
  });
});
