import { email, z } from "zod";

export const RegisterSchema = z
  .object({
    email: z.email("Invalid email address"),

    name: z
      .string()
      .min(3, "Name must be at least three characters")
      .max(40, "Name must be 40 characters at max"),

    phoneNumber: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .regex(/^\+[1-9]\d{7,14}$/, "Phone number must include country code"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(24, "Password must be at most 24 characters")
      .refine((val) => /[a-z]/.test(val), {
        message: "Must contain at least one lowercase letter",
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Must contain at least one uppercase letter",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Must contain at least one number",
      })
      .refine((val) => /[^A-Za-z0-9]/.test(val), {
        message: "Must contain at least one special character",
      }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const SignInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(24, "Password must be at most 24 characters")
    .refine((val) => /[a-z]/.test(val), {
      message: "Must contain at least one lowercase letter",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Must contain at least one uppercase letter",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Must contain at least one number",
    })
    .refine((val) => /[^A-Za-z0-9]/.test(val), {
      message: "Must contain at least one special character",
    }),
});

// inferred type
export type RegisterType = z.infer<typeof RegisterSchema>;
export type SigninType = z.infer<typeof SignInSchema>;
