import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { KanbanColumn } from "./KanbanColumn";
import { Column, Card } from "@/types/kanban";

const mockColumn: Column = {
  id: "col-test",
  title: "In Progress",
  cardIds: ["c1"],
};

const mockCards: Card[] = [
  { id: "c1", title: "Test Card 1", details: "Details 1" },
];

describe("KanbanColumn Component", () => {
  it("renders column title and card count", () => {
    render(
      <KanbanColumn
        column={mockColumn}
        cards={mockCards}
        onRenameColumn={vi.fn()}
        onOpenAddModal={vi.fn()}
        onDeleteCard={vi.fn()}
      />
    );

    expect(screen.getByTestId("column-title-col-test")).toHaveTextContent("In Progress");
    expect(screen.getByTestId("column-count-col-test")).toHaveTextContent("1");
    expect(screen.getByText("Test Card 1")).toBeInTheDocument();
  });

  it("triggers inline rename on Enter", async () => {
    const user = userEvent.setup();
    const handleRename = vi.fn();

    render(
      <KanbanColumn
        column={mockColumn}
        cards={mockCards}
        onRenameColumn={handleRename}
        onOpenAddModal={vi.fn()}
        onDeleteCard={vi.fn()}
      />
    );

    // Click on title container to activate inline edit mode
    await user.click(screen.getByTestId("column-title-container-col-test"));

    const input = screen.getByTestId("column-rename-input-col-test");
    expect(input).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, "Doing Now{enter}");

    expect(handleRename).toHaveBeenCalledWith("col-test", "Doing Now");
  });

  it("opens add card modal when plus button is clicked", async () => {
    const user = userEvent.setup();
    const handleOpenAddModal = vi.fn();

    render(
      <KanbanColumn
        column={mockColumn}
        cards={mockCards}
        onRenameColumn={vi.fn()}
        onOpenAddModal={handleOpenAddModal}
        onDeleteCard={vi.fn()}
      />
    );

    const addBtn = screen.getByTestId("add-card-button-col-test");
    await user.click(addBtn);

    expect(handleOpenAddModal).toHaveBeenCalledWith("col-test", "In Progress");
  });

  it("calls onDeleteCard when delete button on a card is clicked", async () => {
    const user = userEvent.setup();
    const handleDeleteCard = vi.fn();

    render(
      <KanbanColumn
        column={mockColumn}
        cards={mockCards}
        onRenameColumn={vi.fn()}
        onOpenAddModal={vi.fn()}
        onDeleteCard={handleDeleteCard}
      />
    );

    const deleteBtn = screen.getByTestId("delete-card-c1");
    await user.click(deleteBtn);

    expect(handleDeleteCard).toHaveBeenCalledWith("c1");
  });
});
