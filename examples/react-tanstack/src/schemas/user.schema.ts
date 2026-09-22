import { z } from "zod";

export const RoleSchema = z.enum(["admin", "member", "viewer"]);

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  role: RoleSchema,
  createdAt: z.date(),
});

export const CreateUserSchema = z.object({
  name: z.string().min(1, "Name must have at least 1 character"),
  email: z.string().email("Must be a valid email address"),
  role: RoleSchema,
});

export const UserParamsSchema = z.object({
  id: z.string().uuid(),
});
