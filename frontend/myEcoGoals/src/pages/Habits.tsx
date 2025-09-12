import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import CalendarHeatmap from "./CalenderHeatMap";
import Fireworks from "../components/FireWorks";
import AddHabitModal from "../components/AddHabitModel";
import ChatbotButton from "../chatBot/ChatbotButton";

interface Habit {
  _id: string;
  name: string;
  description?: string;
  completedDates: string[];
  streak: number;
  color?: string;
}

const API = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

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

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(false);

  // modal state
  const [isModalOpen, setModalOpen] = useState(false);

  // edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [isChatOpen, setChatOpen] = useState(false);
  // Fetch habits
  useEffect(() => {
    const fetchHabits = async () => {
      const token = getToken();
      if (!token) return;
      try {
        setLoading(true);
        const { data } = await axios.get<Habit[]>(`${API}/habits`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHabits(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch habits failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHabits();
  }, []);

  // Add new habit
  const addHabit = async (habit: { name: string; description: string }) => {
    if (!habit.name.trim() || !habit.description.trim()) {
      toast.error("All fields need to be filled! 🙂");
      return;
    }
    const token = getToken();
    if (!token) return;
    try {
      const { data } = await axios.post<Habit>(
        `${API}/habits`,
        {
          name: habit.name,
          description: habit.description,
          color: "#22c55e",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHabits((prev) => [...prev, data]);

      // play sound
      const audio = new Audio("https://www.soundjay.com/human/hurrah-01.mp3");

      audio.play();

      // trigger fireworks
      const event = new Event("fireworks");
      window.dispatchEvent(event);

      toast.success("Habit added successfully! 🌱");
    } catch (err) {
      toast.error("Failed to add habit. Try again.");
      console.error("Add habit failed:", err);
    }
  };

  // Toggle Done Today
  const toggleToday = async (habit: Habit) => {
    const token = getToken();
    if (!habit) return;
    if (!token) {
      toast.error("You need to be logged in!");
      return;
    }

    const t = today();
    const hasToday = habit.completedDates?.map(dateOnly).includes(t);
    const existing = Array.from(
      new Set((habit.completedDates || []).map(dateOnly))
    );

    const updatedDates = hasToday
      ? existing.filter((d) => d !== t)
      : [...existing, t];
    const newStreak = calcStreak(updatedDates);

    try {
      const { data } = await axios.put<Habit>(
        `${API}/habits/${habit._id}`,
        { completedDates: updatedDates, streak: newStreak },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHabits((prev) => prev.map((h) => (h._id === habit._id ? data : h)));
      toast.success(
        hasToday
          ? "Undo today's completion ✅"
          : "Habit marked done for today! 🌱"
      );
    } catch (err) {
      console.error("Toggle today failed:", err);
      toast.error("Failed to update habit. Try again.");
    }
  };

  // Edit
  const startEdit = (habit: Habit) => {
    setEditingId(habit._id);
    setEditName(habit.name);
    setEditDesc(habit.description || "");
  };

  const saveEdit = async (id: string) => {
    const token = getToken();
    if (!token) return;
    try {
      const { data } = await axios.put<Habit>(
        `${API}/habits/${id}`,
        { name: editName, description: editDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHabits((prev) => prev.map((h) => (h._id === id ? data : h)));
      setEditingId(null);
      toast.success("Edited Successfully ✏️");
    } catch (err) {
      console.error("Save edit failed:", err);
      toast.error("Editing Failed. Try Again.");
    }
  };

  // Delete
  const deleteHabit = async (id: string) => {
    const token = getToken();
    if (!token) return;
    try {
      await axios.delete(`${API}/habits/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits((prev) => prev.filter((h) => h._id !== id));
      toast.success("Habit deleted successfully! 🗑️");
    } catch (err) {
      console.error("Delete habit failed:", err);
      toast.error("Error in Habit deletion! 🗑️");
    }
  };

  const list = useMemo(() => habits ?? [], [habits]);

  return (
    <div className="p-6">
      <Fireworks />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">🌱 My Habits</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-green-500 text-white shadow-md hover:bg-green-600 transition"
        >
          + Add Habit
        </motion.button>
      </div>

      {/* Calendar Overview */}
      {list.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">📅 Last 30 Days</h2>
          <CalendarHeatmap habits={habits} />
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading habits…</p>
      ) : list.length === 0 ? (
        <p className="text-center text-gray-500">
          No habits yet. Add your first one!
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {list.map((habit) => {
              const hasToday = habit.completedDates
                ?.map(dateOnly)
                .includes(today());

              return (
                <motion.li
                  key={habit._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col justify-between p-4 border rounded-xl shadow-sm hover:shadow-md transition bg-white"
                  style={{
                    borderLeft: `6px solid ${habit.color || "#22c55e"}`,
                  }}
                >
                  {editingId === habit._id ? (
                    <div className="flex-1">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full mb-2 px-2 py-1 border rounded"
                      />
                      <textarea
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Description..."
                        className="w-full px-2 py-1 border rounded"
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => saveEdit(habit._id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 border rounded hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Link
                        to={`/habits/${habit._id}`}
                        className="flex-1 block"
                      >
                        <div className="font-semibold text-lg">
                          {habit.name}
                        </div>
                        {habit.description && (
                          <p className="text-sm text-gray-500">
                            {habit.description}
                          </p>
                        )}
                        <div className="text-xs mt-1">
                          <span className="text-blue-600">
                            🔥 Streak: {habit.streak} days
                          </span>{" "}
                          <span className="text-gray-400">
                            • Completed {habit.completedDates?.length ?? 0}{" "}
                            times
                          </span>
                        </div>
                      </Link>

                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => toggleToday(habit)}
                          className={`px-3 py-1 rounded-xl border transition ${
                            hasToday
                              ? "bg-white border-green-600 text-green-700 hover:bg-green-50"
                              : "bg-green-600 border-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          {hasToday ? "Undo Today" : "Done Today"}
                        </button>
                        <button
                          onClick={() => startEdit(habit)}
                          className="px-3 py-1 rounded-xl border border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteHabit(habit._id)}
                          className="px-3 py-1 rounded-xl border border-red-500 text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
      {/* Floating button */}
      <ChatbotButton
        isOpen={isChatOpen}
        onClick={() => setChatOpen(!isChatOpen)}
      />

      {/* Modal */}
      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={addHabit}
      />
    </div>
  );
}
