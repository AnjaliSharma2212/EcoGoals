// components/HabitCard.tsx
import { useState } from "react";
import { Card } from "./Card";
import { type Habit } from "../types";

interface HabitCardProps {
  habit: Habit;
  onUpdate?: (habit: Habit) => void;
}

export const HabitCard = ({ habit, onUpdate }: HabitCardProps) => {
  const [completed, setCompleted] = useState(
    habit.completedDates.includes(new Date().toDateString())
  );

  const markDone = () => {
    if (!completed) {
      const updatedHabit = {
        ...habit,
        completedDates: [...habit.completedDates, new Date().toISOString()],
        streak: habit.streak + 1,
      };
      setCompleted(true);
      onUpdate?.(updatedHabit);
      // Call API to update backend
    }
  };

  return (
    <Card
      className="border-l-4"
      style={{ borderColor: habit.color || "#3b82f6" }}
    >
      <h3 className="font-bold">{habit.name}</h3>
      <p className="text-gray-600">{habit.description}</p>
      <button
        onClick={markDone}
        className={`mt-2 px-4 py-1 rounded-md text-white ${
          completed ? "bg-green-500 cursor-not-allowed" : "bg-blue-500"
        }`}
        disabled={completed}
      >
        {completed ? "Done Today ✅" : "Mark Done"}
      </button>
      <p className="mt-1 text-sm">🔥 Current Streak: {habit.streak}</p>
    </Card>
  );
};
