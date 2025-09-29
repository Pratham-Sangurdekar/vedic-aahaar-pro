import React from "react";

const testimonials = [
  {
    name: "Pratham S.",
    text: "I lost 8kg and feel more energetic than ever! The personalized diet and tracker are game changers.",
    city: "Pune"
  },
  {
    name: "Avni R.",
    text: "The ayurvedic approach helped my digestion and sleep. Highly recommend!",
    city: "Bangalore"
  },
  {
    name: "Aditya K.",
    text: "I love the easy food logging and expert advice. My sugar is under control now.",
    city: "Delhi"
  },
  {
    name: "Kaushal J.",
    text: "The community and recipes keep me motivated. My whole family uses Ved-Aahaar!",
    city: "Mumbai"
  },
  {
    name: "Riddhima S.",
    text: "Finally, a wellness app that understands Indian food and lifestyle.",
    city: "Hyderabad"
  },
  // Add more testimonials as needed
];

const TestimonialScroller: React.FC = () => (
  <div className="w-full bg-muted py-8 overflow-x-hidden">
    <div className="whitespace-nowrap animate-scroll flex gap-8">
      {testimonials.concat(testimonials).map((t, i) => (
        <div
          key={i}
          className="inline-block min-w-[340px] max-w-md bg-white border rounded-lg shadow p-6 mx-2 align-top overflow-hidden"
          style={{ verticalAlign: 'top', whiteSpace: 'normal', wordBreak: 'break-word' }}
        >
          <div className="text-lg font-semibold mb-2">{t.name} <span className="text-xs text-muted-foreground">({t.city})</span></div>
          <div className="text-sm text-muted-foreground italic break-words">“{t.text}”</div>
        </div>
      ))}
    </div>
    <style>{`
      @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-scroll {
        animation: scroll 40s linear infinite;
      }
    `}</style>
  </div>
);

export default TestimonialScroller;
