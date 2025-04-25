import { Link } from "wouter";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Sell Your Car Fast, No Stress</h1>
        <p className="text-xl mb-8">
          Get an instant offer for your car. No haggling, no hassle, just a fair price.
        </p>
        
        <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
              <h3 className="text-lg font-medium mb-2">Enter Your Car Details</h3>
              <p className="text-gray-600">Tell us about your car's make, model, year, and condition.</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
              <h3 className="text-lg font-medium mb-2">Get Your Offer</h3>
              <p className="text-gray-600">Receive a fair, transparent offer based on market value.</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
              <h3 className="text-lg font-medium mb-2">Accept & Get Paid</h3>
              <p className="text-gray-600">Accept the offer and get paid quickly for your car.</p>
            </div>
          </div>
        </div>
        
        <Link href="/valuation">
          <a className="inline-block bg-blue-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
            Get Your Offer Now
          </a>
        </Link>
      </div>
    </div>
  );
}
