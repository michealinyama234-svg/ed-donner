import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddCardModal } from "./AddCardModal";

describe("AddCardModal Component", () => {
  it("renders modal when open", () => {
    render(
      <AddCardModal
        isOpen={true}
        columnTitle="Backlog"
        columnId="col-1"
        onClose={vi.fn()}
        onAddCard={vi.fn()}
      />
    );

    expect(screen.getByText("Add New Card")).toBeInTheDocument();
    expect(screen.getByText("Backlog")).toBeInTheDocument();
  });

  it("submits new card with title and details", async () => {
    const user = userEvent.setup();
    const handleAddCard = vi.fn();
    const handleClose = vi.fn();

    render(
      <AddCardModal
        isOpen={true}
        columnTitle="Backlog"
        columnId="col-1"
        onClose={handleClose}
        onAddCard={handleAddCard}
      />
    );

    const titleInput = screen.getByTestId("card-title-input");
    const detailsInput = screen.getByTestId("card-details-input");
    const submitBtn = screen.getByTestId("submit-card-button");

    await user.type(titleInput, "New Feature Card");
    await user.type(detailsInput, "Feature details here");
    await user.click(submitBtn);

    expect(handleAddCard).toHaveBeenCalledWith(
      "col-1",
      "New Feature Card",
      "Feature details here"
    );
    expect(handleClose).toHaveBeenCalled();
  });

  it("shows validation error on empty title submit", async () => {
    const user = userEvent.setup();
    const handleAddCard = vi.fn();

    render(
      <AddCardModal
        isOpen={true}
        columnTitle="Backlog"
        columnId="col-1"
        onClose={vi.fn()}
        onAddCard={handleAddCard}
      />
    );

    const submitBtn = screen.getByTestId("submit-card-button");
    await user.click(submitBtn);

    expect(screen.getByText("Please enter a card title")).toBeInTheDocument();
    expect(handleAddCard).not.toHaveBeenCalled();
  });
});
