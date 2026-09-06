"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useKanban } from "@/hooks/useKanban";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { AddCardModal } from "./AddCardModal";
import { Card } from "@/types/kanban";

export const KanbanBoard: React.FC = () => {
  const { boardState, renameColumn, addCard, deleteCard, moveCard } = useKanban();
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    columnId: string;
    columnTitle: string;
  }>({
    isOpen: false,
    columnId: "",
    columnTitle: "",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = boardState.cards[active.id as string];
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const sourceCol = boardState.columns.find((col) =>
      col.cardIds.includes(activeId)
    );
    const isOverColumn = boardState.columns.some((col) => col.id === overId);
    const isOverCard = !isOverColumn && boardState.cards[overId];

    if (!sourceCol) return;

    let destColId = "";
    if (isOverColumn) {
      destColId = overId;
    } else if (isOverCard) {
      const targetCol = boardState.columns.find((col) =>
        col.cardIds.includes(overId)
      );
      if (targetCol) {
        destColId = targetCol.id;
      }
    }

    if (destColId && sourceCol.id !== destColId) {
      moveCard(activeId, overId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId !== overId) {
      moveCard(activeId, overId);
    }
  };

  const handleOpenAddModal = (columnId: string, columnTitle: string) => {
    setModalState({
      isOpen: true,
      columnId,
      columnTitle,
    });
  };

  const handleCloseAddModal = () => {
    setModalState({
      isOpen: false,
      columnId: "",
      columnTitle: "",
    });
  };

  if (!isMounted) {
    return (
      <div className="w-full flex-1 flex flex-col p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 items-start flex-nowrap">
          {boardState.columns.map((column) => (
            <div
              key={column.id}
              className="flex flex-col flex-1 min-w-[280px] max-w-[340px] bg-[#eef2f8] rounded-xl border border-gray-200 h-96 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col p-4 md:p-6 max-w-7xl mx-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div
          data-testid="kanban-columns-container"
          className="flex gap-4 md:gap-6 overflow-x-auto pb-6 items-start flex-nowrap"
        >
          {boardState.columns.map((column) => {
            const columnCards = column.cardIds
              .map((id) => boardState.cards[id])
              .filter(Boolean);

            return (
              <KanbanColumn
                key={column.id}
                column={column}
                cards={columnCards}
                onRenameColumn={renameColumn}
                onOpenAddModal={handleOpenAddModal}
                onDeleteCard={deleteCard}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeCard ? (
            <KanbanCard
              card={activeCard}
              onDelete={() => {}}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <AddCardModal
        isOpen={modalState.isOpen}
        columnId={modalState.columnId}
        columnTitle={modalState.columnTitle}
        onClose={handleCloseAddModal}
        onAddCard={addCard}
      />
    </div>
  );
};
