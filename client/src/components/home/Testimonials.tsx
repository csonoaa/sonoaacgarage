import { Star, StarHalf } from "lucide-react";

interface Testimonial {
  rating: number;
  content: string;
  author: {
    name: string;
    car: string;
    image: string;
  };
}

export function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      rating: 5,
      content: "I was skeptical at first, but Sonoaac Garage gave me a better offer than the dealership. The process was incredibly easy, and I had cash in hand within 48 hours.",
      author: {
        name: "Michael T.",
        car: "Sold a 2016 Toyota Camry",
        image: "https://randomuser.me/api/portraits/men/32.jpg"
      }
    },
    {
      rating: 5,
      content: "My car wasn't even running, and I expected to get nothing for it. Sonoaac offered me a fair price and picked it up from my driveway the next day. Can't recommend them enough!",
      author: {
        name: "Sarah K.",
        car: "Sold a 2010 Honda Civic",
        image: "https://randomuser.me/api/portraits/women/44.jpg"
      }
    },
    {
      rating: 4.5,
      content: "I needed to sell my car quickly due to a move, and Sonoaac made it happen in just 3 days from start to finish. The offer was fair and the pickup was convenient.",
      author: {
        name: "David R.",
        car: "Sold a 2019 Ford Explorer",
        image: "https://randomuser.me/api/portraits/men/67.jpg"
      }
    }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
    }

    return stars;
  };

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what customers are saying about their experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              <p className="text-neutral-700 mb-4">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.author.image} 
                  alt={testimonial.author.name} 
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h4 className="font-medium">{testimonial.author.name}</h4>
                  <p className="text-neutral-500 text-sm">{testimonial.author.car}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
