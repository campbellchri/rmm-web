import { ChevronRight, ImagePlus, Share2, Sparkles } from 'lucide-react'
import JohnMichalImage from '../../../public/img/others/FRAME (17).png'
import johnMichalImageDesktop from '../../../public/img//others/FRAME (18).png'
import AddMemoriesImage from '../../assets/svg/Add Memories.svg'
import ShareImage from '../../assets/svg/share.svg'
import CelebrateImage from '../../assets/svg/Celebrate.svg'


const MemorialFeatures = () => {

    const steps = [
        {
            icon: AddMemoriesImage,
            title: "Add Memories",
            description: "Upload photos and videos, share heartfelt stories, and add meaningful insights to create a memorial as unique as your loved one.",
        },
        {
            icon: ShareImage,
            title: "Share",
            description: "Get a unique QR code or digital link that connects anyone to your memorial, supported throughout the healing journey.",
        },
        {
            icon: CelebrateImage,
            title: "Celebrate",
            description: "Bring together people with compassion and care. The giving of space is with compassion gets to be part of their story.",
        },
    ];

    return (
        <div className="md:mt-32 py-10">
            <div className="max-w-7xl mx-auto mt-8 mb-8">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-16 flex flex-col items-center gap-4">
                            <p className="font-lato font-normal text-[18px] leading-[33.87px] tracking-[1.06px] text-center uppercase text-[#D4AF37]">
                                How It Works
                            </p>
                            <h2 className="font-playfair font-semibold text-[34px] leading-[48.92px] text-center text-white">
                                3 Simple Steps
                            </h2>
                            <p className="font-lato font-normal text-[18px] leading-[35.98px] text-center text-white">
                                Comprehensive support for healing and remembrance throughout your journey
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className="relative group"
                                >
                                    <div className="bg-card/80 bg-[#1E2532] border-t-[#D4AF37] border-t-[4px] rounded-2xl p-8 text-center hover:border-gold/50 transition-all duration-300 h-full">

                                        <div className="flex justify-center items-center mb-6">
                                            <img
                                                src={step.icon}
                                                alt={step.title}
                                                style={{ width: 90, height: 90 }}
                                                className="text-gold"
                                            />
                                        </div>

                                        <h3 className="font-playfair font-semibold text-[22px] leading-[36.69px] text-center text-white">
                                            {step.title}
                                        </h3>
                                        <p className="font-lato font-normal text-[14px] leading-[24px] text-center text-[#D3D3D3]">
                                            {step.description}
                                        </p>
                                    </div>

                                    {index < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-8 w-12 lg:w-16 h-px bg-gradient-to-r from-gold/50 to-gold/20" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MemorialFeatures
