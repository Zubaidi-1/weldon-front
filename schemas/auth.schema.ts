import { z } from "zod";

const PasswordSchema = z
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
  });

export const RegisterSchema = z
  .object({
    email: z.email("Invalid email address"),

    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least two characters")
      .max(30, "First name must be 30 characters at max"),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least two characters")
      .max(30, "Last name must be 30 characters at max"),

    phoneNumber: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .regex(/^\+[1-9]\d{7,14}$/, "Phone number must include country code"),

    password: PasswordSchema,

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const SignInSchema = z.object({
  email: z.email("Invalid email address"),
  password: PasswordSchema,
});

export const ForgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

export const ResetPasswordSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// inferred type
export type RegisterType = z.infer<typeof RegisterSchema>;
export type SigninType = z.infer<typeof SignInSchema>;
export type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;
