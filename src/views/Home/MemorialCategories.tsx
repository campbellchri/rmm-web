import EssentialTribute from '../../assets/svg/Essential Tribute.svg'
import PremiumLegacy from '../../assets/svg/Premium Legacy.svg'
import EternalArchive from '../../assets/svg/Eternal Archive.svg'
import { Button } from '@/components/ui/Button'
import Month5 from "../../assets/svg/Month5.svg"
import Month15 from "../../assets/svg/Month15.svg"
import Month25 from "../../assets/svg/Month25.svg"


const MemorialCategories = () => {

    const plans = [
        {
            icon: EssentialTribute,
            priceIcon: Month5,
            name: "Essential Tribute",
            price: "$5",
            period: "/month",
            setupFee: "5GB storage",
            features: [
                "Complete funeral arrangements",
                "Transportation and logistics",
                "Documentation assistance",
                "Traditional ceremony coordination",
            ],
        },
        {
            icon: PremiumLegacy,
            priceIcon: Month15,
            name: "Premium Legacy",
            price: "$15",
            period: "/mo",
            setupFee: "15GB storage",
            features: [
                "Complete funeral arrangements",
                "Transportation and logistics",
                "Documentation assistance",
                "Traditional ceremony coordination",
            ],
        },
        {
            icon: EternalArchive,
            priceIcon: Month25,
            name: "Eternal Archive",
            price: "$25",
            period: "/mo",
            setupFee: "30GB storage",
            features: [
                "Complete funeral arrangements",
                "Transportation and logistics",
                "Documentation assistance",
                "Traditional ceremony coordination",
            ],
        },
    ];

    return (
        <div className="my-12 md:my-[200px]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8 md:mb-16 flex flex-col items-center gap-3 md:gap-4">
                    <p className="font-lato font-normal text-[14px] md:text-[18px] leading-[24px] md:leading-[33.87px] tracking-[1.06px] text-center uppercase text-[#D4AF37]">
                        Our Packages
                    </p>
                    <h2 className="font-playfair font-semibold text-[24px] md:text-[34px] leading-[32px] md:leading-[48.92px] text-center text-white">
                        Pricing Plans
                    </h2>
                    <p className="font-lato font-normal text-[16px] md:text-[18px] leading-[24px] md:leading-[35.98px] text-center text-white max-w-2xl">
                        We offer a range of packages tailored specifically for your memorial needs.
                        Simple, transparent pricing.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center md:justify-between gap-4 md:gap-8 max-w-7xl mx-auto">
                    {plans.map((plan, index) => (
                        <div key={index} className="relative rounded-2xl p-4 md:p-8 transition-all duration-300 w-full sm:w-[calc(50%-0.5rem)] md:w-[375px] md:h-[375px] bg-[#1E2532] border-2 border-transparent hover:border-[#D4AF37]">


                            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-secondary shrink-0">
                                    {plan.icon && (
                                        <img src={plan.icon} alt={plan.name} className="h-[40px] md:h-[50px]" />
                                    )}
                                </div>

                                <h3 className="font-playfair font-semibold text-[22px] md:text-[28.22px] leading-[28px] md:leading-[36.69px] text-[#D4AF37]">{plan.name}</h3>
                            </div>

                            <div className="mb-1">
                                {plan.priceIcon && (
                                    <img src={plan.priceIcon} alt={`${plan.price} ${plan.period}`} className="h-[30px] md:h-[35px] my-2" />
                                )}
                            </div>
                            <p className="font-lato font-normal text-[14px] md:text-[16px] leading-[24px] md:leading-[33.87px] text-white">{plan.setupFee}</p>

                            <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                                {plan.features.map((feature, featureIndex) => (
                                    <li
                                        key={featureIndex}
                                        className="font-lato font-normal text-[13px] md:text-[14px] leading-[22px] md:leading-[28px] text-white flex items-start gap-2"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0 mt-2"></div>
                                        <span className="text-foreground/80">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="text-center my-8 md:my-12">
                    <p className="font-lato font-normal text-[16px] md:text-[21.17px] leading-[24px] md:leading-[35.98px] text-center text-white mb-4 px-4">
                        Not sure which package is right for you? Our compassionate team is here to help.
                    </p>
                    <Button
                        variant="default"
                        className="rounded-full bg-gradient-to-r from-[#ECA024] via-[#F9C94F] to-[#EAA32A] text-[#0A2E5C] font-lato font-bold text-[16px] md:text-[20px] leading-[24px] md:leading-[33.87px] px-6 md:px-8 py-2.5 md:py-3 border-none text-center"
                    >
                        Speak with Our Team
                    </Button>
                </div>
            </div>

        </div>
    )
}

export default MemorialCategories
