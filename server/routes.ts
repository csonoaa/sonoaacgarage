import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCarValuationSchema } from "@shared/schema";
import { validateVIN, isValidEmail, isValidZipCode } from "../client/src/lib/utils";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { addDays } from "date-fns";

// Helper function to calculate car value
function calculateCarValue(data: any): number {
  // Base values for popular models (in USD)
  const baseValues: Record<string, number> = {
    // Toyota
    "camry": 18000,
    "corolla": 15000,
    "rav4": 20000,
    "tacoma": 25000,
    
    // Honda
    "accord": 17500,
    "civic": 14500,
    "cr-v": 19000,
    
    // Ford
    "f-150": 30000,
    "escape": 18000,
    "mustang": 26000,
    
    // Chevrolet
    "silverado": 28000,
    "malibu": 16000,
    "equinox": 17000,
    
    // Default for other models
    "default": 12000
  };

  // Get base value for the model or use default
  let baseValue = baseValues[data.model] || baseValues.default;
  
  // Year multipliers
  const yearNum = parseInt(data.year);
  let yearMultiplier = 0.2;
  if (yearNum >= 2020) yearMultiplier = 1.2;
  else if (yearNum >= 2018) yearMultiplier = 1.0;
  else if (yearNum >= 2015) yearMultiplier = 0.8;
  else if (yearNum >= 2012) yearMultiplier = 0.6;
  else if (yearNum >= 2010) yearMultiplier = 0.5;
  else if (yearNum >= 2005) yearMultiplier = 0.3;
  
  // Mileage multipliers
  const mileageNum = parseInt(data.mileage);
  let mileageMultiplier = 0.25;
  if (mileageNum <= 10000) mileageMultiplier = 1.2;
  else if (mileageNum <= 30000) mileageMultiplier = 1.1;
  else if (mileageNum <= 60000) mileageMultiplier = 1.0;
  else if (mileageNum <= 100000) mileageMultiplier = 0.8;
  else if (mileageNum <= 150000) mileageMultiplier = 0.6;
  else if (mileageNum <= 200000) mileageMultiplier = 0.4;
  
  // Condition multipliers
  let conditionMultiplier = 1.0;
  if (data.drivable === "no") {
    conditionMultiplier = 0.2;
  } else {
    switch (data.condition) {
      case "excellent": conditionMultiplier = 1.1; break;
      case "good": conditionMultiplier = 1.0; break;
      case "fair": conditionMultiplier = 0.8; break;
      case "poor": conditionMultiplier = 0.6; break;
    }
  }
  
  // Body type multipliers
  let bodyTypeMultiplier = 1.0;
  switch (data.bodyType) {
    case "suv": bodyTypeMultiplier = 1.1; break;
    case "truck": bodyTypeMultiplier = 1.15; break;
    case "sedan": bodyTypeMultiplier = 1.0; break;
    case "coupe": bodyTypeMultiplier = 1.05; break;
    case "convertible": bodyTypeMultiplier = 1.1; break;
    case "hatchback": bodyTypeMultiplier = 0.95; break;
    case "wagon": bodyTypeMultiplier = 0.9; break;
    case "van": bodyTypeMultiplier = 0.85; break;
  }
  
  // Calculate offer
  let offerAmount = baseValue * yearMultiplier * mileageMultiplier * conditionMultiplier * bodyTypeMultiplier;
  
  // Round to nearest hundred
  offerAmount = Math.round(offerAmount / 100) * 100;
  
  return offerAmount;
}

// Validation schema for car valuation request
const carValuationRequestSchema = z.object({
  // Car details
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(1, "Year is required"),
  trim: z.string().optional(),
  bodyType: z.string().min(1, "Body type is required"),
  mileage: z.string().min(1, "Mileage is required"),
  transmission: z.string().min(1, "Transmission is required"),
  drivetrain: z.string().min(1, "Drivetrain is required"),
  exteriorColor: z.string().min(1, "Color is required"),
  vin: z.string().optional().refine(val => !val || validateVIN(val), {
    message: "Invalid VIN format"
  }),
  
  // Condition
  drivable: z.string().min(1, "Drivable status is required"),
  condition: z.string().min(1, "Condition is required"),
  additionalInfo: z.string().optional(),
  
  // Contact info
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").refine(isValidEmail, {
    message: "Invalid email format"
  }),
  phone: z.string().min(10, "Phone number is required"),
  zipCode: z.string().min(1, "ZIP code is required").refine(isValidZipCode, {
    message: "Invalid ZIP code format"
  }),
  termsAgreed: z.boolean().refine(val => val === true, {
    message: "Terms must be agreed to"
  }),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Car valuation endpoint
  app.post("/api/car/valuation", async (req: Request, res: Response) => {
    try {
      // Validate request data
      const validatedData = carValuationRequestSchema.parse(req.body);
      
      // Calculate car value
      const offerAmount = calculateCarValue(validatedData);
      
      // Create valuation in storage
      const valuationData = insertCarValuationSchema.parse({
        make: validatedData.make,
        model: validatedData.model,
        year: validatedData.year,
        trim: validatedData.trim,
        bodyType: validatedData.bodyType,
        mileage: validatedData.mileage,
        transmission: validatedData.transmission,
        drivetrain: validatedData.drivetrain,
        exteriorColor: validatedData.exteriorColor,
        vin: validatedData.vin,
        drivable: validatedData.drivable,
        condition: validatedData.condition,
        additionalInfo: validatedData.additionalInfo,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        zipCode: validatedData.zipCode
      });
      
      const valuation = await storage.createValuation(valuationData, offerAmount);
      
      // Return the offer
      return res.status(201).json({
        success: true,
        valuation: {
          id: valuation.id,
          offerAmount: valuation.offerAmount,
          offerExpiry: valuation.offerExpiry,
        }
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationError.details
        });
      }
      
      console.error("Error creating valuation:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while processing car valuation"
      });
    }
  });

  // Accept car offer endpoint
  app.post("/api/car/accept-offer", async (req: Request, res: Response) => {
    try {
      const { carData, conditionData, contactData, offer } = req.body;
      
      if (!carData || !conditionData || !contactData || !offer) {
        return res.status(400).json({
          success: false,
          message: "Missing required data"
        });
      }
      
      // For demonstration, we'll create a new valuation and mark it as accepted
      const valuationData = insertCarValuationSchema.parse({
        make: carData.make,
        model: carData.model,
        year: carData.year,
        trim: carData.trim,
        bodyType: carData.bodyType,
        mileage: carData.mileage,
        transmission: carData.transmission,
        drivetrain: carData.drivetrain,
        exteriorColor: carData.exteriorColor,
        vin: carData.vin,
        drivable: conditionData.drivable,
        condition: conditionData.condition,
        additionalInfo: conditionData.additionalInfo,
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        email: contactData.email,
        phone: contactData.phone,
        zipCode: contactData.zipCode
      });
      
      const valuation = await storage.createValuation(valuationData, offer.offerAmount);
      
      // Mark as accepted
      await storage.acceptValuation(valuation.id);
      
      return res.status(200).json({
        success: true,
        message: "Offer accepted successfully",
        pickupScheduled: true
      });
    } catch (error) {
      console.error("Error accepting offer:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while processing acceptance"
      });
    }
  });

  // Email offer endpoint
  app.post("/api/car/email-offer", async (req: Request, res: Response) => {
    try {
      const { email, carData, conditionData, offer } = req.body;
      
      if (!email || !carData || !conditionData || !offer) {
        return res.status(400).json({
          success: false,
          message: "Missing required data"
        });
      }
      
      // In a real implementation, this would send an email
      // For now, we'll just return success
      
      return res.status(200).json({
        success: true,
        message: "Offer details sent to email successfully"
      });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while sending email"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
