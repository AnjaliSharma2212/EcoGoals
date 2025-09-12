import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Star, Brain, Gift, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import Profile from "./Profile";
import ChatbotButton from "../chatBot/ChatbotButton";

interface HabitData {
  _id: string;
  name: string;
  completedDates: string[];
}

export default function UserInsightsPage() {
  const [, setHabitData] = useState<HabitData[]>([]);
  const [quote, setQuote] = useState<string>("Loading...");
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [coins, setCoins] = useState<number>(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isChatOpen, setChatOpen] = useState(false);
  const API = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ✅ Fetch habits (but don’t call AI motivation anymore)
    axios
      .get(`${API}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.habits || [];
        setHabitData(data);
      })
      .catch(() => {
        console.warn("⚠️ Failed to fetch habits");
      });

    // ✅ Daily quote (fallback added in case API is down or SSL fails)
    fetch("https://zenquotes.io/api/random")
      .then((res) => res.json())
      .then((data) => setQuote(data[0].q + " — " + data[0].a))
      .catch(() =>
        setQuote("🌱 Your habits define your future. Keep growing!")
      );
  }, []);

  // 🎮 Mini game: Daily Quiz
  const quizQuestion = {
    question: "How many days does it take to form a habit?",
    options: ["7 days", "21 days", "66 days", "100 days"],
    correct: "66 days",
  };

  const handleQuizAnswer = (option: string) => {
    setQuizAnswer(option);
    if (option === quizQuestion.correct) {
      setCoins((c) => c + 10);
      if (!badges.includes("Brainy")) setBadges((prev) => [...prev, "Brainy"]);
    }
  };

  // 🎮 Mini game: Spin the Wheel
  const spinWheel = () => {
    const rewards = [
      "+5 Coins",
      "+10 Coins",
      "Gift 🎁",
      "Tag: Early Riser",
      "Nothing 😅",
    ];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];

    if (reward.includes("Coins")) {
      const value = parseInt(reward.replace(/\D/g, ""));
      setCoins((c) => c + value);
    } else if (reward.includes("Gift")) {
      if (!badges.includes("Lucky Winner"))
        setBadges((b) => [...b, "Lucky Winner"]);
    } else if (reward.includes("Tag")) {
      const tag = reward.replace("Tag: ", "");
      if (!tags.includes(tag)) setTags((t) => [...t, tag]);
    }

    alert(`You got: ${reward}`);
  };

  return (
    <div className="p-6 grid gap-6 md:grid-cols-2">
      {/* Profile */}
      <motion.div whileHover={{ scale: 1.02 }}>
        <Profile />
      </motion.div>

      {/* 🎮 Fun Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="text-pink-500" /> Fun Zone 🎮
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">Earn rewards by playing games!</p>
          <div className="flex gap-3">
            <motion.button
              onClick={spinWheel}
              whileTap={{ scale: 0.9 }}
              className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-md"
            >
              Spin the Wheel 🎡
            </motion.button>
          </div>
        </CardContent>
      </Card>

      {/* 🎁 Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="text-green-500" /> Your Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>💰 Coins: {coins}</p>
          <p>🏅 Badges: {badges.length ? badges.join(", ") : "None yet"}</p>
          <p>🏷️ Tags: {tags.length ? tags.join(", ") : "None yet"}</p>
        </CardContent>
      </Card>

      {/* Quiz */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="text-blue-500" /> Daily Quiz 🧠
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{quizQuestion.question}</p>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {quizQuestion.options.map((option) => (
              <motion.button
                key={option}
                onClick={() => handleQuizAnswer(option)}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-md border text-sm ${
                  quizAnswer === option
                    ? option === quizQuestion.correct
                      ? "bg-green-200 border-green-500"
                      : "bg-red-200 border-red-500"
                    : "hover:bg-gray-100"
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
          {quizAnswer && (
            <p className="mt-2 text-sm">
              {quizAnswer === quizQuestion.correct
                ? "✅ Correct! +10 Coins"
                : "❌ Oops! Correct answer: 66 days."}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements 🏆</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6">
          {badges.map((b, i) => (
            <motion.div key={i} whileHover={{ scale: 1.1 }}>
              <div className="flex flex-col items-center">
                <Star className="text-yellow-500" />
                <p className="text-sm mt-1">{b}</p>
              </div>
            </motion.div>
          ))}
          {!badges.length && <p>No achievements yet. Keep playing 🎯</p>}
        </CardContent>
      </Card>

      {/* Quote */}
      <Card>
        <CardHeader>
          <CardTitle>Quote of the Day ✨</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="italic">"{quote}"</p>
        </CardContent>
      </Card>

      {/* Floating AI Chat Button */}
      <ChatbotButton
        isOpen={isChatOpen}
        onClick={() => setChatOpen(!isChatOpen)}
      />
    </div>
  );
}
