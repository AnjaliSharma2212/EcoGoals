import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Progress } from "../components/Card"; // shadcn/ui
import CalendarHeatmap from "../pages/CalenderHeatMap"; // your custom heatmap

const API = import.meta.env.VITE_API_BASE_URL;

interface ProgressData {
  totalHabits: number;
  totalCompleted: number;
  longestStreak: number;
  highestLevel: string;
  currentLevel: number;
  xp: number;
  badgesEarned: string[];
  streakHistory: { date: string; streak: number }[];
}

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(`${API}/progress`, {
          withCredentials: true,
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching progress:", err);
      }
    };
    fetchProgress();
  }, []);

  if (!data) return <p className="text-center">Loading progress...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Level & XP */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-md p-6 rounded-2xl"
      >
        <h2 className="text-xl font-bold mb-2">
          Level {data.currentLevel} ({data.highestLevel})
        </h2>
        <Progress value={data.xp} className="h-3" />
        <p className="text-sm text-gray-500 mt-1">{data.xp}/100 XP</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Habits" value={data.totalHabits} />
        <StatCard label="Completed" value={data.totalCompleted} />
        <StatCard label="Longest Streak" value={data.longestStreak} />
        <StatCard label="Highest Level" value={data.highestLevel} />
      </div>

      {/* Streak Heatmap */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white shadow-md p-6 rounded-2xl"
      >
        <h2 className="text-lg font-semibold mb-4">Streak History</h2>
        <CalendarHeatmap data={data.streakHistory} habits={[]} />
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white shadow-md p-6 rounded-2xl"
      >
        <h2 className="text-lg font-semibold mb-4">Badges Earned</h2>
        <div className="flex gap-3 flex-wrap">
          {data.badgesEarned.length > 0 ? (
            data.badgesEarned.map((badge, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium"
              >
                🏅 {badge}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No badges yet</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white shadow-md p-4 rounded-xl text-center"
    >
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </motion.div>
  );
}
