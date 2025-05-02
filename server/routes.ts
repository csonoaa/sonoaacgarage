import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCarValuationSchema } from "@shared/schema";
import { validateVIN, isValidEmail, isValidZipCode } from "../client/src/lib/utils";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { addDays } from "date-fns";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";

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

// Security middleware
const securityMiddleware = (app: Express) => {
  app.use(helmet());
  app.use(cors({
    origin: process.env.CORS_ORIGIN || "https://carmarketvaluator.com",
    credentials: true
  }));
};

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later"
});

// Validation schema for car valuation request
const carValuationRequestSchema = z.object({
  // Car details
  make: z.string().min(1, "Make is required").max(50),
  model: z.string().min(1, "Model is required").max(50),
  year: z.string().min(1, "Year is required").refine(val => {
    const year = parseInt(val);
    return year >= 1900 && year <= new Date().getFullYear();
  }, {
    message: "Invalid year"
  }),
  trim: z.string().max(50).optional(),
  bodyType: z.string().min(1, "Body type is required").max(20),
  mileage: z.string().min(1, "Mileage is required").refine(val => {
    const mileage = parseInt(val);
    return mileage >= 0 && mileage <= 1000000;
  }, {
    message: "Invalid mileage"
  }),
  transmission: z.string().min(1, "Transmission is required").max(20),
  drivetrain: z.string().min(1, "Drivetrain is required").max(20),
  exteriorColor: z.string().min(1, "Color is required").max(30),
  vin: z.string().optional().refine(val => !val || validateVIN(val), {
    message: "Invalid VIN format"
  }),
  
  // Condition
  drivable: z.string().min(1, "Drivable status is required").max(3),
  condition: z.string().min(1, "Condition is required").max(20),
  additionalInfo: z.string().max(1000).optional(),
  
  // Contact info
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().min(1, "Email is required").max(100).refine(isValidEmail, {
    message: "Invalid email format"
  }),
  phone: z.string().min(10, "Phone number is required").max(20),
  zipCode: z.string().min(1, "ZIP code is required").max(10).refine(isValidZipCode, {
    message: "Invalid ZIP code format"
  }),
  termsAgreed: z.boolean().refine(val => val === true, {
    message: "Terms must be agreed to"
  }),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply security middleware
  securityMiddleware(app);

  // Car valuation endpoint
  app.post("/api/car/valuation", apiLimiter, async (req: Request, res: Response) => {
    try {
      console.log("Received valuation request:", req.body);
      
      // Validate request data
      const validatedData = carValuationRequestSchema.parse(req.body);
      console.log("Validated data:", validatedData);
      
      // Calculate car value
      const offerAmount = calculateCarValue(validatedData);
      console.log("Calculated offer amount:", offerAmount);
      
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
      
      console.log("Creating valuation with data:", valuationData);
      const valuation = await storage.createValuation(valuationData, offerAmount);
      console.log("Created valuation:", valuation);
      
      // Return the offer
      return res.status(201).json({
        success: true,
        valuation: {
          id: valuation.id,
          offerAmount: valuation.offerAmount,
          offerExpiry: valuation.offerExpiry,
          carDetails: {
            make: valuation.make,
            model: valuation.model,
            year: valuation.year,
            mileage: valuation.mileage
          }
        }
      });
    } catch (error) {
      console.error("Error processing valuation request:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationError.details
        });
      }
      
      return res.status(500).json({
        success: false,
        message: "Server error while processing car valuation"
      });
    }
  });

  // Accept car offer endpoint
  app.post("/api/car/accept-offer", apiLimiter, async (req: Request, res: Response) => {
    try {
      const { valuationId } = req.body;
      
      if (!valuationId) {
        return res.status(400).json({
          success: false,
          message: "Valuation ID is required"
        });
      }
      
      const valuation = await storage.acceptValuation(valuationId);
      
      if (!valuation) {
        return res.status(404).json({
          success: false,
          message: "Valuation not found or offer expired"
        });
      }
      
      return res.status(200).json({
        success: true,
        message: "Offer accepted successfully",
        pickupScheduled: true,
        valuation: {
          id: valuation.id,
          offerAmount: valuation.offerAmount,
          offerExpiry: valuation.offerExpiry
        }
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

  // Car valuation routes
  app.post('/api/valuations', async (req, res) => {
    try {
      const data = insertCarValuationSchema.parse(req.body);
      
      // Calculate offer amount based on the pricing logic
      const baseValue = 7000; // This should be fetched from a market data API
      const quickSaleDiscount = baseValue * 0.05;
      const afterQuickSale = baseValue - quickSaleDiscount;
      const taxDeduction = afterQuickSale * 0.07;
      const afterTax = afterQuickSale - taxDeduction;
      
      let conditionDeduction = 0;
      if (data.condition === 'poor') {
        conditionDeduction = afterTax * 0.70;
      } else if (data.condition === 'fair') {
        conditionDeduction = afterTax * 0.40;
      } else if (data.condition === 'good') {
        conditionDeduction = afterTax * 0.15;
      }
      
      const finalOffer = Math.round(afterTax - conditionDeduction);
      
      // Set offer expiry to 7 days from now
      const offerExpiry = new Date();
      offerExpiry.setDate(offerExpiry.getDate() + 7);
      
      // Insert the valuation into the database
      const valuation = await storage.createValuation(data, finalOffer);
      
      res.json({
        success: true,
        valuation: valuation,
      });
    } catch (error) {
      console.error('Error creating valuation:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create valuation',
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
