import { z } from "zod";

// AUTH
export const loginSchema = z.object({
  email: z.string().email({ message: "Email is required" }).default(""),
  password: z.string().min(1, { message: "Password is required" }).default(""),
});

export const signupSchema = z.object({
  username: z.string().min(4, { message: "Username is required" }).default(""),
  email: z.string().email({ message: "Email is required" }).default(""),
  password: z.string().min(6, { message: "Password is required" }).default(""),
  confirmPassword: z
    .string()
    .min(6, { message: "Coconfirm Password is required" })
    .default(""),
});

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Email is required" }).default(""),
});

export const newPasswordSchema = z.object({
  password: z.string().min(6, { message: "Password is required" }).default(""),
  confirmPassword: z
    .string()
    .min(6, { message: "Coconfirm Password is required" })
    .default(""),
});

export const formSchemaContact = z.object({
  first_name: z.string().default(""),
  last_name: z.string().default(""),
  company_name: z.string().default(""),
  email: z.string().email("Invalid email address").default(""),
  phone: z.string().default(""),
});

//DASHBOARD
export const createCourseSchema = z.object({
  category: z.string().min(2, { message: "Category is required" }).default(""),
  title: z.string().min(2, { message: "Title is required" }).default(""),
  description: z
    .string()
    .min(5, { message: "Description is required" })
    .default(""),
  difficulty: z
    .string()
    .min(2, { message: "Difficulty is required" })
    .default(""),
  price: z.string().min(1, { message: "Price is required" }).default(""),
  requirements: z.string().optional(),
  curriculum: z.string().optional(),
  lessons: z.string().optional(),
  isPublic: z.boolean().optional(),
  authorName: z.string().default("").optional(),
  authorTitle: z.string().default("Forex trader"),
});

export const uploadVideoSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }).default(""),
  category: z.string().min(2, { message: "Category is required" }).default(""),
  description: z
    .string()
    .min(5, { message: "Description is required" })
    .default(""),
  rating: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, { message: "Category name required" }).default(""),
});

export const checkoutSchema = z.object({
  country: z.string().default("NG").optional(),
  payment: z.string().default("Paystack").optional(),
});

export const profileSchema = z.object({
  firstname: z
    .string()
    .min(2, { message: "Firstname is required" })
    .default(""),
  lastname: z.string().min(2, { message: "Lastname is required" }).default(""),
  email: z.string().min(2, { message: "Email is required" }).default(""),
  avatar: z.string().default("").optional(),
});
