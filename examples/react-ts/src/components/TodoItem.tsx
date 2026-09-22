import { Check, Trash2 } from "lucide-react";
import type { Todo } from "../types";

interface TodoItemProps {
  readonly todo: Todo;
  readonly onToggle: (id: string) => Promise<void>;
  readonly onDelete: (id: string) => Promise<void>;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div
      className={`todo-row ${todo.completed ? "is-completed" : ""}`}
      data-testid={`todo-${todo.id}`}
    >
      <div className="todo-main">
        <button
          type="button"
          className={`checkbox-box ${todo.completed ? "is-checked" : ""}`}
          onClick={() => onToggle(todo.id)}
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {todo.completed && <Check size={12} strokeWidth={3} />}
        </button>

        <div className="todo-details">
          <span className="todo-text">{todo.title}</span>
          <div className="todo-meta-row">
            <span className="status-tag">{todo.status}</span>
            <span className="id-tag">{todo.id.slice(0, 8)}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="btn-delete"
        onClick={() => onDelete(todo.id)}
        aria-label="Delete todo"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
