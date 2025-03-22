import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "John Doe",
    position: "Software Engineer at Google",
    quote: "This AI tool helped me land my dream job! My LinkedIn profile looks much better now.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
  {
    name: "Sarah Lee",
    position: "Product Manager at Amazon",
    quote: "The resume optimization increased my interview calls by 3x!",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4,
  },
  {
    name: "Michael Smith",
    position: "Data Analyst at Microsoft",
    quote: "AI-powered optimization gave my resume a complete transformation. Highly recommend!",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-100 text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-10">What Our Users Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 shadow-md rounded-lg">
              <img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">{testimonial.name}</h3>
              <p className="text-sm text-gray-500">{testimonial.position}</p>
              <div className="flex justify-center mt-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-500" size={20} />
                ))}
              </div>
              <p className="mt-4 text-gray-600">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
