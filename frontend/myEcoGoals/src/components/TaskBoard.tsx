import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import type { Task } from "../types";

interface TaskBoardProps {
  status: Task["status"];
  tasks: Task[];
  deleteTask: (id: string) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ status, tasks, deleteTask }) => {
  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-white p-4 rounded-md shadow-md min-h-[400px]"
        >
          <h2 className="text-xl font-semibold mb-2 capitalize">{status}</h2>
          {tasks.map((task, index) => (
            <TaskCard
              key={task._id}
              task={task}
              index={index}
              deleteTask={deleteTask}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default TaskBoard;
