import { useState, useEffect } from 'react'
import { Clock, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
    TimeInput,
    Upload,
    toast,
    Notification,
} from '@/components/ui'
import { useForm, Controller } from 'react-hook-form'
import {
    apiCreateMemorial,
    apiGetMemorialModeList,
    apiGetMemorialTemplateList,
} from '@/services/axios/MemorialModeService'
import dayjs from 'dayjs'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { apiUploadMedia, apiDeleteMedia, apiDeleteGCPFile } from '@/services/MediaService'
import {
    MediaCategory,
    MediaType,
    PublishStatus,
} from '@/constants/memorial.constant'
import { useMemorialStore } from '@/store/memorialStore'
import { useMediaStore } from '@/store/mediaStore'
import useAuth from '@/auth/useAuth'
import {
    CommonInput,
    CommonSelect,
    CommonDatePicker,
} from '@/components/shared'


const validationSchema = z.object({
    personName: z.string().trim().min(1, { message: 'Full Name is required' }),
    favQuote: z.string().optional(),
    eventStartDate: z.date({
        required_error: 'Start Date is required',
        invalid_type_error: 'Invalid date format',
    }).refine(date => date instanceof Date && !isNaN(date.getTime()), {
        message: 'Start Date is required'
    }),
    eventStartTime: z.date({
        required_error: 'Start Time is required',
        invalid_type_error: 'Invalid date format',
    }).refine(date => date instanceof Date && !isNaN(date.getTime()), {
        message: 'Start Time is required'
    }),
    eventDuration: z.string().min(1, { message: 'Duration is required' }),
    videoTitle: z.string().trim().min(1, { message: 'Video Title is required' }),
    profilePicture: z.any().optional(),
    eventVideo: z.any().refine((val) => !!val, { message: 'Event Video is required' }),
}).refine(
    (data) => {
        if (!data.eventStartDate || !data.eventStartTime) return true;
        
        // Combine date + time in LOCAL timezone (matches UI components)
        const combined = dayjs(data.eventStartDate)
            .hour(dayjs(data.eventStartTime).hour())
            .minute(dayjs(data.eventStartTime).minute())
            .second(0)
            .millisecond(0);
        
        // Strictly require future datetime
        return combined.isAfter(dayjs());
    },
    {
        message: "Event start time must be in the future",
        path: ["eventStartTime"], // Shows error under time field
    }
);

type FormSchema = z.infer<typeof validationSchema>

export default function EventMode() {
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [uploadingProfile, setUploadingProfile] = useState(false)
    const [uploadingVideo, setUploadingVideo] = useState(false)
    const [profileData, setProfileData] = useState<any>(null)
    const [videoData, setVideoData] = useState<any>(null)
    const [landingModeId, setLandingModeId] = useState<string>('')
    const [templateId, setTemplateId] = useState<string>('')
    const [uploadKey, setUploadKey] = useState(0) // Force re-render of Upload component
    const navigate = useNavigate()
    const { fetchMemorials, setActiveMemorialId } = useMemorialStore()
    const [profileFile, setProfileFile] = useState<File | null>(null)
    const { addMedia, getMedia, clearMedia } = useMediaStore()
    const { user } = useAuth()

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors }
    } = useForm<FormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            personName: '',
            favQuote: '',
            eventStartDate: undefined,
            eventStartTime: undefined,
            eventDuration: '48h',
            videoTitle: '',
            profilePicture: undefined,
            eventVideo: undefined,
        },
    })

    const durationOptions = [
        { value: '48h', label: '48h' },
        { value: '24h', label: '24h' },
        { value: '72h', label: '72h' },
        { value: '1 week', label: '1 week' },
    ]

    useEffect(() => {
        const fetchData = async () => {
            try {
                const templatesRes: any = await apiGetMemorialTemplateList()
                const eventTemplate = templatesRes.find(
                    (t: any) =>
                        t.landingMode?.landingModeType === 'event-mode',
                )

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

    const uploadFiles = async (files: File[]) => {
        if (files.length === 0) return []

        const results: any[] = []
        const filesToUpload: File[] = []
        const indicesToUpload: number[] = []

        files.forEach((file, index) => {
            filesToUpload.push(file)
            indicesToUpload.push(index)
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
            setValue('profilePicture', res[0].fileURL)
            // Save uploadId to store
            if (res[0].uploadId) {
                addMedia(`profile_${res[0].uploadId}`, res[0])
            }
        }
        setUploadingProfile(false)
    }

    const handleVideoUpload = async (files: (File | any)[]) => {
        if (files.length === 0) {
            if (videoData?.uploadId) {
                console.log('Attempting to delete video from GCP storage:', {
                    uploadId: videoData.uploadId,
                    fileId: videoData.fileId
                })
                try {
                    await apiDeleteGCPFile(videoData.uploadId)
                    toast.push(
                        <Notification
                            type="success"
                            title="Success"
                            duration={2000}
                        >
                            Video deleted successfully!
                        </Notification>,
                        { placement: 'top-center' },
                    )
                } catch (error: any) {
                    console.error('Error deleting video:', error)
                    console.error('Error response:', error?.response)
                    toast.push(
                        <Notification
                            type="danger"
                            title="Delete Failed"
                            duration={3000}
                        >
                            Failed to delete video: {error?.response?.data?.message || error?.message || 'Please try again'}
                        </Notification>,
                        { placement: 'top-center' },
                    )
                }
            }
            setVideoData(null)
            setValue('eventVideo', undefined)
            // Force re-render of Upload component to clear any cached file state
            setUploadKey(prev => prev + 1)
            return
        }

        const file = files[0]
        if (!(file instanceof File)) {
            // It's existing media
            setVideoData(file)
            return
        }

        if (videoData?.uploadId) {
            console.log('Attempting to delete old video from GCP storage before upload:', {
                uploadId: videoData.uploadId,
                fileId: videoData.fileId
            })
            try {
                await apiDeleteGCPFile(videoData.uploadId)
            } catch (error: any) {
                console.error('Error deleting old video:', error)
                console.error('Error response:', error?.response)
                toast.push(
                    <Notification
                        type="warning"
                        title="Warning"
                        duration={3000}
                    >
                        Failed to delete old video: {error?.response?.data?.message || error?.message || 'Continuing with upload...'}
                    </Notification>,
                    { placement: 'top-center' },
                )
            }
        }

        setUploadingVideo(true)
        const res = await uploadFiles([file])
        if (res && res.length > 0) {
            setVideoData(res[0])
            setValue('eventVideo', res[0].fileURL)
            // Save uploadId to store
            if (res[0].uploadId) {
                addMedia(`video_${res[0].uploadId}`, res[0])
            }
        }
        setUploadingVideo(false)
    }

        const validateSquareImage = (
    file: File,
    minSize = 400
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const url = URL.createObjectURL(file)

        img.onload = () => {
            const { width, height } = img
            URL.revokeObjectURL(url)

            if (width !== height) {
                reject('Image must be square (1:1 ratio)')
                return
            }

            if (width < minSize || height < minSize) {
                reject(`Image must be at least ${minSize} x ${minSize}px`)
                return
            }

            resolve()
        }

        img.onerror = () => {
            URL.revokeObjectURL(url)
            reject('Invalid image file')
        }

        img.src = url
    })
    }

    const onSubmit = async (data: any) => {
        setIsSubmitting(true)
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

            const mediaList = [
                ...(videoData
                    ? [
                        {
                            uploadId: videoData.uploadId,
                            mimeType: videoData.mimeType || 'video/mp4',
                            fileURL: videoData.fileURL,
                            fileId: videoData.fileId,
                            type: MediaType.VIDEO,
                            category: MediaCategory.GALLERY,
                            videoTitle: data.videoTitle || 'Event Video',
                            videoDescription: '',
                            isMainVideo: true,
                            isActive: true,
                            sortOrder: 0,
                        },
                    ]
                    : []),
            ]

            if (mediaList.length === 0) {
                mediaList.push({
                    mimeType: 'video/mp4',
                    fileURL:
                        'https://www.pexels.com/video/medical-training-855480/',
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

            const payload = {
                landingModeId: landingModeId.toString(),
                templateId: templateId,
                personName: data.personName,
                profilePictureId: profileData?.uploadId || null,
                personProfilePicture: profileData?.fileURL || profileImage || '',
                favQuote: data.favQuote,
                pageURL: `${window.location.origin}/memorial/${data.personName
                    .toLowerCase()
                    .replace(/\s+/g, '-')}`,
                eventStart: eventStart,
                eventDuration: data.eventDuration,
                autoRevertToFullMode: true,
                publishStatus: PublishStatus.DRAFT,
                userMedia: mediaList,
            }

            const response = await apiCreateMemorial(payload)
            console.log('API Response:', response)

            toast.push(
                <Notification type="success" title="Success" duration={2000}>
                    Event memorial created successfully!
                </Notification>,
                { placement: 'top-center' },
            )

            await fetchMemorials(true)
            clearMedia()
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
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSaveFinish = () => {
        const values = getValues(); // import getValues from useForm
        console.log('Form values:', values);
        console.log('Form errors:', errors);
        handleSubmit(onSubmit)();
    }

    const handlePreview = () => {
        console.log('Preview clicked')
    }

    return (
        <>
            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto">
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
                        <div className="flex flex-col items-center gap-5 mb-8">
                            <div className="flex items-center gap-8 w-full bg-[#2f3349] min-h-[180px] rounded-[14px] py-[20px] px-[30px]">
                            <div className="w-[96px] h-[96px] md:w-[120px] md:h-[120px] lg:w-[140px] lg:h-[140px]
                                rounded-[12px] overflow-hidden bg-[#E5E7EB] flex items-center justify-center">
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

                            <div className='flex flex-col gap-4'>
                                <p className='text-[#FFFFFF] text-[18px] font-[400] font-Arial'>Profile Photo</p>
                                <p className='text-[#99A1AF] text-[14px] font-[400] font-Arial'>
                                    Upload a high-quality photo of your loved one. This will be the main photo displayed on the memorial page.
                                </p>

                                <button
                                    type="button"
                                    disabled={uploadingProfile}
                                    onClick={() =>
                                        document
                                            .getElementById('profileUpload')
                                            ?.click()
                                    }
                                    className="md:px-[21px] py-[7px] px-3 font-medium text-[16px] font-[400] w-[max-content] leading-[24.8px] tracking-normal text-center py-2.5 border text-[#FFB84C] rounded-[26px] font-Arial border-[#FFB84C] disabled:opacity-50"
                                >
                                    {uploadingProfile
                                    ? 'Uploading...'
                                    : profileImage
                                        ? 'Change Photo'
                                        : 'Upload Profile'
                                }

                                </button>

                                <input
                                id="profileUpload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0]
                                    if (!file) return

                                    try {
                                        await validateSquareImage(file, 400)
                                        setProfileFile(file)
                                        handleProfileUpload(file)
                                    } catch (err: any) {
                                        toast.push(
                                            <Notification type="danger" title="Invalid Image" duration={3000}>
                                                {err}
                                            </Notification>,
                                            { placement: 'top-center' }
                                        )
                                    } finally {
                                        e.target.value = '' // reset input
                                    }
                                }}
                            />

                                <p className='text-[#6A7282] text-[12px] font-[400] font-Arial'>Recommended: Square image, at least 400 x 400px</p>
                                {!profileImage && isSubmitting && (
                                <p className='text-[#e26253] text-[12px] font-[400] font-Arial mt-1'>
                                    Profile picture is required
                                </p>
                                )}
                            </div>

                        </div>
                            {/* <div className="flex items-center gap-4">
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
                                    {uploadingProfile
                                        ? 'Uploading...'
                                        : 'Upload Profile'}
                                </button>

                                <input
                                    id="profileUpload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            handleProfileUpload(file)
                                            e.target.value = ''
                                        }
                                    }}
                                />
                            </div> */}

                            <div className="w-full bg-[#2f3349] rounded-lg p-6 shadow">
                                <CommonInput
                                    name="personName"
                                    control={control}
                                    placeholder="Full Name"
                                    invalid={Boolean(errors.personName)}
                                    errorMessage={errors.personName?.message}
                                />
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

                        <div className="bg-[#2f3349] rounded-lg p-6 shadow">
                            <p className="text-base font-poppins font-[400] text-[#ffffff] mb-4">
                                Event Duration
                            </p>

                            <div className="flex flex-col lg:flex-row gap-4 mb-5">
                                <div className="flex-1">
                                    <label className="block text-sm font-poppins text-white mb-1">
                                        Start Date & Time
                                    </label>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <div className="relative flex-1">
                                            <CommonDatePicker
                                                name="eventStartDate"
                                                control={control}
                                                placeholder="Select Date"
                                                invalid={Boolean(errors.eventStartDate)}
                                                errorMessage={errors.eventStartDate?.message}
                                                minDate={dayjs().startOf('day').toDate()}
                                            />
                                        </div>
                                        <div className="relative flex-1">
                                        <Controller
                                            name="eventStartTime"
                                            control={control}
                                            render={({ field }) => (
                                                <div>
                                                    <TimeInput
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        format="12"
                                                        showSeconds={false}
                                                        suffix={
                                                            <Clock className="w-4 h-4 text-memorial-gray-500 pointer-events-none" />
                                                        }
                                                        className={`text-white bg-[#383C56] border-none ${
                                                            errors.eventStartTime ? 'border-red-500' : ''
                                                        }`}
                                                    />
                                                    {errors.eventStartTime?.message && (
                                                        <p className="text-[#e26253] text-sm mt-1">
                                                            {errors.eventStartTime.message}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        />
                                    </div>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <label className="block text-sm font-poppins text-white mb-1">
                                        Duration
                                    </label>
                                    <div className="relative">
                                        <CommonSelect
                                            name="eventDuration"
                                            control={control}
                                            options={durationOptions}
                                            placeholder="Select duration"
                                            invalid={Boolean(errors.eventDuration)}
                                            errorMessage={errors.eventDuration?.message}
                                        />
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm font-poppins text-[#ffffff] opacity-80">
                                After the event period ends, your memorial will
                                automatically return to Full Memorial Mode.
                            </p>
                        </div>

                        <div className="bg-[#2f3349] rounded-lg p-6 shadow">
                            <p className="text-base font-poppins font-[400] text-[#ffffff] mb-4">
                                Upload Video
                            </p>
                            <div>
                                <Upload
                                    key={uploadKey}
                                    accept="video/*"
                                    uploadLimit={1}
                                    onChange={handleVideoUpload}
                                    onFileRemove={() => handleVideoUpload([])}
                                    uploading={uploadingVideo}
                                    defaultFiles={videoData ? [videoData] : []}
                                />
                                {errors.eventVideo && (
                                    <p className="text-[#e26253] text-sm mt-2">{(errors.eventVideo as any).message}</p>
                                )}
                            </div>

                            <div className="mt-3">
                                <CommonInput
                                    name="videoTitle"
                                    control={control}
                                    label="Video Title"
                                    placeholder="Enter Video Title "
                                    invalid={Boolean(errors.videoTitle)}
                                    errorMessage={errors.videoTitle?.message}
                                />
                            </div>
                        </div>

                        <div className="px-6 py-6 flex justify-between items-center rounded-lg shadow-sm">
                            <button
                                onClick={handlePreview}
                                className="px-6 font-[500] md:text-base text-sm py-2.5 border text-[#4EB1C9] border-[#4EB1C9] rounded-[76px] font-poppins"
                            >
                                Preview
                            </button>
                            <button
                                onClick={handleSaveFinish}
                                disabled={isSubmitting}
                                className="bg-[#C7A30D] text-[#000000] font-[500] font-poppins text-base px-6 py-2.5 hover:bg-[#B8940C] transition-colors rounded-[1000px] disabled:opacity-50"
                                style={{
                                    background: isSubmitting
                                        ? 'gray'
                                        : 'linear-gradient(96.23deg, #ECA024 5.01%, #F9C94F 50.03%, #EAA32A 95.05%)',
                                }}
                            >
                                {isSubmitting ? 'Saving...' : 'Save & Finish'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
