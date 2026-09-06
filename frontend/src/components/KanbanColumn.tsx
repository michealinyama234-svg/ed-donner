"use client";

import React, { useState, useRef, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, Check, Edit2 } from "lucide-react";
import { Column, Card } from "@/types/kanban";
import { KanbanCard } from "./KanbanCard";

interface KanbanColumnProps {
  column: Column;
  cards: Card[];
  onRenameColumn: (columnId: string, newTitle: string) => void;
  onOpenAddModal: (columnId: string, columnTitle: string) => void;
  onDeleteCard: (cardId: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  cards,
  onRenameColumn,
  onOpenAddModal,
  onDeleteCard,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  useEffect(() => {
    setTitle(column.title);
  }, [column.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSaveRename = () => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== column.title) {
      onRenameColumn(column.id, trimmed);
    } else {
      setTitle(column.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveRename();
    } else if (e.key === "Escape") {
      setTitle(column.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-testid={`column-${column.id}`}
      className="flex flex-col flex-1 min-w-[280px] max-w-[340px] bg-[#eef2f8] rounded-xl border border-gray-200 shadow-xs max-h-[calc(100vh-140px)]"
    >
      {/* Column Header */}
      <div className="p-3.5 border-b border-gray-200/80 bg-white/60 rounded-t-xl flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-1.5 flex-1">
              <input
                ref={inputRef}
                data-testid={`column-rename-input-${column.id}`}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSaveRename}
                onKeyDown={handleKeyDown}
                className="w-full text-sm font-bold text-[#032147] border border-[#209dd7] rounded px-2 py-0.5 focus:outline-hidden focus:ring-1 focus:ring-[#209dd7] bg-white"
              />
              <button
                onMouseDown={handleSaveRename}
                className="text-[#209dd7] hover:text-[#032147] p-1 cursor-pointer"
                aria-label="Confirm column rename"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              className="flex items-center gap-1.5 group cursor-pointer flex-1 min-w-0"
              onClick={() => setIsEditing(true)}
              title="Click to rename column"
              data-testid={`column-title-container-${column.id}`}
            >
              <h3
                data-testid={`column-title-${column.id}`}
                className="text-sm font-bold text-[#032147] truncate group-hover:text-[#209dd7] transition-colors"
              >
                {column.title}
              </h3>
              <Edit2 className="w-3 h-3 text-[#888888] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span
            data-testid={`column-count-${column.id}`}
            className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#032147]/10 text-[#032147]"
          >
            {cards.length}
          </span>
          <button
            onClick={() => onOpenAddModal(column.id, column.title)}
            data-testid={`add-card-button-${column.id}`}
            aria-label={`Add card to ${column.title}`}
            className="p-1 rounded-lg text-[#032147] hover:bg-[#209dd7] hover:text-white transition-colors cursor-pointer"
            title="Add card"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards Droppable Area */}
      <div
        ref={setNodeRef}
        data-testid={`column-droppable-${column.id}`}
        className={`flex-1 p-3 overflow-y-auto space-y-2.5 min-h-[150px] transition-colors ${
          isOver ? "bg-[#209dd7]/10 rounded-b-xl" : ""
        }`}
      >
        <SortableContext
          items={column.cardIds}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              onDelete={onDeleteCard}
            />
          ))}
        </SortableContext>

        {cards.length === 0 && (
          <div
            data-testid={`empty-column-${column.id}`}
            className="flex flex-col items-center justify-center h-28 border border-dashed border-gray-300 rounded-lg text-center p-3"
          >
            <p className="text-xs text-[#888888] font-medium">No cards yet</p>
            <button
              onClick={() => onOpenAddModal(column.id, column.title)}
              className="mt-2 text-xs font-semibold text-[#209dd7] hover:underline cursor-pointer"
            >
              + Add first card
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
