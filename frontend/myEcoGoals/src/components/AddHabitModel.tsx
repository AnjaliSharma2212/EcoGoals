import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react"; // ✅ lightweight icon (or replace with your own)

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habit: { name: string; description: string }) => void;
}

const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return;

    // ✅ Play cheer sound with error handling
    const audio = new Audio("https://www.soundjay.com/human/hurrah-01.mp3");
    audio.play().catch((err) => console.warn("Audio playback failed:", err));

    // ✅ Trigger fireworks (confetti event)
    const event = new Event("fireworks");
    window.dispatchEvent(event);

    onAdd({ name, description });
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 md:p-10"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* ❌ Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Header */}
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-green-700">
              🎯 Add New Habit
            </h2>

            {/* Input Fields */}
            <div className="space-y-4">
              <input
                className="w-full border rounded-lg px-3 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-green-400 focus:outline-none"
                placeholder="Habit name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <textarea
                className="w-full border rounded-lg px-3 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-green-400 focus:outline-none resize-none"
                placeholder="Description (optional)"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition shadow-md"
              >
                Add Habit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddHabitModal;
