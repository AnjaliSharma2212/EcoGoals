import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Habits from "./pages/Habits";
import HabitDetailsPage from "./components/HabitDetailsPage";
import { Toaster } from "react-hot-toast";
import ProgressDashboard from "./pages/ProgressDashboard";
import EngagementPage from "./pages/EngageMentPage";
import UserInsightsPage from "./pages/UserInsight";
import HomePage from "./pages/Home";
import { useState } from "react";
import ChatbotButton from "./chatBot/ChatbotButton";
import ChatWindow from "./chatBot/CharWindow";
import TaskPage from "./components/TaskPage";

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <div className="bg-gray-100">
          <Navbar />
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/habits" element={<Habits />} />
              <Route path="/habits/:habitId" element={<HabitDetailsPage />} />
              <Route
                path="/progress-dashboard"
                element={<ProgressDashboard />}
              />

              <Route path="/engage" element={<EngagementPage />} />
              <Route path="/insights" element={<UserInsightsPage />} />
              <Route path="/tasks" element={<TaskPage />} />
            </Routes>
          </div>
          <ChatbotButton
            isOpen={isChatOpen}
            onClick={() => setIsChatOpen(!isChatOpen)}
          />

          {/* Modal opens when button clicked */}
          {isChatOpen && (
            <ChatWindow
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
            />
          )}
        </div>
      </Router>
    </>
  );
}

export default App;
