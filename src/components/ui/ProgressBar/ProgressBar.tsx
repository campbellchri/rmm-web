import { motion } from 'framer-motion'

interface ProgressBarProps {
    label?: string
    used: number
    total: number
    height?: number
    color?: string
    showValues?: boolean
    showTotal?: boolean // for main bar totals
    labelClassName?: string
    summaryLabel?: boolean // ✅ NEW prop for "X GB used of Y GB total"
}

const ProgressBar = ({
    label,
    used,
    total,
    height = 4,
    color = '#C7A30D',
    showValues = false,
    showTotal = true,
    labelClassName = 'text-sm text-[#4B5563]',
    summaryLabel = false,
}: ProgressBarProps) => {
    const percentage = Math.min((used / total) * 100, 100)

    return (
        <div className="space-y-1">
            {/* Normal label (Photos, Videos, etc.) */}
            {label && !summaryLabel && (
                <div
                    className={`flex justify-between font-poppins text-[#ffffff] ${labelClassName}`}
                >
                    <span>{label}</span>
                    {showValues &&
                        (showTotal ? (
                            <span>
                                {used} GB / {total} GB
                            </span>
                        ) : (
                            <span>{used} GB</span>
                        ))}
                </div>
            )}

            {/* Summary label (Storage case) */}
            {summaryLabel && (
                <p className={`font-poppins text-[#ffffff] ${labelClassName}`}>
                    {used} GB used of {total} GB total
                </p>
            )}

            {/* Progress bar */}
            <div
                className="w-full bg-[#454b66] rounded-full"
                style={{ height }}
            >
                <motion.div
                    className="rounded-full"
                    style={{ backgroundColor: color, height }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                />
            </div>

            {/* For main bar with no label */}
            {showValues && !label && !summaryLabel && showTotal && (
                <div className="flex justify-between text-sm font-poppins text-[#ffffff]">
                    <span>{used} GB Used</span>
                    <span>{total} GB Available</span>
                </div>
            )}
        </div>
    )
}

export default ProgressBar
