import { z } from "zod";

export const TodoStatusSchema = z.enum(["todo", "in_progress", "done"]);

export const TodoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title cannot be empty"),
  completed: z.boolean(),
  status: TodoStatusSchema,
  createdAt: z.date(),
});

export const CreateTodoSchema = z.object({
  title: z.string().min(1, "Title must have at least 1 character"),
});

export const UpdateTodoSchema = z.object({
  completed: z.boolean().optional(),
  status: TodoStatusSchema.optional(),
});

export const TodoParamsSchema = z.object({
  id: z.string().uuid(),
});
