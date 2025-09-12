import React from "react";
import ReactMarkdown from "react-markdown";
import { Bot } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot }) => {
  return (
    <div
      className={`rounded-xl p-3 ${
        isBot
          ? "bg-green-700/90 text-white shadow-sm"
          : "bg-gradient-to-r from-green-100 to-lime-100 text-gray-800"
      }`}
    >
      {isBot && (
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-lime-500 text-white flex items-center justify-center flex-shrink-0">
            <Bot size={14} />
          </div>
        </div>
      )}
      <div className={`overflow-hidden text-sm ${isBot ? "ml-8" : ""}`}>
        <ReactMarkdown>{message}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ChatMessage;
