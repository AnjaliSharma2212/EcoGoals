export interface Habit {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  streak: number;
  completedDates: string[];
}

export type Status = "todo" | "inprogress" | "done";

export interface Task {
  _id: string; // mongo id
  id?: string; // optional if older version used id
  title: string;
  description?: string;
  status: Status;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

// types.ts
export interface ChatMessageType {
  text: string;
  isBot: boolean;
}

export interface EcoGoal {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface UserData {
  name: string;
  streak: number;
  ecoGoals: EcoGoal[];
}
