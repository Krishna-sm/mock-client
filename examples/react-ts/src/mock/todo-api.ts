import { Get, Post, Patch, Delete } from "@krishtz/mock-client";
import { z } from "zod";
import {
  TodoSchema,
  CreateTodoSchema,
  UpdateTodoSchema,
  TodoParamsSchema,
} from "../schemas/todo.schema";

export class TodoApi {
  @Get({
    response: z.array(TodoSchema),
    count: 4,
  })
  list() {}

  @Get({
    params: TodoParamsSchema,
    response: TodoSchema,
  })
  getById() {}

  @Post({
    body: CreateTodoSchema,
    response: TodoSchema,
  })
  create() {}

  @Patch({
    params: TodoParamsSchema,
    body: UpdateTodoSchema,
    response: TodoSchema,
  })
  update() {}

  @Delete({
    params: TodoParamsSchema,
    response: z.object({
      success: z.boolean(),
      id: z.string().uuid(),
    }),
  })
  remove() {}
}
