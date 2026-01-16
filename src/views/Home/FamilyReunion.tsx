import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import rightQuote from "../../assets/svg/rightQuote.svg"
import leftQuote from "../../assets/svg/leftQuote.svg"

const testimonials = [
    {
        quote: "The thumbprint memorial code is brilliant. Now my children can scan it and truly know their grandfather – his voice, his wisdom, his laughter. It's a gift that will last forever.",
        author: "David W.",
        role: "Son",
    },
    {
        quote: "The Remember Me Memorial was such a beautiful way to honor my grandmother. It allowed our entire family, scattered across the globe, to contribute memories, photos, and stories—bringing us all together in a way we hadn't experienced before. It truly felt like she was still with us.",
        author: "Dorothy R.",
        role: "Granddaughter",
    },
    {
        quote: "Creating a memorial for my father gave our family a place to visit whenever we miss him. The QR code on his headstone lets anyone learn about his incredible life story. It's brought so much comfort during difficult times.",
        author: "Michael S.",
        role: "Son",
    },
    {
        quote: "I was hesitant at first, but the team made the process so easy and compassionate. Now we have a beautiful digital space where friends and family can add memories, share stories, and keep my mother's legacy alive for generations.",
        author: "Sarah M.",
        role: "Daughter",
    },
    {
        quote: "The memorial platform helped us preserve our family history in a way that traditional methods couldn't. Every photo, every story, every moment is now accessible to future generations.",
        author: "Robert T.",
        role: "Grandson",
    },
];


export default function FamilyReunions() {

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="md:my-[200px] relative overflow-hidden" >
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <p className="font-lato font-normal text-[21.17px] leading-[33.87px] tracking-[1.06px] text-center uppercase text-[#D4AF37]">Client Stories</p>
                    <h2 className="font-playfair font-semibold text-[30px] leading-[48.92px] text-center text-white">
                        Words from Families We've Served
                    </h2>
                    <p className="font-lato font-normal text-[18px] leading-[35.98px] text-center text-white">
                        Their trust and feedback inspire us to continue serving with compassion
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="relative bg-[#1e1e2e] rounded-2xl p-8 md:p-12 lg:p-16">
                        <img src={leftQuote} alt="left quote" className="absolute top-10 left-7" />
                        <img src={rightQuote} alt="right quote" className="absolute bottom-20 right-20" />
                        <div className="relative z-10">
                            <p className="text-lg md:text-xl lg:text-2xl text-white leading-relaxed mb-8 italic font-lato">
                                {testimonials[currentIndex].quote}
                            </p>

                            <div className="flex items-center justify-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-[#D4AF37] flex items-center justify-center flex-shrink-0">
                                    <span className="text-[#1e1e2e] font-semibold text-xl font-lato">
                                        {testimonials[currentIndex].author.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-white font-medium text-lg font-lato">
                                        {testimonials[currentIndex].author}
                                    </p>
                                    <p className="text-white text-base font-lato">
                                        {testimonials[currentIndex].role}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-4 mt-10 pt-8">
                        <button
                            onClick={prevTestimonial}
                            className="w-10 h-10 rounded-full bg-[#0A2E5C] flex items-center justify-center hover:bg-[#2a2a3e] transition-colors"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </button>

                        {/* Dots */}
                        <div className="flex gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`rounded-full transition-all ${index === currentIndex
                                        ? "bg-[#D4AF37] w-6 h-2"
                                        : "bg-white w-2 h-2 hover:bg-white/50"
                                        }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextTestimonial}
                            className="bg-[#0A2E5C] w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#2a2a3e] transition-colors"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}


