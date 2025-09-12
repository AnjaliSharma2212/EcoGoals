import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Trophy, Flame, Target, BarChart3 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "../components/Card";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { Habit } from "../types";

// ---------- Interfaces ----------
interface Badge {
  title: string;
  message: string;
  dateAwarded: string;
}

interface Progress {
  totalHabits: number;
  totalCompleted: number;
  longestStreak: number;
  currentLevel: "None" | "Bronze" | "Silver" | "Gold";
  badgesEarned: Badge[];
  streakHistory: { date: string; streak: number }[];
}

// ---------- Component ----------
export default function ProgressDashboard() {
  const [progress, setProgress] = useState<Progress>({
    totalHabits: 0,
    totalCompleted: 0,
    longestStreak: 0,
    currentLevel: "None",
    badgesEarned: [],
    streakHistory: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE_URL;
  const [habits, setHabits] = useState<Habit[]>([]);
  const getToken = (): string | null => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      return JSON.parse(raw)?.token ?? null;
    } catch {
      return null;
    }
  };

  // ✅ Fetch habits from MongoDB
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
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchHabits();
    const interval = setInterval(fetchHabits, 5000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ read token
        if (!token) {
          toast.error("Please log in first");
          setLoading(false);
          return;
        }

        const { data } = await axios.get(`${API}/progress`, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ send JWT
          },
        });

        setProgress({
          totalHabits: data.totalHabits ?? 0,
          totalCompleted: data.totalCompleted ?? 0,
          longestStreak: data.longestStreak ?? 0,
          currentLevel: data.currentLevel ?? "None",
          badgesEarned: data.badgesEarned ?? [],
          streakHistory: data.streakHistory ?? [],
        });
      } catch (error: any) {
        console.error("Failed to load progress:", error);
        toast.error(error.response?.data?.message || "Failed to load progress");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [API]);

  if (loading) {
    return <p className="text-center mt-8">Loading progress...</p>;
  }

  const handleEngagement = () => {
    navigate("/engage");
  };
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">📊 Your Progress</h1>
      {/* ✅ All Habits List */}
      <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Habits</h2>
        {loading ? (
          <p className="text-gray-500">Loading habits…</p>
        ) : habits.length === 0 ? (
          <p className="text-gray-500">No habits yet. Add some first!</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {habits.map((habit, idx) => (
              <motion.li
                key={habit._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="py-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold">{habit.name}</h3>
                  <p className="text-sm text-gray-500">
                    {habit.description || "No description"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {habit.completedDates.length} completions • Streak:{" "}
                    {habit.streak || 0} days
                  </p>
                </div>
                <span
                  className="h-5 w-5 rounded-full shadow"
                  style={{ backgroundColor: habit.color || "#3b82f6" }}
                />
              </motion.li>
            ))}
          </ul>
        )}
      </div>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 text-center">
          <CardContent>
            <Target className="w-10 h-10 mx-auto text-blue-500" />
            <h2 className="text-xl font-semibold mt-2">Total Habits</h2>
            <p className="text-2xl font-bold">{progress.totalHabits}</p>
          </CardContent>
        </Card>

        <Card className="p-4 text-center">
          <CardContent>
            <Flame className="w-10 h-10 mx-auto text-orange-500" />
            <h2 className="text-xl font-semibold mt-2">Longest Streak</h2>
            <p className="text-2xl font-bold">{progress.longestStreak} 🔥</p>
          </CardContent>
        </Card>

        <Card className="p-4 text-center">
          <CardContent>
            <Trophy className="w-10 h-10 mx-auto text-yellow-500" />
            <h2 className="text-xl font-semibold mt-2">Level</h2>
            <p className="text-2xl font-bold">{progress.currentLevel}</p>
          </CardContent>
        </Card>
      </div>

      {/* Total Completed */}
      <Card className="p-4">
        <CardContent>
          <h2 className="text-xl font-semibold">✅ Total Completed</h2>
          <p className="text-2xl font-bold">{progress.totalCompleted}</p>
        </CardContent>
      </Card>

      {/* 📈 Streak History Chart */}
      <Card className="p-4">
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-green-500 w-6 h-6" />
            <h2 className="text-xl font-semibold">Streak History</h2>
          </div>
          {progress.streakHistory.length === 0 ? (
            <p>No streak data yet. Start completing habits! 🚀</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progress.streakHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="streak"
                  stroke="#22c55e"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Badges Section */}
      <Card className="p-4">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">🎖 Badges Earned</h2>
          {progress.badgesEarned.length === 0 ? (
            <p>No badges yet. Keep going! 🚀</p>
          ) : (
            <ul className="space-y-3">
              {progress.badgesEarned.map((badge, idx) => (
                <li
                  key={idx}
                  className="p-3 bg-gray-100 rounded-lg shadow flex flex-col"
                >
                  <span className="font-bold">{badge.title}</span>
                  <span className="text-sm text-gray-600">{badge.message}</span>
                  <span className="text-xs text-gray-400 mt-1">
                    {badge.dateAwarded
                      ? new Date(badge.dateAwarded).toLocaleDateString()
                      : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <button onClick={handleEngagement}>See EngagementPage</button>
    </div>
  );
}
