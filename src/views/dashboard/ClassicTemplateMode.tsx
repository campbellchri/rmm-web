import { useState, useEffect } from 'react'
import { ChevronDown, Calendar, ArrowLeft } from 'lucide-react'
import Upload from '@/components/ui/Upload'
import { useNavigate, useLocation } from 'react-router-dom'
import { CommonInput, CommonSelect, CommonDatePicker } from '@/components/shared'
import { toast, Notification } from '@/components/ui'
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
import { apiDeleteMedia, apiUploadMedia, apiDeleteGCPFile } from '@/services/MediaService'
import {
    MediaCategory,
    MediaType,
    PublishStatus,
    Gender,
} from '@/constants/memorial.constant'
import { useMemorialStore } from '@/store/memorialStore'
import { useMediaStore } from '@/store/mediaStore'
import useAuth from '@/auth/useAuth'
import SingleImageUpload from '@/components/ui/SingleImageUpload/SingleImageUpload'

const FormSection = ({
    title,
    children,
    className = '',
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
    featuredPhotoFavoriteSaying: z.string().optional(),
    favoriteSaying: z.string().optional(),
    quoteBy: z.string().optional(),
    // featuredPhoto: z.any().refine((val) => !!val, { message: 'Featured Photo is required' }),
    featuredPhoto: z.any().refine((val) => {
        return typeof val === 'string' || (val && (val.fileURL || val.url))
    }, { message: 'Featured Photo is required' }),
     videoUploaded: z
        .array(z.any())
        .refine((val) => val && val.length > 0 && val.some(v => v && (v.fileURL || v.uploadId)), 
            { message: 'At least one video is required' })
        .refine((val) => !val || val.length <= 6, 
            { message: 'You can upload up to 6 videos only' }),
      photoUploaded: z
        .array(z.any())
        .refine((val) => val && val.length > 0 && val.some(p => p && (p.fileURL || p.uploadId)), 
            { message: 'At least one photo is required' })
        .refine((val) => !val || val.length <= 6, 
            { message: 'You can upload up to 6 photos only' }),
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
    const { addMedia, getMedia, clearMedia, clearMediaItem } = useMediaStore()

    const [templateId, setTemplateId] = useState<string>('')
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useAuth()
    const { fetchMemorials, setActiveMemorialId } = useMemorialStore()
    const { mode, memorialId } = location.state || {}
    const [isEditMode, setIsEditMode] = useState(mode === 'edit')
    const [existingMemorialData, setExistingMemorialData] = useState<any>(null)
    const [featuredUploadKey, setFeaturedUploadKey] = useState(0)
    const [uploadKey, setUploadKey] = useState(0)

    const MAX_GALLERY_MEDIA = 6


    const {
        control,
        handleSubmit,
        reset,
        setValue,
        trigger,
        formState: { errors },
    } = useForm<FormSchema>({
        resolver: zodResolver(validationSchema),
        mode: 'onChange',
        defaultValues: {
            personName: '',
            personGender: '',
            personBirthDate: undefined,
            personDeathDate: undefined,
            favQuote: '',
            videoTitle: '',
            featuredPhotoFavoriteSaying: '',
            favoriteSaying: '',
            quoteBy: '',
            lifeStoryText: '',
            featuredPhoto: undefined,
            videoUploaded: [],
            photoUploaded: [],
            lifeStoryImage: undefined,
        },
    })

    const mapMediaToUploadFile = (m: any) => ({
        originalFileName: m.fileId?.split('/').pop() || 'media',
        size: 1, // non-zero required by Upload UI
        mimeType: m.type === MediaType.VIDEO ? 'video/mp4' : 'image/jpeg',
        fileURL: m.fileURL,
        uploadId: m.uploadId,
        fileId: m.fileId,
        status: 'done',
        percent: 100,
        type: m.type || MediaType.VIDEO,
        url: m.fileURL, 
    })

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
                            featuredPhotoFavoriteSaying: memorialRes.featuredPhotoFavoriteSaying || '',
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

                            })
                        }

                        if (memorialRes.lifeStoryImageURL) {
                            setLifeStoryData({
                                fileURL: memorialRes.lifeStoryImageURL,
                                fileId: memorialRes.lifeStoryImageId,
                            })
                        }

                        if (memorialRes.userMedia) {
                            const photos = memorialRes.userMedia
                                .filter(m => m.type === MediaType.PHOTO)
                                .map(m => ({
                                    file: mapMediaToUploadFile(m),
                                    res: m,
                                }))

                            const videos = memorialRes.userMedia
                                .filter(m => m.type === MediaType.VIDEO)
                                .map(m => ({
                                    file: mapMediaToUploadFile(m),
                                    res: m,
                                }))

                            setPhotosData(photos)
                            setVideoData(videos)

                            setValue('photoUploaded', photos.map(p => p.res))
                            setValue('videoUploaded', videos.map(v => v.res))
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

    const handleFeaturedPhotoUpload = async (files: (File | any)[] | null) => {
        if (!files || files.length === 0) {
            if (featuredData?.uploadId) {
                try {
                    await apiDeleteGCPFile(featuredData.uploadId)

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
                            Featured photo deleted successfully!
                        </Notification>,
                        { placement: 'top-center' },
                    )
                } catch (error: any) {
                    console.error('Error deleting featured photo:', error)
                    toast.push(
                        <Notification
                            type="danger"
                            title="Delete Failed"
                            duration={3000}
                        >
                            Failed to delete featured photo:{' '}
                            {error?.response?.data?.message ||
                                error?.message ||
                                'Please try again'}
                        </Notification>,
                        { placement: 'top-center' },
                    )
                }
            }

            setFeaturedData(null)
            setValue('featuredPhoto', undefined)
            await trigger('featuredPhoto')
            setFeaturedUploadKey(prev => prev + 1)
            return
        }

        const file = files[0]

        if (!(file instanceof File) && file.fileURL) {
            setFeaturedData(file)
            setValue('featuredPhoto', file.fileURL)
            await trigger('featuredPhoto')
            return
        }
        
        // ✅ ADD VALIDATION HERE
        try {
            await validateFeaturedImage(file, 1200, 800)
        } catch (err: any) {
            toast.push(
                <Notification type="danger" title="Invalid Featured Photo" duration={3000}>
                    {err}
                </Notification>,
                { placement: 'top-center' }
            )
            setFeaturedData(null)
            setValue('featuredPhoto', undefined)
            await trigger('featuredPhoto')
            setFeaturedUploadKey(prev => prev + 1)
            return
        }

        if (featuredData?.uploadId) {
            try {
                await apiDeleteGCPFile(featuredData.uploadId)
            } catch (error) {
                console.error('Failed to delete old featured photo', error)
            }
        }

        setUploadingFeatured(true)
        const res = await uploadFiles([file])

        if (res && res.length > 0) {
            setFeaturedData(res[0])
            setValue('featuredPhoto', res[0].fileURL)
            await trigger('featuredPhoto')

            if (res[0].uploadId) {
                addMedia(`featured_${res[0].uploadId}`, res[0])
            }
        }
        setUploadingFeatured(false)
    }

    const handleLifeStoryImageUpload = async (files: (File | any)[] | null) => {

        if (!files || files.length === 0) {
            if (lifeStoryData?.fileId) {
                try {
                    await apiDeleteGCPFile(lifeStoryData.fileId)
                    if (lifeStoryData.fileId) {
                        const key = `lifeStory_${lifeStoryData?.fileId}`
                        clearMediaItem(key)
                    }
                } catch (error) {
                    console.error('Error deleting life story image:', error)
                }
            }
            setLifeStoryData(null)
            setValue('lifeStoryImage', undefined)
            await trigger('lifeStoryImage')
            return
        }

        const file = files[0]
        if (!(file instanceof File)) {
            setLifeStoryData(file)
            setValue('lifeStoryImage', file.fileURL)
            await trigger('lifeStoryImage')
            return
        }

        setUploadingLifeStory(true)
        const res = await uploadFiles([file])
        if (res && res.length > 0) {
            setLifeStoryData(res[0])
            setValue('lifeStoryImage', res[0].fileURL)
            await trigger('lifeStoryImage')
        }
        setUploadingLifeStory(false)
    }


const handleGalleryPhotosUpload = async (files: (File | any)[]) => {
  // 1️⃣ Separate existing & new files
  const incomingExisting = files.filter(
    f => !(f instanceof File) && f.uploadId
  )
  const incomingNewFiles = files.filter(
    f => f instanceof File
  ) as File[]

  // 2️⃣ Keep existing photos user did NOT remove
  const keptExisting = photosData.filter(p =>
    incomingExisting.some(e => e.uploadId === p.res?.uploadId)
  )

  // 3️⃣ Detect removed photos
  const removedItems = photosData.filter(p =>
    !incomingExisting.some(e => e.uploadId === p.res?.uploadId)
  )

  // 4️⃣ Delete removed photos
  for (const item of removedItems) {
    if (item.res?.uploadId) {
      try {
        if (isEditMode) {
          await apiDeleteMedia(user?.userId ?? '', item.res.uploadId)
        } else {
          await apiDeleteGCPFile(item.res.uploadId)
        }
      } catch (err) {
        console.error('Error deleting photo:', err)
      }
    }
  }

  // 5️⃣ VALIDATE aspect ratios for new files FIRST
  const validationResults = await Promise.allSettled(
    incomingNewFiles.map(file => validateGalleryPhotoAspectRatio(file))
  )
  
  const invalidFiles: string[] = []
  const validFiles: File[] = []
  
  validationResults.forEach((result, index) => {
    if (result.status === 'rejected') {
      invalidFiles.push(incomingNewFiles[index].name)
    } else {
      validFiles.push(incomingNewFiles[index])
    }
  })

  // 6️⃣ If there are invalid files, show error and update state with ONLY valid files
  if (invalidFiles.length > 0) {
    toast.push(
      <Notification type="danger" title="Invalid Photo Aspect Ratio" duration={4000}>
        The following photo(s) must have a 3:2 or 16:9 aspect ratio: {invalidFiles.join(', ')}
      </Notification>,
      { placement: 'top-center' }
    )
  }

  // 7️⃣ Enforce max limit AFTER validation (using only valid files)
  const remainingSlots = MAX_GALLERY_MEDIA - keptExisting.length
  const allowedNewFiles = validFiles.slice(0, remainingSlots)
  
  if (allowedNewFiles.length < validFiles.length) {
    toast.push(
      <Notification type="danger" title="Upload limit exceeded" duration={3000}>
        You can upload a maximum of 6 photos.
      </Notification>,
      { placement: 'top-center' }
    )
  }

  // 8️⃣ Upload only valid files
  let newlyUploaded: { file: File; res: any }[] = []
  if (allowedNewFiles.length > 0) {
    setUploadingPhotos(true)
    const res = await uploadFiles(allowedNewFiles)
    newlyUploaded = allowedNewFiles
      .map((file, i) => res[i] ? { file, res: res[i] } : null)
      .filter(Boolean) as { file: File; res: any }[]
    setUploadingPhotos(false)
  }

  // 9️⃣ Merge & update state with ONLY valid files
  const finalPhotos = [...keptExisting, ...newlyUploaded]
  setPhotosData(finalPhotos)
  setValue('photoUploaded', finalPhotos.map(p => p.res))
  await trigger('photoUploaded')
  
  setUploadKey(prev => prev + 1)
}


const handleGalleryVideosUpload = async (files: (File | any)[]) => {
    console.log('📹 Video upload handler called with', files.length, 'files')
    
    // 1️⃣ Separate existing & new files
    const incomingExisting = files.filter(
        f => !(f instanceof File) && f.uploadId
    )

    const incomingNewFiles = files.filter(
        f => f instanceof File
    ) as File[]

    console.log('Existing:', incomingExisting.length, 'New:', incomingNewFiles.length)

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
                if (isEditMode) {
                    await apiDeleteMedia(user?.userId ?? '', item.res.uploadId)
                } else {
                    await apiDeleteGCPFile(item.res.uploadId)
                }
                console.log('✅ Deleted video:', item.res.uploadId)
            } catch (err) {
                console.error('❌ Error deleting video:', err)
            }
        }
    }

    // 5️⃣ Enforce max limit BEFORE upload
    const remainingSlots = MAX_GALLERY_MEDIA - keptExisting.length

    if (incomingNewFiles.length > remainingSlots) {
        console.warn('⚠️ Upload limit exceeded')
        
        toast.push(
            <Notification type="danger" title="Upload limit exceeded" duration={3000}>
                You can upload a maximum of 6 videos.
            </Notification>,
            { placement: 'top-center' }
        )
        
        setVideoData(keptExisting)
        setValue('videoUploaded', keptExisting.map(v => v.res))
        await trigger('videoUploaded')
        
        setUploadKey(prev => prev + 1)
        return
    }

    const allowedNewFiles = incomingNewFiles.slice(0, remainingSlots)

    let newlyUploaded: { file: File; res: any }[] = []

    if (allowedNewFiles.length > 0) {
        console.log('⬆️ Uploading', allowedNewFiles.length, 'videos...')
        setUploadingVideos(true)
        
        try {
            const res = await uploadFiles(allowedNewFiles)

            newlyUploaded = allowedNewFiles
                .map((file, i) => {
                    if (!res[i]) return null
                    
                    return {
                        file: {
                            originalFileName: res[i].originalFileName || file.name,
                            size: res[i].size || file.size,
                            mimeType: res[i].mimeType || file.type,
                            fileURL: res[i].fileURL,
                            uploadId: res[i].uploadId,
                            fileId: res[i].fileId,
                            status: 'done',
                            percent: 100,
                            url: res[i].fileURL, // For Upload preview
                        },
                        res: res[i]
                    }
                })
                .filter(Boolean) as { file: any; res: any }[]
            
            console.log('✅ Upload successful:', newlyUploaded.length, 'videos')
        } catch (error) {
            console.error('❌ Error uploading videos:', error)
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

    // 8️⃣ Merge & update state
    const finalVideos = [...keptExisting, ...newlyUploaded].slice(0, MAX_GALLERY_MEDIA)
    
    setVideoData(finalVideos)
    setValue('videoUploaded', finalVideos.map(v => v.res))
    await trigger('videoUploaded')
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
                featuredPhotoId: featuredData?.uploadId || null,
                featuredPhotoURL: featuredData?.fileURL || null,
                // featuredPhotoFavoriteSaying: data.featuredPhotoFavoriteSaying,
                lifeStoryText: data.lifeStoryText,
                lifeStoryImageId: lifeStoryData?.uploadId || null,
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
                            uploadId: item.res?.uploadId,
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
                            uploadId: item.res?.uploadId,
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

                // Remove unwanted properties from updatePayload
                delete updatePayload.isFeature

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
            clearMedia() 
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
    const onError = (errors: any) => {
        setIsSubmitting(false)
    }

    const handleSaveFinish = async () => {
        setIsSubmitting(true) 
         const isValid = await trigger() // This will re-validate all fields
    
            if (!isValid) {
                setIsSubmitting(false)
                return
            }
        handleSubmit(onSubmit, onError)()
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
        const validateFeaturedImage = (
        file: File,
        requiredWidth = 1200,
        requiredHeight = 800
        ): Promise<void> => {
            return new Promise((resolve, reject) => {
                const img = new Image()
                const url = URL.createObjectURL(file)

                img.onload = () => {
                    const { width, height } = img
                    URL.revokeObjectURL(url)

                    if (width !== requiredWidth || height !== requiredHeight) {
                        reject(
                            `Featured photo must be exactly ${requiredWidth} x ${requiredHeight}px`
                        )
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
    // Add this validation function after your existing validation functions
const validateGalleryPhotoAspectRatio = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const url = URL.createObjectURL(file)

        img.onload = () => {
            const { width, height } = img
            URL.revokeObjectURL(url)

            // Calculate aspect ratio
            const aspectRatio = width / height
            
            // Check for 3:2 ratio (1.5) with small tolerance
            const is3by2 = Math.abs(aspectRatio - 1.5) < 0.01
            
            // Check for 16:9 ratio (1.777...) with small tolerance
            const is16by9 = Math.abs(aspectRatio - (16/9)) < 0.01

            if (!is3by2 && !is16by9) {
                reject('Photo must have an aspect ratio of 3:2 or 16:9')
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

                        <div className="w-full bg-[#2f3349] rounded-lg p-6 shadow">
                            <div className="space-y-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CommonInput
                                        label='Full Name*'
                                        name="personName"
                                        control={control}
                                        placeholder="Full Name"
                                        invalid={Boolean(errors.personName)}
                                        errorMessage={errors.personName?.message}
                                    />
                                    <CommonSelect
                                        label='Gender'
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
                                    label='Date of Birth *'
                                    name="personBirthDate"
                                    control={control}
                                    placeholder="Date of Birth"
                                    invalid={Boolean(errors.personBirthDate)}
                                    errorMessage={errors.personBirthDate?.message}
                                    inputSuffix={<ChevronDown className="w-4 h-4 text-[#A1A1AA]" />}
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
                                    label='Date of Death *'
                                    name="personDeathDate"
                                    control={control}
                                    placeholder="Date of Death"
                                    invalid={Boolean(errors.personDeathDate)}
                                    errorMessage={errors.personDeathDate?.message}
                                    inputSuffix={<ChevronDown className="w-4 h-4 text-[#A1A1AA]" />}
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
                                    labelClassName="text-[#FFFFFF] text-[16px] font-[]"
                                    label="Write a Quote (Optional)"
                                    placeholder="Type here..."
                                    maxLength={150}
                                    rows={3}
                                    textArea
                                />
                            </div>
                        </div>
                    </div>

                    <FormSection
                        title={
                            <span className="font-poppins font-[500] md:text-[18px] text-base text-[#ffffff]">
                                Upload Featured Photo
                            </span>
                        }
                        className="mb-8"
                    >
                      
                        <SingleImageUpload
                            key={featuredUploadKey}
                            accept="image/*"
                            onChange={(file) => {
                                if (file) {
                                    handleFeaturedPhotoUpload([file])
                                } else {
                                    handleFeaturedPhotoUpload([])
                                }
                            }}
                            onFileRemove={() => {
                                handleFeaturedPhotoUpload([])
                                setValue('featuredPhoto', undefined)
                            }}
                            uploading={uploadingFeatured}
                            defaultFile={featuredData}
                        />

                        {errors.featuredPhoto && (
                            <p className="text-[#e26253] text-sm mt-2">{(errors.featuredPhoto as any).message}</p>
                        )}
                         <div className="my-4">
                            <CommonInput
                                name="featuredPhotoFavoriteSaying"
                                control={control}
                                label="Favorite Sayings (Optional)"
                                placeholder="Enter sayings here..."
                            />
                        </div>
                    </FormSection>
                        <div className='flex gap-4'>
                            <FormSection
                                title={
                                    <span className="font-poppins font-[500] md:text-[18px] text-base text-[#ffffff]">
                                        Memorial Video Gallery
                                    </span>
                                }
                                className="mb-8 w-[50%]"
                            >

                                <Upload
                                   key={isEditMode ? memorialId : 'create-videos' + uploadKey} 
                                    accept="video/*"
                                    uploadLimit={6}
                                    multiple
                                    onChange={handleGalleryVideosUpload}
                                    onFileRemove={handleGalleryVideosUpload}
                                    uploading={uploadingVideos}
                                    defaultFiles={videoData.map(v => v.file)}
                                    isPlusIconVisible={videoData.length > 0 ? true : false}
                                />

                                {errors.videoUploaded && (
                                    <p className="text-[#e26253] text-sm mt-2">{(errors.videoUploaded as any).message}</p>
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
                            <FormSection
                                title={
                                    <span className="font-poppins font-[500] md:text-[18px] text-base text-[#ffffff]">
                                        Photo Gallery
                                    </span>
                                }
                                className="mb-8 w-[50%]"
                            >
                                
                                <Upload
                                    key={isEditMode ? memorialId : 'create-photos' + uploadKey}
                                    accept="image/*"
                                    multiple
                                    onChange={handleGalleryPhotosUpload}
                                    uploading={uploadingPhotos}
                                    defaultFiles={photosData.map(p => p.file)}
                                    isPlusIconVisible={photosData.length > 0 ? true : false}
                                    uploadLimit={6}
                                />

                                {errors.photoUploaded && (
                                    <p className="text-[#e26253] text-sm mt-2">{(errors.photoUploaded as any).message}</p>
                                )}
                            </FormSection>
                        </div>

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
                            
                                <SingleImageUpload
                                    accept="image/*"
                                    onChange={(file) => {
                                        if (file) {
                                            handleLifeStoryImageUpload([file])
                                        } else {
                                            handleLifeStoryImageUpload([])
                                        }
                                    }}
                                    onFileRemove={() => {
                                        handleLifeStoryImageUpload([])
                                        setValue('featuredPhoto', undefined)
                                    }}
                                    uploading={uploadingLifeStory}
                                    defaultFile={lifeStoryData}
                                />
                                {errors.lifeStoryImage && (
                                    <p className="text-[#e26253] text-sm mt-2">{(errors.lifeStoryImage as any).message}</p>
                                )}
                            </div>
                            <div>
                                <CommonInput
                                    name="lifeStoryText"
                                    control={control}
                                    label="Life Story"
                                    textArea
                                    placeholder="Type here..."
                                    className='h-full bg-[#383c56] border-[#383c56] text-[#ffffff]'
                                    maxLength={500}
                                    rows={8}
                                    invalid={Boolean(errors.lifeStoryText)}
                                    errorMessage={errors.lifeStoryText?.message}
                                />
                            </div>
                        </div>
                    </FormSection>

                    <div className=" px-6 py-6 flex justify-between items-center rounded-lg shadow-sm">
                        <button
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
