import { Clock, DollarSign, Truck } from "lucide-react";

interface ValueProp {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function ValueProposition() {
  const valueProps: ValueProp[] = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Instant Offers",
      description: "Get a real offer in minutes, not days. No waiting for dealership appointments."
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Fair Market Value",
      description: "Our algorithm analyzes thousands of cars to ensure you get a competitive offer."
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Free Pickup",
      description: "Accept our offer and we'll pick up your car at no cost, even if it's not drivable."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose Sonoaac Garage?</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            We've simplified the car selling process to give you the best price with minimal effort.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {valueProps.map((prop, index) => (
            <div key={index} className="bg-neutral-50 rounded-xl p-8 text-center">
              <div className="text-primary text-4xl mb-4 flex justify-center">
                {prop.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{prop.title}</h3>
              <p className="text-neutral-600">{prop.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
