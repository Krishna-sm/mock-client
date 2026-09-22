import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { CreateUserSchema } from "../../../schemas/user.schema";
import type { CreateUserInput } from "../../../types";

interface UserFormProps {
  readonly onAdd: (data: CreateUserInput) => Promise<unknown>;
  readonly isPending: boolean;
}

export function UserForm({ onAdd, isPending }: UserFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "member",
    },
  });

  const onSubmit = async (data: CreateUserInput) => {
    await onAdd(data);
    reset();
  };

  return (
    <form className="form-box" onSubmit={handleSubmit(onSubmit)} aria-label="Create user form">
      <div className="form-grid">
        <div className="input-group">
          <input
            type="text"
            className={`input-field ${errors.name ? "input-error" : ""}`}
            placeholder="Name (e.g. Alice)"
            {...register("name")}
            disabled={isPending}
            aria-label="User name"
          />
          {errors.name?.message && <span className="field-error">{errors.name.message}</span>}
        </div>

        <div className="input-group">
          <input
            type="email"
            className={`input-field ${errors.email ? "input-error" : ""}`}
            placeholder="Email (e.g. alice@example.com)"
            {...register("email")}
            disabled={isPending}
            aria-label="User email"
          />
          {errors.email?.message && <span className="field-error">{errors.email.message}</span>}
        </div>

        <div className="input-group">
          <select
            className="input-field select-field"
            {...register("role")}
            disabled={isPending}
            aria-label="User role"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <button type="submit" className="btn-primary" disabled={isPending} aria-label="Create user">
          <Plus size={16} />
          <span>{isPending ? "Creating..." : "Add User"}</span>
        </button>
      </div>
    </form>
  );
}
