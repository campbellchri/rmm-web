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
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { apiUploadMedia } from '@/services/MediaService'
import {
    MediaCategory,
    MediaType,
    PublishStatus,
    Gender,
} from '@/constants/memorial.constant'
import { useMemorialStore } from '@/store/memorialStore'
import { useMediaStore } from '@/store/mediaStore'

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

const validationSchema = z.object({
    personName: z.string().min(1, { message: 'Full Name is required' }),
    personGender: z.string().min(1, { message: 'Gender is required' }),
    personBirthDate: z.date({
        required_error: 'Date of Birth is required',
        invalid_type_error: 'Invalid date format',
    }),
    personDeathDate: z.date({
        required_error: 'Date of Death is required',
        invalid_type_error: 'Invalid date format',
    }),
    videoTitle: z.string().min(1, { message: 'Video Title is required' }),
    lifeStoryText: z.string().min(1, { message: 'Life Story is required' }),
    favQuote: z.string().optional(),
    favoriteSaying: z.string().optional(),
    quoteBy: z.string().optional(),
    featuredPhoto: z.any().refine((val) => !!val, { message: 'Featured Photo is required' }),
    videoUploaded: z.any().refine((val) => Array.isArray(val) && val.length > 0, { message: 'At least one video is required' }),
    photoUploaded: z.any().refine((val) => Array.isArray(val) && val.length > 0, { message: 'At least one photo is required' }),
    lifeStoryImage: z.any().refine((val) => !!val, { message: 'Life Story Image is required' }),
})

type FormSchema = z.infer<typeof validationSchema>

export default function ClassicTemplateMode() {
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [profileFile, setProfileFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [uploadingProfile, setUploadingProfile] = useState(false)
    const [uploadingFeatured, setUploadingFeatured] = useState(false)
    const [uploadingPhotos, setUploadingPhotos] = useState(false)
    const [uploadingVideos, setUploadingVideos] = useState(false)
    const [uploadingLifeStory, setUploadingLifeStory] = useState(false)
    const [profileData, setProfileData] = useState<any>(null)
    const [featuredData, setFeaturedData] = useState<any>(null)
    // Structured state to track which file belongs to which response
    const [videoData, setVideoData] = useState<{ file: File | any, res: any }[]>([])
    const [photosData, setPhotosData] = useState<{ file: File | any, res: any }[]>([])
    const [lifeStoryData, setLifeStoryData] = useState<any>(null)
    const [landingModeId, setLandingModeId] = useState<string>('')
    const { addMedia, getMedia, clearMedia } = useMediaStore()
    const [templateId, setTemplateId] = useState<string>('')
    const navigate = useNavigate()
    const location = useLocation()
    const { fetchMemorials, setActiveMemorialId } = useMemorialStore()
    const { mode, memorialId } = location.state || {}
    const [isEditMode, setIsEditMode] = useState(mode === 'edit')
    const [existingMemorialData, setExistingMemorialData] = useState<any>(null)

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            personName: '',
            personGender: '',
            personBirthDate: undefined,
            personDeathDate: undefined,
            favQuote: '',
            videoTitle: '',
            favoriteSaying: '',
            quoteBy: '',
            lifeStoryText: '',
            featuredPhoto: undefined,
            videoUploaded: [],
            photoUploaded: [],
            lifeStoryImage: undefined,
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
                            personGender: memorialRes.personGender || '',
                            personBirthDate: memorialRes.personBirthDate
                                ? new Date(memorialRes.personBirthDate)
                                : undefined,
                            personDeathDate: memorialRes.personDeathDate
                                ? new Date(memorialRes.personDeathDate)
                                : undefined,
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
                            featuredPhoto: memorialRes.featuredPhotoURL || undefined,
                            videoUploaded: memorialRes.userMedia?.filter((m: any) => m.type === MediaType.VIDEO && m.category === MediaCategory.GALLERY) || [],
                            photoUploaded: memorialRes.userMedia?.filter((m: any) => m.type === MediaType.PHOTO && m.category === MediaCategory.GALLERY) || [],
                            lifeStoryImage: memorialRes.lifeStoryImageURL || undefined,
                        })

                        if (memorialRes.personProfilePicture) {
                            setProfileImage(memorialRes.personProfilePicture)
                        }

                        // Populate existing media
                        if (memorialRes.featuredPhotoURL) {
                            setFeaturedData({
                                fileURL: memorialRes.featuredPhotoURL,
                                fileId: memorialRes.featuredPhotoId,
                                mimeType: 'image/jpeg', // Default or from API if available
                            })
                        }

                        if (memorialRes.lifeStoryImageURL) {
                            setLifeStoryData({
                                fileURL: memorialRes.lifeStoryImageURL,
                                fileId: memorialRes.lifeStoryImageId,
                                mimeType: 'image/jpeg',
                            })
                        }

                        if (memorialRes.userMedia) {
                            const photos = memorialRes.userMedia
                                .filter((m: any) => m.type === MediaType.PHOTO && m.category === MediaCategory.GALLERY)
                                .map((m: any) => ({
                                    file: { fileURL: m.fileURL, mimeType: m.mimeType, fileId: m.fileId },
                                    res: m
                                }))
                            setPhotosData(photos)

                            const videos = memorialRes.userMedia
                                .filter((m: any) => m.type === MediaType.VIDEO && m.category === MediaCategory.GALLERY)
                                .map((m: any) => ({
                                    file: { fileURL: m.fileURL, mimeType: m.mimeType, fileId: m.fileId },
                                    res: m
                                }))
                            setVideoData(videos)
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

    const uploadFiles = async (files: File[]) => {
        if (files.length === 0) return []

        const results: any[] = []
        const filesToUpload: File[] = []
        const indicesToUpload: number[] = []

        files.forEach((file, index) => {
            const key = `${file.name}-${file.size}`
            const stored = getMedia(key)
            if (stored) {
                results[index] = stored
            } else {
                filesToUpload.push(file)
                indicesToUpload.push(index)
            }
        })

        if (filesToUpload.length > 0) {
            const formData = new FormData()
            filesToUpload.forEach((file) => {
                formData.append('files', file)
            })
            try {
                const response: any = await apiUploadMedia(formData)
                // response is an array of upload data
                response.forEach((res: any, i: number) => {
                    const originalIndex = indicesToUpload[i]
                    const file = filesToUpload[i]
                    const key = `${file.name}-${file.size}`
                    addMedia(key, res)
                    results[originalIndex] = res
                })
            } catch (error) {
                console.error('Upload failed:', error)
                toast.push(
                    <Notification type="danger" title="Upload Failed" duration={2000}>
                        Failed to upload one or more files.
                    </Notification>,
                    { placement: 'top-center' }
                )
                // results at those indices will remain undefined
            }
        }

        return results
    }

    const handleProfileUpload = async (file: File) => {
        setUploadingProfile(true)
        const res = await uploadFiles([file])
        if (res && res.length > 0) {
            setProfileData(res[0])
            setProfileImage(res[0].fileURL)
        }
        setUploadingProfile(false)
    }

    const handleFeaturedPhotoUpload = async (files: (File | any)[]) => {
        if (files.length === 0) {
            setFeaturedData(null)
            return
        }

        const file = files[0]
        if (!(file instanceof File)) {
            // It's existing media
            setFeaturedData(file)
            return
        }

        setUploadingFeatured(true)
        const res = await uploadFiles([file])
        if (res && res.length > 0) {
            setFeaturedData(res[0])
            setValue('featuredPhoto', res[0].fileURL)
        }
        setUploadingFeatured(false)
    }

    const handleLifeStoryImageUpload = async (files: (File | any)[]) => {
        if (files.length === 0) {
            setLifeStoryData(null)
            setValue('lifeStoryImage', undefined)
            return
        }

        const file = files[0]
        if (!(file instanceof File)) {
            // It's existing media
            setLifeStoryData(file)
            setValue('lifeStoryImage', file.fileURL)
            return
        }

        setUploadingLifeStory(true)
        const res = await uploadFiles([file])
        if (res && res.length > 0) {
            setLifeStoryData(res[0])
            setValue('lifeStoryImage', res[0].fileURL)
        }
        setUploadingLifeStory(false)
    }

    const handleGalleryPhotosUpload = async (files: (File | any)[]) => {
        // Separate existing media and newly added files
        const existingEntries = photosData.filter(p => files.includes(p.file))
        const newFiles = files.filter(f => f instanceof File) as File[]

        if (newFiles.length > 0) {
            setUploadingPhotos(true)
            const res = await uploadFiles(newFiles)
            const newData = newFiles.map((file, i) => ({ file, res: res[i] }))
            const updatedPhotos = [...existingEntries, ...newData]
            setPhotosData(updatedPhotos)
            setValue('photoUploaded', updatedPhotos.map(p => p.res || p.file))
            setUploadingPhotos(false)
        } else {
            setPhotosData(existingEntries)
            setValue('photoUploaded', existingEntries.map(p => p.res || p.file))
        }
    }

    const handleGalleryVideosUpload = async (files: (File | any)[]) => {
        const existingEntries = videoData.filter(v => files.includes(v.file))
        const newFiles = files.filter(f => f instanceof File) as File[]

        if (newFiles.length > 0) {
            setUploadingVideos(true)
            const res = await uploadFiles(newFiles)
            const newData = newFiles.map((file, i) => ({ file, res: res[i] }))
            const updatedVideos = [...existingEntries, ...newData]
            setVideoData(updatedVideos)
            setValue('videoUploaded', updatedVideos.map(v => v.res || v.file))
            setUploadingVideos(false)
        } else {
            setVideoData(existingEntries)
            setValue('videoUploaded', existingEntries.map(v => v.res || v.file))
        }
    }

    const onSubmit = async (data: any) => {
        setIsSubmitting(true)
        try {
            const payload: any = {
                landingModeId: landingModeId.toString(),
                templateId: templateId,
                personName: data.personName,
                personGender: data.personGender,
                personBirthDate: data.personBirthDate
                    ? dayjs(data.personBirthDate).toISOString()
                    : null,
                personDeathDate: data.personDeathDate
                    ? dayjs(data.personDeathDate).toISOString()
                    : null,
                profilePictureId: profileData?.fileId || (isEditMode ? existingMemorialData?.profilePictureId : null),
                personProfilePicture: profileData?.fileURL || profileImage || null,
                favQuote: data.favQuote,
                pageURL: `${window.location.origin}/memorial/${data.personName.toLowerCase().replace(/\s+/g, '-')}`,
                featuredPhotoId: featuredData?.fileId || null,
                featuredPhotoURL: featuredData?.fileURL || null,
                lifeStoryText: data.lifeStoryText,
                lifeStoryImageId: lifeStoryData?.fileId || null,
                lifeStoryImageURL: lifeStoryData?.fileURL || null,
                eventStart: isEditMode ? existingMemorialData?.eventStart : dayjs().toISOString(),
                eventDuration: isEditMode ? existingMemorialData?.eventDuration : "48h",
                autoRevertToFullMode: isEditMode ? existingMemorialData?.autoRevertToFullMode : true,
                publishStatus: PublishStatus.DRAFT,
                userMedia: [
                    ...photosData
                        .filter(item => !!item.res?.fileURL)
                        .map((item, index: number) => ({
                            mimeType: item.res?.mimeType || (item.file instanceof File ? item.file.type : item.file.mimeType) || 'image/jpeg',
                            fileURL: item.res?.fileURL,
                            fileId: item.res?.fileId,
                            type: MediaType.PHOTO,
                            category: MediaCategory.GALLERY,
                            photoCaption: item.res?.photoCaption || '',
                            photoDescription: item.res?.photoDescription || '',
                            isActive: true,
                            sortOrder: index,
                        })),
                    ...videoData
                        .filter(item => !!item.res?.fileURL)
                        .map((item, index: number) => ({
                            mimeType: item.res?.mimeType || (item.file instanceof File ? item.file.type : item.file.mimeType) || 'video/mp4',
                            fileURL: item.res?.fileURL,
                            fileId: item.res?.fileId,
                            type: MediaType.VIDEO,
                            category: MediaCategory.GALLERY,
                            videoTitle: item.res?.videoTitle || data.videoTitle || 'Memorial Video',
                            videoDescription: item.res?.videoDescription || '',
                            isMainVideo: index === 0,
                            isActive: true,
                            sortOrder: photosData.length + index,
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

            console.log('Final Memorial Payload:', JSON.stringify(payload, null, 2))

            if (payload.userMedia) {
                const vidIndex = payload.userMedia.findIndex(
                    (m: any) => m.type === MediaType.VIDEO,
                )
                if (vidIndex > -1) {
                    payload.userMedia[vidIndex].videoTitle = data.videoTitle
                }
            }

            if (isEditMode && memorialId && existingMemorialData) {
                const {
                    id,
                    creatorId,
                    landingMode,
                    favoriteSayings,
                    qrCode,
                    favSayings,
                    photos,
                    videos,
                    ...restExistingData
                } = existingMemorialData

                // Also exclude favoriteSayings from the new payload for edit mode
                const { favoriteSayings: _, ...payloadForUpdate } = payload

                const updatePayload = {
                    ...restExistingData,
                    ...payloadForUpdate,
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
            clearMedia() // Clear persisted media responses after successful save
            navigate('/dashboard/memorial')
        } catch (error: any) {
            console.error('Error saving memorial:', error)
            const errorMsg = error.response?.data?.message || error.message || 'Failed to save memorial.'
            toast.push(
                <Notification type="danger" title="Error" duration={5000}>
                    {errorMsg}
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmitting(false)
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

                    <div className="flex flex-col items-center gap-5 mb-8">
                        <div className="flex items-center gap-4">
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

                            <button
                                type="button"
                                disabled={uploadingProfile}
                                onClick={() =>
                                    document
                                        .getElementById('profileUpload')
                                        ?.click()
                                }
                                className="md:px-6 px-3 font-medium text-[21.26px] leading-[24.8px] tracking-normal text-center py-2.5 border text-[#FFB84C] rounded-[26px] font-poppins border-[#FFB84C] disabled:opacity-50"
                            >
                                {uploadingProfile ? 'Uploading...' : 'Upload Profile'}
                            </button>

                            <input
                                id="profileUpload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        setProfileFile(file)
                                        handleProfileUpload(file)
                                        console.log(
                                            'File selected:',
                                            file.name,
                                        )
                                    }
                                }}
                            />
                        </div>

                        <div className="w-full bg-[#2f3349] rounded-lg p-6 shadow">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CommonInput
                                        name="personName"
                                        control={control}
                                        placeholder="Full Name"
                                        invalid={Boolean(errors.personName)}
                                        errorMessage={errors.personName?.message}
                                    />
                                    <CommonSelect
                                        name="personGender"
                                        control={control}
                                        options={genderOptions}
                                        placeholder="Gender"
                                        invalid={Boolean(errors.personGender)}
                                        errorMessage={errors.personGender?.message}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CommonDatePicker
                                        name="personBirthDate"
                                        control={control}
                                        placeholder="Date of Birth"
                                        invalid={Boolean(errors.personBirthDate)}
                                        errorMessage={errors.personBirthDate?.message}
                                        inputSuffix={
                                            <ChevronDown className="w-4 h-4 text-[#A1A1AA]" />
                                        }
                                    />
                                    <CommonDatePicker
                                        name="personDeathDate"
                                        control={control}
                                        placeholder="Date of Death"
                                        invalid={Boolean(errors.personDeathDate)}
                                        errorMessage={errors.personDeathDate?.message}
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
                            onChange={handleFeaturedPhotoUpload}
                            onFileRemove={() => {
                                handleFeaturedPhotoUpload([])
                                setValue('featuredPhoto', undefined)
                            }}
                            uploading={uploadingFeatured}
                            defaultFiles={featuredData ? [featuredData] : []}
                        />
                        {errors.featuredPhoto && (
                            <p className="text-red-500 text-sm mt-2">{(errors.featuredPhoto as any).message}</p>
                        )}
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
                            onChange={handleGalleryVideosUpload}
                            onFileRemove={(files) => {
                                handleGalleryVideosUpload(files)
                                if (files.length === 0) setValue('videoUploaded', [])
                            }}
                            uploading={uploadingVideos}
                            defaultFiles={videoData.map(v => v.file)}
                        />
                        {errors.videoUploaded && (
                            <p className="text-red-500 text-sm mt-2">{(errors.videoUploaded as any).message}</p>
                        )}
                        <div className="mt-4">
                            <CommonInput
                                name="videoTitle"
                                control={control}
                                label="Video Title"
                                placeholder="Enter Video Title"
                                invalid={Boolean(errors.videoTitle)}
                                errorMessage={errors.videoTitle?.message}
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
                            onChange={handleGalleryPhotosUpload}
                            onFileRemove={(files) => {
                                handleGalleryPhotosUpload(files)
                                if (files.length === 0) setValue('photoUploaded', [])
                            }}
                            uploading={uploadingPhotos}
                            defaultFiles={photosData.map(p => p.file)}
                        />
                        {errors.photoUploaded && (
                            <p className="text-red-500 text-sm mt-2">{(errors.photoUploaded as any).message}</p>
                        )}
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
                            <div>
                                <Upload
                                    accept="image/*"
                                    uploadLimit={1}
                                    onChange={handleLifeStoryImageUpload}
                                    onFileRemove={() => handleLifeStoryImageUpload([])}
                                    uploading={uploadingLifeStory}
                                    defaultFiles={lifeStoryData ? [lifeStoryData] : []}
                                />
                                {errors.lifeStoryImage && (
                                    <p className="text-red-500 text-sm mt-2">{(errors.lifeStoryImage as any).message}</p>
                                )}
                            </div>
                            <div>
                                <CommonInput
                                    name="lifeStoryText"
                                    control={control}
                                    label="Life Story"
                                    textArea
                                    placeholder="Type here..."
                                    maxLength={500}
                                    rows={8}
                                    invalid={Boolean(errors.lifeStoryText)}
                                    errorMessage={errors.lifeStoryText?.message}
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
                            disabled={isSubmitting}
                            onClick={handleSaveFinish}
                            className="bg-[#C7A30D] text-[#000000] font-[500] font-poppins text-base px-6 py-2.5 hover:bg-[#B8940C] transition-colors rounded-[1000px] disabled:opacity-50"
                            style={{
                                background: isSubmitting ? 'gray' :
                                    'linear-gradient(96.23deg, #ECA024 5.01%, #F9C94F 50.03%, #EAA32A 95.05%)',
                            }}
                        >
                            {isSubmitting ? 'Saving...' : (isEditMode ? 'Update & Finish' : 'Save & Finish')}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
