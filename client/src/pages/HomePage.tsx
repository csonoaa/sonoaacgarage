import { Hero } from "@/components/home/Hero";
import { ValueProposition } from "@/components/home/ValueProposition";
import { CarValuationForm } from "@/components/home/CarValuationForm";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { CallToAction } from "@/components/home/CallToAction";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProposition />
      <CarValuationForm />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CallToAction />
    </>
  );
}
