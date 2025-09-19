import React, { useState } from "react";
import img1 from "../../assets/Review1.png";
import img2 from "../../assets/Review2.png";
import img3 from "../../assets/Review3.png";

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Hair Coloring & Styling",
        image: `${img3}`,
        quote:
            "Absolutely amazing experience! The team at Bella Salon transformed my hair beyond my expectations. The color is perfect and the styling is phenomenal. I've never felt more confident!",
        rating: 5,
    },
    {
        name: "Emily Carter",
        role: "Spa Treatments",
        image: `${img1}`,
        quote:
            "The spa treatments are heavenly. I felt so relaxed and refreshed after my facial. The staff is super professional and kind.",
        rating: 5,
    },
    {
        name: "Olivia Brown",
        role: "Manicure & Pedicure",
        image: `${img2}`,
        quote:
            "Best nail service ever! They were very detailed and my nails look absolutely stunning. Highly recommended!",
        rating: 4,
    },
];

const Review = () => {
    const [index, setIndex] = useState(0);

    const prev = () => {
        setIndex((prevIndex) =>
            prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
        );
    };

    const next = () => {
        setIndex((prevIndex) =>
            prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <section id="review" className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                {/* Heading */}
                <div className="text-center mb-16">
                    <h2
                        className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
                        style={{ fontFamily: '"Playfair Display", serif' }}
                    >
                        What Our Clients Say
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Don't just take our word for it - hear from our satisfied clients
                        who have experienced the Bella difference
                    </p>
                </div>

                {/* Testimonial Card */}
                <div className="relative">
                    <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-shrink-0">
                                <img
                                    src={testimonials[index].image}
                                    alt={testimonials[index].name}
                                    className="w-24 h-24 rounded-full object-cover object-top"
                                />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                {/* Stars */}
                                <div className="flex justify-center md:justify-start mb-4">
                                    {Array.from({ length: testimonials[index].rating }).map(
                                        (_, i) => (
                                            <i
                                                key={i}
                                                className="ri-star-fill text-yellow-400 text-xl"
                                            ></i>
                                        )
                                    )}
                                </div>

                                {/* Quote */}
                                <blockquote className="text-lg md:text-xl text-gray-700 mb-6 italic">
                                    "{testimonials[index].quote}"
                                </blockquote>

                                {/* Client Info */}
                                <div>
                                    <div className="font-semibold text-gray-900 text-lg">
                                        {testimonials[index].name}
                                    </div>
                                    <div className="text-rose-600 font-medium">
                                        {testimonials[index].role}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center mt-8 gap-4">
                        <button
                            onClick={prev}
                            className="w-12 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <i className="ri-arrow-left-line text-xl"></i>
                        </button>

                        {/* Dots */}
                        <div className="flex gap-2">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setIndex(i)}
                                    className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${index === i ? "bg-rose-600" : "bg-gray-300"
                                        }`}
                                ></button>
                            ))}
                        </div>

                        <button
                            onClick={next}
                            className="w-12 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <i className="ri-arrow-right-line text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Review;
