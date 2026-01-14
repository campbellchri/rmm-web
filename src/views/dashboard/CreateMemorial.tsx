import { useEffect, useState } from 'react'
import { Cloud, Check, ArrowLeft } from 'lucide-react'
import { LayoutPanelTop, PlayCircle, CalendarDays } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '@/components/ui/ProgressBar/ProgressBar'
import { apiGetMemorialModeList } from '@/services/axios/MemorialModeService'

type LandingModeType = 'full-mode' | 'video-only-mode' | 'event-mode'

interface MemorialMode {
    id: string
    landingModeType: LandingModeType
    title: string
    description: string
    isActive: boolean
}

const MODE_ORDER: Record<LandingModeType, number> = {
    'full-mode': 1,
    'video-only-mode': 2,
    'event-mode': 3,
}

const MODE_ICON_MAP: Record<LandingModeType, any> = {
    'full-mode': LayoutPanelTop,
    'video-only-mode': PlayCircle,
    'event-mode': CalendarDays,
}

const CreateMemorial = () => {
    const navigate = useNavigate()
    const [modes, setModes] = useState<MemorialMode[]>([])
    const [selectedMode, setSelectedMode] = useState<LandingModeType | ''>('')

    useEffect(() => {
        const fetchModes = async () => {
            try {
                const res = (await apiGetMemorialModeList()) as MemorialMode[]

                const activeModes = res
                    .filter((mode) => mode.isActive)
                    .sort(
                        (a, b) =>
                            MODE_ORDER[a.landingModeType] -
                            MODE_ORDER[b.landingModeType],
                    )

                setModes(activeModes)

                if (activeModes.length > 0) {
                    setSelectedMode(activeModes[0].landingModeType)
                }
            } catch (error) {
                console.error('Failed to fetch memorial modes', error)
            }
        }

        fetchModes()
    }, [])

    return (
        <div>
            <div className="mx-auto space-y-12">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft />
                    </button>
                    <p className="md:text-2xl text-lg mx-auto md:mx-0 DMSerif font-[400] text-[#ffffff]">
                        Create Memorial
                    </p>
                </div>

                <div className="space-y-7">
                    <div className="bg-[#2F3349] rounded-lg shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-6">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Cloud
                                        className="w-6 h-6 text-[#C7A30D]"
                                        strokeWidth={1.6}
                                    />
                                    <span className="md:text-lg text-base font-poppins text-[#ffffff]">
                                        Storage
                                    </span>
                                </div>
                                <button className="md:text-base text-sm font-poppins text-[#C7A30D] hover:text-[#B8940C] transition-colors">
                                    Manage Storage
                                </button>
                            </div>

                            <ProgressBar
                                used={0.9}
                                total={5}
                                height={12}
                                showValues={true}
                                showTotal={true}
                                summaryLabel
                                labelClassName="md:text-base text-sm font-poppins text-[#374151]"
                            />
                        </div>
                    </div>

                    {/* Landing Mode Section */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <p className="md:text-xl text-lg DMSerif font-[400] text-white">
                                Landing Mode
                            </p>
                            <p className="md:text-base text-sm font-poppins text-[#ffffff]">
                                Select how you want visitors to experience the
                                memorial when they first arrive.
                            </p>
                        </div>

                        {/* Mode Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
                            {modes.map((mode) => {
                                const Icon = MODE_ICON_MAP[mode.landingModeType]
                                const isSelected =
                                    selectedMode === mode.landingModeType

                                return (
                                    <div
                                        key={mode.id}
                                        className={`relative bg-[#2F3349] rounded-lg shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-6 cursor-pointer transition-all duration-200 ${
                                            isSelected
                                                ? 'border-2 border-[#C7A30D]'
                                                : 'border-2 border-transparent hover:border-gray-200'
                                        }`}
                                        onClick={() =>
                                            setSelectedMode(
                                                mode.landingModeType,
                                            )
                                        }
                                    >
                                        {/* Selection Indicator */}
                                        <div className="absolute top-6 right-6">
                                            {isSelected ? (
                                                <div className="w-6 h-6 bg-[#C7A30D] rounded-full flex items-center justify-center">
                                                    <Check
                                                        className="w-5 h-5 text-white"
                                                        strokeWidth={2.5}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 border-2 border-[#9CA3AF] rounded-full" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-6">
                                            {/* Icon */}
                                            <div className="flex justify-center pt-4">
                                                {Icon && (
                                                    <Icon
                                                        size={45}
                                                        strokeWidth={2.5}
                                                        className={
                                                            isSelected
                                                                ? 'text-[#C7A30D]'
                                                                : 'text-gray-500'
                                                        }
                                                    />
                                                )}
                                            </div>

                                            {/* Title */}
                                            <div className="text-center">
                                                <p className="md:text-lg text-base DMSerif text-white capitalize">
                                                    {mode.title}
                                                </p>
                                            </div>

                                            {/* Description */}
                                            <div className="text-center">
                                                <p className="md:text-base text-sm font-poppins text-[#ffffff] leading-relaxed">
                                                    {mode.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-8 rounded-lg">
                        <div className="flex justify-end items-center">
                            <button
                                onClick={() =>
                                    navigate(
                                        `/dashboard/select-template?mood=${selectedMode}`,
                                    )
                                }
                                disabled={!selectedMode}
                                className="bg-[#C7A30D] text-black font-poppins text-base px-6 py-2.5 rounded-md hover:bg-[#B8940C] transition-colors disabled:opacity-50"
                            >
                                Save & Continue
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateMemorial
