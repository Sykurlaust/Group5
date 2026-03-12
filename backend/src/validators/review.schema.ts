import { z } from "zod"

export const createReviewSchema = z.object({
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(100, "Title must not exceed 100 characters"),
  comment: z.string().trim().min(10, "Comment must be at least 10 characters").max(1000, "Comment must not exceed 1000 characters"),
})

export const updateReviewSchema = z
  .object({
    rating: z.number().int().min(1).max(5).optional(),
    title: z.string().trim().min(3).max(100).optional(),
    comment: z.string().trim().min(10).max(1000).optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one field must be provided",
  })
