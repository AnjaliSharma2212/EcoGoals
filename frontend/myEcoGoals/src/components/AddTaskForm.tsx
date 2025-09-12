import React, { useState } from "react";
import type { Task } from "../types";
import * as api from "../services/api";

interface AddTaskFormProps {
  addTask: (task: Task) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ addTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = async () => {
    if (!title) return;

    try {
      const task = await api.createTask({ title, description });
      addTask(task);
      setTitle("");
      setDescription("");
    } catch (err) {}
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 justify-center">
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-2 border rounded-md flex-1"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="p-2 border rounded-md flex-1"
      />
      <button
        onClick={handleAdd}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
      >
        Add Task
      </button>
    </div>
  );
};

export default AddTaskForm;
