import { z } from "zod"

const imageDataUrlSchema = z
  .string()
  .trim()
  .regex(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "Photo must be a valid image data URL")

export const registerSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters")
    .max(80, "Display name must not exceed 80 characters"),
})

export const updateProfileSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(2, "Display name must be at least 2 characters")
      .max(80, "Display name must not exceed 80 characters")
      .optional(),
    phone: z
      .union([
        z
          .string()
          .trim()
          .min(7, "Phone number must be at least 7 digits")
          .max(20, "Phone number must not exceed 20 digits"),
        z.literal(null),
      ])
      .optional(),
    photoURL: z
      .union([z.string().trim().url("Photo URL must be a valid URL"), imageDataUrlSchema, z.literal(null)])
      .optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  })
