import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Smile, Trophy, TrendingUp, Calendar, Quote } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface Habit {
  _id: string;
  name: string;
  description?: string;
  completedDates: string[];
}

const API = import.meta.env.VITE_API_BASE_URL;

const EngagementPage: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState<string | null>(null);
  const [aiMessage, setAiMessage] = useState<string>(""); // ✅ FIXED: AI message state

  // ✅ Fetch habits
  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in first");
        return;
      }

      const { data } = await axios.get(`${API}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let habitsList: Habit[] = [];

      if (Array.isArray(data)) {
        habitsList = data;
      } else if (Array.isArray(data.habits)) {
        habitsList = data.habits;
      }

      setHabits(habitsList);

      // ✅ Fetch AI message after loading habits
      if (habitsList.length > 0) {
        fetchAIMotivation(habitsList);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load habits");
      setHabits([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch AI motivational message
  const fetchAIMotivation = async (habits: Habit[]) => {
    try {
      const { data } = await axios.post(`${API}/ai/motivation`, { habits });
      setAiMessage(data.message);
    } catch (error) {
      console.error(error);
      setAiMessage("AI is resting 🤖💤… but you’re still awesome!");
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading habits...</p>;

  // Leaderboard (Top 3 habits by completions)
  const leaderboard = [...habits]
    .sort((a, b) => b.completedDates.length - a.completedDates.length)
    .slice(0, 3);

  // Weekly progress (Pie chart)
  const totalCompletions = habits.reduce(
    (sum, h) => sum + h.completedDates.length,
    0
  );
  const weeklyGoal = 20;
  const weeklyData = [
    { name: "Completed", value: totalCompletions },
    { name: "Remaining", value: Math.max(0, weeklyGoal - totalCompletions) },
  ];
  const COLORS = ["#22c55e", "#e5e7eb"];

  // Daily quotes
  const quotes = [
    "Small steps every day lead to big results.",
    "Your future depends on what you do today.",
    "Consistency is more important than intensity.",
    "Habits are the compound interest of self-improvement.",
  ];
  const dailyQuote = quotes[new Date().getDate() % quotes.length];

  // Fun confetti effect for mood logging
  const handleMood = (emoji: string) => {
    setMood(emoji);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12">
      <motion.h1
        className="text-3xl font-bold text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🌟 Stay Motivated
      </motion.h1>

      {/* Daily Quote */}
      <motion.div
        className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-md flex items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Quote className="w-10 h-10" />
        <p className="text-lg italic">{dailyQuote}</p>
      </motion.div>

      {/* ✅ AI Motivational Message */}
      {aiMessage && (
        <motion.div
          className="p-6 bg-yellow-100 rounded-xl shadow-md text-center text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {aiMessage}
        </motion.div>
      )}

      {/* Leaderboard */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Trophy className="text-yellow-500" /> Top Habits
        </h2>
        <ul className="space-y-3">
          {leaderboard.map((habit, idx) => (
            <motion.li
              key={habit._id}
              className="p-4 bg-white rounded-xl shadow flex justify-between items-center hover:scale-105 transition"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
            >
              <span className="font-bold text-lg flex items-center gap-2">
                {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"} {habit.name}
              </span>
              <span className="text-green-600 font-semibold">
                {habit.completedDates.length} completions
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Weekly Goal Gauge */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="text-green-500" /> Weekly Goal
        </h2>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={weeklyData}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {weeklyData.map((_entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center font-semibold mt-2">
            {totalCompletions}/{weeklyGoal} this week 🎯
          </p>
        </motion.div>
      </div>

      {/* Mood Tracker */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Smile className="text-pink-500" /> How do you feel today?
        </h2>
        <div className="flex gap-6 justify-center">
          {["😊", "😐", "😓", "🔥"].map((emoji) => (
            <motion.button
              key={emoji}
              className={`text-4xl p-3 rounded-lg shadow-md ${
                mood === emoji ? "bg-green-200" : "bg-gray-100"
              }`}
              whileTap={{ scale: 1.3, rotate: 10 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => handleMood(emoji)}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
        {mood && (
          <motion.p
            className="text-center mt-3 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            You feel <span className="font-bold">{mood}</span> today 💚
          </motion.p>
        )}
      </div>

      {/* Timeline */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="text-blue-500" /> Habit Journey
        </h2>
        <ul className="border-l-2 border-gray-300 pl-4 space-y-6">
          {habits.map((habit, idx) => (
            <motion.li
              key={habit._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="relative pl-4">
                <span className="absolute -left-3 top-1 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></span>
                <p className="font-semibold">{habit.name}</p>
                <p className="text-sm text-gray-500">
                  Started on{" "}
                  {habit.completedDates[0]
                    ? new Date(habit.completedDates[0]).toDateString()
                    : "Not yet started"}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EngagementPage;
