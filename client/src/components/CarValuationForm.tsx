import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertCarValuationSchema } from '../../../shared/schema';
import type { InsertCarValuation } from '../../../shared/schema';

interface PriceBreakdown {
  baseValue: number;
  quickSaleDiscount: number;
  taxDeduction: number;
  conditionDeduction: number;
  finalOffer: number;
}

export function CarValuationForm() {
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown>({
    baseValue: 0,
    quickSaleDiscount: 0,
    taxDeduction: 0,
    conditionDeduction: 0,
    finalOffer: 0,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InsertCarValuation>({
    resolver: zodResolver(insertCarValuationSchema),
  });

  // Watch form fields for real-time price calculation
  const formValues = watch();

  useEffect(() => {
    calculatePrice(formValues);
  }, [formValues]);

  const calculatePrice = (values: Partial<InsertCarValuation>) => {
    // Base value calculation (simplified for now)
    const baseValue = 7000; // This should be fetched from an API based on make/model/year

    // Quick sale discount (5%)
    const quickSaleDiscount = baseValue * 0.05;

    // Tax deduction (7%)
    const afterQuickSale = baseValue - quickSaleDiscount;
    const taxDeduction = afterQuickSale * 0.07;

    // Condition deduction (15-70% based on issues)
    const afterTax = afterQuickSale - taxDeduction;
    let conditionDeduction = 0;
    
    if (values.condition === 'poor') {
      conditionDeduction = afterTax * 0.70;
    } else if (values.condition === 'fair') {
      conditionDeduction = afterTax * 0.40;
    } else if (values.condition === 'good') {
      conditionDeduction = afterTax * 0.15;
    }

    const finalOffer = afterTax - conditionDeduction;

    setPriceBreakdown({
      baseValue,
      quickSaleDiscount,
      taxDeduction,
      conditionDeduction,
      finalOffer,
    });
  };

  const onSubmit = async (data: InsertCarValuation) => {
    try {
      const response = await fetch('/api/valuations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit valuation');
      }

      // Handle success (e.g., show success message, redirect)
    } catch (error) {
      console.error('Error submitting valuation:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Sell Your Car Fast</h1>
      
      {/* Price Breakdown */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Offer Breakdown</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Base Market Value:</span>
            <span>${priceBreakdown.baseValue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Quick Sale Discount (5%):</span>
            <span>-${priceBreakdown.quickSaleDiscount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>Tax Deduction (7%):</span>
            <span>-${priceBreakdown.taxDeduction.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>Condition Adjustment:</span>
            <span>-${priceBreakdown.conditionDeduction.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Final Offer:</span>
            <span>${priceBreakdown.finalOffer.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Vehicle Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Vehicle Information</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Make</label>
              <input
                {...register('make')}
                className="w-full p-2 border rounded"
                placeholder="e.g., Toyota"
              />
              {errors.make && (
                <span className="text-red-500 text-sm">{errors.make.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Model</label>
              <input
                {...register('model')}
                className="w-full p-2 border rounded"
                placeholder="e.g., Camry"
              />
              {errors.model && (
                <span className="text-red-500 text-sm">{errors.model.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <input
                {...register('year')}
                className="w-full p-2 border rounded"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                placeholder="e.g., 2020"
              />
              {errors.year && (
                <span className="text-red-500 text-sm">{errors.year.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">VIN (Optional)</label>
              <input
                {...register('vin')}
                className="w-full p-2 border rounded"
                placeholder="Enter VIN for quick fill"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mileage</label>
              <input
                {...register('mileage')}
                className="w-full p-2 border rounded"
                type="number"
                placeholder="e.g., 50000"
              />
              {errors.mileage && (
                <span className="text-red-500 text-sm">{errors.mileage.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Transmission</label>
              <select
                {...register('transmission')}
                className="w-full p-2 border rounded"
              >
                <option value="">Select transmission</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
              {errors.transmission && (
                <span className="text-red-500 text-sm">{errors.transmission.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Drivetrain</label>
              <select
                {...register('drivetrain')}
                className="w-full p-2 border rounded"
              >
                <option value="">Select drivetrain</option>
                <option value="fwd">Front Wheel Drive (FWD)</option>
                <option value="awd">All Wheel Drive (AWD)</option>
                <option value="rwd">Rear Wheel Drive (RWD)</option>
                <option value="4wd">Four Wheel Drive (4WD)</option>
              </select>
              {errors.drivetrain && (
                <span className="text-red-500 text-sm">{errors.drivetrain.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Exterior Color</label>
              <input
                {...register('exteriorColor')}
                className="w-full p-2 border rounded"
                placeholder="e.g., Silver"
              />
              {errors.exteriorColor && (
                <span className="text-red-500 text-sm">{errors.exteriorColor.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* Condition Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Vehicle Condition</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1">Overall Condition</label>
            <select
              {...register('condition')}
              className="w-full p-2 border rounded"
            >
              <option value="">Select condition</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
            {errors.condition && (
              <span className="text-red-500 text-sm">{errors.condition.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Is the vehicle drivable?</label>
            <select
              {...register('drivable')}
              className="w-full p-2 border rounded"
            >
              <option value="">Select status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.drivable && (
              <span className="text-red-500 text-sm">{errors.drivable.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Additional Information</label>
            <textarea
              {...register('additionalInfo')}
              className="w-full p-2 border rounded"
              rows={4}
              placeholder="Describe any issues, modifications, or additional details about your vehicle"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Contact Information</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                {...register('firstName')}
                className="w-full p-2 border rounded"
              />
              {errors.firstName && (
                <span className="text-red-500 text-sm">{errors.firstName.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                {...register('lastName')}
                className="w-full p-2 border rounded"
              />
              {errors.lastName && (
                <span className="text-red-500 text-sm">{errors.lastName.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                {...register('email')}
                className="w-full p-2 border rounded"
                type="email"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                {...register('phone')}
                className="w-full p-2 border rounded"
                type="tel"
              />
              {errors.phone && (
                <span className="text-red-500 text-sm">{errors.phone.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ZIP Code</label>
              <input
                {...register('zipCode')}
                className="w-full p-2 border rounded"
              />
              {errors.zipCode && (
                <span className="text-red-500 text-sm">{errors.zipCode.message}</span>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Your Offer
        </button>
      </form>
    </div>
  );
} 