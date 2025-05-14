export type QuestionLevel = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: string;
  platformLink: string;
  level: QuestionLevel;
  topic: string;
  completedByPuneet: boolean;
  completedByKomal: boolean;
  createdAt: number;
}

export interface FilterOptions {
  topic: string;
  level: QuestionLevel | 'All';
  search: string;
}

export interface SortOptions {
  field: keyof Question | '';
  direction: 'asc' | 'desc';
}

export interface Stats {
  total: number;
  completedByPuneet: number;
  completedByKomal: number;
  easy: number;
  medium: number;
  hard: number;
  topics: Record<string, number>;
}