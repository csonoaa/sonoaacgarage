import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Check } from "lucide-react";
import { carMakes, getModelName, getMakeName } from "@/lib/car-data";
import { CarFormData, CarConditionData, ContactData } from "@/types/car";
import { calculateCarValuation } from "@/lib/valuation";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface OfferResultProps {
  carData: CarFormData;
  conditionData: CarConditionData;
  contactData: ContactData;
}

export function OfferResult({ carData, conditionData, contactData }: OfferResultProps) {
  const [offerAmount, setOfferAmount] = useState<number | null>(null);
  const [marketAverage, setMarketAverage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptingOffer, setAcceptingOffer] = useState(false);
  const [emailingSelf, setEmailingSelf] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const calculateOffer = async () => {
      try {
        // Get market average from API
        const response = await apiRequest("POST", "/api/car/market-value", {
          make: carData.make,
          model: carData.model,
          year: carData.year,
          mileage: carData.mileage,
          trim: carData.trim
        });

        if (!response.ok) {
          throw new Error('Failed to get market value');
        }

        const data = await response.json();
        const marketValue = data.marketValue;
        setMarketAverage(marketValue);

        // Calculate offer based on condition
        let finalOffer = marketValue;
        
        if (conditionData.drivable === "no") {
          // Non-drivable vehicles
          finalOffer = Math.random() * 200 + 500; // Random amount between $500-$700
        } else {
          // Drivable vehicles
          switch (conditionData.condition) {
            case "excellent":
              finalOffer = marketValue * 0.93; // -7%
              break;
            case "good":
              finalOffer = marketValue * 0.65; // -35%
              break;
            case "fair":
              finalOffer = marketValue * 0.45; // -55%
              break;
            case "poor":
              finalOffer = marketValue * 0.45; // -55%
              break;
          }
        }

        setOfferAmount(finalOffer);
      } catch (error) {
        console.error("Error calculating offer:", error);
        toast({
          title: "Error",
          description: "There was a problem calculating your offer. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    calculateOffer();
  }, [carData, conditionData, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Calculating Your Offer...</h2>
          <p className="text-neutral-600">Please wait while we determine the best offer for your vehicle.</p>
        </div>
      </div>
    );
  }

  const makeName = getMakeName(carData.make);
  const modelName = getModelName(carData.model);

  const handleAcceptOffer = async () => {
    try {
      setAcceptingOffer(true);
      
      // Submit acceptance to API
      await apiRequest("POST", "/api/car/accept-offer", {
        carData,
        conditionData,
        contactData,
        offer: offerAmount
      });
      
      toast({
        title: "Offer Accepted!",
        description: "We'll contact you shortly to schedule a pickup.",
        duration: 5000
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem accepting your offer. Please try again.",
        variant: "destructive"
      });
      console.error("Accept offer error:", error);
    } finally {
      setAcceptingOffer(false);
    }
  };

  const handleEmailOffer = async () => {
    try {
      setEmailingSelf(true);
      
      // Send email to the user
      await apiRequest("POST", "/api/car/email-offer", {
        email: contactData.email,
        carData,
        conditionData,
        offer: offerAmount
      });
      
      toast({
        title: "Email Sent!",
        description: `We've sent the offer details to ${contactData.email}`,
        duration: 5000
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending the email. Please try again.",
        variant: "destructive"
      });
      console.error("Email offer error:", error);
    } finally {
      setEmailingSelf(false);
    }
  };

  return (
    <section id="offer-result" className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto overflow-hidden">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Your Offer is Ready!</h2>
              <p className="text-neutral-600">Based on the details provided, here's our offer for your vehicle.</p>
            </div>
            
            {/* Car Summary */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 p-6 bg-neutral-50 rounded-lg">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h3 className="text-xl font-semibold mb-3">
                  {carData.year} {makeName} {modelName}
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <span className="text-neutral-600 text-sm">Mileage:</span>
                    <span className="text-neutral-800 ml-1">{parseInt(carData.mileage).toLocaleString()} miles</span>
                  </div>
                  <div>
                    <span className="text-neutral-600 text-sm">Color:</span>
                    <span className="text-neutral-800 ml-1">
                      {carData.exteriorColor.charAt(0).toUpperCase() + carData.exteriorColor.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 text-sm">Condition:</span>
                    <span className="text-neutral-800 ml-1">
                      {conditionData.condition.charAt(0).toUpperCase() + conditionData.condition.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 text-sm">Transmission:</span>
                    <span className="text-neutral-800 ml-1">
                      {carData.transmission.charAt(0).toUpperCase() + carData.transmission.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/3 text-center md:border-l md:pl-6 flex flex-col items-center">
                <span className="text-neutral-600 text-sm">Our Offer:</span>
                <div className="text-4xl font-bold text-primary mt-2 mb-3">
                  {formatCurrency(offerAmount)}
                </div>
                <span className="text-sm bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full">
                  Valid for {offerAmount ? (offerAmount / marketAverage) * 100 : 0}% of Market Average
                </span>
              </div>
            </div>
            
            {/* Next Steps */}
            <div className="border-t border-neutral-200 pt-6">
              <h3 className="text-xl font-semibold mb-4">Next Steps</h3>
              <ol className="space-y-4">
                <li className="flex">
                  <div className="bg-primary/80 text-white w-6 h-6 rounded-full flex items-center justify-center font-medium mr-3 flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-medium">Review Your Offer</h4>
                    <p className="text-neutral-600 text-sm">Take your time to review the details of your offer.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-primary/80 text-white w-6 h-6 rounded-full flex items-center justify-center font-medium mr-3 flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-medium">Schedule a Pickup or Inspection</h4>
                    <p className="text-neutral-600 text-sm">If you accept the offer, we'll arrange a convenient time to inspect and pick up your vehicle.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-primary/80 text-white w-6 h-6 rounded-full flex items-center justify-center font-medium mr-3 flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-medium">Get Paid</h4>
                    <p className="text-neutral-600 text-sm">After verification, we'll pay you on the spot with your preferred payment method.</p>
                  </div>
                </li>
              </ol>
            </div>
            
            <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
              <Button 
                className="bg-secondary hover:bg-secondary/90"
                onClick={handleAcceptOffer}
                disabled={acceptingOffer}
              >
                {acceptingOffer ? "Processing..." : "Accept Offer & Schedule Pickup"}
              </Button>
              <Button 
                variant="outline"
                onClick={handleEmailOffer}
                disabled={emailingSelf}
              >
                {emailingSelf ? "Sending..." : "Email Me This Offer"}
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <Link href="#contact">
                <a className="text-primary hover:underline text-sm">
                  Have questions? Contact our support team
                </a>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
