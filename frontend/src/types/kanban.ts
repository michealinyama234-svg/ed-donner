export interface Card {
  id: string;
  title: string;
  details: string;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface KanbanBoardState {
  columns: Column[];
  cards: Record<string, Card>;
}
