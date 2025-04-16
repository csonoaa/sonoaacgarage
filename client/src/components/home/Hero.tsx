import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary-dark to-primary py-16 md:py-24 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sell Your Car in Minutes, Not Days</h1>
            <p className="text-xl opacity-90 mb-8">Get an instant, fair offer for your vehicle and skip the hassle of private selling.</p>
            <div className="flex flex-wrap gap-4">
              <Button 
                asChild
                size="lg"
                className={cn(
                  "bg-secondary hover:bg-secondary-dark/90 text-white",
                  "text-base font-semibold px-6 py-3"
                )}
              >
                <Link href="#car-form">
                  Get an Offer Now
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                size="lg"
                className={cn(
                  "bg-white/20 hover:bg-white/30 text-white border-white/40",
                  "text-base font-semibold px-6 py-3"
                )}
              >
                <Link href="#how-it-works">
                  How It Works
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="rounded-lg shadow-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Sell your car with Sonoaac Garage" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
