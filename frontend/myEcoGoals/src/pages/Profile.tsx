import { useContext, useEffect, useState, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { getProfile, updateProfile } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

interface Habit {
  _id: string;
  name: string;
  completedDates: string[];
  streak: number;
}

const API = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

export default function Profile() {
  const { user, logout } = useContext(AuthContext)!;
  const [profile, setProfile] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>({});
  const [habits, setHabits] = useState<Habit[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.token) {
      // 🔹 Fetch profile
      getProfile(user.token).then((data) => {
        if (data.message === "User not found") {
          logout();
          navigate("/login");
        } else {
          setProfile(data);
          setForm(data); // prefill form
        }
      });

      // 🔹 Fetch habits
      axios
        .get<Habit[]>(`${API}/habits`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => setHabits(res.data))
        .catch((err) => console.error("Failed to fetch habits", err));
    } else {
      navigate("/login");
    }
  }, [user, logout, navigate]);

  const handleSave = async () => {
    if (!user?.token) return;
    const updated = await updateProfile(user.token, form);
    setProfile(updated);
    setEditMode(false);
  };

  // 🔹 Stats: total habits + best streak
  const totalHabits = useMemo(() => habits.length, [habits]);
  const bestStreak = useMemo(
    () => (habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0),
    [habits]
  );

  if (!profile) return <p className="text-center">Loading...</p>;

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center">
      <img
        src={profile.avatarUrl || "https://via.placeholder.com/"}
        alt="avatar"
        className="w-24 h-24 rounded-full mx-auto mb-4 shadow-md"
      />

      {editMode ? (
        <>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border px-3 py-2 rounded mb-2"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border px-3 py-2 rounded mb-2"
          />
          <textarea
            placeholder="Tell something about yourself..."
            value={form.bio || ""}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full border px-3 py-2 rounded mb-2"
          />
          <button
            onClick={handleSave}
            className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
          >
            Save
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="mt-2 w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold">{profile.name}</h2>
          <p className="text-gray-600">{profile.email}</p>
          <p className="text-sm text-gray-500 mb-2">
            Joined: {new Date(profile.createdAt).toDateString()}
          </p>
          <p className="text-gray-700 italic">{profile.bio || "No bio yet"}</p>

          {/* 🔹 Summary line for streaks + habits */}
          <div className="mt-4 flex justify-center items-center gap-6 text-sm text-gray-700">
            <span>🔥 Best Streak: {bestStreak} days</span>
            <span>📌 Habits: {totalHabits}</span>
          </div>

          {/* Link to full habits page */}
          <Link
            to="/habits"
            className="mt-2 inline-block text-blue-500 text-sm hover:underline"
          >
            View Details →
          </Link>

          <button
            onClick={() => setEditMode(true)}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Edit Profile
          </button>
        </>
      )}

      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
