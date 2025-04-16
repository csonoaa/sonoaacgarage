import { users, type User, type InsertUser } from "@shared/schema";
import { carValuations, type CarValuation, type InsertCarValuation } from "@shared/schema";
import { addDays } from "date-fns";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private valuations: Map<number, CarValuation>;
  private userIdCounter: number;
  private valuationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.valuations = new Map();
    this.userIdCounter = 1;
    this.valuationIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Car valuation methods
  async getValuation(id: number): Promise<CarValuation | undefined> {
    return this.valuations.get(id);
  }

  async getValuationsByEmail(email: string): Promise<CarValuation[]> {
    return Array.from(this.valuations.values()).filter(
      (valuation) => valuation.email === email
    );
  }

  async createValuation(
    data: InsertCarValuation, 
    offerAmount: number
  ): Promise<CarValuation> {
    const id = this.valuationIdCounter++;
    const now = new Date();
    const offerExpiry = addDays(now, 7); // Offer valid for 7 days
    
    const valuation: CarValuation = {
      ...data,
      id,
      offerAmount,
      offerExpiry,
      accepted: false,
      createdAt: now,
      updatedAt: now,
    };
    
    this.valuations.set(id, valuation);
    return valuation;
  }

  async acceptValuation(id: number): Promise<CarValuation | undefined> {
    const valuation = this.valuations.get(id);
    
    if (!valuation) {
      return undefined;
    }
    
    // Check if offer is expired
    if (valuation.offerExpiry < new Date()) {
      throw new Error("Offer has expired");
    }
    
    // Accept the offer
    const updatedValuation: CarValuation = {
      ...valuation,
      accepted: true,
      updatedAt: new Date(),
    };
    
    this.valuations.set(id, updatedValuation);
    return updatedValuation;
  }
}

export const storage = new MemStorage();
