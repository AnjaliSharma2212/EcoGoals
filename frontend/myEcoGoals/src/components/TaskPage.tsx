import React, { useEffect, useState } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import TaskBoard from "./TaskBoard";
import AddTaskForm from "./AddTaskForm";
import type { Task } from "../types";
import * as api from "../services/api";

const statuses: Task["status"][] = ["todo", "inprogress", "done"];

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      const data = await api.fetchTasks();
      if (Array.isArray(data)) setTasks(data);
      else setTasks([]);
    } catch (err) {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = (task: Task) => setTasks([...tasks, task]);
  const removeTask = (id: string) =>
    setTasks(tasks.filter((t) => t._id !== id));

  const updateTaskStatus = async (
    taskId: string,
    status: Task["status"],
    order?: number
  ) => {
    try {
      await api.updateTask(taskId, { status, order });
      loadTasks();
    } catch (err) {}
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceStatus = result.source.droppableId as Task["status"];
    const destStatus = result.destination.droppableId as Task["status"];
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    const sourceTasks = tasks.filter((t) => t.status === sourceStatus);
    const [movedTask] = sourceTasks.splice(sourceIndex, 1);

    movedTask.status = destStatus;
    movedTask.order = destIndex;

    setTasks([...tasks.filter((t) => t._id !== movedTask._id), movedTask]);
    updateTaskStatus(movedTask._id, destStatus, destIndex);
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-xl font-semibold text-gray-500">
        Loading tasks...
      </p>
    );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 via-green-100 to-green-50">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-green-900 drop-shadow-md">
        🌿 My Eco Tasks
      </h1>

      <div className="max-w-5xl mx-auto">
        <AddTaskForm addTask={addTask} />

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {statuses.map((status) => (
              <TaskBoard
                key={status}
                status={status}
                tasks={tasks
                  .filter((t) => t.status === status)
                  .sort((a, b) => a.order - b.order)}
                deleteTask={removeTask}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default TaskPage;
