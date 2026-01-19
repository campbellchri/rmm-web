import React from 'react'

interface PackageCardProps {
    name: string
    price?: string
    period?: string
    storage?: string
    features: string[]
    icon?: string
    priceIcon?: string
    isCurrent?: boolean
    buttonText?: string
    onButtonClick?: () => void
    className?: string
    nameClass?: string
    hideButton?: boolean
}

const PackageCard: React.FC<PackageCardProps> = ({
    name,
    price,
    nameClass,
    period,
    storage,
    features,
    icon,
    priceIcon,
    isCurrent,
    buttonText,
    onButtonClick,
    className = "",
    hideButton = false
}) => {
    return (
        <div
            className={`relative rounded-2xl p-4 md:p-8 transition-all duration-300 w-full bg-[#1E2532] border-2 cursor-pointer ${isCurrent ? 'border-[#D4AF37] shadow-lg shadow-yellow-500/10' : 'border-transparent hover:border-[#D4AF37]'
                } ${className}`}
            onClick={onButtonClick}
        >
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-secondary shrink-0">
                    {icon && (
                        <img src={icon} alt={name} className="h-[40px] md:h-[50px]" />
                    )}
                </div>
                <h3 className={`font-playfair font-semibold text-[22px] md:text-[28.22px] leading-[28px] md:leading-[36.69px] text-[#D4AF37] ${nameClass}`}>{name}</h3>
            </div>

            <div className="mb-1">
                {priceIcon ? (
                    <img src={priceIcon} alt={`${price} ${period}`} className="h-[30px] md:h-[35px] my-2" />
                ) : price && (
                    <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-2xl font-bold text-[#F9C94F]">{price}</span>
                        <span className="text-gray-500 text-sm">{period}</span>
                    </div>
                )}
            </div>

            {storage && (
                <p className="font-lato font-normal text-start text-[14px] md:text-[16px] leading-[24px] md:leading-[33.87px] text-white mb-4">
                    {storage}
                </p>
            )}

            <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                {features.map((feature, featureIndex) => (
                    <li
                        key={featureIndex}
                        className="font-lato font-normal text-[13px] md:text-[14px] leading-[22px] md:leading-[28px] text-white flex items-start gap-2"
                    >
                        <div className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0 mt-2"></div>
                        <span className="text-foreground/80">{feature}</span>
                    </li>
                ))}
            </ul>

            {!hideButton && buttonText && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onButtonClick?.();
                    }}
                    className={`w-full py-3 rounded-full font-bold transition-all ${isCurrent
                        ? 'bg-[#F9C94F] text-[#0F172A] hover:bg-[#FFB84C]'
                        : 'border-2 border-[#F9C94F] text-[#F9C94F] hover:bg-[#F9C94F]/10'
                        }`}
                >
                    {buttonText}
                </button>
            )}
        </div>
    )
}

export default PackageCard
