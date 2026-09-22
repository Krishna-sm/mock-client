import { TodoItem } from "./TodoItem";
import type { Todo } from "../types";
import type { TodoFilter } from "../hooks/useTodos";
import { Loader2 } from "lucide-react";

interface TodoListProps {
  readonly todos: readonly Todo[];
  readonly loading: boolean;
  readonly filter: TodoFilter;
  readonly onFilterChange: (filter: TodoFilter) => void;
  readonly onToggle: (id: string) => Promise<void>;
  readonly onDelete: (id: string) => Promise<void>;
  readonly stats: {
    readonly total: number;
    readonly active: number;
    readonly completed: number;
  };
}

export function TodoList({
  todos,
  loading,
  filter,
  onFilterChange,
  onToggle,
  onDelete,
  stats,
}: TodoListProps) {
  return (
    <div className="todo-list-wrapper">
      <div className="tabs-bar">
        <button
          type="button"
          className={`tab-item ${filter === "all" ? "active" : ""}`}
          onClick={() => onFilterChange("all")}
        >
          All ({stats.total})
        </button>
        <button
          type="button"
          className={`tab-item ${filter === "active" ? "active" : ""}`}
          onClick={() => onFilterChange("active")}
        >
          Active ({stats.active})
        </button>
        <button
          type="button"
          className={`tab-item ${filter === "completed" ? "active" : ""}`}
          onClick={() => onFilterChange("completed")}
        >
          Completed ({stats.completed})
        </button>
      </div>

      {loading ? (
        <div className="state-message" role="status">
          <Loader2 size={18} className="spin-icon" />
          <span>Generating mock data from Zod schema...</span>
        </div>
      ) : todos.length === 0 ? (
        <div className="state-empty">
          <p>No tasks in this view.</p>
        </div>
      ) : (
        <div className="items-list" role="list">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
