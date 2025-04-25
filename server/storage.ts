import { users, type User, type InsertUser } from "@shared/schema";
import { carValuations, type CarValuation, type InsertCarValuation } from "@shared/schema";
import { addDays } from "date-fns";
import { db } from "../db";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Car valuation methods
  getValuation(id: number): Promise<CarValuation | undefined>;
  getValuationsByEmail(email: string): Promise<CarValuation[]>;
  createValuation(data: InsertCarValuation, offerAmount: number): Promise<CarValuation>;
  acceptValuation(id: number): Promise<CarValuation | undefined>;
}

export class SQLiteStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(users.id.equals(id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(users.username.equals(username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Car valuation methods
  async getValuation(id: number): Promise<CarValuation | undefined> {
    const result = await db.select().from(carValuations).where(carValuations.id.equals(id)).limit(1);
    return result[0];
  }

  async getValuationsByEmail(email: string): Promise<CarValuation[]> {
    return await db.select().from(carValuations).where(carValuations.email.equals(email));
  }

  async createValuation(data: InsertCarValuation, offerAmount: number): Promise<CarValuation> {
    const offerExpiry = new Date();
    offerExpiry.setDate(offerExpiry.getDate() + 7);

    const result = await db.insert(carValuations).values({
      ...data,
      offerAmount,
      offerExpiry: offerExpiry.toISOString(),
    }).returning();

    return result[0];
  }

  async acceptValuation(id: number): Promise<CarValuation | undefined> {
    const valuation = await this.getValuation(id);
    
    if (!valuation) {
      return undefined;
    }
    
    // Check if offer is expired
    if (new Date(valuation.offerExpiry) < new Date()) {
      throw new Error("Offer has expired");
    }
    
    // Accept the offer
    const result = await db.update(carValuations)
      .set({ 
        accepted: true,
        updatedAt: new Date().toISOString()
      })
      .where(carValuations.id.equals(id))
      .returning();
    
    return result[0];
  }
}

export const storage = new SQLiteStorage();
