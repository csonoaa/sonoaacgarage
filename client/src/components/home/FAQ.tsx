import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs: FAQItem[] = [
    {
      question: "How does the car valuation process work?",
      answer: "Our valuation algorithm analyzes thousands of data points from recent sales, auction results, and market trends to determine a competitive offer for your vehicle. We consider factors like make, model, year, mileage, condition, and local market demand to ensure you get a fair price."
    },
    {
      question: "What if my car isn't running or is damaged?",
      answer: "We buy cars in all conditions, including those that aren't running. While non-running vehicles will receive a lower offer than drivable ones, we still provide fair prices based on salvage value, usable parts, and other factors. We'll arrange free pickup for non-running vehicles."
    },
    {
      question: "How long is my offer valid?",
      answer: "Your offer is valid for 7 days from the date it was generated. After that, you're welcome to request a new offer, though market conditions may have changed. We recommend acting quickly to lock in your price."
    },
    {
      question: "What documents do I need to sell my car?",
      answer: "You'll need the vehicle title (clear and in your name), a valid photo ID, and current registration. If there's a lien on the vehicle, we'll need the lien holder's information. We'll guide you through any additional paperwork needed for your specific situation."
    },
    {
      question: "How soon can I get paid?",
      answer: "Once you accept our offer, we can typically arrange pickup within 24-48 hours. Payment is made at the time of pickup, after a quick inspection to verify the vehicle's condition matches what was reported. We offer payment via check, direct deposit, or electronic transfer."
    }
  ];

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Got questions? We've got answers. If you don't see what you're looking for, feel free to contact us.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-neutral-200 rounded-lg overflow-hidden">
                <button 
                  className="w-full flex items-center justify-between p-4 text-left bg-neutral-50 hover:bg-neutral-100 transition duration-200"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                <div 
                  className={cn(
                    "p-4 border-t border-neutral-200 bg-white",
                    openFaq === index ? "block" : "hidden"
                  )}
                >
                  <p className="text-neutral-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
