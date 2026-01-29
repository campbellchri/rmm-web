import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import Upload from '@/components/ui/Upload'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast, Notification } from '@/components/ui'
import {
    CommonInput,
    CommonSelect,
    CommonDatePicker,
} from '@/components/shared'
import { ChevronDown } from 'lucide-react'
import { useForm, Controller, useWatch } from 'react-hook-form'
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
import {
    apiUploadMedia,
    apiDeleteMedia,
    apiDeleteGCPFile,
} from '@/services/MediaService'
import {
    MediaCategory,
    MediaType,
    PublishStatus,
    Gender,
} from '@/constants/memorial.constant'
import { useMemorialStore } from '@/store/memorialStore'
import { useMediaStore } from '@/store/mediaStore'
import useAuth from '@/auth/useAuth'

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
    favQuote: z.string().optional(),
    featuredVideoTitle: z
        .string()
        .min(1, { message: 'Video Title is required' }),
    featuredVideoDescription: z.string().optional(),
    favSaying: z.string().optional(),
    profilePicture: z.any().refine((val) => !!val, { 
        message: 'Profile Picture is required' 
    }),
    featuredVideo: z
        .any()
        .refine((val) => !!val, { message: 'Featured Video is required' }),
    galleryVideoTitle: z.string().optional(),
})

type FormSchema = z.infer<typeof validationSchema>

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
    const [videoData, setVideoData] = useState<any[]>([])
    const [uploadKey, setUploadKey] = useState(0)
    const { addMedia, getMedia, clearMedia, clearMediaItem } = useMediaStore()
    const [landingModeId, setLandingModeId] = useState<string>('')
    const [templateId, setTemplateId] = useState<string>('')
    const navigate = useNavigate()
    const location = useLocation()
    const { fetchMemorials, setActiveMemorialId } = useMemorialStore()
    const { user } = useAuth()
    const { mode, memorialId } = location.state || {}
    const [isEditMode, setIsEditMode] = useState(mode === 'edit')
    const [existingMemorialData, setExistingMemorialData] = useState<any>(null)
    const [deletedItem, setDeletedItem] = useState<any>(null)
    console.log(user);
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
            featuredVideoTitle: '',
            featuredVideoDescription: '',
            favSaying: '',
            galleryVideoTitle: '',
            profilePicture: undefined,
            featuredVideo: undefined,
        },
    })

    console.log(videoData, 'videoData')

    const genderOptions = [
        { value: Gender.MALE, label: 'Male' },
        { value: Gender.FEMALE, label: 'Female' },
        { value: Gender.PREFER_NOT_TO_SAY, label: 'Prefer not to say' },
    ]

    useEffect(() => {
        const fetchData = async () => {
            try {
                const templatesRes: any = await apiGetMemorialTemplateList()
                const videoTemplate = templatesRes.find(
                    (t: any) =>
                        t.landingMode?.landingModeType === 'video-only-mode',
                )

                if (videoTemplate) {
                    setTemplateId(videoTemplate.id)
                    setLandingModeId(videoTemplate.landingModeId)
                }

                if (isEditMode && memorialId) {
                    const memorialRes: any =
                        await apiGetMemorialById(memorialId)
                    if (memorialRes) {
                        setExistingMemorialData(memorialRes)

                        // Find featured video
                        const featuredVideo = memorialRes.userMedia?.find(
                            (m: any) => m.category === MediaCategory.FEATURED,
                        )

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
                            featuredVideoTitle: featuredVideo?.videoTitle || '',
                            
                            favSaying: featuredVideo?.videoDescription || '',
                            galleryVideoTitle:
                                memorialRes.userMedia?.find(
                                    (m: any) =>
                                        m.category === MediaCategory.GALLERY,
                                )?.videoTitle || '',
                            profilePicture:
                                memorialRes.personProfilePicture || undefined,
                            featuredVideo: featuredVideo?.fileURL || undefined,
                        })

                        if (memorialRes.personProfilePicture) {
                            setProfileImage(memorialRes.personProfilePicture)
                            setProfileData({
                                fileURL: memorialRes.personProfilePicture,
                                fileId: memorialRes.profilePictureId,
                                uploadId: memorialRes.profilePictureId,
                                mimeType: 'image/*',
                            })
                        }

                        if (memorialRes.userMedia) {
                            // Get the FIRST featured video only
                            if (featuredVideo) {
                                setFeaturedData({
                                    fileURL: featuredVideo.fileURL,
                                    mimeType: featuredVideo.mimeType,
                                    fileId: featuredVideo.fileId,
                                    uploadId: featuredVideo.uploadId,
                                    id: featuredVideo.id, // Important: preserve ID
                                    videoTitle:
                                        featuredVideo.videoTitle ||
                                        'Featured Video',
                                    videoDescription:
                                        featuredVideo.videoDescription || '',
                                })
                            }

                            // Get gallery videos
                            const gallery = memorialRes.userMedia
                                .filter(
                                    (m: any) =>
                                        m.category === MediaCategory.GALLERY,
                                )
                                .map((m: any) => ({
                                    file: {
                                        fileURL: m.fileURL,
                                        fileId: m.fileId,
                                        uploadId: m.uploadId,
                                        mimeType: m.mimeType,
                                        id: m.id, // Important: preserve ID
                                        videoTitle:
                                            m.videoTitle || 'Gallery Video',
                                    },
                                    res: m,
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
                results[index] = null // Don't use cached result
                filesToUpload.push(file)
                indicesToUpload.push(index)
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
            setValue('profilePicture', res[0].fileURL)
            if (res[0].uploadId) {
                addMedia(`profile_${res[0].uploadId}`, res[0])
            }
        }
        setUploadingProfile(false)
    }

    const birthDateValue = useWatch({ control, name: 'personBirthDate' as const });
    const today = new Date();
    
    const formatDateToInput = (date: Date | null | undefined): string | undefined => {
      if (!date) return undefined;
      return dayjs(date).format('YYYY-MM-DD');
    };
    
    const parseDateInput = (dateStr: string | undefined): Date | undefined => {
      if (!dateStr) return undefined;
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day); // Local timezone
    };

    const handleFeaturedVideoUpload = async (files: (File | any)[]) => {
        if (files.length === 0) {
            if (featuredData?.uploadId) {
                console.log('Attempting to delete featured video:', {
                    uploadId: featuredData.uploadId,
                    fileId: featuredData.fileId,
                })
                try {
                    await apiDeleteMedia(user?.userId ?? '', featuredData.uploadId)
                    if (featuredData.uploadId) {
                        const key = `featured_${featuredData.uploadId}`
                        clearMediaItem(key)
                    }

                    if (featuredData.originalFileName) {
                        const key = `${featuredData.originalFileName}-${featuredData.size || 0}`
                        clearMediaItem(key)
                    }

                    toast.push(
                        <Notification
                            type="success"
                            title="Success"
                            duration={2000}
                        >
                            Featured video deleted successfully!
                        </Notification>,
                        { placement: 'top-center' },
                    )
                } catch (error: any) {
                    console.error('Error deleting featured video:', error)
                    toast.push(
                        <Notification
                            type="danger"
                            title="Delete Failed"
                            duration={3000}
                        >
                            Failed to delete featured video:{' '}
                            {error?.response?.data?.message ||
                                error?.message ||
                                'Please try again'}
                        </Notification>,
                        { placement: 'top-center' },
                    )
                }
            }
            setFeaturedData(null)
            setDeletedItem(featuredData)
            setValue('featuredVideo', undefined)
            // setUploadKey((prev) => prev + 1)
            return
        }

        const file = files[0]
        if (!(file instanceof File) && file.fileURL) {
            setFeaturedData(file)
            setValue('featuredVideo', file.fileURL)
            return
        }
        if (isEditMode && featuredData?.id) {
            try {
                await apiDeleteMedia(user?.id,featuredData.uploadId)
            } catch (error) {
                console.error('Failed to delete old featured video', error)
            }
        }

        setUploadingFeatured(true)
        const res = await uploadFiles([file])

        if (res && res.length > 0) {
            // Don't preserve old ID for new uploads
            setFeaturedData({
                ...res[0],
                ...(isEditMode && deletedItem?.id
                    ? { id: deletedItem.id }
                    : {}),
                // id will be undefined for new uploads, which is correct
            })
            setValue('featuredVideo', res[0].fileURL)
            if (res[0].uploadId) {
                addMedia(`featured_${res[0].uploadId}`, res[0])
            }
        }
        setUploadingFeatured(false)
    }

    // const handleGalleryVideosUpload = async (files: (File | any)[]) => {
    //     // Detect removed existing videos
    //     const removedItems = videoData.filter(
    //         (item) =>
    //             !files.some(
    //                 (f) =>
    //                     !(f instanceof File) &&
    //                     (f.uploadId === item.res?.uploadId ||
    //                         f.fileId === item.res?.fileId),
    //             ),
    //     )

    //     // Delete removed videos
    //     for (const removed of removedItems) {
    //         console.log('Deleting removed video:', removed)
    //         const uploadId = removed.res?.uploadId
    //         const userId = removed.res?.userId
    //         if (uploadId) {
    //             try {
    //                 await apiDeleteMedia(userId, uploadId)
    //             } catch (error) {
    //                 console.error('Failed to delete gallery video', error)
    //             }
    //         }
    //     }

    //     // Keep existing ones
    //     const existingEntries = videoData.filter((item) =>
    //         files.some(
    //             (f) =>
    //                 !(f instanceof File) && f.uploadId === item.res?.uploadId,
    //         ),
    //     )

    //     // Upload new files
    //     const newFiles = files.filter((f) => f instanceof File) as File[]

    //     if (newFiles.length > 0) {
    //         setUploadingVideos(true)
    //         const res = await uploadFiles(newFiles)

    //         const newData = newFiles.map((file, i) => ({
    //             file,
    //             res: res[i],
    //             // No id field for new uploads
    //         }))

    //         setVideoData([...existingEntries, ...newData])
    //         setUploadingVideos(false)
    //     } else {
    //         setVideoData(existingEntries)
    //     }
    // }
const handleGalleryVideosUpload = async (files: (File | any)[]) => {
  const MAX_GALLERY_VIDEOS = 3
  
  // 1️⃣ Separate existing & new files
  const incomingExisting = files.filter(
    f => !(f instanceof File) && f.uploadId
  )
  const incomingNewFiles = files.filter(
    f => f instanceof File
  ) as File[]

  // 2️⃣ Keep existing videos user did NOT remove
  const keptExisting = videoData.filter(v =>
    incomingExisting.some(e => e.uploadId === v.res?.uploadId)
  )

  // 3️⃣ Detect removed videos
  const removedItems = videoData.filter(v =>
    !incomingExisting.some(e => e.uploadId === v.res?.uploadId)
  )

  // 4️⃣ Delete removed videos
  for (const item of removedItems) {
    if (item.res?.uploadId) {
      try {
        await apiDeleteMedia(item.res.userId, item.res.uploadId)
      } catch (error) {
        console.error('Failed to delete gallery video', error)
      }
    }
  }

  // 5️⃣ Enforce max limit BEFORE upload
  const remainingSlots = MAX_GALLERY_VIDEOS - keptExisting.length
  if (incomingNewFiles.length > remainingSlots) {
    toast.push(
      <Notification type="danger" title="Upload limit exceeded" duration={3000}>
        You can upload a maximum of 3 videos.
      </Notification>,
      { placement: 'top-center' }
    )
    // Update state with existing files only and force re-render
    setVideoData(keptExisting)
    setUploadKey(prev => prev + 1)
    return
  }

  // 6️⃣ Upload only allowed files
  let newlyUploaded: { file: File | any; res: any }[] = []
  if (incomingNewFiles.length > 0) {
    setUploadingVideos(true)
    try {
      const res = await uploadFiles(incomingNewFiles)
      newlyUploaded = incomingNewFiles
        .map((file, i) => {
          if (!res[i]) return null
          return {
            file: {
              name: res[i].originalFileName || file.name,
              size: res[i].size || file.size,
              type: res[i].mimeType || file.type,
              fileURL: res[i].fileURL,
              mimeType: res[i].mimeType || file.type,
              fileId: res[i].fileId,
              uploadId: res[i].uploadId,
            },
            res: res[i]
          }
        })
        .filter(Boolean) as { file: any; res: any }[]
    } catch (error) {
      console.error('Error uploading videos:', error)
      toast.push(
        <Notification type="danger" title="Upload Failed" duration={3000}>
          Failed to upload video(s). Please try again.
        </Notification>,
        { placement: 'top-center' }
      )
    } finally {
      setUploadingVideos(false)
    }
  }

  // 7️⃣ Merge & update state (ensure max 3)
  const finalVideos = [...keptExisting, ...newlyUploaded].slice(0, MAX_GALLERY_VIDEOS)
  setVideoData(finalVideos)
}

const handleGalleryVideoRemove = async (removedFiles: any | any[]) => {
    console.log(removedFiles, 'removedFiles')
  // Normalize to array
  const filesToRemove = Array.isArray(removedFiles) ? removedFiles : [removedFiles]

  for (const removedFile of filesToRemove) {
    const itemToRemove = videoData.find(
      (item) =>
        (removedFile.uploadId && removedFile.uploadId === item.res?.uploadId) ||
        (removedFile.fileId && removedFile.fileId === item.res?.fileId)
    )
    console.log(itemToRemove, 'itemToRemove')

    if (itemToRemove?.res?.uploadId) {
      try {
        await apiDeleteMedia(itemToRemove.res.userId, itemToRemove.res.uploadId)
        setVideoData((prev) =>
          prev.filter((item) => item.res?.uploadId !== itemToRemove.res?.uploadId)
        )
        toast.push(
          <Notification type="success" title="Deleted" duration={2000}>
            Video removed successfully.
          </Notification>,
          { placement: 'top-center' }
        )
      } catch (error) {
        console.error('Failed to delete gallery video', error)
        toast.push(
          <Notification type="danger" title="Error" duration={3000}>
            Failed to delete video.
          </Notification>,
          { placement: 'top-center' }
        )
      }
    }
  }
}
    const onSubmit = async (data: any) => {
        if (!profileData?.fileURL && !profileImage) {
            toast.push(
            <Notification
                type="danger"
                title="Validation Error"
                duration={3000}
            >
                Please upload a profile picture.
            </Notification>,
            { placement: 'top-center' }
            )
            setIsSubmitting(false)
            return
        }

        try {
            setIsSubmitting(true)

            const mediaList = [
                // Featured video
                ...(featuredData
                    ? [
                          {
                          
                              uploadId: featuredData.uploadId,
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
                // Gallery videos
                ...videoData.map((item, index: number) => {
                        return {
                         
                            uploadId: item.res?.uploadId || item.file?.uploadId,
                            mimeType:
                                item.res?.mimeType ||
                                (item.file instanceof File
                                    ? item.file.type
                                    : item.file.mimeType) ||
                                'video/mp4',
                            fileURL: item.res?.fileURL || item.file?.fileURL,
                            fileId: item.res?.fileId || item.file?.fileId,
                            type: MediaType.VIDEO,
                            category: MediaCategory.GALLERY,
                            videoTitle:
                                data.galleryVideoTitle || 'Gallery Video',
                            videoDescription: '',
                            isMainVideo: false,
                            isActive: true,
                            sortOrder: (featuredData ? 1 : 0) + index,
                        }
                    }),
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
                    profileData?.uploadId ||
                    (isEditMode
                        ? existingMemorialData?.profilePictureId
                        : null),
                pageURL: `${window.location.origin}/memorial/${data.personName
                    .toLowerCase()
                    .replace(/\s+/g, '-')}`,
                personProfilePicture:
                    profileData?.fileURL || profileImage || '',
                favQuote: data.favQuote,
                favSaying: data.favSaying,
                publishStatus: PublishStatus.DRAFT,
                userMedia: mediaList,
            }

            if (isEditMode && memorialId && existingMemorialData) {
                const {
                    id,
                    creatorId,
                    landingMode,
                    qrCode,
                    photos,
                    videos,
                    ...restExistingData
                } = existingMemorialData

                const updatePayload = {
                    ...restExistingData,
                    ...payload,
                }

                // Remove unwanted properties from updatePayload
                delete updatePayload.photos
                delete updatePayload.videos
                delete updatePayload.creatorId
                delete updatePayload.landingMode
                delete updatePayload.qrCode
                delete updatePayload.eventDuration
                delete updatePayload.eventStart
                delete updatePayload.lifeStoryText
                delete updatePayload.lifeStoryImageId
                delete updatePayload.lifeStoryImageURL
                delete updatePayload.featuredPhotoId
                delete updatePayload.featuredPhotoURL

                console.log(
                    'Update Payload:',
                    JSON.stringify(updatePayload, null, 2),
                )

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
         setIsSubmitting(true)
        handleSubmit(onSubmit)()
    }

    const handlePreview = () => {
        console.log('Preview clicked')
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

    return (
        <>
            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto ">
                    <div className="flex justify-between flex-col md:flex-row gap-2 items-center mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
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

                    <div className="flex flex-col items-center gap-5 mb-8">
                        <div className="flex items-center gap-8 bg-[#2f3349] w-full min-h-[180px] rounded-[14px] py-[20px] px-[30px]">
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
                            {/* <div className='flex flex-col gap-4'>
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
                                        : 'Upload Profile'}
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
                                        handleProfileUpload(file)
                                    } catch (error: any) {
                                        toast.push(
                                            <Notification
                                                type="danger"
                                                title="Invalid Image"
                                                duration={3000}
                                            >
                                                {error}
                                            </Notification>,
                                            { placement: 'top-center' }
                                        )
                                    } finally {
                                        // allow re-selecting same file again
                                        e.target.value = ''
                                    }
                                }}

                                />
                                    <p className='text-[#6A7282] text-[12px] font-[400] font-Arial'>Recommended: Square image, at least 400 x 400px</p>
                                    {!profileImage && isSubmitting && (
                                        <p className='text-[#e26253] text-[12px] font-[400] font-Arial mt-1'>
                                            Profile picture is required
                                        </p>
                                    )}
                            </div> */}
                            <div className='flex flex-col gap-4'>
                                <p className='text-[#FFFFFF] text-[18px] font-[400] font-Arial'>Profile Photo</p>
                                <p className='text-[#99A1AF] text-[14px] font-[400] font-Arial'>
                                    Upload a high-quality photo of your loved one. This will be the main photo displayed on the memorial page.
                                </p>
                                <button
                                    type="button"
                                    disabled={uploadingProfile}
                                    onClick={() => document.getElementById('profileUpload')?.click()}
                                    className="md:px-[21px] py-[7px] px-3 font-medium text-[16px] font-[400] w-[max-content] leading-[24.8px] tracking-normal text-center py-2.5 border text-[#FFB84C] rounded-[26px] font-Arial border-[#FFB84C] disabled:opacity-50"
                                >
                                    {uploadingProfile ? 'Uploading...' : 'Upload Profile'}
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
                                        handleProfileUpload(file)
                                    } catch (error: any) {
                                        toast.push(
                                        <Notification
                                            type="danger"
                                            title="Invalid Image"
                                            duration={3000}
                                        >
                                            {error}
                                        </Notification>,
                                        { placement: 'top-center' }
                                        )
                                        setValue('profilePicture', undefined)
                                    } finally {
                                        e.target.value = ''
                                    }
                                    }}
                                />
                                <p className='text-[#6A7282] text-[12px] font-[400] font-Arial'>Recommended: Square image, at least 400 x 400px</p>
                                
                                {/* Add this error message */}
                                {!profileImage && isSubmitting && (
                                    <p className='text-[#e26253] text-[12px] font-[400] font-Arial mt-1'>
                                    Profile picture is required
                                    </p>
                                )}
                                </div>

                        </div>

                        <div className="w-full bg-[#2f3349] rounded-lg p-6 shadow">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CommonInput
                                        name="personName"
                                        control={control}
                                        placeholder="Full Name"
                                        invalid={Boolean(errors.personName)}
                                        errorMessage={
                                            errors.personName?.message
                                        }
                                    />
                                    <CommonSelect
                                        name="personGender"
                                        control={control}
                                        options={genderOptions}
                                        placeholder="Gender"
                                        invalid={Boolean(errors.personGender)}
                                        errorMessage={
                                            errors.personGender?.message
                                        }
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CommonDatePicker
                                        name="personBirthDate"
                                        control={control}
                                        placeholder="Date of Birth"
                                        invalid={Boolean(
                                            errors.personBirthDate,
                                        )}
                                        errorMessage={
                                            errors.personBirthDate?.message
                                        }
                                        inputSuffix={
                                            <ChevronDown className="w-4 h-4 text-[#A1A1AA]" />
                                        }
                                         maxDate={today}
                                    rules={{
                                        required: "Date of Birth is required",
                                        validate: (value) => {
                                        if (new Date(value) > today) return "Birth date cannot be in the future";
                                        return true;
                                        }
                                    }}
                                    />
                                    <CommonDatePicker
                                        name="personDeathDate"
                                        control={control}
                                        placeholder="Date of Death"
                                        invalid={Boolean(
                                            errors.personDeathDate,
                                        )}
                                        errorMessage={
                                            errors.personDeathDate?.message
                                        }
                                        inputSuffix={
                                            <ChevronDown className="w-4 h-4 text-[#A1A1AA]" />
                                        }
                                          minDate={birthDateValue ? parseDateInput(formatDateToInput(birthDateValue)) : undefined}
                                    maxDate={today}
                                    rules={{
                                        required: "Date of Death is required",
                                        validate: (value) => {
                                        if (new Date(value) > today) return "Death date cannot be in the future";
                                        if (birthDateValue && new Date(value) < new Date(birthDateValue)) {
                                            return "Death date cannot be before birth date";
                                        }
                                        return true;
                                        }
                                    }}
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
                            key={`featured-${uploadKey}`}
                            accept="video/*"
                            uploadLimit={1}
                            onChange={handleFeaturedVideoUpload}
                            onFileRemove={() => handleFeaturedVideoUpload([])}
                            uploading={uploadingFeatured}
                            defaultFiles={
                                featuredData
                                    ? [
                                          {
                                              name:
                                                  featuredData.videoTitle ||
                                                  'Featured Video',
                                              size: featuredData.size || 0,
                                              type:
                                                  featuredData.mimeType ||
                                                  'video/mp4',
                                              fileURL: featuredData.fileURL,
                                              mimeType:
                                                  featuredData.mimeType ||
                                                  'video/mp4',
                                              fileId: featuredData.fileId,
                                              uploadId: featuredData.uploadId,
                                          },
                                      ]
                                    : []
                            }
                        />
                        {errors.featuredVideo && (
                            <p className="text-[#e26253] text-sm mt-2">
                                {(errors.featuredVideo as any).message}
                            </p>
                        )}
                        <div className="mt-4 flex w-full gap-6">
                            <div className="w-[50%]">
                                <CommonInput
                                    name="featuredVideoTitle"
                                    control={control}
                                    label="Video Title"
                                    placeholder="Enter title here..."
                                    invalid={Boolean(errors.featuredVideoTitle)}
                                    errorMessage={
                                        errors.featuredVideoTitle?.message
                                    }
                                />
                            </div>
                            <div className="w-[50%]">
                                <CommonInput
                                    name="featuredVideoDescription"
                                    control={control}
                                    label="Video Description"
                                    placeholder="Enter description here..."
                                    invalid={Boolean(errors.featuredVideoDescription)}
                                    errorMessage={
                                        errors.featuredVideoDescription?.message
                                    }
                                />
                            </div>
                        </div>
                        {/* <div className="mt-4">
                            <CommonInput
                                name="favSaying"
                                control={control}
                                label="Favorite Sayings (Optional)"
                                placeholder="Enter sayings here..."
                                invalid={Boolean(errors.favSaying)}
                                errorMessage={errors.favSaying?.message}
                            />
                        </div> */}
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
                            key={`gallery-${uploadKey}`} 
                            accept="video/*"
                            uploadLimit={3}
                            multiple
                            onChange={handleGalleryVideosUpload}
                            onFileRemove={(updatedFiles) => handleGalleryVideosUpload(updatedFiles)}
                            isPlusIconVisible={videoData.length > 0 ? true : false}
                            uploading={uploadingVideos}
                            defaultFiles={videoData.map((item) => ({
                                name:
                                    item.res?.videoTitle ||
                                    item.file?.name ||
                                    'Gallery Video',
                                size: item.res?.size || item.file?.size || 0,
                                type:
                                    item.res?.mimeType ||
                                    item.file?.type ||
                                    'video/mp4',
                                fileURL:
                                    item.res?.fileURL || item.file?.fileURL,
                                mimeType:
                                    item.res?.mimeType ||
                                    item.file?.mimeType ||
                                    'video/mp4',
                                fileId: item.res?.fileId || item.file?.fileId,
                                uploadId:
                                    item.res?.uploadId || item.file?.uploadId,
                            }))}
                        />
                        <div className='w-full flex mt-4 gap-6'>
                            <div className="w-[50%]">
                                <CommonInput
                                    name="galleryVideoTitle"
                                    control={control}
                                    label="Video Title"
                                    placeholder="Enter Video Title here ..."
                                />
                            </div>
                            <div className="w-[50%]">
                                <CommonInput
                                    name="galleryVideoDescription"
                                    control={control}
                                    label="Video Description"
                                    placeholder="Enter Video Description here ..."
                                />
                            </div>
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
