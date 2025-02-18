import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Masonry from "react-masonry-css";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "react-hot-toast";
import {
  Trash,
  FilePenLine,
  CircleUserRound,
  Plus,
  LogOut,
} from "lucide-react";

function Todos() {
  const API_URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/todo`;

  // Local state
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch todos from the backend
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, { withCredentials: true });
      setTodos(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load todos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/user/logout`,
        {},
        { withCredentials: true }
      );
      toast.success("Logged out successfully");
      window.location.href = "/";
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  // Create a new todo
  const handleAddTodo = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newTodo.trim()) {
        toast.error("Please enter a todo title");
        return;
      }
      try {
        const response = await axios.post(
          API_URL,
          { title: newTodo },
          { withCredentials: true }
        );
        toast.success("Todo added successfully");
        setTodos((prev) => [...prev, response.data]);
        setNewTodo("");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to add todo");
      }
    },
    [newTodo]
  );

  // Delete a todo
  const handleDeleteTodo = useCallback(async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
      toast.success("Todo deleted successfully");
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete todo");
    }
  }, []);

  // Start editing a todo
  const handleEditTodo = useCallback((todo) => {
    setEditingTodoId(todo._id);
    setEditingTitle(todo.title);
  }, []);

  // Update a todo
  const handleUpdateTodo = useCallback(
    async (id) => {
      if (!editingTitle.trim()) {
        toast.error("Title cannot be empty");
        return;
      }
      try {
        await axios.put(
          `${API_URL}/${id}`,
          { title: editingTitle },
          { withCredentials: true }
        );
        toast.success("Todo updated successfully");
        setTodos((prev) =>
          prev.map((todo) =>
            todo._id === id ? { ...todo, title: editingTitle } : todo
          )
        );
        setEditingTodoId(null);
        setEditingTitle("");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to update todo");
      }
    },
    [editingTitle]
  );

  // Toggle todo completion
  const toggleCompletion = useCallback(async (todo) => {
    try {
      await axios.put(
        `${API_URL}/${todo._id}`,
        { isCompleted: !todo.isCompleted },
        { withCredentials: true }
      );
      toast.success("Todo updated successfully");
      setTodos((prev) =>
        prev.map((t) =>
          t._id === todo._id ? { ...t, isCompleted: !t.isCompleted } : t
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update todo");
    }
  }, []);

  // Breakpoint settings for the masonry layout
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <div className="mx-auto mt-5 max-w-5xl px-4 w-full flex flex-col gap-6 relative">
      {/* User Icon with Logout Dropdown */}
      <div className="flex justify-self-start relative">
        <CircleUserRound
          size={32}
          className="cursor-pointer"
          onClick={() => setShowDropdown((prev) => !prev)}
        />
        {showDropdown && (
          <div className="absolute left-0 mt-10 bg-white shadow-md p-2 rounded">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 px-3 py-1"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}
      </div>

      <h1 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-bold text-4xl text-center mb-4 text-transparent bg-clip-text">
        Todo App
      </h1>

      {/* Add new todo form */}
      <form onSubmit={handleAddTodo} className="flex items-center gap-4">
        <Input
          type="text"
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          required
          className="shadow-md"
        />
        <Button type="submit" className="h-9 px-4 flex items-center">
          <Plus size={20} />
        </Button>
      </form>

      {/* Display todos or loading state */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        // Use the Masonry component to arrange items
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-4 w-full"
          columnClassName="masonry-grid_column"
        >
          {todos.map((todo) => (
            <div key={todo._id} className="mb-4">
              <div className="flex flex-col justify-between bg-white p-4 rounded shadow-md border">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={todo.isCompleted}
                    onChange={() => toggleCompletion(todo)}
                    disabled={editingTodoId === todo._id}
                  />
                  {editingTodoId === todo._id ? (
                    <Input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="border p-2 flex-1"
                    />
                  ) : (
                    <span
                      className={`flex-1 whitespace-normal break-words ${
                        todo.isCompleted ? "line-through text-stone-600" : ""
                      }`}
                    >
                      {todo.title}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  {editingTodoId === todo._id ? (
                    <Button
                      onClick={() => handleUpdateTodo(todo._id)}
                      className="px-2"
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleEditTodo(todo)}
                      className="px-2"
                      disabled={todo.isCompleted}
                    >
                      <FilePenLine size={18} />
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDeleteTodo(todo._id)}
                    className="px-2"
                  >
                    <Trash size={18} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Masonry>
      )}
    </div>
  );
}

export default Todos;
