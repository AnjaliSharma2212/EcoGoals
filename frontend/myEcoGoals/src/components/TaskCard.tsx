import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "../types";
import * as api from "../services/api";
import { Pencil, X, Check } from "lucide-react"; // Icons for edit, cancel, save

interface TaskCardProps {
  task: Task;
  index: number;
  deleteTask: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, deleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");

  const handleDelete = async () => {
    try {
      await api.deleteTask(task._id);
      deleteTask(task._id);
    } catch (err) {}
  };

  const handleSave = async () => {
    try {
      await api.updateTask(task._id, { title, description });
      setIsEditing(false);
    } catch (err) {}
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 rounded-lg shadow-md mb-3 flex flex-col gap-2 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex justify-between items-start">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border rounded-md p-1 w-full text-lg font-semibold"
              />
            ) : (
              <p className="text-lg font-semibold">{task.title}</p>
            )}

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="text-green-500 hover:text-green-700"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setTitle(task.title);
                      setDescription(task.description || "");
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>

          {isEditing ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded-md p-1 w-full text-sm mt-1"
            />
          ) : (
            task.description && (
              <p className="text-sm text-gray-600">{task.description}</p>
            )
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
