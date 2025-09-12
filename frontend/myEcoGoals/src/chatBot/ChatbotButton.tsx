import React from "react";
import { MessageSquare, X } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface ChatbotButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const ChatbotButton: React.FC<ChatbotButtonProps> = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "fixed bottom-4 right-4 w-12 h-12 rounded-full shadow-lg",
        "flex items-center justify-center transition-all duration-300",
        "hover:scale-110 active:scale-95",
        isOpen
          ? "bg-gray-700 hover:bg-gray-800"
          : "bg-gradient-to-r from-green-500 to-lime-500 hover:opacity-90"
      )}
    >
      {isOpen ? (
        <X className="w-5 h-5 text-white" />
      ) : (
        <MessageSquare className="w-5 h-5 text-white" />
      )}
    </button>
  );
};

export default ChatbotButton;
