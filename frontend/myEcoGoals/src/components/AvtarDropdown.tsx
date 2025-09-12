import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

export const AvatarDropdown = () => {
  const { user, logout } = useContext(AuthContext)!; // get user + logout from context
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout?.();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  // Fallbacks
  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "?";
  const cartoonAvatar = user?.email
    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
    : "";

  return (
    <div className="relative">
      {/* Avatar button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold overflow-hidden"
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        ) : cartoonAvatar ? (
          <img
            src={cartoonAvatar}
            alt="cartoon avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-lg">{firstLetter}</span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 backdrop-blur-md">
          <button
            onClick={() => {
              setOpen(false);
              navigate("/profile");
            }}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Profile
          </button>
          <button
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
