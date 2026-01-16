import { useState, useEffect } from 'react'
import { Calendar, Clock, ChevronDown, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DatePicker, Input, Select, TimeInput, Upload, toast, Notification } from '@/components/ui'
import { useForm, Controller } from 'react-hook-form'
import { apiCreateMemorial, apiGetMemorialModeList, apiGetMemorialTemplateList } from '@/services/axios/MemorialModeService'
import dayjs from 'dayjs'
import {
    MediaCategory,
    MediaType,
    PublishStatus,
    Gender,
} from '@/constants/memorial.constant'
import { useMemorialStore } from '@/store/memorialStore'

export default function EventMode() {
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [video, setVideo] = useState<File[]>([])
    const [landingModeId, setLandingModeId] = useState<string>('')
    const [templateId, setTemplateId] = useState<string>('')
    const navigate = useNavigate()
    const { fetchMemorials, setActiveMemorialId } = useMemorialStore()

    const { control, handleSubmit } = useForm({
        defaultValues: {
            personName: '',
            personGender: Gender.MALE,
            favQuote: '',
            eventStartDate: null as Date | null,
            eventStartTime: null as Date | null,
            eventDuration: '48h',
            videoTitle: '',
        },
    })

    const durationOptions = [
        { value: '48h', label: '48h' },
        { value: '24h', label: '24h' },
        { value: '72h', label: '72h' },
        { value: '1 week', label: '1 week' },
    ]

    const genderOptions = [
        { value: Gender.MALE, label: 'Male' },
        { value: Gender.FEMALE, label: 'Female' },
        { value: Gender.OTHER, label: 'Other' },
        { value: Gender.PREFER_NOT_TO_SAY, label: 'Prefer not to say' },
    ]

    useEffect(() => {
        const fetchData = async () => {
            try {
                const templatesRes: any = await apiGetMemorialTemplateList()
                const eventTemplate = templatesRes.find((t: any) => t.landingMode?.landingModeType === 'event-mode')

                if (eventTemplate) {
                    setTemplateId(eventTemplate.id)
                    // Use the landingModeId directly from the template object
                    setLandingModeId(eventTemplate.landingModeId)
                }
            } catch (error) {
                console.error('Error fetching templates:', error)
            }
        }
        fetchData()
    }, [])

    const onSubmit = async (data: any) => {
        try {
            // Construct eventStart ISO string
            let eventStart = null
            if (data.eventStartDate && data.eventStartTime) {
                const date = dayjs(data.eventStartDate)
                const time = dayjs(data.eventStartTime)
                eventStart = date
                    .hour(time.hour())
                    .minute(time.minute())
                    .second(0)
                    .toISOString()
            }

            const payload = {
                landingModeId: (landingModeId).toString(),
                templateId: templateId,
                personName: data.personName,
                personGender: data.personGender,
                profilePictureId: 'profile-photo-id',
                personProfilePicture: profileImage || 'https://cdn.example.com/photos/john.jpg',
                favQuote: data.favQuote,
                pageURL: `https://rememberme.com/memorial/${data.personName.toLowerCase().replace(/\s+/g, '-')}`,
                eventStart: eventStart,
                eventDuration: data.eventDuration,
                autoRevertToFullMode: true,
                publishStatus: PublishStatus.DRAFT,
                userMedia: [
                    ...video.map((file, index) => ({
                        mimeType: file.type,
                        fileURL: 'https://cdn.example.com/uploads/event-video.mp4', // Placeholder
                        fileId: `event-video-${index}`,
                        type: MediaType.VIDEO,
                        category: MediaCategory.GALLERY,
                        videoTitle: data.videoTitle || 'Event Video',
                        videoDescription: '',
                        isMainVideo: true,
                        isActive: true,
                        sortOrder: index,
                    })),
                ],
            }

            // Fallback dummy video if empty to satisfy backend
            if (payload.userMedia.length === 0) {
                payload.userMedia.push({
                    mimeType: 'video/mp4',
                    fileURL: 'https://www.pexels.com/video/medical-training-855480/',
                    fileId: 'dummy-video-id',
                    type: MediaType.VIDEO,
                    category: MediaCategory.GALLERY,
                    videoTitle: 'Placeholder Event Video',
                    videoDescription: '',
                    isMainVideo: true,
                    isActive: true,
                    sortOrder: 0,
                } as any)
            }

            const response = await apiCreateMemorial(payload)
            console.log('API Response:', response)

            toast.push(
                <Notification type="success" title="Success" duration={2000}>
                    Event memorial created successfully!
                </Notification>,
                { placement: 'top-center' }
            )

            await fetchMemorials(true)
            if (response && (response as any).id) {
                setActiveMemorialId((response as any).id)
            }
            navigate('/dashboard/event-memorial')
        } catch (error) {
            console.error('Error creating memorial:', error)
            toast.push(
                <Notification type="danger" title="Error" duration={2000}>
                    Failed to create memorial. Please try again.
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }

    const handleSaveFinish = () => {
        handleSubmit(onSubmit)()
    }

    const handlePreview = () => {
        console.log('Preview clicked')
    }

    return (
        <>
            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between flex-col md:flex-row gap-2 items-center mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft />
                            </button>
                            <p className="md:text-2xl text-lg DMSerif font-[400] text-[#ffffff]">
                                Template Event Mode
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        {/* Profile Section */}
                        <div className="flex flex-col items-center gap-5 mb-8">
                            <div className="flex items-center gap-4">
                                {/* Avatar Preview */}
                                <div className="lg:w-31 lg:h-31 md:w-25 md:h-25 h-20 w-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <img
                                            src="https://api.builder.io/api/v1/image/assets/TEMP/83dc85ca9155608ff3d7e17a997653fd5f9ed739?width=248"
                                            alt="Default avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>

                                {/* Upload Button */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        document
                                            .getElementById('profileUpload')
                                            ?.click()
                                    }
                                    className="md:px-6 px-3 font-medium text-[21.26px] leading-[24.8px] tracking-normal text-center py-2.5 border text-[#FFB84C] rounded-[26px] font-poppins border-[#FFB84C]"
                                >
                                    Upload Profile
                                </button>

                                {/* Hidden File Input */}
                                <input
                                    id="profileUpload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            const reader = new FileReader()
                                            reader.onload = () =>
                                                setProfileImage(
                                                    reader.result as string,
                                                )
                                            reader.readAsDataURL(file)
                                        }
                                    }}
                                />
                            </div>

                            {/* Event Mode Info Section */}
                            <div className="w-full bg-[#2f3349] rounded-lg p-6 shadow">
                                <Controller
                                    name="personName"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Full Name"
                                            className="text-white bg-[#383C56] border-none"
                                        />
                                    )}
                                />
                                <div className="mt-6">
                                    <label className="block text-base font-medium text-[#ffffff] font-poppins mb-2">
                                        Write a Quote (Optional)
                                    </label>
                                    <Controller
                                        name="favQuote"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="Type here..."
                                                maxLength={150}
                                                rows={3}
                                                textArea
                                                className="text-white bg-[#383C56] border-none"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#2f3349] rounded-lg p-6 shadow">
                            <div className="mb-1">
                                <p className="text-base font-poppins font-[400] text-[#ffffff]">
                                    Event Mode
                                </p>
                            </div>
                            <p className="text-sm font-poppins text-[#ffffff] opacity-80 leading-5">
                                Temporary (e.g., 48 hours) video-only mode for
                                special dates like anniversaries, birthdays, or
                                gatherings; then automatically reverts to Full
                                Memorial Mode.
                            </p>
                        </div>

                        {/* Event Duration Section */}
                        <div className="bg-[#2f3349] rounded-lg p-6 shadow">
                            <p className="text-base font-poppins font-[400] text-[#ffffff] mb-4">
                                Event Duration
                            </p>

                            <div className="flex flex-col lg:flex-row gap-4 mb-5">
                                {/* Start Date & Time */}
                                <div className="flex-1">
                                    <label className="block text-sm font-poppins text-white mb-1">
                                        Start Date & Time
                                    </label>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        {/* Date Input */}
                                        <div className="relative flex-1">
                                            <Controller
                                                name="eventStartDate"
                                                control={control}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Select Date"
                                                        className="text-white bg-[#383C56] border-none"
                                                    />
                                                )}
                                            />
                                        </div>

                                        {/* Time Input */}
                                        <div className="relative flex-1">
                                            <Controller
                                                name="eventStartTime"
                                                control={control}
                                                render={({ field }) => (
                                                    <TimeInput
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        format="12"
                                                        showSeconds={false}
                                                        suffix={
                                                            <Clock className="w-4 h-4 text-memorial-gray-500 pointer-events-none" />
                                                        }
                                                        className="text-white bg-[#383C56] border-none"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Duration */}
                                <div className="flex-1">
                                    <label className="block text-sm font-poppins text-white mb-1">
                                        Duration
                                    </label>
                                    <div className="relative">
                                        <Controller
                                            name="eventDuration"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    value={durationOptions.find(opt => opt.value === field.value)}
                                                    onChange={(option: any) =>
                                                        field.onChange(option.value)
                                                    }
                                                    options={durationOptions}
                                                    placeholder="Select duration"
                                                    className="w-full font-poppins border-none"
                                                    styles={{
                                                        singleValue: (base: any) => ({
                                                            ...base,
                                                            color: '#ffffff',
                                                        }),
                                                        control: (base: any) => ({
                                                            ...base,
                                                            backgroundColor: '#383C56',
                                                            border: 'none',
                                                        }),
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm font-poppins text-[#ffffff] opacity-80">
                                After the event period ends, your memorial will
                                automatically return to Full Memorial Mode.
                            </p>
                        </div>

                        {/* Upload Video Section */}
                        <div className="bg-[#2f3349] rounded-lg p-6 shadow">
                            <p className="text-base font-poppins font-[400] text-[#ffffff] mb-4">
                                Upload Video
                            </p>
                            <div>
                                <Upload
                                    accept="video/*"
                                    uploadLimit={1}
                                    onChange={setVideo}
                                />
                            </div>

                            <div className="mt-3">
                                <label className="block text-sm font-poppins text-white mb-2">
                                    Video Title
                                </label>
                                <Controller
                                    name="videoTitle"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Enter Video Title "
                                            className="w-full font-poppins bg-[#383C56] border-none text-white"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-6 py-6 flex justify-between items-center rounded-lg shadow-sm">
                            <button
                                onClick={handlePreview}
                                className="px-6 font-[500] md:text-base text-sm py-2.5 border text-[#4EB1C9] border-[#4EB1C9] rounded-[76px] font-poppins"
                            >
                                Preview
                            </button>
                            <button
                                onClick={handleSaveFinish}
                                className="bg-[#C7A30D] text-[#000000] font-[500] font-poppins text-base px-6 py-2.5 hover:bg-[#B8940C] transition-colors rounded-[1000px]"
                                style={{
                                    background:
                                        'linear-gradient(96.23deg, #ECA024 5.01%, #F9C94F 50.03%, #EAA32A 95.05%)',
                                }}
                            >
                                Save & Finish
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
