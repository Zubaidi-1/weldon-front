import { z } from "zod";
import { jordanGovernates } from "@/lib/options/jordanGovernates";

export const CheckoutSchema = z.object({
  orderEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),
  orderFirstName: z
    .string()
    .trim()
    .min(2, "First name must be at least two characters")
    .max(30, "First name must be 30 characters at max"),
  orderLastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least two characters")
    .max(30, "Last name must be 30 characters at max"),
  orderPhoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^\+[1-9]\d{7,14}$/, "Phone number must include country code"),
  orderGovernate: z.string().refine(
    (value) =>
      jordanGovernates.includes(value as (typeof jordanGovernates)[number]),
    "Please select a governate",
  ),
  orderAddress: z
    .string()
    .trim()
    .min(5, "Address must be at least five characters")
    .max(200, "Address must be 200 characters at max"),
});

export type CheckoutType = z.infer<typeof CheckoutSchema>;
