import { useState, useCallback } from "react";
import { KanbanBoardState, Card } from "@/types/kanban";
import { initialKanbanData } from "@/data/initialData";

export function useKanban(initialState: KanbanBoardState = initialKanbanData) {
  const [boardState, setBoardState] = useState<KanbanBoardState>(initialState);

  const renameColumn = useCallback((columnId: string, newTitle: string) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    setBoardState((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === columnId ? { ...col, title: trimmed } : col
      ),
    }));
  }, []);

  const addCard = useCallback((columnId: string, title: string, details: string) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const newId = `card-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newCard: Card = {
      id: newId,
      title: trimmedTitle,
      details: details.trim(),
    };

    setBoardState((prev) => {
      const columnExists = prev.columns.some((col) => col.id === columnId);
      if (!columnExists) return prev;

      return {
        ...prev,
        cards: {
          ...prev.cards,
          [newId]: newCard,
        },
        columns: prev.columns.map((col) =>
          col.id === columnId
            ? { ...col, cardIds: [...col.cardIds, newId] }
            : col
        ),
      };
    });
  }, []);

  const deleteCard = useCallback((cardId: string) => {
    setBoardState((prev) => {
      const remainingCards = { ...prev.cards };
      delete remainingCards[cardId];

      return {
        ...prev,
        cards: remainingCards,
        columns: prev.columns.map((col) => ({
          ...col,
          cardIds: col.cardIds.filter((id) => id !== cardId),
        })),
      };
    });
  }, []);

  const moveCard = useCallback((activeId: string, overId: string) => {
    if (activeId === overId) return;

    setBoardState((prev) => {
      // Find source column
      const sourceCol = prev.columns.find((col) =>
        col.cardIds.includes(activeId)
      );
      if (!sourceCol) return prev;

      // Check if overId is a column or a card
      let destCol = prev.columns.find((col) => col.id === overId);
      let isOverCard = false;

      if (!destCol) {
        // overId might be another card
        destCol = prev.columns.find((col) => col.cardIds.includes(overId));
        isOverCard = true;
      }

      if (!destCol) return prev;

      const sourceIndex = sourceCol.cardIds.indexOf(activeId);

      if (sourceCol.id === destCol.id) {
        // Reorder within the same column
        if (!isOverCard) return prev;

        const overIndex = destCol.cardIds.indexOf(overId);
        if (sourceIndex === overIndex || overIndex === -1) return prev;

        const newCardIds = [...sourceCol.cardIds];
        newCardIds.splice(sourceIndex, 1);
        newCardIds.splice(overIndex, 0, activeId);

        return {
          ...prev,
          columns: prev.columns.map((col) =>
            col.id === sourceCol.id ? { ...col, cardIds: newCardIds } : col
          ),
        };
      } else {
        // Move to different column
        const sourceCardIds = [...sourceCol.cardIds];
        sourceCardIds.splice(sourceIndex, 1);

        const destCardIds = [...destCol.cardIds];
        if (isOverCard) {
          const overIndex = destCol.cardIds.indexOf(overId);
          destCardIds.splice(overIndex >= 0 ? overIndex : destCardIds.length, 0, activeId);
        } else {
          destCardIds.push(activeId);
        }

        return {
          ...prev,
          columns: prev.columns.map((col) => {
            if (col.id === sourceCol.id) {
              return { ...col, cardIds: sourceCardIds };
            }
            if (col.id === destCol.id) {
              return { ...col, cardIds: destCardIds };
            }
            return col;
          }),
        };
      }
    });
  }, []);

  return {
    boardState,
    renameColumn,
    addCard,
    deleteCard,
    moveCard,
  };
}
