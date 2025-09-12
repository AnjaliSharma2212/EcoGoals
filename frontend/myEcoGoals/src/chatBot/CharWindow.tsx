import React, { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { Send, X, Minimize2, Maximize2, Loader2, Sparkles } from "lucide-react";
import ChatMessage from "./ChatMessage";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const genAI = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
});

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
  const [, setUserName] = useState("User");
  const [userInitial, setUserInitial] = useState("U");
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const chatWindowRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [ecoPromptsState, setEcoPromptsState] = useState<string[]>([
    "How can I reduce my daily plastic usage?",
    "Suggest 5 eco-friendly habits for the office",
    "What are simple ways to save energy at home?",
    "How can I set ecoGoals for sustainable travel?",
  ]);

  // Fetch user data on open
  useEffect(() => {
    if (!isOpen) return;

    const fetchUserData = () => {
      const userDetails = JSON.parse(
        localStorage.getItem("userData") || '{"name": "Guest"}'
      );
      setUserName(userDetails.name || "User");
      setUserInitial((userDetails.name || "U").charAt(0).toUpperCase());
      setMessages([
        {
          text: `Hi ${
            userDetails.name || "User"
          }! 🌱 I'm your AI assistant for ecoGoals. How can I help you today?`,
          isBot: true,
        },
      ]);
    };
    fetchUserData();
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatWindowRef.current &&
        !chatWindowRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    try {
      const result = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: userMessage,
      });

      const reply = result.text || "⚡ Sorry, I couldn't process that.";
      setMessages((prev) => [...prev, { text: reply, isBot: true }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          text: "I encountered an error. Please try again later.",
          isBot: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const removePrompt = (promptToRemove: string) => {
    setEcoPromptsState((prev) => prev.filter((p) => p !== promptToRemove));
  };

  if (!isOpen) return null;

  return (
    <div
      ref={chatWindowRef}
      className={`fixed bottom-5 right-4 w-full max-w-sm md:max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200
      overflow-hidden transition-all duration-300 ease-in-out backdrop-blur-lg
      dark:bg-gray-900 dark:border-gray-700
      ${isMinimized ? "h-14" : "h-[520px]"}`}
      style={{ boxShadow: "0 4px 32px rgba(0, 0, 0, 0.1)" }}
    >
      {/* Header */}
      <div className="relative w-full bg-gradient-to-r from-green-500 to-lime-500 text-white p-3 md:p-4 flex items-center justify-between rounded-t-xl shadow-md">
        {/* Left: Icon + Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="truncate">
            <h3 className="font-semibold text-sm md:text-base truncate">
              Eco AI Assistant
            </h3>
            <p className="text-xs md:text-sm text-white/80 truncate">Welcome</p>
          </div>
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <>
          {/* Messages */}
          <div
            className="h-[calc(100%-12rem)] overflow-y-auto p-3 space-y-3 bg-green-50/50 dark:bg-gray-900"
            style={{ paddingTop: "4rem" }}
          >
            {messages.map((message, index) =>
              message.isBot ? (
                <ChatMessage key={index} message={message.text} isBot={true} />
              ) : (
                <div
                  key={index}
                  className="flex items-start gap-2 justify-end w-full"
                >
                  <div className="flex-1">
                    <ChatMessage message={message.text} isBot={false} />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-lime-500 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    {userInitial}
                  </div>
                </div>
              )
            )}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 p-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          <div className="p-2 flex flex-wrap gap-2 border-t border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-gray-800">
            {ecoPromptsState.map((prompt, i) => (
              <div
                key={i}
                className="flex items-center bg-gradient-to-r from-green-400 to-lime-400 text-white px-3 py-1 rounded-full text-xs"
              >
                <button
                  onClick={() => setInput(prompt)}
                  className="truncate max-w-[150px]"
                >
                  {prompt}
                </button>
                <button
                  onClick={() => removePrompt(prompt)}
                  className="ml-2 text-white hover:text-gray-200"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700"
          >
            <div className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="w-full pr-10 pl-3 py-2 rounded-xl border border-gray-200
                  focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500
                  resize-none text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500"
                rows={1}
                style={{ maxHeight: "100px" }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2
                  p-1.5 rounded-full bg-gradient-to-r from-green-500 to-lime-500
                  text-white transition-all duration-200
                  hover:shadow-lg hover:opacity-90
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatWindow;
