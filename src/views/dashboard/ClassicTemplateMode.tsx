import { useState, useEffect } from 'react'
import { ChevronDown, Calendar, ArrowLeft } from 'lucide-react'
import Upload from '@/components/ui/Upload'
import DatePicker from '@/components/ui/DatePicker/DatePicker'
import { useNavigate, useLocation } from 'react-router-dom'
import { CommonInput, CommonSelect, CommonDatePicker } from '@/components/shared'
import { toast, Notification } from '@/components/ui'
import { useForm, Controller } from 'react-hook-form'
import {
    apiCreateMemorial,
    apiGetMemorialModeList,
    apiGetMemorialTemplateList,
    apiGetMemorialById,
    apiUpdateMemorial,
} from '@/services/axios/MemorialModeService'
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

// Input Component
const FormInput = ({
    placeholder,
    hasDropdown = false,
}: {
    placeholder: string
    hasDropdown?: boolean
}) => (
    <div className="relative">
        <input
            type="text"
            placeholder={placeholder}
            className="w-full px-4 py-3 border border-memorial-blue-divider rounded bg-white text-memorial-blue-tertiary font-poppins text-sm placeholder-memorial-blue-tertiary"
        />
        {hasDropdown && (
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-3 h-3 text-memorial-blue-button-text" />
        )}
    </div>
)

// Textarea Component
const FormTextarea = ({
    placeholder,
    maxLength,
    rows = 3,
}: {
    placeholder: string
    maxLength: number
    rows?: number
}) => {
    const [value, setValue] = useState('')

    return (
        <div className="relative">
            <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                maxLength={maxLength}
                className="w-full px-4 py-3 border border-memorial-blue-divider rounded bg-white text-memorial-blue-tertiary font-poppins text-sm placeholder-memorial-blue-tertiary resize-none"
            />
            <div className="absolute bottom-3 right-4 text-xs text-memorial-blue-tertiary font-poppins">
                {value.length}/{maxLength}
            </div>
        </div>
    )
}

export default function ClassicTemplateMode() {
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [featured, setFeatured] = useState<File[]>([])
    const [video, setVideo] = useState<File[]>([])
    const [photos, setPhotos] = useState<File[]>([])
    const [lifeStory, setLifeStory] = useState<File[]>([])
    const [landingModeId, setLandingModeId] = useState<string>('')
    const [templateId, setTemplateId] = useState<string>('')
    const navigate = useNavigate()
    const location = useLocation()
    const { fetchMemorials, setActiveMemorialId } = useMemorialStore()
    const { mode, memorialId } = location.state || {}
    const [isEditMode, setIsEditMode] = useState(mode === 'edit')
    const [existingMemorialData, setExistingMemorialData] = useState<any>(null)

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            personName: '',
            personGender: Gender.MALE,
            personBirthDate: null as Date | null,
            personDeathDate: null as Date | null,
            favQuote: '',
            videoTitle: '',
            favoriteSaying: '',
            quoteBy: '',
            lifeStoryText: '',
        },
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const templatesRes: any = await apiGetMemorialTemplateList()
                const classicTemplate = templatesRes.find(
                    (t: any) => t.landingMode?.landingModeType === 'full-mode',
                )

                if (classicTemplate) {
                    setTemplateId(classicTemplate.id)
                    // Use the landingModeId directly from the template object
                    setLandingModeId(classicTemplate.landingModeId)
                }

                if (isEditMode && memorialId) {
                    const memorialRes: any = await apiGetMemorialById(
                        memorialId,
                    )
                    if (memorialRes) {
                        setExistingMemorialData(memorialRes)
                        reset({
                            personName: memorialRes.personName || '',
                            personGender:
                                memorialRes.personGender || Gender.MALE,
                            personBirthDate: memorialRes.personBirthDate
                                ? new Date(memorialRes.personBirthDate)
                                : null,
                            personDeathDate: memorialRes.personDeathDate
                                ? new Date(memorialRes.personDeathDate)
                                : null,
                            favQuote: memorialRes.favQuote || '',
                            favoriteSaying:
                                memorialRes.favoriteSayings?.[0]?.content || '',
                            quoteBy:
                                memorialRes.favoriteSayings?.[0]?.authorName ||
                                '',
                            videoTitle:
                                memorialRes.userMedia?.find(
                                    (m: any) => m.type === MediaType.VIDEO,
                                )?.videoTitle || '',
                            lifeStoryText: memorialRes.lifeStoryText || '',
                        })

                        if (memorialRes.personProfilePicture) {
                            setProfileImage(memorialRes.personProfilePicture)
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [isEditMode, memorialId, reset])

    const genderOptions = [
        { value: Gender.MALE, label: 'Male' },
        { value: Gender.FEMALE, label: 'Female' },
        { value: Gender.PREFER_NOT_TO_SAY, label: 'Prefer not to say' },
    ]

    const onSubmit = async (data: any) => {
        try {
            const payload: any = {
                favSaying: data.favoriteSaying,
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
                personProfilePicture: 'https://cdn.example.com/photos/john.jpg', // profileImage || 'https://cdn.example.com/photos/john.jpg',
                favQuote: data.favQuote,
                pageURL: `https://rememberme.com/memorial/${data.personName.toLowerCase().replace(/\s+/g, '-')}`,
                featuredPhotoId: 'featured-photo-id',
                featuredPhotoURL:
                    'https://cdn.example.com/photos/featured-john.jpg',
                lifeStoryText: data.lifeStoryText,
                lifeStoryImageId: 'life-story-image-id',
                lifeStoryImageURL:
                    'https://cdn.example.com/photos/life-story.jpg',
                publishStatus: PublishStatus.DRAFT,
                userMedia: [
                    ...photos.map((file: File, index: number) => ({
                        mimeType: file.type,
                        fileURL: 'https://cdn.example.com/uploads/photo1.jpg',
                        fileId: `photo-${index}`,
                        type: MediaType.PHOTO,
                        category: MediaCategory.GALLERY,
                        photoCaption: '',
                        photoDescription: '',
                        isActive: true,
                        sortOrder: index,
                    })),
                    ...video.map((file: File, index: number) => ({
                        mimeType: file.type,
                        fileURL: 'https://cdn.example.com/uploads/video1.mp4',
                        fileId: `video-${index}`,
                        type: MediaType.VIDEO,
                        category: MediaCategory.GALLERY,
                        videoTitle: data.videoTitle || 'Memorial Video',
                        videoDescription: '',
                        isMainVideo: false,
                        isActive: true,
                        sortOrder: photos.length + index,
                    })),
                ],
                userTributes: [],
                favoriteSayings: [
                    {
                        content: data.favoriteSaying,
                        authorName: data.quoteBy,
                    },
                ],
            }

            if (payload.userMedia) {
                const vidIndex = payload.userMedia.findIndex(
                    (m: any) => m.type === MediaType.VIDEO,
                )
                if (vidIndex > -1) {
                    payload.userMedia[vidIndex].videoTitle = data.videoTitle
                }
            }

            if (isEditMode && memorialId && existingMemorialData) {
                // Update Logic
                // Exclude properties that should not be in the payload
                const {
                    id,
                    creatorId,
                    landingMode,
                    favoriteSayings,
                    qrCode,
                    favSayings,
                    ...restExistingData
                } = existingMemorialData

                // Also exclude favoriteSayings from the new payload for edit mode
                const { favoriteSayings: _, ...payloadForUpdate } = payload

                const updatePayload = {
                    ...restExistingData,
                    ...payloadForUpdate,
                    userMedia: [
                        ...(existingMemorialData.userMedia || []),
                        ...payload.userMedia,
                    ],
                }
                await apiUpdateMemorial(memorialId, updatePayload)
                toast.push(
                    <Notification
                        type="success"
                        title="Success"
                        duration={2000}
                    >
                        Memorial updated successfully!
                    </Notification>,
                    { placement: 'top-center' },
                )
            } else {
                // Create Logic
                const response: any = await apiCreateMemorial(payload)
                if (response && response.id) {
                    setActiveMemorialId(response.id)
                }
                toast.push(
                    <Notification
                        type="success"
                        title="Success"
                        duration={2000}
                    >
                        Memorial created successfully!
                    </Notification>,
                    { placement: 'top-center' },
                )
            }

            await fetchMemorials(true)
            navigate('/dashboard/memorial')
        } catch (error) {
            console.error('Error creating memorial:', error)
            toast.push(
                <Notification type="danger" title="Error" duration={2000}>
                    Failed to save memorial. Please try again.
                </Notification>,
                { placement: 'top-center' },
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
                                {isEditMode
                                    ? 'Edit Memorial'
                                    : 'Template Full Memorial Mode'}
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
                                        // For now, we are not using base64. Later we will use it.
                                        /*
                                         const reader = new FileReader()
                                         reader.onload = () =>
                                             setProfileImage(
                                                 reader.result as string,
                                             )
                                         reader.readAsDataURL(file)
                                         */
                                        console.log(
                                            'File selected:',
                                            file.name,
                                        )
                                    }
                                }}
                            />
                        </div>

                        {/* Basic Info */}
                        <div className="w-full bg-[#2f3349] rounded-lg p-6 shadow">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CommonInput
                                        name="personName"
                                        control={control}
                                        value="Full Name"
                                    />
                                    <CommonSelect
                                        name="personGender"
                                        control={control}
                                        options={genderOptions}
                                        placeholder="Gender"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CommonDatePicker
                                        name="personBirthDate"
                                        control={control}
                                        value="Date of Birth"
                                        type="date"
                                        inputSuffix={
                                            <ChevronDown className="w-4 h-4 text-[#A1A1AA]" />
                                        }
                                    />
                                    <CommonDatePicker
                                        name="personDeathDate"
                                        control={control}
                                        value="Date of Death"
                                        type="date"
                                        inputSuffix={
                                            <ChevronDown className="w-4 h-4 text-[#A1A1AA]" />
                                        }
                                    />
                                </div>
                            </div>
                            <div className="mt-6">
                                <CommonInput
                                    name="favQuote"
                                    control={control}
                                    label="Write a Quote (Optional)"
                                    placeholder="Type here..."
                                    maxLength={150}
                                    rows={3}
                                    textArea
                                />
                            </div>
                        </div>
                    </div>

                    {/* Featured Photo */}
                    <FormSection
                        title={
                            <span className="font-poppins font-[500] md:text-[18px] text-base text-[#ffffff]">
                                Upload Featured Photo
                            </span>
                        }
                        className="mb-8"
                    >
                        <Upload
                            accept="image/*"
                            uploadLimit={1}
                            onChange={setFeatured}
                        />
                    </FormSection>

                    {/* Upload Video */}
                    <FormSection
                        title={
                            <span className="font-poppins font-[500] md:text-[18px] text-base text-[#ffffff]">
                                Upload Video
                            </span>
                        }
                        className="mb-8"
                    >
                        <Upload
                            accept="video/*"
                            uploadLimit={1}
                            onChange={setVideo}
                        />
                        <div className="mt-4">
                            <CommonInput
                                name="videoTitle"
                                control={control}
                                label="Video Title"
                                placeholder="Enter Video Title"
                            />
                        </div>
                    </FormSection>

                    {/* Upload Photo */}
                    <FormSection
                        title={
                            <span className="font-poppins font-[500] md:text-[18px] text-base text-[#ffffff]">
                                Upload Photo
                            </span>
                        }
                        className="mb-8"
                    >
                        <Upload
                            accept="image/*"
                            multiple
                            onChange={setPhotos}
                        />
                    </FormSection>

                    {/* Favorite Sayings */}
                    <FormSection
                        title={
                            <span className="font-poppins font-[500] md:text-[18px] text-base text-[#ffffff]">
                                Favorite Sayings
                            </span>
                        }
                        className="mb-8"
                    >
                        <div className="mb-4">
                            <CommonInput
                                name="favoriteSaying"
                                control={control}
                                label="Favorite Sayings (Optional)"
                                placeholder="Enter sayings here..."
                            />
                        </div>
                        <div>
                            <CommonInput
                                name="quoteBy"
                                control={control}
                                label="Quote By (Optional)"
                                placeholder="Enter Name"
                            />
                        </div>
                    </FormSection>

                    {/* Life Story */}
                    <FormSection
                        title={
                            <span className="font-poppins font-[500] md:text-[18px] text-base text-[#ffffff]">
                                Life Story
                            </span>
                        }
                        className="mb-8"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Upload
                                accept="image/*"
                                uploadLimit={1}
                                onChange={setLifeStory}
                            />
                            <div>
                                <CommonInput
                                    name="lifeStoryText"
                                    control={control}
                                    label="Life Story"
                                    textArea
                                    placeholder="Type here..."
                                    maxLength={500}
                                    rows={8}
                                />
                            </div>
                        </div>
                    </FormSection>

                    {/* Footer Actions */}
                    <div className=" px-6 py-6 flex justify-between items-center rounded-lg shadow-sm">
                        <button
                            onClick={handlePreview}
                            className="px-6 font-[500] md:text-base text-sm py-2.5 border text-[#4EB1C9] rounded-[76px] font-poppins"
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
                            {isEditMode ? 'Update & Finish' : 'Save & Finish'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
