import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import CalendarHeatmap from "../pages/CalenderHeatMap";
import { ShareButton } from "./ShareButton";

interface Habit {
  _id: string;
  name: string;
  description?: string;
  completedDates: string[];
  streak: number;
  color?: string;
}

const API = import.meta.env.VITE_API_BASE_URL;

const dateOnly = (d: string | Date) => new Date(d).toISOString().slice(0, 10);
const today = () => dateOnly(new Date());

const calcStreak = (dateList: string[]): number => {
  if (!dateList?.length) return 0;
  const set = new Set(dateList.map(dateOnly));
  let count = 0;
  let cursor = new Date();
  while (true) {
    const key = dateOnly(cursor);
    if (set.has(key)) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }
  return count;
};

const getToken = (): string | null => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw)?.token ?? null;
  } catch {
    return null;
  }
};

export default function HabitDetailsPage() {
  const { habitId } = useParams();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHabit = async () => {
      const token = getToken();
      if (!token || !habitId) {
        setError("Token or habit ID missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await axios.get(`${API}/habits/${habitId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // If backend returns an array for single habit, pick first element
        const habitData = Array.isArray(data) ? data[0] : data;

        if (!habitData) {
          setError("Habit not found");
          setHabit(null);
        } else {
          setHabit(habitData);
          setError("");
        }
      } catch (err: any) {
        console.error("Fetch habit failed:", err);
        setError(
          err.response?.status === 401
            ? "Unauthorized – login required"
            : "Failed to fetch habit"
        );
        setHabit(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHabit();
  }, [habitId]);

  const toggleToday = async () => {
    if (!habit) return;
    const token = getToken();
    if (!token) return;

    const t = today();
    const hasToday = habit.completedDates?.map(dateOnly).includes(t);
    const updatedDates = hasToday
      ? habit.completedDates.filter((d) => dateOnly(d) !== t)
      : [...habit.completedDates, t];

    const newStreak = calcStreak(updatedDates);

    try {
      const { data } = await axios.put(
        `${API}/habits/${habit._id}`,
        { completedDates: updatedDates, streak: newStreak },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHabit(data);
    } catch (err) {
      console.error("Toggle today failed:", err);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading…</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!habit)
    return <p className="text-center text-gray-500">Habit not found</p>;

  const hasToday = habit.completedDates?.map(dateOnly).includes(today());
  const message = `I’ve been working on "${habit.name}" for ${habit.streak} days! 🚀`;
  return (
    <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-green-700 mb-4">
        🌱 Habit Details
      </h1>

      <div
        className="p-4 border rounded-xl"
        style={{ borderLeft: `6px solid ${habit.color || "#22c55e"}` }}
      >
        <h2 className="font-semibold text-xl">{habit.name}</h2>
        {habit.description && (
          <p className="text-gray-600 mt-1">{habit.description}</p>
        )}
        <p className="text-sm text-gray-400 mt-2">
          🔥 Streak: {habit.streak} days • Completed{" "}
          {habit.completedDates?.length ?? 0} times
        </p>
        <ShareButton message={message} />

        <button
          onClick={toggleToday}
          className={`mt-4 px-4 py-2 rounded-xl border transition ${
            hasToday
              ? "bg-white border-green-600 text-green-700 hover:bg-green-50"
              : "bg-green-600 border-green-600 text-white hover:bg-green-700"
          }`}
        >
          {hasToday ? "Undo Today" : "Done Today"}
        </button>
        {/* ✅ Calendar Heatmap */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">📅 Completion Calendar</h3>
          <CalendarHeatmap habits={habit ? [habit] : []} />
        </div>
        <Link
          to="/habits"
          className="inline-block mt-4 text-blue-600 hover:underline"
        >
          ← Back to Habits
        </Link>
      </div>
    </div>
  );
}
