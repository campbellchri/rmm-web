import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import Upload from '@/components/ui/Upload'
import DatePicker from '@/components/ui/DatePicker/DatePicker'
import { useNavigate } from 'react-router-dom'
import { Input, Select, toast, Notification } from '@/components/ui'
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

// Form Section Component
const FormSection = ({
    title,
    children,
    className = '',
    titleClassName = '',
}: {
    title: React.ReactNode
    children: React.ReactNode
    className?: string
    titleClassName?: string
}) => {
    return (
        <div
            className={`bg-[#2f3349] rounded-lg p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] ${className}`}
        >
            <h3 className="text-lg text-memorial-text-secondary font-poppins mb-4">
                {title}
            </h3>
            {children}
        </div>
    )
}

export default function VideoOnlyMemorial() {
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [featured, setFeatured] = useState<File[]>([])
    const [video, setVideo] = useState<File[]>([])
    const [landingModeId, setLandingModeId] = useState<string>('')
    const [templateId, setTemplateId] = useState<string>('')
    const navigate = useNavigate()
    const { fetchMemorials, setActiveMemorialId } = useMemorialStore()

    const { control, handleSubmit } = useForm({
        defaultValues: {
            personName: '',
            personGender: Gender.MALE,
            personBirthDate: null,
            personDeathDate: null,
            favQuote: '',
            featuredVideoTitle: '',
            favSaying: '',
            galleryVideoTitle: '',
        },
    })

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
                const videoTemplate = templatesRes.find((t: any) => t.landingMode?.landingModeType === 'video-only-mode')

                if (videoTemplate) {
                    setTemplateId(videoTemplate.id)
                    // Use the landingModeId directly from the template object
                    setLandingModeId(videoTemplate.landingModeId)
                }
            } catch (error) {
                console.error('Error fetching templates:', error)
            }
        }
        fetchData()
    }, [])

    const onSubmit = async (data: any) => {
        try {
            const mediaList = [
                ...featured.map((file: File, index: number) => ({
                    mimeType: file.type,
                    fileURL: 'https://www.pexels.com/video/medical-training-855480/', // Placeholder for now
                    fileId: `featured-video-${index}`,
                    type: MediaType.VIDEO,
                    category: MediaCategory.FEATURED,
                    videoTitle: data.featuredVideoTitle || 'Featured Video',
                    videoDescription: data.favSaying || '',
                    isMainVideo: true,
                    isActive: true,
                    sortOrder: index,
                })),
                ...video.map((file: File, index: number) => ({
                    mimeType: file.type,
                    fileURL: 'https://www.pexels.com/video/medical-training-855480/', // Placeholder for now
                    fileId: `gallery-video-${index}`,
                    type: MediaType.VIDEO,
                    category: MediaCategory.GALLERY,
                    videoTitle: data.galleryVideoTitle || 'Gallery Video',
                    videoDescription: '',
                    isMainVideo: false,
                    isActive: true,
                    sortOrder: featured.length + index,
                })),
            ]

            // If no videos are uploaded, add a dummy one to satisfy backend requirement
            if (mediaList.length === 0) {
                mediaList.push({
                    mimeType: 'video/mp4',
                    fileURL: 'https://www.pexels.com/video/medical-training-855480/',
                    fileId: 'dummy-video-id',
                    type: MediaType.VIDEO,
                    category: MediaCategory.FEATURED,
                    videoTitle: 'Placeholder Video',
                    videoDescription: '',
                    isMainVideo: true,
                    isActive: true,
                    sortOrder: 0,
                } as any)
            }

            const payload = {
                landingModeId: (landingModeId).toString(),
                templateId: templateId,
                personName: data.personName,
                personGender: data.personGender,
                personBirthDate: data.personBirthDate
                    ? dayjs(data.personBirthDate).format('YYYY-MM-DD')
                    : null,
                personDeathDate: data.personDeathDate
                    ? dayjs(data.personDeathDate).format('YYYY-MM-DD')
                    : null,
                profilePictureId: 'profile-photo-id',
                pageURL: `https://rememberme.com/memorial/${data.personName.toLowerCase().replace(/\s+/g, '-')}`,
                personProfilePicture: profileImage || '', // Placeholder for now
                favQuote: data.favQuote,
                publishStatus: PublishStatus.DRAFT,
                userMedia: mediaList,
            }

            const response = await apiCreateMemorial(payload)
            console.log('API Response:', response)

            toast.push(
                <Notification type="success" title="Success" duration={2000}>
                    Video memorial created successfully!
                </Notification>,
                { placement: 'top-center' }
            )

            await fetchMemorials(true)
            if (response && (response as any).id) {
                setActiveMemorialId((response as any).id)
            }
            navigate('/dashboard/video-memorial')
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
                <div className="max-w-7xl mx-auto ">
                    {/* Header */}
                    <div className="flex justify-between flex-col md:flex-row gap-2 items-center mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft />
                            </button>
                            <p className="md:text-2xl text-lg DMSerif font-[400] text-[#ffffff] text-memorial-text-primary">
                                Template Video Only Mode
                            </p>
                        </div>
                    </div>

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
                                className="md:px-6 px-3 font-[500] md:text-[21.26px] text-base py-2.5 border text-[#4EB1C9]  rounded-md font-poppins  hover:bg-blue-50 transition-colors"
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

                        {/* Basic Info */}
                        <div className="w-full bg-[#2f3349] rounded-lg p-6 shadow">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Controller
                                        name="personName"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="Full Name"
                                                className="text-white bg-[#383c56] border-none"
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="personGender"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                options={genderOptions}
                                                placeholder="Gender"
                                                className="w-full font-poppins border-none"
                                                value={genderOptions.find(
                                                    (opt) =>
                                                        opt.value ===
                                                        field.value,
                                                )}
                                                onChange={(option: any) =>
                                                    field.onChange(option.value)
                                                }
                                                styles={{
                                                    singleValue: (
                                                        base: any,
                                                    ) => ({
                                                        ...base,
                                                        color: '#ffffff',
                                                        border: 'none',
                                                    }),
                                                }}
                                            />
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Controller
                                        name="personBirthDate"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                placeholder="Date of Birth"
                                                type="date"
                                                value={field.value}
                                                onChange={field.onChange}
                                                className="text-white bg-[#383c56] border-none"
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="personDeathDate"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                placeholder="Date of Death"
                                                type="date"
                                                value={field.value}
                                                onChange={field.onChange}
                                                className="text-white bg-[#383c56] border-none"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="mt-6">
                                <label className="block text-base font-medium  text-[#ffffff] font-poppins mb-2">
                                    Write a Quote (Optional)
                                </label>
                                <Controller
                                    name="favQuote"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            textArea
                                            placeholder="Type here..."
                                            maxLength={150}
                                            rows={3}
                                            className="text-white bg-[#383c56] border-none"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Featured Video */}
                    <FormSection
                        title={
                            <span className="font-poppins font-[500] md:text-[18px] text-base text-[#ffffff]">
                                Upload featured video
                            </span>
                        }
                        className="mb-8"
                    >
                        <Upload
                            accept="video/*"
                            uploadLimit={1}
                            onChange={setFeatured}
                        />
                        <div className="mt-4">
                            <label className="block text-sm text-white font-poppins mb-2">
                                Video Title
                            </label>
                            <Controller
                                name="featuredVideoTitle"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Enter title here..."
                                        className="w-full  font-poppins bg-[#383c56] border-none"
                                    />
                                )}
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm text-white font-poppins mb-2">
                                Favorite Sayings (Optional)
                            </label>
                            <Controller
                                name="favSaying"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Enter sayings here..."
                                        className="w-full font-poppins bg-[#383c56] border-none"
                                    />
                                )}
                            />
                        </div>
                    </FormSection>

                    {/* Upload Video */}
                    <FormSection
                        title={
                            <span className="font-poppins font-[500] md:text-[18px] text-base text-[#ffffff]">
                                Upload Videos (Optional)
                            </span>
                        }
                        className="mb-8"
                    >
                        <Upload
                            accept="video/*"
                            uploadLimit={3}
                            onChange={setVideo}
                        />
                        <div className="mt-4">
                            <label className="block text-sm text-white font-poppins mb-2">
                                Video Title
                            </label>
                            <Controller
                                name="galleryVideoTitle"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Enter Video Title here ..."
                                        className="w-full font-poppins bg-[#383c56] border-none"
                                    />
                                )}
                            />
                        </div>
                    </FormSection>

                    {/* Footer Actions */}
                    <div className="bg-[#2f3349] px-6 py-6 flex justify-between items-center rounded-lg shadow-sm">
                        <button
                            onClick={handlePreview}
                            className="px-6 font-[500] text-base py-2.5 border text-[#4EB1C9]  rounded-[76px] font-poppins  hover:bg-blue-50 transition-colors"
                        >
                            Preview
                        </button>
                        <button
                            onClick={handleSaveFinish}
                            className="bg-[#C7A30D] text-[#000000] font-poppins font-[500] text-base px-6 py-2.5 rounded-[1000px] transition-colors font-medium"
                            style={{
                                background: 'linear-gradient(96.23deg, #ECA024 5.01%, #F9C94F 50.03%, #EAA32A 95.05%)',
                            }}
                        >
                            Save & Finish
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
