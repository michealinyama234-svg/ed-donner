import { KanbanBoardState } from "@/types/kanban";

export const initialKanbanData: KanbanBoardState = {
  columns: [
    {
      id: "col-backlog",
      title: "Backlog",
      cardIds: ["card-1", "card-2"],
    },
    {
      id: "col-ready",
      title: "Ready",
      cardIds: ["card-3"],
    },
    {
      id: "col-in-progress",
      title: "In Progress",
      cardIds: ["card-4", "card-5"],
    },
    {
      id: "col-in-review",
      title: "In Review",
      cardIds: ["card-6"],
    },
    {
      id: "col-done",
      title: "Done",
      cardIds: ["card-7", "card-8"],
    },
  ],
  cards: {
    "card-1": {
      id: "card-1",
      title: "Audit accessibility contrast",
      details: "Check all header labels and badge contrasts against WCAG AA compliance.",
    },
    "card-2": {
      id: "card-2",
      title: "Design mobile gestures",
      details: "Evaluate touch handles for card dragging on compact viewports.",
    },
    "card-3": {
      id: "card-3",
      title: "Prepare sprint release notes",
      details: "Summarize delivered UI improvements and test coverage metrics.",
    },
    "card-4": {
      id: "card-4",
      title: "Implement drag and drop",
      details: "Connect pointer sensors and sortable context for column transfers.",
    },
    "card-5": {
      id: "card-5",
      title: "Column rename inline edit",
      details: "Allow double click or direct edit with enter and blur save handlers.",
    },
    "card-6": {
      id: "card-6",
      title: "Card modal validation",
      details: "Ensure empty title submission is prevented with clean visual feedback.",
    },
    "card-7": {
      id: "card-7",
      title: "Define brand design tokens",
      details: "Configured Dark Navy, Accent Yellow, Blue Primary, and Purple Secondary.",
    },
    "card-8": {
      id: "card-8",
      title: "Scaffold Next.js client app",
      details: "Set up frontend directory structure with TypeScript and Tailwind CSS.",
    },
  },
};
