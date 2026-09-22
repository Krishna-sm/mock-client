import { useState, useEffect, useCallback } from "react";
import { mockApi } from "../mock";
import type { Todo, TodoStatus } from "../types";

export type TodoFilter = "all" | "active" | "completed";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TodoFilter>("all");

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockApi.todos.$get<Todo[]>();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load todos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = useCallback(async (title: string): Promise<Todo | undefined> => {
    try {
      const newTodo = await mockApi.todos.$post<Todo>({
        json: { title: title.trim() },
      });
      setTodos((prev) => [newTodo, ...prev]);
      return newTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add todo");
      return undefined;
    }
  }, []);

  const toggleTodo = useCallback(
    async (id: string): Promise<void> => {
      const target = todos.find((t) => t.id === id);
      if (!target) return;

      const nextCompleted = !target.completed;
      const nextStatus: TodoStatus = nextCompleted ? "done" : "todo";

      // Optimistic update
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: nextCompleted, status: nextStatus } : t))
      );

      try {
        await mockApi.todos.$patch<Todo>({
          params: { id },
          json: {
            completed: nextCompleted,
            status: nextStatus,
          },
        });
      } catch (err) {
        // Revert optimistic update on failure
        setTodos((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, completed: target.completed, status: target.status } : t
          )
        );
        setError(err instanceof Error ? err.message : "Failed to update todo");
      }
    },
    [todos]
  );

  const deleteTodo = useCallback(
    async (id: string): Promise<void> => {
      const previous = todos;
      setTodos((prev) => prev.filter((t) => t.id !== id));

      try {
        await mockApi.todos.$delete({
          params: { id },
        });
      } catch (err) {
        setTodos(previous);
        setError(err instanceof Error ? err.message : "Failed to delete todo");
      }
    },
    [todos]
  );

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  return {
    todos: filteredTodos,
    allTodos: todos,
    loading,
    error,
    filter,
    setFilter,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    refresh: fetchTodos,
  };
}
