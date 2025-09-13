import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { AvatarDropdown } from "./AvtarDropdown";
import { motion } from "framer-motion";
import {
  BarChart3,
  CheckSquare,
  ListTodo,
  LogIn,
  Menu,
  Target,
  UserPlus,
  X,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout?.();
    navigate("/");
    setShowConfirm(false);
  };

  return (
    <>
      {/* 🌱 Modern Navbar */}
      <nav className="sticky top-0 left-0 right-0 bg-green-600/70 backdrop-blur-lg text-white px-6 py-4 flex justify-between items-center shadow-lg z-50">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide flex items-center gap-2 hover:scale-105 transition-transform"
        >
          🌱 EcoGoals
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {!user ? (
            <>
              <Link
                to="/login"
                className="group relative flex items-center gap-1 hover:text-green-900 transition"
              >
                Login <LogIn size={16} />
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green-900 transition-all duration-300 group-hover:w-full"></span>
              </Link>

              {/* Register Link */}
              <Link
                to="/register"
                className="group relative flex items-center gap-1 hover:text-green-900 transition"
              >
                Register <UserPlus size={16} />
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green-900 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/habits"
                className="group relative flex items-center gap-1 hover:text-green-900 transition"
              >
                Set Habits <Target size={16} />
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green-900 transition-all duration-300 group-hover:w-full"></span>
              </Link>

              {/* Insights */}
              <Link
                to="/insights"
                className="group relative flex items-center gap-1 hover:text-green-900 transition"
              >
                Insights <BarChart3 size={16} />
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green-900 transition-all duration-300 group-hover:w-full"></span>
              </Link>

              {/* Progress Dashboard */}
              <Link
                to="/progress-dashboard"
                className="group relative flex items-center gap-1 hover:text-green-900 transition"
              >
                Progress <ListTodo size={16} />
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green-900 transition-all duration-300 group-hover:w-full"></span>
              </Link>

              {/* Tasks */}
              <Link
                to="/tasks"
                className="group relative flex items-center gap-1 hover:text-green-900 transition"
              >
                Add Tasks <CheckSquare size={16} />
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-green-900 transition-all duration-300 group-hover:w-full"></span>
              </Link>

              <AvatarDropdown />
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden relative"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* 📱 Mobile Dropdown */}
      {menuOpen && (
        <motion.div
          className="md:hidden bg-green-700/95 text-white absolute top-16 right-4 left-4 rounded-xl shadow-xl p-6 flex flex-col gap-6 z-40"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {!user ? (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/habits" onClick={() => setMenuOpen(false)}>
                Set Habits
              </Link>
              <Link to="/insights" onClick={() => setMenuOpen(false)}>
                Insights
              </Link>
              <Link to="/progress-dashboard" onClick={() => setMenuOpen(false)}>
                Progress
              </Link>
              <AvatarDropdown />
            </>
          )}
        </motion.div>
      )}

      {/* 🚪 Logout Confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-xl p-6 shadow-xl w-80 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <p className="mb-4 font-semibold text-gray-800">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-around mt-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
