import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { CreateTodoSchema } from "../schemas/todo.schema";
import type { CreateTodoInput } from "../types";

interface CreateTodoFormProps {
  readonly onAdd: (title: string) => Promise<unknown>;
}

export function CreateTodoForm({ onAdd }: CreateTodoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTodoInput>({
    resolver: zodResolver(CreateTodoSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (data: CreateTodoInput) => {
    await onAdd(data.title);
    reset({ title: "" });
  };

  return (
    <form className="create-form" onSubmit={handleSubmit(onSubmit)} aria-label="Create todo form">
      <div className="input-group">
        <input
          type="text"
          className={`input-field ${errors.title ? "input-error" : ""}`}
          placeholder="Add a new task (e.g. Write test cases)..."
          {...register("title")}
          disabled={isSubmitting}
          aria-label="New todo title"
        />
        {errors.title?.message && (
          <span className="field-error" role="alert">
            {errors.title.message}
          </span>
        )}
      </div>

      <button type="submit" className="btn-primary" disabled={isSubmitting} aria-label="Add task">
        <Plus size={16} />
        <span>Add</span>
      </button>
    </form>
  );
}
