import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import Upload from '@/components/ui/Upload'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast, Notification } from '@/components/ui'
import { CommonInput, CommonSelect, CommonDatePicker } from '@/components/shared'
import { ChevronDown } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import {
    apiCreateMemorial,
    apiGetMemorialModeList,
    apiGetMemorialTemplateList,
    apiGetMemorialById,
    apiUpdateMemorial,
} from '@/services/axios/MemorialModeService'
import dayjs from 'dayjs'
import { apiUploadMedia, apiDeleteMedia } from '@/services/MediaService'
import {
    MediaCategory,
    MediaType,
    PublishStatus,
    Gender,
} from '@/constants/memorial.constant'
import { useMemorialStore } from '@/store/memorialStore'
import { useMediaStore } from '@/store/mediaStore'

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
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [uploadingProfile, setUploadingProfile] = useState(false)
    const [uploadingFeatured, setUploadingFeatured] = useState(false)
    const [uploadingVideos, setUploadingVideos] = useState(false)
    const [profileData, setProfileData] = useState<any>(null)
    const [featuredData, setFeaturedData] = useState<any>(null)
    const [videoData, setVideoData] = useState<{ file: File | any; res: any }[]>([])
    const { addMedia, getMedia, clearMedia } = useMediaStore()
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
                const videoTemplate = templatesRes.find(
                    (t: any) => t.landingMode?.landingModeType === 'video-only-mode',
                )

                if (videoTemplate) {
                    setTemplateId(videoTemplate.id)
                    setLandingModeId(videoTemplate.landingModeId)
                }

                if (isEditMode && memorialId) {
                    const memorialRes: any = await apiGetMemorialById(memorialId)
                    if (memorialRes) {
                        setExistingMemorialData(memorialRes)
                        reset({
                            personName: memorialRes.personName || '',
                            personGender: memorialRes.personGender || Gender.MALE,
                            personBirthDate: memorialRes.personBirthDate
                                ? new Date(memorialRes.personBirthDate)
                                : null,
                            personDeathDate: memorialRes.personDeathDate
                                ? new Date(memorialRes.personDeathDate)
                                : null,
                            favQuote: memorialRes.favQuote || '',
                            featuredVideoTitle:
                                memorialRes.userMedia?.find(
                                    (m: any) => m.category === MediaCategory.FEATURED,
                                )?.videoTitle || '',
                            favSaying:
                                memorialRes.userMedia?.find(
                                    (m: any) => m.category === MediaCategory.FEATURED,
                                )?.videoDescription || '',
                            galleryVideoTitle:
                                memorialRes.userMedia?.find(
                                    (m: any) => m.category === MediaCategory.GALLERY,
                                )?.videoTitle || '',
                        })

                        if (memorialRes.personProfilePicture) {
                            setProfileImage(memorialRes.personProfilePicture)
                        }

                        // Populate existing media
                        if (memorialRes.userMedia) {
                            const featured = memorialRes.userMedia.find(
                                (m: any) => m.category === MediaCategory.FEATURED,
                            )
                            if (featured) {
                                setFeaturedData({
                                    fileURL: featured.fileURL,
                                    mimeType: featured.mimeType,
                                    fileId: featured.fileId,
                                })
                            }

                            const gallery = memorialRes.userMedia
                                .filter((m: any) => m.category === MediaCategory.GALLERY)
                                .map((m: any) => ({
                                    file: { fileURL: m.fileURL, mimeType: m.mimeType, fileId: m.fileId },
                                    res: m
                                }))
                            setVideoData(gallery)
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching templates:', error)
            }
        }
        fetchData()
    }, [isEditMode, memorialId, reset])

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
                    <Notification
                        type="danger"
                        title="Upload Failed"
                        duration={2000}
                    >
                        Failed to upload one or more files.
                    </Notification>,
                    { placement: 'top-center' },
                )
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

    const handleFeaturedVideoUpload = async (files: (File | any)[]) => {
        if (files.length === 0) {
            if (featuredData?.fileId) {
                try {
                    await apiDeleteMedia(featuredData.fileId)
                } catch (error) {
                    console.error('Error deleting featured video:', error)
                }
            }
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
        }
        setUploadingFeatured(false)
    }

    const handleGalleryVideosUpload = async (files: (File | any)[]) => {
        // Find removed files to call delete API
        const removedFiles = videoData.filter(v => !files.some(f =>
            (f instanceof File ? f === v.file : (f.fileId === v.file.fileId || f.fileURL === v.file.fileURL))
        ))

        for (const removed of removedFiles) {
            const fileId = removed.res?.fileId || removed.file?.fileId
            if (fileId) {
                try {
                    await apiDeleteMedia(fileId)
                } catch (error) {
                    console.error('Error deleting gallery video:', error)
                }
            }
        }

        const existingEntries = videoData.filter(v => files.includes(v.file))
        const newFiles = files.filter(f => f instanceof File) as File[]

        if (newFiles.length > 0) {
            setUploadingVideos(true)
            const res = await uploadFiles(newFiles)
            const newData = newFiles.map((file, i) => ({ file, res: res[i] }))
            setVideoData([...existingEntries, ...newData])
            setUploadingVideos(false)
        } else {
            setVideoData(existingEntries)
        }
    }

    const onSubmit = async (data: any) => {
        setIsSubmitting(true)
        try {
            const mediaList = [
                ...(featuredData
                    ? [
                        {
                            mimeType: featuredData.mimeType || 'video/mp4',
                            fileURL: featuredData.fileURL,
                            fileId: featuredData.fileId,
                            type: MediaType.VIDEO,
                            category: MediaCategory.FEATURED,
                            videoTitle:
                                data.featuredVideoTitle || 'Featured Video',
                            videoDescription: data.favSaying || '',
                            isMainVideo: true,
                            isActive: true,
                            sortOrder: 0,
                        },
                    ]
                    : []),
                ...videoData
                    .filter((item) => !!item.res?.fileURL || !!item.file?.fileURL)
                    .map((item, index: number) => ({
                        mimeType:
                            item.res?.mimeType || (item.file instanceof File ? item.file.type : item.file.mimeType) || 'video/mp4',
                        fileURL: item.res?.fileURL || item.file?.fileURL,
                        fileId: item.res?.fileId || item.file?.fileId,
                        type: MediaType.VIDEO,
                        category: MediaCategory.GALLERY,
                        videoTitle: data.galleryVideoTitle || 'Gallery Video',
                        videoDescription: '',
                        isMainVideo: false,
                        isActive: true,
                        sortOrder: (featuredData ? 1 : 0) + index,
                    })),
            ]

            if (mediaList.length === 0 && !isEditMode) {
                mediaList.push({
                    mimeType: 'video/mp4',
                    fileURL:
                        'https://www.pexels.com/video/medical-training-855480/',
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
                profilePictureId:
                    profileData?.fileId ||
                    (isEditMode ? existingMemorialData?.profilePictureId : null),
                pageURL: `https://rememberme.com/memorial/${data.personName
                    .toLowerCase()
                    .replace(/\s+/g, '-')}`,
                personProfilePicture:
                    profileData?.fileURL || profileImage || '',
                favQuote: data.favQuote,
                publishStatus: PublishStatus.DRAFT,
                userMedia: mediaList,
            }

            console.log('Final Payload:', JSON.stringify(payload, null, 2))

            if (isEditMode && memorialId && existingMemorialData) {
                const {
                    id,
                    creatorId,
                    landingMode,
                    favoriteSayings,
                    qrCode,
                    favSayings,
                    ...restExistingData
                } = existingMemorialData

                const updatePayload = {
                    ...restExistingData,
                    ...payload,
                    userMedia: [
                        ...(existingMemorialData.userMedia || []).filter(
                            (m: any) =>
                                !mediaList.some(
                                    (nm) => m.category === nm.category,
                                ),
                        ),
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
                        Video memorial updated successfully!
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
                        Video memorial created successfully!
                    </Notification>,
                    { placement: 'top-center' },
                )
            }

            await fetchMemorials(true)
            clearMedia()
            navigate('/dashboard/video-memorial')
        } catch (error: any) {
            console.error('Error saving memorial:', error)
            const errorMsg =
                error.response?.data?.message ||
                error.message ||
                'Failed to save memorial.'
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
                                    : 'Template Video Only Mode'}
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
                                disabled={uploadingProfile}
                                onClick={() =>
                                    document
                                        .getElementById('profileUpload')
                                        ?.click()
                                }
                                className="md:px-6 px-3 font-medium text-[21.26px] leading-[24.8px] tracking-normal text-center py-2.5 border text-[#FFB84C] rounded-[26px] font-poppins border-[#FFB84C] disabled:opacity-50"
                            >
                                {uploadingProfile
                                    ? 'Uploading...'
                                    : 'Upload Profile'}
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
                                        handleProfileUpload(file)
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
                                        placeholder='Full Name'
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
                                        label="Date of Birth"
                                        type="date"
                                        inputSuffix={
                                            <ChevronDown className="w-4 h-4 text-[#A1A1AA]" />
                                        }
                                    />
                                    <CommonDatePicker
                                        name="personDeathDate"
                                        control={control}
                                        value="Date of Death"
                                        label="Date of Death"
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
                            onChange={handleFeaturedVideoUpload}
                            onFileRemove={() => handleFeaturedVideoUpload([])}
                            uploading={uploadingFeatured}
                            defaultFiles={featuredData ? [featuredData] : []}
                        />
                        <div className="mt-4">
                            <CommonInput
                                name="featuredVideoTitle"
                                control={control}
                                label="Video Title"
                                placeholder="Enter title here..."
                            />
                        </div>
                        <div className="mt-4">
                            <CommonInput
                                name="favSaying"
                                control={control}
                                label="Favorite Sayings (Optional)"
                                placeholder="Enter sayings here..."
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
                            onChange={handleGalleryVideosUpload}
                            onFileRemove={handleGalleryVideosUpload}
                            uploading={uploadingVideos}
                            defaultFiles={videoData.map(v => v.file)}
                        />
                        <div className="mt-4">
                            <CommonInput
                                name="galleryVideoTitle"
                                control={control}
                                label="Video Title"
                                placeholder="Enter Video Title here ..."
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
                            disabled={isSubmitting}
                            onClick={handleSaveFinish}
                            className="bg-[#C7A30D] text-[#000000] font-poppins font-[500] text-base px-6 py-2.5 rounded-[1000px] transition-colors font-medium border-none"
                            style={{
                                background: isSubmitting
                                    ? 'gray'
                                    : 'linear-gradient(96.23deg, #ECA024 5.01%, #F9C94F 50.03%, #EAA32A 95.05%)',
                            }}
                        >
                            {isSubmitting
                                ? 'Saving...'
                                : isEditMode
                                    ? 'Update & Finish'
                                    : 'Save & Finish'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
