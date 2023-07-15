import * as z from "zod"

export const todoSchema = z.object({
  title: z.string().min(1).max(255),
})

export const addTodoSchema = todoSchema.extend({
  is_completed: z.boolean().default(false).optional(),
})
