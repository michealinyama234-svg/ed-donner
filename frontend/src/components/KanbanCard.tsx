"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, GripVertical } from "lucide-react";
import { Card } from "@/types/kanban";

interface KanbanCardProps {
  card: Card;
  onDelete: (cardId: string) => void;
  isOverlay?: boolean;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  card,
  onDelete,
  isOverlay = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "Card",
      card,
    },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="rounded-lg border-2 border-dashed border-[#209dd7] bg-[#209dd7]/10 p-4 h-24 opacity-60"
        data-testid={`card-placeholder-${card.id}`}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid={`card-${card.id}`}
      className={`group relative rounded-xl bg-white p-3.5 shadow-sm border border-gray-200/80 hover:border-[#209dd7] hover:shadow-md transition-all duration-150 select-none ${
        isOverlay ? "rotate-2 shadow-xl border-[#209dd7] cursor-grabbing" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-[#888888] hover:text-[#032147] p-0.5 -ml-1 mt-0.5 rounded-sm transition-colors"
          title="Drag card"
          aria-label="Drag card handle"
        >
          <GripVertical className="w-4 h-4 opacity-50 group-hover:opacity-100" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-[#032147] break-words leading-tight">
            {card.title}
          </h4>
          {card.details && (
            <p className="mt-1.5 text-xs text-[#888888] break-words leading-relaxed">
              {card.details}
            </p>
          )}
        </div>

        {!isOverlay && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
            data-testid={`delete-card-${card.id}`}
            aria-label={`Delete card ${card.title}`}
            className="text-[#888888] hover:text-red-500 hover:bg-red-50 rounded-md p-1 transition-colors opacity-60 group-hover:opacity-100 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between border-t border-gray-100 pt-2">
        <span className="text-[10px] uppercase font-mono font-medium tracking-wider text-[#888888]">
          {card.id}
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-[#ecad0a]" />
      </div>
    </div>
  );
};
