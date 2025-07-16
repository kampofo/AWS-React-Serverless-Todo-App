import React, { useEffect, useState } from "react";
import api from "../api/axios";

type Task = {
  id: number;
  description: string;
  is_complete: boolean;
};

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedDescription, setEditedDescription] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  const addTask = async () => {
    try {
      await api.post("/tasks", { description: newTask });
      setNewTask("");
      fetchTasks();
    } catch (err) {
      console.error("Error adding task", err);
    }
  };

  const toggleTask = async (id: number, current: boolean) => {
    try {
      await api.put(`/tasks/${id}`, { is_complete: !current });
      fetchTasks();
    } catch (err) {
      console.error("Error updating task", err);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

      <div className="flex mb-4">
        <input
          className="border flex-grow p-2"
          placeholder="New task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white"
          onClick={addTask}
        >
          Add
        </button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center mb-2">
            <div className="flex items-center flex-grow">
              <input
                type="checkbox"
                checked={task.is_complete}
                onChange={() => toggleTask(task.id, task.is_complete)}
                className="mr-2"
              />

              {editingTaskId === task.id ? (
                <input
                  type="text"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="border p-1 flex-grow"
                />
              ) : (
                <span
                  className={`flex-grow ${
                    task.is_complete ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.description}
                </span>
              )}
            </div>

            {editingTaskId === task.id ? (
              <>
                <button
                  onClick={async () => {
                    try {
                      await api.put(`/tasks/${task.id}`, {
                        description: editedDescription,
                      });
                      setEditingTaskId(null);
                      fetchTasks();
                    } catch (err) {
                      console.error("Error editing task", err);
                    }
                  }}
                  className="ml-2 text-green-600 hover:underline"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingTaskId(null)}
                  className="ml-2 text-gray-500 hover:underline"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditingTaskId(task.id);
                    setEditedDescription(task.description);
                  }}
                  className="ml-2 text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="ml-2 text-red-500 hover:underline"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksPage;
