import { z } from "zod"

export const renterApplicationSchema = z.object({
  applicantDisplayName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must not exceed 80 characters"),
  applicantPhone: z
    .string()
    .trim()
    .min(7, "Phone number must be at least 7 digits")
    .max(20, "Phone number must not exceed 20 digits"),
  currentCity: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(80, "City must not exceed 80 characters"),
  monthlyIncome: z
    .number({ invalid_type_error: "Monthly income must be a number" })
    .positive("Monthly income must be greater than 0")
    .max(1_000_000, "Monthly income is too high"),
  preferredMoveInDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Preferred move-in date must be in YYYY-MM-DD format"),
  motivation: z
    .string()
    .trim()
    .min(20, "Motivation must be at least 20 characters")
    .max(2000, "Motivation must not exceed 2000 characters"),
})
