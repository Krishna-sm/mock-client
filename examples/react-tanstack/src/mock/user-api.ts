import { Get, Post, Delete } from "@krishtz/mock-client";
import { z } from "zod";
import { UserSchema, CreateUserSchema, UserParamsSchema } from "../schemas/user.schema";

export class UserApi {
  @Get({
    response: z.array(UserSchema),
    count: 5,
  })
  list() {}

  @Get({
    params: UserParamsSchema,
    response: UserSchema,
  })
  getById() {}

  @Post({
    body: CreateUserSchema,
    response: UserSchema,
  })
  create() {}

  @Delete({
    params: UserParamsSchema,
    response: z.object({
      success: z.boolean(),
      id: z.string().uuid(),
    }),
  })
  remove() {}
}
