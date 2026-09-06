"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface AddCardModalProps {
  isOpen: boolean;
  columnTitle: string;
  columnId: string;
  onClose: () => void;
  onAddCard: (columnId: string, title: string, details: string) => void;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({
  isOpen,
  columnTitle,
  columnId,
  onClose,
  onAddCard,
}) => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a card title");
      return;
    }

    onAddCard(columnId, title, details);
    setTitle("");
    setDetails("");
    setError("");
    onClose();
  };

  const handleClose = () => {
    setTitle("");
    setDetails("");
    setError("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      data-testid="add-card-modal-backdrop"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-gray-100"
        data-testid="add-card-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-[#032147]">Add New Card</h2>
            <p className="text-xs text-[#888888]">
              Adding to column: <span className="font-semibold text-[#209dd7]">{columnTitle}</span>
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-[#888888] hover:bg-gray-100 hover:text-[#032147] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="card-title-input"
              className="block text-xs font-semibold text-[#032147] uppercase tracking-wider mb-1"
            >
              Card Title <span className="text-red-500">*</span>
            </label>
            <input
              id="card-title-input"
              data-testid="card-title-input"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Implement user authentication"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#032147] focus:border-[#209dd7] focus:outline-hidden focus:ring-2 focus:ring-[#209dd7]/20"
              autoFocus
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>

          <div>
            <label
              htmlFor="card-details-input"
              className="block text-xs font-semibold text-[#032147] uppercase tracking-wider mb-1"
            >
              Details / Notes
            </label>
            <textarea
              id="card-details-input"
              data-testid="card-details-input"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Add additional context or requirements..."
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#032147] focus:border-[#209dd7] focus:outline-hidden focus:ring-2 focus:ring-[#209dd7]/20 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-[#888888] hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="submit-card-button"
              className="rounded-lg bg-[#753991] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#622f7a] active:scale-95 transition-all cursor-pointer"
            >
              Create Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
