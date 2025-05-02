import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, validateVIN, formatPhoneNumber, isValidEmail, isValidZipCode } from "@/lib/utils";
import { ArrowRight, ArrowLeft, Upload } from "lucide-react";
import { CarFormData, CarConditionData, ContactData } from "@/types/car";
import { 
  carMakes, 
  getModelsByMake, 
  getTrimsByModel, 
  years, 
  bodyTypes, 
  transmissions, 
  drivetrains, 
  colors 
} from "@/lib/car-data";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { OfferResult } from "./OfferResult";

// Form validation schemas
const carFormSchema = z.object({
  make: z.string().min(1, "Please select a make"),
  model: z.string().min(1, "Please select a model"),
  year: z.string().min(1, "Please select a year"),
  trim: z.string().optional(),
  bodyType: z.string().min(1, "Please select a body type"),
  mileage: z.string().min(1, "Please enter mileage"),
  transmission: z.string().min(1, "Please select a transmission"),
  drivetrain: z.string().min(1, "Please select a drivetrain"),
  exteriorColor: z.string().min(1, "Please select a color"),
  vin: z.string().optional().refine(val => !val || validateVIN(val), {
    message: "Please enter a valid 17-character VIN"
  }),
  exteriorCondition: z.string().min(1, "Please select exterior condition"),
  interiorCondition: z.string().min(1, "Please select interior condition"),
  modifications: z.string().optional(),
  serviceHistory: z.string().min(1, "Please select service history"),
  accidentHistory: z.string().min(1, "Please select accident history")
});

const conditionFormSchema = z.object({
  drivable: z.string().min(1, "Please select if your car is drivable"),
  condition: z.string().min(1, "Please select your car's condition"),
  additionalInfo: z.string().optional(),
  photos: z.any().optional()
});

const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").refine(isValidEmail, {
    message: "Please enter a valid email address"
  }),
  phone: z.string().min(10, "Phone number is required")
    .refine(val => /^\(\d{3}\) \d{3}-\d{4}$/.test(formatPhoneNumber(val)), {
      message: "Please enter a valid phone number"
    }),
  zipCode: z.string().min(1, "ZIP code is required").refine(isValidZipCode, {
    message: "Please enter a valid ZIP code"
  }),
  termsAgreed: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms" })
  })
});

export function CarValuationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showOfferResult, setShowOfferResult] = useState(false);
  const [carData, setCarData] = useState<CarFormData | null>(null);
  const [conditionData, setConditionData] = useState<CarConditionData | null>(null);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Step 1: Car details form
  const carForm = useForm<z.infer<typeof carFormSchema>>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      trim: "",
      bodyType: "",
      mileage: "",
      transmission: "",
      drivetrain: "",
      exteriorColor: "",
      vin: "",
      exteriorCondition: "",
      interiorCondition: "",
      modifications: "",
      serviceHistory: "",
      accidentHistory: ""
    }
  });

  // Step 2: Condition form
  const conditionForm = useForm<z.infer<typeof conditionFormSchema>>({
    resolver: zodResolver(conditionFormSchema),
    defaultValues: {
      drivable: "",
      condition: "",
      additionalInfo: ""
    }
  });

  // Step 3: Contact form
  const contactForm = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      zipCode: "",
      termsAgreed: false
    }
  });

  // Handle car form submission
  const onCarFormSubmit = (data: z.infer<typeof carFormSchema>) => {
    setCarData(data);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle condition form submission
  const onConditionFormSubmit = (data: z.infer<typeof conditionFormSchema>) => {
    setConditionData(data);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle contact form submission
  const onContactFormSubmit = async (data: z.infer<typeof contactFormSchema>) => {
    if (!carData || !conditionData) return;

    try {
      setIsSubmitting(true);

      // Combine all form data
      const fullFormData = {
        ...carData,
        ...conditionData,
        ...data
      };

      // Submit to API
      const response = await apiRequest("POST", "/api/car/valuation", fullFormData);
      
      if (!response.ok) {
        throw new Error('Failed to get offer');
      }

      const offerData = await response.json();
      
      setContactData(data);
      setShowOfferResult(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem getting your offer. Please try again.",
        variant: "destructive"
      });
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Logic for the "back" button
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Dynamic models based on selected make
  const [availableModels, setAvailableModels] = useState<{ id: string; name: string }[]>([]);
  const [availableTrims, setAvailableTrims] = useState<{ id: string; name: string }[]>([]);

  // Update models when make changes
  const handleMakeChange = (value: string) => {
    carForm.setValue("make", value);
    carForm.setValue("model", "");
    carForm.setValue("trim", "");
    
    const models = getModelsByMake(value);
    setAvailableModels(models);
  };

  // Update trims when model changes
  const handleModelChange = (value: string) => {
    carForm.setValue("model", value);
    carForm.setValue("trim", "");
    
    const trims = getTrimsByModel(value);
    setAvailableTrims(trims);
  };

  // Handle phone input formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    contactForm.setValue("phone", formatted);
  };

  if (showOfferResult && carData && conditionData && contactData) {
    return <OfferResult carData={carData} conditionData={conditionData} contactData={contactData} />;
  }

  return (
    <section id="car-form" className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Get Your Car's Value in Seconds</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Fill out the details below and our advanced algorithm will calculate a competitive offer for your vehicle.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="bg-neutral-50 px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-medium",
                    currentStep >= 1 ? "bg-primary text-white" : "bg-neutral-300 text-white"
                  )}>
                    1
                  </div>
                  <span className={cn(
                    "ml-2 font-medium",
                    currentStep >= 1 ? "text-neutral-800" : "text-neutral-500"
                  )}>
                    Vehicle Details
                  </span>
                </div>
                <div className="w-8 h-1 bg-neutral-300">
                  {/* Connector */}
                </div>
                <div className="flex items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-medium",
                    currentStep >= 2 ? "bg-primary text-white" : "bg-neutral-300 text-white"
                  )}>
                    2
                  </div>
                  <span className={cn(
                    "ml-2 font-medium",
                    currentStep >= 2 ? "text-neutral-800" : "text-neutral-500"
                  )}>
                    Condition
                  </span>
                </div>
                <div className="w-8 h-1 bg-neutral-300 hidden md:block">
                  {/* Connector */}
                </div>
                <div className="flex items-center hidden md:flex">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-medium",
                    currentStep >= 3 ? "bg-primary text-white" : "bg-neutral-300 text-white"
                  )}>
                    3
                  </div>
                  <span className={cn(
                    "ml-2 font-medium",
                    currentStep >= 3 ? "text-neutral-800" : "text-neutral-500"
                  )}>
                    Contact Info
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Area */}
          <div className="p-6 md:p-8">
            {/* Step 1: Vehicle Details */}
            {currentStep === 1 && (
              <Form {...carForm}>
                <form onSubmit={carForm.handleSubmit(onCarFormSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={carForm.control}
                      name="make"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Make</FormLabel>
                          <div className="flex gap-2">
                            <FormControl className="flex-1">
                              <Input
                                placeholder="Type or select make"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleMakeChange(e.target.value);
                                }}
                              />
                            </FormControl>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleMakeChange(value);
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Select Make" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {carMakes.map((make) => (
                                  <SelectItem key={make.id} value={make.id}>
                                    {make.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={carForm.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model</FormLabel>
                          <div className="flex gap-2">
                            <FormControl className="flex-1">
                              <Input
                                placeholder="Type or select model"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleModelChange(e.target.value);
                                }}
                              />
                            </FormControl>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleModelChange(value);
                              }}
                              defaultValue={field.value}
                              disabled={availableModels.length === 0}
                            >
                              <FormControl>
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Select Model" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableModels.map((model) => (
                                  <SelectItem key={model.id} value={model.id}>
                                    {model.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={carForm.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {years.map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={carForm.control}
                      name="trim"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trim</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={availableTrims.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Trim" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableTrims.map((trim) => (
                                <SelectItem key={trim.id} value={trim.id}>
                                  {trim.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={carForm.control}
                      name="bodyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Body Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Body Type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {bodyTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={carForm.control}
                      name="mileage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mileage</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Enter miles" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={carForm.control}
                      name="transmission"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transmission</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Transmission" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {transmissions.map((transmission) => (
                                <SelectItem key={transmission.id} value={transmission.id}>
                                  {transmission.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={carForm.control}
                      name="drivetrain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Drivetrain</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Drivetrain" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {drivetrains.map((drivetrain) => (
                                <SelectItem key={drivetrain.id} value={drivetrain.id}>
                                  {drivetrain.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={carForm.control}
                      name="exteriorColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exterior Color</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Color" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {colors.map((color) => (
                                <SelectItem key={color.id} value={color.id}>
                                  {color.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={carForm.control}
                      name="vin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>VIN (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter VIN for more accurate valuation" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Additional Vehicle Details */}
                  <FormField
                    control={carForm.control}
                    name="exteriorCondition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exterior Condition</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Condition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="excellent">Excellent - No visible wear</SelectItem>
                            <SelectItem value="good">Good - Minor wear</SelectItem>
                            <SelectItem value="fair">Fair - Some scratches/dents</SelectItem>
                            <SelectItem value="poor">Poor - Significant damage</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={carForm.control}
                    name="interiorCondition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interior Condition</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Condition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="excellent">Excellent - Like new</SelectItem>
                            <SelectItem value="good">Good - Minor wear</SelectItem>
                            <SelectItem value="fair">Fair - Some stains/wear</SelectItem>
                            <SelectItem value="poor">Poor - Significant wear/damage</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={carForm.control}
                    name="modifications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modifications</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List any modifications (tint, aftermarket parts, etc.)"
                            className="h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={carForm.control}
                    name="serviceHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service History</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select History" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="complete">Complete Service Records</SelectItem>
                            <SelectItem value="partial">Partial Service Records</SelectItem>
                            <SelectItem value="none">No Service Records</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={carForm.control}
                    name="accidentHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accident History</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select History" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No Accidents</SelectItem>
                            <SelectItem value="minor">Minor Accidents</SelectItem>
                            <SelectItem value="major">Major Accidents</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="mt-8 flex justify-end">
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      Continue to Condition <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            )}

            {/* Step 2: Condition */}
            {currentStep === 2 && (
              <Form {...conditionForm}>
                <form onSubmit={conditionForm.handleSubmit(onConditionFormSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={conditionForm.control}
                      name="drivable"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Is your car drivable?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                              <div className={cn(
                                "border border-neutral-300 rounded-lg p-4 hover:border-primary cursor-pointer transition duration-200",
                                field.value === "yes" && "border-primary bg-primary/5"
                              )}>
                                <FormItem className="flex items-start space-x-2">
                                  <FormControl>
                                    <RadioGroupItem value="yes" />
                                  </FormControl>
                                  <div className="grid gap-1">
                                    <FormLabel className="font-medium cursor-pointer">Yes, it runs and drives</FormLabel>
                                    <p className="text-neutral-500 text-sm">The vehicle starts and can be driven safely.</p>
                                  </div>
                                </FormItem>
                              </div>
                              <div className={cn(
                                "border border-neutral-300 rounded-lg p-4 hover:border-primary cursor-pointer transition duration-200",
                                field.value === "no" && "border-primary bg-primary/5"
                              )}>
                                <FormItem className="flex items-start space-x-2">
                                  <FormControl>
                                    <RadioGroupItem value="no" />
                                  </FormControl>
                                  <div className="grid gap-1">
                                    <FormLabel className="font-medium cursor-pointer">No, it doesn't run</FormLabel>
                                    <p className="text-neutral-500 text-sm">The vehicle doesn't start or can't be driven safely.</p>
                                  </div>
                                </FormItem>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={conditionForm.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Vehicle Condition</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                              <div className={cn(
                                "border border-neutral-300 rounded-lg p-4 hover:border-primary cursor-pointer transition duration-200",
                                field.value === "excellent" && "border-primary bg-primary/5"
                              )}>
                                <FormItem className="flex items-start space-x-2">
                                  <FormControl>
                                    <RadioGroupItem value="excellent" />
                                  </FormControl>
                                  <div className="grid gap-1">
                                    <FormLabel className="font-medium cursor-pointer">Excellent</FormLabel>
                                    <p className="text-neutral-500 text-sm">Like new, no visible wear, all features work perfectly.</p>
                                  </div>
                                </FormItem>
                              </div>
                              <div className={cn(
                                "border border-neutral-300 rounded-lg p-4 hover:border-primary cursor-pointer transition duration-200",
                                field.value === "good" && "border-primary bg-primary/5"
                              )}>
                                <FormItem className="flex items-start space-x-2">
                                  <FormControl>
                                    <RadioGroupItem value="good" />
                                  </FormControl>
                                  <div className="grid gap-1">
                                    <FormLabel className="font-medium cursor-pointer">Good</FormLabel>
                                    <p className="text-neutral-500 text-sm">Minor wear and tear, all major features work well.</p>
                                  </div>
                                </FormItem>
                              </div>
                              <div className={cn(
                                "border border-neutral-300 rounded-lg p-4 hover:border-primary cursor-pointer transition duration-200",
                                field.value === "fair" && "border-primary bg-primary/5"
                              )}>
                                <FormItem className="flex items-start space-x-2">
                                  <FormControl>
                                    <RadioGroupItem value="fair" />
                                  </FormControl>
                                  <div className="grid gap-1">
                                    <FormLabel className="font-medium cursor-pointer">Fair</FormLabel>
                                    <p className="text-neutral-500 text-sm">Noticeable wear, some features may need repair.</p>
                                  </div>
                                </FormItem>
                              </div>
                              <div className={cn(
                                "border border-neutral-300 rounded-lg p-4 hover:border-primary cursor-pointer transition duration-200",
                                field.value === "poor" && "border-primary bg-primary/5"
                              )}>
                                <FormItem className="flex items-start space-x-2">
                                  <FormControl>
                                    <RadioGroupItem value="poor" />
                                  </FormControl>
                                  <div className="grid gap-1">
                                    <FormLabel className="font-medium cursor-pointer">Poor</FormLabel>
                                    <p className="text-neutral-500 text-sm">Significant damage or mechanical issues.</p>
                                  </div>
                                </FormItem>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormLabel className="block text-neutral-700 font-medium mb-4">Upload Photos (Optional)</FormLabel>
                      <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center bg-neutral-50">
                        <Upload className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                        <p className="text-neutral-600 mb-3">Drag and drop photos here or</p>
                        <Button type="button" variant="outline" className="bg-white">
                          Browse Files
                        </Button>
                        <p className="text-neutral-500 text-sm mt-3">Upload up to 5 photos (exterior, interior, etc.)</p>
                      </div>
                    </div>

                    <FormField
                      control={conditionForm.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us more about your vehicle's condition, any accidents, repairs, upgrades, etc."
                              className="h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-8 flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleBack}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      Continue to Contact Info <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            )}

            {/* Step 3: Contact Information */}
            {currentStep === 3 && (
              <Form {...contactForm}>
                <form onSubmit={contactForm.handleSubmit(onContactFormSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={contactForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={contactForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={contactForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={contactForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter phone number"
                              value={field.value}
                              onChange={(e) => handlePhoneChange(e)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={contactForm.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP Code</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter ZIP code" 
                              className="w-full md:w-1/3" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={contactForm.control}
                      name="termsAgreed"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm text-neutral-600">
                              I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and{" "}
                              <a href="#" className="text-primary hover:underline">Privacy Policy</a>. I consent to receive emails, calls, and texts about my offer.
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-8 flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleBack}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-secondary hover:bg-secondary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Get My Offer"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
