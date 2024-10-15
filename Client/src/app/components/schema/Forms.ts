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
  confirmPassword: z.string().min(6, { message: "Coconfirm Password is required" }).default(""),
});

export const newPasswordSchema = z.object({
  password: z.string().min(6, { message: "Password is required" }).default(""),
  confirmPassword: z.string().min(6, { message: "Coconfirm Password is required" }).default(""),
});

export const profileSchema = z.object({
  firstname: z.string().min(2, { message: "Firstname is required" }).default(""),
  lastname: z.string().min(2, { message: "Lastname is required" }).default(""),
  email: z.string().optional(),
});

export const notificationsSchema = z.object({
  updates: z
    .object({
      push: z.boolean().optional(),
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
    })
    .optional(),
  reminders: z
    .object({
      push: z.boolean().optional(),
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
    })
    .optional(),
  others: z
    .object({
      push: z.boolean().optional(),
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
    })
    .optional(),
});

export const formSchemaPayment = z.object({
  bankName: z.string().min(2, { message: "Bank Name is required" }).default(""),
  accountName: z.string().min(2, { message: "Account Name is required" }).default(""),
  accountNumber: z.string().min(2, { message: "Account Number is required" }).default(""),
});

export const formSchemaPassword = z.object({
  currentPassword: z.string().min(2, { message: "Current password is required" }).default(""),
  password: z.string().min(2, { message: "New password is required" }).default(""),
  confirmPassword: z.string().min(2, { message: "Confirm password is required" }).default(""),
});

export const requestPayoutSchema = z.object({
  amount: z.string().min(2, "Amount field is required."),
  beneficiary: z.string().min(2, "Beneficiary field is required."),
});

export const formSchemaSupport = z.object({
  category: z.string().min(1, "Category field is required.").default(""),
  subject: z.string().min(1, "Subject field is required.").default(""),
  description: z.string().min(4, "Description field is required.").default(""),
  email: z.string().min(4, "Email field is required.").default(""),
  status: z.string().default("Open").optional(),
});

export const signalSchema = z.object({
  currency: z.string().min(2, { message: "Currency is required" }),
  price: z.string().min(2, { message: "Price is required" }),
  stopLoss: z.string().min(2, { message: "Stop Loss is required" }),
  profit1: z.string().optional(),
  profit2: z.string().optional(),
  profit3: z.string().optional(),
  duration: z.string().optional(),
  info: z.string().optional(),
});

export const userSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  password: z.string().min(4, { message: "Password is required" }).default(""),
  firstname: z.string().min(2, { message: "Firstname is required" }).default(""),
  lastname: z.string().min(2, { message: "Lastname is required" }).default(""),
  phone: z.string().min(2, { message: "Phone is required" }).default(""),
  role: z.string().min(2, { message: "Role is required" }).default("User"),
  country: z.string().optional(),
  dob: z.date().optional(),
});

export const investmentSchema = z.object({
  product: z.string().min(4, { message: "Product is required" }).default(""),
  geo_location: z.string().min(2, { message: "Geo_location is required" }).default(""),
  minimum_invest: z.string().min(2, { message: "Minimum_invest is required" }).default(""),
  info: z.string().min(2, { message: "Info is required" }).default(""),
  roi: z.string().min(1, { message: "Roi is required" }).default(""),
  gain: z.string().min(1, { message: "Gain is required" }).default(""),
  duration: z.string().min(1, { message: "Duration is required" }).default(""),
  isActive: z.string().optional(),
});
