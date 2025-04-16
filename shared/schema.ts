import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping the original schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Car valuation schema
export const carValuations = pgTable("car_valuations", {
  id: serial("id").primaryKey(),
  // Car details
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: text("year").notNull(),
  trim: text("trim"),
  bodyType: text("body_type").notNull(),
  mileage: text("mileage").notNull(),
  transmission: text("transmission").notNull(),
  drivetrain: text("drivetrain").notNull(),
  exteriorColor: text("exterior_color").notNull(),
  vin: text("vin"),
  
  // Condition
  drivable: text("drivable").notNull(),
  condition: text("condition").notNull(),
  additionalInfo: text("additional_info"),
  
  // Contact info
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  zipCode: text("zip_code").notNull(),
  
  // Offer details
  offerAmount: integer("offer_amount").notNull(),
  offerExpiry: timestamp("offer_expiry").notNull(),
  accepted: boolean("accepted").default(false),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCarValuationSchema = createInsertSchema(carValuations).omit({
  id: true,
  offerAmount: true,
  offerExpiry: true,
  accepted: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCarValuation = z.infer<typeof insertCarValuationSchema>;
export type CarValuation = typeof carValuations.$inferSelect;
