import { useEffect, useState } from 'react'
import FullMemorialMode from '../../../public/img/others/classical-mode.png'
import VideoOnlyMode from '../../../public/img/others/video-0nly-mode.png'
import EventModeImage from '../../../public/img/others/event-mode.png'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { apiGetMemorialTemplateList } from '../../services/axios/MemorialModeService'

interface TemplateOption {
    id: string
    title: string
    image: string
    description?: string
    thumbnailURL?: string
}

interface LandingMode {
    id: string
    title: string
    description: string
    landingModeType: string
    iconId: string
    iconURL: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

interface TemplateApiResponse {
    id: string
    name: string
    description: string | null
    landingModeId: string
    thumbnailURL?: string
    createdAt: string
    updatedAt: string
    landingMode: LandingMode
}

const templateOptions: TemplateOption[] = [
    {
        id: 'full-mode',
        title: 'Full Memorial Mode',
        image: FullMemorialMode,
    },
    {
        id: 'video-only-mode',
        title: 'Video-Only Mode',
        image: VideoOnlyMode,
    },
    {
        id: 'event-mode',
        title: 'Event Mode',
        image: EventModeImage,
    },
]

const TemplateCard = ({
    template,
    isSelected,
    onSelect,
}: {
    template: TemplateOption
    isSelected: boolean
    onSelect: () => void
}) => {
    return (
        <div
            onClick={onSelect}
            className={`flex flex-col rounded-lg overflow-hidden cursor-pointer transition-all duration-200 bg-white shadow-md hover:shadow-lg ${
                isSelected
                    ? 'border-2 border-[#C7A30D]'
                    : 'border border-gray-200 hover:border-gray-300'
            }`}
        >
            {/* Header */}
            <div className="px-6 py-6 border-b border-gray-200 bg-[#383C56]">
                <p className="text-xl DMSerif text-white">{template.title}</p>
            </div>

            {/* Preview Image */}
            <div className="flex-1">
                <img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-contain"
                />
            </div>
        </div>
    )
}

const SelectTemplate = () => {
    // const [isSaved, setIsSaved] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    type LandingModeType = 'full-mode' | 'video-only-mode' | 'event-mode'

    const moodToTemplateMap: Record<LandingModeType, string> = {
        'full-mode': 'full-mode',
        'video-only-mode': 'video-only-mode',
        'event-mode': 'event-mode',
    }

    // set initial template based on mood
    // const initialTemplate =
    //     queryParams.get('selected-template') || 'full-memorial'

    const [searchParams] = useSearchParams()
    const selectedMood = searchParams.get('mood') as LandingModeType | null

    const initialTemplate =
        (selectedMood && moodToTemplateMap[selectedMood]) || 'full-mode'

    const [selectedTemplate, setSelectedTemplate] =
        useState<string>(initialTemplate)
    const [loading, setLoading] = useState(false)
    const [templates, setTemplates] =
        useState<TemplateOption[]>(templateOptions)

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                setLoading(true)
                const response =
                    (await apiGetMemorialTemplateList()) as TemplateApiResponse[]
                if (response && Array.isArray(response)) {
                    const apiTemplates: TemplateOption[] = response.map(
                        (item: TemplateApiResponse) => {
                            const templateId =
                                item.landingMode?.landingModeType || item.id
                            let fallbackImage = FullMemorialMode
                            if (templateId === 'video-only-mode') {
                                fallbackImage = VideoOnlyMode
                            } else if (templateId === 'event-mode') {
                                fallbackImage = EventModeImage
                            } else if (templateId === 'full-mode') {
                                fallbackImage = FullMemorialMode
                            }
                            const thumbnailURL = item.thumbnailURL?.trim()
                            const hasValidThumbnail =
                                thumbnailURL && thumbnailURL.startsWith('http')

                            return {
                                id: templateId,
                                title:
                                    item.name ||
                                    item.landingMode?.title ||
                                    'Template',
                                image: hasValidThumbnail
                                    ? thumbnailURL
                                    : fallbackImage,
                                description:
                                    item.description ||
                                    item.landingMode?.description ||
                                    undefined,
                            }
                        },
                    )
                    setTemplates(apiTemplates)
                }
            } catch (error) {
                console.error('Error fetching templates:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchTemplates()
    }, [])

    const handleSaveContinue = () => {
        switch (selectedTemplate) {
            case 'full-mode':
                navigate('/dashboard/classic-template')
                break
            case 'video-only-mode':
                navigate('/dashboard/videoOnly-template')
                break
            case 'event-mode':
                navigate('/dashboard/event-template')
                break
            default:
                navigate('/dashboard/classic-template')
        }
    }

    // if (isSaved) {
    //     switch (selectedTemplate) {
    //         case 'full-memorial':
    //             return <CreateMemorial />
    //         case 'video-only':
    //             return <VideoOnlyMemorial />
    //         case 'event-mode':
    //             return <EventMode />
    //         default:
    //             return <CreateMemorial />
    //     }
    // }

    return (
        <div>
            <div className="mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center gap-3 text-center md:text-start">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft />
                    </button>
                    <p className="md:text-2xl text-lg DMSerif text-[#ffffff]">
                        Select Template
                    </p>
                </div>

                {/* Template Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-white text-lg">
                            Loading templates...
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                        {templates.map((template) => (
                            <div key={template.id} className="aspect-[3/4]">
                                <TemplateCard
                                    template={template}
                                    isSelected={
                                        selectedTemplate === template.id
                                    }
                                    onSelect={() =>
                                        setSelectedTemplate(template.id)
                                    }
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer Actions */}
                <div className="p-8 rounded-lg">
                    <div className="flex justify-end items-center">
                        <button
                            onClick={handleSaveContinue}
                            className="bg-[#C7A30D] text-black font-poppins text-base px-6 py-2.5 hover:bg-[#B8940C] transition-colors rounded-[1000px]"
                            style={{
                                background:
                                    'linear-gradient(96.23deg, #ECA024 5.01%, #F9C94F 50.03%, #EAA32A 95.05%)',
                            }}
                        >
                            Save & Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SelectTemplate
