import { FileText, Scale, CalendarCheck, CreditCard } from "lucide-react";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function HowItWorks() {
  const steps: Step[] = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "1. Enter Details",
      description: "Fill out our simple form with information about your car's make, model, year, and condition."
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: "2. Get Your Offer",
      description: "Our algorithm instantly calculates a fair market value offer based on real-time market data."
    },
    {
      icon: <CalendarCheck className="h-6 w-6" />,
      title: "3. Schedule Pickup",
      description: "Accept your offer and we'll arrange a convenient time to pick up your vehicle at your location."
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "4. Get Paid",
      description: "After a quick inspection to verify your car's condition, we'll pay you on the spot."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How Sonoaac Garage Works</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            We've simplified the car selling process into 4 easy steps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary text-2xl mx-auto mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-neutral-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
