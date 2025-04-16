import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Sell Your Car?</h2>
        <p className="text-xl text-white text-opacity-90 mb-8 max-w-2xl mx-auto">
          Get an instant offer in minutes. No obligation, no pressure.
        </p>
        <Button 
          asChild
          size="lg"
          className="bg-secondary hover:bg-secondary/90 text-white text-lg font-semibold px-8 py-4"
        >
          <Link href="#car-form">
            Get Your Offer Now
          </Link>
        </Button>
      </div>
    </section>
  );
}
