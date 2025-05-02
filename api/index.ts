import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { z } from 'zod';

// Create express app
const app = express();

// Apply middlewares
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Validation schema for car valuation request
const carValuationRequestSchema = z.object({
  // Car details
  make: z.string().min(1).max(50),
  model: z.string().min(1).max(50),
  year: z.string().min(1).max(4),
  mileage: z.string().min(1),
  condition: z.string(),
  // Contact info
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email().max(100),
  phone: z.string().min(10).max(20)
});

// Helper function to calculate car value
function calculateCarValue(data: any): number {
  // Base values for popular models (in USD)
  const baseValues: Record<string, number> = {
    "camry": 18000,
    "corolla": 15000,
    "rav4": 20000,
    "accord": 17500,
    "civic": 14500,
    "cr-v": 19000,
    "f-150": 30000,
    "escape": 18000,
    "default": 12000
  };

  // Get base value for the model or use default
  let baseValue = baseValues[data.model.toLowerCase()] || baseValues.default;
  
  // Year multipliers
  const yearNum = parseInt(data.year);
  let yearMultiplier = 0.2;
  if (yearNum >= 2020) yearMultiplier = 1.2;
  else if (yearNum >= 2015) yearMultiplier = 0.8;
  else if (yearNum >= 2010) yearMultiplier = 0.5;
  
  // Mileage multipliers
  const mileageNum = parseInt(data.mileage);
  let mileageMultiplier = 0.25;
  if (mileageNum <= 30000) mileageMultiplier = 1.1;
  else if (mileageNum <= 60000) mileageMultiplier = 1.0;
  else if (mileageNum <= 100000) mileageMultiplier = 0.8;
  else if (mileageNum <= 150000) mileageMultiplier = 0.6;
  
  // Condition multipliers
  let conditionMultiplier = 1.0;
  switch (data.condition) {
    case "excellent": conditionMultiplier = 1.1; break;
    case "good": conditionMultiplier = 1.0; break;
    case "fair": conditionMultiplier = 0.8; break;
    case "poor": conditionMultiplier = 0.6; break;
  }
  
  // Calculate offer
  let offerAmount = baseValue * yearMultiplier * mileageMultiplier * conditionMultiplier;
  
  // Round to nearest hundred
  offerAmount = Math.round(offerAmount / 100) * 100;
  
  return offerAmount;
}

// Direct serverless function handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Car valuation endpoint
  if (req.method === 'POST' && req.url?.includes('/api/car/valuation')) {
    try {
      console.log("Received valuation request:", req.body);
      
      // Validate request data
      const validationResult = carValuationRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationResult.error.issues
        });
      }
      
      const validatedData = validationResult.data;
      console.log("Validated data:", validatedData);
      
      // Calculate car value
      const offerAmount = calculateCarValue(validatedData);
      console.log("Calculated offer amount:", offerAmount);
      
      // Set offer expiry to 7 days from now
      const offerExpiry = new Date();
      offerExpiry.setDate(offerExpiry.getDate() + 7);
      
      // Return the offer
      return res.status(201).json({
        success: true,
        valuation: {
          offerAmount,
          offerExpiry,
          carDetails: {
            make: validatedData.make,
            model: validatedData.model,
            year: validatedData.year,
            mileage: validatedData.mileage
          }
        }
      });
    } catch (error) {
      console.error("Error processing valuation request:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while processing car valuation"
      });
    }
  }
  
  // Handle 404
  return res.status(404).json({
    success: false,
    message: "API endpoint not found"
  });
} 